const subjects=[
["English Language","Composition · Letter · Grammar"],["English Literature","Drama · Prose · Poetry"],["Mathematics","Algebra · Geometry · Trigonometry"],["Physics","Force · Light · Sound · Electricity"],["Chemistry","Bonding · Acids · Electrolysis"],["Biology","Genetics · Physiology · Ecology"],["History & Civics","Constitution · National Movement"],["Geography","Climate · Soil · Industries"],["Computer Applications","Java · Classes · Arrays"],["Odia","ପାଠ୍ୟକ୍ରମ · ବ୍ୟାକରଣ"]
];
const chapters={
"Mathematics":["Goods and Services Tax","Banking","Shares and Dividends","Linear Inequations","Quadratic Equations","Ratio and Proportion","Matrices","Arithmetic Progression","Coordinate Geometry","Similarity","Loci","Circles","Constructions","Mensuration","Trigonometry","Heights and Distances","Statistics","Probability"],
"Physics":["Force","Work, Energy and Power","Machines","Refraction of Light","Sound","Current Electricity","Household Circuits","Electromagnetism","Calorimetry","Radioactivity"],
"Biology":["Cell Cycle and Cell Division","Structure of Chromosome","Genetics","Absorption by Roots","Transpiration","Photosynthesis","Chemical Coordination","Nervous System","Sense Organs","Circulatory System","Excretory System","Population","Pollution"]
};
// Add verified PDFs here. Use a direct PDF URL or a hosted file path.
// View opens the browser PDF viewer; Download uses the download action separately.
const chapterFiles = {
  // Example:
  // "Biology|Pollution":[{title:"Pollution — Revision Notes",source:"Oswaal",url:"assets/biology-pollution.pdf"}]
};
let subjectNow="",chapterNow="",installPrompt=null;
const $=s=>document.querySelector(s);
function go(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));window.scrollTo(0,0)}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
function renderSubjects(){$("#subjects").innerHTML=subjects.map(([n,d])=>`<button class="subject" data-subject="${n}"><b>${n}</b><small>${d}</small></button>`).join("");document.querySelectorAll("[data-subject]").forEach(b=>b.onclick=()=>openSubject(b.dataset.subject))}
function openSubject(n){subjectNow=n;$("#subjectName").textContent=n;const list=chapters[n]||["Chapter list to be verified and added"];$("#chapters").innerHTML=list.map(c=>`<button class="chapter" data-ch="${c}"><b>${c}</b><span>Open →</span></button>`).join("");document.querySelectorAll("[data-ch]").forEach(b=>b.onclick=()=>openChapter(b.dataset.ch));go("subject")}
function openChapter(c){chapterNow=c;$("#chapterName").textContent=c;$("#chapterSubject").textContent=subjectNow.toUpperCase();const files=chapterFiles[subjectNow+"|"+c]||[];$("#chapterFiles").innerHTML=files.length?files.map((f,i)=>`<article class="file-card"><div class="file-top"><span class="pdf-icon">▤</span><div><b>${esc(f.title)}</b><small>${esc(f.source||"Study material")} · PDF</small></div></div><div class="file-actions"><a class="view-btn" href="#" data-viewpdf="${i}">View PDF</a><a class="download-btn" href="${esc(f.url)}" download>Download</a></div></article>`).join(""):`<div class="notice"><b>No verified PDF added yet</b><p>Chapter resources will be added here after checking the original source and permissions.</p></div>`;document.querySelectorAll("[data-viewpdf]").forEach(b=>b.onclick=e=>{e.preventDefault();const f=files[Number(b.dataset.viewpdf)];openPdf(f)});$("#saveChapter").textContent=saved().includes(subjectNow+" — "+c)?"★ Saved":"☆ Save chapter";go("chapter")}
function openPdf(f){$("#pdfTitle").textContent=f.title;$("#pdfFrame").src=f.url;$("#pdfOpenNew").href=f.url;go("pdfviewer")}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function saved(){return JSON.parse(localStorage.getItem("icseHubSaved")||"[]")}
function updateSaved(a){localStorage.setItem("icseHubSaved",JSON.stringify(a));renderSaved()}
$("#saveChapter").onclick=()=>{const key=subjectNow+" — "+chapterNow;const a=saved();if(!a.includes(key))a.push(key);updateSaved(a);$("#saveChapter").textContent="★ Saved"};
function renderSaved(){const a=saved();$("#savedList").innerHTML=a.length?a.map(x=>`<div class="chapter"><b>${esc(x)}</b><button class="back" data-del="${esc(x)}">Remove</button></div>`).join(""):"<p class='muted'>No saved chapters yet.</p>";document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>updateSaved(saved().filter(x=>x!==b.dataset.del)))}
renderSubjects();renderSaved();
if("serviceWorker"in navigator && location.protocol!=="file:")addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installBtn").classList.remove("hidden")});
$("#installBtn").onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installBtn").classList.add("hidden")};
