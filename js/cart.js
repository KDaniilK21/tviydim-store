function renderCart(){
  const cart=Store.getCart();
  const box=document.querySelector('#cartBox');
  if(!cart.length){
    box.innerHTML=`<div class="empty"><h2>Кошик порожній</h2><p>Додайте корисні речі з каталогу.</p><a class="btn btn-green" href="index.html#catalog">До товарів</a></div>`;
    return;
  }
  let hasUnavailable=false;
  const rows=cart.map(item=>{
    const p=Store.product(item.id); if(!p)return '';
    const unavailable=p.available===false;
    if(unavailable)hasUnavailable=true;
    const src=(p.images&&p.images.length?p.images[0]:p.image)||null;
    const thumb=src
      ? `<img src="${src}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;padding:7px;display:block" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span>${p.emoji || '•'}</span>')">`
      : (p.emoji || '•');
    return `<div class="cart-item"${unavailable?' style="opacity:.7"':''}>
      <div class="cart-thumb">${thumb}</div>
      <div><h3>${p.name}</h3><small>${unavailable?'Немає в наявності':`${Store.money(p.price)} × ${item.qty}`}</small>
        ${unavailable?'':`<div class="qty" style="margin-top:8px;width:max-content">
          <button onclick="changeQty('${p.id}',${item.qty-1})">−</button>
          <input value="${item.qty}" readonly>
          <button onclick="changeQty('${p.id}',${item.qty+1})">+</button>
        </div>`}
      </div>
      <div class="cart-right">${unavailable?'<strong>Очікуємо</strong>':`<strong>${Store.money(p.price*item.qty)}</strong>`}<br><button class="remove" onclick="removeItem('${p.id}')">Видалити</button></div>
    </div>`
  }).join('');
  const total=cart.reduce((s,x)=>{const p=Store.product(x.id);return s+(p&&p.available!==false?p.price*x.qty:0)},0);
  const checkout=hasUnavailable
    ? `<div class="notice" style="margin-top:12px">У кошику є товар, якого зараз немає в наявності. Видаліть його перед оформленням.</div><button class="btn btn-green" style="width:100%;margin-top:10px;opacity:.5" disabled>Оформлення недоступне</button>`
    : `<a class="btn btn-green" style="width:100%;margin-top:10px" href="checkout.html">Оформити замовлення</a>`;
  box.innerHTML=`<div class="cart-layout"><div class="cart-list">${rows}</div>
  <aside class="summary"><h3>Ваше замовлення</h3>
    <div class="sum-row"><span>Доступні товари</span><span>${Store.money(total)}</span></div>
    <div class="sum-row"><span>Доставка</span><span>за тарифами перевізника</span></div>
    <div class="sum-row total"><span>Разом</span><span>${Store.money(total)}</span></div>
    ${checkout}
  </aside></div>`;
}
function changeQty(id,q){if(q<1)Store.remove(id);else Store.update(id,q);renderCart()}
function removeItem(id){Store.remove(id);renderCart()}
document.addEventListener('DOMContentLoaded',renderCart);
