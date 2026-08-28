const cats = {
  all:'Усі',
  kitchen:'Кухня',
  home:'Для дому',
  atmosphere:'Атмосфера'
};
let active='all';

function productMedia(p){
  if(!p.image) return p.emoji || '•';
  return `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:contain;padding:18px;display:block" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span>${p.emoji || '•'}</span>')">`;
}

function card(p){
  return `<article class="card">
    <a href="product.html?id=${p.id}" class="product-media">
      <span class="badge">${p.badge}</span>${productMedia(p)}
    </a>
    <div class="card-body">
      <a href="product.html?id=${p.id}" class="card-title">${p.name}</a>
      <div class="card-short">${p.short}</div>
      <div class="price-row"><span class="price">${Store.money(p.price)}</span></div>
      <div class="card-actions">
        <button class="btn-card" onclick="Store.add('${p.id}')">У кошик</button>
        <button class="btn-eye" onclick="location.href='product.html?id=${p.id}'">→</button>
      </div>
    </div>
  </article>`;
}

function render(){
  const base=active==='all'?PRODUCTS:PRODUCTS.filter(p=>p.category===active);
  const list=[...base].sort((a,b)=>(b.hero===true)-(a.hero===true));
  document.querySelector('#products').innerHTML=list.map(card).join('');
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.cat===active));
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('#filters').innerHTML=Object.entries(cats).map(([k,v])=>`<button class="filter" data-cat="${k}">${v}</button>`).join('');
  document.querySelector('#filters').addEventListener('click',e=>{if(e.target.dataset.cat){active=e.target.dataset.cat;render()}});
  render();
});
