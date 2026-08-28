const cats = {
  all:'Усі',
  hero:'Осінній топ',
  care:'Одяг і взуття',
  kitchen:'Кухня',
  cozy:'Затишок',
  auto:'Авто'
};
let active='all';

function productMedia(p){
  if(!p.image) return `<span class="product-fallback">${p.emoji || '•'}</span>`;
  return `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:contain;padding:18px;display:block" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span class=\'product-fallback\'>${p.emoji || '•'}</span>')">`;
}

function card(p){
  return `<article class="card${p.hero ? ' hero-card' : ''}">
    <a href="product.html?id=${p.id}" class="product-media">
      <span class="badge">${p.badge}</span>${productMedia(p)}
    </a>
    <div class="card-body">
      ${p.hero ? '<div class="season-label">AUTUMN / HERO</div>' : ''}
      <a href="product.html?id=${p.id}" class="card-title">${p.name}</a>
      <div class="card-short">${p.short}</div>
      <div class="price-row"><span class="price">${Store.money(p.price)}</span></div>
      <div class="card-actions">
        <button class="btn-card" onclick="Store.add('${p.id}')">У кошик</button>
        <button class="btn-eye" aria-label="Відкрити товар" onclick="location.href='product.html?id=${p.id}'">→</button>
      </div>
    </div>
  </article>`;
}

function matches(p){
  if(active==='all') return true;
  if(active==='hero') return p.hero===true;
  return p.category===active || (p.tags||[]).includes(active);
}

function render(){
  const list=PRODUCTS.filter(matches).sort((a,b)=>(b.hero===true)-(a.hero===true));
  document.querySelector('#products').innerHTML=list.map(card).join('');
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.cat===active));
}

document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    .product-fallback{width:118px;height:118px;border-radius:50%;background:var(--yellow);display:grid;place-items:center;font-size:54px;border:2px solid #111}
    .season-label{font-size:10px;font-weight:950;letter-spacing:.12em;margin-bottom:8px;color:#8a7210}
    @media(min-width:921px){
      #products.grid{grid-template-columns:repeat(12,1fr)}
      #products .card{grid-column:span 3}
      #products .card.hero-card{grid-column:span 4;border:2px solid #111}
      #products .hero-card .product-media{aspect-ratio:1.16/1;background:#fff7c9}
      #products .hero-card .card-title{font-size:20px}
      #products .hero-card .price{font-size:28px}
    }
    @media(min-width:561px) and (max-width:920px){
      #products.grid{grid-template-columns:repeat(6,1fr)}
      #products .card{grid-column:span 3}
      #products .card.hero-card{grid-column:span 2}
    }
  `;
  document.head.appendChild(style);
  document.querySelector('#filters').innerHTML=Object.entries(cats).map(([k,v])=>`<button class="filter" data-cat="${k}">${v}</button>`).join('');
  document.querySelector('#filters').addEventListener('click',e=>{if(e.target.dataset.cat){active=e.target.dataset.cat;render()}});
  render();
});
