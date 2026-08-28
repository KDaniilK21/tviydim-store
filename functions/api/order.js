const CATALOG={
  'lint-remover':{name:'Машинка від катишків Lint Remover YX-5880',price:289},
  'shoe-dryer':{name:'Сушарка для взуття Shoe Dryer LSF-006',price:499},
  'huggle-hoodie':{name:'Плед-толстовка Huggle Hoodie',price:399},
  'freshpack':{name:'Вакууматор Freshpack Pro',price:399},
  'magic-soap':{name:'Сенсорний дозатор Magic Soap 300 мл',price:299},
  'saturn-humidifier':{name:'Зволожувач-проектор «Зоряне небо»',price:349},
  'oil-sprayer':{name:'Розпилювач для олії Benson Big 200 мл',price:199},
  'telescopic-magnet':{name:'Телескопічний магніт з LED-підсвічуванням 19–80 см',price:249},
  'magio-mg210':{name:'Гравітаційний млин для спецій Magio MG-210',price:429},
  'car-fan':{name:'Автомобільний обігрівач CAR FAN CF-702',price:299}
};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const clean=(v,max=200)=>String(v??'').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max);
function phone(v){let d=String(v??'').replace(/\D/g,'');if(d.length===10&&d.startsWith('0'))d='38'+d;return /^380\d{9}$/.test(d)?'+'+d:null}
function makeId(){const d=new Date(),date=d.toISOString().slice(0,10).replaceAll('-','');const rand=crypto.randomUUID().slice(0,8).toUpperCase();return `TD-${date}-${rand}`}
function safeUtm(value){if(!value||typeof value!=='object')return '{}';const out={};for(const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','landing'])if(value[k])out[k]=clean(value[k],120);return JSON.stringify(out)}
async function sendTelegram(env,order){
  if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return false;
  const lines=[`Нове замовлення ${order.id}`,`Сума: ${order.total} грн`,`Ім’я: ${order.name}`,`Телефон: ${order.phone}`,`Місто: ${order.city}`,`Відділення: ${order.branch}`,'',...order.items.map(x=>`• ${x.name} × ${x.qty} — ${x.price*x.qty} грн`)];
  if(order.comment)lines.push('',`Коментар: ${order.comment}`);
  const r=await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:lines.join('\n'),disable_web_page_preview:true})});
  return r.ok;
}
export async function onRequestPost(context){
  const {request,env}=context;
  const len=Number(request.headers.get('content-length')||0);if(len>30000)return json({ok:false,error:'Занадто великий запит.'},413);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'Некоректний формат замовлення.'},400)}
  if(clean(body.website,100))return json({ok:true,order_id:'accepted'},200);
  const started=Number(body.form_started_at||0);if(started&&Date.now()-started<1200)return json({ok:false,error:'Спробуйте оформити замовлення ще раз.'},429);
  const c=body.customer||{},name=clean(c.name,80),normalizedPhone=phone(c.phone),city=clean(c.city,80),branch=clean(c.branch,120),comment=clean(c.comment,500),delivery=clean(c.delivery,30),payment=clean(c.payment,30);
  if(name.length<2||!normalizedPhone||city.length<2||branch.length<1)return json({ok:false,error:'Перевірте контактні дані та адресу доставки.'},400);
  if(delivery!=='nova_poshta'||payment!=='cod')return json({ok:false,error:'Непідтримуваний спосіб доставки або оплати.'},400);
  if(!Array.isArray(body.items)||body.items.length<1||body.items.length>20)return json({ok:false,error:'Кошик порожній або містить забагато позицій.'},400);
  const items=[];for(const raw of body.items){const p=CATALOG[clean(raw.id,60)],qty=Number(raw.qty);if(!p||!Number.isInteger(qty)||qty<1||qty>10)return json({ok:false,error:'У кошику є некоректний товар або кількість.'},400);items.push({id:clean(raw.id,60),name:p.name,price:p.price,qty})}
  const total=items.reduce((s,x)=>s+x.price*x.qty,0),id=makeId(),created=new Date().toISOString(),utm=safeUtm(body.utm),ua=clean(request.headers.get('user-agent'),300);
  const order={id,created,name,phone:normalizedPhone,city,branch,delivery,payment,comment,total,items,utm,ua};
  let persisted=false;
  if(env.DB){
    try{
      const statements=[env.DB.prepare('INSERT INTO orders (id,created_at,customer_name,phone,city,branch,delivery,payment,comment,total,utm_json,user_agent,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,created,name,normalizedPhone,city,branch,delivery,payment,comment,total,utm,ua,'new'),...items.map(x=>env.DB.prepare('INSERT INTO order_items (order_id,product_id,product_name,price,qty) VALUES (?,?,?,?,?)').bind(id,x.id,x.name,x.price,x.qty))];
      await env.DB.batch(statements);persisted=true;
    }catch(err){console.error('D1 order save failed',err)}
  }
  if(env.TELEGRAM_BOT_TOKEN&&env.TELEGRAM_CHAT_ID){try{if(await sendTelegram(env,order))persisted=true}catch(err){console.error('Telegram notification failed',err)}}
  if(!persisted)return json({ok:false,error:'Приймання замовлень ще не активоване. Спробуйте трохи пізніше.'},503);
  return json({ok:true,order_id:id,total},201);
}
export function onRequest(){return json({ok:false,error:'Method not allowed'},405)}