const WA_NUMBER = '919929562585';
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open');
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle?.setAttribute('aria-expanded','false'); }));

document.getElementById('year').textContent = new Date().getFullYear();

const toast = document.getElementById('toast');
function showToast(message){ toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.t); showToast.t = setTimeout(()=>toast.classList.remove('show'),2200); }
function openWhatsApp(message){ window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener'); }

document.querySelectorAll('[data-whatsapp-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const type = form.dataset.formType;
    const lines = [`Hi AJAYNXT, I am sending a ${type} enquiry from the IRONPULSE demo website.`];
    for (const [key,value] of data.entries()) if (value) lines.push(`${key}: ${value === 'on' ? 'Yes' : value}`);
    openWhatsApp(lines.join('\n'));
    showToast('Opening WhatsApp with your enquiry');
  });
});

document.querySelectorAll('.plan-enquire').forEach(btn => btn.addEventListener('click', () => openWhatsApp(`Hi AJAYNXT, I am interested in the demo gym membership: ${btn.dataset.plan}. Please share more details.`)));

const schedule = {
  monday:[['6:00 AM','Strength Basics','Rahul'],['7:30 AM','Yoga & Mobility','Anjali'],['6:00 PM','HIIT Conditioning','Vikram'],['7:30 PM','Women Fitness','Priya']],
  tuesday:[['6:00 AM','Functional Training','Vikram'],['8:00 AM','Fat Loss Circuit','Priya'],['6:30 PM','Strength Lab','Rahul'],['8:00 PM','Yoga Flow','Anjali']],
  wednesday:[['6:00 AM','Cardio Blast','Priya'],['7:30 AM','Mobility Reset','Anjali'],['6:00 PM','Cross Training','Vikram'],['7:30 PM','Beginner Strength','Rahul']],
  thursday:[['6:00 AM','Lower Body Strength','Rahul'],['8:00 AM','Women Fitness','Priya'],['6:30 PM','HIIT Conditioning','Vikram'],['8:00 PM','Yoga Flow','Anjali']],
  friday:[['6:00 AM','Upper Body Strength','Rahul'],['7:30 AM','Fat Loss Circuit','Priya'],['6:00 PM','Functional Training','Vikram'],['7:30 PM','Mobility Reset','Anjali']],
  saturday:[['7:00 AM','Community Bootcamp','Team'],['9:00 AM','Fitness Assessment','Team'],['5:30 PM','Strength Workshop','Rahul'],['7:00 PM','Dance Fitness','Priya']]
};
const scheduleList = document.getElementById('schedule-list');
function renderSchedule(day){ scheduleList.innerHTML = schedule[day].map(([time,name,coach]) => `<article class="schedule-item"><time>${time}</time><div><h3>${name}</h3><p>Coach ${coach}</p></div><span>Book seat</span></article>`).join(''); }
renderSchedule('monday');
document.querySelectorAll('.schedule-tabs button').forEach(btn => btn.addEventListener('click',()=>{ document.querySelectorAll('.schedule-tabs button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderSchedule(btn.dataset.day); }));

document.getElementById('bmi-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const h = Number(document.getElementById('height').value)/100;
  const w = Number(document.getElementById('weight').value);
  if (!h || !w) return;
  const bmi = w/(h*h);
  let label = bmi < 18.5 ? 'Below general range' : bmi < 25 ? 'Within general range' : bmi < 30 ? 'Above general range' : 'Well above general range';
  document.getElementById('bmi-result').innerHTML = `<b>${bmi.toFixed(1)}</b><span>${label}. Use this only as a screening estimate.</span><br><button class="button button-small" type="button" id="assessment-btn">Book personal assessment</button>`;
  document.getElementById('assessment-btn').addEventListener('click',()=>openWhatsApp(`Hi AJAYNXT, my estimated BMI from the demo calculator is ${bmi.toFixed(1)}. I want to enquire about a personal fitness assessment.`));
});

let cart = JSON.parse(localStorage.getItem('ironpulse-cart') || '[]');
const drawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('cart-overlay');
function saveCart(){ localStorage.setItem('ironpulse-cart',JSON.stringify(cart)); renderCart(); }
function renderCart(){
  const items = document.getElementById('cart-items');
  const count = cart.reduce((sum,i)=>sum+i.qty,0);
  document.getElementById('cart-count').textContent = count;
  if(!cart.length) items.innerHTML = '<p>Your supplement cart is empty.</p>';
  else items.innerHTML = cart.map(i=>`<div class="cart-item"><div><p><b>${i.name}</b></p><small>${currency.format(i.price)} × ${i.qty}</small></div><button data-remove="${i.id}">Remove</button></div>`).join('');
  document.getElementById('cart-total').textContent = currency.format(cart.reduce((sum,i)=>sum+i.price*i.qty,0));
  items.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart=cart.filter(i=>i.id!==b.dataset.remove);saveCart();}));
}
function setCart(open){ drawer.classList.toggle('open',open); overlay.classList.toggle('open',open); drawer.setAttribute('aria-hidden',String(!open)); document.body.classList.toggle('cart-open',open); }
document.getElementById('cart-open').addEventListener('click',()=>setCart(true));
document.getElementById('cart-close').addEventListener('click',()=>setCart(false));
overlay.addEventListener('click',()=>setCart(false));
document.querySelectorAll('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{
  const card=btn.closest('.product-card'); const found=cart.find(i=>i.id===card.dataset.id);
  if(found) found.qty++; else cart.push({id:card.dataset.id,name:card.dataset.name,price:Number(card.dataset.price),qty:1});
  saveCart(); showToast(`${card.dataset.name} added to cart`);
}));
document.getElementById('cart-whatsapp').addEventListener('click',()=>{
  if(!cart.length){showToast('Add a product first');return;}
  const lines=['Hi AJAYNXT, I want to enquire about these demo supplement products:',...cart.map(i=>`• ${i.name} × ${i.qty} – ${currency.format(i.price*i.qty)}`),`Estimated total: ${currency.format(cart.reduce((s,i)=>s+i.price*i.qty,0))}`,'Please confirm stock, final price and product details.'];
  openWhatsApp(lines.join('\n'));
});
renderCart();

const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));


// ---------- AJAYNXT CLIENT PREVIEW: COLOR + COPY CHOOSER ----------
const PREVIEW_STORAGE_KEY = 'ironpulse-client-preview-v2';
const staticConfig = window.IRONPULSE_CONFIG || {};
const themeSets = {
  orange: { orange:'#ff5a0a', orange2:'#ff7a1a', accentRgb:'255,90,10', accent2Rgb:'255,122,26', bg:'#09090b', bg2:'#111114', card:'#17171b', border:'#2b2b31', navy:'#121d35' },
  lime:   { orange:'#a3e635', orange2:'#d4ff5e', accentRgb:'163,230,53', accent2Rgb:'212,255,94', bg:'#070a07', bg2:'#0d120d', card:'#141914', border:'#2b3528', navy:'#15210f' },
  red:    { orange:'#ef3340', orange2:'#ff6b54', accentRgb:'239,51,64', accent2Rgb:'255,107,84', bg:'#0b0809', bg2:'#140d0f', card:'#1b1315', border:'#382629', navy:'#261116' },
  blue:   { orange:'#00a8ff', orange2:'#55d6ff', accentRgb:'0,168,255', accent2Rgb:'85,214,255', bg:'#060a0f', bg2:'#0b121a', card:'#111b25', border:'#263848', navy:'#071f35' }
};
const copySets = {
  sales: {
    heroEyebrow:'Premium fitness • expert coaching • real accountability',
    heroTitle:'Transform your body.<br><span>Build your strongest self.</span>',
    heroLead:'A conversion-ready gym experience built around free trials, memberships, personal training, progress tracking and trusted supplements.',
    primaryCta:'Book a Free Trial', secondaryCta:'View Memberships',
    programsTitle:'Everything a gym client needs to sell', plansTitle:'Membership plans built to convert',
    supplementsTitle:'Premium supplements & accessories', trustTitle:'Trust before the membership pitch'
  },
  premium: {
    heroEyebrow:'Elite coaching • refined facilities • measurable progress',
    heroTitle:'Train with purpose.<br><span>Perform at your highest level.</span>',
    heroLead:'A premium fitness club experience with expert coaching, structured assessments, personalised programs and carefully selected performance essentials.',
    primaryCta:'Book a Club Visit', secondaryCta:'Explore Memberships',
    programsTitle:'Expert programs, tailored around every goal', plansTitle:'Memberships designed around your performance',
    supplementsTitle:'Curated performance nutrition', trustTitle:'Quality and expertise you can verify'
  },
  community: {
    heroEyebrow:'Friendly coaching • inclusive training • stronger together',
    heroTitle:'Start where you are.<br><span>Get stronger together.</span>',
    heroLead:'A welcoming local fitness community for beginners, families and experienced members, with supportive trainers and flexible ways to get moving.',
    primaryCta:'Try the Gym Free', secondaryCta:'Find Your Plan',
    programsTitle:'A program for every body and every starting point', plansTitle:'Flexible memberships for real life',
    supplementsTitle:'Everyday fitness essentials', trustTitle:'A gym community that has your back'
  }
};
let previewState = (() => {
  const saved = JSON.parse(localStorage.getItem(PREVIEW_STORAGE_KEY) || '{}');
  return {
    theme: staticConfig.theme || saved.theme || 'orange',
    copy: staticConfig.copy || saved.copy || 'sales',
    lockTheme: Boolean(staticConfig.lockTheme || saved.lockTheme),
    lockCopy: Boolean(staticConfig.lockCopy || saved.lockCopy)
  };
})();
function applyTheme(name){
  const theme = themeSets[name] || themeSets.orange;
  const style = document.documentElement.style;
  style.setProperty('--orange',theme.orange); style.setProperty('--orange2',theme.orange2);
  style.setProperty('--accent-rgb',theme.accentRgb); style.setProperty('--accent2-rgb',theme.accent2Rgb);
  style.setProperty('--bg',theme.bg); style.setProperty('--bg2',theme.bg2); style.setProperty('--card',theme.card);
  style.setProperty('--border',theme.border); style.setProperty('--navy',theme.navy);
  document.body.dataset.theme = name;
  document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeChoice===name));
}
function applyCopy(name){
  const set = copySets[name] || copySets.sales;
  document.querySelectorAll('[data-copy-key]').forEach(el=>{ const value=set[el.dataset.copyKey]; if(value) el.innerHTML=value; });
  document.querySelectorAll('[data-copy-choice]').forEach(btn=>btn.classList.toggle('active',btn.dataset.copyChoice===name));
}
function savePreview(){ localStorage.setItem(PREVIEW_STORAGE_KEY,JSON.stringify(previewState)); }
function refreshLocks(){
  document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.disabled=previewState.lockTheme);
  document.querySelectorAll('[data-copy-choice]').forEach(btn=>btn.disabled=previewState.lockCopy);
  const themeLabel=document.getElementById('theme-lock-label'), copyLabel=document.getElementById('copy-lock-label');
  if(themeLabel) themeLabel.textContent=previewState.lockTheme?'Locked':'Unlocked';
  if(copyLabel) copyLabel.textContent=previewState.lockCopy?'Locked':'Unlocked';
  const themeButton=document.getElementById('lock-theme'), copyButton=document.getElementById('lock-copy');
  themeButton?.classList.toggle('locked',previewState.lockTheme); copyButton?.classList.toggle('locked',previewState.lockCopy);
  if(themeButton) themeButton.textContent=previewState.lockTheme?'Color Locked':'Lock Color';
  if(copyButton) copyButton.textContent=previewState.lockCopy?'Text Locked':'Lock Text';
}
function updatePreview(){ applyTheme(previewState.theme); applyCopy(previewState.copy); refreshLocks(); savePreview(); }
document.querySelectorAll('[data-theme-choice]').forEach(btn=>btn.addEventListener('click',()=>{ if(previewState.lockTheme)return; previewState.theme=btn.dataset.themeChoice; updatePreview(); showToast(`${btn.querySelector('b').textContent} preview applied`); }));
document.querySelectorAll('[data-copy-choice]').forEach(btn=>btn.addEventListener('click',()=>{ if(previewState.lockCopy)return; previewState.copy=btn.dataset.copyChoice; updatePreview(); showToast(`${btn.querySelector('b').textContent} copy applied`); }));
document.getElementById('lock-theme')?.addEventListener('click',()=>{ previewState.lockTheme=true; updatePreview(); showToast('Color choice locked in this browser'); });
document.getElementById('lock-copy')?.addEventListener('click',()=>{ previewState.lockCopy=true; updatePreview(); showToast('Text choice locked in this browser'); });
document.getElementById('lock-both')?.addEventListener('click',()=>{ previewState.lockTheme=true; previewState.lockCopy=true; updatePreview(); showToast('Color and text choices locked'); });
document.getElementById('unlock-all')?.addEventListener('click',()=>{ previewState={theme:'orange',copy:'sales',lockTheme:false,lockCopy:false}; updatePreview(); showToast('Preview reset and unlocked'); });
document.getElementById('download-choice')?.addEventListener('click',()=>{
  const output=`// Upload this as site-config.js to permanently apply the client choice.\nwindow.IRONPULSE_CONFIG = ${JSON.stringify({...previewState,lockTheme:true,lockCopy:true},null,2)};\n`;
  const blob=new Blob([output],{type:'text/javascript'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='site-config.js'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); showToast('Client choice file downloaded');
});
const customizer=document.getElementById('client-customizer');
function setCustomizerCollapsed(collapsed){ customizer?.classList.toggle('collapsed',collapsed); document.getElementById('customizer-toggle')?.setAttribute('aria-expanded',String(!collapsed)); }
document.getElementById('customizer-close')?.addEventListener('click',()=>setCustomizerCollapsed(true));
document.getElementById('customizer-toggle')?.addEventListener('click',()=>setCustomizerCollapsed(false));
updatePreview();
