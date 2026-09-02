
(()=>{
 const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
 const btn=$('[data-menu]'), drawer=$('#drawer');
 if(btn&&drawer){btn.addEventListener('click',()=>{const o=!drawer.classList.contains('open');drawer.classList.toggle('open',o);btn.textContent=o?'×':'☰';btn.setAttribute('aria-expanded',String(o));}); $$('#drawer a').forEach(a=>a.addEventListener('click',()=>{drawer.classList.remove('open');btn.textContent='☰';btn.setAttribute('aria-expanded','false')}));}
 const q=$('#serviceSearch'), filterBtns=$$('[data-filter]'), cards=$$('[data-service]');
 function apply(){if(!cards.length)return;const text=(q?.value||'').trim().toLowerCase();const active=$('[data-filter].active')?.dataset.filter||'Все';cards.forEach(c=>{const okText=!text||c.dataset.search.includes(text);const okCat=active==='Все'||c.dataset.category===active;c.hidden=!(okText&&okCat)});}
 q?.addEventListener('input',apply);filterBtns.forEach(b=>b.addEventListener('click',()=>{filterBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');apply()}));
})();
