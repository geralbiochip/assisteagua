document.addEventListener('click',function(e){const b=e.target.closest('.sv-toggle');if(!b)return;const paused=b.closest('.solar-v2').classList.toggle('sv-paused');b.setAttribute('aria-pressed',String(paused));b.textContent=paused?b.dataset.play:b.dataset.pause;});

/* Descricao das duas ilustracoes do topo, sem alterar o esquema tecnico. */
(()=>{
 const image=document.querySelector('main .hero img');if(!image)return;
 const lang=(document.documentElement.lang||'pt').split('-')[0];
 const alt={pt:'Ilustrações alternadas de sistemas solares térmicos e fotovoltaicos',en:'Alternating illustrations of solar thermal and photovoltaic systems',es:'Ilustraciones alternadas de sistemas solares térmicos y fotovoltaicos',fr:'Illustrations alternées de systèmes solaires thermiques et photovoltaïques'};
 image.alt=alt[lang]||alt.pt;
})();
