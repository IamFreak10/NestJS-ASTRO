const k="http://localhost:3000/api",t={lock:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',globe:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',lightning:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',userMask:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',check:'<svg class="w-3.5 h-3.5 inline-block mr-1 stroke-current text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',clock:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',eye:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="7" r="3"></circle></svg>',calendar:'<svg class="w-3 h-3 inline-block mr-1 stroke-current text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',thumbsUp:'<svg class="w-3 h-3 inline-block mr-1 stroke-current text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',search:'<svg class="w-3.5 h-3.5 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',shieldCheck:'<svg class="w-4 h-4 inline-block mr-1.5 stroke-current text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',building:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line></svg>',bus:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"></rect><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle><path d="M3 11h18"></path></svg>',home:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',book:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',shieldAlert:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',fileText:'<svg class="w-3 h-3 inline-block mr-1 stroke-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>'},m={facilities:{label:"Facilities",icon:t.building,color:"var(--pastel-cyan)"},hostel_canteen:{label:"Hostel & Mess",icon:t.home,color:"var(--pastel-yellow)"},transport:{label:"Transport",icon:t.bus,color:"var(--pastel-mint)"},academics:{label:"Academics",icon:t.book,color:"var(--pastel-lavender)"},safety_bullying:{label:"Safety & Anti-Ragging",icon:t.shieldAlert,color:"var(--pastel-rose)"},administration:{label:"Administration",icon:t.fileText,color:"var(--pastel-orange)"}};let c=[],p="all";async function y(){const n=document.getElementById("unauthNotice"),o=document.getElementById("loadingState"),e=document.getElementById("myComplaintsList"),l=document.getElementById("emptyMyComplaints"),i=document.getElementById("vaultStatsBar"),a=document.getElementById("vaultFilterBar");try{o?.classList.remove("hidden"),n?.classList.add("hidden"),l?.classList.add("hidden"),e?.classList.add("hidden"),i?.classList.add("hidden"),a?.classList.add("hidden");const s=await fetch(`${k}/complaints/my`,{credentials:"include"});if(o?.classList.add("hidden"),!s.ok){if(s.status===401){n?.classList.remove("hidden");return}throw new Error("Could not load personal complaints")}if(c=(await s.json()).data||[],c.length===0){l?.classList.remove("hidden");return}g(c),i?.classList.remove("hidden"),a?.classList.remove("hidden"),u()}catch{o?.classList.add("hidden"),n?.classList.remove("hidden")}}function g(n){const o=document.getElementById("statTotalCount"),e=document.getElementById("statPendingCount"),l=document.getElementById("statResolvedCount"),i=document.getElementById("statConfidentialCount"),a=document.getElementById("filterAllCount"),s=n.length,r=n.filter(d=>d.status==="resolved").length,v=n.filter(d=>d.status!=="resolved").length,h=n.filter(d=>d.visibility==="private").length;o&&(o.textContent=String(s)),e&&(e.textContent=String(v)),l&&(l.textContent=String(r)),i&&(i.textContent=String(h)),a&&(a.textContent=String(s))}function u(){const n=document.getElementById("myComplaintsList");if(!n)return;let o=c;if(p==="pending"?o=c.filter(e=>e.status!=="resolved"):p==="resolved"?o=c.filter(e=>e.status==="resolved"):p==="confidential"&&(o=c.filter(e=>e.visibility==="private")),o.length===0){n.classList.remove("hidden"),n.innerHTML=`
        <div class="col-span-full neo-card p-8 text-center bg-white">
          <p class="text-sm font-bold text-gray-700">No tickets match this filter.</p>
          <button type="button" class="retro-btn retro-btn-sm retro-btn-yellow mt-2" onclick="document.querySelector('[data-filter=all]').click()">
            Reset Filters
          </button>
        </div>
      `;return}n.classList.remove("hidden"),n.innerHTML=o.map(e=>{const l=e.status==="resolved",i=e.visibility==="private",a=new Date(e.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),s=m[e.category]||{label:e.category.toUpperCase(),icon:t.building,color:"var(--pastel-cyan)"};let r="";return l?r=`<span class="status-stamp stamp-resolved">${t.check} RESOLVED</span>`:e.status==="in_progress"?r=`<span class="status-stamp stamp-in_progress">${t.clock} IN PROGRESS</span>`:e.status==="under_review"?r=`<span class="status-stamp stamp-under_review">${t.eye} UNDER REVIEW</span>`:r=`<span class="status-stamp stamp-submitted">${t.clock} SUBMITTED</span>`,`
          <article class="retro-window vault-complaint-card ${l?"resolved-border":""}">
            <!-- Titlebar -->
            <div class="retro-titlebar ${i?"pink":"yellow"}">
              <div class="flex items-center gap-2">
                <span class="vault-ticket-num">#${e.id}</span>
                <span class="category-pill-sm" style="background: ${s.color}">
                  ${s.icon} ${s.label}
                </span>
              </div>
              <div class="retro-controls">
                <span class="retro-ctrl-btn">_</span>
                <span class="retro-ctrl-btn">□</span>
              </div>
            </div>

            <!-- Card Content Body -->
            <div class="card-inner-body">
              <!-- Top Metadata Cluster -->
              <div class="badge-cluster-row">
                <div class="flex gap-1.5 flex-wrap items-center">
                  <span class="retro-badge badge-priority-${e.priority}">
                    ${t.lightning} ${e.priority.toUpperCase()}
                  </span>

                  ${i?`<span class="retro-badge badge-confidential">${t.lock} CONFIDENTIAL VAULT</span>`:`<span class="retro-badge badge-public">${t.globe} PUBLIC WALL</span>`}

                  ${e.isAnonymous?`<span class="retro-badge badge-anonymous">${t.userMask} ANONYMOUS</span>`:""}
                </div>

                ${r}
              </div>

              <!-- Main Title & Description -->
              <div class="card-text-block">
                <h3 class="complaint-item-title">${e.title}</h3>
                <p class="complaint-item-desc">${e.description}</p>
              </div>

              <!-- Official Proctor Resolution Note Box -->
              ${e.resolutionNote?`
                <div class="official-resolution-box">
                  <div class="resolution-box-header">
                    <span class="flex items-center gap-1 font-bold">
                      ${t.shieldCheck} VERIFIED PROCTORIAL RESOLUTION:
                    </span>
                    ${e.resolvedAt?`<span class="font-mono text-[11px] text-emerald-800">${new Date(e.resolvedAt).toLocaleDateString()}</span>`:""}
                  </div>
                  <p class="resolution-box-body">${e.resolutionNote}</p>
                </div>
              `:""}

              <!-- Bottom Row: Meta & Inspect Timeline CTA -->
              <div class="card-action-footer">
                <div class="card-footer-meta">
                  <span class="meta-item">
                    ${t.calendar} ${a}
                  </span>
                  <span class="meta-item">
                    ${t.thumbsUp} Upvotes: <strong>${e.upvotesCount}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  class="open-detail-btn retro-btn retro-btn-sm"
                  data-id="${e.id}"
                  title="Inspect real-time dispatch timeline and technician logs"
                >
                  ${t.search} Inspect Timeline
                </button>
              </div>
            </div>
          </article>
        `}).join("")}document.querySelectorAll(".vault-filter-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".vault-filter-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active"),p=n.getAttribute("data-filter")||"all",u()})});y();
