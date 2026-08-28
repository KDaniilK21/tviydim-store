const cats={all:'Усі',hero:'Топ з відео',allseason:'Всесезонні',kitchen:'Кухня',care:'Догляд',cozy:'Для дому',auto:'Авто'};
const TOP_IDS=['magic-soap','telescopic-magnet','lint-remover'];
let active='all',query='',sortMode='recommended';

function isTop(p){return TOP_IDS.includes(p.id)}
function primaryImage(p){return (p.images&&p.images.length?p.images[0]:p.image)||null}
function productMedia(p){
  const img=primaryImage(p);
  if(!img)return `<span class="product-fallback">${p.emoji||'•'}</span>`;
  return `<img src="${img}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='grid'"><span class="product-fallback" style="display:none">${p.emoji||'•'}</span>`;
}
function displayBadge(p){
  if(isTop(p))return p.id==='magic-soap'?'Без дотику':p.id==='telescopic-magnet'?'WOW-інструмент':'До / після';
  return p.badge||'Корисне';
}
function card(p){
  const unavailable=p.available===false,top=isTop(p);
  const cartButton=unavailable?`<button class="btn-card unavailable-btn" disabled>Очікуємо</button>`:`<button class="btn-card" onclick="Store.add('${p.id}')">У кошик</button>`;
  return `<article class="card${top?' hero-card':''}${unavailable?' unavailable-card':''}">
    <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-media" aria-label="${p.name}">
      <span class="badge${unavailable?' badge-unavailable':''}">${unavailable?'Немає в наявності':displayBadge(p)}</span>${productMedia(p)}
    </a>
    <div class="card-body">
      ${top?'<div class="season-label">SHORTS / TOP</div>':''}
      <a href="product.html?id=${encodeURIComponent(p.id)}" class="card-title">${p.name}</a>
      <div class="card-short">${p.short}</div>
      <div class="price-row"><span class="price">${Store.money(p.price)}</span></div>
      <div class="card-actions">${cartButton}<button class="btn-eye" aria-label="Відкрити товар" onclick="location.href='product.html?id=${encodeURIComponent(p.id)}'">→</button></div>
    </div>
  </article>`;
}
function featuredCard(p,index){
  const src=primaryImage(p);
  return `<article class="featured-card">
    <div class="featured-index">0${index+1}</div>
    <a class="featured-media" href="product.html?id=${encodeURIComponent(p.id)}">${src?`<img src="${src}" alt="${p.name}" loading="eager" decoding="async" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span class=\"product-fallback\">${p.emoji||'•'}</span>')">`:`<span class="product-fallback">${p.emoji||'•'}</span>`}</a>
    <div class="featured-body">
      <div class="featured-tag">${displayBadge(p)}</div>
      <h3><a href="product.html?id=${encodeURIComponent(p.id)}">${p.name}</a></h3>
      <p>${p.short}</p>
      <div class="featured-bottom"><strong>${Store.money(p.price)}</strong><div class="featured-actions"><a href="product.html?id=${encodeURIComponent(p.id)}">Детальніше</a><button type="button" onclick="Store.add('${p.id}')">У кошик</button></div></div>
    </div>
  </article>`;
}
function matchesCategory(p){
  if(active==='all')return true;
  if(active==='hero')return isTop(p);
  if(active==='allseason')return (p.tags||[]).includes('allseason')||isTop(p);
  return p.category===active||(p.tags||[]).includes(active);
}
function matchesQuery(p){
  if(!query)return true;
  const hay=[p.name,p.short,p.description,p.category,...(p.tags||[]),...(p.features||[])].join(' ').toLocaleLowerCase('uk-UA');
  return hay.includes(query);
}
function sortProducts(list){
  const a=[...list];
  if(sortMode==='price-asc')return a.sort((x,y)=>x.price-y.price);
  if(sortMode==='price-desc')return a.sort((x,y)=>y.price-x.price);
  if(sortMode==='name')return a.sort((x,y)=>x.name.localeCompare(y.name,'uk'));
  return a.sort((x,y)=>Number(isTop(y))-Number(isTop(x)));
}
function syncUrl(){
  const u=new URL(location.href);
  active==='all'?u.searchParams.delete('cat'):u.searchParams.set('cat',active);
  query?u.searchParams.set('q',query):u.searchParams.delete('q');
  sortMode==='recommended'?u.searchParams.delete('sort'):u.searchParams.set('sort',sortMode);
  history.replaceState(null,'',u.pathname+(u.searchParams.toString()?`?${u.searchParams}`:'')+location.hash);
}
function render(){
  const list=sortProducts(PRODUCTS.filter(p=>matchesCategory(p)&&matchesQuery(p)));
  const root=document.querySelector('#products');
  root.innerHTML=list.length?list.map(card).join(''):`<div class="empty-results"><strong>Нічого не знайшли</strong><span>Спробуйте інший запит або відкрийте всі товари.</span><button type="button" class="btn btn-outline" id="resetCatalog">Показати все</button></div>`;
  document.querySelector('#resultCount').textContent=list.length;
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.cat===active));
  const reset=document.querySelector('#resetCatalog');if(reset)reset.onclick=()=>{active='all';query='';sortMode='recommended';document.querySelector('#productSearch').value='';document.querySelector('#productSort').value='recommended';syncUrl();render()};
}
function renderFeatured(){
  const root=document.querySelector('#featuredProducts');if(!root)return;
  const list=TOP_IDS.map(id=>PRODUCTS.find(p=>p.id===id)).filter(p=>p&&p.available!==false);
  root.innerHTML=list.map(featuredCard).join('');
}

document.addEventListener('DOMContentLoaded',()=>{
  const params=new URLSearchParams(location.search);
  const cat=params.get('cat'),q=params.get('q'),sort=params.get('sort');
  if(cat&&cats[cat])active=cat;
  if(q)query=q.trim().toLocaleLowerCase('uk-UA');
  if(['recommended','price-asc','price-desc','name'].includes(sort))sortMode=sort;

  document.querySelector('#filters').innerHTML=Object.entries(cats).map(([k,v])=>`<button class="filter" type="button" data-cat="${k}">${v}</button>`).join('');
  document.querySelector('#filters').addEventListener('click',e=>{if(e.target.dataset.cat){active=e.target.dataset.cat;syncUrl();render()}});
  const search=document.querySelector('#productSearch');
  search.value=query;
  search.addEventListener('input',()=>{query=search.value.trim().toLocaleLowerCase('uk-UA');syncUrl();render()});
  const sortEl=document.querySelector('#productSort');sortEl.value=sortMode;
  sortEl.addEventListener('change',e=>{sortMode=e.target.value;syncUrl();render()});
  renderFeatured();render();
});