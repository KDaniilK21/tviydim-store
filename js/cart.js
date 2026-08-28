function cartRecommendations(cart){
  const ids=new Set(cart.map(x=>x.id));
  const inCartProducts=cart.map(x=>Store.product(x.id)).filter(Boolean);
  return PRODUCTS.filter(p=>p.available!==false&&!ids.has(p.id)).map(p=>{
    const affinity=inCartProducts.reduce((score,x)=>score+Number(p.category===x.category)+(p.tags||[]).filter(t=>(x.tags||[]).includes(t)).length,0);
    const topBonus=['magic-soap','telescopic-magnet','lint-remover'].includes(p.id)?2:0;
    return {p,score:affinity+topBonus};
  }).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.p);
}
function recMedia(p){
  const src=(p.images&&p.images.length?p.images[0]:p.image)||'';
  return src?`<img src="${src}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${p.emoji||'•'}'">`:(p.emoji||'•');
}
function renderCart(){
  const cart=Store.getCart();
  const box=document.querySelector('#cartBox');
  if(!cart.length){
    box.innerHTML=`<div class="empty"><h2>Кошик порожній</h2><p>Додайте корисні речі з каталогу.</p><a class="btn btn-green" href="index.html#featured">Дивитися топ-3</a></div>`;
    return;
  }
  let hasUnavailable=false;
  const rows=cart.map(item=>{
    const p=Store.product(item.id); if(!p)return '';
    const unavailable=p.available===false;
    if(unavailable)hasUnavailable=true;
    const src=(p.images&&p.images.length?p.images[0]:p.image)||null;
    const thumb=src?`<img src="${src}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span>${p.emoji||'•'}</span>')">`:(p.emoji||'•');
    return `<div class="cart-item"${unavailable?' style="opacity:.7"':''}>
      <a class="cart-thumb" href="product.html?id=${encodeURIComponent(p.id)}">${thumb}</a>
      <div><h3><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3><small>${unavailable?'Немає в наявності':`${Store.money(p.price)} × ${item.qty}`}</small>
        ${unavailable?'':`<div class="qty" style="margin-top:8px;width:max-content"><button aria-label="Зменшити" onclick="changeQty('${p.id}',${item.qty-1})">−</button><input value="${item.qty}" readonly aria-label="Кількість"><button aria-label="Збільшити" onclick="changeQty('${p.id}',${item.qty+1})">+</button></div>`}
      </div>
      <div class="cart-right">${unavailable?'<strong>Очікуємо</strong>':`<strong>${Store.money(p.price*item.qty)}</strong>`}<br><button class="remove" onclick="removeItem('${p.id}')">Видалити</button></div>
    </div>`;
  }).join('');
  const total=cart.reduce((s,x)=>{const p=Store.product(x.id);return s+(p&&p.available!==false?p.price*x.qty:0)},0);
  const checkout=hasUnavailable?`<div class="notice" style="margin-top:12px">У кошику є товар, якого зараз немає в наявності. Видаліть його перед оформленням.</div><button class="btn btn-green" style="width:100%;margin-top:10px;opacity:.5" disabled>Оформлення недоступне</button>`:`<a class="btn btn-green checkout-main-btn" href="checkout.html">Оформити замовлення</a>`;
  const recs=cartRecommendations(cart);
  const recHtml=recs.length?`<section class="cart-recommend"><div class="cart-recommend-head"><div><span>МОЖЕ ЗНАДОБИТИСЯ</span><h2>Додайте до замовлення</h2></div><a href="index.html#catalog">Увесь каталог →</a></div><div class="cart-rec-grid">${recs.map(p=>`<article class="cart-rec"><a class="cart-rec-media" href="product.html?id=${encodeURIComponent(p.id)}">${recMedia(p)}</a><div><a class="cart-rec-title" href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a><strong>${Store.money(p.price)}</strong><button type="button" onclick="Store.add('${p.id}');renderCart()">+ Додати</button></div></article>`).join('')}</div></section>`:'';
  box.innerHTML=`<div class="cart-layout"><div class="cart-list">${rows}<a class="continue-shopping" href="index.html#catalog">← Продовжити покупки</a></div><aside class="summary"><div class="summary-kicker">ВАШЕ ЗАМОВЛЕННЯ</div><h3>${cart.reduce((s,x)=>s+x.qty,0)} товар(и)</h3><div class="sum-row"><span>Товари</span><span>${Store.money(total)}</span></div><div class="sum-row"><span>Доставка</span><span>за тарифами перевізника</span></div><div class="sum-row total"><span>Разом за товари</span><span>${Store.money(total)}</span></div>${checkout}<div class="summary-safe">✓ Банківські дані на сайті не вводяться</div></aside></div>${recHtml}`;
}
function changeQty(id,q){if(q<1)Store.remove(id);else Store.update(id,Math.min(10,q));renderCart()}
function removeItem(id){Store.remove(id);renderCart()}
document.addEventListener('DOMContentLoaded',renderCart);