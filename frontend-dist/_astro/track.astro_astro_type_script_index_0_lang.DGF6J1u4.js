import{S as m,a as v}from"./sampleData.DGhD8K6R.js";const x="http://localhost:3000/api",u=document.getElementById("trackForm"),a=document.getElementById("trackInput"),d=document.getElementById("trackResultContainer"),i=document.getElementById("resultBody"),l=document.getElementById("resultTitle"),c=document.getElementById("trackLoading");async function p(t){if(!d||!i||!c)return;c.classList.remove("hidden"),d.classList.add("hidden");let e=null,n=[];try{const r=await fetch(`${x}/complaints/${t}`,{credentials:"include"});r.ok&&(e=(await r.json()).data)}catch{}if(e||(e=m.find(r=>r.id===t),n=v[t]||[]),c.classList.add("hidden"),!e){d.classList.remove("hidden"),l&&(l.textContent=`⚠️ TICKET #${t} NOT FOUND`),i.innerHTML=`
        <div class="text-center py-8">
          <div class="text-4xl mb-2">🕵️‍♂️</div>
          <h4 class="font-extrabold text-base mb-1">No ticket found with ID #${t}</h4>
          <p class="text-xs text-gray-600 mb-4">Please verify the ticket number or check if it was filed under private whistleblower status.</p>
          <a href="/" class="retro-btn retro-btn-pixel retro-btn-yellow">Browse Public Feed</a>
        </div>
      `;return}const s=e.status==="resolved",o=e.status==="in_progress",g=e.status==="under_review";d.classList.remove("hidden"),l&&(l.textContent=`📋 TICKET #${e.id} • ${e.category.toUpperCase()}`),i.innerHTML=`
      <div class="flex flex-col gap-5">
        <!-- Top Details -->
        <div class="flex justify-between items-center gap-3 flex-wrap border-b border-gray-200 pb-4">
          <div>
            <div class="flex gap-2 mb-1">
              <span class="retro-badge text-xs font-bold">⚡ ${e.priority.toUpperCase()}</span>
              <span class="retro-badge text-xs font-bold" style="background: var(--pastel-mint)">🏢 ${e.category.toUpperCase()}</span>
            </div>
            <h3 class="font-extrabold text-lg text-black">${e.title}</h3>
          </div>
          <div class="font-mono text-xs font-bold px-3 py-1.5 border-2 border-black rounded ${s?"bg-emerald-300":o?"bg-sky-200":"bg-amber-200"}">
            ${e.status.replace("_"," ").toUpperCase()} ${s?"✔":""}
          </div>
        </div>

        <!-- Progress Lifecycle -->
        <div class="border-2 border-black rounded-lg p-4 bg-orange-50/40">
          <div class="text-xs font-mono font-bold mb-3">CURRENT RESOLUTION STAGE</div>
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="p-2 border-2 border-black rounded bg-emerald-200 font-bold">
              1. Submitted ✔
            </div>
            <div class="p-2 border-2 border-black rounded ${g||o||s?"bg-emerald-200 font-bold":"bg-gray-100 text-gray-400"}">
              2. Triage ${g||o||s?"✔":""}
            </div>
            <div class="p-2 border-2 border-black rounded ${o||s?"bg-emerald-200 font-bold":"bg-gray-100 text-gray-400"}">
              3. Repair ${o?"🔨":s?"✔":""}
            </div>
            <div class="p-2 border-2 border-black rounded ${s?"bg-emerald-300 font-extrabold text-emerald-900":"bg-gray-100 text-gray-400"}">
              4. Resolved ${s?"✔":""}
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 border border-gray-300 rounded">
          ${e.description}
        </p>

        ${e.resolutionNote?`
          <div class="bg-emerald-50 border-2 border-emerald-600 rounded-lg p-4 text-emerald-900">
            <div class="font-mono text-xs font-extrabold mb-1">🛠️ OFFICIAL VERIFIED RESOLUTION:</div>
            <p class="text-sm leading-relaxed">${e.resolutionNote}</p>
          </div>
        `:""}

        <!-- Timelines -->
        ${n.length>0?`
          <div class="border-t border-gray-200 pt-4">
            <h4 class="font-mono text-xs font-extrabold mb-3">⏱️ DISPATCH & TECHNICIAN LOGS:</h4>
            <div class="flex flex-col gap-2">
              ${n.map(r=>`
                <div class="bg-white border-2 border-black rounded p-3 text-xs flex flex-col gap-1 shadow-sm">
                  <div class="flex justify-between font-bold text-gray-800">
                    <span>${r.author} (${r.role})</span>
                    <span class="text-gray-500 font-mono">${r.time}</span>
                  </div>
                  <p class="text-gray-600">${r.content}</p>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}
      </div>
    `}u?.addEventListener("submit",t=>{t.preventDefault(),a&&a.value&&p(parseInt(a.value,10))});document.querySelectorAll(".quick-chip").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-id");e&&a&&(a.value=e,p(parseInt(e,10)))})});const f=new URLSearchParams(window.location.search),b=f.get("id");b&&(a&&(a.value=b),p(parseInt(b,10)));
