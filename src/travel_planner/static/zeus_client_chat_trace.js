(()=>{var An=Object.defineProperty;var qn=(t,e)=>{for(var n in e)An(t,n,{get:e[n],enumerable:!0})};var En="1.2.2",Nt=null;function de(t){Nt=t}function lt(){return En||"dev"}function G(t){if(!t)return null;if(typeof t=="object"&&!Array.isArray(t))return{v1:Array.isArray(t.v1)?t.v1:[],v2:Array.isArray(t.v2)?t.v2:[]};if(typeof t=="string")try{return G(JSON.parse(t))}catch{return null}return null}function X(t){let e=String(t||"").trim();if(!e)return"";let n=e.indexOf("#");n>=0&&(e=e.slice(0,n)),e=e.replace(/\/+$/,"");try{let r=new URL(e);return(r.pathname||"").replace(/\/+$/,"").toLowerCase()==="/hub"?r.origin:e}catch{return/^https?:\/\/hub$/i.test(e)?e:(e=e.replace(/\/hub$/i,""),e.replace(/\/+$/,""))}}function pe(t,e){let n=X(t),r=String(e||"").trim();return!n||!r?"":n+"/hub/#/debug/req/"+encodeURIComponent(r)}function ue(t,e){let n=X(t),r=String(e||"").trim();return!n||!r?"":n+"/hub/debug/session/"+encodeURIComponent(r)}function fe(t){if(t===!0||t===!1)return t;if(t==null||t==="")return null;let e=String(t).trim().toLowerCase();return["1","true","yes","on"].includes(e)?!0:["0","false","no","off"].includes(e)?!1:null}function Ln(t){try{let e=t!==void 0?t:typeof location<"u"?location.search:"",n=e.startsWith("?")||e===""?e:`?${e}`;return fe(new URLSearchParams(n).get("debug"))}catch{return null}}function Mn(t={}){let e=t.fromWindow!==void 0?t.fromWindow||{}:(typeof window<"u"?window.ZeusTraceConfig:null)||{},n=t.script!==void 0?t.script:Nt||(typeof document<"u"?document.currentScript:null),r=fe(e.enabled!==void 0?e.enabled:n?.dataset?.enabled);if(r!==null)return r;let s=Ln(t.search);return s!==null?s:!1}function ct(t={}){let e=t.fromWindow!==void 0?t.fromWindow||{}:window.ZeusTraceConfig||{},n=t.script!==void 0?t.script:Nt||document.currentScript,r=(e.zeusApiUrl||n?.dataset?.zeusApiUrl||""||"").replace(/\/$/,""),s=X(e.hubBaseUrl||e.hub_url||n?.dataset?.hubBaseUrl||""||""),l=String(e.mount||n?.dataset?.mount||"overlay").toLowerCase()==="docked"?"docked":"overlay",d=(e.mountSelector||n?.dataset?.mountSelector||"").trim();return{zeusApiUrl:r,hubBaseUrl:s,zeusAuthToken:e.zeusAuthToken||n?.dataset?.zeusAuthToken||""||"",toolOrder:G(e.toolOrder??n?.dataset?.toolOrder),enabled:Mn({fromWindow:e,script:n,search:t.search}),mount:l,mountSelector:d}}function be(t={}){let e=ct(t).hubBaseUrl;if(e)return e;let n=t.config&&t.config.hubBaseUrl;return n?X(n):""}function Ht(t){return{zeusApiUrl:t.zeusApiUrl,hubBaseUrl:t.hubBaseUrl,toolOrder:t.toolOrder,enabled:!!t.enabled,mount:t.mount||"overlay",mountSelector:t.mountSelector||"",version:lt()}}function me(t,e,n={}){let r={};e.zeusAuthToken&&(r.Authorization=`Bearer ${e.zeusAuthToken}`);let s={headers:r};return n.signal&&(s.signal=n.signal),fetch(`${e.zeusApiUrl}${t}`,s)}var At={};qn(At,{asDisplayText:()=>z,attachPipelineCostsToSteps:()=>St,copyToClipboard:()=>In,decompositionCardHTML:()=>Qn,detectiveCheckSummary:()=>ot,detectiveCostResultKpis:()=>er,detectiveDefaultTab:()=>Pt,detectiveDiagnosisModel:()=>nr,detectiveEnvelopeRows:()=>Ie,detectiveInnerTabs:()=>Re,detectiveIsDirectTurn:()=>Vt,detectiveLayerA:()=>Ue,detectiveNeedsAttention:()=>De,detectivePlaybookCards:()=>Wt,detectivePromptChecks:()=>rt,detectivePromptView:()=>rr,detectiveSessionModel:()=>or,detectiveShellSpec:()=>tr,detectiveSlowTop:()=>Be,detectiveTokenTiles:()=>Pe,detectiveV2Direct:()=>Zt,escapeHtml:()=>J,estimatePayloadBytes:()=>_t,expandTraceSpans:()=>Jt,extractDecomposition:()=>Oe,extractGather:()=>Ct,extractJobUnits:()=>Xn,extractStepCosts:()=>K,fmtBytes:()=>Ut,fmtMs:()=>kt,fmtTokens:()=>Pn,formatDetectiveOverview:()=>xt,gradeNorm:()=>B,hopLooksV2Direct:()=>pt,hubDebugReqUrl:()=>pe,hubDebugSessionUrl:()=>ue,isMultiAgentTrace:()=>Yn,jsnviewOptions:()=>ze,matchingToolStep:()=>wt,mountJsnviewViewer:()=>$n,normalizeHubBase:()=>X,pipelineSpansFromStep:()=>qe,prettyJSON:()=>Ae,resolveHopBytes:()=>ut,shortId:()=>Rn,synthesizeTraceSpans:()=>jt,tallyToolCalls:()=>Me,timelineSpeedKpiHTML:()=>Zn,timelineSpeedKpis:()=>Le,tokenTotal:()=>nt,toolFrequencyChartHTML:()=>Wn,traceMetrics:()=>Ft,traceWallMs:()=>Kt,tryParseJSON:()=>W,waterfallHTML:()=>Vn});var Ot="https://cdn.jsdelivr.net/npm/jsnview@3.0.0/dist/index.min.js",tt=null;function ge(){return window.jsnview?Promise.resolve(window.jsnview):tt||(tt=new Promise((t,e)=>{let n=()=>{if(window.jsnview){t(window.jsnview);return}tt=null,e(new Error("jsnview loaded but window.jsnview is missing"))},r=i=>{tt=null,e(new Error(i||"Failed to load jsnview"))};document.querySelectorAll(`script[src="${Ot}"]`).forEach(i=>{if(i.dataset.jsnviewFailed==="1")try{i.remove()}catch{}});let s=document.querySelector(`script[src="${Ot}"]`);if(s){if(window.jsnview){n();return}let i=()=>{s.removeEventListener("error",l),n()},l=()=>{s.dataset.jsnviewFailed="1",s.removeEventListener("load",i);try{s.remove()}catch{}r("Failed to load jsnview")};if(s.addEventListener("load",i),s.addEventListener("error",l),s.dataset.loaded==="1"){s.removeEventListener("load",i),s.removeEventListener("error",l),s.dataset.jsnviewFailed="1";try{s.remove()}catch{}he(n,r)}return}he(n,r)}),tt)}function he(t,e){let n=document.createElement("script");n.src=Ot,n.async=!0,n.onload=()=>{n.dataset.loaded="1",t()},n.onerror=()=>{n.dataset.jsnviewFailed="1";try{n.remove()}catch{}e("Failed to load jsnview")},document.head.appendChild(n)}function J(t){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function z(t){if(t==null||t==="")return"";let e=typeof t;return e==="string"?t:e==="number"&&isFinite(t)?String(t):e==="boolean"?t?"true":"false":""}function zn(t){if(!t||typeof t!="object"||Array.isArray(t))return"";let e=[];if(t.hop_count!=null&&t.hop_count!==""){let r=Number(t.hop_count);isFinite(r)&&e.push(r+" hop"+(r===1?"":"s"))}if(t.rounds!=null&&t.rounds!==""){let r=Number(t.rounds);isFinite(r)&&e.push(r+" round"+(r===1?"":"s"))}t.total_ms!=null&&t.total_ms!==""&&e.push(kt(t.total_ms));let n=nt(t.tokens);return n>0&&e.push("tokens "+n.toLocaleString()),e.join(" \xB7 ")}function xt(t){if(!t)return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=e.overview||t.overview||e.detail||t.detail||"";return typeof n=="string"?n:n&&typeof n=="object"?zn(n):z(n)}function ye(t){if(!t||typeof t!="object")return!0;let e=String(t.status||"").toLowerCase();if(e){if(["fail","error","err","failed","warn","warning"].includes(e))return!1;if(["pass","ok","healthy","clear"].includes(e))return!0}return!(t.ok===!1||t.pass===!1)}function B(t){let e=String(t||"").toLowerCase();return["fail","error","err","failed"].includes(e)?"fail":["warn","warning"].includes(e)?"warn":["pass","ok","healthy","clear"].includes(e)?"pass":e==="skip"?"skip":["n/a","na","n-a"].includes(e)?"na":""}function Bt(t){return t==="scope_brief"||t==="mini_schema"}function Te(t){let e=B(t);if(e==="pass"||e==="fail")return e;let n=String(t||"").toLowerCase();return n==="pass"||n==="fail"?n:""}function Nn(t){return!t||!Bt(t.id)?!0:!!Te(t.status)}function Hn(t){return!t||!Bt(t.id)?t:{ok:t.ok,lab:t.lab,status:Te(t.status)||t.status,id:t.id,group:t.group,detail:"",fix_hint:"",interactive:!1}}function Dt(t){if(typeof t=="string")return{ok:!0,lab:t,status:"pass",id:"",group:"",detail:"",fix_hint:"",interactive:!1};let e=z(t&&t.status).toLowerCase(),n=z(t&&t.id);return{ok:ye(t),lab:z(t&&(t.lab||t.label||t.name)||"?")||"?",status:e||(ye(t)?"pass":"fail"),id:n,group:z(t&&t.group),detail:z(t&&(t.detail||t.summary)),fix_hint:z(t&&(t.fix_hint||t.fixHint||t.hint)),interactive:!!(t&&t.interactive)&&!Bt(n)}}function rt(t){if(!t)return[];let e=t.prompt||t.prompt_check||t.checklist;return Array.isArray(e)?e.map(Dt):e&&Array.isArray(e.items)?e.items.map(Dt):[]}function ot(t){let e=Array.isArray(t)?t:[],n=e.length,r=e.filter(i=>i&&i.ok).length;if(!n)return{passed:0,total:0,label:"",tone:""};let s=r===n;return{passed:r,total:n,label:r+"/"+n+(s?" PASSED":" FAILED"),tone:s?"ok":"err"}}function kt(t){let e=Number(t)||0;return e>=1e3?(e/1e3).toFixed(2)+"s":e+"ms"}function Ut(t){let e=Number(t)||0;return e<1024?e+"B":e<1024*1024?(e/1024).toFixed(1)+"kB":(e/(1024*1024)).toFixed(1)+"MB"}var ve=["bytes","byte_size","result_bytes","content_length","contentLength","body_bytes","size_bytes"],_e=["result_json","result_full","res","response","result","body","snippet","result_text"];function On(t){if(t==null||t==="")return null;if(typeof t=="number")return isFinite(t)&&t>=0?t:null;if(typeof t=="string"){let e=t.trim();if(!e)return null;if(/[a-zA-Z]/.test(e))return e;let n=Number(e);return isFinite(n)&&n>=0?n:null}return null}function xe(t){if(!t||typeof t!="object")return null;for(let e=0;e<ve.length;e++){let n=On(t[ve[e]]);if(n!=null)return n}return null}function ke(t){if(t==null||t==="")return 0;let e=String(t);if(typeof TextEncoder<"u")return new TextEncoder().encode(e).length;let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?n+=1:s<2048?n+=2:s>=55296&&s<=56319?(n+=4,r++):n+=3}return n}function Ce(t){if(t==null||t==="")return!0;if(typeof t=="string"){let e=t.trim();return!e||e==="{}"||e==="[]"}return typeof t!="object"?!1:Array.isArray(t)?t.length===0:Object.keys(t).length===0}function we(t){if(!t||typeof t!="object")return null;for(let e=0;e<_e.length;e++){let n=t[_e[e]];if(n!=null&&n!==""&&!Ce(n))return n}return null}function _t(t){if(Ce(t))return null;if(typeof t=="string"){let e=ke(t);return e>0?e:null}if(typeof t=="object")try{let e=JSON.stringify(t);if(!e||e==="{}"||e==="[]")return null;let n=ke(e);return n>0?n:null}catch{return null}return null}function wt(t,e,n){let r=(t||[]).filter(l=>l&&typeof l=="object"&&(l.type==null||l.type==="tool"));if(!r.length||!e||typeof e!="object")return null;let s=e.req_id||e.id;if(s){let l=r.find(d=>String(d.req_id||"")===String(s));if(l)return l}let i=e.verb||e.name||e.tool;if(i){let l=r.find(d=>(d.name||d.verb||d.tool)===i);if(l)return l}return n!=null&&n>=0&&n<r.length?r[n]:null}function ut(t,e,n){let r=xe(t);if(r!=null)return r;let s=xe(e);if(s!=null)return s;let i=_t(we(t))??_t(n)??_t(we(e));return i??null}function Rn(t,e){if(e=e??10,!t)return"";let n=String(t);return n.length>e?n.slice(0,e)+"\u2026":n}function Ae(t){try{let e=JSON.stringify(t===void 0?null:t,null,2);return e??"null"}catch{return String(t)}}function Dn(t){let e=String(t??"");if(!e)return!1;let n=document.body||document.documentElement;if(!n)return!1;let r=document.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.setAttribute("aria-hidden","true"),r.tabIndex=-1,r.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none;",n.appendChild(r);let s=typeof document.activeElement<"u"?document.activeElement:null,i=!1;try{r.focus(),r.select();try{r.setSelectionRange(0,e.length)}catch{}i=typeof document.execCommand=="function"&&!!document.execCommand("copy")}catch{i=!1}try{r.remove()}catch{}try{s&&typeof s.focus=="function"&&s.focus()}catch{}return i}function In(t){let e=String(t??"");if(!e)return Promise.resolve(!1);let n=Dn(e);try{let r=typeof navigator<"u"?navigator.clipboard:null;if(r&&typeof r.writeText=="function")return Promise.resolve(r.writeText(e)).then(()=>!0,()=>n)}catch{}return Promise.resolve(n)}function W(t){if(t==null||t==="")return null;if(typeof t=="object")return t;try{return JSON.parse(t)}catch{return null}}function nt(t){if(t==null||t==="")return 0;if(typeof t=="number")return isFinite(t)?t:0;if(typeof t=="string"){let i=Number(t);return isFinite(i)?i:0}if(typeof t!="object")return 0;let e=t.total!=null?t.total:t.total_tokens;if(e!=null&&e!==""){let i=Number(e);if(isFinite(i)&&i>0)return i}let n=Number(t.prompt!=null?t.prompt:t.prompt_tokens)||0,r=Number(t.completion!=null?t.completion:t.completion_tokens)||0;if(n||r)return n+r;let s=Number(e);return isFinite(s)?s:0}function Pn(t){let e=nt(t);return e>0?e.toLocaleString():"?"}function Ft(t){t=t||{};let e=0,n=0,r=0,s=0;(t.steps||[]).forEach(d=>{(d.type==="llm"||d.type==="llm_error")&&(e+=d.ms||0),d.type==="tool"&&(n+=d.ms||0,s+=d.bytes||0),d.usage&&(r+=nt(d.usage))}),t.ai_ms!=null&&(e=t.ai_ms),(t.zeus_ms!=null||t.tool_ms!=null)&&(n=t.zeus_ms!=null?t.zeus_ms:t.tool_ms),t.tokens!=null&&(r=nt(t.tokens));let i=t.total_ms||Kt(t)||e+n,l=Math.max(0,i-e-n);return{total:i,aiMs:e,zeusMs:n,other:l,tokens:r,bytes:s}}function qe(t,e,n){let r=n&&n.pipeline_step_costs,s={};if(!r||!r.length){let y=n&&(n.result_full||n.result)||"";try{let h=typeof y=="string"?JSON.parse(y):y;s=h&&h.meta||{},r=s.step_costs}catch{r=null}}if(!Array.isArray(r)||!r.length)return null;let i={};(n&&n.args&&n.args.steps||n&&n.pipeline_json&&n.pipeline_json.steps||[]).forEach(y=>{y&&(y.name||y.as)&&(i[y.name||y.as]=y.verb||"")});let d=[],b=0;r.forEach(y=>{let h=y.as||y.name||"step",p=i[h]||"",S=y.ms||0,j="pipeline."+h;p&&(j+="."+p);let _=[];y.cost!=null&&_.push("cost "+y.cost),y.result_size!=null&&_.push(y.result_size+" rows"),y.status&&_.push(y.status),d.push({name:j,cls:"tool",at:(t||0)+b,ms:S,detail:_.join(" \xB7 ")||null,pipeline:!0}),b+=S});let x=(e||0)-b;return x>0&&d.push({name:"pipeline.overhead",cls:"tool",at:(t||0)+b,ms:x,detail:"HTTP / orchestration",pipeline:!0}),d}function Jt(t,e){let n=(e||[]).filter(i=>i.type==="tool"&&i.name==="pipeline"),r=0,s=[];return(t||[]).forEach(i=>{if(i.name!=="tool.pipeline"){s.push(i);return}let l=qe(i.at,i.ms,n[r++]);l?s.push(...l):s.push(i)}),s}function Bn(t,e){if(!t||e<0||e>=t.length||t[e]!=="[")return null;let n=0,r=!1,s=!1;for(let i=e;i<t.length;i++){let l=t[i];if(r){s?s=!1:l==="\\"?s=!0:l==='"'&&(r=!1);continue}if(l==='"'){r=!0;continue}if(l==="[")n++;else if(l==="]"&&(n--,n===0))try{let d=JSON.parse(t.slice(e,i+1));return Array.isArray(d)?d:null}catch{return null}}return null}function K(t){if(t==null||t==="")return null;if(Array.isArray(t))return t.length?t:null;if(typeof t=="object"){if(Array.isArray(t.step_costs)&&t.step_costs.length)return t.step_costs;let s=t.meta||t.data&&t.data.meta||{};if(Array.isArray(s.step_costs)&&s.step_costs.length)return s.step_costs;let i=t.data&&typeof t.data=="object"?K(t.data):null;return i||null}let e=String(t);try{return K(JSON.parse(e))}catch{}let n=e.search(/"step_costs"\s*:/);if(n<0)return null;let r=e.indexOf("[",n);return Bn(e,r)}function It(t){return t&&(t.verb||t.name||t.tool)||"hop"}function St(t,e){let n=(t||[]).map(l=>l&&typeof l=="object"?Object.assign({},l):l),r={},s=[];(e||[]).forEach(l=>{!l||typeof l!="object"||(l.req_id&&(r[String(l.req_id)]=l),It(l)==="pipeline"&&s.push(l))});let i=0;return n.forEach(l=>{if(!l||l.type!=="tool"||l.name!=="pipeline"||Array.isArray(l.pipeline_step_costs)&&l.pipeline_step_costs.length)return;let d=l.req_id&&r[String(l.req_id)]||s[i]||null;It(l)==="pipeline"&&i++;let b=K(l.pipeline_step_costs)||K(l.result_full||l.result)||d&&(K(d.step_costs)||K(d.snippet)||K(d.res)||K(d.body));b&&b.length&&(l.pipeline_step_costs=b)}),n}function Z(t){let e=Number(t);return isFinite(e)&&e>0?e:0}function Kt(t){let e=t||{},n=Z(e.total_ms);if(n)return n;let r=e.detective&&typeof e.detective=="object"?e.detective:{},s=r.overview&&typeof r.overview=="object"?r.overview:{},i=Z(s.total_ms);if(i)return i;let l=r.diagnosis&&r.diagnosis.slow;return Z(l&&l.total_ms)}function Un(t,e){let n=0;return(t||[]).forEach(r=>{!r||typeof r!="object"||(n+=Z(r.ms!=null?r.ms:r.duration_ms))}),n||((e||[]).forEach(r=>{r&&r.type==="tool"&&(n+=Z(r.ms))}),n)}function Se(t,e){let n=Number(e)||0;return n?(t||[]).map(r=>r&&typeof r=="object"?Object.assign({},r,{at:(r.at||0)+n}):r):t||[]}function Ee(t){return t&&(t.type==="llm"||t.type==="llm_error"||t.type==="force_final")}function Fn(t){let e=[],n=0;return(t||[]).forEach(r=>{if(!Ee(r))return;let s=Z(r.ms);if(!s)return;let i=r.type==="force_final"?"llm.force_final":"ai.chat.round."+(r.round!=null?r.round:e.length+1);e.push({name:i,cls:"ai",at:n,ms:s}),n+=s}),e}function Jn(t){let e=[],n=0;return(t||[]).forEach(r=>{if(!r||typeof r!="object"||r.type!=="tool")return;let s=r.name||"tool",i=Z(r.ms);if(!i&&s!=="pipeline")return;let l=s==="pipeline"?"tool.pipeline":"tool."+s;e.push({name:l,cls:"tool",at:n,ms:i}),n+=i}),e}function Kn(t){let e=[],n=0;return(t||[]).forEach(r=>{if(!r||typeof r!="object")return;let s=It(r),i=Z(r.ms!=null?r.ms:r.duration_ms),l=s==="pipeline"?"tool.pipeline":"tool."+s;e.push({name:l,cls:"tool",at:n,ms:i}),n+=i}),e}function jt(t,e,n){let r=t&&Array.isArray(t.spans)?t.spans:[];if(r.length)return r;let s=(()=>{let y=Jn(n);return y.length?y:Kn(e)})(),i=Fn(n);if(i.length){let y=i.reduce((h,p)=>Math.max(h,(p.at||0)+(p.ms||0)),0);return i.concat(Se(s,y))}let l=Kt(t),d=Un(e,n),b=l>d?l-d:0,x=(n||[]).some(Ee);return b>0&&(x||l>=500)?[{name:"ai.chat.round.1",cls:"ai",at:0,ms:b}].concat(Se(s,b)):s}function Vn(t,e,n){let r=Jt(t,n);if(!r.length)return"";let s=r.reduce((d,b)=>Math.max(d,(b.at||0)+(b.ms||0)),0),i=Math.max(Number(e)||0,s)||1,l='<div class="trace-waterfall">';return r.forEach(d=>{let b=Math.max(0,Math.min(100,(d.at||0)/i*100)),x=Math.max(.5,Math.min(100-b,(d.ms||0)/i*100)),y=d.pipeline?"tw-lab tw-lab-pipeline":"tw-lab",h=(d.ms||0)+" ms"+(d.detail?' <span class="tw-detail">\xB7 '+J(d.detail)+"</span>":"");l+='<div class="'+y+'" title="'+J(d.name)+'">'+J(d.name)+'</div><div class="tw-track"><i class="tw-bar '+J(d.cls||"other")+'" style="left:'+b.toFixed(2)+"%;width:"+x.toFixed(2)+'%"></i></div><div class="tw-dur">'+h+"</div>"}),l+='<div class="tw-legend" style="grid-column:1/-1"><span><i class="sw ai"></i>ai \xB7 external LLM</span><span><i class="sw tool"></i>tool \xB7 zeus / pipeline step</span><span><i class="sw other"></i>other \xB7 dispatch / auth / rate / storage</span></div></div>',l}function Le(t){t=t||{};let e=t.metrics||{},n=Number(e.total)||0,r=Number(e.aiMs)||0,s=Number(e.zeusMs)||0,i=t.llmRounds&&t.llmRounds.length||t.trace&&t.trace.rounds||0,l=Jt(t.spans||[],t.steps||[]);if(!r||!s){let p=0,S=0;l.forEach(j=>{j&&(j.cls==="ai"&&(p+=j.ms||0),j.cls==="tool"&&(S+=j.ms||0))}),r||(r=p),s||(s=S)}let d=0,b=0;for(let p=0;p<l.length;p++){let S=l[p];if(S&&(!d&&S.cls==="tool"&&(d=S.at||0),S.cls==="ai")){b=S.at||0,d||(d=S.ms||0);break}}let x=n>0?r/n:0,y=n>0?s/n:0;function h(p){return!isFinite(p)||p<0?"\u2014":(Math.round(p*1e3)/10).toFixed(1)+"%"}return[{label:"wall",value:(n|0)+"ms",grade:n>=1e4?"warn":""},{label:"AI share",value:h(x),grade:x>.9&&n>3e3?"warn":"pass"},{label:"API share",value:h(y),grade:""},{label:"TTFT",value:(d|0)+"ms",grade:""},{label:"pre-LLM",value:Math.round(b)+"ms",grade:""},{label:"rounds",value:String(i),grade:i>=4?"fail":i>=3?"warn":"pass"}]}function Zn(t){let e=Le(t),n='<div class="tab-kpi"><div class="kpi-head">Speed / efficiency KPIs <span class="sub">shares of wall clock</span></div><div class="kpi-grid">';return e.forEach(r=>{n+='<div class="kpi-tile"><span class="kpi-lbl">'+J(r.label)+'</span><span class="kpi-val'+(r.grade?" "+r.grade:"")+'">'+J(r.value)+"</span></div>"}),n+="</div></div>",n}function Me(t){let e={},n={},r=(s,i)=>{e[s]=(e[s]||0)+1;let l=i&&i.status;(l===0||typeof l=="number"&&l>=400)&&(n[s]=(n[s]||0)+1)};return(t||[]).forEach(s=>{if(s.type==="tool"){if(s.name==="pipeline"){let i=s.args&&s.args.steps||s.pipeline_json&&s.pipeline_json.steps||[],l={};i.forEach(b=>{b&&(b.name||b.as)&&(l[b.name||b.as]=b)});let d=s.pipeline_step_costs;if(!d||!d.length)try{let b=W(s.result_full||s.result||"{}")||{};d=b.meta&&b.meta.step_costs}catch{d=null}d&&d.length?d.forEach(b=>{let x=b.as||b.name,y=l[x]&&l[x].verb||x;y&&r(y,s)}):i.forEach(b=>{b&&b.verb&&r(b.verb,s)});return}r(s.name||"?",s)}}),{counts:e,errs:n}}function Wn(t,e,n){let{counts:r,errs:s}=Me(t),i=Object.keys(r);if(!i.length)return"";let l=n||{v1:[],v2:[]},d=String(e||"v2").toLowerCase()==="v1"?"v1":"v2",b=l[d]||l.v1||[],x=new Set(b),y=b.slice();i.forEach(_=>{x.has(_)||y.push(_)});let h=0;y.forEach(_=>{h=Math.max(h,r[_]||0)});let p=78,S="",j="";return y.forEach(_=>{let q=r[_]||0,A=s[_]||0,L=h>0&&q>0?Math.max(2,Math.round(q/h*p)):0,w=!x.has(_),T=A>0?"b err":w?"b unknown":"b",M=_+" \xB7 "+q+" call"+(q===1?"":"s")+(A>0?" ("+A+" error"+(A===1?"":"s")+")":"")+(w?" \xB7 off-catalog":"");S+='<div class="vbar-col" title="'+J(M)+'"><div class="'+(q>0?"n":"n zero")+'">'+(q>0?q:"")+'</div><div class="'+T+'" style="height:'+L+'px"></div></div>',j+='<div class="'+(q>0?"l":"l zero")+'" title="'+J(_)+'">'+J(_)+"</div>"}),'<div class="trace-vbar mt-3"><h3 class="trace-vbar-title">Tool-call frequency vs. canonical order</h3><div class="vbar-wrap">'+S+'</div><div class="vbar-labels">'+j+'</div><div class="trace-vbar-hint">'+(d==="v2"?"x-axis = Zeus docs/API/V2 verbs (cheap left \u2192 expensive right) \xB7 grey = off-catalog":"x-axis = V1 tools from chat history \xB7 grey = off-catalog")+"</div></div>"}function ze(t){return{showType:!0,showFoldmarker:!0,showLen:!0,collapsed:!t,maxDepth:1/0}}async function $n(t,e,n){if(t){t.innerHTML="";try{let r=await ge(),i=new r(e,ze(!!n)).getElement();i.addEventListener("click",l=>{let d=l.target.closest(".jsv-toggle");if(!d)return;l.stopPropagation();let b=d.closest("li");if(!b)return;let x=[...b.children].find(y=>y.classList&&y.classList.contains("jsv-content"));x&&(l.preventDefault(),l.stopImmediatePropagation(),d.classList.toggle("-rotate-90"),x.classList.toggle("hidden"))},!0),t.appendChild(i)}catch{let r=document.createElement("pre");r.className="trace-pre",r.textContent=Ae(e),t.appendChild(r)}}}function Ne(){return{decomposition:null,query_decomposition:null,summary:"",confidence:"",policy_action:"",source:""}}function Tt(t){return!!t&&typeof t=="object"&&!Array.isArray(t)}function je(t){return Tt(t)&&(Array.isArray(t.targets)||t.predicates!=null||t.output!=null)}function Gn(t){return Tt(t)&&(t.intent!=null||t.entity!=null||t.entity_type!=null||t.geo!=null||t.theme!=null||t.audience!=null)}function F(t,e,n){Tt(t)&&(!e.decomposition&&je(t.decomposition)&&(e.decomposition=t.decomposition,e.source||(e.source=n)),!e.decomposition&&je(t.query_understanding)&&(e.decomposition=t.query_understanding,e.source||(e.source=n)),!e.query_decomposition&&Gn(t.query_decomposition)&&(e.query_decomposition=t.query_decomposition,e.source||(e.source=n)),!e.summary&&typeof t.summary=="string"&&t.summary.trim()&&(e.summary=t.summary.trim()),!e.confidence&&typeof t.confidence=="string"&&(e.confidence=t.confidence),!e.policy_action&&typeof t.policy_action=="string"&&(e.policy_action=t.policy_action))}function He(t){return t==null?null:typeof t=="string"?W(t):typeof t=="object"?t:null}function Rt(t,e){if(!t)return;(Array.isArray(t)?t:[t]).forEach(r=>{if(!r||typeof r!="object")return;let s=r.message||r.choices&&r.choices[0]&&r.choices[0].message,i=r.tool_calls||s&&s.tool_calls||[];(Array.isArray(i)?i:[]).forEach(l=>{let d=l&&(l.function||l)||{},b=He(d.arguments!=null?d.arguments:l&&l.arguments);b&&e(b)}),(r.decomposition||r.query_decomposition)&&e(r)})}function Oe(t){let e=Ne(),n=t&&t.trace||{},r=t&&t.structured||n.structured||{};return F(n.layer_a,e,"layer_a"),F(t&&t.layer_a,e,"layer_a"),F(n,e,"trace"),F(r.artifacts,e,"artifacts"),F(r.layer_a,e,"layer_a"),(n.steps||[]).forEach(s=>{F(s&&s.args,e,"steps"),F(He(s&&(s.result_full||s.result)),e,"steps")}),(n.hops||t&&t.hops||[]).forEach(s=>{F(s&&(s.req||s.args||s.request),e,"hops"),F(s&&(s.res||s.result||s.body||s.response),e,"hops")}),Rt([].concat(n.ai_requests||[],n.ai_responses||[]),s=>F(s,e,"llm")),(t&&t.llmRounds?t.llmRounds:[]).forEach(s=>{Rt(s&&s.req,i=>F(i,e,"llm")),Rt(s&&s.res,i=>F(i,e,"llm"))}),e}function vt(t,e){return'<span class="tt-decomp-chip">'+e(String(t))+"</span>"}function Qn(t,e){let n=e||J;if(t=t||Ne(),!t.decomposition&&!t.query_decomposition)return'<div class="tt-decomp empty">No decomposition on this turn.</div>';let r=t.decomposition||{},s=t.query_decomposition||{},i=Array.isArray(r.targets)?r.targets:[],l=r.predicates,d=r.output!=null?String(r.output):"",b="";t.confidence&&(b+='<span class="tt-badge info">confidence:'+n(t.confidence)+"</span>"),d&&(b+='<span class="tt-badge">output:'+n(d)+"</span>"),t.policy_action&&(b+='<span class="tt-badge">'+n(t.policy_action)+"</span>");let x=[];s.intent!=null&&x.push(vt(s.intent,n)),["entity","entity_type","geo","audience","theme","occasion","price"].forEach(_=>{s[_]!=null&&s[_]!==""&&x.push('<span class="tt-decomp-kv"><span class="k">'+n(_)+"</span> "+n(String(s[_]))+"</span>")});let y=x.length?'<div class="tt-decomp-row"><div class="lab">Query</div><div class="val">'+x.join("")+"</div></div>":"",h=i.map(_=>{if(!_||typeof _!="object")return"";let q=_.entity_type||_.entity||"?",A=_.focus||_.fields||[],L=Array.isArray(A)?A.map(w=>vt(w,n)).join(""):"";return'<div class="tt-decomp-row"><div class="lab">Target</div><div class="val"><strong>'+n(String(q))+"</strong> "+L+"</div></div>"}).join(""),p="";Array.isArray(l)?p=l.map(_=>{if(!_||typeof _!="object")return vt(_,n);let q=_.field||_.path||"",A=_.op||"=",L=_.value!=null?_.value:"";return'<span class="tt-decomp-kv"><span class="k">'+n(String(q))+"</span> "+n(String(A))+" "+n(String(L))+"</span>"}).join(""):Tt(l)&&(p=Object.keys(l).map(_=>'<span class="tt-decomp-kv"><span class="k">'+n(_)+"</span> = "+n(String(l[_]))+"</span>").join(""));let S=p?'<div class="tt-decomp-row"><div class="lab">Where</div><div class="val">'+p+"</div></div>":"",j=d?'<div class="tt-decomp-row"><div class="lab">Output</div><div class="val">'+vt(d,n)+"</div></div>":"";return'<div class="tt-decomp"><header><span>Decomposition</span><span class="tt-decomp-badges">'+b+'</span><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-decomp-copy" data-copy-from="tt-decomp-json" title="Click to copy">Copy</button></header><pre id="tt-decomp-json" hidden></pre>'+(t.summary?'<p class="tt-decomp-summary">'+n(t.summary)+"</p>":"")+y+h+S+j+"</div>"}function Ct(t,e){t=t&&typeof t=="object"?t:{},e=e&&typeof e=="object"?e:{};let n=t.session&&typeof t.session=="object"?t.session:{},r=t.detective&&typeof t.detective=="object"?t.detective:{},s=t.inject&&typeof t.inject=="object"?t.inject:r.prompt&&r.prompt.inject&&typeof r.prompt.inject=="object"?r.prompt.inject:{},i=t.catalog&&typeof t.catalog=="object"?t.catalog:{},l=t.target&&typeof t.target=="object"?t.target:{},d=t.layer_a&&typeof t.layer_a=="object"?t.layer_a:{},b=Array.isArray(t.hops)?t.hops:[],x=t.chat_id||n.chat_id||e.chat_id||"\u2014",y=t.turn_id||n.turn_id||"\u2014",h=t.session_id||n.id||n.session_id||e.session_id||"\u2014",p=t.preferred_req_id||n.preferred_req_id||"\u2014",S=Array.isArray(t.req_ids)?t.req_ids:Array.isArray(n.req_ids)?n.req_ids:b.map(I=>I&&(I.req_id||"")).filter(Boolean),j=b.map(I=>{let it=I&&(I.name||I.verb||I.path_class)||"?",bt=I&&I.status!=null?I.status:"",mt=I&&I.error?" err":"";return it+(bt!==""?":"+bt:"")+mt}),_=l.bucket||"\u2014",q=l.scope||"\u2014",A=l.collection||"\u2014",L=l.mode||e.mode||"\u2014",w=t.zeus_url||"\u2014",T=t.client_version||"\u2014",M=i.tools_count!=null?i.tools_count:"\u2014",H=t.contract_status||n.contract_status||e.contract_status||"\u2014",R=s.brief_sha12||i.brief_sha12||"\u2014",U=s.mini_sha12||i.mini_sha12||"\u2014",N=d.via||"\u2014",E=d.confidence||"\u2014",O=d.policy_action||"\u2014",D=t.tokens&&typeof t.tokens=="object"?t.tokens:{},$=t.export_ref||t.turn_id||"\u2014";return[{id:"ids",label:"1. Ids",value:"chat "+x+" \xB7 turn "+y+" \xB7 sess "+h},{id:"hops",label:"2. Hops",value:"preferred "+p+(S.length?" \xB7 "+S.join(", "):"")+(j.length?" \xB7 "+j.join(" \xB7 "):"")},{id:"target",label:"3. Target",value:w+" \xB7 "+_+"/"+q+"/"+A+" \xB7 "+L+" \xB7 client "+T},{id:"catalog",label:"4. Catalog",value:"brief="+(i.has_scope_brief===!0?"yes":i.has_scope_brief===!1?"no":"\u2014")+" \xB7 mini="+(i.has_mini_schema===!0?"yes":i.has_mini_schema===!1?"no":"\u2014")+" \xB7 tools="+M+" \xB7 contract="+H},{id:"inject",label:"5. Inject",value:"brief_sha "+R+" \xB7 mini_sha "+U},{id:"hoperr",label:"6. Hop table",value:j.length?j.join(" \xB7 "):"(no hops)"},{id:"layer",label:"7. Layer A",value:"via="+N+" \xB7 conf="+E+" \xB7 policy="+O},{id:"tokens",label:"8. Tokens",value:(D.prompt!=null?D.prompt:"?")+" / "+(D.completion!=null?D.completion:"?")+" / "+(D.total!=null?D.total:nt(D)||"?")+(D.ok===!1?" \xB7 ok=false":"")},{id:"export",label:"9. Journal",value:String($)}]}function Yn(t,e){let n=t&&typeof t=="object"?t:{},r=e&&typeof e=="object"?e:{};if(n.multi_agent===!0||r.multi_agent===!0)return!0;let s=n.engine||r.engine||"";if(s==="local_units"||s==="sidecar")return!0;let i=n.units||n.unit_summaries||r.units;return Array.isArray(i)&&i.length>0}function Xn(t,e){let n=t&&typeof t=="object"?t:{},r=e&&typeof e=="object"?e:{},s=n.units||n.unit_summaries||r.units||[];return Array.isArray(s)?s.map((i,l)=>{let d=i&&typeof i=="object"?i:{},b=Array.isArray(d.req_ids)?d.req_ids.filter(Boolean).map(String):[],x=Array.isArray(d.hops)?d.hops.map(p=>{let S=p&&typeof p=="object"?p:{},j=ut(S);return j!=null&&S.bytes==null?Object.assign({},S,{bytes:j}):S}):b.map((p,S)=>({req_id:p,verb:d.kind==="zeus_direct"?"find":"unit",status:d.status==="error"||d.status==="err"?500:200,ms:d.ms||0,bytes:null,preferred:S===0,req:d.call||{},res:{}})),y=String(d.status||"ok"),h=y==="error"||y==="err"||!!d.error_code;return{unit_id:String(d.unit_id||"u"+(l+1)),status:h?"err":y==="partial"||y==="warn"?"warn":"ok",kind:d.kind||"agent_turn",goal:d.goal||"",stuffed_goal:d.stuffed_goal||"",synth:!!d.synth,wave:Number(d.wave)||(d.synth?2:1),catalog_mode:d.catalog_mode||"",has_inject:!!d.has_inject,answer:d.answer||"",req_ids:b,error_code:d.error_code||"",hops:x,llm:Array.isArray(d.llm)?d.llm:Array.isArray(d.llmRounds)?d.llmRounds:[]}}):[]}function dt(t){return t&&typeof t=="object"?t:typeof t=="string"?W(t):null}function st(t){let e=t&&t.detective&&typeof t.detective=="object"?t.detective:{};return e.diagnosis&&typeof e.diagnosis=="object"?e.diagnosis:e}function pt(t){if(!t||typeof t!="object")return null;let e=[t.url,t.path,t.path_class,t.verb],n=dt(t.req)||{};e.push(n.path,n.url,n.method&&n.path?n.method+" "+n.path:"");for(let r=0;r<e.length;r++){let i=String(e[r]||"").match(/\/v2\/([^/]+)\/([^/]+)\/([^/]+)\/([^/?#]+)/);if(i)return{bucket:i[1],scope:i[2],collection:i[3],verb:i[4],path:"/v2/"+i[1]+"/"+i[2]+"/"+i[3]+"/"+i[4],method:String(n.method||t.method||"POST")}}return null}function Vt(t){t=t||{};let e=st(t),n=String(e.request_kind||"").toLowerCase();return n==="http_api"?!0:n==="chat_turn"||(t.llmRounds||[]).length?!1:!!(t.hops||[]).some(pt)}function Zt(t){t=t||{};let e=t.hops||[],n=null,r=null;for(let b=0;b<e.length;b++){let x=pt(e[b]);if(x&&(n=x,r=e[b],e[b].preferred))break}if(!n)return{isDirect:Vt(t)};let s=dt(r.res)||dt(r.body)||{},i=Array.isArray(s.items)?s.items:null,l=s.returned_count!=null?Number(s.returned_count):i?i.length:null,d=i==null&&s.status!=null&&l==null;return{isDirect:!0,verb:n.verb,path:n.path,method:n.method,collection:n.collection,bucket:n.bucket,scope:n.scope,status:r.status!=null?r.status:s.status,bytes:r.bytes,ms:r.ms,args:dt(r.req)||{},output:{status:s.status,returned:l,itemsN:i?i.length:null,slim:d||i==null&&s.status!=null,truncated:s.truncated,scored:s.scored}}}function Wt(t){if(!t)return[];let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=t.playbooks||e.playbooks||[];return Array.isArray(n)?n.map((r,s)=>typeof r=="string"?{id:r,title:r,summary:r,severity:"info",actions:[]}:{id:r.id||r.name||"pb_"+(s+1),title:r.title||r.name||r.id||"Playbook",summary:z(r.summary)||z(r.body)||z(r.tip)||z(r.message)||z(r.description),severity:B(r.severity)||"warn",actions:Array.isArray(r.actions)?r.actions.map(i=>String(i)):[]}):[]}function Re(t){t=t||{};let e=st(t),r=["prompt_grade","speed_grade","error_grade","output_grade","pipeline_grade"].map(b=>B(e[b])).filter(b=>b==="warn"||b==="fail"),s=Array.isArray(t.promptChecks)?t.promptChecks:rt(t.detective),i=ot(s),l=(t.hops||[]).filter(b=>(Number(b.status)||0)>=400).length,d=i.total?i.tone==="ok"?i.passed+"/"+i.total:String(i.total-i.passed):"";return[{id:"overview",label:"Overview",enabled:!0},{id:"diagnosis",label:"Diagnosis",enabled:!0,pill:r.length?String(r.length):"",pillKind:r.length?"warn":""},{id:"prompt",label:"Prompt",enabled:!0,pill:d,pillKind:i.total?i.tone==="ok"?"ok":"err":""},{id:"timeline",label:"Timeline",enabled:!0},{id:"tools",label:"Tools",enabled:!0,pill:String(l||(t.hops||[]).length||0),pillKind:l?"err":""},{id:"session",label:"Session",enabled:!0},{id:"raw",label:"Raw",enabled:!0}]}function De(t){if(!t)return!1;if(t.status&&t.status!=="ok")return!0;let e=B(t.grade);if(e==="warn"||e==="fail"||t.errCount>0)return!0;let n=st(t);if(["prompt_grade","speed_grade","error_grade","output_grade","pipeline_grade"].some(i=>{let l=B(n[i]);return l==="warn"||l==="fail"}))return!0;let s=t.playbooks||Wt(t.detective);return Array.isArray(s)&&s.length>0}function Pt(t){return De(t)?"diagnosis":"overview"}function tr(t,e){let n=Re(t),r=e||Pt(t),s=n.find(i=>i.id===r&&i.enabled);return{tabs:n,current:s?r:Pt(t)}}function et(t){if(t==null)return"";let e=String(t).trim();return!e||e==="\u2014"||e==="-"||e==="undefined"||e==="null"?"":e}function Ie(t){t=t||{};let e=t.trace||{},n=t.detective||{},r=n.overview&&typeof n.overview=="object"?n.overview:{},s=(r.target&&typeof r.target=="object"?r.target:null)||(e.target&&typeof e.target=="object"?e.target:{})||{},i=e.session&&typeof e.session=="object"?e.session:{},l=st(t),d=(n.prompt&&typeof n.prompt=="object"?n.prompt:{})||{},b=l.prompt&&typeof l.prompt=="object"?l.prompt:{},x=t.hops||[],y=et(t.preferred_req_id||r.preferred_req_id),h=[];function p(L,w){let T=et(w);T&&h.push({key:L,value:T})}p("req_id",y);let S=r.total_ms!=null?r.total_ms:t.metrics&&t.metrics.total!=null?t.metrics.total:l.slow&&(l.slow.wall_ms||l.slow.total_ms);S&&p("duration",kt(S)),p("scope",s.scope||[s.bucket,s.scope].filter(Boolean).join("/"));let j=[s.bucket,s.scope,s.collection].filter(Boolean).join("/");p("target",j);let _=b.chat_request_base_id||d.base_id||d.lineage||"",q=b.custom_label||b.chat_request_custom_id||"";(et(_)||et(q))&&p("lineage",(et(_)||"\u2014")+" \xB7 "+(et(q)||"custom \u2014")),p("mode",s.mode||t.mode),p("session_id",t.session_id||i.id||i.session_id||e.session_id),p("chat_id",e.chat_id||i.chat_id||t.chat_id||r.chat_id),p("turn_id",t.turn_id||e.turn_id||i.turn_id||r.turn_id),p("contract",t.contract_status||e.contract_status||i.contract_status);let A=x.find(L=>pt(L))||x[0];if(A){let L=pt(A),w=(L?A.req&&A.req.method||"POST":"")+(L?" "+L.path:A.verb?" "+A.verb:"")+(A.status!=null?"  "+A.status:"")+(A.bytes!=null?"  "+Ut(A.bytes):"");p("edge",w.trim())}return h}function Pe(t){t=t||{};let e=t.trace||{},n=t.detective||{},r=n.overview&&typeof n.overview=="object"?n.overview:{},s=(r.tokens&&typeof r.tokens=="object"?r.tokens:null)||(e.tokens&&typeof e.tokens=="object"?e.tokens:{})||{},i=[];function l(j,_,q){q==null||q===""||i.push({id:j,label:_,value:String(q)})}!(s.ok===!1||s.prompt==null&&s.total==null)&&s.prompt!=null&&l("token_in","Token IN",Number(s.prompt).toLocaleString()),s.completion!=null&&l("token_out","Token OUT",Number(s.completion).toLocaleString()),s.total!=null&&l("token_total","TOTAL",Number(s.total).toLocaleString());let b=r.rounds!=null?r.rounds:(t.llmRounds||[]).length;b&&l("rounds","LLM rounds",String(b));let x=(t.hops||[]).length||r.hop_count;x&&l("tools","Tool calls",String(x));let y=0,h=!1;(t.hops||[]).forEach(j=>{let _=dt(j.res)||{};_.returned_count!=null?(h=!0,y+=Number(_.returned_count)||0):Array.isArray(_.rows)?(h=!0,y+=_.rows.length):Array.isArray(_.items)&&(h=!0,y+=_.items.length)}),h&&l("records","Records",y.toLocaleString());let p=0;(t.hops||[]).forEach(j=>{typeof j.bytes=="number"&&(p+=j.bytes)}),p&&l("zeus_data","Zeus data",Ut(p));let S=r.total_ms!=null?r.total_ms:t.metrics&&t.metrics.total;return S&&l("wall","Total time",kt(S)),i}function er(t){let e=Pe(t).slice(),n={};e.forEach(i=>{n[i.id]=!0});function r(i,l,d){n[i]||d==null||d===""||(n[i]=!0,e.push({id:i,label:l,value:String(d)}))}let s=Zt(t);if(s&&s.isDirect)s.status!=null&&r("http","HTTP",s.status),s.output&&s.output.returned!=null&&!n.records&&r("returned","Returned",Number(s.output.returned).toLocaleString());else{let i=t&&t.hops?t.hops:[],l=i.find(d=>d&&d.preferred)||i[0];l&&l.status!=null&&r("http","HTTP",l.status)}return e}function Be(t){t=t||{};let e=st(t),n=e.slow&&typeof e.slow=="object"?e.slow:{};if(Array.isArray(n.top)&&n.top.length)return n.top.slice(0,5).map((i,l)=>({rank:i.rank||l+1,label:i.label||i.name||"span",ms:i.ms,share_pct:i.share_pct,why:i.why||"",kind:i.kind||""}));let r=[];(t.spans||[]).forEach(i=>{i&&Number(i.ms)>0&&r.push({label:i.name||i.phase||"span",ms:Number(i.ms),kind:i.cls||"span"})}),r.length||(t.hops||[]).forEach(i=>{i&&Number(i.ms)>0&&r.push({label:i.verb||i.name||"hop",ms:Number(i.ms),kind:"hop"})}),r.sort((i,l)=>l.ms-i.ms);let s=Number(n.wall_ms||n.total_ms||t.metrics&&t.metrics.total||0);return r.slice(0,3).map((i,l)=>({rank:l+1,label:i.label,ms:i.ms,share_pct:s?Math.round(i.ms/s*100):void 0,why:"",kind:i.kind}))}function Ue(t){t=t||{};let e=t.trace||{},n=(e.layer_a&&typeof e.layer_a=="object"?e.layer_a:{})||{},r=Oe({trace:e,hops:t.hops,llmRounds:t.llmRounds,layer_a:n});return{via:z(n.via),confidence:z(n.confidence||r.confidence),policy_action:z(n.policy_action||r.policy_action),summary:z(n.summary||r.summary),has_summary:!!(n.summary||r.summary),has_query_decomposition:!!r.query_decomposition,has_decomposition:!!r.decomposition,has_confidence:!!(n.confidence||r.confidence),has_terminate:!!(n.via||n.summary||r.summary),terminate_via:z(n.via),intent:r.query_decomposition&&r.query_decomposition.intent||z(n.intent),query_decomposition:r.query_decomposition,decomposition:r.decomposition}}function nr(t){t=t||{};let e=t.detective||{},n=st(t),r=Vt(t),s=Zt(t),i=Ue(t),l=(n.prompt&&typeof n.prompt=="object"?n.prompt:{})||(e.prompt&&typeof e.prompt=="object"?e.prompt:{}),d=n.slow&&typeof n.slow=="object"?n.slow:{},b=n.errors&&typeof n.errors=="object"?n.errors:{},x=n.output&&typeof n.output=="object"?n.output:{},y=n.pipeline&&typeof n.pipeline=="object"?n.pipeline:{},h=t.hops||[],p=h.filter(E=>(Number(E.status)||0)>=400),S=Array.isArray(b.items)&&b.items.length?b.items:p.map(E=>({where:"hop",name:E.verb||E.name||"",message:E.error||"HTTP "+E.status,ms:E.ms})),j=b.count!=null?Number(b.count):S.length,_=h.find(E=>String(E.verb||E.name||"").toLowerCase()==="pipeline"),q=_&&Array.isArray(_.step_costs)?_.step_costs:[],A=!!(y.present||_),L=[["prompt",n.prompt_grade||t.prompt_grade],["speed",n.speed_grade],["errors",n.error_grade],["output",n.output_grade],["pipeline",n.pipeline_grade]].map(E=>({id:E[0],value:B(E[1])||String(E[1]||""),cls:B(E[1])})).filter(E=>E.cls||E.value),w=[],T=[];if(r)T.push("zeus_client V2 Direct \u2014 chat framing N/A"),s.path&&T.push((s.method||"POST")+" "+s.path);else{T.push("Checklist: "+(l.verdict||l.checklist_verdict||t.prompt_grade||"?")),(l.chat_request_base_id||l.custom_label)&&T.push("Lineage: "+(l.chat_request_base_id||"\u2014")+" \xB7 "+(l.custom_label||"\u2014"));let E=e.overview&&e.overview.catalog_flags||{},O=l.has_scope_brief!=null?l.has_scope_brief:E.has_scope_brief,D=l.has_mini_schema!=null?l.has_mini_schema:E.has_mini_schema;T.push("SCOPE BRIEF: "+(O?"yes":"no")+" \xB7 MINI-SCHEMA: "+(D?"yes":"no"));let $=l.tool_count!=null?l.tool_count:(t.hops||[]).length;T.push("Tools on wire: "+$+(l.has_return_verb?" \xB7 return yes":"")+(l.has_pipeline_verb?" \xB7 pipeline yes":""))}w.push({n:1,title:"1. Good prompt / contract?",grade:r?"skip":B(n.prompt_grade||t.prompt_grade)||"na",items:T,jump:"prompt"});let M=Be(t),H=d.wall_ms||d.total_ms||t.metrics&&t.metrics.total||0,R=M.map(E=>E.label+" "+E.ms+"ms");w.push({n:2,title:"2. What took longest?",grade:B(n.speed_grade||d.grade)||"na",muted:"wall "+H+"ms"+(d.ai_ms_total!=null?" \xB7 ai "+Math.round(d.ai_ms_total)+"ms":"")+(d.api_ms_total!=null?" \xB7 api "+Math.round(d.api_ms_total)+"ms":""),items:R}),w.push({n:3,title:"3. Errors?",grade:j?"fail":B(n.error_grade)||"pass",items:S.map(E=>"["+(E.where||"")+"] "+(E.name||"")+": "+(E.message||"")),muted:j?"":"No tool / vector / FTS errors recorded."});let U={n:4,title:"4. Output schema followed?",grade:r?"skip":B(n.output_grade||x.grade)||"na",items:[],muted:""};r&&s.isDirect?(U.items.push("zeus_client V2 Direct \xB7 "+(s.verb||"")+" "+(s.collection||"")),s.output&&U.items.push("V2 envelope \xB7 "+(s.output.slim?"slim keep (items[] omitted)":"body retained")+(s.output.returned!=null?" \xB7 returned_count "+s.output.returned:"")),U.muted="Layer A terminate N/A. zeus_client output is the V2 JSON body."):(U.items.push("Terminate: "+(i.has_terminate?"yes via "+(i.terminate_via||""):"no")),U.items.push("summary: "+(i.has_summary?"yes":"no")+" \xB7 query_decomposition: "+(i.has_query_decomposition?"yes":"no")+" \xB7 decomposition: "+(i.has_decomposition?"yes":"no")+" \xB7 confidence: "+(i.has_confidence?"yes":"no")),i.summary&&(U.muted="summary: "+i.summary)),w.push(U);let N={n:5,title:"5. Pipeline / MASQ?",grade:B(n.pipeline_grade||y.grade)||(A?"pass":"na"),items:[],muted:A?y.logic||y.masq_note||"":"No pipeline call this turn. (MASQ budgets multi-verb plans best via pipeline.)"};return A?(Array.isArray(y.steps)&&y.steps.length?y.steps:q).forEach(O=>{let D=O&&(O.name||O.verb||O.as)||"";D&&N.items.push(String(D)+(O.verb&&O.name?" \u2192 "+O.verb:""))}):r&&s.verb&&s.verb!=="pipeline"&&(N.muted="Single V2 verb "+s.verb+" (not a pipeline). MASQ multi-verb plans go through pipeline."),w.push(N),{headline:z(n.headline)||z(t.headline)||"Diagnosis",request_kind:r?"http_api":String(n.request_kind||"chat_turn"),request_kind_label:r?n.request_kind_label||"HTTP API":n.request_kind_label||"Chat turn",grades:L,slowTop:M,cards:w,playbooks:Wt(e),isDirect:r}}function rr(t){t=t||{};let e=t.detective||{},n=e.prompt&&typeof e.prompt=="object"?e.prompt:{},r=Array.isArray(t.promptChecks)?t.promptChecks.map(Dt):rt(e),s=ot(r),i=B(n.verdict||t.prompt_grade)||(s.tone==="err"?"fail":s.total?"pass":"skip"),l=r.filter(Nn).map(Hn);return{verdict:i,summary:z(n.summary)||s.label,rounds:n.rounds||(t.llmRounds||[]).length||0,checks:r,tiles:l,checkSummary:s}}function or(t){t=t||{};let n=Ie(t).filter(s=>["req_id","session_id","chat_id","turn_id","contract","scope","mode"].includes(s.key)),r=(t.hops||[]).map(s=>({req_id:s.req_id||"",verb:s.verb||"",status:s.status,preferred:!!s.preferred}));return{kv:n,hops:r}}var Ke=["wish_i_knew","jail_break_attempt","hooks_jailbreak_score"],sr=["chat_id","turn_id","session_id","req_ids","zeus_url","client_version","target","catalog","contract_status","tokens","export_ref","stamp"];function $t(t){if(!t||typeof t!="object")return t;if(Array.isArray(t))return t.map($t);let e={};return Object.keys(t).forEach(n=>{Ke.includes(n)||(e[n]=$t(t[n]))}),e}function Fe(t){if(!t||typeof t!="object"||Array.isArray(t))return t;let e={...t};return Ke.forEach(n=>{delete e[n]}),Array.isArray(e.business_rules_triggers)&&delete e.business_rules_triggers,e}function ir(t){if(!t||typeof t!="object")return{};let e={...t.public_trace&&typeof t.public_trace=="object"?t.public_trace:{}};if(t.detective!=null&&(e.detective=t.detective),t.preferred_req_id){e.preferred_req_id=t.preferred_req_id;let n=e.session&&typeof e.session=="object"?{...e.session}:{};n.preferred_req_id=t.preferred_req_id,e.session=n}if(t.hops!=null&&!e.hops)try{e.hops=Array.from(t.hops)}catch{e.hops=t.hops}if(t.notes!=null&&!e.notes)try{e.notes=Array.from(t.notes)}catch{e.notes=t.notes}return sr.forEach(n=>{t[n]!=null&&e[n]==null&&(e[n]=t[n])}),t.rounds!=null&&e.rounds==null&&(e.rounds=t.rounds),e}function qt(t){if(!t||typeof t!="object")return null;let e=t;if(!e.trace&&e.debug&&(e={...e,trace:ir(e.debug)}),!e.trace||typeof e.trace!="object")return null;let n=$t({...e.trace});return n.layer_a&&(n.layer_a=Fe(n.layer_a)),e.layer_a&&(e={...e,layer_a:Fe(e.layer_a)}),n.question==null&&e.question,{...e,trace:n}}function ar(t){if(!t||typeof t!="object")return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=String(e.grade||t.diagnosis_grade||e.status||t.grade||"").toLowerCase();if(["fail","error","err","failed"].includes(n))return"fail";if(["warn","warning"].includes(n))return"warn";if(["pass","ok","healthy","clear"].includes(n))return"pass";let r=t.playbooks||e.playbooks||[];return Array.isArray(r)&&r.length?"warn":"pass"}function lr(t){if(!t||typeof t!="object")return"";let e=t.prompt||t.prompt_check||{};return String(t.prompt_grade||e.grade||(e.ok===!1?"warn":e.ok?"pass":"")).toLowerCase()}function cr(t){if(!t)return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=e.headline||t.headline||e.summary||t.summary||e.title||"";return z?z(n):typeof n=="string"?n:""}function dr(t){if(xt)return xt(t)||"";if(!t)return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=e.overview||t.overview||e.detail||t.detail||"";return typeof n=="string"?n:""}function pr(t){if(!t)return[];let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=t.playbooks||e.playbooks||[];return Array.isArray(n)?n.map((r,s)=>typeof r=="string"?{id:r,title:r,body:r,tip:r}:{id:r.id||r.name||"pb_"+(s+1),title:r.title||r.name||r.id||"Playbook",body:r.body||r.tip||r.message||r.description||"",tip:r.tip||r.body||""}):[]}function ur(t,e){return t&&t.req!=null?t.req:t&&t.request!=null?t.request:t&&t.args!=null?t.args:e&&e.args!=null?e.args:e&&e.pipeline_json!=null?e.pipeline_json:{}}function fr(t,e){if(t&&t.res!=null)return t.res;if(t&&t.response!=null)return t.response;if(t&&t.result_json!=null)return t.result_json;if(t&&t.result!=null)return t.result;if(t&&t.body!=null)return t.body;if(e){let n=W(e.result_full||e.result);if(n)return n;if(e.result!=null)return{preview:String(e.result).slice(0,2e3)}}if(t&&t.snippet){let n=W(t.snippet);if(n)return n}return{}}function Je(t,e,n){return ut?ut(t,e,n):t&&t.bytes!=null?t.bytes:t&&t.byte_size!=null?t.byte_size:e&&e.bytes!=null?e.bytes:null}function br(t,e,n){let r=(e||[]).filter(s=>s&&s.type==="tool");return Array.isArray(t.hops)&&t.hops.length?t.hops.map((s,i)=>{let l=wt?wt(r,s,i):null,d=ur(s,l),b=fr(s,l);return{req_id:s.req_id||s.id||"",verb:s.verb||s.name||s.tool||"?",status:s.status!=null?s.status:s.http_status!=null?s.http_status:0,ms:s.ms!=null?s.ms:s.duration_ms!=null?s.duration_ms:0,bytes:Je(s,l,b),preferred:!!(s.preferred||n&&(s.req_id===n||s.id===n)),req:d,res:b,snippet:s.snippet||"",step_costs:Array.isArray(s.step_costs)?s.step_costs:null,body:s.body!=null?s.body:null,url:s.url||"",error:s.error||"",path_class:s.path_class||s.name||s.verb||""}}):r.map(s=>{let l=W(s.result_full||s.result)||(s.result!=null?{preview:String(s.result).slice(0,2e3)}:{});return{req_id:s.req_id||"",verb:s.name||"?",status:s.status!=null?s.status:0,ms:s.ms||0,bytes:Je(s,null,l),preferred:!!(n&&s.req_id===n),req:s.args||s.pipeline_json||{},res:l}})}function mr(t,e){let n=t.ai_requests||[],r=t.ai_responses||[],s=Math.max(n.length,r.length);return s?Array.from({length:s},(i,l)=>({round:l+1,call:l+1,kind:"llm",label:"Round "+(l+1),finish:r[l]&&(r[l].finish_reason||r[l].finish)||"",tok_in:n[l]&&n[l].usage&&n[l].usage.prompt_tokens||r[l]&&r[l].usage&&r[l].usage.prompt_tokens,tok_out:r[l]&&r[l].usage&&r[l].usage.completion_tokens,tok_total:r[l]&&r[l].usage&&r[l].usage.total_tokens||n[l]&&n[l].usage&&n[l].usage.total_tokens,req:n[l]||{},res:r[l]||{}})):(e||[]).filter(i=>i&&(i.type==="llm"||i.type==="llm_error"||i.type==="force_final")).map((i,l)=>{let d=i.type||"llm",b=d==="force_final",x=d==="llm_error",y=i.round!=null?i.round:l+1;return{round:y,call:l+1,kind:d,label:b?"force_final":"Round "+y,finish:b?i.cause||i.finish_reason||"force_final":i.finish_reason||(x?"error":""),tok_in:i.usage&&i.usage.prompt_tokens,tok_out:i.usage&&i.usage.completion_tokens,tok_total:i.usage&&i.usage.total_tokens,req:b?{type:"force_final",cause:i.cause,content_len:i.content_len,ms:i.ms,model:i.model}:{tool_calls:i.tool_calls,ms:i.ms,model:i.model},res:x?{error:i.detail}:b?{type:"force_final",cause:i.cause,content_len:i.content_len,finish_reason:i.finish_reason,usage:i.usage}:{tool_calls:i.tool_calls,finish_reason:i.finish_reason,usage:i.usage}}})}function hr(t,e){return t&&t.created!=null?"c:"+t.created+":"+e:t&&t.trace&&t.trace.turn_id?"t:"+t.trace.turn_id:"i:"+e}function gr(t,e){let n={...e},r=t.tokens&&typeof t.tokens=="object"?t.tokens:null;if(r)n.tokensIn=Number(r.prompt)||0,n.tokensOut=Number(r.completion)||0,n.tokensCached=Number(r.cached)||0,n.hasIn=r.prompt!=null,n.hasOut=r.completion!=null,n.hasTokens=!!(r.ok||r.total!=null||r.prompt!=null||r.completion!=null),r.total!=null&&(n.tokens=Number(r.total)||n.tokens);else{let s=0,i=0,l=!1,d=!1;(t.steps||[]).forEach(b=>{let x=b&&b.usage;x&&(x.prompt_tokens!=null&&(s+=Number(x.prompt_tokens)||0,l=!0),x.completion_tokens!=null&&(i+=Number(x.completion_tokens)||0,d=!0))}),n.tokensIn=s,n.tokensOut=i,n.tokensCached=0,n.hasIn=l,n.hasOut=d,n.hasTokens=n.tokens>0||l||d}return n}function yr(t){return(Array.isArray(t.notes)?t.notes:[]).map(String).filter(n=>n.startsWith("semantic_cache."))}function Gt(t,e){let n=qt(t)||t||{},r=n.trace||{},s=Array.isArray(r.steps)?r.steps:[],i=r.session&&typeof r.session=="object"?r.session:{},l=n.session_id||r.session_id||i.id||i.session_id||"",d=r.preferred_req_id||i.preferred_req_id||n.preferred_req_id||"",b=r.detective&&typeof r.detective=="object"?r.detective:null,x=Ft(r)||{total:0,aiMs:0,zeusMs:0,other:0,tokens:0,bytes:0},y=gr(r,x),h=br(r,s,d),p=Array.isArray(r.hops)&&r.hops.length?r.hops:h,S=St?St(s,p):s,j=h.filter(M=>(Number(M.status)||0)>=400).length,_=ar(b),q=rt?rt(b):[],A="ok";n.session_error||_==="fail"?A="err":(j||_==="warn")&&(A="warn"),n.session_error&&(A="err");let L=r.catalog&&typeof r.catalog=="object"?r.catalog:{},w=r.inject&&typeof r.inject=="object"?r.inject:{},T=r.stamp&&typeof r.stamp=="object"?r.stamp:{};return{key:hr(n,e),index:e,question:n.question||r.question||"(loaded turn)",answer:n.answer||r.answer||"",status:A,api_version:n.api_version||r.api_version||"v2",mode:n.mode||L&&L.source||r.target&&r.target.mode||"",target:typeof n.target=="string"?n.target:r.target&&typeof r.target=="object"?[r.target.bucket,r.target.scope,r.target.collection].filter(Boolean).join("/"):typeof r.target=="string"?r.target:"",provider:n.provider||"",model:n.model||"",session_id:l,session_round:n.session_round!=null?n.session_round:i.round!=null?i.round:null,contract_status:n.contract_status||i.contract_status||r.contract_status||"",preferred_req_id:d,turn_id:r.turn_id||i.turn_id||"",metrics:y,spans:jt?jt(r,h,S):Array.isArray(r.spans)?r.spans:[],steps:S,hops:h,llmRounds:mr(r,S),detective:b,grade:_,prompt_grade:lr(b),headline:cr(b),overview:dr(b),playbooks:pr(b),promptChecks:q,checkSummary:ot?ot(q):{passed:0,total:0,label:"",tone:""},gather:Ct?Ct(r,n):[],toolsCount:h.length,errCount:j,session_error:n.session_error||i.error||r.session_error||"",catalog:L,inject:w,stamp:T,semanticCache:yr(r),layer_a:r.layer_a||n.layer_a||null,raw:n,trace:r}}var k=()=>At,Q=12;function Ve(t){if(!t)throw new Error("createTracePanel requires a root element");let e={getClientVersion:()=>"",getHubBase:()=>"",getChatId:()=>null,getChartOrder:()=>({v1:[],v2:[]}),showToast:o=>console.log(o)},n=[],r=null,s="overview",i=0,l=0,d=null,b=!1,x=!1,y=0;function h(o){return t.querySelector("#"+o)}function p(o){return(k().escapeHtml||(a=>String(a)))(o)}let S={external:"M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",star:"M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",check:"M4.5 12.75 9 17.25 19.5 6.75"};function j(o){let a=S[o];return a?'<span class="inline-block w-4 h-4 shrink-0" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="'+a+'" /></svg></span>':""}function _(o){let a=String(o||"").toLowerCase(),c="badge-ghost";return a==="ok"||a==="pass"?c="badge-success":a==="warn"?c="badge-warning":a==="err"||a==="fail"||a==="error"||a==="bad"?c="badge-error":a==="info"&&(c="badge-info"),"badge badge-sm "+c}function q(o,a){return o?'<button type="button" class="btn btn-ghost btn-xs font-mono tt-id" data-copy="'+p(o)+'" title="Click to copy">'+p(H(o,a||14))+"</button>":""}function A(o){return["req_id","session_id","chat_id","turn_id","call_id","job_id","preferred_req_id"].includes(String(o||""))}function L(o,a){return A(o)&&a?q(a,40):p(a)}function w(){return'<span class="tt-sep" aria-hidden="true">\xB7</span>'}function T(o){return(k().fmtMs||(a=>a+"ms"))(o)}function M(o){return(k().fmtBytes||(a=>a+"B"))(o)}function H(o,a){return(k().shortId||(c=>String(c||"")))(o,a)}function R(o){return(k().prettyJSON||JSON.stringify)(o,null,2)}function U(o){if(k().tryParseJSON)return k().tryParseJSON(o);if(o==null)return null;if(typeof o=="object")return o;try{return JSON.parse(o)}catch{return null}}function N(o,a){try{e.showToast(o,a||"success")}catch{}}function E(o){!o||!o.classList||(o.classList.add("is-copied"),clearTimeout(o._copiedTimer),o._copiedTimer=setTimeout(()=>{try{o.classList.remove("is-copied")}catch{}},1400))}function O(o,a){let c=String(o??"");if(!c){N("Nothing to copy","warning");return}let u=k().copyToClipboard?k().copyToClipboard(c):Promise.resolve().then(()=>navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(c).then(()=>!0,()=>!1):!1);Promise.resolve(u).then(m=>{m?(E(a),N("copied "+H(c,28))):N("Copy failed","error")},()=>N("Copy failed","error"))}function D(){for(let o=n.length-1;o>=0;o--){let a=n[o],c=a&&a.trace||{};if(k().isMultiAgentTrace?k().isMultiAgentTrace(c,a):c.multi_agent)return a}return null}function $(o){let a=o||D()||{},c=k().extractJobUnits;return c?c(a.trace||{},a):[]}function I(o){let a=o||$();return a.length?((y<0||y>=a.length)&&(y=0),a[y]):null}function it(o){let a=t.querySelector(".tt-title");a&&(a.textContent=o?"Job traces":"Turn traces");let c=h("tt-empty");c&&!n.length&&(c.textContent=o?"No job run yet.":"No turn run yet.");let u=h("tt-turn-picker-label");u&&(u.textContent=o?"Unit":"Turn");let m=h("tt-turns");m&&m.setAttribute("aria-label",o?"Units":"Turns"),t.querySelectorAll(".tt-tab[data-job], .tt-tab[data-turn]").forEach(f=>{let v=f.hasAttribute("data-job")&&!f.hasAttribute("data-turn"),C=f.hasAttribute("data-turn")&&!f.hasAttribute("data-job");f.hidden=v&&!o||C&&o});let g=h("tt-panel");g&&g.classList.toggle("tt-job-mode",!!o)}function bt(o){let a=!!o;if(x===a){it(x);return}x=a,y=0,i=0,l=0,d=null,s="overview",it(x),at(),V()}function mt(){return n.map((a,c)=>Gt(a,c)).reverse()}function Xt(){let o=mt();return o.length?o.find(a=>a.key===r)||o[0]:null}function te(){let o=h("tt-turn-dropdown");o&&(o.open=!1);let a=h("tt-turn-summary");a&&a.setAttribute("aria-expanded","false")}function Y(o){let a=h("tt-pick-n"),c=h("tt-pick-q"),u=h("tt-pick-meta"),m=h("tt-pick-dot"),g=h("tt-pick-err");if(!o){a&&(a.textContent=""),c&&(c.textContent=x?"Select a unit":"Select a turn"),u&&(u.textContent=""),m&&(m.className="dot"),g&&(g.hidden=!0);return}a&&(a.textContent=o.n||""),c&&(c.textContent=o.question||""),u&&(u.textContent=o.meta||"");let f=o.status||"ok";m&&(m.className="dot"+(f==="ok"?" ok":" "+f)),g&&(g.hidden=!o.errLabel,g.textContent=o.errLabel||"",g.className="badge badge-xs shrink-0 "+(f==="err"?"badge-error":"badge-warning"))}function ee(){try{let o=String(e.getHubBase()||""),a=k().normalizeHubBase;return a?a(o):o.replace(/\/$/,"")}catch{return""}}function ht(o){let a=k().hubDebugSessionUrl;if(a)try{return a(e.getHubBase()||"",o)}catch{return""}return""}function gt(o){let a=k().hubDebugReqUrl;if(a)try{return a(e.getHubBase()||"",o)}catch{return""}return""}function ne(o){if(!o){N("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning");return}window.open(o,"_blank","noopener,noreferrer")}function yt(o){s=o,t.querySelectorAll(".tt-tab").forEach(a=>{let c=a.dataset.tab===o;a.classList.toggle("on",c),a.classList.toggle("tab-active",c),a.setAttribute("aria-selected",c?"true":"false")}),t.querySelectorAll(".tt-tab-panel").forEach(a=>{a.classList.toggle("on",a.id==="tt-panel-"+o)})}function re(o){let a=x?$().length:o,c=a>0,u=h("tt-turn-count");u&&(x?u.textContent=a+" unit"+(a===1?"":"s"):u.textContent=a+" turn"+(a===1?"":"s"),u.hidden=!c);let m=t.querySelector("#tt-panel .tt-hdr-actions");m&&(m.hidden=!c)}function Qe(o,a){let c=h("tt-session");if(!c)return;let u=o||{},m=u.trace||{},g=m.job_id||u.job_id||"",f=m.pack||u.pack||"",v=m.engine||u.engine||"local_units",C=m.status||u.status||"",P=C==="ok"?"ok":C==="partial"?"warn":C?"err":"info";c.hidden=!1,c.innerHTML="<span>job</span>"+(g?q(g,40):'<span class="tt-muted">\u2014</span>')+'<span class="tt-sep">\xB7</span>'+(f?"<span>pack <strong>"+p(f)+"</strong></span>":'<span class="tt-muted">no pack</span>')+'<span class="tt-sep">\xB7</span><span>engine '+p(v)+"</span>"+(C?'<span class="tt-sep">\xB7</span><span class="tt-badge '+P+'">'+p(C)+"</span>":"")+'<span class="tt-sep">\xB7</span><span>'+(a?a.length:0)+" units \xB7 isolated \xB7 no shared session</span>"}function Et(o){let a=h("tt-session");if(!a)return;if(!o||!o.session_id&&!o.preferred_req_id&&!o.contract_status&&!(o.gather&&o.gather.length)&&!(o.semanticCache&&o.semanticCache.length)&&!(o.stamp&&o.stamp.user)){a.hidden=!0,a.innerHTML="";return}a.hidden=!1;let c=o.contract_status||"",u=c==="match"?"ok":c==="drift"?"warn":"info",m=ht(o.session_id),g=o.semanticCache&&o.semanticCache[0]||"",f=g.includes("recall")?"recall":g.includes("write")?"write":g.includes("probe")?"probe":g?"on":"";a.innerHTML="<span>Session</span>"+(o.session_id?q(o.session_id,14):'<span class="tt-muted">\u2014</span>')+'<span class="tt-sep">\xB7</span>'+(o.session_round!=null?"<span>round <strong>"+p(String(o.session_round))+"</strong></span>":'<span class="tt-muted">round \u2014</span>')+(c?'<span class="tt-sep">\xB7</span><span class="tt-badge '+u+'">contract:'+p(c)+"</span>":"")+(o.preferred_req_id?'<span class="tt-sep">\xB7</span><span>preferred</span>'+q(o.preferred_req_id,14):"")+(m?'<span class="tt-sep">\xB7</span><a class="tt-link" href="'+p(m)+'" target="_blank" rel="noopener">Hub session</a>':'<span class="tt-sep">\xB7</span><button type="button" class="tt-linkish" data-action="hub-missing">Hub session</button>')+(o.gather&&o.gather.length?'<span class="tt-sep">\xB7</span><span class="tt-badge info">gather 9</span>':"")+(f?'<span class="tt-sep">\xB7</span><span class="tt-badge info" title="'+p(g)+'">cache:'+p(f)+"</span>":"")+(o.stamp&&o.stamp.user?'<span class="tt-sep">\xB7</span><span class="tt-muted">user '+p(String(o.stamp.user))+"</span>":"")}function Ye(o){let a=h("tt-turns");if(!a)return;if(a.innerHTML="",!o.length){a.innerHTML='<div class="tt-empty-inline">No units</div>',Y(null);return}o.forEach((u,m)=>{let g=[];g.push('<span class="tt-turn-tag">'+p(u.kind)+"</span>"),u.synth?g.push('<span class="tt-turn-tag synth">synth</span>'):g.push('<span class="tt-turn-tag">isolated</span>'),g.push('<span class="tt-turn-tag">'+(u.req_ids||[]).length+" req</span>"),u.error_code&&g.push('<span class="tt-turn-tag err">'+p(u.error_code)+"</span>");let f=document.createElement("button");f.type="button",f.className="tt-turn-item"+(m===y?" active":""),f.setAttribute("role","option"),f.setAttribute("aria-selected",m===y?"true":"false"),f.innerHTML='<div class="row1"><span class="dot '+p(u.status)+'" aria-hidden="true"></span><span class="n">'+p(u.unit_id)+'</span><span class="meta">w'+p(String(u.wave))+'</span></div><div class="q">'+p(u.goal||u.answer||u.unit_id)+'</div><div class="row3">'+g.join("")+"</div>";let v=()=>{y=m,i=0,l=0,te(),V()};f.onclick=v,f.onkeydown=C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),v())},a.appendChild(f)});let c=I(o);Y(c?{n:c.unit_id,question:c.goal||c.answer||c.unit_id,meta:"w"+String(c.wave)+" \xB7 "+(c.req_ids||[]).length+" req",status:c.status==="ok"?"ok":c.status,errLabel:c.error_code||(c.status==="err"?"err":"")}:null)}function Xe(o){let a=h("tt-turns");if(!a)return;if(a.innerHTML="",!o.length){a.innerHTML='<div class="tt-empty-inline">No turns</div>',Y(null);return}o.forEach(u=>{let m=u.index+1,g=u.llmRounds.length||u.trace.rounds||0,f=u.status==="ok"?"ok":u.status,v=[];u.mode&&v.push('<span class="tt-turn-tag">'+p(u.mode)+"</span>"),u.target&&v.push('<span class="tt-turn-tag">'+p(H(u.target,28))+"</span>"),u.errCount&&v.push('<span class="tt-turn-tag err">'+u.errCount+" err</span>");let C=u.key===r,P=document.createElement("button");P.type="button",P.className="tt-turn-item"+(C?" active":""),P.dataset.key=u.key,P.setAttribute("role","option"),P.setAttribute("aria-selected",C?"true":"false"),P.innerHTML='<div class="row1"><span class="dot '+p(f)+'" aria-hidden="true"></span><span class="n">#'+m+'</span><span class="dur">'+p(T(u.metrics.total))+'</span><span class="meta">'+g+"r \xB7 "+u.toolsCount+' tools</span></div><div class="q">'+p(u.question)+"</div>"+(v.length?'<div class="row3">'+v.join("")+"</div>":"");let ce=()=>{r=u.key,i=0,l=0,te(),V()};P.onclick=ce,P.onkeydown=zt=>{(zt.key==="Enter"||zt.key===" ")&&(zt.preventDefault(),ce())},a.appendChild(P)});let c=o.find(u=>u.key===r)||o[0];if(c){let u=c.llmRounds.length||c.trace.rounds||0;Y({n:"#"+(c.index+1),question:c.question,meta:T(c.metrics.total)+" \xB7 "+u+"r \xB7 "+c.toolsCount+" tools",status:c.status==="ok"?"ok":c.status,errLabel:c.errCount?c.errCount+" err":""})}else Y(null)}function tn(o){let a=h("tt-detail-head");if(!a)return;if(!o){a.innerHTML="";return}a.innerHTML='<div class="tt-d-title">'+p(o.goal||o.unit_id)+'</div><div class="tt-metrics"><div class="metric"><div class="k">Unit</div><div class="v">'+p(o.unit_id)+'</div></div><div class="metric"><div class="k">Hops</div><div class="v">'+(o.hops||[]).length+'</div><div class="v sub">'+(o.req_ids||[]).length+' req_id</div></div><div class="metric"><div class="k">LLM</div><div class="v">'+(o.llm||[]).length+'r</div></div><div class="metric"><div class="k">Status</div><div class="v"><span class="tt-badge '+(o.status==="ok"?"ok":"err")+'">'+p(o.error_code||o.status)+"</span></div></div></div>";let c=h("tt-hop-count");c&&(c.textContent=String((o.hops||[]).length))}function en(o){let a=o.catalog||{},c=o.inject||{},u=[],m=a.has_mini_schema===!0||c.has_mini_schema===!0,g=a.has_scope_brief===!0||c.has_scope_brief===!0;return u.push('<span class="tt-turn-tag">'+(m?"MINI yes":"MINI no")+"</span>"),u.push('<span class="tt-turn-tag">'+(g?"BRIEF yes":"BRIEF no")+"</span>"),a.base_id&&u.push('<span class="tt-turn-tag">'+p(String(a.base_id))+"</span>"),a.client_floor&&u.push('<span class="tt-turn-tag">floor-'+p(String(a.client_floor))+"</span>"),u.length?'<div class="tt-chip-row">'+u.join("")+"</div>":""}function nn(o){let a=h("tt-detail-head");if(!a||!o){a&&(a.innerHTML="");return}let c=o.metrics,u=c.total||1;a.innerHTML='<div class="tt-d-title">'+p(o.question)+'</div><div class="tt-metrics"><div class="metric"><div class="k">Wall</div><div class="v">'+p(T(c.total))+'</div><div class="mm-bar"><i class="ai" style="width:'+(c.aiMs/u*100).toFixed(1)+'%"></i><i class="zeus" style="width:'+(c.zeusMs/u*100).toFixed(1)+'%"></i><i class="other" style="width:'+(c.other/u*100).toFixed(1)+'%"></i></div></div><div class="metric"><div class="k">AI / Zeus</div><div class="v">'+p(T(c.aiMs))+' <span class="sub">/ '+p(T(c.zeusMs))+'</span></div></div><div class="metric"><div class="k">Tokens</div><div class="v">'+p((k().fmtTokens||(g=>g?Number(g).toLocaleString():"?"))(c.tokens))+'</div><div class="v sub" title="Sum of usage.total_tokens across all billed LLM calls (llm + force_final), not a single round">'+(function(){let g=o.llmRounds&&o.llmRounds.length||0,f=o.trace.rounds||0,v=[];return(c.hasIn||c.tokensIn)&&v.push("in "+(k().fmtTokens?k().fmtTokens(c.tokensIn):c.tokensIn)),(c.hasOut||c.tokensOut)&&v.push("out "+(k().fmtTokens?k().fmtTokens(c.tokensOut):c.tokensOut)),c.tokensCached&&v.push("cached "+Number(c.tokensCached).toLocaleString()),g>0?(v.push(g+(g===1?" LLM call":" LLM calls")),f>0&&f!==g&&v.push(f+" rounds")):v.push((f||0)+" rounds"),v.join(" \xB7 ")})()+'</div></div><div class="metric"><div class="k">Turn ID</div><div class="v sub mono" data-copy="'+p(o.turn_id||"")+'" title="Click to copy">'+p(o.turn_id?H(o.turn_id,16):"\u2014")+"</div></div></div>"+en(o);let m=h("tt-hop-count");m&&(m.textContent=String(o.hops.length))}function oe(o){return o?!!(o.status!=="ok"||o.grade==="warn"||o.grade==="fail"||o.errCount>0||o.playbooks&&o.playbooks.length):!1}function rn(o){return`# Support pack
**Headline:** `+(o.headline||"(none)")+`
**Grade:** `+(o.grade||o.status)+`
**turn_id:** `+(o.turn_id||"")+`
**session_id:** `+(o.session_id||"")+`
**preferred_req_id:** `+(o.preferred_req_id||"")+`
**Playbooks:** `+(o.playbooks.map(a=>a.id).join(", ")||"none")+`
**Question:** `+(o.question||"")+`
`}function on(o){let a=h("tt-diagnosis");if(!a)return;if(!o||!oe(o)){a.hidden=!0,a.innerHTML="";return}a.hidden=!1,a.className="tt-diagnosis alert mx-3 mt-2 shrink-0 "+(o.grade==="fail"||o.status==="err"?"alert-error fail":"alert-warning warn");let c=o.grade||o.status;a.innerHTML='<div class="tt-diagnosis-body"><div class="eyebrow"><span class="tt-badge '+(c==="fail"||c==="err"?"err":"warn")+'">diagnosis '+p(c)+"</span><span>"+o.hops.length+" hops \xB7 "+(o.llmRounds.length||0)+" rounds</span></div><h3>"+p(o.headline||"Turn needs attention")+"</h3>"+(o.overview?'<p class="detail">'+p(o.overview)+"</p>":"")+(o.session_error?'<p class="detail">Session error: '+p(String(o.session_error).slice(0,240))+"</p>":"")+'<div class="tt-diagnosis-actions">'+(o.turn_id?'<span class="idchip" data-copy="'+p(o.turn_id)+'" title="Click to copy"><b>turn</b> '+p(H(o.turn_id,14))+"</span>":"")+(o.session_id?'<span class="idchip" data-copy="'+p(o.session_id)+'" title="Click to copy"><b>session</b> '+p(H(o.session_id,14))+"</span>":"")+(o.preferred_req_id?'<span class="idchip" data-copy="'+p(o.preferred_req_id)+'" title="Click to copy"><b>preferred</b> '+p(H(o.preferred_req_id,14))+"</span>":"")+'<button type="button" class="btn btn-xs btn-primary" data-action="open-pref">Open preferred hop</button><button type="button" class="btn btn-xs" data-action="copy-pack" title="Click to copy">Copy support pack</button></div></div>'}function sn(o){let a=h("tt-panel-timeline");if(!a||!o)return;let c=(k().waterfallHTML||(()=>""))(o.spans,o.metrics&&o.metrics.total,o.steps),u=k().timelineSpeedKpiHTML?k().timelineSpeedKpiHTML(o):"",m=(k().toolFrequencyChartHTML||(()=>""))(o.steps,o.api_version,e.getChartOrder());a.innerHTML='<div class="tt-waterfall-host"><h2 class="text-base font-semibold m-0 mb-2">Spans waterfall</h2>'+u+(c||'<div class="tt-empty-inline">No spans for this turn.</div>')+"</div>"+(m?'<details class="tt-fold"><summary>Tool-call frequency</summary>'+m+"</details>":"")}function se(o,a){let c=a||h("tt-tools-hops");if(!c||!o)return;if(!o.hops.length){c.innerHTML='<div class="tt-empty-inline">No hops recorded for this turn.</div>';return}i>=o.hops.length&&(i=0);let u=o.hops[i],m=o.hops.map((v,C)=>{let P=(Number(v.status)||0)>=400;return'<tr class="'+(C===i?"sel":"")+'" data-i="'+C+'"><td>'+(v.preferred?'<span class="inline-flex items-center gap-1">'+j("star")+'<span class="sr-only">preferred</span></span>':"")+'<button type="button" class="btn btn-xs btn-ghost font-mono" data-i="'+C+'"'+(v.req_id?' data-copy="'+p(v.req_id)+'" title="Click to copy"':"")+">"+p(H(v.req_id||"\u2014",12))+"</button></td><td><strong>"+p(v.verb)+'</strong></td><td><span class="'+_(P?"bad":"ok")+'">'+p(String(v.status))+'</span></td><td class="mono">'+p(T(v.ms))+'</td><td class="mono">'+p(v.bytes==null?"\u2014":typeof v.bytes=="number"?M(v.bytes):String(v.bytes))+"</td></tr>"}).join("");c.innerHTML='<div class="overflow-x-auto"><table class="table table-zebra table-xs tt-table"><thead><tr><th>req_id</th><th>Verb</th><th>Status</th><th>ms</th><th>Bytes</th></tr></thead><tbody>'+m+'</tbody></table></div><div class="tt-hop-actions flex gap-2 items-center my-2 text-sm"><strong>Hop detail</strong>'+(u.req_id?'<button type="button" class="btn btn-xs btn-ghost" data-copy="'+p(u.req_id)+'" title="Click to copy">Copy req_id</button>':"")+'<button type="button" class="btn btn-xs btn-ghost gap-1" data-action="open-req" data-req="'+p(u.req_id||"")+'">Open in Hub '+j("external")+'</button></div><div class="tt-split-io grid grid-cols-1 md:grid-cols-2 gap-2.5"><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="ai-lab">Request</span> <span class="badge badge-ghost badge-sm">'+p(u.verb)+'</span><button type="button" class="btn btn-xs btn-ghost ml-auto" data-copy-from="tt-hop-req" title="Click to copy">Copy</button></header><pre id="tt-hop-req"></pre></div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="zeus-lab">Response</span> <span class="'+_((Number(u.status)||0)>=400?"bad":"ok")+'">'+p(String(u.status))+'</span><button type="button" class="btn btn-xs btn-ghost ml-auto" data-copy-from="tt-hop-res" title="Click to copy">Copy</button></header><pre id="tt-hop-res"></pre></div></div>';let g=h("tt-hop-req"),f=h("tt-hop-res");g&&(g.textContent=R(u.req)),f&&(f.textContent=R(u.res)),c.querySelectorAll("tbody tr").forEach(v=>{v.onclick=C=>{C.target.closest("[data-copy]")||(i=+v.dataset.i,se(o,c))}})}function ie(o,a){let c=a||h("tt-tools-llm");if(!c||!o)return;let u=k().extractDecomposition?k().extractDecomposition(Object.assign({},o.raw||{},{trace:o.trace,hops:o.hops,llmRounds:o.llmRounds})):{decomposition:null,query_decomposition:null},m=k().decompositionCardHTML?k().decompositionCardHTML(u,p):"";function g(){let v=h("tt-decomp-json");v&&(v.textContent=R({query_decomposition:u.query_decomposition,decomposition:u.decomposition,summary:u.summary,confidence:u.confidence,policy_action:u.policy_action}))}if(!o.llmRounds.length){c.innerHTML=m+'<div class="tt-empty-inline">No LLM rounds recorded for this turn.</div>',g();return}l>=o.llmRounds.length&&(l=0);let f=o.llmRounds[l];c.innerHTML=m+'<div class="round-pills">'+o.llmRounds.map((v,C)=>'<button type="button" class="btn btn-xs round-pill '+(C===l?"btn-active on":"")+'" data-i="'+C+'">'+p(String(v.label||"Round "+v.round))+" \xB7 "+p(v.finish||"\u2014")+"</button>").join("")+'</div><div class="tt-tokline">tokens in <strong>'+p(String(f.tok_in!=null?f.tok_in:"?"))+"</strong> \xB7 out <strong>"+p(String(f.tok_out!=null?f.tok_out:"?"))+"</strong>"+(f.tok_total!=null?" \xB7 total <strong>"+p(String(f.tok_total))+"</strong>":"")+'</div><div class="tt-split-io grid grid-cols-1 md:grid-cols-2 gap-2.5"><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold">AI request <button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-llm-copy-req" data-copy-from="tt-llm-req" title="Click to copy">Copy</button></header><pre id="tt-llm-req"></pre></div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold">AI response <button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-llm-copy-res" data-copy-from="tt-llm-res" title="Click to copy">Copy</button></header><pre id="tt-llm-res"></pre></div></div>',h("tt-llm-req").textContent=R(f.req),h("tt-llm-res").textContent=R(f.res),c.querySelectorAll(".round-pill").forEach(v=>{v.onclick=()=>{l=+v.dataset.i,ie(o,c)}}),g()}function an(o,a){let c=a||h("tt-prompt-inject");if(!c)return;if(!o){c.innerHTML='<div class="tt-empty-inline">No inject data.</div>';return}let u=o.inject||{},m=o.catalog||{},g=o.semanticCache||[],f={inject:u,catalog:{has_mini_schema:m.has_mini_schema,has_scope_brief:m.has_scope_brief,base_id:m.base_id,client_floor:m.client_floor,brief_sha12:m.brief_sha12||u.brief_sha12,mini_sha12:m.mini_sha12||u.mini_sha12},semantic_cache:g,semantic_memory:u.semantic_memory||null},v=g.length?g.join(" \xB7 "):u.has_scope_brief||u.has_mini_schema?"Catalog inject present (SCOPE BRIEF / MINI-SCHEMA).":"No catalog inject flags on this turn.";c.innerHTML='<div class="tt-inject-note">'+p(v)+'</div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="ai-lab">inject / catalog</span><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-inj-copy-req" data-copy-from="tt-inj-req" title="Click to copy">Copy</button></header><pre id="tt-inj-req"></pre></div>';let C=h("tt-inj-req");C&&(C.textContent=R(f))}function ln(o,a){let c=a||h("tt-prompt-inject");if(!c)return;if(!o){c.innerHTML='<div class="tt-empty-inline">No unit selected.</div>';return}let u=o.stuffed_goal||o.goal||"",m=o.synth?"Synth unit: no shared session. Goal is stuffed with prior artifacts only.":o.has_inject?"Isolated agent unit. Catalog inject present (SCOPE BRIEF / MINI-SCHEMA).":o.kind==="zeus_direct"?"zeus_direct: no catalog inject (Mode 2 verb).":"Isolated agent unit. Fail-closed without ## SCOPE BRIEF (130012).";c.innerHTML='<div class="tt-inject-note">'+p(m)+'</div><div class="tt-split-io grid grid-cols-1 md:grid-cols-2 gap-2.5"><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="ai-lab">Unit goal + inject</span><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-inj-copy-req" data-copy-from="tt-inj-req" title="Click to copy">Copy</button></header><pre id="tt-inj-req"></pre></div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="zeus-lab">Artifact / answer</span>'+(o.error_code?'<span class="'+_("err")+'">'+p(o.error_code)+"</span>":"")+'<button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-inj-copy-res" data-copy-from="tt-inj-res" title="Click to copy">Copy</button></header><pre id="tt-inj-res"></pre></div></div>';let g=h("tt-inj-req"),f=h("tt-inj-res");g&&(g.textContent=u||"(empty goal)"),f&&(f.textContent=o.answer||"(no artifact)")}function ae(o){let a=(k().gradeNorm||(c=>c))(o);return a==="fail"?"fail":a==="warn"?"warn":a==="pass"?"pass":a==="skip"?"skip":"na"}function cn(o){let a=ae(o.grade),u='<article class="card bg-base-100 border '+(a==="fail"?"border-error/40":a==="warn"?"border-warning/40":a==="pass"?"border-success/40":"border-base-300")+" shadow-sm det-diag-card "+a+'"><div class="card-body p-4"><h3 class="text-xs font-semibold uppercase tracking-wide text-base-content/50">'+p(o.title)+"</h3>";return o.items&&o.items.length&&(u+='<ul class="text-sm list-disc ml-4 mt-1 space-y-1">'+o.items.map(m=>"<li>"+p(m)+"</li>").join("")+"</ul>"),o.minis&&o.minis.length&&(u+='<div class="kpi-mini">'+o.minis.map(m=>'<div class="km"><div class="l">'+p(String(m.l))+'</div><div class="v">'+p(String(m.v))+"</div></div>").join("")+"</div>"),o.muted&&(u+='<p class="text-xs text-base-content/50 font-mono mt-2">'+p(o.muted)+"</p>"),o.jump&&(u+='<button type="button" class="btn btn-xs btn-ghost w-fit" data-action="tt-tab" data-tab="'+p(o.jump)+'">open '+p(o.jump)+"</button>"),u+"</div></article>"}function dn(o){let a=k().detectiveEnvelopeRows?k().detectiveEnvelopeRows(o):[],c=k().detectiveLayerA?k().detectiveLayerA(o):{},u=a.length?'<dl class="det-env grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-2 text-sm mt-2">'+a.map(f=>'<dt class="text-base-content/50">'+p(f.key)+'</dt><dd class="font-mono text-xs m-0">'+L(f.key,f.value)+"</dd>").join("")+"</dl>":'<div class="hint">Detective data not attached on this turn.</div>',m=c.intent?'<div class="mt-3"><span class="badge badge-info badge-outline gap-1"><span class="text-[10px] font-bold uppercase">intent</span> '+p(String(c.intent))+"</span></div>":"",g=[c.via?"via="+c.via:"",c.confidence?"conf="+c.confidence:"",c.policy_action?"policy="+c.policy_action:""].filter(Boolean).join(" \xB7 ");return'<div class="card bg-base-100 shadow-sm border border-base-300 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Envelope <span class="font-normal text-sm text-base-content/60">who / scope / mode / duration</span></h2>'+u+m+(g?'<p class="text-xs text-base-content/50 mt-2">layer_a \xB7 '+p(g)+"</p>":"")+'<p class="text-sm text-base-content/70 mt-3">Cost / result KPIs live on <button type="button" class="btn btn-xs" data-action="tt-tab" data-tab="tools">Tools</button>. Envelope is facts only. Token IN is omitted when usage is missing (never painted as 0).</p></div></div>'}function pn(o){let a=k().detectiveDiagnosisModel?k().detectiveDiagnosisModel(o):{cards:[],grades:[],playbooks:[],headline:o.headline||""},c=o.checkSummary||(k().detectiveCheckSummary?k().detectiveCheckSummary(o.promptChecks||[]):{});function u(f){let v=ae(f);return"badge badge-sm "+(v==="fail"?"badge-error":v==="warn"?"badge-warning":v==="pass"?"badge-success":"badge-ghost")}let m='<div class="flex flex-wrap items-start gap-2 mb-4"><h2 class="text-lg font-semibold flex-1 min-w-[12rem]">'+p(a.headline);a.request_kind_label&&(m+=' <span class="'+u(a.isDirect?"na":"pass")+'">'+p(a.request_kind_label)+"</span>"),m+='</h2><div class="flex flex-wrap gap-1">',(a.grades||[]).forEach(f=>{f.value&&(m+='<span class="'+u(f.cls||f.value)+'">'+p(f.id)+":"+p(f.value)+"</span>")}),c&&c.label&&(m+='<span class="'+(c.tone==="ok"?"badge badge-sm badge-success":"badge badge-sm badge-error")+'">'+p(c.label)+"</span>"),m+="</div></div>",a.slowTop&&a.slowTop.length&&(m+='<div class="alert mb-4 bg-warning/10 border border-warning/40"><div><h3 class="font-semibold text-sm">Why was this slow?</h3><ul class="text-sm mt-1 list-disc ml-4">',a.slowTop.forEach(f=>{m+="<li><b>"+p(f.label)+"</b> \xB7 "+p(String(f.ms))+"ms"+(f.share_pct?" ("+f.share_pct+"%)":"")+"</li>"}),m+="</ul></div></div>"),m+='<div class="grid grid-cols-1 md:grid-cols-2 gap-3 diag-grid">'+(a.cards||[]).map(cn).join("")+"</div>";let g=a.playbooks||[];return g.length?(m+='<div class="alert alert-info mt-4"><div><p class="font-semibold">Insight playbooks <span class="font-normal opacity-80">\xB7 auto-matched</span></p><p class="text-sm">Each card is a known failure pattern. Follow the actions, then return to Overview.</p></div></div>',g.forEach(f=>{let v=p(f.severity||"info");m+='<article class="card bg-base-100 border-l-4 '+(v==="fail"?"border-l-error":v==="warn"?"border-l-warning":"border-l-info")+" border border-base-300 mt-3 pb "+v+'"><div class="card-body p-4"><h3 class="font-semibold">'+p(f.title)+'</h3><p class="text-sm text-base-content/70">'+p(f.summary||"")+"</p>",f.actions&&f.actions.length&&(m+='<ul class="text-sm list-disc ml-4 mt-1">'+f.actions.map(P=>"<li>"+p(P)+"</li>").join("")+"</ul>"),m+="</div></article>"})):m+='<div class="playbook empty-ok flex items-center gap-1 text-success mt-4">'+j("check")+" No playbooks triggered</div>",m+='<div class="flex flex-wrap gap-2 mt-4"><button type="button" class="btn btn-sm" data-action="copy-pack">Copy markdown pack</button>'+(o.session_id?'<a class="btn btn-sm btn-ghost gap-1" href="'+p(ht(o.session_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-session">session '+j("external")+"</a>":"")+(o.preferred_req_id?'<a class="btn btn-sm btn-ghost gap-1" href="'+p(gt(o.preferred_req_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-req">preferred req '+j("external")+"</a>":"")+"</div>",m}function un(o){let a=k().detectivePromptView?k().detectivePromptView(o):{checks:o.promptChecks||[],tiles:o.promptChecks||[],verdict:o.prompt_grade||"skip",summary:"",rounds:0,checkSummary:o.checkSummary},c=a.checkSummary||(k().detectiveCheckSummary?k().detectiveCheckSummary(a.checks||[]):{}),u=a.verdict||"skip",g='<div class="pcl"><div class="alert '+(u==="fail"?"alert-error":u==="warn"?"alert-warning":u==="pass"?"alert-success":"alert-info")+" mb-4 verdict "+p(u)+'"><span class="'+_(u)+' vbadge">'+p(u)+'</span><div><p class="font-medium vsum">'+p(a.summary||"")+'</p><p class="text-xs font-mono opacity-70 vmeta">rounds checked: '+p(String(a.rounds||0))+(c&&c.label?" \xB7 "+p(c.label):"")+" \xB7 fix fails first, then debug tools</p></div></div>";return g+='<p class="text-xs text-base-content/50 mb-3">SCOPE BRIEF / MINI-SCHEMA are status tiles. Live sent-vs-catalog compare is Hub Detective.</p>',g+='<div class="tiles">',(a.tiles||a.checks||[]).forEach(f=>{let v=f.status||(f.ok?"pass":"fail");g+='<div class="card bg-base-100 border '+(v==="fail"?"border-error/40":v==="warn"?"border-warning/40":v==="pass"?"border-success/40":"border-base-300")+" shadow-sm tile "+p(v)+'" data-check-id="'+p(f.id||"")+'"><div class="card-body p-3 gap-1"><div class="flex justify-between items-center top"><span class="text-[10px] uppercase font-mono text-base-content/50 grp">'+p(f.group||"")+'</span><span class="'+_(v)+" st "+p(v)+'">'+p(v)+'</span></div><p class="font-semibold text-sm lab">'+p(f.lab)+"</p>",f.detail&&(g+='<p class="text-xs font-mono text-base-content/60 det">'+p(f.detail)+"</p>"),f.fix_hint&&(g+='<p class="text-xs text-primary fix">Fix: '+p(f.fix_hint)+"</p>"),g+="</div></div>"}),g+="</div></div>",g}function fn(o){let a=k().detectiveSessionModel?k().detectiveSessionModel(o):{kv:[],hops:[]},c='<div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Session context <span class="font-normal text-sm text-base-content/60">zeus_client stamps</span></h2>'+(a.kv.length?'<dl class="det-env grid grid-cols-[8.5rem_1fr] gap-x-4 gap-y-2 text-sm">'+a.kv.map(u=>'<dt class="text-base-content/50">'+p(u.key)+'</dt><dd class="font-mono text-xs m-0">'+L(u.key,u.value)+"</dd>").join("")+"</dl>":'<div class="hint">No session conversation attached to this turn.</div>')+"</div></div>";return a.hops.length&&(c+='<div class="card bg-base-100 shadow-sm border border-base-300 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Related hops <span class="font-normal text-sm text-base-content/60">same chat_id</span></h2><div class="session-strip flex flex-wrap gap-2">'+a.hops.map(u=>'<button type="button" class="btn btn-xs font-mono pill'+(u.preferred?" btn-primary cur":"")+'" data-copy="'+p(u.req_id)+'">'+p(u.verb||"hop")+" \xB7 "+p(H(u.req_id,10))+"</button>").join("")+"</div></div></div>"),c+='<div class="flex flex-wrap gap-2 mt-3">'+(o.session_id?'<a class="tt-link" href="'+p(ht(o.session_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-session">session</a>':'<span class="tt-muted">session</span>')+" \xB7 "+(o.preferred_req_id?'<a class="tt-link" href="'+p(gt(o.preferred_req_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-req">preferred req</a>':'<span class="tt-muted">preferred req</span>')+"</div>",c}function Lt(o,a){let c=h(o);c&&(c.innerHTML=a||"")}function bn(o,a){if(!o||!o.length)return'<div class="hint">No cost / result KPIs on this turn.</div>';let c=a?'<p class="text-xs uppercase tracking-wide text-base-content/50 mb-2">'+p(a)+"</p>":"";return c+='<div class="grid grid-cols-2 md:grid-cols-3 gap-2 env-kpi">',o.forEach(u=>{c+='<div class="stat bg-base-200 rounded-box border border-base-300 p-3 kpi-tile min-w-0"><div class="stat-title kpi-lbl">'+p(u.label)+'</div><div class="stat-value text-xl kpi-val">'+p(u.value)+"</div></div>"}),c+="</div>",c}function mn(o){let a=k().detectiveShellSpec?k().detectiveShellSpec(o,s):{tabs:[]},c=h("tt-hop-count"),u=h("tt-prompt-count"),m=h("tt-diag-count");(a.tabs||[]).forEach(g=>{g.id==="tools"&&c&&(c.textContent=g.pill||String(o&&o.hops&&o.hops.length||0),c.classList.toggle("badge-error",g.pillKind==="err")),g.id==="prompt"&&u&&(u.hidden=!g.pill,u.textContent=g.pill||"",u.classList.toggle("badge-error",g.pillKind==="err"),u.classList.toggle("badge-success",g.pillKind==="ok")),g.id==="diagnosis"&&m&&(m.hidden=!g.pill,m.textContent=g.pill||"",m.classList.toggle("badge-warning",g.pillKind==="warn"),m.classList.toggle("badge-error",g.pillKind==="err"))})}function hn(o){Lt("tt-panel-overview",o?dn(o):"")}function gn(o){Lt("tt-panel-diagnosis",o?pn(o):"")}function yn(o,a){let c=h("tt-panel-prompt");if(!c)return;if(!o&&!a){c.innerHTML="";return}let u=o?un(o):"";u+='<div id="tt-prompt-inject" class="mt-3"></div>',c.innerHTML=u||'<div class="tt-empty-inline">No prompt checklist on this turn.</div>',x?ln(a,h("tt-prompt-inject")):o&&an(o,h("tt-prompt-inject"))}function vn(o){let a=h("tt-panel-tools");if(!a)return;if(!o){a.innerHTML="";return}let c=k().detectiveCostResultKpis?k().detectiveCostResultKpis(o):k().detectiveTokenTiles?k().detectiveTokenTiles(o):[];a.innerHTML='<div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Cost / result <span class="font-normal text-sm text-base-content/60">tokens \xB7 HTTP \xB7 records</span></h2>'+bn(c,"Provider tokens and result")+'</div></div><div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><h2 class="card-title text-base">AI request <span class="font-normal text-sm text-base-content/60">LLM round \xB7 req\u2225res</span></h2><div id="tt-tools-llm"></div></div></div><div class="card bg-base-100 shadow-sm border border-base-300 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Tool calls <span class="font-normal text-sm text-base-content/60">this turn \xB7 table then req\u2225res</span></h2><div id="tt-tools-hops"></div></div></div>',ie(o,h("tt-tools-llm")),se(o,h("tt-tools-hops"))}function _n(o){Lt("tt-panel-session",o?fn(o):"")}function le(o,a){mn(o),hn(o),gn(o),yn(o,a),sn(o),vn(o),_n(o),xn(o)}function xn(o){let a=h("tt-panel-raw");if(!a||!o)return;let c={question:o.question,answer:o.answer,target:o.target,mode:o.mode,api_version:o.api_version,provider:o.provider,model:o.model,session_id:o.session_id,session_round:o.session_round,contract_status:o.contract_status,preferred_req_id:o.preferred_req_id,turn_id:o.turn_id,gather:o.gather,status:o.status,detective:o.detective,hops:o.hops,spans:o.spans,trace:o.trace};a.innerHTML='<div class="card bg-base-100 shadow-sm border border-base-300 io-card raw-card"><div class="card-body p-4"><div class="flex items-center gap-2"><h2 class="card-title text-base">Raw bundle</h2><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-raw-copy" data-copy-from="tt-raw-json" title="Click to copy">Copy JSON</button></div><pre id="tt-raw-json" hidden></pre><div class="trace-dump-viewer mt-2" id="tt-raw-host"></div></div></div>';let u=h("tt-raw-json");u&&(u.textContent=R(c));let m=h("tt-raw-host");if(k().mountJsnviewViewer)k().mountJsnviewViewer(m,c,!1);else{let g=document.createElement("pre");g.textContent=R(c),m.appendChild(g)}}function Mt(){let o=(n||[]).slice(-Q);return{copied_at:new Date().toISOString(),chat_id:e.getChatId?e.getChatId():null,shown_turns:o.length,max_shown_turns:Q,traces:o}}function V(){let o=h("tt-empty"),a=h("tt-body");if(it(x),x){let m=D(),g=$(m);if(re(g.length),!m){o&&(o.hidden=!1,o.textContent="No job run yet."),a&&(a.hidden=!0),Et(null);return}o&&(o.hidden=!0),a&&(a.hidden=!1),y>=g.length&&(y=0);let f=I(g),v=f?{hops:f.hops||[],llmRounds:f.llm||[],question:f.goal,status:f.status,grade:f.status==="err"?"fail":"pass",playbooks:[],errCount:f.status==="err"?1:0,preferred_req_id:f.req_ids&&f.req_ids[0]||"",session_id:"",turn_id:f.unit_id,raw:m,trace:m&&m.trace||{},detective:null,headline:"",overview:"",promptChecks:[],checkSummary:{label:"",tone:""},gather:[]}:null;Ye(g),Qe(m,g),tn(f);let C=h("tt-diagnosis");C&&(C.hidden=!(f&&f.status==="err"),f&&f.status==="err"?(C.className="tt-diagnosis alert alert-error fail mx-3 mt-2 shrink-0",C.innerHTML='<div class="tt-diagnosis-body"><div class="eyebrow"><span class="tt-badge err">'+p(f.error_code||f.status)+"</span></div><h3>"+p(f.unit_id+" failed")+'</h3><p class="detail">'+p((f.answer||"").slice(0,280))+"</p></div>"):C.innerHTML=""),["hops","llm","inject","detective"].includes(s)&&(s="overview"),f&&f.status==="err"&&d!==f.unit_id&&(d=f.unit_id,s="diagnosis"),yt(s),le(v,f);return}let c=mt();if(re(c.length),!c.length){o&&(o.hidden=!1),a&&(a.hidden=!0),Et(null);return}o&&(o.hidden=!0),a&&(a.hidden=!1),(!r||!c.some(m=>m.key===r))&&(r=c[0].key,i=0,l=0,d=null);let u=c.find(m=>m.key===r)||c[0];if(u&&i===0&&u.hops.length){let m=u.hops.findIndex(g=>g.preferred);m>0&&!u._hopTouched&&(i=m)}Xe(c),Et(u),nn(u),on(u),["hops","llm","inject","detective"].includes(s)&&(s="overview"),u&&oe(u)&&d!==u.key&&(d=u.key,s="diagnosis"),yt(s),le(u,null)}function kn(o){let a=o.target;if(a&&a.nodeType!==1&&(a=a.parentElement),a&&typeof a.closest=="function")return a;if(typeof o.composedPath=="function"){let c=o.composedPath().find(u=>u&&u.nodeType===1&&typeof u.closest=="function");if(c)return c}return null}function wn(o){let a=kn(o);if(!a)return;let c=a.closest("[data-copy]");if(c&&c.getAttribute("data-copy")!=null){o.preventDefault(),O(c.getAttribute("data-copy"),c);return}let u=a.closest("[data-copy-from]");if(u){o.preventDefault();let v=h(u.getAttribute("data-copy-from")||"");O(v?v.textContent:"",u);return}let m=a.closest("[data-action]");if(!m)return;let g=m.dataset.action,f=Xt();if(g==="copy-all"){o.preventDefault();let v=Mt();if(!v.traces.length){N("No trace to copy yet","warning");return}O(R(v),m);return}if(g==="hub-missing"){N("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning");return}if(g==="copy-pack"&&f){O(rn(f),m);return}if(g==="tt-tab"){s=m.dataset.tab||"overview",r&&(d=r),yt(s);return}if(g==="open-pref"&&f){let v=f.hops.findIndex(C=>C.preferred);i=v>=0?v:0,s="tools",f&&(f._hopTouched=!0),V(),N("Jumped to preferred hop");return}if(g==="open-req"){let v=m.dataset.req||f&&f.preferred_req_id,C=gt(v);!C&&v?(O(v),N("Hub URL unknown \u2014 copied req_id","warning")):ne(C);return}g==="hub-session"&&!ee()&&(o.preventDefault(),N("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning")),g==="hub-req"&&!ee()&&(o.preventDefault(),N("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning"))}function at(){if(b)return;b=!0,t.addEventListener("click",wn);let o=h("tt-turn-dropdown");o&&o.addEventListener("toggle",()=>{let a=h("tt-turn-summary");a&&a.setAttribute("aria-expanded",o.open?"true":"false")}),t.querySelectorAll(".tt-tab").forEach(a=>{a.addEventListener("click",()=>{s=a.dataset.tab||"overview",r&&(d=r),yt(s)})}),h("tt-export")?.addEventListener("click",()=>{let a=Mt();if(!a.traces.length){N("No trace to export yet","warning");return}let c=new Blob([R(a)],{type:"application/json"}),u=document.createElement("a");u.href=URL.createObjectURL(c);let m=a.chat_id||"local";u.download="zeus-traces-"+m+"-"+Date.now()+".json",u.click(),URL.revokeObjectURL(u.href),N("exported")}),h("tt-detective")?.addEventListener("click",()=>{let a=Xt();if(!a){N("No turn selected","warning");return}let c=a.preferred_req_id,u=c?gt(c):ht(a.session_id);if(!u){let m=c||a.session_id||"";m&&O(m),N("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning");return}ne(u)})}function Sn(o){n=(Array.isArray(o)?o:[]).map(qt).filter(a=>a&&a.trace),n.length>Q&&(n=n.slice(-Q)),x=n.some(a=>k().isMultiAgentTrace&&k().isMultiAgentTrace(a.trace,a)),r=null,i=0,l=0,d=null,at(),V()}function jn(o){let a=qt(o);if(!a||!a.trace)return;n.includes(a)||n.push(a),n.length>Q&&(n=n.slice(-Q));let c=Gt(a,n.length-1);k().isMultiAgentTrace&&k().isMultiAgentTrace(a.trace,a)&&(x=!0),r=c.key,i=0,l=0,d=null,at(),V()}function Tn(){n=[],r=null,d=null,x=!1,y=0,at(),V()}function Cn(o){e=Object.assign({},e,o||{}),at(),V()}return{init:Cn,setEntries:Sn,pushEntry:jn,clear:Tn,getBundle:Mt,setJobMode:bt,TRACE_MAX_CARDS:Q}}function Ze(t,e={}){let n=w=>t.querySelector(`#${w}`),r=G(e.toolOrder)??{v1:[],v2:[]},s=null,i=e.mount==="docked",l=Ve(t);l.init({getClientVersion:()=>lt(),getHubBase:()=>be({config:e}),getChatId:()=>s,getChartOrder:()=>r,showToast:y});function d(){let w=n("debug-panel"),T=n("debug-toggle");w&&(w.classList.remove("is-hidden"),w.setAttribute("aria-hidden","false"),T?.setAttribute("aria-expanded","true"))}function b(){if(i)return;let w=n("debug-panel"),T=n("debug-toggle");w&&(w.classList.add("is-hidden"),w.setAttribute("aria-hidden","true"),T?.setAttribute("aria-expanded","false"))}function x(){let w=n("debug-panel");w&&(w.classList.contains("is-hidden")?d():b())}function y(w,T){let M=n("toast"),H=n("toast-msg");!M||!H||(H.textContent=w,M.classList.toggle("tt-toast-warn",T==="warning"||T==="error"),M.classList.remove("hidden"),setTimeout(()=>M.classList.add("hidden"),2200))}function h(w){let T=G(w);T&&(r=T)}async function p(){let w=G(e.toolOrder);if(w){r=w;return}if(!e.zeusApiUrl)return;let T=Number(e.toolOrderTimeoutMs),M=Number.isFinite(T)&&T>0?T:3e3,H=typeof AbortController<"u"?new AbortController:null,R=H?setTimeout(()=>{try{H.abort()}catch{}},M):null;try{let U=await me("/api/tool-order",e,H?{signal:H.signal}:{}),N=G(await U.json());N&&(r=N)}catch{}finally{R!=null&&clearTimeout(R)}}function S(w,T){if(!T)return;let M={...T};w&&!M.question&&(M.question=w),!(!M.trace&&!M.debug)&&(h(M.tool_order),s=M.chat_id||s,l.pushEntry(M),i||d())}function j(w){l.setEntries(w)}function _(){l.clear()}function q(){return l.getBundle()}n("debug-toggle")?.addEventListener("click",x),n("debug-close")?.addEventListener("click",b);let A=n("debug-panel-version");if(A){let w=lt();A.textContent=w.startsWith("v")?w:`v${w}`,A.setAttribute("title",`zeus_client_chat_trace ${w}`)}i&&d();let L=p();return{appendTraceCard:S,openDebugPanel:d,closeDebugPanel:b,setEntries:j,clear:_,exportBundle:q,setJobMode:w=>l.setJobMode(w),setToolOrder:h,readyToolOrder:L,version:lt()}}var We=`<button
  type="button"
  id="debug-toggle"
  class="debug-toggle-btn"
  title="Toggle Zeus Tracer"
  aria-expanded="false"
  aria-label="Toggle Zeus Tracer"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
    <rect width="64" height="64" rx="10" ry="10" fill="#1f2937" />
    <path d="M36 6 L14 36 H28 L24 58 L50 26 H34 Z" fill="#facc15" stroke="#b45309" stroke-width="1.5" stroke-linejoin="round" />
  </svg>
</button>

<aside id="debug-panel" class="debug-panel tt-panel card bg-base-100 border border-base-300 shadow-sm is-hidden" aria-hidden="true" role="dialog" aria-labelledby="debug-panel-title">
  <div class="tt-panel-inner min-h-0 flex flex-col overflow-hidden flex-1" id="tt-panel">
    <header class="tt-header shrink-0 px-3 py-2 bg-base-100 border-b border-base-300 box-border">
      <div class="tt-header-row">
        <h2 id="debug-panel-title" class="tt-title text-sm font-semibold m-0 shrink-0">Turn traces</h2>
        <span class="badge badge-ghost badge-sm" id="tt-turn-count" hidden>0 turns</span>
        <div class="tt-hdr-actions" hidden>
          <button type="button" class="btn btn-xs btn-ghost" id="tt-export" title="Download journal JSON">Export</button>
          <button type="button" class="btn btn-xs btn-ghost" id="tt-copy-all" data-action="copy-all" title="Copy full trace bundle">Copy all</button>
          <button type="button" class="btn btn-xs btn-primary gap-1" id="tt-detective" title="Open Hub Detective">
            <span>Detective</span>
            <span class="inline-block w-3.5 h-3.5" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </span>
          </button>
        </div>
        <button type="button" class="btn btn-xs btn-ghost tt-close" id="debug-close" aria-label="Close">
          <span class="inline-block w-3.5 h-3.5" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      </div>
    </header>
    <div class="tt-session" id="tt-session" hidden></div>
    <div class="tt-body flex-1 min-h-0 flex flex-col overflow-hidden" id="tt-body" hidden>
      <div class="tt-detail flex flex-col min-w-0 min-h-0 overflow-hidden flex-1">
        <div class="tt-detail-head px-3 pt-2.5 pb-1.5 border-b border-base-300" id="tt-detail-head"></div>
        <div class="tt-diagnosis alert mx-3 mt-2 shrink-0" id="tt-diagnosis" hidden></div>
        <div class="tt-turn-picker px-3 pt-2 relative z-20 shrink-0">
          <p class="text-[10px] uppercase tracking-wide text-base-content/50 font-semibold mb-1" id="tt-turn-picker-label">Turn</p>
          <details class="dropdown w-full pb-1" id="tt-turn-dropdown">
            <summary id="tt-turn-summary" class="tt-turn-trigger" aria-labelledby="tt-turn-picker-label" aria-haspopup="listbox" aria-expanded="false">
              <span class="dot" id="tt-pick-dot" aria-hidden="true"></span>
              <span class="n" id="tt-pick-n"></span>
              <span class="q" id="tt-pick-q"></span>
              <span class="meta" id="tt-pick-meta"></span>
              <span class="badge badge-warning badge-xs shrink-0" id="tt-pick-err" hidden></span>
              <span class="tt-turn-chevron inline-block w-4 h-4 shrink-0 text-base-content/50" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>
            <div id="tt-turns" class="dropdown-content bg-base-100 rounded-xl z-[50] w-full p-0 shadow-xl border border-base-300 mt-1 max-h-72 overflow-y-auto tt-turns" role="listbox" aria-label="Turns"></div>
          </details>
        </div>
        <div class="tabs tabs-boxed tt-tabs bg-base-200 px-2 py-1 w-full rounded-none" role="tablist" aria-label="Turn detail">
          <button type="button" class="tab tt-tab tab-active on" data-tab="overview" data-turn data-job role="tab" aria-selected="true" aria-controls="tt-panel-overview">Overview</button>
          <button type="button" class="tab tt-tab" data-tab="diagnosis" data-turn data-job role="tab" aria-selected="false" aria-controls="tt-panel-diagnosis">Diagnosis <span class="badge badge-xs ml-1" id="tt-diag-count" hidden></span></button>
          <button type="button" class="tab tt-tab" data-tab="prompt" data-turn data-job role="tab" aria-selected="false" aria-controls="tt-panel-prompt">Prompt <span class="badge badge-xs ml-1" id="tt-prompt-count" hidden></span></button>
          <button type="button" class="tab tt-tab" data-tab="timeline" data-turn data-job role="tab" aria-selected="false" aria-controls="tt-panel-timeline">Timeline</button>
          <button type="button" class="tab tt-tab" data-tab="tools" data-turn data-job role="tab" aria-selected="false" aria-controls="tt-panel-tools">Tools <span class="badge badge-xs ml-1" id="tt-hop-count">0</span></button>
          <button type="button" class="tab tt-tab" data-tab="session" data-turn data-job role="tab" aria-selected="false" aria-controls="tt-panel-session">Session</button>
          <button type="button" class="tab tt-tab" data-tab="raw" data-turn data-job role="tab" aria-selected="false" aria-controls="tt-panel-raw">Raw</button>
        </div>
        <div class="tt-tab-panels flex-1 min-h-0 overflow-auto p-3">
          <div class="tt-tab-panel on" id="tt-panel-overview" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-diagnosis" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-prompt" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-timeline" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-tools" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-session" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-raw" role="tabpanel"></div>
        </div>
      </div>
    </div>
    <div id="tt-empty" class="tt-empty flex flex-1 items-center justify-center text-sm text-base-content/60 p-4">No turn run yet.</div>
    <footer id="debug-panel-footer" class="debug-panel-footer" aria-label="Widget version">
      <span id="debug-panel-version" class="debug-panel-version">v\u2014</span>
    </footer>
    <div id="toast" class="tt-toast hidden" role="status" aria-live="polite">
      <span id="toast-msg"></span>
    </div>
  </div>
</aside>
`;var $e=`/* Zeus Tracer \u2014 overlay/docked chrome + inspector extras (DaisyUI in shadow). */

:host {
  all: initial;
  display: block;
}

.zeus-trace-root {
  display: block;
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: oklch(var(--bc));
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}

.zeus-trace-root *,
.zeus-trace-root *::before,
.zeus-trace-root *::after {
  box-sizing: border-box;
}

.zeus-trace-root button,
.zeus-trace-root input,
.zeus-trace-root textarea {
  font-family: inherit;
}

.debug-toggle-btn {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  line-height: 0;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.debug-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
}
.debug-toggle-btn:focus-visible {
  outline: 2px solid #1f2937;
  outline-color: oklch(var(--p));
  outline-offset: 3px;
}

.debug-panel {
  position: fixed;
  left: 1rem;
  bottom: 4.5rem;
  width: min(720px, 94vw);
  height: min(70vh, 720px);
  z-index: 40;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background: oklch(var(--b1));
  color: oklch(var(--bc));
  border: 1px solid oklch(var(--b3));
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
}
.debug-panel.is-hidden {
  display: none !important;
}

.tt-panel-inner {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1 1 auto;
  overflow: hidden;
  height: 100%;
  position: relative;
}

.debug-panel-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.3rem 0.75rem 0.45rem;
  border-top: 1px solid oklch(var(--b3));
  background: oklch(var(--b2));
}
.debug-panel-version {
  font: 10px/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: oklch(var(--bc) / 0.5);
  letter-spacing: 0.02em;
  user-select: text;
  background: oklch(var(--b3));
  border-radius: 0.25rem;
  padding: 0.15rem 0.4rem;
}

.tt-toast {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 70;
  background: oklch(var(--b2));
  color: oklch(var(--bc));
  border: 1px solid oklch(var(--b3));
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-size: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  max-width: calc(100% - 16px);
}
.tt-toast.hidden { display: none !important; }
.tt-toast-warn { border-color: oklch(var(--wa) / 0.45); color: oklch(var(--wa)); }

.tt-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tt-close {
  width: 26px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
}

.tt-header .btn,
.tt-hdr-actions .btn {
  font-size: 11px;
  font-weight: 600;
  height: 24px;
  min-height: 24px;
  padding: 0 8px;
}

.zeus-trace-root[data-mount="docked"] {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}
.zeus-trace-root[data-mount="docked"] .debug-toggle-btn,
.zeus-trace-root[data-mount="docked"] .tt-close {
  display: none !important;
}
.zeus-trace-root[data-mount="docked"] .debug-panel {
  position: absolute;
  inset: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-height: none;
  border-radius: 0;
  box-shadow: none;
}

/* \u2500\u2500 Hub Detective waterfall (chart ink, not chrome) \u2500\u2500 */
.tt-waterfall-host {
  display: block;
  width: 100%;
  overflow-x: auto;
}
.trace-waterfall {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: 2px 10px;
  align-items: center;
  width: 100%;
  font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  margin-bottom: 12px;
}
.trace-waterfall .tw-lab {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 280px; opacity: 0.85;
}
.trace-waterfall .tw-lab-pipeline {
  padding-left: 0.65rem;
  border-left: 2px solid #10b981;
  max-width: 300px;
}
.trace-waterfall .tw-dur .tw-detail {
  opacity: 0.65;
  white-space: nowrap;
}
.trace-waterfall .tw-track {
  height: 14px;
  background: #dbeafe;
  border-radius: 2px;
  position: relative;
}
.trace-waterfall .tw-track > i,
.trace-waterfall .tw-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  min-width: 2px;
}
.trace-waterfall .tw-track > i.ai,
.trace-waterfall .tw-bar.ai    { background: #f97316; }
.trace-waterfall .tw-track > i.tool,
.trace-waterfall .tw-bar.tool  { background: #10b981; }
.trace-waterfall .tw-track > i.other,
.trace-waterfall .tw-bar.other { background: #6366f1; }
.trace-waterfall .tw-dur {
  text-align: right; opacity: 0.6; min-width: 64px;
}
.trace-waterfall .tw-legend {
  grid-column: 1 / -1;
  display: flex; gap: 14px; flex-wrap: wrap; margin-top: 6px; opacity: 0.7;
  font: 11px monospace;
}
.trace-waterfall .tw-legend .sw {
  display: inline-block; width: 10px; height: 10px; border-radius: 2px;
  margin-right: 5px; vertical-align: middle;
}
.trace-waterfall .tw-legend .sw.ai    { background: #f97316; }
.trace-waterfall .tw-legend .sw.tool  { background: #10b981; }
.trace-waterfall .tw-legend .sw.other { background: #6366f1; }

/* \u2500\u2500 Tool-call frequency chart \u2500\u2500 */
.trace-vbar {
  border: 1px solid oklch(var(--b3));
  border-radius: 8px;
  background: oklch(var(--b2));
  padding: 10px 12px 8px;
  margin-top: 12px;
}
.trace-vbar-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: oklch(var(--bc) / 0.7);
  margin: 0 0 8px;
}
.trace-vbar-hint {
  margin-top: 4px;
  font-size: 11px;
  color: oklch(var(--bc) / 0.5);
}
.vbar-wrap {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 90px;
  padding: 4px 0 0;
  border-bottom: 1px solid oklch(var(--b3));
  overflow-x: auto;
}
.vbar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 14px;
  height: 100%;
}
.vbar-col .b {
  width: 10px;
  background: oklch(var(--p));
  border-radius: 2px 2px 0 0;
  min-height: 0;
}
.vbar-col .b.err { background: oklch(var(--er)); }
.vbar-col .b.unknown { background: oklch(var(--bc) / 0.45); }
.vbar-col .n {
  font: 9px ui-monospace, SFMono-Regular, Menlo, monospace;
  line-height: 1;
  margin-bottom: 1px;
  color: oklch(var(--bc) / 0.7);
}
.vbar-col .n.zero { visibility: hidden; }
.vbar-labels {
  display: flex;
  gap: 2px;
  margin-top: 2px;
  font: 9px ui-monospace, SFMono-Regular, Menlo, monospace;
  color: oklch(var(--bc) / 0.5);
  overflow-x: auto;
}
.vbar-labels .l {
  min-width: 14px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  height: 60px;
  overflow: hidden;
}
.vbar-labels .l.zero { opacity: 0.45; }

/* \u2500\u2500 Turn traces inspector \u2500\u2500 */
.tt-panel {
  --tt-bg: oklch(var(--b1));
  --tt-elev: oklch(var(--b2));
  --tt-elev-2: oklch(var(--b3));
  --tt-hover: oklch(var(--b3) / 0.55);
  --tt-border: oklch(var(--b3));
  --tt-fg: oklch(var(--bc));
  --tt-muted: oklch(var(--bc) / 0.7);
  --tt-dim: oklch(var(--bc) / 0.5);
  --tt-accent: oklch(var(--p));
  --tt-ai: oklch(var(--wa));
  --tt-zeus: oklch(var(--su));
  --tt-other: oklch(var(--in));
  --tt-ok: oklch(var(--su));
  --tt-warn: oklch(var(--wa));
  --tt-err: oklch(var(--er));
  --tt-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: oklch(var(--b1));
  color: oklch(var(--bc));
  min-height: 0;
}
.tt-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: oklch(var(--bc));
}
.tt-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  min-height: 2.75rem;
  box-sizing: border-box;
  background: oklch(var(--b1));
  border-bottom: 1px solid oklch(var(--b3));
}
.tt-header-row {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
}
.tt-hdr-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.tt-session {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  padding: 6px 12px;
  font-size: 11px;
  color: oklch(var(--bc) / 0.7);
  border-bottom: 1px solid oklch(var(--b3));
  background: oklch(var(--b2) / 0.45);
  min-width: 0;
  overflow: hidden;
}
.tt-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .03em;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid oklch(var(--b3));
  color: oklch(var(--bc) / 0.7);
  background: oklch(var(--b2));
}
.tt-badge.ok { color: oklch(var(--su)); border-color: oklch(var(--su) / 0.35); background: oklch(var(--su) / 0.12); }
.tt-badge.warn { color: oklch(var(--wa)); border-color: oklch(var(--wa) / 0.35); background: oklch(var(--wa) / 0.12); }
.tt-badge.err { color: oklch(var(--er)); border-color: oklch(var(--er) / 0.4); background: oklch(var(--er) / 0.12); }
.tt-badge.info { color: oklch(var(--in)); border-color: oklch(var(--in) / 0.4); background: oklch(var(--in) / 0.12); }
.tt-sep { opacity: 0.4; }
.tt-panel .tt-id {
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--tt-mono);
}
.tt-id.is-copied,
.idchip.is-copied,
.btn.is-copied,
.tt-metrics .mono.is-copied {
  border-color: oklch(var(--su) / 0.55);
  color: oklch(var(--su));
}
.tt-link, .tt-linkish {
  color: oklch(var(--p));
  font-size: 11px;
  text-decoration: none;
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}
.tt-link:hover, .tt-linkish:hover { text-decoration: underline; }
.tt-muted { color: oklch(var(--bc) / 0.5); }
.tt-body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tt-turns { padding: 0; min-height: 0; }

button.tt-turn-item {
  appearance: none;
  display: grid;
  gap: 4px;
  width: 100%;
  text-align: left;
  font: inherit;
  color: oklch(var(--bc));
  background: transparent;
  border: 0;
  border-bottom: 1px solid oklch(var(--b3));
  border-radius: 0;
  padding: 10px 12px;
  cursor: pointer;
}
button.tt-turn-item:hover,
button.tt-turn-item:focus-visible {
  background: oklch(var(--b3) / 0.45);
  outline: none;
}
button.tt-turn-item.active {
  background: oklch(var(--p) / 0.12);
  box-shadow: inset 3px 0 0 oklch(var(--p));
}
.tt-turn-item .row1 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: oklch(var(--bc) / 0.65);
  font-variant-numeric: tabular-nums;
}
.tt-turn-item .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: oklch(var(--su)); flex-shrink: 0;
}
.tt-turn-item .dot.ok { background: oklch(var(--su)); }
.tt-turn-item .dot.warn { background: oklch(var(--wa)); }
.tt-turn-item .dot.err { background: oklch(var(--er)); }
.tt-turn-item .n {
  font-family: var(--tt-mono);
  font-weight: 600;
  font-size: 11px;
}
.tt-turn-item .dur { font-variant-numeric: tabular-nums; }
.tt-turn-item .meta {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tt-turn-item .q {
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tt-turn-item .row3 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.tt-turn-tag {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 500;
  line-height: 1.2;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid oklch(var(--b3));
  background: oklch(var(--b2));
  color: oklch(var(--bc) / 0.7);
  font-variant-numeric: tabular-nums;
}
.tt-turn-tag.err {
  color: oklch(var(--er));
  border-color: oklch(var(--er) / 0.4);
  background: oklch(var(--er) / 0.12);
}
.tt-turn-tag.synth {
  color: oklch(var(--in));
  border-color: oklch(var(--in) / 0.35);
  background: oklch(var(--in) / 0.12);
}

.tt-detail { display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: hidden; flex: 1; }

.tt-turn-picker details.dropdown {
  width: 100%;
  position: relative;
}
.tt-turn-trigger {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  cursor: pointer;
  font: inherit;
  color: oklch(var(--bc));
  background: oklch(var(--b1));
  border: 1px solid oklch(var(--b3));
  border-radius: 8px;
  padding: 8px 10px;
  min-height: 40px;
}
.tt-turn-trigger::-webkit-details-marker { display: none; }
.tt-turn-trigger::marker { content: ""; }
.tt-turn-trigger:hover,
.tt-turn-picker details[open] .tt-turn-trigger {
  border-color: oklch(var(--p) / 0.55);
}
.tt-turn-trigger .q {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tt-turn-trigger .meta {
  font-size: 11px;
  color: oklch(var(--bc) / 0.6);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.tt-turn-trigger .n {
  font-family: var(--tt-mono);
  font-weight: 600;
  font-size: 11px;
}
.tt-turn-trigger .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: oklch(var(--su)); flex-shrink: 0;
}
.tt-turn-trigger .dot.ok { background: oklch(var(--su)); }
.tt-turn-trigger .dot.warn { background: oklch(var(--wa)); }
.tt-turn-trigger .dot.err { background: oklch(var(--er)); }
.tt-turn-chevron { transition: transform 0.15s ease; }
.tt-turn-picker details[open] .tt-turn-chevron { transform: rotate(180deg); }
.tt-turn-picker .dropdown-content {
  position: absolute;
  left: 0;
  right: 0;
  visibility: hidden;
  opacity: 0;
  max-height: min(18rem, 45vh);
}
.tt-turn-picker details[open] > .dropdown-content {
  visibility: visible;
  opacity: 1;
}
.tt-turn-picker .dropdown-content .tt-turn-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.tt-turn-picker .dropdown-content .tt-turn-item:last-child {
  border-bottom: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
.tt-detail-head { padding: 10px 12px 6px; border-bottom: 1px solid oklch(var(--b3)); }
.tt-d-title { font-size: 13px; font-weight: 650; margin-bottom: 8px; line-height: 1.35; }
.tt-metrics { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
.tt-metrics .metric {
  background: oklch(var(--b2));
  border: 1px solid oklch(var(--b3));
  border-radius: 8px;
  padding: 6px 8px;
}
.tt-metrics .k { font-size: 10px; color: oklch(var(--bc) / 0.5); text-transform: uppercase; letter-spacing: .04em; }
.tt-metrics .v { font-size: 13px; font-weight: 650; font-family: var(--tt-mono); }
.tt-metrics .sub { font-size: 11px; color: oklch(var(--bc) / 0.65); font-weight: 500; }
.tt-metrics .mm-bar {
  display: flex; height: 6px; border-radius: 3px; overflow: hidden;
  background: oklch(var(--b3)); margin-top: 4px;
}
.tt-metrics .mm-bar > i { display: block; height: 100%; }
.tt-metrics .mm-bar > i.ai { background: oklch(var(--wa)); }
.tt-metrics .mm-bar > i.zeus { background: oklch(var(--su)); }
.tt-metrics .mm-bar > i.other { background: oklch(var(--in)); }
.tt-metrics .mono { cursor: pointer; color: oklch(var(--p)); }

.tt-diagnosis {
  margin: 8px 12px 0;
  flex: 0 0 auto;
  max-height: min(28vh, 220px);
  overflow: auto;
  min-width: 0;
}
/* DaisyUI .alert (\u2265sm) is grid-auto-flow:column. Keep warning colors, stack copy. */
.tt-diagnosis.alert {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
  gap: 0.35rem !important;
  grid-auto-flow: row !important;
  grid-template-columns: minmax(0, 1fr) !important;
  width: auto;
}
.tt-diagnosis-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  width: 100%;
}
.tt-diagnosis .eyebrow { display: flex; gap: 8px; align-items: center; font-size: 11px; margin-bottom: 2px; }
.tt-diagnosis h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
}
.tt-diagnosis .detail { font-size: 12px; margin: 0 0 4px; line-height: 1.4; }
.tt-diagnosis .tt-diagnosis-actions,
.tt-diagnosis .hero-actions,
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
.idchip {
  font-family: var(--tt-mono); font-size: 10px; padding: 2px 7px; border-radius: 6px;
  border: 1px solid oklch(var(--b3)); background: oklch(var(--b2)); cursor: pointer;
}
.idchip b { font-weight: 600; margin-right: 4px; opacity: 0.7; }

.tt-panel .tt-tabs {
  flex-wrap: nowrap !important;
  height: auto !important;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  margin: 0;
  border-radius: 0;
  border-bottom: 1px solid oklch(var(--b3));
  flex-shrink: 0;
}
.tt-panel .tt-tabs .tab {
  flex: 0 0 auto;
  white-space: nowrap;
  height: auto;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
}
.tt-tab-panels { flex: 1; min-height: 0; overflow: auto; padding: 10px 12px 16px; }
.tt-tab-panel { display: none; }
.tt-tab-panel.on { display: block; }

.tt-empty { padding: 16px; color: oklch(var(--bc) / 0.6); flex: 1 1 auto; }
.tt-empty-inline { color: oklch(var(--bc) / 0.5); font-size: 12px; padding: 12px 4px; }
.tt-kv { display: grid; grid-template-columns: 120px 1fr; gap: 6px 10px; margin-top: 12px; font-size: 12px; }
.tt-kv .k { color: oklch(var(--bc) / 0.5); }
.tt-fold { margin-top: 12px; }
.tt-inject-note {
  font-size: 12px;
  color: oklch(var(--bc) / 0.7);
  line-height: 1.45;
  padding: 8px 10px;
  border: 1px dashed oklch(var(--b3));
  border-radius: 8px;
  margin-bottom: 8px;
}

.tt-panel .trace-waterfall { color: oklch(var(--bc)); width: 100%; }
.tt-panel .tab-kpi {
  border: 1px solid oklch(var(--b3));
  border-radius: 8px;
  background: oklch(var(--b2));
  padding: 10px 12px;
  margin: 0 0 12px;
}
.tt-panel .tab-kpi .kpi-head {
  font: 600 11px inherit;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: oklch(var(--bc) / 0.7);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.tt-panel .tab-kpi .kpi-head .sub {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}
.tt-panel .tab-kpi .kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px 12px;
}
.tt-panel .tab-kpi .kpi-tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.tt-panel .tab-kpi .kpi-lbl {
  font: 10px/1.2 var(--tt-mono);
  color: oklch(var(--bc) / 0.5);
  text-transform: uppercase;
  letter-spacing: .04em;
}
.tt-panel .tab-kpi .kpi-val { font: 600 14px/1.2 var(--tt-mono); }
.tt-panel .tab-kpi .kpi-val.warn { color: oklch(var(--wa)); }
.tt-panel .tab-kpi .kpi-val.fail { color: oklch(var(--er)); }
.tt-panel .tab-kpi .kpi-val.pass { color: oklch(var(--su)); }

.tt-table tr { cursor: pointer; }
.tt-table tr.sel { background: oklch(var(--p) / 0.12); }
.io-card { min-height: 140px; display: flex; flex-direction: column; overflow: hidden; }
.io-card .ai-lab { color: oklch(var(--wa)); }
.io-card .zeus-lab { color: oklch(var(--su)); }
.io-card .ml-auto,
.tt-decomp .ml-auto { margin-left: auto; }
.io-card pre {
  margin: 0; padding: 8px; overflow: auto; flex: 1; max-height: 360px;
  font: 11px/1.4 var(--tt-mono); white-space: pre-wrap; word-break: break-word;
}
.tt-hop-actions { display: flex; gap: 8px; align-items: center; margin: 10px 0 8px; font-size: 12px; }
.tt-split-io { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.round-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.tt-tokline { font-size: 11.5px; color: oklch(var(--bc) / 0.7); margin-bottom: 10px; }
.tt-tokline strong { color: oklch(var(--bc)); }

.tt-decomp {
  border: 1px solid oklch(var(--b3));
  border-radius: 8px;
  background: oklch(var(--b2));
  padding: 10px 12px;
  margin-bottom: 10px;
}
.tt-decomp.empty { color: oklch(var(--bc) / 0.5); font-size: 12px; }
.tt-decomp header {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  font-size: 12px; font-weight: 650; margin-bottom: 8px;
}
.tt-decomp-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.tt-decomp-summary { font-size: 12px; color: oklch(var(--bc) / 0.75); margin-bottom: 8px; }
.tt-decomp-row { display: grid; grid-template-columns: 88px 1fr; gap: 6px 10px; font-size: 12px; margin: 4px 0; }
.tt-decomp-row .lab { color: oklch(var(--bc) / 0.5); font-size: 11px; text-transform: uppercase; }
.tt-decomp-chip {
  display: inline-flex; font-size: 11px; padding: 1px 7px; border-radius: 999px;
  border: 1px solid oklch(var(--b3)); background: oklch(var(--b3) / 0.4);
}

.tt-panel .det-card h3 { margin: 0 0 8px; font-size: 13px; display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
.tt-panel .det-env { display: grid; grid-template-columns: 140px 1fr; gap: 4px 12px; font-size: 12px; margin: 0; }
.tt-panel .det-env dt { color: oklch(var(--bc) / 0.5); }
.tt-panel .det-env dd { margin: 0; font-family: var(--tt-mono); font-size: 11px; word-break: break-word; }
.tt-panel .det-diag-card {
  border: 1px solid oklch(var(--b3)); border-radius: 8px; padding: 10px 12px; background: oklch(var(--b2));
}
.tt-panel .det-diag-card.fail { border-color: oklch(var(--er) / 0.5); background: oklch(var(--er) / 0.08); }
.tt-panel .det-diag-card.warn { border-color: oklch(var(--wa) / 0.5); background: oklch(var(--wa) / 0.08); }
.tt-panel .det-diag-card.pass { border-color: oklch(var(--su) / 0.5); background: oklch(var(--su) / 0.08); }
.tt-panel .kpi-mini { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 10px; margin-top: 8px; }
.tt-panel .kpi-mini .km { padding: 4px 6px; border-radius: 4px; background: oklch(var(--b1)); border: 1px solid oklch(var(--b3)); }
.tt-panel .kpi-mini .l { font: 9px var(--tt-mono); color: oklch(var(--bc) / 0.5); text-transform: uppercase; }
.tt-panel .kpi-mini .v { font: 600 12px var(--tt-mono); }
.tt-panel .pcl .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
.tt-panel .hint { color: oklch(var(--bc) / 0.5); font-size: 12px; }
.playbook.empty-ok { color: oklch(var(--su)); font-size: 12px; }
.raw-card { min-height: 320px; }

.tt-panel .trace-dump-viewer {
  max-height: 480px;
  overflow: auto;
  padding: 8px 10px;
  background: oklch(var(--b2));
  color: oklch(var(--bc));
  font-family: var(--tt-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.4;
}
.tt-panel .trace-dump-viewer .jsv,
.tt-panel .trace-dump-viewer .jsv *,
.tt-panel .trace-dump-viewer .trace-pre {
  font-family: var(--tt-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.4;
}
.tt-panel .trace-dump-viewer .jsv {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  border-radius: 0;
  color: oklch(var(--bc));
}
.tt-panel .trace-dump-viewer .jsv-content {
  list-style: none;
  margin: 0;
  padding-left: 1.1rem;
  border-left: 1px dotted oklch(var(--b3));
}
.tt-panel .trace-dump-viewer .jsv-toggle {
  color: oklch(var(--bc) / 0.5);
  font-size: 10px;
}
.tt-panel .trace-dump-viewer .text-amber-800 { color: oklch(var(--wa)); }
.tt-panel .trace-dump-viewer .text-green-700 { color: oklch(var(--su)); }
.tt-panel .trace-dump-viewer .text-blue-700 { color: oklch(var(--in)); }
.tt-panel .trace-dump-viewer .text-rose-700 { color: oklch(var(--er)); }
.tt-panel .trace-dump-viewer .text-stone-700,
.tt-panel .trace-dump-viewer .text-gray-500,
.tt-panel .trace-dump-viewer .text-gray-600 {
  color: oklch(var(--bc) / 0.7);
}
.tt-panel .trace-dump-viewer .trace-pre {
  margin: 0;
  color: oklch(var(--bc));
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 900px) {
  .tt-split-io { grid-template-columns: 1fr; }
  .tt-metrics { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 720px) {
  .debug-panel {
    width: calc(100vw - 1rem);
    left: 0.5rem;
    bottom: 4.25rem;
    height: min(78vh, 720px);
  }
  .tt-split-io { grid-template-columns: 1fr; }
  .tt-metrics { grid-template-columns: 1fr 1fr; }
  .tt-turn-picker .dropdown-content {
    top: auto;
    bottom: calc(100% + 4px);
    margin-top: 0;
    max-height: min(16rem, 42vh);
  }
  .tt-turn-trigger .meta { display: none; }
  button.tt-turn-item { padding: 8px 10px; }
}

.tt-tab[hidden],
.tt-chip[hidden],
.tt-body[hidden],
.tt-session[hidden],
.tt-diagnosis[hidden],
.tt-detail-head[hidden],
#tt-empty[hidden],
#tt-turn-count[hidden],
.tt-hdr-actions[hidden],
.tt-turn-trigger [hidden] {
  display: none !important;
}

.hidden,
[hidden] {
  display: none !important;
}

.debug-panel.is-hidden {
  display: none !important;
}

.zeus-trace-root[data-mount="docked"] .debug-panel.is-hidden {
  display: flex !important;
}
`;de(document.currentScript);var ft=[],Qt=!1;function xr(){return{appendTraceCard(){},openDebugPanel(){},setEntries(){},clear(){},exportBundle(){return{traces:[]}},setJobMode(){}}}function kr(){Qt||(window.appendTraceCard=(...t)=>ft.push({type:"card",args:t}),window.openDebugPanel=()=>ft.push({type:"open"}))}function wr(t){for(let e of ft)e.type==="open"?t.openDebugPanel():e.type==="card"&&t.appendTraceCard(...e.args);ft.length=0}var Sr="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css",jr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";function Tr(){if(typeof document>"u"||!document.head||document.head.querySelector('link[data-zeus-trace-font="inter"]'))return;let e=document.createElement("link");e.rel="stylesheet",e.href=jr,e.setAttribute("data-zeus-trace-font","inter"),document.head.appendChild(e)}function Cr(t){let e=t.mount==="docked",n=t.mountSelector,r;return e&&n&&(r=document.querySelector(n)),r?(r.style.display=r.style.display||"block",r.style.position=r.style.position||"relative",r.style.minHeight=r.style.minHeight||"320px"):(r=document.createElement("div"),r.id="zeus-trace-host",r.style.cssText=e?"all:initial;display:block;position:relative;width:100%;height:100%;min-height:320px;z-index:1;":"all:initial;display:block;position:fixed;inset:0;z-index:99999;pointer-events:none;",document.body.appendChild(r)),r.id||(r.id="zeus-trace-host"),{host:r,docked:e}}function Ar(){let t=ct();if(!t.enabled){let b=xr();return window.appendTraceCard=b.appendTraceCard,window.openDebugPanel=b.openDebugPanel,ft.length=0,Qt=!0,{api:b,config:t}}let{host:e,docked:n}=Cr(t),r=e.attachShadow({mode:"open"});Tr();let s=document.createElement("link");s.rel="stylesheet",s.href=Sr;let i=document.createElement("style");i.textContent=$e;let l=document.createElement("div");l.className="zeus-trace-root bg-base-100 text-base-content",l.setAttribute("data-theme","light"),l.setAttribute("data-mount",n?"docked":"overlay"),l.style.pointerEvents="auto",l.innerHTML=We,r.append(s,i,l);let d=Ze(l,t);return window.appendTraceCard=d.appendTraceCard,window.openDebugPanel=d.openDebugPanel,window.ZeusTrace&&(window.ZeusTrace.setEntries=d.setEntries,window.ZeusTrace.clear=d.clear,window.ZeusTrace.exportBundle=d.exportBundle,window.ZeusTrace.setJobMode=d.setJobMode),wr(d),Qt=!0,{api:d,config:t}}kr();var Yt,qr=new Promise(t=>{Yt=t});window.ZeusTrace={ready:qr,get config(){return Ht(ct())},get version(){return Ht(ct()).version}};var Ge=()=>{try{let{api:t,config:e}=Ar();Yt({api:t,config:e})}catch(t){console.error("[ZeusTrace] Failed to mount widget:",t),Yt({api:null,config:null,error:t})}};document.body?Ge():document.addEventListener("DOMContentLoaded",Ge);})();
//# sourceMappingURL=zeus_client_chat_trace.js.map
