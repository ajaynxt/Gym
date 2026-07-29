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


// ---------- LIVE COLOR + TEXT PREVIEW ----------
const PREVIEW_STORAGE_KEY = 'ironpulse-live-preview-v3';
const staticConfig = window.IRONPULSE_CONFIG || {};

const copySets = [
  {
    name:'Sales Focused',
    heroEyebrow:'Premium fitness • expert coaching • real accountability',
    heroTitle:'Transform your body.<br><span>Build your strongest self.</span>',
    heroLead:'A conversion-ready gym experience built around free trials, memberships, personal training, progress tracking and trusted supplements.',
    primaryCta:'Book a Free Trial', secondaryCta:'View Memberships',
    programsTitle:'Everything a gym client needs to sell', plansTitle:'Membership plans built to convert',
    supplementsTitle:'Premium supplements & accessories', trustTitle:'Trust before the membership pitch'
  },
  {
    name:'Premium Coaching',
    heroEyebrow:'Elite coaching • refined facilities • measurable progress',
    heroTitle:'Train with purpose.<br><span>Perform at your highest level.</span>',
    heroLead:'A premium fitness club experience with expert coaching, structured assessments, personalised programs and carefully selected performance essentials.',
    primaryCta:'Book a Club Visit', secondaryCta:'Explore Memberships',
    programsTitle:'Expert programs tailored around every goal', plansTitle:'Memberships designed around your performance',
    supplementsTitle:'Curated performance nutrition', trustTitle:'Quality and expertise you can verify'
  },
  {
    name:'Community Energy',
    heroEyebrow:'Friendly coaching • inclusive training • stronger together',
    heroTitle:'Start where you are.<br><span>Get stronger together.</span>',
    heroLead:'A welcoming local fitness community for beginners, families and experienced members, with supportive trainers and flexible ways to get moving.',
    primaryCta:'Try the Gym Free', secondaryCta:'Find Your Plan',
    programsTitle:'A program for every body and every starting point', plansTitle:'Flexible memberships for real life',
    supplementsTitle:'Everyday fitness essentials', trustTitle:'A gym community that has your back'
  },
  {
    name:'Transformation',
    heroEyebrow:'Structured plans • daily discipline • visible progress',
    heroTitle:'Your transformation starts.<br><span>One strong decision at a time.</span>',
    heroLead:'Goal-based training, nutrition support and regular progress checks designed to keep every member moving forward.',
    primaryCta:'Start My Transformation', secondaryCta:'See Training Plans',
    programsTitle:'Training paths built for real transformation', plansTitle:'Choose the plan that matches your goal',
    supplementsTitle:'Support your training and recovery', trustTitle:'A clear system from assessment to results'
  },
  {
    name:'Performance',
    heroEyebrow:'Strength • conditioning • athletic performance',
    heroTitle:'Move faster.<br><span>Lift stronger. Perform better.</span>',
    heroLead:'Progressive strength and conditioning programs for members who want better stamina, power, mobility and athletic confidence.',
    primaryCta:'Book Performance Trial', secondaryCta:'Explore Programs',
    programsTitle:'Performance training for every level', plansTitle:'Flexible access for serious progress',
    supplementsTitle:'Performance fuel and recovery essentials', trustTitle:'Professional coaching with measurable benchmarks'
  },
  {
    name:'Beginner Friendly',
    heroEyebrow:'Simple guidance • supportive trainers • zero intimidation',
    heroTitle:'New to the gym?<br><span>You are in the right place.</span>',
    heroLead:'Friendly onboarding, simple workout plans and trainer support make it easier to start safely and stay consistent.',
    primaryCta:'Book Beginner Trial', secondaryCta:'View Starter Plans',
    programsTitle:'Easy-to-follow programs for a confident start', plansTitle:'Starter memberships without the confusion',
    supplementsTitle:'Simple fitness essentials', trustTitle:'Support at every step of your fitness journey'
  },
  {
    name:'Women Fitness',
    heroEyebrow:'Safe space • expert guidance • flexible training',
    heroTitle:'Train with confidence.<br><span>Feel stronger every day.</span>',
    heroLead:'Supportive coaching, strength training, group classes and flexible plans built around women’s fitness goals.',
    primaryCta:'Book Women’s Trial', secondaryCta:'Explore Programs',
    programsTitle:'Fitness programs designed around your goals', plansTitle:'Flexible plans for every routine',
    supplementsTitle:'Daily wellness and recovery essentials', trustTitle:'A clean, supportive and women-friendly environment'
  },
  {
    name:'Local Club',
    heroEyebrow:'Your neighbourhood gym • modern equipment • real support',
    heroTitle:'A better gym experience.<br><span>Closer than you think.</span>',
    heroLead:'Modern equipment, helpful trainers, convenient timings and flexible memberships for the local community.',
    primaryCta:'Visit the Club', secondaryCta:'Check Memberships',
    programsTitle:'Everything you need under one roof', plansTitle:'Simple memberships with clear value',
    supplementsTitle:'Trusted gym essentials', trustTitle:'Local service with professional standards'
  }
];

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r,g,b] = [c,x,0];
  else if (h < 120) [r,g,b] = [x,c,0];
  else if (h < 180) [r,g,b] = [0,c,x];
  else if (h < 240) [r,g,b] = [0,x,c];
  else if (h < 300) [r,g,b] = [x,0,c];
  else [r,g,b] = [c,0,x];
  return [r,g,b].map(v => Math.round((v + m) * 255));
}

function colorLabel(hue) {
  const labels = ['Red','Orange','Gold','Lime','Green','Teal','Cyan','Blue','Indigo','Violet','Magenta','Rose'];
  return labels[Math.round((((hue % 360) + 360) % 360) / 30) % labels.length];
}

let previewState = (() => {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(PREVIEW_STORAGE_KEY) || '{}'); } catch (_) {}
  return {
    hue: Number.isFinite(staticConfig.hue) ? staticConfig.hue : (Number.isFinite(saved.hue) ? saved.hue : 22),
    copyIndex: Number.isInteger(staticConfig.copyIndex) ? staticConfig.copyIndex : (Number.isInteger(saved.copyIndex) ? saved.copyIndex : 0),
    lockTheme: Boolean(staticConfig.lockTheme ?? saved.lockTheme),
    lockCopy: Boolean(staticConfig.lockCopy ?? saved.lockCopy)
  };
})();

function savePreview() {
  localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewState));
}

function applyHue(hue) {
  hue = ((hue % 360) + 360) % 360;
  previewState.hue = hue;
  const hue2 = (hue + 24) % 360;
  const accent = hslToRgb(hue, 92, 48);
  const accent2 = hslToRgb(hue2, 92, 58);
  const luminance = (0.2126 * accent[0] + 0.7152 * accent[1] + 0.0722 * accent[2]) / 255;
  const style = document.documentElement.style;
  style.setProperty('--orange', `hsl(${hue} 92% 48%)`);
  style.setProperty('--orange2', `hsl(${hue2} 92% 58%)`);
  style.setProperty('--accent-rgb', accent.join(','));
  style.setProperty('--accent2-rgb', accent2.join(','));
  style.setProperty('--accent-contrast', luminance > .58 ? '#07100a' : '#ffffff');
  style.setProperty('--bg', `hsl(${hue} 18% 4%)`);
  style.setProperty('--bg2', `hsl(${hue} 16% 7%)`);
  style.setProperty('--card', `hsl(${hue} 13% 10%)`);
  style.setProperty('--border', `hsl(${hue} 11% 20%)`);
  style.setProperty('--navy', `hsl(${hue} 36% 15%)`);
  const swatch = document.getElementById('current-color-swatch');
  const name = document.getElementById('current-color-name');
  if (swatch) swatch.style.background = `hsl(${hue} 92% 48%)`;
  if (name) name.textContent = `${colorLabel(hue)} ${Math.round(hue)}°`;
}

function applyCopy(index) {
  previewState.copyIndex = ((index % copySets.length) + copySets.length) % copySets.length;
  const set = copySets[previewState.copyIndex];
  document.querySelectorAll('[data-copy-key]').forEach(el => {
    const value = set[el.dataset.copyKey];
    if (value) el.innerHTML = value;
  });
  const label = document.getElementById('current-copy-name');
  if (label) label.textContent = set.name;
}

function refreshLocks() {
  const themeButton = document.getElementById('lock-theme');
  const copyButton = document.getElementById('lock-copy');
  themeButton?.classList.toggle('locked', previewState.lockTheme);
  copyButton?.classList.toggle('locked', previewState.lockCopy);
  if (themeButton) themeButton.textContent = previewState.lockTheme ? 'Unlock Color' : 'Lock Color';
  if (copyButton) copyButton.textContent = previewState.lockCopy ? 'Unlock Text' : 'Lock Text';
}

function toggleThemeLock() {
  previewState.lockTheme = !previewState.lockTheme;
  refreshLocks();
  savePreview();
  showToast(previewState.lockTheme ? 'Color locked' : 'Color unlocked');
}

function toggleCopyLock() {
  previewState.lockCopy = !previewState.lockCopy;
  refreshLocks();
  savePreview();
  showToast(previewState.lockCopy ? 'Text locked' : 'Text unlocked');
}

document.getElementById('lock-theme')?.addEventListener('click', toggleThemeLock);
document.getElementById('lock-copy')?.addEventListener('click', toggleCopyLock);

const customizer = document.getElementById('client-customizer');
function setCustomizerCollapsed(collapsed) {
  customizer?.classList.toggle('collapsed', collapsed);
  document.getElementById('customizer-toggle')?.setAttribute('aria-expanded', String(!collapsed));
}
document.getElementById('customizer-close')?.addEventListener('click', () => setCustomizerCollapsed(true));
document.getElementById('customizer-toggle')?.addEventListener('click', () => setCustomizerCollapsed(false));

applyHue(previewState.hue);
applyCopy(previewState.copyIndex);
refreshLocks();

let lastFrame = performance.now();
function animateColor(now) {
  const delta = Math.min(now - lastFrame, 100);
  lastFrame = now;
  if (!previewState.lockTheme) applyHue(previewState.hue + delta * 0.006);
  requestAnimationFrame(animateColor);
}
requestAnimationFrame(animateColor);

setInterval(() => {
  if (!previewState.lockCopy) applyCopy(previewState.copyIndex + 1);
}, 5200);

window.addEventListener('beforeunload', savePreview);
