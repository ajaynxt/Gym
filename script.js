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
