function updateTime(){
  const t=new Date().toLocaleTimeString('en-US',{timeZone:'Asia/Dhaka',hour:'2-digit',minute:'2-digit',hour12:true});
  const el=document.getElementById('dhaka-time');
  if(el)el.textContent=t+' — Dhaka, BD';
}
updateTime();
setInterval(updateTime,1000);

const sectionIds=['overview','domains','projects','building','impact','toolkit','contact'];
const navLinks=document.querySelectorAll('[data-section]');
const mobileBtns=document.querySelectorAll('.mobile-nav-btn');

function setActive(id){
  navLinks.forEach(a=>{
    a.classList.toggle('active',a.dataset.section===id);
  });
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
