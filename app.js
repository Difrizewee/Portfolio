/* app.js */
(function(){
  const qs = s => document.querySelector(s);
  const qsa = s => document.querySelectorAll(s);
  // Mobile menu
  const menuToggle = qs('.menu-toggle'), navUl = qs('nav ul');
  menuToggle.addEventListener('click',()=>navUl.classList.toggle('open'));
  // Navigation
  qsa('nav a').forEach(link=>{
    link.addEventListener('click',e=>{
      e.preventDefault();
      const tgt=link.getAttribute('href').slice(1);
      qsa('section').forEach(s=>s.classList.remove('active'));
      qs('#'+tgt).classList.add('active');
      qsa('nav a').forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  // Hero scroll
  qs('[data-scroll="templates"]').addEventListener('click',()=>{
    qs('nav a[href="#templates"]').click();
  });
  // Slider
  let idx=0; const slides=qsa('#slider .slide');
  function show(i){if(i<0)i=slides.length-1; if(i>=slides.length)i=0; qs('#slider .slides').style.transform=`translateX(-${i*100}% )`; idx=i;}
  qs('#prevSlide').onclick=()=>show(idx-1); qs('#nextSlide').onclick=()=>show(idx+1);
  setInterval(()=>show(idx+1),5000);
  // Templates
  const templates=[
    {id:1,name:'Designer',prof:'designer',img:'https://via.placeholder.com/300x180?text=Designer'},
    {id:2,name:'Developer',prof:'developer',img:'https://via.placeholder.com/300x180?text=Dev'},
    {id:3,name:'Videomaker',prof:'videomaker',img:'https://via.placeholder.com/300x180?text=Video'},
    {id:4,name:'Universal',prof:'universal',img:'https://via.placeholder.com/300x180?text=Universal'}
  ];
  const grid=qs('#templateGrid');
  function renderTemplates(filter='all'){
    grid.innerHTML='';
    templates.filter(t=>filter==='all'||t.prof===filter).forEach(t=>{
      const card=document.createElement('div');card.className='template-card animate-fade-in-up';
      card.innerHTML=`<img src="${t.img}" alt="${t.name}"><div class="template-card-body"><h3>${t.name}</h3><p class="small-text">${t.prof}</p><button class="btn-secondary" onclick="openTemplate(${t.id})">Use</button></div>`;
      grid.appendChild(card);
    });
  }
  qs('#profFilter').addEventListener('change',e=>renderTemplates(e.target.value)); renderTemplates();
  window.openTemplate=id=>{const tpl=templates.find(x=>x.id===id);const c=qs('#canvas');c.innerHTML='';const img=document.createElement('img');img.src=tpl.img;c.appendChild(img);qs('nav a[href="#editor"]').click();};
  // Drag & Drop
  const blocks=qsa('.toolbox .block'), canvas=qs('#canvas'); let itemId=0;
  blocks.forEach(b=>b.addEventListener('dragstart',e=>e.dataTransfer.setData('type',b.dataset.type)));
  canvas.addEventListener('dragover',e=>e.preventDefault());
  canvas.addEventListener('drop',e=>{e.preventDefault(); if(canvas.querySelector('.empty'))canvas.querySelector('.empty').remove();
    const type=e.dataTransfer.getData('type'), item=document.createElement('div');
    item.className='item'; item.style.left=e.offsetX+'px'; item.style.top=e.offsetY+'px'; item.dataset.id=++itemId;
    const rem=document.createElement('div');rem.className='remove';rem.innerText='×';rem.onclick=()=>item.remove(); item.appendChild(rem);
    if(type==='text'){const txt=prompt('Enter text:');item.append(txt);} 
    if(type==='image'){const url=prompt('Image URL:');const im=document.createElement('img');im.src=url;item.appendChild(im);} 
    if(type==='video'){const url=prompt('Video Embed URL:');const vf=document.createElement('iframe');vf.src=url;vf.width=200;vf.height=113;item.appendChild(vf);} 
    item.draggable=true; item.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/html',item.outerHTML);item.remove();}); canvas.appendChild(item);
  });
  // Save & Dashboard
  qs('#saveBtn').addEventListener('click',()=>{const name=prompt('Name:'); if(!name)return;const list=JSON.parse(localStorage.getItem('portfolios')||'[]'); list.push({id:Date.now(),name,content:canvas.innerHTML}); localStorage.setItem('portfolios',JSON.stringify(list)); load(); alert('Saved');});
  function load(){const ul=qs('#portfolioList');ul.innerHTML='';const list=JSON.parse(localStorage.getItem('portfolios')||'[]'); list.forEach(p=>{const li=document.createElement('li'); li.innerHTML=`<span>${p.name}</span><div><button onclick="view(${p.id})" class="btn btn-secondary">View</button><button onclick="del(${p.id})" class="btn btn-secondary">Delete</button></div>`;ul.appendChild(li);});}
  window.view=id=>{const list=JSON.parse(localStorage.getItem('portfolios')||'[]'),p=list.find(x=>x.id===id); if(p){canvas.innerHTML=p.content;qs('nav a[href="#editor"]').click();}};
  window.del=id=>{let list=JSON.parse(localStorage.getItem('portfolios')||'[]'); list=list.filter(x=>x.id!==id); localStorage.setItem('portfolios',JSON.stringify(list)); load();}; load();
  // Modal
  const modal=qs('#modal'), body=qs('#modalBody'); qs('.modal-close').addEventListener('click',()=>modal.classList.remove('active'));
  window.showModal=html=>{body.innerHTML=html;modal.classList.add('active')};
  // Contact Form
  qs('#contactForm').addEventListener('submit',e=>{e.preventDefault(); const n=qs('#contactName').value.trim(), em=qs('#contactEmail').value.trim(), m=qs('#contactMessage').value.trim(); if(n.length<2||!em.includes('@')||m.length<10){alert('Заполните все поля корректно');return;} alert('Спасибо, '+n+'! Ваше сообщение отправлено.'); e.target.reset();});
  // Subscribe
  qs('#subscribeBtn').addEventListener('click',()=>{const em=qs('#subscribeEmail').value.trim(); if(!em.includes('@')){alert('Неверный Email'); return;} alert('Подписка оформлена: '+em);});
  // Theme Editor
  qs('#themeForm').addEventListener('submit',e=>{e.preventDefault(); document.documentElement.style.setProperty('--color-accent',qs('#primaryColor').value); document.documentElement.style.setProperty('--color-danger',qs('#secondaryColor').value); document.body.style.fontFamily=qs('#fontSelect').value;});
})();
""" 

# Write files
Path('/mnt/data/index.html').write_text(content.split("/* style.css */")[0].trim(), encoding='utf-8')
Path('/mnt/data/style.css').write_text("/* style.css */
" + content.split("/* style.css */")[1].split("/* app.js */")[0].trim(), encoding='utf-8')
Path('/mnt/data/app.js').write_text(content.split("/* app.js */")[1].trim(), encoding='utf-8')
