(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root&&root.document){root.OperaBuilder=api;api.init(root.document,root);}
})(typeof window!=='undefined'?window:null,function(){
  const FIN={
    laminate:['Ламинирование','◐','Защитное покрытие'],round:['Скругление углов','⌜','Аккуратный радиус'],emboss:['Конгрев / тиснение','✦','Декоративный акцент'],crease:['Биговка','╱','Линия сгиба'],fold:['Фальцовка','≋','Сгибы изделия'],perforation:['Перфорация','⋮','Линия отрыва'],plotter:['Фигурная / плоттерная резка','✂','Резка по контуру'],holes:['Сверление отверстий','○','Под подвес или крепление'],collect:['Листоподбор','☷','Сборка страниц'],thermo:['Упаковка в термоплёнку','▱','Финишная упаковка']
  };
  const PRODUCTS={
    businessCards:{name:'Визитки',hint:'Плотные бумаги, дизайнерские материалы и пластик. Декоративная отделка — по задаче.',sizes:['90 × 50 мм','85 × 55 мм','Свой размер'],papers:['Мелованный картон','Дизайнерская бумага','Пластик'],densities:['250 г/м²','300 г/м²','350 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['laminate','round','emboss','plotter'],clear:true,pages:false,bindings:[]},
    leaflets:{name:'Листовки / флаеры',hint:'Для листовок основное — формат, тираж, бумага и цветность.',sizes:['A6 · 105 × 148 мм','A5 · 148 × 210 мм','A4 · 210 × 297 мм','A3 · 297 × 420 мм','Свой размер'],papers:['Мелованная бумага','Офсетная бумага','Дизайнерская бумага'],densities:['90 г/м²','115 г/м²','130 г/м²','150 г/м²','170 г/м²','200 г/м²','250 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['laminate','perforation','crease','fold'],clear:true,pages:false,bindings:[]},
    posters:{name:'Плакаты',hint:'Небольшие и срочные плакаты на цифровом оборудовании.',sizes:['A3 · 297 × 420 мм','A4 · 210 × 297 мм','Свой размер'],papers:['Мелованная бумага','Дизайнерская бумага'],densities:['130 г/м²','150 г/м²','170 г/м²','200 г/м²'],sides:['4+0 · одна сторона'],finishes:['laminate'],clear:true,pages:false,bindings:[]},
    postcards:{name:'Открытки / приглашения',hint:'Плотная бумага и декоративная обработка. Для сгиба на плотном материале используйте биговку.',sizes:['A6 · 105 × 148 мм','A5 · 148 × 210 мм','100 × 200 мм','Свой размер'],papers:['Мелованный картон','Дизайнерская бумага'],densities:['250 г/м²','300 г/м²','350 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['laminate','crease','fold','round','emboss'],clear:true,pages:false,bindings:[]},
    certificates:{name:'Дипломы / грамоты / сертификаты',hint:'Подходит персонализация, нумерация и декоративная отделка.',sizes:['A4 · 210 × 297 мм','A5 · 148 × 210 мм','Свой размер'],papers:['Мелованный картон','Дизайнерская бумага'],densities:['200 г/м²','250 г/м²','300 г/м²','350 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['laminate','emboss','round'],clear:true,pages:false,bindings:[]},
    booklets:{name:'Буклеты',hint:'Для буклета важны сгибы; плотные материалы обычно требуют биговки.',sizes:['A4 → евробуклет','A4 → A5','A3 → A4','Свой размер'],papers:['Мелованная бумага','Дизайнерская бумага'],densities:['115 г/м²','130 г/м²','150 г/м²','170 г/м²','200 г/м²','250 г/м²'],sides:['4+4 · две стороны','4+0 · одна сторона'],finishes:['fold','crease','laminate','perforation'],clear:true,pages:false,bindings:[]},
    catalogs:{name:'Каталоги / брошюры',hint:'Укажите страницы и способ скрепления — это ключевые параметры многостраничной продукции.',sizes:['A5 · 148 × 210 мм','A4 · 210 × 297 мм','210 × 210 мм','Свой размер'],papers:['Мелованная бумага','Офсетная бумага','Дизайнерская бумага'],densities:['90 г/м²','115 г/м²','130 г/м²','150 г/м²','170 г/м²','200 г/м²'],sides:['4+4 · две стороны','4+0 · одна сторона'],finishes:['collect','laminate','holes','thermo'],clear:true,pages:true,bindings:['Сшивка на скрепку','Навивка на пружину','Мягкий переплёт','Скрепление на болты']},
    forms:{name:'Бланки / конверты',hint:'Фирменная документация: формат, бумага, тираж и при необходимости переменные данные.',sizes:['A4 · 210 × 297 мм','A5 · 148 × 210 мм','Конверт · подобрать формат','Свой размер'],papers:['Офсетная бумага','Мелованная бумага','Дизайнерская бумага'],densities:['80 г/м²','100 г/м²','120 г/м²','130 г/м²'],sides:['4+0 · одна сторона','1+0 · ч/б'],finishes:[],clear:false,pages:false,bindings:[]},
    folders:{name:'Папки',hint:'Плотный картон, биговка и фигурная резка — базовая логика папки.',sizes:['Папка под A4','Папка под A5','Свой размер'],papers:['Мелованный картон','Дизайнерский картон'],densities:['300 г/м²','350 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['crease','plotter','laminate','emboss'],clear:true,pages:false,bindings:[]},
    notepads:{name:'Кубарики',hint:'Укажите размер, бумагу и количество экземпляров.',sizes:['90 × 90 мм','100 × 100 мм','Свой размер'],papers:['Офсетная бумага','Мелованная бумага'],densities:['80 г/м²','100 г/м²'],sides:['4+0 · одна сторона','1+0 · ч/б'],finishes:['thermo'],clear:false,pages:false,bindings:[]},
    menus:{name:'Меню / тейбл-тенты',hint:'Для заведений важны прочность и удобная сборка: ламинация, биговка, пружина или болты.',sizes:['A5 · 148 × 210 мм','A4 · 210 × 297 мм','210 × 210 мм','Свой размер'],papers:['Мелованная бумага / картон','Дизайнерская бумага','Пластик'],densities:['200 г/м²','250 г/м²','300 г/м²','350 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['laminate','crease','fold','round','holes'],clear:true,pages:false,bindings:['Без скрепления','Навивка на пружину','Скрепление на болты']},
    tags:{name:'Бирки / воблеры',hint:'Для нестандартной формы используйте фигурную резку; отверстия и ламинация включаются отдельно.',sizes:['50 × 90 мм','70 × 100 мм','Свой размер'],papers:['Мелованный картон','Дизайнерская бумага','Пластик'],densities:['250 г/м²','300 г/м²','350 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['plotter','holes','laminate','round'],clear:true,pages:false,bindings:[]},
    stickers:{name:'Наклейки / этикетки',hint:'Самоклеящаяся бумага или плёнка, прямоугольная либо фигурная резка.',sizes:['50 × 50 мм','90 × 50 мм','A6 · 105 × 148 мм','Свой размер'],papers:['Самоклеящаяся бумага','Самоклеящаяся плёнка'],densities:['По материалу'],sides:['4+0 · лицевая печать'],finishes:['plotter','laminate'],clear:false,pages:false,bindings:[]},
    books:{name:'Книги / фотоальбомы',hint:'Формат, количество страниц, бумага блока и переплёт.',sizes:['A5 · 148 × 210 мм','A4 · 210 × 297 мм','210 × 210 мм','Свой размер'],papers:['Офсетная бумага','Мелованная бумага','Фотобумага / подобрать'],densities:['80 г/м²','100 г/м²','120 г/м²','130 г/м²','150 г/м²'],sides:['4+4 · две стороны','1+1 · ч/б с двух сторон'],finishes:['collect','laminate','thermo'],clear:false,pages:true,bindings:['Твёрдый переплёт','Мягкий переплёт','Навивка на пружину']},
    calendars:{name:'Календари',hint:'Конструкция зависит от типа календаря; для настенных вариантов обычно нужны пружина и отверстие.',sizes:['Настенный A3','Настенный A4','Настольный домик','Карманный','Свой размер'],papers:['Мелованная бумага / картон','Дизайнерская бумага'],densities:['170 г/м²','200 г/м²','250 г/м²','300 г/м²'],sides:['4+0 · одна сторона','4+4 · две стороны'],finishes:['holes','laminate','collect'],clear:true,pages:false,bindings:['Без скрепления','Навивка на пружину']}
  };
  const FEATURED=['businessCards','leaflets','catalogs','stickers','menus','books','calendars'];
  const SUMMARY_NEXT_HINTS=['Перейдите к размеру и тиражу.','Проверьте размер и тираж, затем продолжите.','Уточните материал и печать.','Добавьте отделку и контакт.'];
  const CARD_META={
    businessCards:['▣','Визитки','для контактов и встреч'],
    leaflets:['▤','Листовки / флаеры','для рекламы и раздачи'],
    catalogs:['☷','Каталоги / брошюры','многостраничная печать'],
    stickers:['◉','Наклейки / этикетки','бумага или плёнка'],
    menus:['≡','Меню / тейбл-тенты','для кафе и магазинов'],
    books:['▥','Книги / фотоальбомы','блок и переплёт'],
    calendars:['□','Календари','настенные и настольные']
  };
  let runtime=null;

  const toNumber=value=>Number(String(value??'').replace(',','.'));
  const isValidDimension=value=>Number.isFinite(toNumber(value))&&toNumber(value)>0;
  const isValidQuantity=value=>isValidDimension(value)&&Number.isInteger(toNumber(value));
  const isValidPages=value=>Number.isInteger(toNumber(value))&&toNumber(value)>=4&&toNumber(value)%2===0;
  const isValidEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(value||'').trim());
  const isValidPhone=value=>String(value||'').replace(/\D/g,'').length>=6;
  const isPastDate=(value,todayISO)=>Boolean(value&&todayISO&&String(value)<String(todayISO));
  const isCustomSize=value=>String(value||'').trim()==='Свой размер';
  const customSizeText=(width,height)=>isValidDimension(width)&&isValidDimension(height)?`${toNumber(width)} × ${toNumber(height)} мм`:'Свой размер';
  const canVisitStep=(target,furthest)=>Number.isInteger(Number(target))&&Number(target)>=0&&Number(target)<=Number(furthest);

  function validateStepData(index,data={}){
    const errors=[];
    if(index===0){if(!data.product) errors.push('Выберите изделие.');}
    if(index===1){
      if(!data.size) errors.push('Выберите формат.');
      if(!isValidQuantity(data.qty)) errors.push('Укажите тираж больше нуля.');
      if(isCustomSize(data.size)&&(!isValidDimension(data.customWidth)||!isValidDimension(data.customHeight))) errors.push('Укажите ширину и высоту своего размера.');
      if(data.pagesRequired&&!isValidPages(data.pages)) errors.push('Количество страниц должно быть чётным и не меньше 4.');
    }
    if(index===2){
      if(!data.paper) errors.push('Выберите материал.');
      if(!data.side) errors.push('Выберите вариант печати.');
    }
    if(index===3){
      if(!String(data.name||'').trim()) errors.push('Укажите имя.');
      const phone=String(data.phone||'').trim(),email=String(data.email||'').trim();
      if(!phone&&!email) errors.push('Укажите телефон или e-mail.');
      if(phone&&!isValidPhone(phone)) errors.push('Проверьте номер телефона.');
      if(email&&!isValidEmail(email)) errors.push('Проверьте e-mail.');
      if(data.desiredDate&&isPastDate(data.desiredDate,data.todayISO)) errors.push('Желаемый срок не может быть в прошлом.');
      if(String(data.delivery||'').startsWith('Курьер')&&!String(data.address||'').trim()) errors.push('Укажите адрес доставки.');
    }
    return {ok:errors.length===0,errors};
  }

  function init(doc,win){
    const $=s=>doc.querySelector(s),$$=s=>Array.from(doc.querySelectorAll(s));
    const state={product:'businessCards',side:'',prepress:'Макет готов',delivery:'Самовывоз',binding:'',variable:false,clearToner:false,finishes:new Set(),file:null};
    const todayISO=()=>{const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;};
    const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const setOpts=(el,arr)=>{if(el) el.innerHTML=arr.map(x=>`<option>${esc(x)}</option>`).join('');};

    function stageData(index){
      const p=PRODUCTS[state.product];
      if(index===0) return {product:state.product};
      if(index===1) return {size:$('#size')?.value,qty:$('#qty')?.value,customWidth:$('#customWidth')?.value,customHeight:$('#customHeight')?.value,pagesRequired:Boolean(p.pages),pages:$('#pages')?.value};
      if(index===2) return {paper:$('#paper')?.value,side:state.side};
      return {name:$('#name')?.value,phone:$('#phone')?.value,email:$('#email')?.value,desiredDate:$('#desiredDate')?.value,todayISO:todayISO(),delivery:state.delivery,address:$('#address')?.value};
    }

    function focusForStage(index,errors){
      let selector=null;
      const text=errors.join(' ');
      if(index===1){
        if(/тираж/i.test(text)) selector='#qty';
        else if(/ширину|высоту/i.test(text)) selector='#customWidth';
        else if(/страниц/i.test(text)) selector='#pages';
        else selector='#size';
      }else if(index===2) selector='#paper';
      else if(index===3){
        if(/имя/i.test(text)) selector='#name';
        else if(/телефон/i.test(text)) selector='#phone';
        else if(/e-mail/i.test(text)) selector='#email';
        else if(/прошлом/i.test(text)) selector='#desiredDate';
        else if(/адрес/i.test(text)) selector='#address';
      }
      const target=selector?$(selector):null;
      target&&target.focus({preventScroll:true});
    }

    function validateStage(index,show=false){
      const result=validateStepData(index,stageData(index));
      const stage=$$('[data-builder-stage]')[index];
      const box=stage?.querySelector('[data-stage-error]');
      if(box){box.hidden=result.ok;box.innerHTML=result.ok?'':`<b>Проверьте данные:</b><br>${result.errors.map(esc).join('<br>')}`;}
      if(show&&!result.ok) focusForStage(index,result.errors);
      return result.ok;
    }

    function firstInvalidStage(){for(let i=0;i<4;i++) if(!validateStepData(i,stageData(i)).ok) return i;return -1;}
    function allErrors(){const out=[];for(let i=0;i<4;i++) out.push(...validateStepData(i,stageData(i)).errors);return out;}

    function renderProductButtons(){
      const grid=$('#productGrid'),other=$('#otherProduct');
      if(grid){grid.innerHTML=FEATURED.map(k=>{const meta=CARD_META[k]||['•',PRODUCTS[k].name,PRODUCTS[k].hint];return `<button type="button" class="product" data-product="${k}"><span class="product-mark" aria-hidden="true">${meta[0]}</span><span class="product-copy"><b>${esc(meta[1])}</b><small>${esc(meta[2])}</small></span><span class="product-check" aria-hidden="true">✓</span></button>`;}).join('');}
      if(other){other.innerHTML='<option value="">Другая продукция из каталога</option>'+Object.keys(PRODUCTS).filter(k=>!FEATURED.includes(k)).map(k=>`<option value="${k}">${esc(PRODUCTS[k].name)}</option>`).join('');}
      $$('.product').forEach(b=>b.addEventListener('click',()=>selectProduct(b.dataset.product,true)));
      if(other) other.addEventListener('change',()=>{if(other.value)selectProduct(other.value,false);});
    }

    function bindSides(){
      $$('#printSide .pill').forEach(b=>b.addEventListener('click',()=>{if(b.disabled)return;$$('#printSide .pill').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.side=b.dataset.side;update();}));
    }
    function bindBindings(){
      $$('#bindings .pill').forEach(b=>b.addEventListener('click',()=>{$$('#bindings .pill').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.binding=b.dataset.binding;update();}));
    }
    function bindFinishes(){
      $$('#finishes .finish').forEach(card=>card.addEventListener('click',e=>{e.preventDefault();const cb=card.querySelector('input');cb.checked=!cb.checked;card.classList.toggle('checked',cb.checked);if(cb.checked)state.finishes.add(cb.value);else state.finishes.delete(cb.value);update();}));
    }

    function syncCustomSize(){const panel=$('#customSizeFields');panel?.classList.toggle('is-hidden',!isCustomSize($('#size')?.value));update();}
    function syncQtyPresets(){const value=String(Math.max(0,toNumber($('#qty')?.value)||0));$$('[data-qty-preset]').forEach(btn=>btn.classList.toggle('active',btn.dataset.qtyPreset===value));}

    function renderProduct(){
      const p=PRODUCTS[state.product];
      $('#productHint').textContent=p.hint;
      setOpts($('#size'),p.sizes);setOpts($('#paper'),p.papers);setOpts($('#density'),p.densities);
      $('#pagesField')?.classList.toggle('is-hidden',!p.pages);$('#sumPagesRow')?.classList.toggle('is-hidden',!p.pages);
      if($('#paperLabel')) $('#paperLabel').textContent=state.product==='stickers'?'Основа':'Материал';
      $('#clearTonerPanel')?.classList.toggle('is-hidden',!p.clear);
      if(!p.clear){state.clearToner=false;$('#clearTonerToggle')?.setAttribute('aria-pressed','false');}
      if($('#printSide')) $('#printSide').innerHTML=p.sides.map((x,i)=>`<button type="button" class="pill${i===0?' active':''}" data-side="${esc(x)}">${esc(x)}</button>`).join('');
      state.side=p.sides[0]||'';bindSides();state.finishes.clear();
      if($('#finishes')) $('#finishes').innerHTML=p.finishes.length?p.finishes.map(k=>`<label class="finish"><input type="checkbox" value="${esc(FIN[k][0])}"><div class="glyph">${FIN[k][1]}</div><b>${esc(FIN[k][0])}</b><span>${esc(FIN[k][2])}</span></label>`).join(''):'<div class="notice">Для этого изделия базовая заявка не требует постпечатной обработки. Нестандартную обработку можно описать в комментарии.</div>';
      bindFinishes();$('#bindingField')?.classList.toggle('is-hidden',!p.bindings.length);
      if($('#bindings')) $('#bindings').innerHTML=p.bindings.map((x,i)=>`<button type="button" class="pill${i===0?' active':''}" data-binding="${esc(x)}">${esc(x)}</button>`).join('');
      state.binding=p.bindings[0]||'';bindBindings();syncCustomSize();applyCompatibility();update();
    }

    function selectProduct(k,fromGrid){
      if(!PRODUCTS[k]) return;
      state.product=k;
      $$('.product').forEach(b=>b.classList.toggle('active',fromGrid&&b.dataset.product===k));
      if(fromGrid&&$('#otherProduct')) $('#otherProduct').value='';
      if(!fromGrid) $$('.product').forEach(b=>b.classList.remove('active'));
      renderProduct();
    }

    function applyCompatibility(){
      const warn=$('#compatWarning');if(warn)warn.hidden=true;
      const d=$('#density')?.value||'';const duplex=$$('#printSide .pill').find(b=>/4\+4|две стороны/i.test(b.dataset.side));
      if(duplex){const blocked=/350/.test(d);duplex.disabled=blocked;if(blocked){if(duplex.classList.contains('active')){const fallback=$$('#printSide .pill').find(x=>!x.disabled);$$('#printSide .pill').forEach(x=>x.classList.remove('active'));fallback?.classList.add('active');state.side=fallback?.dataset.side||state.side;}if(warn){warn.hidden=false;warn.textContent='Для плотности 350 г/м² двустороннюю печать лучше подтвердить с менеджером. Оставили доступный вариант, чтобы не обещать неподходящую технологию.';}}}
      update();
    }

    function finishText(){const a=[...state.finishes];if(state.binding&&state.binding!=='Без скрепления')a.unshift(state.binding);if(state.variable)a.push('Переменные данные / нумерация');if(state.clearToner)a.push('Прозрачный тонер');return a.length?a.join(', '):'без дополнительной обработки';}
    function sizeText(){return isCustomSize($('#size')?.value)?customSizeText($('#customWidth')?.value,$('#customHeight')?.value):($('#size')?.value||'—');}
    function contactText(){const phone=$('#phone')?.value.trim()||'',email=$('#email')?.value.trim()||'';return [phone,email].filter(Boolean).join(' · ')||'не указан';}

    function managerText(){
      const p=PRODUCTS[state.product];
      return `Новая заявка · ${p.name}\nФормат: ${sizeText()}\nТираж: ${$('#qty')?.value||'—'} шт.${p.pages?`\nСтраниц: ${$('#pages')?.value||'—'}`:''}\nМатериал: ${$('#paper')?.value||'—'} · ${$('#density')?.value||'—'}\nПечать: ${state.side||'—'}\nДопечатная: ${state.prepress}\nПостпечатка: ${finishText()}\nМакет: ${state.file?`${state.file.name} (приложить к письму)`:'не приложен'}\nПолучение: ${state.delivery}${state.delivery.startsWith('Курьер')&&$('#address')?.value?` · ${$('#address').value}`:''}\nКлиент: ${$('#name')?.value||'—'}\nТелефон: ${$('#phone')?.value||'—'}\nE-mail: ${$('#email')?.value||'—'}${$('#desiredDate')?.value?`\nЖелаемый срок: ${$('#desiredDate').value}`:''}${$('#notes')?.value.trim()?`\nКомментарий: ${$('#notes').value.trim()}`:''}`;
    }

    function updateMissing(){
  const furthest=Math.max(0,Math.min(3,Number(doc.body?.dataset.builderFurthest||0)));
  const current=Math.max(0,Math.min(3,Number(doc.body?.dataset.builderCurrent||0)));
  const finalErrors=allErrors();
  const errors=furthest<3?[SUMMARY_NEXT_HINTS[current]]:finalErrors;
  const ready=furthest>=3&&!finalErrors.length;
  const list=$('#missingList'),box=$('#summaryMissing'),status=$('#summaryStatus'),title=box?.querySelector('b');
  if(list) list.innerHTML=(ready?['Все обязательные данные заполнены.']:errors.slice(0,4)).map(x=>`<li>${esc(x)}</li>`).join('');
  if(title) title.textContent=ready?'Все готово':furthest<3?'Дальше':'Осталось заполнить';
  if(box) box.classList.toggle('ready',ready);
  if(status){status.textContent=ready?'Готово':furthest<3?'В процессе':'Нужно заполнить';status.classList.toggle('ready',ready);}
}

    function update(){
      const p=PRODUCTS[state.product];
      if($('#sumProduct')) $('#sumProduct').textContent=p.name;if($('#sumSize')) $('#sumSize').textContent=sizeText();if($('#sumQty')) $('#sumQty').textContent=isValidQuantity($('#qty')?.value)?`${$('#qty').value} шт.`:'—';if($('#sumPages')) $('#sumPages').textContent=$('#pages')?.value||'—';if($('#sumPaper')) $('#sumPaper').textContent=`${$('#paper')?.value||'—'} · ${$('#density')?.value||'—'}`;if($('#sumSide')) $('#sumSide').textContent=state.side||'—';if($('#sumFinish')) $('#sumFinish').textContent=finishText();if($('#sumDelivery')) $('#sumDelivery').textContent=state.delivery;if($('#sumContact')) $('#sumContact').textContent=contactText();if($('#sumFile')) $('#sumFile').textContent=state.file?`${state.file.name} · приложить к письму`:'не приложен';
      syncQtyPresets();updateMissing();
    }

    function handleFile(f){
      const status=$('#fileStatus');if(!status||!f)return;const ext=(f.name.split('.').pop()||'').toLowerCase();status.className='file-status';
      if(!['pdf','jpg','jpeg','png','tif','tiff'].includes(ext)){state.file=null;status.classList.add('error');status.textContent='Неподдерживаемый формат. Используйте PDF, JPG, PNG или TIFF.';}
      else if(f.size>50*1024*1024){state.file=null;status.classList.add('error');status.textContent='Файл больше 50 МБ.';}
      else{state.file=f;status.classList.add('ok');status.innerHTML=`<b>✓ ${esc(f.name)}</b><br>Файл выбран. При отправке письма приложите его вручную.`;}
      update();
    }

    renderProductButtons();
    $$('#prepressChoices .choice-card').forEach(b=>b.addEventListener('click',()=>{$$('#prepressChoices .choice-card').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.prepress=b.dataset.prepress;update();}));
    $$('#deliveryChoices .delivery-choice').forEach(b=>b.addEventListener('click',()=>{$$('#deliveryChoices .delivery-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.delivery=b.dataset.delivery;$('#addressField')?.classList.toggle('is-hidden',!state.delivery.startsWith('Курьер'));update();}));
    const toggle=(id,key)=>{const el=$(id);if(el)el.addEventListener('click',()=>{state[key]=!state[key];el.setAttribute('aria-pressed',String(state[key]));update();});};toggle('#variableToggle','variable');toggle('#clearTonerToggle','clearToner');
    $$('#qty,[data-qty-preset]').forEach(el=>{if(el.matches('[data-qty-preset]'))el.addEventListener('click',()=>{if($('#qty'))$('#qty').value=el.dataset.qtyPreset;update();});});
    ['size','qty','pages','customWidth','customHeight','name','phone','email','address','desiredDate','notes'].forEach(id=>{const el=$('#'+id);if(el)el.addEventListener('input',()=>{if(id==='size')syncCustomSize();else update();});});
    $('#size')?.addEventListener('change',syncCustomSize);$('#density')?.addEventListener('change',applyCompatibility);$('#paper')?.addEventListener('change',()=>{const p=PRODUCTS[state.product];setOpts($('#density'),p.densities);if(/Пластик|плёнка/.test($('#paper')?.value||''))setOpts($('#density'),['По материалу']);applyCompatibility();});
    const date=$('#desiredDate');if(date)date.min=todayISO();
    const file=$('#file'),drop=$('#dropzone');if(file)file.addEventListener('change',()=>file.files?.[0]&&handleFile(file.files[0]));if(drop){['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>e.preventDefault()));drop.addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer?.files?.[0])handleFile(e.dataTransfer.files[0]);});}
    const uploadHint=drop?.querySelector('span');if(uploadHint)uploadHint.textContent='PDF, JPG, PNG, TIFF · до 50 МБ. При отправке через почту приложите его вручную.';

    doc.addEventListener('builder:progresschange',update);

    const modal=$('#modal');let lastModalTrigger=null;
    const modalLead=modal?.querySelector('.modal-lead');if(modalLead)modalLead.textContent='Проверьте текст и отправьте его менеджеру. Если выбрали макет, приложите его к письму вручную — mailto не может прикрепить локальный файл автоматически.';
    function closeModal(){if(!modal)return;modal.hidden=true;modal.classList.remove('show');doc.body.classList.remove('modal-open');lastModalTrigger?.focus();}
    function openModal(trigger){
      const invalid=firstInvalidStage();
      if(invalid>=0){doc.dispatchEvent(new win.CustomEvent('builder:goto',{detail:{index:invalid,validate:true}}));return;}
      lastModalTrigger=trigger||doc.activeElement;const text=managerText();if($('#modalOrder'))$('#modalOrder').innerHTML=`<pre>${esc(text)}</pre>`;if($('#mailtoOrder'))$('#mailtoOrder').href=`mailto:operaprint@yandex.ru?subject=${encodeURIComponent('Заявка на расчёт · '+PRODUCTS[state.product].name)}&body=${encodeURIComponent(text)}`;if(modal){modal.hidden=false;modal.classList.add('show');doc.body.classList.add('modal-open');$('#modalClose')?.focus();}
    }
    $('#sendBtn')?.addEventListener('click',e=>openModal(e.currentTarget));$('#modalClose')?.addEventListener('click',closeModal);$('#editOrder')?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)closeModal();});

    runtime={validateStage,firstInvalidStage,managerText,update};
    const qp=new URLSearchParams(win.location.search).get('product');selectProduct(PRODUCTS[qp]?qp:'businessCards',true);update();
  }

  return {
    init,PRODUCTS,isValidQuantity,isValidDimension,isValidPages,isValidEmail,isValidPhone,isPastDate,isCustomSize,customSizeText,canVisitStep,validateStepData,
    validateStage(index,show){return runtime?runtime.validateStage(index,show):true;},
    firstInvalidStage(){return runtime?runtime.firstInvalidStage():-1;},
    managerText(){return runtime?runtime.managerText():'';}
  };
});
