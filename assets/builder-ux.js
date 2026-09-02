(()=>{
  const stages=[...document.querySelectorAll('[data-builder-stage]')];
  if(!stages.length) return;
  const progress=[...document.querySelectorAll('[data-builder-progress]')];
  const desktopBack=[...document.querySelectorAll('[data-builder-back]')];
  const desktopNext=[...document.querySelectorAll('[data-builder-next]')];
  const mobileBack=document.querySelector('[data-mobile-back]');
  const mobileNext=document.querySelector('[data-mobile-next]');
  const summary=document.querySelector('.summary');
  const summaryToggles=[...document.querySelectorAll('[data-summary-toggle]')];
  const summaryClose=document.querySelector('[data-summary-close]');
  const backdrop=document.querySelector('[data-summary-backdrop]');
  const summarySubmit=document.querySelector('#sendBtn');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery=matchMedia('(max-width:720px)');
  let current=0;
  let furthest=0;
  let lastSummaryTrigger=null;

  const builderApi=()=>window.OperaBuilder;
  const validateStage=index=>builderApi()?.validateStage(index,true)!==false;

  function animateStage(stage,direction){
    if(reduced||!stage) return;
    stage.classList.remove('enter-forward','enter-back');
    void stage.offsetWidth;
    stage.classList.add(direction==='back'?'enter-back':'enter-forward');
    stage.addEventListener('animationend',()=>stage.classList.remove('enter-forward','enter-back'),{once:true});
  }

  function updateProgress(){
    progress.forEach((button,i)=>{
      button.classList.toggle('active',i===current);
      button.classList.toggle('is-complete',i<current&&i<=furthest);
      button.setAttribute('aria-current',i===current?'step':'false');
      button.disabled=i>furthest;
      const icon=button.querySelector('i');
      if(icon) icon.textContent=i<current&&i<=furthest?'✓':String(i+1);
    });
    if(summarySubmit){
      const locked=furthest<stages.length-1;
      summarySubmit.disabled=locked;
      summarySubmit.setAttribute('aria-disabled',String(locked));
      summarySubmit.textContent=locked?'Пройдите 4 шага':'Сформировать заявку';
      summarySubmit.style.opacity=locked?'.48':'1';
      summarySubmit.style.cursor=locked?'not-allowed':'pointer';
    }
  }

  function show(index,focus=true,direction){
    const nextIndex=Math.max(0,Math.min(stages.length-1,index));
    const movement=direction||(nextIndex<current?'back':'forward');
    current=nextIndex;
    stages.forEach((stage,i)=>{stage.classList.toggle('is-active',i===current);stage.hidden=i!==current;});
    animateStage(stages[current],movement);
    updateProgress();
    if(mobileBack) mobileBack.disabled=current===0;
    if(mobileNext){mobileNext.textContent=current===stages.length-1?'Посмотреть итог':'Продолжить';mobileNext.dataset.final=String(current===stages.length-1);}
    if(focus){
      const heading=stages[current].querySelector('h3');
      if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
      const anchor=document.querySelector('.builder-progress');
      anchor?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    }
  }

  function setSummaryExpanded(expanded){summaryToggles.forEach(toggle=>toggle.setAttribute('aria-expanded',String(expanded)));}
  function openSummary(trigger){
    if(!summary)return;
    if(trigger)lastSummaryTrigger=trigger;
    if(!mobileQuery.matches){
      summary.classList.add('summary-pulse');
      summary.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
      summary.addEventListener('animationend',()=>summary.classList.remove('summary-pulse'),{once:true});
      return;
    }
    summary.classList.add('is-open');
    document.body.classList.add('summary-open');
    setSummaryExpanded(true);
    summaryClose?.focus({preventScroll:true});
  }
  function closeSummary(restoreFocus=false){
    if(!summary)return;
    summary.classList.remove('is-open');
    document.body.classList.remove('summary-open');
    setSummaryExpanded(false);
    if(restoreFocus&&lastSummaryTrigger)lastSummaryTrigger.focus();
  }

  function next(){
    if(!validateStage(current))return;
    if(current===stages.length-1){openSummary(mobileNext);return;}
    furthest=Math.max(furthest,current+1);
    show(current+1,true,'forward');
  }
  function back(){if(current>0)show(current-1,true,'back');}

  desktopNext.forEach(btn=>btn.addEventListener('click',next));
  desktopBack.forEach(btn=>btn.addEventListener('click',back));
  progress.forEach((btn,i)=>btn.addEventListener('click',()=>{
    if(!window.OperaBuilder?.canVisitStep(i,furthest))return;
    if(i>current&&!validateStage(current))return;
    show(i,true,i<current?'back':'forward');
  }));
  mobileNext?.addEventListener('click',next);
  mobileBack?.addEventListener('click',back);
  summaryToggles.forEach(toggle=>toggle.addEventListener('click',()=>{
    if(toggle.dataset.summaryValidate==='true'&&!validateStage(current))return;
    if(summary?.classList.contains('is-open'))closeSummary();
    else openSummary(toggle);
  }));
  summaryClose?.addEventListener('click',()=>closeSummary(true));
  backdrop?.addEventListener('click',()=>closeSummary(true));
  document.addEventListener('builder:goto',event=>{
    const index=Number(event.detail?.index);
    if(!Number.isInteger(index)||index<0||index>=stages.length)return;
    closeSummary(false);
    furthest=Math.max(furthest,index);
    show(index,true,index<current?'back':'forward');
    if(event.detail?.validate)window.OperaBuilder?.validateStage(index,true);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&summary?.classList.contains('is-open'))closeSummary(true);});
  window.addEventListener('resize',()=>{if(window.innerWidth>720)closeSummary();},{passive:true});
  show(0,false,'forward');
})();
