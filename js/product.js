document.addEventListener('DOMContentLoaded',()=>{
  const TOP_IDS=['magic-soap','telescopic-magnet','lint-remover'];
  const id=new URLSearchParams(location.search).get('id')||TOP_IDS[0];
  const p=Store.product(id);
  if(!p){location.href='index.html#catalog';return}

  document.title=`${p.name} — Твій Дім`;
  let meta=document.querySelector('meta[name="description"]');
  if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}
  meta.content=p.short||p.description;

  const imgs=(p.images&&p.images.length?p.images:(p.image?[p.image]:[])).slice(0,5);
  const unavailable=p.available===false;
  const fallback=`<span class="gallery-fallback"${imgs.length?' style="display:none"':''}>${p.emoji||'•'}</span>`;
  const main=imgs.length?`<img id="galleryMainImage" src="${imgs[0]}" alt="${p.name}" decoding="async" onerror="this.style.display='none';const f=this.parentElement.querySelector('.gallery-fallback');if(f)f.style.display='grid'">${fallback}`:fallback;
  const thumbs=imgs.length>1?`<div class="gallery-thumbs">${imgs.map((src,i)=>`<button class="gallery-thumb${i===0?' active':''}" type="button" data-src="${src}" aria-label="Фото ${i+1}"><img src="${src}" alt="${p.name}, фото ${i+1}" loading="lazy"></button>`).join('')}</div>`:'';

  const related=PRODUCTS.filter(x=>x.id!==p.id&&x.available!==false).sort((a,b)=>{
    const ac=Number(a.category===p.category)+(a.tags||[]).filter(t=>(p.tags||[]).includes(t)).length;
    const bc=Number(b.category===p.category)+(b.tags||[]).filter(t=>(p.tags||[]).includes(t)).length;
    return bc-ac;
  }).slice(0,3);
  const relatedHtml=related.map(x=>{
    const src=(x.images&&x.images.length?x.images[0]:x.image)||'';
    return `<a class="related-card" href="product.html?id=${encodeURIComponent(x.id)}"><div class="related-media">${src?`<img src="${src}" alt="${x.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${x.emoji||'•'}'">`:x.emoji||'•'}</div><div><div class="related-title">${x.name}</div><div class="related-price">${Store.money(x.price)}</div></div></a>`;
  }).join('');

  document.querySelector('#product').innerHTML=`
    <div class="product-layout">
      <div class="product-gallery">
        <div class="gallery-main">${main}</div>
        ${thumbs}
        ${imgs.length>1?'<div class="gallery-note">Натисніть на мініатюру, щоб переглянути інше фото.</div>':''}
      </div>
      <div class="product-info">
        <div class="stock${unavailable?' stock-unavailable':''}">${unavailable?'● Зараз немає в наявності':'<span class="status-dot"></span> Наявність підтверджуємо перед відправкою'}</div>
        <h1>${p.name}</h1>
        <p class="product-lead">${p.description}</p>
        <div class="product-price">${Store.money(p.price)}</div>
        <div class="features">${(p.features||[]).map(x=>`<div class="feature">✓ ${x}</div>`).join('')}</div>
        <div class="product-assurance"><div class="assurance-item">📦 Нова пошта по Україні</div><div class="assurance-item">₴ Післяплата при отриманні</div><div class="assurance-item">✓ Перевірка наявності</div></div>
        <div class="buy-row"><div class="qty"><button id="minus" aria-label="Зменшити кількість" ${unavailable?'disabled':''}>−</button><input id="qty" value="1" readonly aria-label="Кількість"><button id="plus" aria-label="Збільшити кількість" ${unavailable?'disabled':''}>+</button></div><button class="btn btn-green${unavailable?' buy-disabled':''}" id="buy" ${unavailable?'disabled':''}>${unavailable?'Очікуємо надходження':'Додати до кошика'}</button></div>
        <button class="share-button" id="shareProduct" type="button">Поділитися товаром ↗</button>
      </div>
    </div>
    <div class="product-extra">
      <article class="product-extra-card"><h3>Чому це корисно</h3><p>${p.short}. Саме такий ефект легко оцінити ще до покупки — у короткому відео або на фото.</p></article>
      <article class="product-extra-card"><h3>Доставка та оплата</h3><p>Відправлення Новою поштою. Вартість доставки — за тарифами перевізника. На старті магазину оплата відбувається при отриманні.</p></article>
    </div>
    ${relatedHtml?`<section class="related-section"><h2>Може знадобитися</h2><div class="related-grid">${relatedHtml}</div></section>`:''}
    ${unavailable?'':`<div class="mobile-buy"><div><small>${p.name}</small><br><strong>${Store.money(p.price)}</strong></div><button type="button" id="mobileBuy">У кошик</button></div>`}
  `;

  const style=document.createElement('style');
  style.textContent=`.product-gallery{display:grid;gap:12px}.gallery-main{aspect-ratio:1;border-radius:30px;background:#efeee9;border:1px solid var(--line);display:grid;place-items:center;overflow:hidden}.gallery-main img{width:100%;height:100%;object-fit:contain;padding:24px}.gallery-fallback{width:150px;height:150px;border-radius:50%;background:var(--yellow);border:2px solid #111;display:grid;place-items:center;font-size:72px}.gallery-thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.gallery-thumb{aspect-ratio:1;border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden;padding:0;cursor:pointer}.gallery-thumb img{width:100%;height:100%;object-fit:contain;padding:6px}.gallery-thumb.active{border:3px solid var(--yellow);box-shadow:0 0 0 1px #111}.gallery-note{font-size:11px;color:var(--muted)}.stock-unavailable{background:#111!important;color:#fff!important}.buy-disabled{background:#d7d6d0!important;color:#6d6d67!important;cursor:not-allowed!important}.share-button{margin-top:12px;border:0;background:transparent;text-decoration:underline;text-underline-offset:4px;font-weight:800;cursor:pointer;padding:6px 0}@media(max-width:560px){.gallery-thumbs{gap:5px}.gallery-main{border-radius:22px}.gallery-main img{padding:14px}.gallery-fallback{width:110px;height:110px;font-size:54px}}`;
  document.head.appendChild(style);

  document.querySelectorAll('.gallery-thumb').forEach(btn=>btn.addEventListener('click',()=>{
    const img=document.querySelector('#galleryMainImage'),f=document.querySelector('.gallery-main .gallery-fallback');
    if(f)f.style.display='none';if(img){img.style.display='block';img.src=btn.dataset.src}
    document.querySelectorAll('.gallery-thumb').forEach(x=>x.classList.toggle('active',x===btn));
  }));

  if(!unavailable){
    let qty=1;const q=document.querySelector('#qty');
    document.querySelector('#minus').onclick=()=>{qty=Math.max(1,qty-1);q.value=qty};
    document.querySelector('#plus').onclick=()=>{qty=Math.min(10,qty+1);q.value=qty};
    const addNow=()=>Store.add(p.id,qty);
    document.querySelector('#buy').onclick=addNow;
    const mobile=document.querySelector('#mobileBuy');if(mobile)mobile.onclick=addNow;
  }

  document.querySelector('#shareProduct').onclick=async()=>{
    const data={title:p.name,text:p.short,url:location.href};
    try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);Store.toast('Посилання скопійовано')}}catch(e){}
  };

  const schema={"@context":"https://schema.org","@type":"Product",name:p.name,description:p.description,image:imgs,offers:{"@type":"Offer",priceCurrency:"UAH",price:String(p.price),availability:unavailable?"https://schema.org/OutOfStock":"https://schema.org/InStock",seller:{"@type":"Organization",name:"Твій Дім"}}};
  const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify(schema);document.head.appendChild(ld);
});