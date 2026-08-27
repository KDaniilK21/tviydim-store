window.Store = {
  getCart(){
    try{return JSON.parse(localStorage.getItem('tviydim_cart')||'[]')}catch(e){return[]}
  },
  setCart(cart){
    localStorage.setItem('tviydim_cart',JSON.stringify(cart));
    this.updateCartCount();
  },
  add(id, qty=1){
    const cart=this.getCart();
    const item=cart.find(x=>x.id===id);
    if(item)item.qty+=qty; else cart.push({id,qty});
    this.setCart(cart);
    this.toast('Товар додано до кошика');
  },
  remove(id){
    this.setCart(this.getCart().filter(x=>x.id!==id));
  },
  update(id,qty){
    const cart=this.getCart();
    const item=cart.find(x=>x.id===id);
    if(item){item.qty=Math.max(1,qty);this.setCart(cart)}
  },
  product(id){return (window.PRODUCTS||[]).find(p=>p.id===id)},
  money(v){return new Intl.NumberFormat('uk-UA').format(v)+' ₴'},
  updateCartCount(){
    const count=this.getCart().reduce((s,x)=>s+x.qty,0);
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count);
  },
  toast(text){
    let t=document.querySelector('.toast');
    if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
    t.textContent=text;t.classList.add('show');
    clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1800)
  },
  captureUtm(){
    const q=new URLSearchParams(location.search);
    const keys=['utm_source','utm_medium','utm_campaign','utm_content'];
    const data={};
    keys.forEach(k=>{if(q.get(k))data[k]=q.get(k)});
    if(Object.keys(data).length)localStorage.setItem('tviydim_utm',JSON.stringify({...data,landing:location.pathname,ts:Date.now()}))
  }
};
document.addEventListener('DOMContentLoaded',()=>{Store.updateCartCount();Store.captureUtm()});
