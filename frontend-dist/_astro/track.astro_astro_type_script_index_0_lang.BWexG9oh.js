import{_ as T,c as d,a as C,b as S,f as $}from"./i18n.Cf5JBIKd.js";import{g as A,f as h}from"./date.BUnGvB7c.js";const B="http://localhost:3000/api",N=document.getElementById("trackForm"),r=document.getElementById("trackInput"),c=document.getElementById("trackResultContainer"),g=document.getElementById("resultBody"),p=document.getElementById("resultTitle"),u=document.getElementById("trackLoading");async function m(s){if(!c||!g||!u)return;u.classList.remove("hidden"),c.classList.add("hidden");let t=null,b=[];try{const a=await fetch(`${B}/complaints/${s}`,{credentials:"include"});a.ok&&(t=(await a.json()).data)}catch{}if(!t)try{const a=await T(()=>import("./sampleData.BV8z0D97.js"),[]);t=a.SAMPLE_COMPLAINTS.find(n=>n.id===s),b=a.SAMPLE_TIMELINES[s]||[]}catch{t=null}u.classList.add("hidden");const x=localStorage.getItem("campusfix_lang")||"en",e=x==="bn";if(!t){c.classList.remove("hidden"),p&&(p.textContent=e?`⚠️ টিকিট #${d(s)} পাওয়া যায়নি`:`⚠️ TICKET #${s} NOT FOUND`),g.innerHTML=`
        <div class="text-center py-10">
          <div class="text-5xl mb-3">🕵️‍♂️</div>
          <h4 class="font-extrabold text-lg mb-1.5 text-black">
            ${e?`আইডি #${d(s)} এর কোনো অভিযোগ পাওয়া যায়নি`:`No complaint ticket found with ID #${s}`}
          </h4>
          <p class="text-xs sm:text-sm text-gray-600 mb-5 max-w-md mx-auto leading-relaxed">
            ${e?"টিকিট নম্বরটি সঠিক কিনা পরীক্ষা করুন অথবা এটি কোনো গোপনীয় হুইসেলব্লোয়ার রিপোর্ট কিনা নিশ্চিত হোন।":"Please verify the ticket ID number or check if this report was sealed under confidential whistleblower status."}
          </p>
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <a href="/" class="retro-btn retro-btn-pixel retro-btn-yellow text-xs">
              📢 ${e?"উন্মুক্ত ফিড ব্রাউজ করুন":"Browse Public Feed"}
            </a>
            <button type="button" class="retro-btn retro-btn-sm" onclick="document.getElementById('trackInput')?.focus()">
              🔄 ${e?"পুনরায় খুঁজুন":"Try Another ID"}
            </button>
          </div>
        </div>
      `;return}const o=t.status==="resolved",l=t.status==="in_progress",f=t.status==="under_review",i=A(t.category),y=e&&i.labelBn||i.label,w=C(t.priority,x),I=S(t.status,x),k=e?$(t.createdAt):h(t.createdAt),L=e?d(t.id):String(t.id),E=e?d(t.upvotesCount||0):String(t.upvotesCount||0);c.classList.remove("hidden"),p&&(p.textContent=e?`📋 টিকিট #${L} • ${y}`:`📋 TICKET #${t.id} • ${t.category.toUpperCase()}`),g.innerHTML=`
      <div class="flex flex-col gap-6">
        <!-- Top Metadata & Status Row -->
        <div class="flex justify-between items-start sm:items-center gap-4 flex-col sm:flex-row pb-5 border-b-2 border-gray-100">
          <div>
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="category-pill-sm font-bold text-xs" style="background: ${i.color}; border: 1.5px solid var(--border-black); padding: 0.2rem 0.55rem; border-radius: 6px;">
                ${i.icon} ${y}
              </span>
              <span class="retro-badge text-xs font-bold priority-badge priority-${t.priority}">
                ⚡ ${w.toUpperCase()}
              </span>
              ${t.visibility==="private"?'<span class="retro-badge" style="background: var(--pastel-rose)">🔒 '+(e?"গোপনীয় ভল্ট":"CONFIDENTIAL")+"</span>":""}
            </div>
            <h2 class="font-extrabold text-xl sm:text-2xl text-black tracking-tight">${t.title}</h2>
          </div>
          <div class="status-stamp stamp-${t.status}">
            ${I}
          </div>
        </div>

        <!-- 4-Stage Visual Progress Lifecycle Stepper -->
        <div class="p-4 sm:p-5 border-2 border-black rounded-xl bg-orange-50/50 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono text-xs font-bold text-gray-700 tracking-wider">
              ${e?"সমাধান পর্যায় ও অগ্রগতি লাইফসাইকেল":"RESOLUTION PROGRESS LIFECYCLE"}
            </span>
            <span class="font-mono text-[11px] text-gray-500">
              ${e?"দাখিলকৃত:":"Filed on:"} ${k}
            </span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg bg-emerald-200 font-bold shadow-sm">
              <div class="text-sm mb-0.5">✔</div>
              <span>${e?"১. দাখিল":"1. Submitted"}</span>
            </div>
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg ${f||l||o?"bg-emerald-200 font-bold shadow-sm":"bg-gray-100 text-gray-400 opacity-60"}">
              <div class="text-sm mb-0.5">${f||l||o?"✔":"⏳"}</div>
              <span>${e?"২. যাচাই":"2. Triage"}</span>
            </div>
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg ${l||o?"bg-emerald-200 font-bold shadow-sm":"bg-gray-100 text-gray-400 opacity-60"}">
              <div class="text-sm mb-0.5">${l?"🔨":o?"✔":"🔧"}</div>
              <span>${e?"৩. মেরামত":"3. Repair"}</span>
            </div>
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg ${o?"bg-emerald-300 font-extrabold text-emerald-950 shadow-sm":"bg-gray-100 text-gray-400 opacity-60"}">
              <div class="text-sm mb-0.5">${o?"🎉":"🏁"}</div>
              <span>${e?"৪. সমাধান":"4. Resolved"}</span>
            </div>
          </div>
        </div>

        <!-- Issue Description Box -->
        <div class="p-4 sm:p-5 border-2 border-black rounded-xl bg-white shadow-neo-sm">
          <div class="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📄</span>
            <span>${e?"অভিযোগের বিবরণ ও ভৌগোলিক অবস্থান":"COMPLAINT DETAILS & LOCATION"}</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
            ${t.description}
          </p>
        </div>

        <!-- Official Resolution Note Certificate (if available) -->
        ${t.resolutionNote?`
          <div class="p-5 border-2 border-emerald-600 rounded-xl bg-emerald-50 text-emerald-950 shadow-neo-sm">
            <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span class="font-mono text-xs font-extrabold flex items-center gap-1.5 text-emerald-800 uppercase tracking-wider">
                <span>🛠️</span>
                <span>${e?"যাচাইকৃত প্রক্টরিয়াল সমাধান সনদ:":"OFFICIAL VERIFIED RESOLUTION CERTIFICATE:"}</span>
              </span>
              ${t.resolvedAt?'<span class="retro-badge text-[10px]" style="background: var(--pastel-mint)">'+(e?$(t.resolvedAt):h(t.resolvedAt))+"</span>":""}
            </div>
            <p class="text-xs sm:text-sm leading-relaxed font-medium mb-3">
              ${t.resolutionNote}
            </p>
            <div class="text-[11px] font-mono text-emerald-700 flex items-center gap-2">
              <span>✍️ Verified By: University Maintenance & Proctorial Authority</span>
            </div>
          </div>
        `:""}

        <!-- Technician & Dispatch Timeline Logs -->
        ${b.length>0?`
          <div class="pt-2">
            <h4 class="font-mono text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>⏱️</span>
              <span>${e?"মেরামত কার্যক্রম ও টেকনিশিয়ান লগ":"DISPATCH TIMELINE & TECHNICIAN LOGS"}</span>
            </h4>
            <div class="flex flex-col gap-2.5">
              ${b.map(a=>`
                <div class="bg-white border-2 border-black rounded-lg p-3.5 text-xs flex flex-col gap-1.5 shadow-sm transition-all hover:bg-yellow-50/50">
                  <div class="flex justify-between items-center font-bold text-gray-900 flex-wrap gap-1">
                    <span class="flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span>${a.author}</span>
                      <small class="text-gray-500 font-mono">(${a.role})</small>
                    </span>
                    <span class="text-gray-500 font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded border border-gray-300">${a.time}</span>
                  </div>
                  <p class="text-gray-700 leading-relaxed font-medium pl-3.5 border-l-2 border-gray-200">${a.content}</p>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}

        <!-- Action Footer -->
        <div class="pt-4 border-t border-gray-200 flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2 flex-wrap">
            <button type="button" class="retro-btn retro-btn-sm card-upvote-btn" data-id="${t.id}">
              <span>👍</span>
              <span>${e?"+১ আমিও ভুক্তভোগী":"+1 Me Too"}</span>
              <span class="font-mono font-bold">(${E})</span>
            </button>
            <button type="button" class="retro-btn retro-btn-sm" id="shareTrackLinkBtn">
              <span>🔗</span>
              <span>${e?"লিংক কপি করুন":"Share Ticket"}</span>
            </button>
          </div>
          <button type="button" class="retro-btn retro-btn-sm retro-btn-pixel retro-btn-pink open-create-modal-trigger">
            <span>✉️</span>
            <span>${e?"+ নতুন অভিযোগ দাখিল":"+ File New Issue"}</span>
          </button>
        </div>
      </div>
    `,document.getElementById("shareTrackLinkBtn")?.addEventListener("click",()=>{const a=`${window.location.origin}/track?id=${t.id}`;navigator.clipboard.writeText(a);const n=document.getElementById("toast");n&&(n.textContent=e?"✔ টিকিট লিংক কপি করা হয়েছে":"✔ Ticket link copied to clipboard",n.className="retro-toast show",setTimeout(()=>n.className="retro-toast",2500))})}N?.addEventListener("submit",s=>{s.preventDefault(),r&&r.value&&m(parseInt(r.value,10))});document.querySelectorAll(".quick-chip").forEach(s=>{s.addEventListener("click",()=>{const t=s.getAttribute("data-id");t&&r&&(r.value=t,m(parseInt(t,10)))})});window.addEventListener("campusfix:langchange",()=>{r&&r.value&&m(parseInt(r.value,10))});const P=new URLSearchParams(window.location.search),v=P.get("id");v&&(r&&(r.value=v),m(parseInt(v,10)));
