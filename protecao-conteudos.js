/* AssisteAgua: dissuasao de copia casual; nao impede capturas ou acesso aos ficheiros. */
(()=>{
 'use strict';
 if(window.__aaContentGuard)return;
 window.__aaContentGuard=true;
 const media='img,picture,svg,canvas';
 const calculator='.btu-widget-card,.btu-content-card,#btu-calc-form,#btu-result-box';
 const guarded=media+','+calculator;
 const asElement=node=>node instanceof Element?node:node&&node.parentElement;
 const editable=node=>{const el=asElement(node);return !!(el&&el.closest('input,textarea,select,[contenteditable="true"],[contenteditable=""]'));};
 function protectedTarget(node){
  const el=asElement(node);if(!el)return false;
  if(el.closest(guarded))return true;
  const a=el.closest('a[href]');
  if(a){try{if(/\.(?:png|jpe?g|gif|webp|avif|svg|bmp|ico)$/i.test(new URL(a.href,document.baseURI).pathname))return true;}catch(_){}}
  for(let p=el;p&&p!==document.documentElement;p=p.parentElement){
   if(/url\(/i.test(getComputedStyle(p).backgroundImage||''))return true;
  }
  return false;
 }
 function protectedSelection(){
  const selection=window.getSelection();if(!selection||selection.isCollapsed)return false;
  for(let i=0;i<selection.rangeCount;i++){
   const range=selection.getRangeAt(i);
   for(const node of document.querySelectorAll(guarded)){
    try{if(range.intersectsNode(node))return true;}catch(_){}
   }
  }
  return false;
 }
 document.addEventListener('contextmenu',event=>{
  if(!editable(event.target)&&protectedTarget(event.target))event.preventDefault();
 },true);
 document.addEventListener('dragstart',event=>{
  if(!editable(event.target)&&protectedTarget(event.target))event.preventDefault();
 },true);
 document.addEventListener('selectstart',event=>{
  if(!editable(event.target)&&protectedTarget(event.target))event.preventDefault();
 },true);
 document.addEventListener('copy',event=>{
  if(editable(event.target))return;
  if(protectedTarget(event.target)||protectedSelection()){
   event.preventDefault();if(event.clipboardData)event.clipboardData.clearData();
  }
 },true);
 document.addEventListener('keydown',event=>{
  if(editable(event.target))return;
  if((event.ctrlKey||event.metaKey)&&String(event.key).toLowerCase()==='c'&&(protectedTarget(event.target)||protectedSelection()))event.preventDefault();
 },true);
 function mark(root){
  if(!(root instanceof Element))return;
  if(root.matches(media))root.setAttribute('draggable','false');
  root.querySelectorAll(media).forEach(el=>el.setAttribute('draggable','false'));
 }
 function init(){
  mark(document.documentElement);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(mark))).observe(document.documentElement,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
