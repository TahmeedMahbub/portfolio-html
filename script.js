function updateTime(){
  const t=new Date().toLocaleTimeString('en-US',{timeZone:'Asia/Dhaka',hour:'2-digit',minute:'2-digit',hour12:true});
  const el=document.getElementById('dhaka-time');
  if(el)el.textContent=t+' — Dhaka, BD';
}
updateTime();
setInterval(updateTime,1000);

const sectionIds=['overview','domains','principles','projects','building','now','impact','toolkit','contact'];
const navLinks=document.querySelectorAll('[data-section]');
const mobileBtns=document.querySelectorAll('.mobile-nav-btn');
const navGlass=document.querySelector('.nav-glass');
const navGlassReflection=document.querySelector('.nav-glass-reflection');
let lastGlassTop=null;

function moveGlass(link){
  if(!navGlass||!link)return;
  const top=link.offsetTop;
  navGlass.style.height=link.offsetHeight+'px';
  navGlass.style.transform='translateY('+top+'px)';
  navGlass.style.opacity='1';
  if(navGlassReflection){
    const delta=lastGlassTop===null?0:top-lastGlassTop;
    navGlassReflection.style.transition='none';
    navGlassReflection.style.transform='translateY('+(-delta*0.35)+'px) rotate(8deg)';
    requestAnimationFrame(()=>{
      navGlassReflection.style.transition='';
      navGlassReflection.style.transform='translateY(0) rotate(8deg)';
    });
  }
  lastGlassTop=top;
}

function setActive(id){
  let activeLink=null;
  navLinks.forEach(a=>{
    const on=a.dataset.section===id;
    a.classList.toggle('active',on);
    if(on)activeLink=a;
  });
  moveGlass(activeLink);
  mobileBtns.forEach(b=>{
    const matches=b.getAttribute('onclick')&&b.getAttribute('onclick').includes("'"+id+"'");
    b.classList.toggle('active',matches);
    if(b.classList.contains('active'))b.setAttribute('aria-current','page');
    else b.removeAttribute('aria-current');
  });
}

const observers=[];
sectionIds.forEach(id=>{
  const el=document.getElementById(id);
  if(!el)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)setActive(id);});
  },{rootMargin:'-30% 0px -60% 0px',threshold:0});
  obs.observe(el);
  observers.push(obs);
});

navLinks.forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const id=a.dataset.section;
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

function scrollToSection(id){
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
}

function positionActiveGlass(){
  const active=document.querySelector('[data-section].active');
  if(active&&navGlass){
    const prev=navGlass.style.transition;
    navGlass.style.transition='none';
    lastGlassTop=null;
    moveGlass(active);
    requestAnimationFrame(()=>{navGlass.style.transition=prev||'';});
  }
}
window.addEventListener('load',positionActiveGlass);
window.addEventListener('resize',positionActiveGlass);
positionActiveGlass();

const fadeEls=document.querySelectorAll('.fade-up');
const fadeObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');fadeObs.unobserve(e.target);}
  });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
fadeEls.forEach((el,i)=>{
  el.style.transitionDelay=(i%6)*0.07+'s';
  fadeObs.observe(el);
});
