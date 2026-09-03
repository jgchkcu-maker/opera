(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root&&root.document){
    root.OperaSmartOrdering=api;
    const start=()=>api.init(root.document,root);
    if(root.document.readyState==='loading') root.document.addEventListener('DOMContentLoaded',start,{once:true});
    else start();
  }
})(typeof window!=='undefined'?window:null,function(){
  'use strict';

  const PRESETS={
    businessCards:[
      {id:'standard',label:'Обычная деловая',description:'Универсальный вариант для контактов и встреч.',paper:'Мелованный картон',density:'300 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'simple',label:'Простая и экономная',description:'Когда информация нужна только с одной стороны.',paper:'Мелованный картон',density:'250 г/м²',side:'4+0 · одна сторона'},
      {id:'premium',label:'Более премиальная',description:'Бумага с более выразительным внешним видом и фактурой.',paper:'Дизайнерская бумага',density:'300 г/м²',side:'4+4 · две стороны'}
    ],
    leaflets:[
      {id:'handout',label:'Для раздачи',description:'Хороший базовый вариант для промо, акций и мероприятий.',paper:'Мелованная бумага',density:'130 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'economy',label:'Максимально просто',description:'Лёгкий вариант, если важнее тираж и экономичность.',paper:'Офсетная бумага',density:'90 г/м²',side:'4+0 · одна сторона'},
      {id:'dense',label:'Плотнее и заметнее',description:'Когда листовка должна ощущаться более основательной.',paper:'Мелованная бумага',density:'170 г/м²',side:'4+4 · две стороны'}
    ],
    posters:[
      {id:'standard',label:'Обычный плакат',description:'Универсальный вариант для афиш, объявлений и событий.',paper:'Мелованная бумага',density:'150 г/м²',side:'4+0 · одна сторона',recommended:true},
      {id:'dense',label:'Плотный плакат',description:'Лучше держит форму, когда плакат часто берут в руки.',paper:'Мелованная бумага',density:'200 г/м²',side:'4+0 · одна сторона'},
      {id:'premium',label:'На дизайнерской бумаге',description:'Для имиджевых постеров и необычной подачи.',paper:'Дизайнерская бумага',density:'170 г/м²',side:'4+0 · одна сторона'}
    ],
    postcards:[
      {id:'standard',label:'Классическая открытка',description:'Плотная двусторонняя карточка для поздравления или приглашения.',paper:'Мелованный картон',density:'300 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'premium',label:'Премиальная',description:'Для более выразительного тактильного впечатления.',paper:'Дизайнерская бумага',density:'300 г/м²',side:'4+4 · две стороны'},
      {id:'one-side',label:'Односторонняя карточка',description:'Если вся информация и изображение находятся на лицевой стороне.',paper:'Мелованный картон',density:'250 г/м²',side:'4+0 · одна сторона'}
    ],
    certificates:[
      {id:'standard',label:'Обычный диплом / сертификат',description:'Плотный аккуратный вариант для вручения и рамки.',paper:'Мелованный картон',density:'250 г/м²',side:'4+0 · одна сторона',recommended:true},
      {id:'premium',label:'Торжественный вариант',description:'Дизайнерская бумага для более статусной подачи.',paper:'Дизайнерская бумага',density:'300 г/м²',side:'4+0 · одна сторона'},
      {id:'duplex',label:'Информация с двух сторон',description:'Когда сзади нужны условия, программа или дополнительные данные.',paper:'Мелованный картон',density:'250 г/м²',side:'4+4 · две стороны'}
    ],
    booklets:[
      {id:'standard',label:'Стандартный буклет',description:'Универсальный вариант для презентации услуг и предложений.',paper:'Мелованная бумага',density:'150 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'light',label:'Лёгкий массовый',description:'Для большого тиража и раздачи, когда важна компактность.',paper:'Мелованная бумага',density:'115 г/м²',side:'4+4 · две стороны'},
      {id:'premium',label:'Плотный презентационный',description:'Более солидный вариант для продаж и переговоров.',paper:'Дизайнерская бумага',density:'200 г/м²',side:'4+4 · две стороны'}
    ],
    catalogs:[
      {id:'standard',label:'Обычный каталог / брошюра',description:'Хорошая стартовая конфигурация для цветной многостраничной печати.',paper:'Мелованная бумага',density:'130 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'economy',label:'Экономичнее',description:'Подходит для инструкций, внутренних материалов и простых брошюр.',paper:'Офсетная бумага',density:'90 г/м²',side:'4+4 · две стороны'},
      {id:'dense',label:'Плотные страницы',description:'Когда каталог должен ощущаться более презентационно.',paper:'Мелованная бумага',density:'170 г/м²',side:'4+4 · две стороны'}
    ],
    forms:[
      {id:'standard',label:'Фирменный бланк',description:'Базовый цветной вариант для документов и писем.',paper:'Офсетная бумага',density:'80 г/м²',side:'4+0 · одна сторона',recommended:true},
      {id:'bw',label:'Простой чёрно-белый',description:'Для внутренних форм и документов без цветной графики.',paper:'Офсетная бумага',density:'80 г/м²',side:'1+0 · ч/б'},
      {id:'premium',label:'Плотнее обычного',description:'Когда документ должен выглядеть и ощущаться более солидно.',paper:'Дизайнерская бумага',density:'120 г/м²',side:'4+0 · одна сторона'}
    ],
    folders:[
      {id:'standard',label:'Обычная презентационная папка',description:'Плотная папка с цветной печатью снаружи.',paper:'Мелованный картон',density:'350 г/м²',side:'4+0 · одна сторона',recommended:true},
      {id:'duplex',label:'Печать снаружи и внутри',description:'Когда внутреннюю часть тоже нужно оформить.',paper:'Мелованный картон',density:'300 г/м²',side:'4+4 · две стороны'},
      {id:'premium',label:'На дизайнерском картоне',description:'Для более выразительной фактуры и премиальной подачи.',paper:'Дизайнерский картон',density:'350 г/м²',side:'4+0 · одна сторона'}
    ],
    notepads:[
      {id:'standard',label:'Обычный кубарик',description:'Простой вариант для заметок в офисе или на стойке.',paper:'Офсетная бумага',density:'80 г/м²',side:'1+0 · ч/б',recommended:true},
      {id:'color',label:'С цветным брендингом',description:'Для логотипа, фирменных элементов и цветной графики.',paper:'Офсетная бумага',density:'80 г/м²',side:'4+0 · одна сторона'},
      {id:'dense',label:'Плотнее и ярче',description:'Более плотные листы с цветной печатью.',paper:'Мелованная бумага',density:'100 г/м²',side:'4+0 · одна сторона'}
    ],
    menus:[
      {id:'standard',label:'Обычное меню',description:'Плотный двусторонний вариант для ежедневного использования.',paper:'Мелованная бумага / картон',density:'300 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'table',label:'Тейбл-тент / одностороннее',description:'Когда информация читается только с одной внешней стороны.',paper:'Мелованная бумага / картон',density:'300 г/м²',side:'4+0 · одна сторона'},
      {id:'premium',label:'Премиальное меню',description:'Дизайнерская бумага для более характерной подачи заведения.',paper:'Дизайнерская бумага',density:'300 г/м²',side:'4+4 · две стороны'}
    ],
    tags:[
      {id:'standard',label:'Обычная бирка',description:'Плотная двусторонняя бирка для товара или упаковки.',paper:'Мелованный картон',density:'300 г/м²',side:'4+4 · две стороны',recommended:true},
      {id:'premium',label:'Премиальная бирка',description:'Дизайнерская бумага для брендов, где важны детали.',paper:'Дизайнерская бумага',density:'300 г/м²',side:'4+4 · две стороны'},
      {id:'one-side',label:'Простая односторонняя',description:'Если вся информация размещается на лицевой стороне.',paper:'Мелованный картон',density:'250 г/м²',side:'4+0 · одна сторона'}
    ],
    stickers:[
      {id:'paper',label:'Бумажные наклейки',description:'Для упаковки, маркировки и использования в помещении.',paper:'Самоклеящаяся бумага',density:'По материалу',side:'4+0 · лицевая печать',recommended:true},
      {id:'film',label:'Наклейки на плёнке',description:'Более практичная основа, когда нужна плёнка вместо бумаги.',paper:'Самоклеящаяся плёнка',density:'По материалу',side:'4+0 · лицевая печать'}
    ],
    books:[
      {id:'bw',label:'Чёрно-белая книга',description:'Базовый вариант для текстовых изданий и небольших тиражей.',paper:'Офсетная бумага',density:'80 г/м²',side:'1+1 · ч/б с двух сторон',recommended:true},
      {id:'color',label:'Цветная книга / альбом',description:'Для цветных иллюстраций, портфолио и презентационных материалов.',paper:'Мелованная бумага',density:'130 г/м²',side:'4+4 · две стороны'},
      {id:'photo',label:'Фотоальбом',description:'Стартовая конфигурация, если в изделии главное — фотографии.',paper:'Фотобумага / подобрать',density:'150 г/м²',side:'4+4 · две стороны'}
    ],
    calendars:[
      {id:'standard',label:'Обычный настенный календарь',description:'Плотная цветная печать для календаря на стену.',paper:'Мелованная бумага / картон',density:'250 г/м²',side:'4+0 · одна сторона',recommended:true},
      {id:'duplex',label:'Печать с двух сторон',description:'Когда обе стороны листа участвуют в конструкции или дизайне.',paper:'Мелованная бумага / картон',density:'200 г/м²',side:'4+4 · две стороны'},
      {id:'premium',label:'На дизайнерской бумаге',description:'Для подарочного или имиджевого календаря.',paper:'Дизайнерская бумага',density:'250 г/м²',side:'4+4 · две стороны'}
    ]
  };

  function recommendationsForProduct(key){return PRESETS[key]||[];}
  function defaultPresetForProduct(key){const list=recommendationsForProduct(key);return list.find(item=>item.recommended)||list[0]||null;}
  function presetMatchesProduct(preset,product){
    return Boolean(preset&&product&&product.papers?.includes(preset.paper)&&product.densities?.includes(preset.density)&&product.sides?.includes(preset.side));
  }
  function sideLabel(value){
    if(/1\+1/.test(value)) return 'ч/б с двух сторон';
    if(/1\+0/.test(value)) return 'ч/б с одной стороны';
    if(/4\+4|две стороны/i.test(value)) return 'цвет с двух сторон';
    if(/лицевая/i.test(value)) return 'цветная лицевая печать';
    return 'цвет с одной стороны';
  }
  function technicalText(preset){return `${preset.paper} · ${preset.density} · ${sideLabel(preset.side)}`;}

  function init(doc,win){
    const stage=doc.querySelector('[data-builder-stage][data-stage="2"]');
    const paper=doc.querySelector('#paper');
    const density=doc.querySelector('#density');
    const sideWrap=doc.querySelector('#printSide');
    if(!stage||!paper||!density||!sideWrap||stage.querySelector('[data-smart-ordering-panel]')) return;

    const fieldGrid=paper.closest('.builder-field-grid');
    const sideField=sideWrap.closest('.field');
    const anchor=fieldGrid||sideField;
    if(!anchor) return;

    const panel=doc.createElement('section');
    panel.className='smart-ordering-panel';
    panel.dataset.smartOrderingPanel='';
    panel.innerHTML=`
      <div class="smart-ordering-head">
        <div><span class="smart-ordering-kicker">быстрый выбор</span><h4>Не знаете, что выбрать?</h4><p>Выберите результат понятными словами — материал и параметры печати подставятся автоматически.</p></div>
        <span class="smart-ordering-safe">Менеджер проверит перед запуском</span>
      </div>
      <div class="smart-ordering-options" data-smart-options></div>
      <div class="smart-ordering-note" aria-live="polite" data-smart-note></div>`;

    const manual=doc.createElement('details');
    manual.className='smart-manual';
    manual.dataset.smartManual='';
    manual.innerHTML=`<summary><span><b>Настроить вручную</b><small>Бумага, плотность и стороны печати — если вы точно знаете параметры</small></span><span class="smart-manual-plus" aria-hidden="true">+</span></summary><div class="smart-manual-body"></div>`;
    const manualBody=manual.querySelector('.smart-manual-body');

    anchor.before(panel,manual);
    if(fieldGrid) manualBody.appendChild(fieldGrid);
    if(sideField) manualBody.appendChild(sideField);

    const options=panel.querySelector('[data-smart-options]');
    const note=panel.querySelector('[data-smart-note]');
    let currentKey='';
    let applying=false;

    function inferProductKey(){
      const picker=doc.querySelector('[data-picker-product].is-selected');
      if(picker?.dataset.pickerProduct) return picker.dataset.pickerProduct;
      const legacy=doc.querySelector('#productGrid .product.active');
      if(legacy?.dataset.product) return legacy.dataset.product;
      const other=doc.querySelector('#otherProduct')?.value;
      if(other) return other;
      const query=new URLSearchParams(win.location.search).get('product');
      if(query&&win.OperaBuilder?.PRODUCTS?.[query]) return query;
      return 'businessCards';
    }

    function activePreset(){
      return recommendationsForProduct(currentKey).find(item=>item.paper===paper.value&&item.density===density.value&&item.side===doc.querySelector('#printSide .pill.active')?.dataset.side)||null;
    }

    function syncSelected(){
      const active=activePreset();
      options.querySelectorAll('[data-smart-preset]').forEach(button=>{
        const selected=button.dataset.smartPreset===active?.id;
        button.classList.toggle('is-selected',selected);
        button.setAttribute('aria-pressed',String(selected));
      });
      if(note){
        note.textContent=active
          ? `Сейчас выбрано: ${active.label}. Точные стоимость и технологию подтвердит менеджер.`
          : 'Вы настроили параметры вручную. Это нормально — менеджер всё равно проверит совместимость перед запуском.';
      }
    }

    function render(){
      const presets=recommendationsForProduct(currentKey);
      options.innerHTML=presets.map(item=>`<button type="button" class="smart-preset" data-smart-preset="${item.id}" aria-pressed="false"><span class="smart-preset-top"><b>${item.label}</b>${item.recommended?'<em>Рекомендуем</em>':''}</span><span class="smart-preset-description">${item.description}</span><small>${technicalText(item)}</small><span class="smart-preset-check" aria-hidden="true">✓</span></button>`).join('');
    }

    function setSelect(select,value){
      if(!select||![...select.options].some(option=>option.value===value)) return false;
      select.value=value;
      return true;
    }

    function applyPreset(preset,announce=true){
      if(!preset) return;
      applying=true;
      if(setSelect(paper,preset.paper)) paper.dispatchEvent(new win.Event('change',{bubbles:true}));
      if(setSelect(density,preset.density)) density.dispatchEvent(new win.Event('change',{bubbles:true}));
      const side=[...sideWrap.querySelectorAll('.pill')].find(button=>button.dataset.side===preset.side&&!button.disabled);
      if(side&&!side.classList.contains('active')) side.click();
      applying=false;
      syncSelected();
      if(announce&&note) note.textContent=`Готово: «${preset.label}». Технические параметры уже подставлены; при желании их можно открыть ниже.`;
    }

    function resetForProduct(key,applyDefault=true){
      currentKey=win.OperaBuilder?.PRODUCTS?.[key]?key:inferProductKey();
      render();
      if(applyDefault) win.requestAnimationFrame(()=>applyPreset(defaultPresetForProduct(currentKey),false));
      else syncSelected();
    }

    options.addEventListener('click',event=>{
      const button=event.target.closest('[data-smart-preset]');
      if(!button) return;
      const preset=recommendationsForProduct(currentKey).find(item=>item.id===button.dataset.smartPreset);
      applyPreset(preset,true);
    });

    const syncAfterManual=()=>{if(!applying) win.setTimeout(syncSelected,0);};
    paper.addEventListener('change',syncAfterManual);
    density.addEventListener('change',syncAfterManual);
    sideWrap.addEventListener('click',syncAfterManual);
    doc.addEventListener('picker:selected',event=>resetForProduct(event.detail?.key,true));

    resetForProduct(inferProductKey(),true);
  }

  return {PRESETS,recommendationsForProduct,defaultPresetForProduct,presetMatchesProduct,technicalText,init};
});
