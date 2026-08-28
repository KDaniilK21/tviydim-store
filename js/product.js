document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id') || 'lint-remover';
  const p=Store.product(id);
  if(!p){location.href='index.html';return}
  document.title=p.name+' — Твій Дім';
  const media=p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;padding:30px;display:block" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span style=\'font-size:120px\'>${p.emoji || '•'}</span>')">`
    : `<span style="font-size:120px">${p.emoji || '•'}</span>`;
  document.querySelector('#product').innerHTML=`
    <div class="product-layout">
      <div class="product-big-media">${media}</div>
      <div class="product-info">
        <div class="stock">● Наявність підтверджуємо перед відправкою</div>
        <h1>${p.name}</h1>
        <p class="product-lead">${p.description}</p>
        <div class="product-price">${Store.money(p.price)}</div>
        <div class="features">${p.features.map(x=>`<div class="feature">✓ ${x}</div>`).join('')}</div>
        <div class="buy-row">
          <div class="qty"><button id="minus">−</button><input id="qty" value="1" readonly><button id="plus">+</button></div>
          <button class="btn btn-green" id="buy">Додати до кошика</button>
        </div>
      </div>
    </div>`;
  let qty=1;
  const q=document.querySelector('#qty');
  document.querySelector('#minus').onclick=()=>{qty=Math.max(1,qty-1);q.value=qty};
  document.querySelector('#plus').onclick=()=>{qty++;q.value=qty};
  document.querySelector('#buy').onclick=()=>Store.add(p.id,qty);
});
