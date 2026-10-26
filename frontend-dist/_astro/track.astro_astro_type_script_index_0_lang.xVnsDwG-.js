import{_ as T,c as d,a as A,b as C,f as $}from"./i18n.Cf5JBIKd.js";import{g as S,f as w}from"./date.BUnGvB7c.js";const B="http://localhost:3000/api",N=document.getElementById("trackForm"),r=document.getElementById("trackInput"),c=document.getElementById("trackResultContainer"),u=document.getElementById("resultBody"),p=document.getElementById("resultTitle"),g=document.getElementById("trackLoading");async function m(a){if(!c||!u||!g)return;g.classList.remove("hidden"),c.classList.add("hidden");let e=null,b=[];try{const s=await fetch(`${B}/complaints/${a}`,{credentials:"include"});s.ok&&(e=(await s.json()).data)}catch{}if(!e)try{const s=await T(()=>import("./sampleData.BK24nggF.js"),[]);e=s.SAMPLE_COMPLAINTS.find(n=>n.id===a),b=s.SAMPLE_TIMELINES[a]||[]}catch{e=null}g.classList.add("hidden");const x=localStorage.getItem("campusfix_lang")||"en",t=x==="bn";if(!e){c.classList.remove("hidden"),p&&(p.textContent=t?`⚠️ টিকিট #${d(a)} পাওয়া যায়নি`:`⚠️ TICKET #${a} NOT FOUND`),u.innerHTML=`
        <div class="text-center py-10">
          <div class="text-5xl mb-3">🕵️‍♂️</div>
          <h4 class="font-extrabold text-lg mb-1.5 text-black">
            ${t?`আইডি #${d(a)} এর কোনো অভিযোগ পাওয়া যায়নি`:`No complaint ticket found with ID #${a}`}
          </h4>
          <p class="text-xs sm:text-sm text-gray-600 mb-5 max-w-md mx-auto leading-relaxed">
            ${t?"টিকিট নম্বরটি সঠিক কিনা পরীক্ষা করুন অথবা এটি কোনো গোপনীয় হুইসেলব্লোয়ার রিপোর্ট কিনা নিশ্চিত হোন।":"Please verify the ticket ID number or check if this report was sealed under confidential whistleblower status."}
          </p>
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <a href="/" class="retro-btn retro-btn-pixel retro-btn-yellow text-xs">
              📢 ${t?"উন্মুক্ত ফিড ব্রাউজ করুন":"Browse Public Feed"}
            </a>
            <button type="button" class="retro-btn retro-btn-sm" onclick="document.getElementById('trackInput')?.focus()">
              🔄 ${t?"পুনরায় খুঁজুন":"Try Another ID"}
            </button>
          </div>
        </div>
      `;return}const o=e.status==="resolved",i=e.status==="in_progress",v=e.status==="under_review",l=S(e.category),y=t&&l.labelBn||l.label,k=A(e.priority,x),I=C(e.status,x),h=t?$(e.createdAt):w(e.createdAt),L=t?d(e.id):String(e.id),E=t?d(e.upvotesCount||0):String(e.upvotesCount||0);c.classList.remove("hidden"),p&&(p.textContent=t?`📋 টিকিট #${L} • ${y}`:`📋 TICKET #${e.id} • ${e.category.toUpperCase()}`),u.innerHTML=`
      <div class="flex flex-col gap-6">
        <!-- Top Metadata & Status Row -->
        <div class="flex justify-between items-start sm:items-center gap-4 flex-col sm:flex-row pb-5 border-b-2 border-gray-100">
          <div>
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="category-pill-sm font-bold text-xs" style="background: ${l.color}; border: 1.5px solid var(--border-black); padding: 0.2rem 0.55rem; border-radius: 6px;">
                ${l.icon} ${y}
              </span>
              <span class="retro-badge text-xs font-bold priority-badge priority-${e.priority}">
                ⚡ ${k.toUpperCase()}
              </span>
              ${e.visibility==="private"?'<span class="retro-badge" style="background: var(--pastel-rose)">🔒 '+(t?"গোপনীয় ভল্ট":"CONFIDENTIAL")+"</span>":""}
            </div>
            <h2 class="font-extrabold text-xl sm:text-2xl text-black tracking-tight">${e.title}</h2>
          </div>
          <div class="status-stamp stamp-${e.status}">
            ${I}
          </div>
        </div>

        <!-- Complainant Author Profile Card -->
        <div class="p-3.5 border-2 border-black rounded-xl bg-yellow-50/70 shadow-sm flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-yellow-200 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              ${e.isAnonymous?'<span class="text-base">🕶️</span>':e.author?.image?`<img src="${e.author.image}" alt="${e.author.name||"Author"}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="hidden font-bold">${(e.author?.name||"S").charAt(0).toUpperCase()}</span>`:`<span>${(e.author?.name||"S").charAt(0).toUpperCase()}</span>`}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-xs sm:text-sm text-black">
                  ${e.isAnonymous?t?"বেনামি শিক্ষার্থী":"Anonymous Student 🕶️":e.author?.name||(t?"শিক্ষার্থী":"Student")}
                </span>
                <span class="retro-badge text-[10px] py-0.5 px-1.5" style="background: ${e.isAnonymous?"var(--pastel-blue)":"var(--pastel-yellow)"}">
                  ${e.isAnonymous?t?"হুইসেলব্লোয়ার":"WHISTLEBLOWER":t?"অভিযোগকারী":"COMPLAINANT"}
                </span>
              </div>
              <span class="text-[11px] text-gray-600 block mt-0.5 font-medium">
                ${e.isAnonymous?t?"বিশ্ববিদ্যালয় গোপনীয়তা নীতির অধীনে পরিচয় সুরক্ষিত":"Whistleblower identity protected by University Privacy Gate":e.author?.department||(t?"বরিশাল বিশ্ববিদ্যালয়":"University of Barishal")}
              </span>
            </div>
          </div>
          <span class="text-[11px] font-mono text-gray-500">
            ${t?"দাখিলকৃত: ":"Filed: "} ${h}
          </span>
        </div>

        <!-- 4-Stage Visual Progress Lifecycle Stepper -->
        <div class="p-4 sm:p-5 border-2 border-black rounded-xl bg-orange-50/50 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <span class="font-mono text-xs font-bold text-gray-700 tracking-wider">
              ${t?"সমাধান পর্যায় ও অগ্রগতি লাইফসাইকেল":"RESOLUTION PROGRESS LIFECYCLE"}
            </span>
            <span class="font-mono text-[11px] text-gray-500">
              ${t?"দাখিলকৃত:":"Filed on:"} ${h}
            </span>
          </div>

          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg bg-emerald-200 font-bold shadow-sm">
              <div class="text-sm mb-0.5">✔</div>
              <span>${t?"১. দাখিল":"1. Submitted"}</span>
            </div>
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg ${v||i||o?"bg-emerald-200 font-bold shadow-sm":"bg-gray-100 text-gray-400 opacity-60"}">
              <div class="text-sm mb-0.5">${v||i||o?"✔":"⏳"}</div>
              <span>${t?"২. যাচাই":"2. Triage"}</span>
            </div>
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg ${i||o?"bg-emerald-200 font-bold shadow-sm":"bg-gray-100 text-gray-400 opacity-60"}">
              <div class="text-sm mb-0.5">${i?"🔨":o?"✔":"🔧"}</div>
              <span>${t?"৩. মেরামত":"3. Repair"}</span>
            </div>
            <div class="p-2 sm:p-2.5 border-2 border-black rounded-lg ${o?"bg-emerald-300 font-extrabold text-emerald-950 shadow-sm":"bg-gray-100 text-gray-400 opacity-60"}">
              <div class="text-sm mb-0.5">${o?"🎉":"🏁"}</div>
              <span>${t?"৪. সমাধান":"4. Resolved"}</span>
            </div>
          </div>
        </div>

        <!-- Issue Description Box -->
        <div class="p-4 sm:p-5 border-2 border-black rounded-xl bg-white shadow-neo-sm">
          <div class="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📄</span>
            <span>${t?"অভিযোগের বিবরণ ও ভৌগোলিক অবস্থান":"COMPLAINT DETAILS & LOCATION"}</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
            ${e.description}
          </p>
        </div>

        <!-- Official Resolution Note Certificate (if available) -->
        ${e.resolutionNote?`
          <div class="p-5 border-2 border-emerald-600 rounded-xl bg-emerald-50 text-emerald-950 shadow-neo-sm">
            <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span class="font-mono text-xs font-extrabold flex items-center gap-1.5 text-emerald-800 uppercase tracking-wider">
                <span>🛠️</span>
                <span>${t?"যাচাইকৃত প্রক্টরিয়াল সমাধান সনদ:":"OFFICIAL VERIFIED RESOLUTION CERTIFICATE:"}</span>
              </span>
              ${e.resolvedAt?'<span class="retro-badge text-[10px]" style="background: var(--pastel-mint)">'+(t?$(e.resolvedAt):w(e.resolvedAt))+"</span>":""}
            </div>
            <p class="text-xs sm:text-sm leading-relaxed font-medium mb-3">
              ${e.resolutionNote}
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
              <span>${t?"মেরামত কার্যক্রম ও টেকনিশিয়ান লগ":"DISPATCH TIMELINE & TECHNICIAN LOGS"}</span>
            </h4>
            <div class="flex flex-col gap-2.5">
              ${b.map(s=>`
                <div class="bg-white border-2 border-black rounded-lg p-3.5 text-xs flex flex-col gap-1.5 shadow-sm transition-all hover:bg-yellow-50/50">
                  <div class="flex justify-between items-center font-bold text-gray-900 flex-wrap gap-2">
                    <span class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full border border-black overflow-hidden bg-yellow-200 flex items-center justify-center text-[10px] flex-shrink-0">
                        ${s.authorImage?`<img src="${s.authorImage}" alt="${s.author}" class="w-full h-full object-cover" />`:s.author?s.author.charAt(0).toUpperCase():"👤"}
                      </div>
                      <span>${s.author}</span>
                      <small class="text-gray-500 font-mono">(${s.role})</small>
                    </span>
                    <span class="text-gray-500 font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded border border-gray-300">${s.time}</span>
                  </div>
                  <p class="text-gray-700 leading-relaxed font-medium pl-8 border-l-2 border-gray-200">${s.content}</p>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}

        <!-- Action Footer -->
        <div class="pt-4 border-t border-gray-200 flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2 flex-wrap">
            <button type="button" class="retro-btn retro-btn-sm card-upvote-btn" data-id="${e.id}">
              <span>👍</span>
              <span>${t?"+১ আমিও ভুক্তভোগী":"+1 Me Too"}</span>
              <span class="font-mono font-bold">(${E})</span>
            </button>
            <button type="button" class="retro-btn retro-btn-sm" id="shareTrackLinkBtn">
              <span>🔗</span>
              <span>${t?"লিংক কপি করুন":"Share Ticket"}</span>
            </button>
          </div>
          <button type="button" class="retro-btn retro-btn-sm retro-btn-pixel retro-btn-pink open-create-modal-trigger">
            <span>✉️</span>
            <span>${t?"+ নতুন অভিযোগ দাখিল":"+ File New Issue"}</span>
          </button>
        </div>
      </div>
    `,document.getElementById("shareTrackLinkBtn")?.addEventListener("click",()=>{const s=`${window.location.origin}/track?id=${e.id}`;navigator.clipboard.writeText(s);const n=document.getElementById("toast");n&&(n.textContent=t?"✔ টিকিট লিংক কপি করা হয়েছে":"✔ Ticket link copied to clipboard",n.className="retro-toast show",setTimeout(()=>n.className="retro-toast",2500))})}N?.addEventListener("submit",a=>{a.preventDefault(),r&&r.value&&m(parseInt(r.value,10))});document.querySelectorAll(".quick-chip").forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-id");e&&r&&(r.value=e,m(parseInt(e,10)))})});window.addEventListener("campusfix:langchange",()=>{r&&r.value&&m(parseInt(r.value,10))});const P=new URLSearchParams(window.location.search),f=P.get("id");f&&(r&&(r.value=f),m(parseInt(f,10)));
