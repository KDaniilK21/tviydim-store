document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id') || 'cb3142';
  const p=Store.product(id);
  if(!p){location.href='index.html';return}
  document.title=p.name+' — Твій Дім';
  document.querySelector('#product').innerHTML=`
    <div class="product-layout">
      <div class="product-big-media">${p.emoji}</div>
      <div class="product-info">
        <div class="stock">● В наявності</div>
        <h1>${p.name}</h1>
        <p class="product-lead">${p.description}</p>
        <div class="product-price">${Store.money(p.price)} <span class="old-price">${Store.money(p.oldPrice)}</span></div>
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
