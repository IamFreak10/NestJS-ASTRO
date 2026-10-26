import{f as E,a as w,b as A,c as $,_ as k}from"./i18n.Cf5JBIKd.js";import{f as B,g as M,I as r}from"./date.BUnGvB7c.js";const I="http://localhost:3000/api";let d=[],h="all";async function P(){const s=document.getElementById("unauthNotice"),n=document.getElementById("loadingState"),a=document.getElementById("myComplaintsList"),e=document.getElementById("emptyMyComplaints"),t=document.getElementById("vaultStatsBar"),o=document.getElementById("vaultFilterBar");try{n?.classList.remove("hidden"),s?.classList.add("hidden"),e?.classList.add("hidden"),a?.classList.add("hidden"),t?.classList.add("hidden"),o?.classList.add("hidden");const i=await fetch(`${I}/complaints/my`,{credentials:"include"});if(n?.classList.add("hidden"),!i.ok){if(i.status===401){s?.classList.remove("hidden");return}throw new Error("Could not load personal complaints")}if(d=(await i.json()).data||[],s?.classList.add("hidden"),d.length===0){e?.classList.remove("hidden");return}C(d),t?.classList.remove("hidden"),o?.classList.remove("hidden"),f()}catch(i){console.error("Failed to load personal complaints:",i),n?.classList.add("hidden"),(!d||d.length===0)&&s?.classList.remove("hidden")}}function C(s){const n=document.getElementById("statTotalCount"),a=document.getElementById("statPendingCount"),e=document.getElementById("statResolvedCount"),t=document.getElementById("statConfidentialCount"),o=document.getElementById("filterAllCount"),i=document.getElementById("filterPendingCount"),p=document.getElementById("filterResolvedCount"),c=document.getElementById("filterConfidentialCount"),g=s.length,v=s.filter(u=>u.status==="resolved").length,y=s.filter(u=>u.status!=="resolved").length,m=s.filter(u=>u.visibility==="private").length,b=(localStorage.getItem("campusfix_lang")||"en")==="bn",l=u=>b?$(u):String(u);n&&(n.textContent=l(g)),a&&(a.textContent=l(y)),e&&(e.textContent=l(v)),t&&(t.textContent=l(m)),o&&(o.textContent=l(g)),i&&(i.textContent=l(y)),p&&(p.textContent=l(v)),c&&(c.textContent=l(m))}async function S(){const s=document.getElementById("unauthNotice"),n=document.getElementById("loadingState"),a=document.getElementById("emptyMyComplaints"),e=document.getElementById("vaultStatsBar"),t=document.getElementById("vaultFilterBar");s?.classList.add("hidden"),a?.classList.add("hidden"),n?.classList.add("hidden");try{const{SAMPLE_COMPLAINTS:o}=await k(async()=>{const{SAMPLE_COMPLAINTS:i}=await import("./sampleData.BK24nggF.js");return{SAMPLE_COMPLAINTS:i}},[]);d=o.slice(0,5)}catch{d=[]}if(C(d),e?.classList.remove("hidden"),t?.classList.remove("hidden"),f(),!document.getElementById("demoPreviewNotice")){const o=document.createElement("div");o.id="demoPreviewNotice",o.className="demo-vault-banner",o.innerHTML=`
        <div class="demo-banner-content">
          <span class="demo-banner-tag">PREVIEW MODE</span>
          <span class="demo-banner-text">Displaying sample student grievance cards. Log in with your university account to access live database tickets.</span>
        </div>
        <button type="button" class="retro-btn retro-btn-sm retro-btn-yellow" onclick="document.getElementById('authModal').showModal()">
          🔑 Sign In
        </button>
      `,document.querySelector(".vault-hero-section")?.insertAdjacentElement("afterend",o)}}function f(){const s=document.getElementById("myComplaintsList");if(!s)return;let n=d;if(h==="pending"?n=d.filter(a=>a.status!=="resolved"):h==="resolved"?n=d.filter(a=>a.status==="resolved"):h==="confidential"&&(n=d.filter(a=>a.visibility==="private")),n.length===0){s.classList.remove("hidden"),s.innerHTML=`
        <div class="filter-empty-box">
          <p class="font-bold text-gray-700">No tickets match this filter selection.</p>
          <button type="button" class="retro-btn retro-btn-sm retro-btn-yellow mt-2" onclick="document.querySelector('[data-filter=all]').click()">
            Reset to All Tickets
          </button>
        </div>
      `;return}s.classList.remove("hidden");try{const a=localStorage.getItem("campusfix_lang")||"en",e=a==="bn";s.innerHTML=n.map(t=>{const o=t.status==="resolved",i=t.visibility==="private",p=e?E(t.createdAt):B(t.createdAt),c=M(t.category),g=e&&c.labelBn||c.label,v=String(t.priority||"medium").toLowerCase(),y=w(v,a),m=A(t.status,a),L=e?$(t.id):String(t.id),b=e?$(t.upvotesCount||0):String(t.upvotesCount||0);let l="";return o?l=`<span class="status-stamp stamp-resolved">${r.check} ${m}</span>`:t.status==="in_progress"?l=`<span class="status-stamp stamp-in_progress">${r.clock} ${m}</span>`:t.status==="under_review"?l=`<span class="status-stamp stamp-under_review">${r.eye} ${m}</span>`:l=`<span class="status-stamp stamp-submitted">${r.clock} ${m}</span>`,`
            <article class="retro-window vault-complaint-card ${o?"resolved-border":""}">
              <!-- Titlebar -->
              <div class="retro-titlebar ${i?"pink":"yellow"}">
                <div class="titlebar-left">
                  <span class="vault-ticket-num">#${L}</span>
                  <span class="category-pill-sm" style="background: ${c.color}">
                    ${c.icon} ${g}
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
                  <div class="badge-cluster-left">
                    <span class="retro-badge badge-priority-${v}">
                      ${r.lightning} ${y.toUpperCase()}
                    </span>

                    ${i?`<span class="retro-badge badge-confidential">${r.lock} ${e?"গোপনীয়":"CONFIDENTIAL"}</span>`:`<span class="retro-badge badge-public">${r.globe} ${e?"পাবলিক ফিড":"PUBLIC WALL"}</span>`}

                    ${t.isAnonymous?`<span class="retro-badge badge-anonymous">${r.userMask} ${e?"বেনামি":"ANONYMOUS"}</span>`:""}
                  </div>

                  <div class="badge-cluster-right">
                    ${l}
                  </div>
                </div>

                <!-- Author Profile Snippet -->
                <div class="vault-author-badge">
                  <div class="vault-author-avatar-wrap ${t.isAnonymous?"anonymous-avatar":""}">
                    ${t.isAnonymous?'<span class="vault-author-icon">🕶️</span>':t.author?.image?`<img src="${t.author.image}" alt="${t.author.name||"Author"}" class="vault-author-avatar-img" />`:`<span class="vault-author-initial">${(t.author?.name||"S").charAt(0).toUpperCase()}</span>`}
                  </div>
                  <div class="vault-author-meta">
                    <span class="vault-author-name">
                      ${t.isAnonymous?e?"বেনামি শিক্ষার্থী":"Anonymous Student 🕶️":t.author?.name||"Student"}
                    </span>
                    <span class="vault-author-sub">
                      ${t.isAnonymous?e?"পরিচয় গোপনীয়":"Identity Masked":t.author?.department?t.author.department:e?"বরিশাল বিশ্ববিদ্যালয়":"University of Barishal"}
                    </span>
                  </div>
                </div>

                <!-- Main Title & Description -->
                <div class="card-text-block">
                  <h3 class="complaint-item-title">${t.title||(e?"শিরোনামহীন অভিযোগ":"Untitled Complaint")}</h3>
                  <p class="complaint-item-desc">${t.description||(e?"কোনো বিবরণ প্রদান করা হয়নি।":"No description provided.")}</p>
                </div>

                <!-- Official Proctor Resolution Note Box -->
                ${t.resolutionNote?`
                  <div class="official-resolution-box">
                    <div class="resolution-box-header">
                      <span class="res-title-text">
                        ${r.shieldCheck} ${e?"যাচাইকৃত প্রক্টরিয়াল সমাধান:":"VERIFIED PROCTOR RESOLUTION:"}
                      </span>
                      ${t.resolvedAt?`<span class="res-date-tag">${e?E(t.resolvedAt):B(t.resolvedAt)}</span>`:""}
                    </div>
                    <p class="resolution-box-body">${t.resolutionNote}</p>
                  </div>
                `:""}

                <!-- Bottom Row: Meta & Inspect Timeline CTA -->
                <div class="card-action-footer">
                  <div class="card-footer-meta">
                    <span class="meta-item">
                      ${r.calendar} ${p}
                    </span>
                    ${i?`<span class="meta-item text-gray-500" title="Confidential grievance protected by student privacy">${r.lock} ${e?"গোপনীয় (সিলগালা)":"Sealed (Private)"}</span>`:`
                      <button
                        type="button"
                        class="upvote-btn retro-btn retro-btn-sm"
                        data-id="${t.id}"
                        title="Toggle +1 Me Too Upvote"
                      >
                        <span class="upvote-icon">👍</span>
                        <span class="upvote-label">${t.hasUpvoted?e?"সমর্থিত":"Upvoted":e?"+১ ভুক্তভোগী":"Me Too"}</span>
                        <span class="upvote-count font-mono font-bold">(${b})</span>
                      </button>
                    `}
                  </div>

                  <button
                    type="button"
                    class="open-detail-btn retro-btn retro-btn-sm"
                    data-id="${t.id}"
                    title="Inspect real-time dispatch timeline and technician logs"
                  >
                    ${r.search} ${e?"অগ্রগতি ও টাইমলাইন":"Inspect Timeline"}
                  </button>
                </div>
              </div>
            </article>
          `}).join("")}catch(a){console.error("Error rendering complaints cards:",a)}}document.querySelectorAll(".vault-filter-btn").forEach(s=>{s.addEventListener("click",()=>{document.querySelectorAll(".vault-filter-btn").forEach(n=>n.classList.remove("active")),s.classList.add("active"),h=s.getAttribute("data-filter")||"all",f()})});document.getElementById("quickDemoStudentLoginBtn")?.addEventListener("click",async()=>{try{(await fetch(`${I}/auth/sign-in/email`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({email:"student@kcku.edu",password:"student123"})})).ok?window.location.reload():document.getElementById("authModal")?.showModal()}catch{document.getElementById("authModal")?.showModal()}});document.getElementById("previewSampleVaultBtn")?.addEventListener("click",S);document.getElementById("emptySamplePreviewBtn")?.addEventListener("click",S);window.addEventListener("campusfix:langchange",()=>{C(d),f()});P();
