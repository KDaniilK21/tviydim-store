document.addEventListener('DOMContentLoaded',()=>{
  const id=new URLSearchParams(location.search).get('id') || 'lint-remover';
  const p=Store.product(id);
  if(!p){location.href='index.html';return}
  document.title=p.name+' — Твій Дім';

  const style=document.createElement('style');
  style.textContent=`
    .product-gallery{display:grid;gap:12px}.gallery-main{aspect-ratio:1;border-radius:30px;background:#efeee9;border:1px solid var(--line);display:grid;place-items:center;overflow:hidden;position:relative}.gallery-main img{width:100%;height:100%;object-fit:contain;padding:24px;display:block}.gallery-fallback{width:150px;height:150px;border-radius:50%;background:var(--yellow);border:2px solid #111;display:grid;place-items:center;font-size:72px}.gallery-thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.gallery-thumb{aspect-ratio:1;border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden;padding:0;cursor:pointer}.gallery-thumb img{width:100%;height:100%;object-fit:contain;padding:6px;display:block}.gallery-thumb.active{border:3px solid var(--yellow);box-shadow:0 0 0 1px #111}.stock-unavailable{background:#111!important;color:#fff!important}.buy-disabled{background:#d7d6d0!important;color:#6d6d67!important;cursor:not-allowed!important}.gallery-note{font-size:11px;color:var(--muted);line-height:1.4}.product-source-note{margin-top:14px;font-size:11px;color:var(--muted)}
    @media(max-width:560px){.gallery-thumbs{grid-template-columns:repeat(5,1fr);gap:5px}.gallery-main{border-radius:22px}.gallery-main img{padding:14px}.gallery-fallback{width:110px;height:110px;font-size:54px}}
  `;
  document.head.appendChild(style);

  const imgs=(p.images&&p.images.length?p.images:(p.image?[p.image]:[])).slice(0,5);
  const fallback=`<span class="gallery-fallback">${p.emoji || '•'}</span>`;
  const main=imgs.length
    ? `<img id="galleryMainImage" src="${imgs[0]}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','${fallback.replace(/'/g,"&#39;")}')">`
    : fallback;
  const thumbs=imgs.length>1
    ? `<div class="gallery-thumbs">${imgs.map((src,i)=>`<button class="gallery-thumb${i===0?' active':''}" type="button" data-src="${src}" aria-label="Фото ${i+1}"><img src="${src}" alt="${p.name}, фото ${i+1}" loading="lazy"></button>`).join('')}</div>`
    : '';
  const unavailable=p.available===false;

  document.querySelector('#product').innerHTML=`
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-main">${main}</div>
        ${thumbs}
        ${imgs.length ? '<div class="gallery-note">Натисніть на мініатюру, щоб переглянути інше фото.</div>' : '<div class="gallery-note">Точне фото цієї моделі ще готуємо. Не підміняємо його схожим товаром.</div>'}
      </div>
      <div class="product-info">
        <div class="stock${unavailable?' stock-unavailable':''}">${unavailable ? '● Зараз немає в наявності' : '● Наявність підтверджуємо перед відправкою'}</div>
        <h1>${p.name}</h1>
        <p class="product-lead">${p.description}</p>
        <div class="product-price">${Store.money(p.price)}</div>
        <div class="features">${p.features.map(x=>`<div class="feature">✓ ${x}</div>`).join('')}</div>
        <div class="buy-row">
          <div class="qty"><button id="minus" ${unavailable?'disabled':''}>−</button><input id="qty" value="1" readonly><button id="plus" ${unavailable?'disabled':''}>+</button></div>
          <button class="btn btn-green${unavailable?' buy-disabled':''}" id="buy" ${unavailable?'disabled':''}>${unavailable?'Очікуємо надходження':'Додати до кошика'}</button>
        </div>
      </div>
    </div>`;

  document.querySelectorAll('.gallery-thumb').forEach(btn=>btn.addEventListener('click',()=>{
    const img=document.querySelector('#galleryMainImage');
    if(img){img.style.display='block';img.src=btn.dataset.src}
    document.querySelectorAll('.gallery-thumb').forEach(x=>x.classList.toggle('active',x===btn));
  }));

  if(!unavailable){
    let qty=1;
    const q=document.querySelector('#qty');
    document.querySelector('#minus').onclick=()=>{qty=Math.max(1,qty-1);q.value=qty};
    document.querySelector('#plus').onclick=()=>{qty++;q.value=qty};
    document.querySelector('#buy').onclick=()=>Store.add(p.id,qty);
  }
});
