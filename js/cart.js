function renderCart(){
  const cart=Store.getCart();
  const box=document.querySelector('#cartBox');
  if(!cart.length){
    box.innerHTML=`<div class="empty"><h2>Кошик порожній</h2><p>Додайте корисні речі з каталогу.</p><a class="btn btn-green" href="index.html#catalog">До товарів</a></div>`;
    return;
  }
  const rows=cart.map(item=>{
    const p=Store.product(item.id); if(!p)return '';
    const thumb=p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;padding:7px;display:block" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span>${p.emoji || '•'}</span>')">`
      : (p.emoji || '•');
    return `<div class="cart-item">
      <div class="cart-thumb">${thumb}</div>
      <div><h3>${p.name}</h3><small>${Store.money(p.price)} × ${item.qty}</small>
        <div class="qty" style="margin-top:8px;width:max-content">
          <button onclick="changeQty('${p.id}',${item.qty-1})">−</button>
          <input value="${item.qty}" readonly>
          <button onclick="changeQty('${p.id}',${item.qty+1})">+</button>
        </div>
      </div>
      <div class="cart-right"><strong>${Store.money(p.price*item.qty)}</strong><br><button class="remove" onclick="removeItem('${p.id}')">Видалити</button></div>
    </div>`
  }).join('');
  const total=cart.reduce((s,x)=>{const p=Store.product(x.id);return s+(p?p.price*x.qty:0)},0);
  box.innerHTML=`<div class="cart-layout"><div class="cart-list">${rows}</div>
  <aside class="summary"><h3>Ваше замовлення</h3>
    <div class="sum-row"><span>Товари</span><span>${Store.money(total)}</span></div>
    <div class="sum-row"><span>Доставка</span><span>за тарифами перевізника</span></div>
    <div class="sum-row total"><span>Разом</span><span>${Store.money(total)}</span></div>
    <a class="btn btn-green" style="width:100%;margin-top:10px" href="checkout.html">Оформити замовлення</a>
  </aside></div>`;
}
function changeQty(id,q){if(q<1)Store.remove(id);else Store.update(id,q);renderCart()}
function removeItem(id){Store.remove(id);renderCart()}
document.addEventListener('DOMContentLoaded',renderCart);
