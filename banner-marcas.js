(() => {
 const source=document.currentScript;
 const assetBase=new URL('.',source&&source.src?source.src:document.baseURI);
 function localLinks(){
  if(location.protocol!=='file:')return;
  const parts=decodeURIComponent(location.pathname).replace(/\\/g,'/').split('/');
  const prefix=['en','es','fr'].includes(parts[parts.length-2])?'../':'';
  document.querySelectorAll('a[href]').forEach(a=>{
   const raw=a.getAttribute('href');if(!raw||raw.startsWith('#'))return;
   let u;try{u=new URL(raw,document.baseURI);}catch(_){return;}
   let dest;
   if(u.hostname==='geralbiochip.github.io'&&(u.pathname==='/assisteagua'||u.pathname.startsWith('/assisteagua/')))dest=u.pathname.replace(/^\/assisteagua\/?/,'');
   else if(['www.assisteagua.pt','assisteagua.pt'].includes(u.hostname))dest=u.pathname.replace(/^\//,'');
   else if(u.protocol==='file:'){
    if(!u.searchParams.has('verificar'))return;
    u.searchParams.delete('verificar');a.setAttribute('href',raw.split('?')[0].split('#')[0]+u.search+u.hash);return;
   }else return;
   if(!dest||dest.endsWith('/'))dest+='index.html';
   u.searchParams.delete('verificar');a.setAttribute('href',prefix+dest+u.search+u.hash);
  });
 }
 function brands(){document.querySelectorAll('.bb-banner').forEach(s=>{
  const b=s.querySelector('.bb-pause');if(!b||b.dataset.bannerReady)return;b.dataset.bannerReady='true';
  const m=matchMedia('(prefers-reduced-motion: reduce)');const pref=()=>s.classList.toggle('is-reduced',m.matches);pref();
  if(m.addEventListener)m.addEventListener('change',pref);
  b.addEventListener('click',()=>{const p=s.classList.toggle('is-paused');b.setAttribute('aria-pressed',String(p));b.textContent=p?b.dataset.play:b.dataset.pause;});
 });}
 function illustration(){
  const name=decodeURIComponent(location.pathname).split('/').pop().toLowerCase();
  let kind;
  if(['contato.html','contacto.html','previsualizacao-contactos-animados.html'].includes(name))kind='contact';
  else if(['sobre.html','previsualizacao-sobre-nos-animado.html'].includes(name))kind='about';
  else if(['portfolio.html','loja.html','previsualizacao-portfolio-ilustracao.html'].includes(name))kind='portfolio';else return;
  const hero=document.querySelector('main .hero'),grid=hero&&hero.querySelector('.hero-grid');
  if(!grid||grid.querySelector('.page-illustration,.portfolio-illustration'))return;
  const lang=(document.documentElement.lang||'pt').split('-')[0];
  const controls={pt:['Pausar animação','Retomar animação'],en:['Pause animation','Resume animation'],es:['Pausar animación','Reanudar animación'],fr:['Mettre en pause','Reprendre l’animation']};
  const alts={contact:{pt:'Ilustração de contacto com profissionais, ícones e equipamentos técnicos',en:'Contact illustration with professionals, icons and technical equipment',es:'Ilustración de contacto con profesionales, iconos y equipos técnicos',fr:'Illustration de contact avec professionnels, icônes et équipements techniques'},about:{pt:'Ilustração de profissionais junto de uma casa com equipamentos de aquecimento e climatização',en:'Illustration of professionals beside a house with heating and air conditioning equipment',es:'Ilustración de profesionales junto a una vivienda con calefacción y climatización',fr:'Illustration de professionnels près d’une maison avec chauffage et climatisation'},portfolio:{pt:'Ilustração de uma casa com equipamentos de aquecimento e água quente e câmaras fotográficas',en:'Illustration of a house with heating and hot water equipment and cameras',es:'Ilustración de una vivienda con calefacción, agua caliente y cámaras fotográficas',fr:'Illustration d’une maison avec chauffage, eau chaude et appareils photo'}};
  const captions={pt:'Imagem ilustrativa. Utilize o formulário real mais abaixo para enviar o pedido.',en:'Illustrative image. Use the actual form below to send your request.',es:'Imagen ilustrativa. Utilice el formulario real más abajo para enviar su solicitud.',fr:'Image illustrative. Utilisez le véritable formulaire ci-dessous pour envoyer votre demande.'};
  const paths={contact:['images/contactos-ilustracao-animada.svg','images/contactos-ilustracao-estatica.jpg'],about:['images/sobre-nos-ilustracao-animada.svg','images/sobre-nos-ilustracao-estatica.jpg'],portfolio:['images/portfolio-ilustracao-animada.svg','images/portfolio-ilustracao-sem-textos.jpg']}[kind];
  const t=controls[lang]||controls.pt;
  hero.classList.remove('hero-text-only');hero.classList.add('hero-page-illustrated');if(kind==='contact')hero.classList.add('hero-contact-illustrated');
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('ilustracoes-paginas.css',assetBase).href;document.head.appendChild(css);
  const figure=document.createElement('figure');figure.className='page-illustration';
  const image=document.createElement('img');image.width=kind==='contact'?1584:1408;image.height=kind==='contact'?672:768;image.alt=alts[kind][lang]||alts[kind].pt;image.decoding='async';
  const button=document.createElement('button');button.type='button';
  const m=matchMedia('(prefers-reduced-motion: reduce)');let paused=m.matches;
  const animated=new URL(paths[0],assetBase).href,still=new URL(paths[1],assetBase).href;
  function state(){image.src=paused?still:animated;button.textContent=paused?t[1]:t[0];button.setAttribute('aria-pressed',String(paused));}
  button.addEventListener('click',()=>{paused=!paused;state();});if(m.addEventListener)m.addEventListener('change',e=>{paused=e.matches;state();});
  state();figure.appendChild(image);figure.appendChild(button);if(kind==='contact'){const c=document.createElement('figcaption');c.textContent=captions[lang]||captions.pt;figure.appendChild(c);}grid.appendChild(figure);
 }
 function loadContent(){if(document.querySelector('script[data-aa-service-content]'))return;const s=document.createElement('script');s.src=new URL('servicos-equipa-atualizacao.js',assetBase).href;s.setAttribute('data-aa-service-content','1');document.body.appendChild(s);}
 function init(){localLinks();brands();illustration();loadContent();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
