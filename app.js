const STORAGE_KEY = 'bzk-infofiche-v1';
const fields = [...document.querySelectorAll('#infoForm [name]')];
const detailConfig = [
  ['location', 'Locatie'], ['route', 'Aanrijroute'], ['contacts', 'Contactgegevens'],
  ['radio', 'Radiocommunicatie'], ['peb', 'PEB bij opschaling externe hulpdiensten (Punt Eerste Bestemming)'],
  ['vehicles', 'Voertuigen ter plaatse'], ['emergency', 'Noodplanning']
];
let images = [];

function escapeHtml(value='') { const node=document.createElement('div'); node.textContent=value; return node.innerHTML; }
function formatDateTime(value) { if(!value) return ''; const d=new Date(value); return new Intl.DateTimeFormat('nl-BE',{dateStyle:'short',timeStyle:'short'}).format(d); }
function formatDate(value) { if(!value) return ''; return new Intl.DateTimeFormat('nl-BE',{dateStyle:'short'}).format(new Date(value+'T00:00')); }
function values() { return Object.fromEntries(fields.map(field => [field.name, field.value])); }

function render() {
  const data=values();
  document.querySelectorAll('[data-output]').forEach(el => {
    const key=el.dataset.output;
    el.textContent = ['start','end'].includes(key) ? formatDateTime(data[key]) : data[key];
  });
  document.querySelector('#detailSections').innerHTML=detailConfig.map(([key,title]) =>
    `<section class="detail-block"><div class="detail-title">${title}</div><div class="detail-body">${escapeHtml(data[key])}</div></section>`
  ).join('');
  const meta=[data.documentDate ? `Datum: ${formatDate(data.documentDate)}` : '', data.procedure ? `Procedure: ${escapeHtml(data.procedure)}` : '', data.manager ? `Dossierbeheerder: ${escapeHtml(data.manager)}` : '', data.reference ? `Ref.: ${escapeHtml(data.reference)}` : ''].filter(Boolean).join(' • ');
  document.querySelector('#footerMeta').innerHTML=meta;
  renderImages();
}

function renderImages() {
  const editor=document.querySelector('#imageEditor');
  editor.innerHTML=images.map((item,index)=>`<div class="image-row"><img src="${item.src}" alt=""><input aria-label="Bijschrift afbeelding ${index+1}" data-caption="${index}" value="${escapeHtml(item.caption)}" placeholder="Bijschrift"><button class="remove-image" data-remove="${index}" type="button">Verwijder</button></div>`).join('');
  document.querySelector('#imagePreview').innerHTML=images.map(item=>`<figure class="preview-image"><img src="${item.src}" alt="${escapeHtml(item.caption)}"><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`).join('');
  document.querySelector('#attachmentSheet').classList.toggle('hidden', images.length===0);
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({fields:values(),images})); }
  catch { showToast('Afbeeldingen zijn te groot om automatisch te bewaren.'); }
}
function load() {
  try {
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(!stored) return;
    fields.forEach(field => { if(stored.fields?.[field.name] != null) field.value=stored.fields[field.name]; });
    images=stored.images || [];
  } catch { localStorage.removeItem(STORAGE_KEY); }
}
function showToast(message) { const toast=document.querySelector('#toast'); toast.textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2200); }

document.querySelector('#infoForm').addEventListener('input', event => {
  if(event.target.dataset.caption != null) images[Number(event.target.dataset.caption)].caption=event.target.value;
  render(); save();
});
document.querySelector('#imageEditor').addEventListener('click', event => {
  if(event.target.dataset.remove == null) return;
  images.splice(Number(event.target.dataset.remove),1); render(); save();
});
document.querySelector('#imageInput').addEventListener('change', async event => {
  const files=[...event.target.files].slice(0, 4-images.length);
  for(const file of files) images.push({src:await resizeImage(file),caption:file.name.replace(/\.[^.]+$/,'')});
  event.target.value=''; render(); save();
});
document.querySelector('#mapImageInput').addEventListener('change', async event => {
  const file=event.target.files[0]; if(!file) return;
  const existing=images.findIndex(item=>item.isMap);
  const map={src:await resizeImage(file),caption:'Kaart locatie / aanrijroute',isMap:true};
  if(existing>=0) images[existing]=map;
  else if(images.length<4) images.unshift(map);
  else return showToast('Verwijder eerst een andere afbeelding.');
  event.target.value=''; render(); save(); showToast('Kaartafdruk toegevoegd.');
});
document.querySelector('#mapsButton').addEventListener('click',()=>{
  const address=document.querySelector('[name=activityLocation]').value.trim();
  if(!address) return showToast('Vul eerst de locatie van de activiteit in.');
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,'_blank','noopener');
});
document.querySelector('#printButton').addEventListener('click',()=>{
  render();
  setTimeout(()=>window.print(),100);
});
document.querySelector('#clearButton').addEventListener('click',()=>{
  if(!confirm('Alle ingevulde gegevens wissen en een nieuwe fiche starten?')) return;
  document.querySelector('#infoForm').reset(); images=[]; localStorage.removeItem(STORAGE_KEY); render(); showToast('Nieuwe fiche gestart.');
});

function resizeImage(file) {
  return new Promise((resolve,reject)=>{
    const reader=new FileReader(); reader.onerror=reject; reader.onload=()=>{
      const img=new Image(); img.onerror=reject; img.onload=()=>{
        const max=1600, scale=Math.min(1,max/Math.max(img.width,img.height));
        const canvas=document.createElement('canvas'); canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale);
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height); resolve(canvas.toDataURL('image/jpeg',.82));
      }; img.src=reader.result;
    }; reader.readAsDataURL(file);
  });
}

load();
if(!document.querySelector('[name=documentDate]').value) document.querySelector('[name=documentDate]').value=new Date().toISOString().slice(0,10);
render();
