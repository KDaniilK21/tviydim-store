const ORDER_ENDPOINT='/api/order';
let formStartedAt=Date.now();
function validCart(){return Store.getCart().filter(x=>{const p=Store.product(x.id);return p&&p.available!==false})}
function orderSummary(){
  const raw=Store.getCart(),cart=validCart(),el=document.querySelector('#orderSummary');
  if(!raw.length||cart.length!==raw.length){location.href='cart.html';return false}
  const total=cart.reduce((s,x)=>s+Store.product(x.id).price*x.qty,0);
  el.innerHTML=cart.map(x=>{const p=Store.product(x.id);return `<div class="sum-row"><span>${p.name} × ${x.qty}</span><strong>${Store.money(p.price*x.qty)}</strong></div>`}).join('')+`<div class="sum-row"><span>Доставка</span><span>за тарифами перевізника</span></div><div class="sum-row total"><span>Разом за товари</span><span>${Store.money(total)}</span></div>`;
  return true;
}
function normalizePhone(value){
  let d=String(value||'').replace(/\D/g,'');
  if(d.length===10&&d.startsWith('0'))d='38'+d;
  if(d.length===12&&d.startsWith('380'))return '+'+d;
  return null;
}
function showError(message){const el=document.querySelector('#formError');el.textContent=message;el.classList.add('show');el.scrollIntoView({behavior:'smooth',block:'center'})}
function clearError(){const el=document.querySelector('#formError');el.textContent='';el.classList.remove('show')}

document.addEventListener('DOMContentLoaded',()=>{
  if(!orderSummary())return;
  formStartedAt=Date.now();
  const form=document.querySelector('#checkoutForm'),button=document.querySelector('#submitOrder');
  form.addEventListener('submit',async e=>{
    e.preventDefault();clearError();
    if(!form.reportValidity())return;
    const phone=normalizePhone(form.phone.value);
    if(!phone){showError('Перевірте номер телефону. Вкажіть український номер у форматі +380…');form.phone.focus();return}
    const raw=Store.getCart(),cart=validCart();
    if(!cart.length||cart.length!==raw.length){location.href='cart.html';return}
    const fd=Object.fromEntries(new FormData(form).entries());
    const payload={
      customer:{name:fd.name.trim(),phone,city:fd.city.trim(),branch:fd.branch.trim(),delivery:fd.delivery,payment:fd.payment,comment:(fd.comment||'').trim()},
      items:cart.map(x=>({id:x.id,qty:x.qty})),
      utm:JSON.parse(localStorage.getItem('tviydim_utm')||'{}'),
      website:fd.website||'',
      form_started_at:formStartedAt
    };
    button.disabled=true;button.textContent='Надсилаємо…';
    try{
      const response=await fetch(ORDER_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify(payload)});
      let data={};try{data=await response.json()}catch(_e){}
      if(!response.ok||!data.ok)throw new Error(data.error||'Сервіс замовлень тимчасово недоступний.');
      Store.setCart([]);localStorage.setItem('tviydim_last_order',JSON.stringify({...payload,order_id:data.order_id,total:data.total,created_at:new Date().toISOString()}));
      document.querySelector('#checkoutLayout').style.display='none';
      document.querySelector('#success').style.display='block';
      document.querySelector('#orderId').textContent=data.order_id;
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(err){
      showError(err.message==='Failed to fetch'?'Не вдалося передати замовлення. Перевірте з’єднання та спробуйте ще раз.':err.message);
      button.disabled=false;button.textContent='Підтвердити замовлення';
    }
  });
});