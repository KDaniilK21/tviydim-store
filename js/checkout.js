function validCart(){
  const cart=Store.getCart();
  return cart.filter(x=>{const p=Store.product(x.id);return p&&p.available!==false});
}
function orderSummary(){
  const raw=Store.getCart(), cart=validCart(), el=document.querySelector('#orderSummary');
  if(!raw.length||cart.length!==raw.length){location.href='cart.html';return false}
  const total=cart.reduce((s,x)=>s+Store.product(x.id).price*x.qty,0);
  el.innerHTML=cart.map(x=>{const p=Store.product(x.id);return `<div class="sum-row"><span>${p.name} × ${x.qty}</span><strong>${Store.money(p.price*x.qty)}</strong></div>`}).join('')
    +`<div class="sum-row total"><span>Разом</span><span>${Store.money(total)}</span></div>`;
  return true;
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!orderSummary())return;
  const form=document.querySelector('#checkoutForm');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const raw=Store.getCart(), cart=validCart();
    if(!cart.length||cart.length!==raw.length){location.href='cart.html';return}
    const total=cart.reduce((s,x)=>s+Store.product(x.id).price*x.qty,0);
    const fd=Object.fromEntries(new FormData(form).entries());
    const utm=JSON.parse(localStorage.getItem('tviydim_utm')||'{}');
    const order={
      order_id:'TD-'+Date.now().toString().slice(-8),
      created_at:new Date().toISOString(),
      customer:fd,
      items:cart.map(x=>({id:x.id,name:Store.product(x.id).name,price:Store.product(x.id).price,qty:x.qty})),
      total,utm
    };
    localStorage.setItem('tviydim_last_order',JSON.stringify(order));
    Store.setCart([]);
    form.style.display='none';
    document.querySelector('#success').style.display='block';
    document.querySelector('#orderId').textContent=order.order_id;
    window.scrollTo({top:0,behavior:'smooth'});
  });
});
