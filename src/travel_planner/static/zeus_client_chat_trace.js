(()=>{var En=Object.defineProperty;var Mn=(t,e)=>{for(var n in e)En(t,n,{get:e[n],enumerable:!0})};var zn="http://localhost:8080";var Nn="1.2.3",Nt=null;function fe(t){Nt=t}function lt(){return Nn||"dev"}function $(t){if(!t)return null;if(typeof t=="object"&&!Array.isArray(t))return{v1:Array.isArray(t.v1)?t.v1:[],v2:Array.isArray(t.v2)?t.v2:[]};if(typeof t=="string")try{return $(JSON.parse(t))}catch{return null}return null}function tt(t){let e=String(t||"").trim();if(!e)return"";let n=e.indexOf("#");n>=0&&(e=e.slice(0,n)),e=e.replace(/\/+$/,"");try{let r=new URL(e);return(r.pathname||"").replace(/\/+$/,"").toLowerCase()==="/hub"?r.origin:e}catch{return/^https?:\/\/hub$/i.test(e)?e:(e=e.replace(/\/hub$/i,""),e.replace(/\/+$/,""))}}function be(t,e){let n=tt(t),r=String(e||"").trim();return!n||!r?"":n+"/hub/#/debug/req/"+encodeURIComponent(r)}function me(t,e){let n=tt(t),r=String(e||"").trim();return!n||!r?"":n+"/hub/debug/session/"+encodeURIComponent(r)}function he(t){if(t===!0||t===!1)return t;if(t==null||t==="")return null;let e=String(t).trim().toLowerCase();return["1","true","yes","on"].includes(e)?!0:["0","false","no","off"].includes(e)?!1:null}function Hn(t){try{let e=t!==void 0?t:typeof location<"u"?location.search:"",n=e.startsWith("?")||e===""?e:`?${e}`;return he(new URLSearchParams(n).get("debug"))}catch{return null}}function On(t={}){let e=t.fromWindow!==void 0?t.fromWindow||{}:(typeof window<"u"?window.ZeusTraceConfig:null)||{},n=t.script!==void 0?t.script:Nt||(typeof document<"u"?document.currentScript:null),r=he(e.enabled!==void 0?e.enabled:n?.dataset?.enabled);if(r!==null)return r;let s=Hn(t.search);return s!==null?s:!1}function ct(t={}){let e=t.fromWindow!==void 0?t.fromWindow||{}:window.ZeusTraceConfig||{},n=t.script!==void 0?t.script:Nt||document.currentScript,r=(e.zeusApiUrl||n?.dataset?.zeusApiUrl||zn||"").replace(/\/$/,""),s=tt(e.hubBaseUrl||e.hub_url||n?.dataset?.hubBaseUrl||""||""),l=String(e.mount||n?.dataset?.mount||"overlay").toLowerCase()==="docked"?"docked":"overlay",d=(e.mountSelector||n?.dataset?.mountSelector||"").trim();return{zeusApiUrl:r,hubBaseUrl:s,zeusAuthToken:e.zeusAuthToken||n?.dataset?.zeusAuthToken||""||"",toolOrder:$(e.toolOrder??n?.dataset?.toolOrder),enabled:On({fromWindow:e,script:n,search:t.search}),mount:l,mountSelector:d}}function ge(t={}){let e=ct(t).hubBaseUrl;if(e)return e;let n=t.config&&t.config.hubBaseUrl;return n?tt(n):""}function Ht(t){return{zeusApiUrl:t.zeusApiUrl,hubBaseUrl:t.hubBaseUrl,toolOrder:t.toolOrder,enabled:!!t.enabled,mount:t.mount||"overlay",mountSelector:t.mountSelector||"",version:lt()}}function ye(t,e,n={}){let r={};e.zeusAuthToken&&(r.Authorization=`Bearer ${e.zeusAuthToken}`);let s={headers:r};return n.signal&&(s.signal=n.signal),fetch(`${e.zeusApiUrl}${t}`,s)}var Tt={};Mn(Tt,{asDisplayText:()=>z,attachPipelineCostsToSteps:()=>_t,copyToClipboard:()=>Fn,decompositionCardHTML:()=>er,detectiveCheckSummary:()=>st,detectiveCostResultKpis:()=>sr,detectiveDefaultTab:()=>Pt,detectiveDiagnosisModel:()=>ar,detectiveEnvelopeRows:()=>Ue,detectiveInnerTabs:()=>Pe,detectiveIsDirectTurn:()=>Vt,detectiveLayerA:()=>Ke,detectiveNeedsAttention:()=>Be,detectivePlaybookCards:()=>Wt,detectivePromptChecks:()=>ot,detectivePromptView:()=>ir,detectiveSessionModel:()=>lr,detectiveShellSpec:()=>or,detectiveSlowTop:()=>Je,detectiveTokenTiles:()=>Fe,detectiveV2Direct:()=>Zt,escapeHtml:()=>F,estimatePayloadBytes:()=>gt,expandTraceSpans:()=>Jt,extractDecomposition:()=>Ie,extractGather:()=>St,extractJobUnits:()=>rr,extractStepCosts:()=>K,fmtBytes:()=>Ut,fmtMs:()=>vt,fmtTokens:()=>Jn,formatDetectiveOverview:()=>yt,gradeNorm:()=>I,hopLooksV2Direct:()=>pt,hubDebugReqUrl:()=>be,hubDebugSessionUrl:()=>me,isMultiAgentTrace:()=>nr,jsnviewOptions:()=>Oe,matchingToolStep:()=>xt,mountJsnviewViewer:()=>Xn,normalizeHubBase:()=>tt,pipelineSpansFromStep:()=>Me,prettyJSON:()=>Ee,resolveHopBytes:()=>ut,shortId:()=>Bn,synthesizeTraceSpans:()=>wt,tallyToolCalls:()=>He,timelineSpeedKpiHTML:()=>Qn,timelineSpeedKpis:()=>Ne,tokenTotal:()=>rt,toolFrequencyChartHTML:()=>Yn,traceMetrics:()=>Ft,traceWallMs:()=>Kt,tryParseJSON:()=>W,waterfallHTML:()=>Gn});var Ot="https://cdn.jsdelivr.net/npm/jsnview@3.0.0/dist/index.min.js",et=null;function xe(){return window.jsnview?Promise.resolve(window.jsnview):et||(et=new Promise((t,e)=>{let n=()=>{if(window.jsnview){t(window.jsnview);return}et=null,e(new Error("jsnview loaded but window.jsnview is missing"))},r=a=>{et=null,e(new Error(a||"Failed to load jsnview"))};document.querySelectorAll(`script[src="${Ot}"]`).forEach(a=>{if(a.dataset.jsnviewFailed==="1")try{a.remove()}catch{}});let s=document.querySelector(`script[src="${Ot}"]`);if(s){if(window.jsnview){n();return}let a=()=>{s.removeEventListener("error",l),n()},l=()=>{s.dataset.jsnviewFailed="1",s.removeEventListener("load",a);try{s.remove()}catch{}r("Failed to load jsnview")};if(s.addEventListener("load",a),s.addEventListener("error",l),s.dataset.loaded==="1"){s.removeEventListener("load",a),s.removeEventListener("error",l),s.dataset.jsnviewFailed="1";try{s.remove()}catch{}ve(n,r)}return}ve(n,r)}),et)}function ve(t,e){let n=document.createElement("script");n.src=Ot,n.async=!0,n.onload=()=>{n.dataset.loaded="1",t()},n.onerror=()=>{n.dataset.jsnviewFailed="1";try{n.remove()}catch{}e("Failed to load jsnview")},document.head.appendChild(n)}function F(t){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function z(t){if(t==null||t==="")return"";let e=typeof t;return e==="string"?t:e==="number"&&isFinite(t)?String(t):e==="boolean"?t?"true":"false":""}function Rn(t){if(!t||typeof t!="object"||Array.isArray(t))return"";let e=[];if(t.hop_count!=null&&t.hop_count!==""){let r=Number(t.hop_count);isFinite(r)&&e.push(r+" hop"+(r===1?"":"s"))}if(t.rounds!=null&&t.rounds!==""){let r=Number(t.rounds);isFinite(r)&&e.push(r+" round"+(r===1?"":"s"))}t.total_ms!=null&&t.total_ms!==""&&e.push(vt(t.total_ms));let n=rt(t.tokens);return n>0&&e.push("tokens "+n.toLocaleString()),e.join(" \xB7 ")}function yt(t){if(!t)return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=e.overview||t.overview||e.detail||t.detail||"";return typeof n=="string"?n:n&&typeof n=="object"?Rn(n):z(n)}function _e(t){if(!t||typeof t!="object")return!0;let e=String(t.status||"").toLowerCase();if(e){if(["fail","error","err","failed","warn","warning"].includes(e))return!1;if(["pass","ok","healthy","clear"].includes(e))return!0}return!(t.ok===!1||t.pass===!1)}function I(t){let e=String(t||"").toLowerCase();return["fail","error","err","failed"].includes(e)?"fail":["warn","warning"].includes(e)?"warn":["pass","ok","healthy","clear"].includes(e)?"pass":e==="skip"?"skip":["n/a","na","n-a"].includes(e)?"na":""}function Bt(t){return t==="scope_brief"||t==="mini_schema"}function qe(t){let e=I(t);if(e==="pass"||e==="fail")return e;let n=String(t||"").toLowerCase();return n==="pass"||n==="fail"?n:""}function Dn(t){return!t||!Bt(t.id)?!0:!!qe(t.status)}function In(t){return!t||!Bt(t.id)?t:{ok:t.ok,lab:t.lab,status:qe(t.status)||t.status,id:t.id,group:t.group,detail:"",fix_hint:"",interactive:!1}}function Dt(t){if(typeof t=="string")return{ok:!0,lab:t,status:"pass",id:"",group:"",detail:"",fix_hint:"",interactive:!1};let e=z(t&&t.status).toLowerCase(),n=z(t&&t.id);return{ok:_e(t),lab:z(t&&(t.lab||t.label||t.name)||"?")||"?",status:e||(_e(t)?"pass":"fail"),id:n,group:z(t&&t.group),detail:z(t&&(t.detail||t.summary)),fix_hint:z(t&&(t.fix_hint||t.fixHint||t.hint)),interactive:!!(t&&t.interactive)&&!Bt(n)}}function ot(t){if(!t)return[];let e=t.prompt||t.prompt_check||t.checklist;return Array.isArray(e)?e.map(Dt):e&&Array.isArray(e.items)?e.items.map(Dt):[]}function st(t){let e=Array.isArray(t)?t:[],n=e.length,r=e.filter(a=>a&&a.ok).length;if(!n)return{passed:0,total:0,label:"",tone:""};let s=r===n;return{passed:r,total:n,label:r+"/"+n+(s?" PASSED":" FAILED"),tone:s?"ok":"err"}}function vt(t){let e=Number(t)||0;return e>=1e3?(e/1e3).toFixed(2)+"s":e+"ms"}function Ut(t){let e=Number(t)||0;return e<1024?e+"B":e<1024*1024?(e/1024).toFixed(1)+"kB":(e/(1024*1024)).toFixed(1)+"MB"}var we=["bytes","byte_size","result_bytes","content_length","contentLength","body_bytes","size_bytes"],ke=["result_json","result_full","res","response","result","body","snippet","result_text"];function Pn(t){if(t==null||t==="")return null;if(typeof t=="number")return isFinite(t)&&t>=0?t:null;if(typeof t=="string"){let e=t.trim();if(!e)return null;if(/[a-zA-Z]/.test(e))return e;let n=Number(e);return isFinite(n)&&n>=0?n:null}return null}function Se(t){if(!t||typeof t!="object")return null;for(let e=0;e<we.length;e++){let n=Pn(t[we[e]]);if(n!=null)return n}return null}function Te(t){if(t==null||t==="")return 0;let e=String(t);if(typeof TextEncoder<"u")return new TextEncoder().encode(e).length;let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?n+=1:s<2048?n+=2:s>=55296&&s<=56319?(n+=4,r++):n+=3}return n}function Le(t){if(t==null||t==="")return!0;if(typeof t=="string"){let e=t.trim();return!e||e==="{}"||e==="[]"}return typeof t!="object"?!1:Array.isArray(t)?t.length===0:Object.keys(t).length===0}function je(t){if(!t||typeof t!="object")return null;for(let e=0;e<ke.length;e++){let n=t[ke[e]];if(n!=null&&n!==""&&!Le(n))return n}return null}function gt(t){if(Le(t))return null;if(typeof t=="string"){let e=Te(t);return e>0?e:null}if(typeof t=="object")try{let e=JSON.stringify(t);if(!e||e==="{}"||e==="[]")return null;let n=Te(e);return n>0?n:null}catch{return null}return null}function xt(t,e,n){let r=(t||[]).filter(l=>l&&typeof l=="object"&&(l.type==null||l.type==="tool"));if(!r.length||!e||typeof e!="object")return null;let s=e.req_id||e.id;if(s){let l=r.find(d=>String(d.req_id||"")===String(s));if(l)return l}let a=e.verb||e.name||e.tool;if(a){let l=r.find(d=>(d.name||d.verb||d.tool)===a);if(l)return l}return n!=null&&n>=0&&n<r.length?r[n]:null}function ut(t,e,n){let r=Se(t);if(r!=null)return r;let s=Se(e);if(s!=null)return s;let a=gt(je(t))??gt(n)??gt(je(e));return a??null}function Bn(t,e){if(e=e??10,!t)return"";let n=String(t);return n.length>e?n.slice(0,e)+"\u2026":n}function Ee(t){try{let e=JSON.stringify(t===void 0?null:t,null,2);return e??"null"}catch{return String(t)}}function Un(t){let e=String(t??"");if(!e)return!1;let n=document.body||document.documentElement;if(!n)return!1;let r=document.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.setAttribute("aria-hidden","true"),r.tabIndex=-1,r.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none;",n.appendChild(r);let s=typeof document.activeElement<"u"?document.activeElement:null,a=!1;try{r.focus(),r.select();try{r.setSelectionRange(0,e.length)}catch{}a=typeof document.execCommand=="function"&&!!document.execCommand("copy")}catch{a=!1}try{r.remove()}catch{}try{s&&typeof s.focus=="function"&&s.focus()}catch{}return a}function Fn(t){let e=String(t??"");if(!e)return Promise.resolve(!1);let n=Un(e);try{let r=typeof navigator<"u"?navigator.clipboard:null;if(r&&typeof r.writeText=="function")return Promise.resolve(r.writeText(e)).then(()=>!0,()=>n)}catch{}return Promise.resolve(n)}function W(t){if(t==null||t==="")return null;if(typeof t=="object")return t;try{return JSON.parse(t)}catch{return null}}function rt(t){if(t==null||t==="")return 0;if(typeof t=="number")return isFinite(t)?t:0;if(typeof t=="string"){let a=Number(t);return isFinite(a)?a:0}if(typeof t!="object")return 0;let e=t.total!=null?t.total:t.total_tokens;if(e!=null&&e!==""){let a=Number(e);if(isFinite(a)&&a>0)return a}let n=Number(t.prompt!=null?t.prompt:t.prompt_tokens)||0,r=Number(t.completion!=null?t.completion:t.completion_tokens)||0;if(n||r)return n+r;let s=Number(e);return isFinite(s)?s:0}function Jn(t){let e=rt(t);return e>0?e.toLocaleString():"?"}function Ft(t){t=t||{};let e=0,n=0,r=0,s=0;(t.steps||[]).forEach(d=>{(d.type==="llm"||d.type==="llm_error")&&(e+=d.ms||0),d.type==="tool"&&(n+=d.ms||0,s+=d.bytes||0),d.usage&&(r+=rt(d.usage))}),t.ai_ms!=null&&(e=t.ai_ms),(t.zeus_ms!=null||t.tool_ms!=null)&&(n=t.zeus_ms!=null?t.zeus_ms:t.tool_ms),t.tokens!=null&&(r=rt(t.tokens));let a=t.total_ms||Kt(t)||e+n,l=Math.max(0,a-e-n);return{total:a,aiMs:e,zeusMs:n,other:l,tokens:r,bytes:s}}function Me(t,e,n){let r=n&&n.pipeline_step_costs,s={};if(!r||!r.length){let y=n&&(n.result_full||n.result)||"";try{let h=typeof y=="string"?JSON.parse(y):y;s=h&&h.meta||{},r=s.step_costs}catch{r=null}}if(!Array.isArray(r)||!r.length)return null;let a={};(n&&n.args&&n.args.steps||n&&n.pipeline_json&&n.pipeline_json.steps||[]).forEach(y=>{y&&(y.name||y.as)&&(a[y.name||y.as]=y.verb||"")});let d=[],b=0;r.forEach(y=>{let h=y.as||y.name||"step",u=a[h]||"",T=y.ms||0,j="pipeline."+h;u&&(j+="."+u);let x=[];y.cost!=null&&x.push("cost "+y.cost),y.result_size!=null&&x.push(y.result_size+" rows"),y.status&&x.push(y.status),d.push({name:j,cls:"tool",at:(t||0)+b,ms:T,detail:x.join(" \xB7 ")||null,pipeline:!0}),b+=T});let _=(e||0)-b;return _>0&&d.push({name:"pipeline.overhead",cls:"tool",at:(t||0)+b,ms:_,detail:"HTTP / orchestration",pipeline:!0}),d}function Jt(t,e){let n=(e||[]).filter(a=>a.type==="tool"&&a.name==="pipeline"),r=0,s=[];return(t||[]).forEach(a=>{if(a.name!=="tool.pipeline"){s.push(a);return}let l=Me(a.at,a.ms,n[r++]);l?s.push(...l):s.push(a)}),s}function Kn(t,e){if(!t||e<0||e>=t.length||t[e]!=="[")return null;let n=0,r=!1,s=!1;for(let a=e;a<t.length;a++){let l=t[a];if(r){s?s=!1:l==="\\"?s=!0:l==='"'&&(r=!1);continue}if(l==='"'){r=!0;continue}if(l==="[")n++;else if(l==="]"&&(n--,n===0))try{let d=JSON.parse(t.slice(e,a+1));return Array.isArray(d)?d:null}catch{return null}}return null}function K(t){if(t==null||t==="")return null;if(Array.isArray(t))return t.length?t:null;if(typeof t=="object"){if(Array.isArray(t.step_costs)&&t.step_costs.length)return t.step_costs;let s=t.meta||t.data&&t.data.meta||{};if(Array.isArray(s.step_costs)&&s.step_costs.length)return s.step_costs;let a=t.data&&typeof t.data=="object"?K(t.data):null;return a||null}let e=String(t);try{return K(JSON.parse(e))}catch{}let n=e.search(/"step_costs"\s*:/);if(n<0)return null;let r=e.indexOf("[",n);return Kn(e,r)}function It(t){return t&&(t.verb||t.name||t.tool)||"hop"}function _t(t,e){let n=(t||[]).map(l=>l&&typeof l=="object"?Object.assign({},l):l),r={},s=[];(e||[]).forEach(l=>{!l||typeof l!="object"||(l.req_id&&(r[String(l.req_id)]=l),It(l)==="pipeline"&&s.push(l))});let a=0;return n.forEach(l=>{if(!l||l.type!=="tool"||l.name!=="pipeline"||Array.isArray(l.pipeline_step_costs)&&l.pipeline_step_costs.length)return;let d=l.req_id&&r[String(l.req_id)]||s[a]||null;It(l)==="pipeline"&&a++;let b=K(l.pipeline_step_costs)||K(l.result_full||l.result)||d&&(K(d.step_costs)||K(d.snippet)||K(d.res)||K(d.body));b&&b.length&&(l.pipeline_step_costs=b)}),n}function Z(t){let e=Number(t);return isFinite(e)&&e>0?e:0}function Kt(t){let e=t||{},n=Z(e.total_ms);if(n)return n;let r=e.detective&&typeof e.detective=="object"?e.detective:{},s=r.overview&&typeof r.overview=="object"?r.overview:{},a=Z(s.total_ms);if(a)return a;let l=r.diagnosis&&r.diagnosis.slow;return Z(l&&l.total_ms)}function Vn(t,e){let n=0;return(t||[]).forEach(r=>{!r||typeof r!="object"||(n+=Z(r.ms!=null?r.ms:r.duration_ms))}),n||((e||[]).forEach(r=>{r&&r.type==="tool"&&(n+=Z(r.ms))}),n)}function Ce(t,e){let n=Number(e)||0;return n?(t||[]).map(r=>r&&typeof r=="object"?Object.assign({},r,{at:(r.at||0)+n}):r):t||[]}function ze(t){return t&&(t.type==="llm"||t.type==="llm_error"||t.type==="force_final")}function Zn(t){let e=[],n=0;return(t||[]).forEach(r=>{if(!ze(r))return;let s=Z(r.ms);if(!s)return;let a=r.type==="force_final"?"llm.force_final":"ai.chat.round."+(r.round!=null?r.round:e.length+1);e.push({name:a,cls:"ai",at:n,ms:s}),n+=s}),e}function Wn(t){let e=[],n=0;return(t||[]).forEach(r=>{if(!r||typeof r!="object"||r.type!=="tool")return;let s=r.name||"tool",a=Z(r.ms);if(!a&&s!=="pipeline")return;let l=s==="pipeline"?"tool.pipeline":"tool."+s;e.push({name:l,cls:"tool",at:n,ms:a}),n+=a}),e}function $n(t){let e=[],n=0;return(t||[]).forEach(r=>{if(!r||typeof r!="object")return;let s=It(r),a=Z(r.ms!=null?r.ms:r.duration_ms),l=s==="pipeline"?"tool.pipeline":"tool."+s;e.push({name:l,cls:"tool",at:n,ms:a}),n+=a}),e}function wt(t,e,n){let r=t&&Array.isArray(t.spans)?t.spans:[];if(r.length)return r;let s=(()=>{let y=Wn(n);return y.length?y:$n(e)})(),a=Zn(n);if(a.length){let y=a.reduce((h,u)=>Math.max(h,(u.at||0)+(u.ms||0)),0);return a.concat(Ce(s,y))}let l=Kt(t),d=Vn(e,n),b=l>d?l-d:0,_=(n||[]).some(ze);return b>0&&(_||l>=500)?[{name:"ai.chat.round.1",cls:"ai",at:0,ms:b}].concat(Ce(s,b)):s}function Gn(t,e,n){let r=Jt(t,n);if(!r.length)return"";let s=r.reduce((d,b)=>Math.max(d,(b.at||0)+(b.ms||0)),0),a=Math.max(Number(e)||0,s)||1,l='<div class="trace-waterfall">';return r.forEach(d=>{let b=Math.max(0,Math.min(100,(d.at||0)/a*100)),_=Math.max(.5,Math.min(100-b,(d.ms||0)/a*100)),y=d.pipeline?"tw-lab tw-lab-pipeline":"tw-lab",h=(d.ms||0)+" ms"+(d.detail?' <span class="tw-detail">\xB7 '+F(d.detail)+"</span>":"");l+='<div class="'+y+'" title="'+F(d.name)+'">'+F(d.name)+'</div><div class="tw-track"><i class="tw-bar '+F(d.cls||"other")+'" style="left:'+b.toFixed(2)+"%;width:"+_.toFixed(2)+'%"></i></div><div class="tw-dur">'+h+"</div>"}),l+='<div class="tw-legend" style="grid-column:1/-1"><span><i class="sw ai"></i>ai \xB7 external LLM</span><span><i class="sw tool"></i>tool \xB7 zeus / pipeline step</span><span><i class="sw other"></i>other \xB7 dispatch / auth / rate / storage</span></div></div>',l}function Ne(t){t=t||{};let e=t.metrics||{},n=Number(e.total)||0,r=Number(e.aiMs)||0,s=Number(e.zeusMs)||0,a=t.llmRounds&&t.llmRounds.length||t.trace&&t.trace.rounds||0,l=Jt(t.spans||[],t.steps||[]);if(!r||!s){let u=0,T=0;l.forEach(j=>{j&&(j.cls==="ai"&&(u+=j.ms||0),j.cls==="tool"&&(T+=j.ms||0))}),r||(r=u),s||(s=T)}let d=0,b=0;for(let u=0;u<l.length;u++){let T=l[u];if(T&&(!d&&T.cls==="tool"&&(d=T.at||0),T.cls==="ai")){b=T.at||0,d||(d=T.ms||0);break}}let _=n>0?r/n:0,y=n>0?s/n:0;function h(u){return!isFinite(u)||u<0?"\u2014":(Math.round(u*1e3)/10).toFixed(1)+"%"}return[{label:"wall",value:(n|0)+"ms",grade:n>=1e4?"warn":""},{label:"AI share",value:h(_),grade:_>.9&&n>3e3?"warn":"pass"},{label:"API share",value:h(y),grade:""},{label:"TTFT",value:(d|0)+"ms",grade:""},{label:"pre-LLM",value:Math.round(b)+"ms",grade:""},{label:"rounds",value:String(a),grade:a>=4?"fail":a>=3?"warn":"pass"}]}function Qn(t){let e=Ne(t),n='<div class="tab-kpi"><div class="kpi-head">Speed / efficiency KPIs <span class="sub">shares of wall clock</span></div><div class="kpi-grid">';return e.forEach(r=>{n+='<div class="kpi-tile"><span class="kpi-lbl">'+F(r.label)+'</span><span class="kpi-val'+(r.grade?" "+r.grade:"")+'">'+F(r.value)+"</span></div>"}),n+="</div></div>",n}function He(t){let e={},n={},r=(s,a)=>{e[s]=(e[s]||0)+1;let l=a&&a.status;(l===0||typeof l=="number"&&l>=400)&&(n[s]=(n[s]||0)+1)};return(t||[]).forEach(s=>{if(s.type==="tool"){if(s.name==="pipeline"){let a=s.args&&s.args.steps||s.pipeline_json&&s.pipeline_json.steps||[],l={};a.forEach(b=>{b&&(b.name||b.as)&&(l[b.name||b.as]=b)});let d=s.pipeline_step_costs;if(!d||!d.length)try{let b=W(s.result_full||s.result||"{}")||{};d=b.meta&&b.meta.step_costs}catch{d=null}d&&d.length?d.forEach(b=>{let _=b.as||b.name,y=l[_]&&l[_].verb||_;y&&r(y,s)}):a.forEach(b=>{b&&b.verb&&r(b.verb,s)});return}r(s.name||"?",s)}}),{counts:e,errs:n}}function Yn(t,e,n){let{counts:r,errs:s}=He(t),a=Object.keys(r);if(!a.length)return"";let l=n||{v1:[],v2:[]},d=String(e||"v2").toLowerCase()==="v1"?"v1":"v2",b=l[d]||l.v1||[],_=new Set(b),y=b.slice();a.forEach(x=>{_.has(x)||y.push(x)});let h=0;y.forEach(x=>{h=Math.max(h,r[x]||0)});let u=78,T="",j="";return y.forEach(x=>{let L=r[x]||0,A=s[x]||0,M=h>0&&L>0?Math.max(2,Math.round(L/h*u)):0,k=!_.has(x),q=A>0?"b err":k?"b unknown":"b",E=x+" \xB7 "+L+" call"+(L===1?"":"s")+(A>0?" ("+A+" error"+(A===1?"":"s")+")":"")+(k?" \xB7 off-catalog":"");T+='<div class="vbar-col" title="'+F(E)+'"><div class="'+(L>0?"n":"n zero")+'">'+(L>0?L:"")+'</div><div class="'+q+'" style="height:'+M+'px"></div></div>',j+='<div class="'+(L>0?"l":"l zero")+'" title="'+F(x)+'">'+F(x)+"</div>"}),'<div class="trace-vbar mt-3"><h3 class="trace-vbar-title">Tool-call frequency vs. canonical order</h3><div class="vbar-wrap">'+T+'</div><div class="vbar-labels">'+j+'</div><div class="trace-vbar-hint">'+(d==="v2"?"x-axis = Zeus docs/API/V2 verbs (cheap left \u2192 expensive right) \xB7 grey = off-catalog":"x-axis = V1 tools from chat history \xB7 grey = off-catalog")+"</div></div>"}function Oe(t){return{showType:!0,showFoldmarker:!0,showLen:!0,collapsed:!t,maxDepth:1/0}}async function Xn(t,e,n){if(t){t.innerHTML="";try{let r=await xe(),a=new r(e,Oe(!!n)).getElement();a.addEventListener("click",l=>{let d=l.target.closest(".jsv-toggle");if(!d)return;l.stopPropagation();let b=d.closest("li");if(!b)return;let _=[...b.children].find(y=>y.classList&&y.classList.contains("jsv-content"));_&&(l.preventDefault(),l.stopImmediatePropagation(),d.classList.toggle("-rotate-90"),_.classList.toggle("hidden"))},!0),t.appendChild(a)}catch{let r=document.createElement("pre");r.className="trace-pre",r.textContent=Ee(e),t.appendChild(r)}}}function Re(){return{decomposition:null,query_decomposition:null,summary:"",confidence:"",policy_action:"",source:""}}function kt(t){return!!t&&typeof t=="object"&&!Array.isArray(t)}function Ae(t){return kt(t)&&(Array.isArray(t.targets)||t.predicates!=null||t.output!=null)}function tr(t){return kt(t)&&(t.intent!=null||t.entity!=null||t.entity_type!=null||t.geo!=null||t.theme!=null||t.audience!=null)}function U(t,e,n){kt(t)&&(!e.decomposition&&Ae(t.decomposition)&&(e.decomposition=t.decomposition,e.source||(e.source=n)),!e.decomposition&&Ae(t.query_understanding)&&(e.decomposition=t.query_understanding,e.source||(e.source=n)),!e.query_decomposition&&tr(t.query_decomposition)&&(e.query_decomposition=t.query_decomposition,e.source||(e.source=n)),!e.summary&&typeof t.summary=="string"&&t.summary.trim()&&(e.summary=t.summary.trim()),!e.confidence&&typeof t.confidence=="string"&&(e.confidence=t.confidence),!e.policy_action&&typeof t.policy_action=="string"&&(e.policy_action=t.policy_action))}function De(t){return t==null?null:typeof t=="string"?W(t):typeof t=="object"?t:null}function Rt(t,e){if(!t)return;(Array.isArray(t)?t:[t]).forEach(r=>{if(!r||typeof r!="object")return;let s=r.message||r.choices&&r.choices[0]&&r.choices[0].message,a=r.tool_calls||s&&s.tool_calls||[];(Array.isArray(a)?a:[]).forEach(l=>{let d=l&&(l.function||l)||{},b=De(d.arguments!=null?d.arguments:l&&l.arguments);b&&e(b)}),(r.decomposition||r.query_decomposition)&&e(r)})}function Ie(t){let e=Re(),n=t&&t.trace||{},r=t&&t.structured||n.structured||{};return U(n.layer_a,e,"layer_a"),U(t&&t.layer_a,e,"layer_a"),U(n,e,"trace"),U(r.artifacts,e,"artifacts"),U(r.layer_a,e,"layer_a"),(n.steps||[]).forEach(s=>{U(s&&s.args,e,"steps"),U(De(s&&(s.result_full||s.result)),e,"steps")}),(n.hops||t&&t.hops||[]).forEach(s=>{U(s&&(s.req||s.args||s.request),e,"hops"),U(s&&(s.res||s.result||s.body||s.response),e,"hops")}),Rt([].concat(n.ai_requests||[],n.ai_responses||[]),s=>U(s,e,"llm")),(t&&t.llmRounds?t.llmRounds:[]).forEach(s=>{Rt(s&&s.req,a=>U(a,e,"llm")),Rt(s&&s.res,a=>U(a,e,"llm"))}),e}function ht(t,e){return'<span class="tt-decomp-chip">'+e(String(t))+"</span>"}function er(t,e){let n=e||F;if(t=t||Re(),!t.decomposition&&!t.query_decomposition)return'<div class="tt-decomp empty">No decomposition on this turn.</div>';let r=t.decomposition||{},s=t.query_decomposition||{},a=Array.isArray(r.targets)?r.targets:[],l=r.predicates,d=r.output!=null?String(r.output):"",b="";t.confidence&&(b+='<span class="tt-badge info">confidence:'+n(t.confidence)+"</span>"),d&&(b+='<span class="tt-badge">output:'+n(d)+"</span>"),t.policy_action&&(b+='<span class="tt-badge">'+n(t.policy_action)+"</span>");let _=[];s.intent!=null&&_.push(ht(s.intent,n)),["entity","entity_type","geo","audience","theme","occasion","price"].forEach(x=>{s[x]!=null&&s[x]!==""&&_.push('<span class="tt-decomp-kv"><span class="k">'+n(x)+"</span> "+n(String(s[x]))+"</span>")});let y=_.length?'<div class="tt-decomp-row"><div class="lab">Query</div><div class="val">'+_.join("")+"</div></div>":"",h=a.map(x=>{if(!x||typeof x!="object")return"";let L=x.entity_type||x.entity||"?",A=x.focus||x.fields||[],M=Array.isArray(A)?A.map(k=>ht(k,n)).join(""):"";return'<div class="tt-decomp-row"><div class="lab">Target</div><div class="val"><strong>'+n(String(L))+"</strong> "+M+"</div></div>"}).join(""),u="";Array.isArray(l)?u=l.map(x=>{if(!x||typeof x!="object")return ht(x,n);let L=x.field||x.path||"",A=x.op||"=",M=x.value!=null?x.value:"";return'<span class="tt-decomp-kv"><span class="k">'+n(String(L))+"</span> "+n(String(A))+" "+n(String(M))+"</span>"}).join(""):kt(l)&&(u=Object.keys(l).map(x=>'<span class="tt-decomp-kv"><span class="k">'+n(x)+"</span> = "+n(String(l[x]))+"</span>").join(""));let T=u?'<div class="tt-decomp-row"><div class="lab">Where</div><div class="val">'+u+"</div></div>":"",j=d?'<div class="tt-decomp-row"><div class="lab">Output</div><div class="val">'+ht(d,n)+"</div></div>":"";return'<div class="tt-decomp"><header><span>Decomposition</span><span class="tt-decomp-badges">'+b+'</span><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-decomp-copy" data-copy-from="tt-decomp-json" title="Click to copy">Copy</button></header><pre id="tt-decomp-json" hidden></pre>'+(t.summary?'<p class="tt-decomp-summary">'+n(t.summary)+"</p>":"")+y+h+T+j+"</div>"}function St(t,e){t=t&&typeof t=="object"?t:{},e=e&&typeof e=="object"?e:{};let n=t.session&&typeof t.session=="object"?t.session:{},r=t.detective&&typeof t.detective=="object"?t.detective:{},s=t.inject&&typeof t.inject=="object"?t.inject:r.prompt&&r.prompt.inject&&typeof r.prompt.inject=="object"?r.prompt.inject:{},a=t.catalog&&typeof t.catalog=="object"?t.catalog:{},l=t.target&&typeof t.target=="object"?t.target:{},d=t.layer_a&&typeof t.layer_a=="object"?t.layer_a:{},b=Array.isArray(t.hops)?t.hops:[],_=t.chat_id||n.chat_id||e.chat_id||"\u2014",y=t.turn_id||n.turn_id||"\u2014",h=t.session_id||n.id||n.session_id||e.session_id||"\u2014",u=t.preferred_req_id||n.preferred_req_id||"\u2014",T=Array.isArray(t.req_ids)?t.req_ids:Array.isArray(n.req_ids)?n.req_ids:b.map(R=>R&&(R.req_id||"")).filter(Boolean),j=b.map(R=>{let bt=R&&(R.name||R.verb||R.path_class)||"?",Y=R&&R.status!=null?R.status:"",Ct=R&&R.error?" err":"";return bt+(Y!==""?":"+Y:"")+Ct}),x=l.bucket||"\u2014",L=l.scope||"\u2014",A=l.collection||"\u2014",M=l.mode||e.mode||"\u2014",k=t.zeus_url||"\u2014",q=t.client_version||"\u2014",E=a.tools_count!=null?a.tools_count:"\u2014",P=t.contract_status||n.contract_status||e.contract_status||"\u2014",O=s.brief_sha12||a.brief_sha12||"\u2014",N=s.mini_sha12||a.mini_sha12||"\u2014",J=d.via||"\u2014",S=d.confidence||"\u2014",B=d.policy_action||"\u2014",H=t.tokens&&typeof t.tokens=="object"?t.tokens:{},Q=t.export_ref||t.turn_id||"\u2014";return[{id:"ids",label:"1. Ids",value:"chat "+_+" \xB7 turn "+y+" \xB7 sess "+h},{id:"hops",label:"2. Hops",value:"preferred "+u+(T.length?" \xB7 "+T.join(", "):"")+(j.length?" \xB7 "+j.join(" \xB7 "):"")},{id:"target",label:"3. Target",value:k+" \xB7 "+x+"/"+L+"/"+A+" \xB7 "+M+" \xB7 client "+q},{id:"catalog",label:"4. Catalog",value:"brief="+(a.has_scope_brief===!0?"yes":a.has_scope_brief===!1?"no":"\u2014")+" \xB7 mini="+(a.has_mini_schema===!0?"yes":a.has_mini_schema===!1?"no":"\u2014")+" \xB7 tools="+E+" \xB7 contract="+P},{id:"inject",label:"5. Inject",value:"brief_sha "+O+" \xB7 mini_sha "+N},{id:"hoperr",label:"6. Hop table",value:j.length?j.join(" \xB7 "):"(no hops)"},{id:"layer",label:"7. Layer A",value:"via="+J+" \xB7 conf="+S+" \xB7 policy="+B},{id:"tokens",label:"8. Tokens",value:(H.prompt!=null?H.prompt:"?")+" / "+(H.completion!=null?H.completion:"?")+" / "+(H.total!=null?H.total:rt(H)||"?")+(H.ok===!1?" \xB7 ok=false":"")},{id:"export",label:"9. Journal",value:String(Q)}]}function nr(t,e){let n=t&&typeof t=="object"?t:{},r=e&&typeof e=="object"?e:{};if(n.multi_agent===!0||r.multi_agent===!0)return!0;let s=n.engine||r.engine||"";if(s==="local_units"||s==="sidecar")return!0;let a=n.units||n.unit_summaries||r.units;return Array.isArray(a)&&a.length>0}function rr(t,e){let n=t&&typeof t=="object"?t:{},r=e&&typeof e=="object"?e:{},s=n.units||n.unit_summaries||r.units||[];return Array.isArray(s)?s.map((a,l)=>{let d=a&&typeof a=="object"?a:{},b=Array.isArray(d.req_ids)?d.req_ids.filter(Boolean).map(String):[],_=Array.isArray(d.hops)?d.hops.map(u=>{let T=u&&typeof u=="object"?u:{},j=ut(T);return j!=null&&T.bytes==null?Object.assign({},T,{bytes:j}):T}):b.map((u,T)=>({req_id:u,verb:d.kind==="zeus_direct"?"find":"unit",status:d.status==="error"||d.status==="err"?500:200,ms:d.ms||0,bytes:null,preferred:T===0,req:d.call||{},res:{}})),y=String(d.status||"ok"),h=y==="error"||y==="err"||!!d.error_code;return{unit_id:String(d.unit_id||"u"+(l+1)),status:h?"err":y==="partial"||y==="warn"?"warn":"ok",kind:d.kind||"agent_turn",goal:d.goal||"",stuffed_goal:d.stuffed_goal||"",synth:!!d.synth,wave:Number(d.wave)||(d.synth?2:1),catalog_mode:d.catalog_mode||"",has_inject:!!d.has_inject,answer:d.answer||"",req_ids:b,error_code:d.error_code||"",hops:_,llm:Array.isArray(d.llm)?d.llm:Array.isArray(d.llmRounds)?d.llmRounds:[]}}):[]}function dt(t){return t&&typeof t=="object"?t:typeof t=="string"?W(t):null}function at(t){let e=t&&t.detective&&typeof t.detective=="object"?t.detective:{};return e.diagnosis&&typeof e.diagnosis=="object"?e.diagnosis:e}function pt(t){if(!t||typeof t!="object")return null;let e=[t.url,t.path,t.path_class,t.verb],n=dt(t.req)||{};e.push(n.path,n.url,n.method&&n.path?n.method+" "+n.path:"");for(let r=0;r<e.length;r++){let a=String(e[r]||"").match(/\/v2\/([^/]+)\/([^/]+)\/([^/]+)\/([^/?#]+)/);if(a)return{bucket:a[1],scope:a[2],collection:a[3],verb:a[4],path:"/v2/"+a[1]+"/"+a[2]+"/"+a[3]+"/"+a[4],method:String(n.method||t.method||"POST")}}return null}function Vt(t){t=t||{};let e=at(t),n=String(e.request_kind||"").toLowerCase();return n==="http_api"?!0:n==="chat_turn"||(t.llmRounds||[]).length?!1:!!(t.hops||[]).some(pt)}function Zt(t){t=t||{};let e=t.hops||[],n=null,r=null;for(let b=0;b<e.length;b++){let _=pt(e[b]);if(_&&(n=_,r=e[b],e[b].preferred))break}if(!n)return{isDirect:Vt(t)};let s=dt(r.res)||dt(r.body)||{},a=Array.isArray(s.items)?s.items:null,l=s.returned_count!=null?Number(s.returned_count):a?a.length:null,d=a==null&&s.status!=null&&l==null;return{isDirect:!0,verb:n.verb,path:n.path,method:n.method,collection:n.collection,bucket:n.bucket,scope:n.scope,status:r.status!=null?r.status:s.status,bytes:r.bytes,ms:r.ms,args:dt(r.req)||{},output:{status:s.status,returned:l,itemsN:a?a.length:null,slim:d||a==null&&s.status!=null,truncated:s.truncated,scored:s.scored}}}function Wt(t){if(!t)return[];let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=t.playbooks||e.playbooks||[];return Array.isArray(n)?n.map((r,s)=>typeof r=="string"?{id:r,title:r,summary:r,severity:"info",actions:[]}:{id:r.id||r.name||"pb_"+(s+1),title:r.title||r.name||r.id||"Playbook",summary:z(r.summary)||z(r.body)||z(r.tip)||z(r.message)||z(r.description),severity:I(r.severity)||"warn",actions:Array.isArray(r.actions)?r.actions.map(a=>String(a)):[]}):[]}function Pe(t){t=t||{};let e=at(t),r=["prompt_grade","speed_grade","error_grade","output_grade","pipeline_grade"].map(b=>I(e[b])).filter(b=>b==="warn"||b==="fail"),s=Array.isArray(t.promptChecks)?t.promptChecks:ot(t.detective),a=st(s),l=(t.hops||[]).filter(b=>(Number(b.status)||0)>=400).length,d=a.total?a.tone==="ok"?a.passed+"/"+a.total:String(a.total-a.passed):"";return[{id:"overview",label:"Overview",enabled:!0},{id:"diagnosis",label:"Diagnosis",enabled:!0,pill:r.length?String(r.length):"",pillKind:r.length?"warn":""},{id:"prompt",label:"Prompt",enabled:!0,pill:d,pillKind:a.total?a.tone==="ok"?"ok":"err":""},{id:"timeline",label:"Timeline",enabled:!0},{id:"tools",label:"Tools",enabled:!0,pill:String(l||(t.hops||[]).length||0),pillKind:l?"err":""},{id:"session",label:"Session",enabled:!0},{id:"raw",label:"Raw",enabled:!0}]}function Be(t){if(!t)return!1;if(t.status&&t.status!=="ok")return!0;let e=I(t.grade);if(e==="warn"||e==="fail"||t.errCount>0)return!0;let n=at(t);if(["prompt_grade","speed_grade","error_grade","output_grade","pipeline_grade"].some(a=>{let l=I(n[a]);return l==="warn"||l==="fail"}))return!0;let s=t.playbooks||Wt(t.detective);return Array.isArray(s)&&s.length>0}function Pt(t){return Be(t)?"diagnosis":"overview"}function or(t,e){let n=Pe(t),r=e||Pt(t),s=n.find(a=>a.id===r&&a.enabled);return{tabs:n,current:s?r:Pt(t)}}function nt(t){if(t==null)return"";let e=String(t).trim();return!e||e==="\u2014"||e==="-"||e==="undefined"||e==="null"?"":e}function Ue(t){t=t||{};let e=t.trace||{},n=t.detective||{},r=n.overview&&typeof n.overview=="object"?n.overview:{},s=(r.target&&typeof r.target=="object"?r.target:null)||(e.target&&typeof e.target=="object"?e.target:{})||{},a=e.session&&typeof e.session=="object"?e.session:{},l=at(t),d=(n.prompt&&typeof n.prompt=="object"?n.prompt:{})||{},b=l.prompt&&typeof l.prompt=="object"?l.prompt:{},_=t.hops||[],y=nt(t.preferred_req_id||r.preferred_req_id),h=[];function u(M,k){let q=nt(k);q&&h.push({key:M,value:q})}u("req_id",y);let T=r.total_ms!=null?r.total_ms:t.metrics&&t.metrics.total!=null?t.metrics.total:l.slow&&(l.slow.wall_ms||l.slow.total_ms);T&&u("duration",vt(T)),u("scope",s.scope||[s.bucket,s.scope].filter(Boolean).join("/"));let j=[s.bucket,s.scope,s.collection].filter(Boolean).join("/");u("target",j);let x=b.chat_request_base_id||d.base_id||d.lineage||"",L=b.custom_label||b.chat_request_custom_id||"";(nt(x)||nt(L))&&u("lineage",(nt(x)||"\u2014")+" \xB7 "+(nt(L)||"custom \u2014")),u("mode",s.mode||t.mode),u("session_id",t.session_id||a.id||a.session_id||e.session_id),u("chat_id",e.chat_id||a.chat_id||t.chat_id||r.chat_id),u("turn_id",t.turn_id||e.turn_id||a.turn_id||r.turn_id),u("contract",t.contract_status||e.contract_status||a.contract_status);let A=_.find(M=>pt(M))||_[0];if(A){let M=pt(A),k=(M?A.req&&A.req.method||"POST":"")+(M?" "+M.path:A.verb?" "+A.verb:"")+(A.status!=null?"  "+A.status:"")+(A.bytes!=null?"  "+Ut(A.bytes):"");u("edge",k.trim())}return h}function Fe(t){t=t||{};let e=t.trace||{},n=t.detective||{},r=n.overview&&typeof n.overview=="object"?n.overview:{},s=(r.tokens&&typeof r.tokens=="object"?r.tokens:null)||(e.tokens&&typeof e.tokens=="object"?e.tokens:{})||{},a=[];function l(j,x,L){L==null||L===""||a.push({id:j,label:x,value:String(L)})}!(s.ok===!1||s.prompt==null&&s.total==null)&&s.prompt!=null&&l("token_in","Token IN",Number(s.prompt).toLocaleString()),s.completion!=null&&l("token_out","Token OUT",Number(s.completion).toLocaleString()),s.total!=null&&l("token_total","TOTAL",Number(s.total).toLocaleString());let b=r.rounds!=null?r.rounds:(t.llmRounds||[]).length;b&&l("rounds","LLM rounds",String(b));let _=(t.hops||[]).length||r.hop_count;_&&l("tools","Tool calls",String(_));let y=0,h=!1;(t.hops||[]).forEach(j=>{let x=dt(j.res)||{};x.returned_count!=null?(h=!0,y+=Number(x.returned_count)||0):Array.isArray(x.rows)?(h=!0,y+=x.rows.length):Array.isArray(x.items)&&(h=!0,y+=x.items.length)}),h&&l("records","Records",y.toLocaleString());let u=0;(t.hops||[]).forEach(j=>{typeof j.bytes=="number"&&(u+=j.bytes)}),u&&l("zeus_data","Zeus data",Ut(u));let T=r.total_ms!=null?r.total_ms:t.metrics&&t.metrics.total;return T&&l("wall","Total time",vt(T)),a}function sr(t){let e=Fe(t).slice(),n={};e.forEach(a=>{n[a.id]=!0});function r(a,l,d){n[a]||d==null||d===""||(n[a]=!0,e.push({id:a,label:l,value:String(d)}))}let s=Zt(t);if(s&&s.isDirect)s.status!=null&&r("http","HTTP",s.status),s.output&&s.output.returned!=null&&!n.records&&r("returned","Returned",Number(s.output.returned).toLocaleString());else{let a=t&&t.hops?t.hops:[],l=a.find(d=>d&&d.preferred)||a[0];l&&l.status!=null&&r("http","HTTP",l.status)}return e}function Je(t){t=t||{};let e=at(t),n=e.slow&&typeof e.slow=="object"?e.slow:{};if(Array.isArray(n.top)&&n.top.length)return n.top.slice(0,5).map((a,l)=>({rank:a.rank||l+1,label:a.label||a.name||"span",ms:a.ms,share_pct:a.share_pct,why:a.why||"",kind:a.kind||""}));let r=[];(t.spans||[]).forEach(a=>{a&&Number(a.ms)>0&&r.push({label:a.name||a.phase||"span",ms:Number(a.ms),kind:a.cls||"span"})}),r.length||(t.hops||[]).forEach(a=>{a&&Number(a.ms)>0&&r.push({label:a.verb||a.name||"hop",ms:Number(a.ms),kind:"hop"})}),r.sort((a,l)=>l.ms-a.ms);let s=Number(n.wall_ms||n.total_ms||t.metrics&&t.metrics.total||0);return r.slice(0,3).map((a,l)=>({rank:l+1,label:a.label,ms:a.ms,share_pct:s?Math.round(a.ms/s*100):void 0,why:"",kind:a.kind}))}function Ke(t){t=t||{};let e=t.trace||{},n=(e.layer_a&&typeof e.layer_a=="object"?e.layer_a:{})||{},r=Ie({trace:e,hops:t.hops,llmRounds:t.llmRounds,layer_a:n});return{via:z(n.via),confidence:z(n.confidence||r.confidence),policy_action:z(n.policy_action||r.policy_action),summary:z(n.summary||r.summary),has_summary:!!(n.summary||r.summary),has_query_decomposition:!!r.query_decomposition,has_decomposition:!!r.decomposition,has_confidence:!!(n.confidence||r.confidence),has_terminate:!!(n.via||n.summary||r.summary),terminate_via:z(n.via),intent:r.query_decomposition&&r.query_decomposition.intent||z(n.intent),query_decomposition:r.query_decomposition,decomposition:r.decomposition}}function ar(t){t=t||{};let e=t.detective||{},n=at(t),r=Vt(t),s=Zt(t),a=Ke(t),l=(n.prompt&&typeof n.prompt=="object"?n.prompt:{})||(e.prompt&&typeof e.prompt=="object"?e.prompt:{}),d=n.slow&&typeof n.slow=="object"?n.slow:{},b=n.errors&&typeof n.errors=="object"?n.errors:{},_=n.output&&typeof n.output=="object"?n.output:{},y=n.pipeline&&typeof n.pipeline=="object"?n.pipeline:{},h=t.hops||[],u=h.filter(S=>(Number(S.status)||0)>=400),T=Array.isArray(b.items)&&b.items.length?b.items:u.map(S=>({where:"hop",name:S.verb||S.name||"",message:S.error||"HTTP "+S.status,ms:S.ms})),j=b.count!=null?Number(b.count):T.length,x=h.find(S=>String(S.verb||S.name||"").toLowerCase()==="pipeline"),L=x&&Array.isArray(x.step_costs)?x.step_costs:[],A=!!(y.present||x),M=[["prompt",n.prompt_grade||t.prompt_grade],["speed",n.speed_grade],["errors",n.error_grade],["output",n.output_grade],["pipeline",n.pipeline_grade]].map(S=>({id:S[0],value:I(S[1])||String(S[1]||""),cls:I(S[1])})).filter(S=>S.cls||S.value),k=[],q=[];if(r)q.push("zeus_client V2 Direct \u2014 chat framing N/A"),s.path&&q.push((s.method||"POST")+" "+s.path);else{q.push("Checklist: "+(l.verdict||l.checklist_verdict||t.prompt_grade||"?")),(l.chat_request_base_id||l.custom_label)&&q.push("Lineage: "+(l.chat_request_base_id||"\u2014")+" \xB7 "+(l.custom_label||"\u2014"));let S=e.overview&&e.overview.catalog_flags||{},B=l.has_scope_brief!=null?l.has_scope_brief:S.has_scope_brief,H=l.has_mini_schema!=null?l.has_mini_schema:S.has_mini_schema;q.push("SCOPE BRIEF: "+(B?"yes":"no")+" \xB7 MINI-SCHEMA: "+(H?"yes":"no"));let Q=l.tool_count!=null?l.tool_count:(t.hops||[]).length;q.push("Tools on wire: "+Q+(l.has_return_verb?" \xB7 return yes":"")+(l.has_pipeline_verb?" \xB7 pipeline yes":""))}k.push({n:1,title:"1. Good prompt / contract?",grade:r?"skip":I(n.prompt_grade||t.prompt_grade)||"na",items:q,jump:"prompt"});let E=Je(t),P=d.wall_ms||d.total_ms||t.metrics&&t.metrics.total||0,O=E.map(S=>S.label+" "+S.ms+"ms");k.push({n:2,title:"2. What took longest?",grade:I(n.speed_grade||d.grade)||"na",muted:"wall "+P+"ms"+(d.ai_ms_total!=null?" \xB7 ai "+Math.round(d.ai_ms_total)+"ms":"")+(d.api_ms_total!=null?" \xB7 api "+Math.round(d.api_ms_total)+"ms":""),items:O}),k.push({n:3,title:"3. Errors?",grade:j?"fail":I(n.error_grade)||"pass",items:T.map(S=>"["+(S.where||"")+"] "+(S.name||"")+": "+(S.message||"")),muted:j?"":"No tool / vector / FTS errors recorded."});let N={n:4,title:"4. Output schema followed?",grade:r?"skip":I(n.output_grade||_.grade)||"na",items:[],muted:""};r&&s.isDirect?(N.items.push("zeus_client V2 Direct \xB7 "+(s.verb||"")+" "+(s.collection||"")),s.output&&N.items.push("V2 envelope \xB7 "+(s.output.slim?"slim keep (items[] omitted)":"body retained")+(s.output.returned!=null?" \xB7 returned_count "+s.output.returned:"")),N.muted="Layer A terminate N/A. zeus_client output is the V2 JSON body."):(N.items.push("Terminate: "+(a.has_terminate?"yes via "+(a.terminate_via||""):"no")),N.items.push("summary: "+(a.has_summary?"yes":"no")+" \xB7 query_decomposition: "+(a.has_query_decomposition?"yes":"no")+" \xB7 decomposition: "+(a.has_decomposition?"yes":"no")+" \xB7 confidence: "+(a.has_confidence?"yes":"no")),a.summary&&(N.muted="summary: "+a.summary)),k.push(N);let J={n:5,title:"5. Pipeline / MASQ?",grade:I(n.pipeline_grade||y.grade)||(A?"pass":"na"),items:[],muted:A?y.logic||y.masq_note||"":"No pipeline call this turn. (MASQ budgets multi-verb plans best via pipeline.)"};return A?(Array.isArray(y.steps)&&y.steps.length?y.steps:L).forEach(B=>{let H=B&&(B.name||B.verb||B.as)||"";H&&J.items.push(String(H)+(B.verb&&B.name?" \u2192 "+B.verb:""))}):r&&s.verb&&s.verb!=="pipeline"&&(J.muted="Single V2 verb "+s.verb+" (not a pipeline). MASQ multi-verb plans go through pipeline."),k.push(J),{headline:z(n.headline)||z(t.headline)||"Diagnosis",request_kind:r?"http_api":String(n.request_kind||"chat_turn"),request_kind_label:r?n.request_kind_label||"HTTP API":n.request_kind_label||"Chat turn",grades:M,slowTop:E,cards:k,playbooks:Wt(e),isDirect:r}}function ir(t){t=t||{};let e=t.detective||{},n=e.prompt&&typeof e.prompt=="object"?e.prompt:{},r=Array.isArray(t.promptChecks)?t.promptChecks.map(Dt):ot(e),s=st(r),a=I(n.verdict||t.prompt_grade)||(s.tone==="err"?"fail":s.total?"pass":"skip"),l=r.filter(Dn).map(In);return{verdict:a,summary:z(n.summary)||s.label,rounds:n.rounds||(t.llmRounds||[]).length||0,checks:r,tiles:l,checkSummary:s}}function lr(t){t=t||{};let n=Ue(t).filter(s=>["req_id","session_id","chat_id","turn_id","contract","scope","mode"].includes(s.key)),r=(t.hops||[]).map(s=>({req_id:s.req_id||"",verb:s.verb||"",status:s.status,preferred:!!s.preferred}));return{kv:n,hops:r}}var We=["wish_i_knew","jail_break_attempt","hooks_jailbreak_score"],cr=["chat_id","turn_id","session_id","req_ids","zeus_url","client_version","target","catalog","contract_status","tokens","export_ref","stamp"];function $t(t){if(!t||typeof t!="object")return t;if(Array.isArray(t))return t.map($t);let e={};return Object.keys(t).forEach(n=>{We.includes(n)||(e[n]=$t(t[n]))}),e}function Ve(t){if(!t||typeof t!="object"||Array.isArray(t))return t;let e={...t};return We.forEach(n=>{delete e[n]}),Array.isArray(e.business_rules_triggers)&&delete e.business_rules_triggers,e}function dr(t){if(!t||typeof t!="object")return{};let e={...t.public_trace&&typeof t.public_trace=="object"?t.public_trace:{}};if(t.detective!=null&&(e.detective=t.detective),t.preferred_req_id){e.preferred_req_id=t.preferred_req_id;let n=e.session&&typeof e.session=="object"?{...e.session}:{};n.preferred_req_id=t.preferred_req_id,e.session=n}if(t.hops!=null&&!e.hops)try{e.hops=Array.from(t.hops)}catch{e.hops=t.hops}if(t.notes!=null&&!e.notes)try{e.notes=Array.from(t.notes)}catch{e.notes=t.notes}return cr.forEach(n=>{t[n]!=null&&e[n]==null&&(e[n]=t[n])}),t.rounds!=null&&e.rounds==null&&(e.rounds=t.rounds),e}function jt(t){if(!t||typeof t!="object")return null;let e=t;if(!e.trace&&e.debug&&(e={...e,trace:dr(e.debug)}),!e.trace||typeof e.trace!="object")return null;let n=$t({...e.trace});return n.layer_a&&(n.layer_a=Ve(n.layer_a)),e.layer_a&&(e={...e,layer_a:Ve(e.layer_a)}),n.question==null&&e.question,{...e,trace:n}}function pr(t){if(!t||typeof t!="object")return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=String(e.grade||t.diagnosis_grade||e.status||t.grade||"").toLowerCase();if(["fail","error","err","failed"].includes(n))return"fail";if(["warn","warning"].includes(n))return"warn";if(["pass","ok","healthy","clear"].includes(n))return"pass";let r=t.playbooks||e.playbooks||[];return Array.isArray(r)&&r.length?"warn":"pass"}function ur(t){if(!t||typeof t!="object")return"";let e=t.prompt||t.prompt_check||{};return String(t.prompt_grade||e.grade||(e.ok===!1?"warn":e.ok?"pass":"")).toLowerCase()}function fr(t){if(!t)return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=e.headline||t.headline||e.summary||t.summary||e.title||"";return z?z(n):typeof n=="string"?n:""}function br(t){if(yt)return yt(t)||"";if(!t)return"";let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=e.overview||t.overview||e.detail||t.detail||"";return typeof n=="string"?n:""}function mr(t){if(!t)return[];let e=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,n=t.playbooks||e.playbooks||[];return Array.isArray(n)?n.map((r,s)=>typeof r=="string"?{id:r,title:r,body:r,tip:r}:{id:r.id||r.name||"pb_"+(s+1),title:r.title||r.name||r.id||"Playbook",body:r.body||r.tip||r.message||r.description||"",tip:r.tip||r.body||""}):[]}function hr(t,e){return t&&t.req!=null?t.req:t&&t.request!=null?t.request:t&&t.args!=null?t.args:e&&e.args!=null?e.args:e&&e.pipeline_json!=null?e.pipeline_json:{}}function gr(t,e){if(t&&t.res!=null)return t.res;if(t&&t.response!=null)return t.response;if(t&&t.result_json!=null)return t.result_json;if(t&&t.result!=null)return t.result;if(t&&t.body!=null)return t.body;if(e){let n=W(e.result_full||e.result);if(n)return n;if(e.result!=null)return{preview:String(e.result).slice(0,2e3)}}if(t&&t.snippet){let n=W(t.snippet);if(n)return n}return{}}function Ze(t,e,n){return ut?ut(t,e,n):t&&t.bytes!=null?t.bytes:t&&t.byte_size!=null?t.byte_size:e&&e.bytes!=null?e.bytes:null}function yr(t,e,n){let r=(e||[]).filter(s=>s&&s.type==="tool");return Array.isArray(t.hops)&&t.hops.length?t.hops.map((s,a)=>{let l=xt?xt(r,s,a):null,d=hr(s,l),b=gr(s,l);return{req_id:s.req_id||s.id||"",verb:s.verb||s.name||s.tool||"?",status:s.status!=null?s.status:s.http_status!=null?s.http_status:0,ms:s.ms!=null?s.ms:s.duration_ms!=null?s.duration_ms:0,bytes:Ze(s,l,b),preferred:!!(s.preferred||n&&(s.req_id===n||s.id===n)),req:d,res:b,snippet:s.snippet||"",step_costs:Array.isArray(s.step_costs)?s.step_costs:null,body:s.body!=null?s.body:null,url:s.url||"",error:s.error||"",path_class:s.path_class||s.name||s.verb||""}}):r.map(s=>{let l=W(s.result_full||s.result)||(s.result!=null?{preview:String(s.result).slice(0,2e3)}:{});return{req_id:s.req_id||"",verb:s.name||"?",status:s.status!=null?s.status:0,ms:s.ms||0,bytes:Ze(s,null,l),preferred:!!(n&&s.req_id===n),req:s.args||s.pipeline_json||{},res:l}})}function vr(t,e){let n=t.ai_requests||[],r=t.ai_responses||[],s=Math.max(n.length,r.length);return s?Array.from({length:s},(a,l)=>({round:l+1,call:l+1,kind:"llm",label:"Round "+(l+1),finish:r[l]&&(r[l].finish_reason||r[l].finish)||"",tok_in:n[l]&&n[l].usage&&n[l].usage.prompt_tokens||r[l]&&r[l].usage&&r[l].usage.prompt_tokens,tok_out:r[l]&&r[l].usage&&r[l].usage.completion_tokens,tok_total:r[l]&&r[l].usage&&r[l].usage.total_tokens||n[l]&&n[l].usage&&n[l].usage.total_tokens,req:n[l]||{},res:r[l]||{}})):(e||[]).filter(a=>a&&(a.type==="llm"||a.type==="llm_error"||a.type==="force_final")).map((a,l)=>{let d=a.type||"llm",b=d==="force_final",_=d==="llm_error",y=a.round!=null?a.round:l+1;return{round:y,call:l+1,kind:d,label:b?"force_final":"Round "+y,finish:b?a.cause||a.finish_reason||"force_final":a.finish_reason||(_?"error":""),tok_in:a.usage&&a.usage.prompt_tokens,tok_out:a.usage&&a.usage.completion_tokens,tok_total:a.usage&&a.usage.total_tokens,req:b?{type:"force_final",cause:a.cause,content_len:a.content_len,ms:a.ms,model:a.model}:{tool_calls:a.tool_calls,ms:a.ms,model:a.model},res:_?{error:a.detail}:b?{type:"force_final",cause:a.cause,content_len:a.content_len,finish_reason:a.finish_reason,usage:a.usage}:{tool_calls:a.tool_calls,finish_reason:a.finish_reason,usage:a.usage}}})}function xr(t,e){return t&&t.created!=null?"c:"+t.created+":"+e:t&&t.trace&&t.trace.turn_id?"t:"+t.trace.turn_id:"i:"+e}function _r(t,e){let n={...e},r=t.tokens&&typeof t.tokens=="object"?t.tokens:null;if(r)n.tokensIn=Number(r.prompt)||0,n.tokensOut=Number(r.completion)||0,n.tokensCached=Number(r.cached)||0,n.hasIn=r.prompt!=null,n.hasOut=r.completion!=null,n.hasTokens=!!(r.ok||r.total!=null||r.prompt!=null||r.completion!=null),r.total!=null&&(n.tokens=Number(r.total)||n.tokens);else{let s=0,a=0,l=!1,d=!1;(t.steps||[]).forEach(b=>{let _=b&&b.usage;_&&(_.prompt_tokens!=null&&(s+=Number(_.prompt_tokens)||0,l=!0),_.completion_tokens!=null&&(a+=Number(_.completion_tokens)||0,d=!0))}),n.tokensIn=s,n.tokensOut=a,n.tokensCached=0,n.hasIn=l,n.hasOut=d,n.hasTokens=n.tokens>0||l||d}return n}function wr(t){return(Array.isArray(t.notes)?t.notes:[]).map(String).filter(n=>n.startsWith("semantic_cache."))}function Gt(t,e){let n=jt(t)||t||{},r=n.trace||{},s=Array.isArray(r.steps)?r.steps:[],a=r.session&&typeof r.session=="object"?r.session:{},l=n.session_id||r.session_id||a.id||a.session_id||"",d=r.preferred_req_id||a.preferred_req_id||n.preferred_req_id||"",b=r.detective&&typeof r.detective=="object"?r.detective:null,_=Ft(r)||{total:0,aiMs:0,zeusMs:0,other:0,tokens:0,bytes:0},y=_r(r,_),h=yr(r,s,d),u=Array.isArray(r.hops)&&r.hops.length?r.hops:h,T=_t?_t(s,u):s,j=h.filter(E=>(Number(E.status)||0)>=400).length,x=pr(b),L=ot?ot(b):[],A="ok";n.session_error||x==="fail"?A="err":(j||x==="warn")&&(A="warn"),n.session_error&&(A="err");let M=r.catalog&&typeof r.catalog=="object"?r.catalog:{},k=r.inject&&typeof r.inject=="object"?r.inject:{},q=r.stamp&&typeof r.stamp=="object"?r.stamp:{};return{key:xr(n,e),index:e,question:n.question||r.question||"(loaded turn)",answer:n.answer||r.answer||"",status:A,api_version:n.api_version||r.api_version||"v2",mode:n.mode||M&&M.source||r.target&&r.target.mode||"",target:typeof n.target=="string"?n.target:r.target&&typeof r.target=="object"?[r.target.bucket,r.target.scope,r.target.collection].filter(Boolean).join("/"):typeof r.target=="string"?r.target:"",provider:n.provider||"",model:n.model||"",session_id:l,session_round:n.session_round!=null?n.session_round:a.round!=null?a.round:null,contract_status:n.contract_status||a.contract_status||r.contract_status||"",preferred_req_id:d,turn_id:r.turn_id||a.turn_id||"",metrics:y,spans:wt?wt(r,h,T):Array.isArray(r.spans)?r.spans:[],steps:T,hops:h,llmRounds:vr(r,T),detective:b,grade:x,prompt_grade:ur(b),headline:fr(b),overview:br(b),playbooks:mr(b),promptChecks:L,checkSummary:st?st(L):{passed:0,total:0,label:"",tone:""},gather:St?St(r,n):[],toolsCount:h.length,errCount:j,session_error:n.session_error||a.error||r.session_error||"",catalog:M,inject:k,stamp:q,semanticCache:wr(r),layer_a:r.layer_a||n.layer_a||null,raw:n,trace:r}}var w=()=>Tt,G=12;function $e(t){if(!t)throw new Error("createTracePanel requires a root element");let e={getClientVersion:()=>"",getHubBase:()=>"",getChatId:()=>null,getChartOrder:()=>({v1:[],v2:[]}),showToast:o=>console.log(o)},n=[],r=null,s="overview",a=0,l=0,d=null,b=!1,_=!1,y=0;function h(o){return t.querySelector("#"+o)}function u(o){return(w().escapeHtml||(i=>String(i)))(o)}let T={external:"M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",star:"M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",check:"M4.5 12.75 9 17.25 19.5 6.75",clipboard:"M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"};function j(o,i){let c=T[o];return c?'<span class="inline-block '+(i||"w-4 h-4")+' shrink-0" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="'+c+'" /></svg></span>':""}function x(o){let i=String(o||"").toLowerCase(),c="badge-ghost";return i==="ok"||i==="pass"?c="badge-success":i==="warn"?c="badge-warning":i==="err"||i==="fail"||i==="error"||i==="bad"?c="badge-error":i==="info"&&(c="badge-info"),"badge badge-sm "+c}function L(o,i){return o?'<button type="button" class="btn btn-ghost btn-xs font-mono tt-id" data-copy="'+u(o)+'" title="Click to copy">'+u(O(o,i||14))+"</button>":""}function A(o){if(!o)return"";let i=u(o);return'<span class="tt-copy-id inline-flex items-center gap-1 whitespace-nowrap"><span class="tt-copy-id-val">'+i+'</span><button type="button" class="btn btn-ghost btn-xs btn-square shrink-0 min-h-0 h-5 w-5 p-0" data-copy="'+i+'" title="Copy '+i+'" aria-label="Copy '+i+'">'+j("clipboard","w-3.5 h-3.5")+"</button></span>"}function M(o){return["req_id","session_id","chat_id","turn_id","call_id","job_id","preferred_req_id"].includes(String(o||""))}function k(o,i){return M(o)&&i?A(i):u(i)}function q(){return'<span class="tt-sep" aria-hidden="true">\xB7</span>'}function E(o){return(w().fmtMs||(i=>i+"ms"))(o)}function P(o){return(w().fmtBytes||(i=>i+"B"))(o)}function O(o,i){return(w().shortId||(c=>String(c||"")))(o,i)}function N(o){return(w().prettyJSON||JSON.stringify)(o,null,2)}function J(o){if(w().tryParseJSON)return w().tryParseJSON(o);if(o==null)return null;if(typeof o=="object")return o;try{return JSON.parse(o)}catch{return null}}function S(o,i){try{e.showToast(o,i||"success")}catch{}}function B(o){!o||!o.classList||(o.classList.add("is-copied"),clearTimeout(o._copiedTimer),o._copiedTimer=setTimeout(()=>{try{o.classList.remove("is-copied")}catch{}},1400))}function H(o,i){let c=String(o??"");if(!c){S("Nothing to copy","warning");return}let p=w().copyToClipboard?w().copyToClipboard(c):Promise.resolve().then(()=>navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(c).then(()=>!0,()=>!1):!1);Promise.resolve(p).then(m=>{m?(B(i),S("copied "+O(c,28))):S("Copy failed","error")},()=>S("Copy failed","error"))}function Q(){for(let o=n.length-1;o>=0;o--){let i=n[o],c=i&&i.trace||{};if(w().isMultiAgentTrace?w().isMultiAgentTrace(c,i):c.multi_agent)return i}return null}function R(o){let i=o||Q()||{},c=w().extractJobUnits;return c?c(i.trace||{},i):[]}function bt(o){let i=o||R();return i.length?((y<0||y>=i.length)&&(y=0),i[y]):null}function Y(o){let i=t.querySelector(".tt-title");i&&(i.textContent=o?"Job traces":"Turn traces");let c=h("tt-empty");c&&!n.length&&(c.textContent=o?"No job run yet.":"No turn run yet.");let p=h("tt-turn-picker-label");p&&(p.textContent=o?"Unit":"Turn");let m=h("tt-turns");m&&m.setAttribute("aria-label",o?"Units":"Turns"),t.querySelectorAll(".tt-tab[data-job], .tt-tab[data-turn]").forEach(f=>{let v=f.hasAttribute("data-job")&&!f.hasAttribute("data-turn"),C=f.hasAttribute("data-turn")&&!f.hasAttribute("data-job");f.hidden=v&&!o||C&&o});let g=h("tt-panel");g&&g.classList.toggle("tt-job-mode",!!o)}function Ct(o){let i=!!o;if(_===i){Y(_);return}_=i,y=0,a=0,l=0,d=null,s="overview",Y(_),it(),V()}function Xt(){return n.map((i,c)=>Gt(i,c)).reverse()}function te(){let o=Xt();return o.length?o.find(i=>i.key===r)||o[0]:null}function ee(){let o=h("tt-turn-dropdown");o&&(o.open=!1);let i=h("tt-turn-summary");i&&i.setAttribute("aria-expanded","false")}function X(o){let i=h("tt-pick-n"),c=h("tt-pick-q"),p=h("tt-pick-meta"),m=h("tt-pick-dot"),g=h("tt-pick-err");if(!o){i&&(i.textContent=""),c&&(c.textContent=_?"Select a unit":"Select a turn"),p&&(p.textContent=""),m&&(m.className="dot"),g&&(g.hidden=!0);return}i&&(i.textContent=o.n||""),c&&(c.textContent=o.question||""),p&&(p.textContent=o.meta||"");let f=o.status||"ok";m&&(m.className="dot"+(f==="ok"?" ok":" "+f)),g&&(g.hidden=!o.errLabel,g.textContent=o.errLabel||"",g.className="badge badge-xs shrink-0 "+(f==="err"?"badge-error":"badge-warning"))}function ne(){try{let o=String(e.getHubBase()||""),i=w().normalizeHubBase;return i?i(o):o.replace(/\/$/,"")}catch{return""}}function re(o){let i=w().hubDebugSessionUrl;if(i)try{return i(e.getHubBase()||"",o)}catch{return""}return""}function At(o){let i=w().hubDebugReqUrl;if(i)try{return i(e.getHubBase()||"",o)}catch{return""}return""}function oe(o){if(!o){S("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning");return}window.open(o,"_blank","noopener,noreferrer")}function mt(o){s=o,t.querySelectorAll(".tt-tab").forEach(i=>{let c=i.dataset.tab===o;i.classList.toggle("on",c),i.classList.toggle("tab-active",c),i.setAttribute("aria-selected",c?"true":"false")}),t.querySelectorAll(".tt-tab-panel").forEach(i=>{i.classList.toggle("on",i.id==="tt-panel-"+o)})}function se(o){let i=_?R().length:o,c=i>0,p=h("tt-turn-count");p&&(_?p.textContent=i+" unit"+(i===1?"":"s"):p.textContent=i+" turn"+(i===1?"":"s"),p.hidden=!c);let m=t.querySelector("#tt-panel .tt-hdr-actions");m&&(m.hidden=!c)}function tn(o,i){let c=h("tt-session");if(!c)return;let p=o||{},m=p.trace||{},g=m.job_id||p.job_id||"",f=m.pack||p.pack||"",v=m.engine||p.engine||"local_units",C=m.status||p.status||"",D=C==="ok"?"ok":C==="partial"?"warn":C?"err":"info";c.hidden=!1,c.innerHTML="<span>job</span>"+(g?L(g,40):'<span class="tt-muted">\u2014</span>')+'<span class="tt-sep">\xB7</span>'+(f?"<span>pack <strong>"+u(f)+"</strong></span>":'<span class="tt-muted">no pack</span>')+'<span class="tt-sep">\xB7</span><span>engine '+u(v)+"</span>"+(C?'<span class="tt-sep">\xB7</span><span class="tt-badge '+D+'">'+u(C)+"</span>":"")+'<span class="tt-sep">\xB7</span><span>'+(i?i.length:0)+" units \xB7 isolated \xB7 no shared session</span>"}function qt(o){let i=h("tt-session");if(!i)return;if(!o||!o.session_id&&!o.preferred_req_id&&!o.contract_status&&!(o.gather&&o.gather.length)&&!(o.semanticCache&&o.semanticCache.length)&&!(o.stamp&&o.stamp.user)){i.hidden=!0,i.innerHTML="";return}i.hidden=!1;let c=o.contract_status||"",p=c==="match"?"ok":c==="drift"?"warn":"info",m=re(o.session_id),g=o.semanticCache&&o.semanticCache[0]||"",f=g.includes("recall")?"recall":g.includes("write")?"write":g.includes("probe")?"probe":g?"on":"";i.innerHTML="<span>Session</span>"+(o.session_id?L(o.session_id,14):'<span class="tt-muted">\u2014</span>')+'<span class="tt-sep">\xB7</span>'+(o.session_round!=null?"<span>round <strong>"+u(String(o.session_round))+"</strong></span>":'<span class="tt-muted">round \u2014</span>')+(c?'<span class="tt-sep">\xB7</span><span class="tt-badge '+p+'">contract:'+u(c)+"</span>":"")+(o.preferred_req_id?'<span class="tt-sep">\xB7</span><span>preferred</span>'+L(o.preferred_req_id,14):"")+(m?'<span class="tt-sep">\xB7</span><a class="tt-link" href="'+u(m)+'" target="_blank" rel="noopener">Hub session</a>':'<span class="tt-sep">\xB7</span><button type="button" class="tt-linkish" data-action="hub-missing">Hub session</button>')+(o.gather&&o.gather.length?'<span class="tt-sep">\xB7</span><span class="tt-badge info">gather 9</span>':"")+(f?'<span class="tt-sep">\xB7</span><span class="tt-badge info" title="'+u(g)+'">cache:'+u(f)+"</span>":"")+(o.stamp&&o.stamp.user?'<span class="tt-sep">\xB7</span><span class="tt-muted">user '+u(String(o.stamp.user))+"</span>":"")}function en(o){let i=h("tt-turns");if(!i)return;if(i.innerHTML="",!o.length){i.innerHTML='<div class="tt-empty-inline">No units</div>',X(null);return}o.forEach((p,m)=>{let g=[];g.push('<span class="tt-turn-tag">'+u(p.kind)+"</span>"),p.synth?g.push('<span class="tt-turn-tag synth">synth</span>'):g.push('<span class="tt-turn-tag">isolated</span>'),g.push('<span class="tt-turn-tag">'+(p.req_ids||[]).length+" req</span>"),p.error_code&&g.push('<span class="tt-turn-tag err">'+u(p.error_code)+"</span>");let f=document.createElement("button");f.type="button",f.className="tt-turn-item"+(m===y?" active":""),f.setAttribute("role","option"),f.setAttribute("aria-selected",m===y?"true":"false"),f.innerHTML='<div class="row1"><span class="dot '+u(p.status)+'" aria-hidden="true"></span><span class="n">'+u(p.unit_id)+'</span><span class="meta">w'+u(String(p.wave))+'</span></div><div class="q">'+u(p.goal||p.answer||p.unit_id)+'</div><div class="row3">'+g.join("")+"</div>";let v=()=>{y=m,a=0,l=0,ee(),V()};f.onclick=v,f.onkeydown=C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),v())},i.appendChild(f)});let c=bt(o);X(c?{n:c.unit_id,question:c.goal||c.answer||c.unit_id,meta:"w"+String(c.wave)+" \xB7 "+(c.req_ids||[]).length+" req",status:c.status==="ok"?"ok":c.status,errLabel:c.error_code||(c.status==="err"?"err":"")}:null)}function nn(o){let i=h("tt-turns");if(!i)return;if(i.innerHTML="",!o.length){i.innerHTML='<div class="tt-empty-inline">No turns</div>',X(null);return}o.forEach(p=>{let m=p.index+1,g=p.llmRounds.length||p.trace.rounds||0,f=p.status==="ok"?"ok":p.status,v=[];p.mode&&v.push('<span class="tt-turn-tag">'+u(p.mode)+"</span>"),p.target&&v.push('<span class="tt-turn-tag">'+u(O(p.target,28))+"</span>"),p.errCount&&v.push('<span class="tt-turn-tag err">'+p.errCount+" err</span>");let C=p.key===r,D=document.createElement("button");D.type="button",D.className="tt-turn-item"+(C?" active":""),D.dataset.key=p.key,D.setAttribute("role","option"),D.setAttribute("aria-selected",C?"true":"false"),D.innerHTML='<div class="row1"><span class="dot '+u(f)+'" aria-hidden="true"></span><span class="n">#'+m+'</span><span class="dur">'+u(E(p.metrics.total))+'</span><span class="meta">'+g+"r \xB7 "+p.toolsCount+' tools</span></div><div class="q">'+u(p.question)+"</div>"+(v.length?'<div class="row3">'+v.join("")+"</div>":"");let ue=()=>{r=p.key,a=0,l=0,ee(),V()};D.onclick=ue,D.onkeydown=zt=>{(zt.key==="Enter"||zt.key===" ")&&(zt.preventDefault(),ue())},i.appendChild(D)});let c=o.find(p=>p.key===r)||o[0];if(c){let p=c.llmRounds.length||c.trace.rounds||0;X({n:"#"+(c.index+1),question:c.question,meta:E(c.metrics.total)+" \xB7 "+p+"r \xB7 "+c.toolsCount+" tools",status:c.status==="ok"?"ok":c.status,errLabel:c.errCount?c.errCount+" err":""})}else X(null)}function rn(o){let i=h("tt-detail-head");if(!i)return;if(!o){i.innerHTML="";return}i.innerHTML='<div class="tt-d-title">'+u(o.goal||o.unit_id)+'</div><div class="tt-metrics"><div class="metric"><div class="k">Unit</div><div class="v">'+u(o.unit_id)+'</div></div><div class="metric"><div class="k">Hops</div><div class="v">'+(o.hops||[]).length+'</div><div class="v sub">'+(o.req_ids||[]).length+' req_id</div></div><div class="metric"><div class="k">LLM</div><div class="v">'+(o.llm||[]).length+'r</div></div><div class="metric"><div class="k">Status</div><div class="v"><span class="tt-badge '+(o.status==="ok"?"ok":"err")+'">'+u(o.error_code||o.status)+"</span></div></div></div>";let c=h("tt-hop-count");c&&(c.textContent=String((o.hops||[]).length))}function on(o){let i=o.catalog||{},c=o.inject||{},p=[],m=i.has_mini_schema===!0||c.has_mini_schema===!0,g=i.has_scope_brief===!0||c.has_scope_brief===!0;return p.push('<span class="tt-turn-tag">'+(m?"MINI yes":"MINI no")+"</span>"),p.push('<span class="tt-turn-tag">'+(g?"BRIEF yes":"BRIEF no")+"</span>"),i.base_id&&p.push('<span class="tt-turn-tag">'+u(String(i.base_id))+"</span>"),i.client_floor&&p.push('<span class="tt-turn-tag">floor-'+u(String(i.client_floor))+"</span>"),p.length?'<div class="tt-chip-row">'+p.join("")+"</div>":""}function sn(o){let i=h("tt-detail-head");if(!i||!o){i&&(i.innerHTML="");return}let c=o.metrics,p=c.total||1;i.innerHTML='<div class="tt-d-title">'+u(o.question)+'</div><div class="tt-metrics"><div class="metric"><div class="k">Wall</div><div class="v">'+u(E(c.total))+'</div><div class="mm-bar"><i class="ai" style="width:'+(c.aiMs/p*100).toFixed(1)+'%"></i><i class="zeus" style="width:'+(c.zeusMs/p*100).toFixed(1)+'%"></i><i class="other" style="width:'+(c.other/p*100).toFixed(1)+'%"></i></div></div><div class="metric"><div class="k">AI / Zeus</div><div class="v">'+u(E(c.aiMs))+' <span class="sub">/ '+u(E(c.zeusMs))+'</span></div></div><div class="metric"><div class="k">Tokens</div><div class="v">'+u((w().fmtTokens||(g=>g?Number(g).toLocaleString():"?"))(c.tokens))+'</div><div class="v sub" title="Sum of usage.total_tokens across all billed LLM calls (llm + force_final), not a single round">'+(function(){let g=o.llmRounds&&o.llmRounds.length||0,f=o.trace.rounds||0,v=[];return(c.hasIn||c.tokensIn)&&v.push("in "+(w().fmtTokens?w().fmtTokens(c.tokensIn):c.tokensIn)),(c.hasOut||c.tokensOut)&&v.push("out "+(w().fmtTokens?w().fmtTokens(c.tokensOut):c.tokensOut)),c.tokensCached&&v.push("cached "+Number(c.tokensCached).toLocaleString()),g>0?(v.push(g+(g===1?" LLM call":" LLM calls")),f>0&&f!==g&&v.push(f+" rounds")):v.push((f||0)+" rounds"),v.join(" \xB7 ")})()+'</div></div><div class="metric"><div class="k">Turn ID</div><div class="v sub mono" data-copy="'+u(o.turn_id||"")+'" title="Click to copy">'+u(o.turn_id?O(o.turn_id,16):"\u2014")+"</div></div></div>"+on(o);let m=h("tt-hop-count");m&&(m.textContent=String(o.hops.length))}function ae(o){return o?!!(o.status!=="ok"||o.grade==="warn"||o.grade==="fail"||o.errCount>0||o.playbooks&&o.playbooks.length):!1}function an(o){return`# Support pack
**Headline:** `+(o.headline||"(none)")+`
**Grade:** `+(o.grade||o.status)+`
**turn_id:** `+(o.turn_id||"")+`
**session_id:** `+(o.session_id||"")+`
**preferred_req_id:** `+(o.preferred_req_id||"")+`
**Playbooks:** `+(o.playbooks.map(i=>i.id).join(", ")||"none")+`
**Question:** `+(o.question||"")+`
`}function ln(o){let i=h("tt-diagnosis");if(!i)return;if(!o||!ae(o)){i.hidden=!0,i.innerHTML="";return}i.hidden=!1,i.className="tt-diagnosis alert mx-3 mt-2 "+(o.grade==="fail"||o.status==="err"?"alert-error fail":"alert-warning warn");let c=o.grade||o.status;i.innerHTML='<div class="eyebrow"><span class="tt-badge '+(c==="fail"||c==="err"?"err":"warn")+'">diagnosis '+u(c)+"</span><span>"+o.hops.length+" hops \xB7 "+(o.llmRounds.length||0)+" rounds</span></div><h3>"+u(o.headline||"Turn needs attention")+"</h3>"+(o.overview?'<p class="detail">'+u(o.overview)+"</p>":"")+(o.session_error?'<p class="detail">Session error: '+u(String(o.session_error).slice(0,240))+"</p>":"")+'<div class="hero-actions">'+(o.turn_id?'<span class="idchip" data-copy="'+u(o.turn_id)+'" title="Click to copy"><b>turn</b> '+u(O(o.turn_id,14))+"</span>":"")+(o.session_id?'<span class="idchip" data-copy="'+u(o.session_id)+'" title="Click to copy"><b>session</b> '+u(O(o.session_id,14))+"</span>":"")+(o.preferred_req_id?'<span class="idchip" data-copy="'+u(o.preferred_req_id)+'" title="Click to copy"><b>preferred</b> '+u(O(o.preferred_req_id,14))+"</span>":"")+'<button type="button" class="btn btn-xs btn-primary" data-action="open-pref">Open preferred hop</button><button type="button" class="btn btn-xs" data-action="copy-pack" title="Click to copy">Copy support pack</button></div>'}function cn(o){let i=h("tt-panel-timeline");if(!i||!o)return;let c=(w().waterfallHTML||(()=>""))(o.spans,o.metrics&&o.metrics.total,o.steps),p=w().timelineSpeedKpiHTML?w().timelineSpeedKpiHTML(o):"",m=(w().toolFrequencyChartHTML||(()=>""))(o.steps,o.api_version,e.getChartOrder());i.innerHTML='<div class="tt-waterfall-host"><h2 class="text-base font-semibold m-0 mb-2">Spans waterfall</h2>'+p+(c||'<div class="tt-empty-inline">No spans for this turn.</div>')+"</div>"+(m?'<details class="tt-fold"><summary>Tool-call frequency</summary>'+m+"</details>":"")}function ie(o,i){let c=i||h("tt-tools-hops");if(!c||!o)return;if(!o.hops.length){c.innerHTML='<div class="tt-empty-inline">No hops recorded for this turn.</div>';return}a>=o.hops.length&&(a=0);let p=o.hops[a],m=o.hops.map((v,C)=>{let D=(Number(v.status)||0)>=400;return'<tr class="'+(C===a?"sel":"")+'" data-i="'+C+'"><td>'+(v.preferred?'<span class="inline-flex items-center gap-1">'+j("star")+'<span class="sr-only">preferred</span></span>':"")+'<button type="button" class="btn btn-xs btn-ghost font-mono" data-i="'+C+'"'+(v.req_id?' data-copy="'+u(v.req_id)+'" title="Click to copy"':"")+">"+u(O(v.req_id||"\u2014",12))+"</button></td><td><strong>"+u(v.verb)+'</strong></td><td><span class="'+x(D?"bad":"ok")+'">'+u(String(v.status))+'</span></td><td class="mono">'+u(E(v.ms))+'</td><td class="mono">'+u(v.bytes==null?"\u2014":typeof v.bytes=="number"?P(v.bytes):String(v.bytes))+"</td></tr>"}).join("");c.innerHTML='<div class="overflow-x-auto"><table class="table table-zebra table-xs tt-table"><thead><tr><th>req_id</th><th>Verb</th><th>Status</th><th>ms</th><th>Bytes</th></tr></thead><tbody>'+m+'</tbody></table></div><div class="tt-hop-actions flex gap-2 items-center my-2 text-sm"><strong>Hop detail</strong>'+(p.req_id?'<button type="button" class="btn btn-xs btn-ghost" data-copy="'+u(p.req_id)+'" title="Click to copy">Copy req_id</button>':"")+'<button type="button" class="btn btn-xs btn-ghost gap-1" data-action="open-req" data-req="'+u(p.req_id||"")+'">Open in Hub '+j("external")+'</button></div><div class="tt-split-io grid grid-cols-1 md:grid-cols-2 gap-2.5"><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="ai-lab">Request</span> <span class="badge badge-ghost badge-sm">'+u(p.verb)+'</span><button type="button" class="btn btn-xs btn-ghost ml-auto" data-copy-from="tt-hop-req" title="Click to copy">Copy</button></header><pre id="tt-hop-req"></pre></div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="zeus-lab">Response</span> <span class="'+x((Number(p.status)||0)>=400?"bad":"ok")+'">'+u(String(p.status))+'</span><button type="button" class="btn btn-xs btn-ghost ml-auto" data-copy-from="tt-hop-res" title="Click to copy">Copy</button></header><pre id="tt-hop-res"></pre></div></div>';let g=h("tt-hop-req"),f=h("tt-hop-res");g&&(g.textContent=N(p.req)),f&&(f.textContent=N(p.res)),c.querySelectorAll("tbody tr").forEach(v=>{v.onclick=C=>{C.target.closest("[data-copy]")||(a=+v.dataset.i,ie(o,c))}})}function le(o,i){let c=i||h("tt-tools-llm");if(!c||!o)return;let p=w().extractDecomposition?w().extractDecomposition(Object.assign({},o.raw||{},{trace:o.trace,hops:o.hops,llmRounds:o.llmRounds})):{decomposition:null,query_decomposition:null},m=w().decompositionCardHTML?w().decompositionCardHTML(p,u):"";function g(){let v=h("tt-decomp-json");v&&(v.textContent=N({query_decomposition:p.query_decomposition,decomposition:p.decomposition,summary:p.summary,confidence:p.confidence,policy_action:p.policy_action}))}if(!o.llmRounds.length){c.innerHTML=m+'<div class="tt-empty-inline">No LLM rounds recorded for this turn.</div>',g();return}l>=o.llmRounds.length&&(l=0);let f=o.llmRounds[l];c.innerHTML=m+'<div class="round-pills">'+o.llmRounds.map((v,C)=>'<button type="button" class="btn btn-xs round-pill '+(C===l?"btn-active on":"")+'" data-i="'+C+'">'+u(String(v.label||"Round "+v.round))+" \xB7 "+u(v.finish||"\u2014")+"</button>").join("")+'</div><div class="tt-tokline">tokens in <strong>'+u(String(f.tok_in!=null?f.tok_in:"?"))+"</strong> \xB7 out <strong>"+u(String(f.tok_out!=null?f.tok_out:"?"))+"</strong>"+(f.tok_total!=null?" \xB7 total <strong>"+u(String(f.tok_total))+"</strong>":"")+'</div><div class="tt-split-io grid grid-cols-1 md:grid-cols-2 gap-2.5"><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold">AI request <button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-llm-copy-req" data-copy-from="tt-llm-req" title="Click to copy">Copy</button></header><pre id="tt-llm-req"></pre></div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold">AI response <button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-llm-copy-res" data-copy-from="tt-llm-res" title="Click to copy">Copy</button></header><pre id="tt-llm-res"></pre></div></div>',h("tt-llm-req").textContent=N(f.req),h("tt-llm-res").textContent=N(f.res),c.querySelectorAll(".round-pill").forEach(v=>{v.onclick=()=>{l=+v.dataset.i,le(o,c)}}),g()}function dn(o,i){let c=i||h("tt-prompt-inject");if(!c)return;if(!o){c.innerHTML='<div class="tt-empty-inline">No inject data.</div>';return}let p=o.inject||{},m=o.catalog||{},g=o.semanticCache||[],f={inject:p,catalog:{has_mini_schema:m.has_mini_schema,has_scope_brief:m.has_scope_brief,base_id:m.base_id,client_floor:m.client_floor,brief_sha12:m.brief_sha12||p.brief_sha12,mini_sha12:m.mini_sha12||p.mini_sha12},semantic_cache:g,semantic_memory:p.semantic_memory||null},v=g.length?g.join(" \xB7 "):p.has_scope_brief||p.has_mini_schema?"Catalog inject present (SCOPE BRIEF / MINI-SCHEMA).":"No catalog inject flags on this turn.";c.innerHTML='<div class="tt-inject-note">'+u(v)+'</div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="ai-lab">inject / catalog</span><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-inj-copy-req" data-copy-from="tt-inj-req" title="Click to copy">Copy</button></header><pre id="tt-inj-req"></pre></div>';let C=h("tt-inj-req");C&&(C.textContent=N(f))}function pn(o,i){let c=i||h("tt-prompt-inject");if(!c)return;if(!o){c.innerHTML='<div class="tt-empty-inline">No unit selected.</div>';return}let p=o.stuffed_goal||o.goal||"",m=o.synth?"Synth unit: no shared session. Goal is stuffed with prior artifacts only.":o.has_inject?"Isolated agent unit. Catalog inject present (SCOPE BRIEF / MINI-SCHEMA).":o.kind==="zeus_direct"?"zeus_direct: no catalog inject (Mode 2 verb).":"Isolated agent unit. Fail-closed without ## SCOPE BRIEF (130012).";c.innerHTML='<div class="tt-inject-note">'+u(m)+'</div><div class="tt-split-io grid grid-cols-1 md:grid-cols-2 gap-2.5"><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="ai-lab">Unit goal + inject</span><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-inj-copy-req" data-copy-from="tt-inj-req" title="Click to copy">Copy</button></header><pre id="tt-inj-req"></pre></div><div class="card bg-base-200 border border-base-300 io-card"><header class="flex items-center gap-1.5 px-2 py-1.5 border-b border-base-300 text-xs font-semibold"><span class="zeus-lab">Artifact / answer</span>'+(o.error_code?'<span class="'+x("err")+'">'+u(o.error_code)+"</span>":"")+'<button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-inj-copy-res" data-copy-from="tt-inj-res" title="Click to copy">Copy</button></header><pre id="tt-inj-res"></pre></div></div>';let g=h("tt-inj-req"),f=h("tt-inj-res");g&&(g.textContent=p||"(empty goal)"),f&&(f.textContent=o.answer||"(no artifact)")}function ce(o){let i=(w().gradeNorm||(c=>c))(o);return i==="fail"?"fail":i==="warn"?"warn":i==="pass"?"pass":i==="skip"?"skip":"na"}function de(o){return'<div class="card bg-base-200 border border-base-300"><div class="card-body p-3 py-2 text-sm">'+o+"</div></div>"}function Lt(o){return!o||!o.length?"":'<div class="flex flex-col gap-2 mt-2">'+o.map(i=>de('<p class="m-0">'+i+"</p>")).join("")+"</div>"}function un(o){let i=ce(o.grade),p='<article class="card bg-base-100 border '+(i==="fail"?"border-error/40":i==="warn"?"border-warning/40":i==="pass"?"border-success/40":"border-base-300")+" shadow-sm det-diag-card "+i+'"><div class="card-body p-4"><h3 class="text-xs font-semibold uppercase tracking-wide text-base-content/50">'+u(o.title)+"</h3>";return o.items&&o.items.length&&(p+=Lt(o.items.map(m=>u(m)))),o.minis&&o.minis.length&&(p+='<div class="grid grid-cols-2 gap-2 mt-2">'+o.minis.map(m=>de('<p class="text-[10px] uppercase font-mono text-base-content/50 m-0">'+u(String(m.l))+'</p><p class="font-mono font-semibold text-sm m-0">'+u(String(m.v))+"</p>")).join("")+"</div>"),o.muted&&(p+='<p class="text-xs text-base-content/50 font-mono mt-2">'+u(o.muted)+"</p>"),o.jump&&(p+='<button type="button" class="btn btn-xs btn-ghost w-fit" data-action="tt-tab" data-tab="'+u(o.jump)+'">open '+u(o.jump)+"</button>"),p+"</div></article>"}function fn(o){let i=w().detectiveEnvelopeRows?w().detectiveEnvelopeRows(o):[],c=w().detectiveLayerA?w().detectiveLayerA(o):{},p=i.length?'<dl class="det-env grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm mt-2">'+i.map(f=>'<dt class="text-base-content/50">'+u(f.key)+'</dt><dd class="font-mono text-xs m-0">'+k(f.key,f.value)+"</dd>").join("")+"</dl>":'<div class="hint">Detective data not attached on this turn.</div>',m=c.intent?'<div class="mt-3"><span class="badge badge-info badge-outline gap-1"><span class="text-[10px] font-bold uppercase">intent</span> '+u(String(c.intent))+"</span></div>":"",g=[c.via?"via="+c.via:"",c.confidence?"conf="+c.confidence:"",c.policy_action?"policy="+c.policy_action:""].filter(Boolean).join(" \xB7 ");return'<div class="card bg-base-100 shadow-sm border border-base-300 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Envelope <span class="font-normal text-sm text-base-content/60">who / scope / mode / duration</span></h2>'+p+m+(g?'<p class="text-xs text-base-content/50 mt-2">layer_a \xB7 '+u(g)+"</p>":"")+'<p class="text-sm text-base-content/70 mt-3">Cost / result KPIs live on <button type="button" class="btn btn-xs" data-action="tt-tab" data-tab="tools">Tools</button>. Envelope is facts only. Token IN is omitted when usage is missing (never painted as 0).</p></div></div>'}function bn(o){let i=w().detectiveDiagnosisModel?w().detectiveDiagnosisModel(o):{cards:[],grades:[],playbooks:[],headline:o.headline||""},c=o.checkSummary||(w().detectiveCheckSummary?w().detectiveCheckSummary(o.promptChecks||[]):{});function p(f){let v=ce(f);return"badge badge-sm "+(v==="fail"?"badge-error":v==="warn"?"badge-warning":v==="pass"?"badge-success":"badge-ghost")}let m='<div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><div class="flex flex-wrap items-start gap-2"><h2 class="card-title text-base flex-1 min-w-[12rem]">'+u(i.headline);i.request_kind_label&&(m+=' <span class="'+p(i.isDirect?"na":"pass")+'">'+u(i.request_kind_label)+"</span>"),m+='</h2><div class="flex flex-wrap gap-1">',(i.grades||[]).forEach(f=>{f.value&&(m+='<span class="'+p(f.cls||f.value)+'">'+u(f.id)+":"+u(f.value)+"</span>")}),c&&c.label&&(m+='<span class="'+(c.tone==="ok"?"badge badge-sm badge-success":"badge badge-sm badge-error")+'">'+u(c.label)+"</span>"),m+="</div></div></div></div>",i.slowTop&&i.slowTop.length&&(m+='<div class="card bg-base-100 shadow-sm border border-warning/40 mb-4"><div class="card-body p-4"><h3 class="card-title text-sm">Why was this slow?</h3>'+Lt(i.slowTop.map(f=>"<b>"+u(f.label)+"</b> \xB7 "+u(String(f.ms))+"ms"+(f.share_pct?" ("+f.share_pct+"%)":"")))+"</div></div>"),m+='<div class="grid grid-cols-1 md:grid-cols-2 gap-3 diag-grid">'+(i.cards||[]).map(un).join("")+"</div>";let g=i.playbooks||[];return g.length?(m+='<div class="alert alert-info mt-4"><div><p class="font-semibold">Insight playbooks <span class="font-normal opacity-80">\xB7 auto-matched</span></p><p class="text-sm">Each card is a known failure pattern. Follow the actions, then return to Overview.</p></div></div>',g.forEach(f=>{let v=u(f.severity||"info");m+='<article class="card bg-base-100 border-l-4 '+(v==="fail"?"border-l-error":v==="warn"?"border-l-warning":"border-l-info")+" border border-base-300 mt-3 pb "+v+'"><div class="card-body p-4"><h3 class="font-semibold">'+u(f.title)+'</h3><p class="text-sm text-base-content/70">'+u(f.summary||"")+"</p>",f.actions&&f.actions.length&&(m+=Lt(f.actions.map(D=>u(D)))),m+="</div></article>"})):m+='<div class="playbook empty-ok flex items-center gap-1 text-success mt-4">'+j("check")+" No playbooks triggered</div>",m+='<div class="flex flex-wrap gap-2 mt-4"><button type="button" class="btn btn-sm" data-action="copy-pack">Copy markdown pack</button>'+(o.preferred_req_id?'<a class="btn btn-sm btn-ghost gap-1" href="'+u(At(o.preferred_req_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-req">Open Hub Detective '+j("external")+"</a>":"")+"</div>",m}function mn(o){let i=w().detectivePromptView?w().detectivePromptView(o):{checks:o.promptChecks||[],tiles:o.promptChecks||[],verdict:o.prompt_grade||"skip",summary:"",rounds:0,checkSummary:o.checkSummary},c=i.checkSummary||(w().detectiveCheckSummary?w().detectiveCheckSummary(i.checks||[]):{}),p=i.verdict||"skip",g='<div class="pcl"><div class="alert '+(p==="fail"?"alert-error":p==="warn"?"alert-warning":p==="pass"?"alert-success":"alert-info")+" mb-4 verdict "+u(p)+'"><span class="'+x(p)+' vbadge">'+u(p)+'</span><div><p class="font-medium vsum">'+u(i.summary||"")+'</p><p class="text-xs font-mono opacity-70 vmeta">rounds checked: '+u(String(i.rounds||0))+(c&&c.label?" \xB7 "+u(c.label):"")+" \xB7 fix fails first, then debug tools</p></div></div>";return g+='<p class="text-xs text-base-content/50 mb-3">SCOPE BRIEF / MINI-SCHEMA are status tiles. Live sent-vs-catalog compare is Hub Detective.</p>',g+='<div class="tiles">',(i.tiles||i.checks||[]).forEach(f=>{let v=f.status||(f.ok?"pass":"fail");g+='<div class="card bg-base-100 border '+(v==="fail"?"border-error/40":v==="warn"?"border-warning/40":v==="pass"?"border-success/40":"border-base-300")+" shadow-sm tile "+u(v)+'" data-check-id="'+u(f.id||"")+'"><div class="card-body p-3 gap-1"><div class="flex justify-between items-center top"><span class="text-[10px] uppercase font-mono text-base-content/50 grp">'+u(f.group||"")+'</span><span class="'+x(v)+" st "+u(v)+'">'+u(v)+'</span></div><p class="font-semibold text-sm lab">'+u(f.lab)+"</p>",f.detail&&(g+='<p class="text-xs font-mono text-base-content/60 det">'+u(f.detail)+"</p>"),f.fix_hint&&(g+='<p class="text-xs text-primary fix">Fix: '+u(f.fix_hint)+"</p>"),g+="</div></div>"}),g+="</div></div>",g}function hn(o){let i=w().detectiveSessionModel?w().detectiveSessionModel(o):{kv:[],hops:[]},c='<div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Session context <span class="font-normal text-sm text-base-content/60">zeus_client stamps</span></h2>'+(i.kv.length?'<dl class="det-env grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">'+i.kv.map(p=>'<dt class="text-base-content/50">'+u(p.key)+'</dt><dd class="font-mono text-xs m-0">'+k(p.key,p.value)+"</dd>").join("")+"</dl>":'<div class="hint">No session conversation attached to this turn.</div>')+"</div></div>";return i.hops.length&&(c+='<div class="card bg-base-100 shadow-sm border border-base-300 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Related hops <span class="font-normal text-sm text-base-content/60">same chat_id</span></h2><div class="session-strip flex flex-wrap gap-2">'+i.hops.map(p=>'<button type="button" class="btn btn-xs font-mono pill'+(p.preferred?" btn-primary cur":"")+'" data-copy="'+u(p.req_id)+'">'+u(p.verb||"hop")+" \xB7 "+u(O(p.req_id,10))+"</button>").join("")+"</div></div></div>"),c}function Et(o,i){let c=h(o);c&&(c.innerHTML=i||"")}function gn(o,i){if(!o||!o.length)return'<div class="hint">No cost / result KPIs on this turn.</div>';let c=i?'<p class="text-xs uppercase tracking-wide text-base-content/50 mb-2">'+u(i)+"</p>":"";return c+='<div class="grid grid-cols-2 md:grid-cols-3 gap-2 env-kpi">',o.forEach(p=>{c+='<div class="stat bg-base-200 rounded-box border border-base-300 p-3 kpi-tile min-w-0"><div class="stat-title kpi-lbl">'+u(p.label)+'</div><div class="stat-value text-xl kpi-val">'+u(p.value)+"</div></div>"}),c+="</div>",c}function yn(o){let i=w().detectiveShellSpec?w().detectiveShellSpec(o,s):{tabs:[]},c=h("tt-hop-count"),p=h("tt-prompt-count"),m=h("tt-diag-count");(i.tabs||[]).forEach(g=>{g.id==="tools"&&c&&(c.textContent=g.pill||String(o&&o.hops&&o.hops.length||0),c.classList.toggle("badge-error",g.pillKind==="err")),g.id==="prompt"&&p&&(p.hidden=!g.pill,p.textContent=g.pill||"",p.classList.toggle("badge-error",g.pillKind==="err"),p.classList.toggle("badge-success",g.pillKind==="ok")),g.id==="diagnosis"&&m&&(m.hidden=!g.pill,m.textContent=g.pill||"",m.classList.toggle("badge-warning",g.pillKind==="warn"),m.classList.toggle("badge-error",g.pillKind==="err"))})}function vn(o){Et("tt-panel-overview",o?fn(o):"")}function xn(o){Et("tt-panel-diagnosis",o?bn(o):"")}function _n(o,i){let c=h("tt-panel-prompt");if(!c)return;if(!o&&!i){c.innerHTML="";return}let p=o?mn(o):"";p+='<div id="tt-prompt-inject" class="mt-3"></div>',c.innerHTML=p||'<div class="tt-empty-inline">No prompt checklist on this turn.</div>',_?pn(i,h("tt-prompt-inject")):o&&dn(o,h("tt-prompt-inject"))}function wn(o){let i=h("tt-panel-tools");if(!i)return;if(!o){i.innerHTML="";return}let c=w().detectiveCostResultKpis?w().detectiveCostResultKpis(o):w().detectiveTokenTiles?w().detectiveTokenTiles(o):[];i.innerHTML='<div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Cost / result <span class="font-normal text-sm text-base-content/60">tokens \xB7 HTTP \xB7 records</span></h2>'+gn(c,"Provider tokens and result")+'</div></div><div class="card bg-base-100 shadow-sm border border-base-300 mb-4 det-card"><div class="card-body p-4"><h2 class="card-title text-base">AI request <span class="font-normal text-sm text-base-content/60">LLM round \xB7 req\u2225res</span></h2><div id="tt-tools-llm"></div></div></div><div class="card bg-base-100 shadow-sm border border-base-300 det-card"><div class="card-body p-4"><h2 class="card-title text-base">Tool calls <span class="font-normal text-sm text-base-content/60">this turn \xB7 table then req\u2225res</span></h2><div id="tt-tools-hops"></div></div></div>',le(o,h("tt-tools-llm")),ie(o,h("tt-tools-hops"))}function kn(o){Et("tt-panel-session",o?hn(o):"")}function pe(o,i){yn(o),vn(o),xn(o),_n(o,i),cn(o),wn(o),kn(o),Sn(o)}function Sn(o){let i=h("tt-panel-raw");if(!i||!o)return;let c={question:o.question,answer:o.answer,target:o.target,mode:o.mode,api_version:o.api_version,provider:o.provider,model:o.model,session_id:o.session_id,session_round:o.session_round,contract_status:o.contract_status,preferred_req_id:o.preferred_req_id,turn_id:o.turn_id,gather:o.gather,status:o.status,detective:o.detective,hops:o.hops,spans:o.spans,trace:o.trace};i.innerHTML='<div class="card bg-base-100 shadow-sm border border-base-300 io-card raw-card"><div class="card-body p-4"><div class="flex items-center gap-2 raw-head"><h2 class="card-title text-base m-0">Raw bundle</h2><button type="button" class="btn btn-xs btn-ghost ml-auto" id="tt-raw-copy" data-copy-from="tt-raw-json" title="Click to copy">Copy JSON</button></div><pre id="tt-raw-json" hidden></pre><div class="trace-dump-viewer mt-2" id="tt-raw-host"></div></div></div>';let p=h("tt-raw-json");p&&(p.textContent=N(c));let m=h("tt-raw-host");if(w().mountJsnviewViewer)w().mountJsnviewViewer(m,c,!1);else{let g=document.createElement("pre");g.textContent=N(c),m.appendChild(g)}}function Mt(){let o=(n||[]).slice(-G);return{copied_at:new Date().toISOString(),chat_id:e.getChatId?e.getChatId():null,shown_turns:o.length,max_shown_turns:G,traces:o}}function V(){let o=h("tt-empty"),i=h("tt-body");if(Y(_),_){let m=Q(),g=R(m);if(se(g.length),!m){o&&(o.hidden=!1,o.textContent="No job run yet."),i&&(i.hidden=!0),qt(null);return}o&&(o.hidden=!0),i&&(i.hidden=!1),y>=g.length&&(y=0);let f=bt(g),v=f?{hops:f.hops||[],llmRounds:f.llm||[],question:f.goal,status:f.status,grade:f.status==="err"?"fail":"pass",playbooks:[],errCount:f.status==="err"?1:0,preferred_req_id:f.req_ids&&f.req_ids[0]||"",session_id:"",turn_id:f.unit_id,raw:m,trace:m&&m.trace||{},detective:null,headline:"",overview:"",promptChecks:[],checkSummary:{label:"",tone:""},gather:[]}:null;en(g),tn(m,g),rn(f);let C=h("tt-diagnosis");C&&(C.hidden=!(f&&f.status==="err"),f&&f.status==="err"?(C.className="tt-diagnosis fail",C.innerHTML='<div class="eyebrow"><span class="tt-badge err">'+u(f.error_code||f.status)+"</span></div><h3>"+u(f.unit_id+" failed")+'</h3><p class="detail">'+u((f.answer||"").slice(0,280))+"</p>"):C.innerHTML=""),["hops","llm","inject","detective"].includes(s)&&(s="overview"),f&&f.status==="err"&&d!==f.unit_id&&(d=f.unit_id,s="diagnosis"),mt(s),pe(v,f);return}let c=Xt();if(se(c.length),!c.length){o&&(o.hidden=!1),i&&(i.hidden=!0),qt(null);return}o&&(o.hidden=!0),i&&(i.hidden=!1),(!r||!c.some(m=>m.key===r))&&(r=c[0].key,a=0,l=0,d=null);let p=c.find(m=>m.key===r)||c[0];if(p&&a===0&&p.hops.length){let m=p.hops.findIndex(g=>g.preferred);m>0&&!p._hopTouched&&(a=m)}nn(c),qt(p),sn(p),ln(p),["hops","llm","inject","detective"].includes(s)&&(s="overview"),p&&ae(p)&&d!==p.key&&(d=p.key,s="diagnosis"),mt(s),pe(p,null)}function Tn(o){let i=o.target;if(i&&i.nodeType!==1&&(i=i.parentElement),i&&typeof i.closest=="function")return i;if(typeof o.composedPath=="function"){let c=o.composedPath().find(p=>p&&p.nodeType===1&&typeof p.closest=="function");if(c)return c}return null}function jn(o){let i=Tn(o);if(!i)return;let c=i.closest("[data-copy]");if(c&&c.getAttribute("data-copy")!=null){o.preventDefault(),H(c.getAttribute("data-copy"),c);return}let p=i.closest("[data-copy-from]");if(p){o.preventDefault();let v=h(p.getAttribute("data-copy-from")||"");H(v?v.textContent:"",p);return}let m=i.closest("[data-action]");if(!m)return;let g=m.dataset.action,f=te();if(g==="copy-all"){o.preventDefault();let v=Mt();if(!v.traces.length){S("No trace to copy yet","warning");return}H(N(v),m);return}if(g==="hub-missing"){S("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning");return}if(g==="copy-pack"&&f){H(an(f),m);return}if(g==="tt-tab"){s=m.dataset.tab||"overview",r&&(d=r),mt(s);return}if(g==="open-pref"&&f){let v=f.hops.findIndex(C=>C.preferred);a=v>=0?v:0,s="tools",f&&(f._hopTouched=!0),V(),S("Jumped to preferred hop");return}if(g==="open-req"){let v=m.dataset.req||f&&f.preferred_req_id,C=At(v);!C&&v?(H(v),S("Hub URL unknown \u2014 copied req_id","warning")):oe(C);return}g==="hub-session"&&!ne()&&(o.preventDefault(),S("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning")),g==="hub-req"&&!ne()&&(o.preventDefault(),S("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning"))}function it(){if(b)return;b=!0,t.addEventListener("click",jn);let o=h("tt-turn-dropdown");o&&o.addEventListener("toggle",()=>{let i=h("tt-turn-summary");i&&i.setAttribute("aria-expanded",o.open?"true":"false")}),t.querySelectorAll(".tt-tab").forEach(i=>{i.addEventListener("click",()=>{s=i.dataset.tab||"overview",r&&(d=r),mt(s)})}),h("tt-export")?.addEventListener("click",()=>{let i=Mt();if(!i.traces.length){S("No trace to export yet","warning");return}let c=new Blob([N(i)],{type:"application/json"}),p=document.createElement("a");p.href=URL.createObjectURL(c);let m=i.chat_id||"local";p.download="zeus-traces-"+m+"-"+Date.now()+".json",p.click(),URL.revokeObjectURL(p.href),S("exported")}),h("tt-detective")?.addEventListener("click",()=>{let i=te();if(!i){S("No turn selected","warning");return}let c=i.preferred_req_id,p=c?At(c):re(i.session_id);if(!p){let m=c||i.session_id||"";m&&H(m),S("Set ZeusTraceConfig.hubBaseUrl to open Detective","warning");return}oe(p)})}function Cn(o){n=(Array.isArray(o)?o:[]).map(jt).filter(i=>i&&i.trace),n.length>G&&(n=n.slice(-G)),_=n.some(i=>w().isMultiAgentTrace&&w().isMultiAgentTrace(i.trace,i)),r=null,a=0,l=0,d=null,it(),V()}function An(o){let i=jt(o);if(!i||!i.trace)return;n.includes(i)||n.push(i),n.length>G&&(n=n.slice(-G));let c=Gt(i,n.length-1);w().isMultiAgentTrace&&w().isMultiAgentTrace(i.trace,i)&&(_=!0),r=c.key,a=0,l=0,d=null,it(),V()}function qn(){n=[],r=null,d=null,_=!1,y=0,it(),V()}function Ln(o){e=Object.assign({},e,o||{}),it(),V()}return{init:Ln,setEntries:Cn,pushEntry:An,clear:qn,getBundle:Mt,setJobMode:Ct,TRACE_MAX_CARDS:G}}function Ge(t,e={}){let n=k=>t.querySelector(`#${k}`),r=$(e.toolOrder)??{v1:[],v2:[]},s=null,a=e.mount==="docked",l=$e(t);l.init({getClientVersion:()=>lt(),getHubBase:()=>ge({config:e}),getChatId:()=>s,getChartOrder:()=>r,showToast:y});function d(){let k=n("debug-panel"),q=n("debug-toggle");k&&(k.classList.remove("is-hidden"),k.setAttribute("aria-hidden","false"),q?.setAttribute("aria-expanded","true"))}function b(){if(a)return;let k=n("debug-panel"),q=n("debug-toggle");k&&(k.classList.add("is-hidden"),k.setAttribute("aria-hidden","true"),q?.setAttribute("aria-expanded","false"))}function _(){let k=n("debug-panel");k&&(k.classList.contains("is-hidden")?d():b())}function y(k,q){let E=n("toast"),P=n("toast-msg");!E||!P||(P.textContent=k,E.classList.toggle("tt-toast-warn",q==="warning"||q==="error"),E.classList.remove("hidden"),setTimeout(()=>E.classList.add("hidden"),2200))}function h(k){let q=$(k);q&&(r=q)}async function u(){let k=$(e.toolOrder);if(k){r=k;return}if(!e.zeusApiUrl)return;let q=Number(e.toolOrderTimeoutMs),E=Number.isFinite(q)&&q>0?q:3e3,P=typeof AbortController<"u"?new AbortController:null,O=P?setTimeout(()=>{try{P.abort()}catch{}},E):null;try{let N=await ye("/api/tool-order",e,P?{signal:P.signal}:{}),J=$(await N.json());J&&(r=J)}catch{}finally{O!=null&&clearTimeout(O)}}function T(k,q){if(!q)return;let E={...q};k&&!E.question&&(E.question=k),!(!E.trace&&!E.debug)&&(h(E.tool_order),s=E.chat_id||s,l.pushEntry(E),a||d())}function j(k){l.setEntries(k)}function x(){l.clear()}function L(){return l.getBundle()}n("debug-toggle")?.addEventListener("click",_),n("debug-close")?.addEventListener("click",b);let A=n("debug-panel-version");if(A){let k=lt();A.textContent=k.startsWith("v")?k:`v${k}`,A.setAttribute("title",`zeus_client_chat_trace ${k}`)}a&&d();let M=u();return{appendTraceCard:T,openDebugPanel:d,closeDebugPanel:b,setEntries:j,clear:x,exportBundle:L,setJobMode:k=>l.setJobMode(k),setToolOrder:h,readyToolOrder:M,version:lt()}}var Qe=`<button
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
      <div class="tt-detail flex flex-col min-w-0 min-h-0 overflow-visible flex-1">
        <div class="tt-detail-head px-3 pt-2.5 pb-1.5 border-b border-base-300" id="tt-detail-head"></div>
        <div class="tt-diagnosis alert mx-3 mt-2" id="tt-diagnosis" hidden></div>
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
`;var Ye=`/* Zeus Tracer \u2014 overlay/docked chrome + inspector extras (DaisyUI in shadow). */

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
  margin-left: 8px;
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
  padding: 8px 12px; /* DaisyUI full.min.css has no Tailwind px-3 / py-2 */
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
  white-space: nowrap;
  flex-wrap: nowrap;
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
  position: relative; /* static ignores z-index */
  z-index: 100000; /* above overlay host 99999 when they share a context */
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

.tt-detail { display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: visible; flex: 1; }

/* Shadow has no Tailwind z-* JIT; DaisyUI .tab is position:relative and later in the tree. */
.tt-turn-picker {
  position: relative;
  z-index: 20;
}
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
  z-index: 50;
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
}
.tt-diagnosis .eyebrow { display: flex; gap: 8px; align-items: center; font-size: 11px; margin-bottom: 6px; }
.tt-diagnosis h3 { font-size: 14px; font-weight: 700; margin: 0 0 4px; }
.tt-diagnosis .detail { font-size: 12px; margin: 0 0 8px; line-height: 1.4; }
.tt-diagnosis .hero-actions, .hero-actions { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.idchip {
  font-family: var(--tt-mono); font-size: 10px; padding: 2px 7px; border-radius: 6px;
  border: 1px solid oklch(var(--b3)); background: oklch(var(--b2)); cursor: pointer;
}
.idchip b { font-weight: 600; margin-right: 4px; opacity: 0.7; }

.tt-panel .tt-tabs {
  position: relative;
  z-index: 0;
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
.io-card > header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid oklch(var(--b3));
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.io-card .ml-auto,
.tt-decomp .ml-auto,
.io-card > header .ml-auto { margin-left: auto; }
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
.tt-panel .det-card h3 .sub { font-weight: 400; color: oklch(var(--bc) / 0.65); font-size: 11px; }
.tt-panel .card-title {
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}
.tt-panel h2.card-title > span {
  font-weight: 400;
  font-size: 0.875rem;
  color: oklch(var(--bc) / 0.6);
}
.tt-panel .card-body {
  padding: 1rem;
  gap: 0.5rem;
}
.tt-panel .card-body :where(p) { flex-grow: 0; }
.tt-panel .card.border,
.tt-panel .border.border-base-300,
.tt-panel .io-card.border {
  border-width: 1px;
  border-style: solid;
}
.tt-panel .border-error\\/40 { border-color: oklch(var(--er) / 0.4); }
.tt-panel .border-warning\\/40 { border-color: oklch(var(--wa) / 0.4); }
.tt-panel .border-success\\/40 { border-color: oklch(var(--su) / 0.4); }
.tt-panel .border-l-4 { border-left-width: 4px; border-left-style: solid; }

.tt-panel .det-env {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 16px;
  font-size: 12px;
  margin: 0;
  overflow-x: auto;
}
.tt-panel .det-env dt { color: oklch(var(--bc) / 0.5); }
.tt-panel .det-env dd { margin: 0; font-family: var(--tt-mono); font-size: 11px; word-break: break-word; }
.tt-panel .det-env .tt-copy-id,
.tt-panel .det-env .tt-copy-id-val {
  white-space: nowrap;
  word-break: normal;
  overflow-wrap: normal;
}
.tt-copy-id {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  max-width: 100%;
}
.tt-copy-id-val {
  font-family: var(--tt-mono);
  font-size: 11px;
}
.tt-panel .tt-copy-id .btn,
.tt-panel .tt-copy-id .btn-square {
  height: 1.25rem;
  width: 1.25rem;
  min-height: 0;
  padding: 0;
  flex-shrink: 0;
}
.tt-panel .tt-copy-id .inline-block {
  width: 0.875rem;
  height: 0.875rem;
  display: inline-block;
}
.tt-panel .tt-copy-id svg {
  display: block;
  width: 100%;
  height: 100%;
}

.tt-panel .diag-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 520px) {
  .tt-panel .diag-grid { grid-template-columns: 1fr 1fr; }
}

.tt-panel .env-kpi {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  border: 1px solid oklch(var(--b3));
  border-radius: 6px;
  background: oklch(var(--b2));
  padding: 10px 12px;
  margin-top: 10px;
}
@media (min-width: 520px) {
  .tt-panel .env-kpi { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.tt-panel .stat.kpi-tile,
.tt-panel .kpi-tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 10px 12px;
  width: auto;
}
.tt-panel .stat-title.kpi-lbl,
.tt-panel .kpi-lbl {
  font-family: var(--tt-mono);
  font-size: 10px;
  line-height: 1.2;
  color: oklch(var(--bc) / 0.5);
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
}
.tt-panel .stat-value.kpi-val,
.tt-panel .kpi-val {
  font-family: var(--tt-mono);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tt-panel .pcl .verdict {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 10px 12px;
  border-radius: 6px;
}
.tt-panel .pcl .vsum { flex: 1; min-width: 160px; }
.tt-panel .pcl .vmeta { font: 11px var(--tt-mono); color: oklch(var(--bc) / 0.5); width: 100%; }
.tt-panel .pcl .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
.tt-panel .pcl .tile.fail { border-color: oklch(var(--er) / 0.5); }
.tt-panel .pcl .tile.warn { border-color: oklch(var(--wa) / 0.5); }
.tt-panel .pcl .tile.pass { border-color: oklch(var(--su) / 0.5); }
.tt-panel .pcl .tile .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.tt-panel .pcl .grp { font: 10px var(--tt-mono); color: oklch(var(--bc) / 0.5); text-transform: uppercase; }
.tt-panel .pcl .lab { font-size: 12px; font-weight: 600; margin: 0; }
.tt-panel .pcl .det { font: 11px var(--tt-mono); color: oklch(var(--bc) / 0.7); margin: 0; }
.tt-panel .pcl .fix { font-size: 11px; color: oklch(var(--p)); margin: 0; }
.tt-panel .pcl .tile .card-body { padding: 0.75rem; gap: 0.25rem; }
.tt-panel .hint { color: oklch(var(--bc) / 0.5); font-size: 12px; }
.playbook.empty-ok { color: oklch(var(--su)); font-size: 12px; }
.raw-card { min-height: 320px; }
.tt-panel .raw-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.tt-panel .raw-head .card-title { flex: 0 1 auto; }
.tt-panel .raw-head .ml-auto,
.tt-panel .raw-head #tt-raw-copy { margin-left: auto; }

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

/* DaisyUI 4.12 full.min.css is components only \u2014 no Tailwind JIT in shadow. */
.tt-panel .flex { display: flex; }
.tt-panel .inline-flex { display: inline-flex; }
.tt-panel .inline-block { display: inline-block; }
.tt-panel .grid { display: grid; }
.tt-panel .flex-col { flex-direction: column; }
.tt-panel .flex-wrap { flex-wrap: wrap; }
.tt-panel .flex-1 { flex: 1 1 0%; }
.tt-panel .shrink-0 { flex-shrink: 0; }
.tt-panel .items-center { align-items: center; }
.tt-panel .items-start { align-items: flex-start; }
.tt-panel .justify-between { justify-content: space-between; }
.tt-panel .gap-1 { gap: 0.25rem; }
.tt-panel .gap-1\\.5 { gap: 0.375rem; }
.tt-panel .gap-2 { gap: 0.5rem; }
.tt-panel .gap-2\\.5 { gap: 0.625rem; }
.tt-panel .gap-3 { gap: 0.75rem; }
.tt-panel .gap-x-4 { column-gap: 1rem; }
.tt-panel .gap-y-2 { row-gap: 0.5rem; }
.tt-panel .ml-auto { margin-left: auto; }
.tt-panel .m-0 { margin: 0; }
.tt-panel .mt-1 { margin-top: 0.25rem; }
.tt-panel .mt-2 { margin-top: 0.5rem; }
.tt-panel .mt-3 { margin-top: 0.75rem; }
.tt-panel .mt-4 { margin-top: 1rem; }
.tt-panel .mb-2 { margin-bottom: 0.5rem; }
.tt-panel .mb-3 { margin-bottom: 0.75rem; }
.tt-panel .mb-4 { margin-bottom: 1rem; }
.tt-panel .ml-1 { margin-left: 0.25rem; }
.tt-panel .p-0 { padding: 0; }
.tt-panel .p-3 { padding: 0.75rem; }
.tt-panel .p-4 { padding: 1rem; }
.tt-panel .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.tt-panel .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.tt-panel .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.tt-panel .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.tt-panel .min-w-0 { min-width: 0; }
.tt-panel .min-h-0 { min-height: 0; }
.tt-panel .min-w-\\[12rem\\] { min-width: 12rem; }
.tt-panel .w-fit { width: fit-content; }
.tt-panel .w-full { width: 100%; }
.tt-panel .w-4 { width: 1rem; }
.tt-panel .h-4 { height: 1rem; }
.tt-panel .w-3\\.5 { width: 0.875rem; }
.tt-panel .h-3\\.5 { height: 0.875rem; }
.tt-panel .w-5 { width: 1.25rem; }
.tt-panel .h-5 { height: 1.25rem; }
.tt-panel .grid-cols-1 { grid-template-columns: 1fr; }
.tt-panel .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tt-panel .grid-cols-\\[max-content_1fr\\] { grid-template-columns: max-content 1fr; }
.tt-panel .overflow-x-auto { overflow-x: auto; }
.tt-panel .overflow-auto { overflow: auto; }
.tt-panel .whitespace-nowrap { white-space: nowrap; }
.tt-panel .font-mono { font-family: var(--tt-mono); }
.tt-panel .font-semibold { font-weight: 600; }
.tt-panel .font-medium { font-weight: 500; }
.tt-panel .font-normal { font-weight: 400; }
.tt-panel .font-bold { font-weight: 700; }
.tt-panel .uppercase { text-transform: uppercase; }
.tt-panel .tracking-wide { letter-spacing: 0.04em; }
.tt-panel .text-xs { font-size: 12px; line-height: 1.4; }
.tt-panel .text-sm { font-size: 13px; line-height: 1.4; }
.tt-panel .text-base { font-size: 1rem; line-height: 1.4; }
.tt-panel .text-lg { font-size: 1.125rem; line-height: 1.4; }
.tt-panel .text-xl { font-size: 1.25rem; line-height: 1.3; }
.tt-panel .text-\\[10px\\] { font-size: 10px; line-height: 1.2; }
.tt-panel .text-base-content\\/50 { color: oklch(var(--bc) / 0.5); }
.tt-panel .text-base-content\\/60 { color: oklch(var(--bc) / 0.6); }
.tt-panel .text-base-content\\/70 { color: oklch(var(--bc) / 0.7); }
.tt-panel .opacity-70 { opacity: 0.7; }
.tt-panel .opacity-80 { opacity: 0.8; }
.tt-panel .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (min-width: 640px) {
  .tt-panel .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tt-panel .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
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
`;fe(document.currentScript);var ft=[],Qt=!1;function Tr(){return{appendTraceCard(){},openDebugPanel(){},setEntries(){},clear(){},exportBundle(){return{traces:[]}},setJobMode(){}}}function jr(){Qt||(window.appendTraceCard=(...t)=>ft.push({type:"card",args:t}),window.openDebugPanel=()=>ft.push({type:"open"}))}function Cr(t){for(let e of ft)e.type==="open"?t.openDebugPanel():e.type==="card"&&t.appendTraceCard(...e.args);ft.length=0}var Ar="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css",qr="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";function Lr(){if(typeof document>"u"||!document.head||document.head.querySelector('link[data-zeus-trace-font="inter"]'))return;let e=document.createElement("link");e.rel="stylesheet",e.href=qr,e.setAttribute("data-zeus-trace-font","inter"),document.head.appendChild(e)}function Er(t){let e=t.mount==="docked",n=t.mountSelector,r;return e&&n&&(r=document.querySelector(n)),r?(r.style.display=r.style.display||"block",r.style.position=r.style.position||"relative",r.style.minHeight=r.style.minHeight||"320px"):(r=document.createElement("div"),r.id="zeus-trace-host",r.style.cssText=e?"all:initial;display:block;position:relative;width:100%;height:100%;min-height:320px;z-index:1;":"all:initial;display:block;position:fixed;inset:0;z-index:99999;pointer-events:none;",document.body.appendChild(r)),r.id||(r.id="zeus-trace-host"),{host:r,docked:e}}function Mr(){let t=ct();if(!t.enabled){let b=Tr();return window.appendTraceCard=b.appendTraceCard,window.openDebugPanel=b.openDebugPanel,ft.length=0,Qt=!0,{api:b,config:t}}let{host:e,docked:n}=Er(t),r=e.attachShadow({mode:"open"});Lr();let s=document.createElement("link");s.rel="stylesheet",s.href=Ar;let a=document.createElement("style");a.textContent=Ye;let l=document.createElement("div");l.className="zeus-trace-root bg-base-100 text-base-content",l.setAttribute("data-theme","light"),l.setAttribute("data-mount",n?"docked":"overlay"),l.style.pointerEvents="auto",l.innerHTML=Qe,r.append(s,a,l);let d=Ge(l,t);return window.appendTraceCard=d.appendTraceCard,window.openDebugPanel=d.openDebugPanel,window.ZeusTrace&&(window.ZeusTrace.setEntries=d.setEntries,window.ZeusTrace.clear=d.clear,window.ZeusTrace.exportBundle=d.exportBundle,window.ZeusTrace.setJobMode=d.setJobMode),Cr(d),Qt=!0,{api:d,config:t}}jr();var Yt,zr=new Promise(t=>{Yt=t});window.ZeusTrace={ready:zr,get config(){return Ht(ct())},get version(){return Ht(ct()).version}};var Xe=()=>{try{let{api:t,config:e}=Mr();Yt({api:t,config:e})}catch(t){console.error("[ZeusTrace] Failed to mount widget:",t),Yt({api:null,config:null,error:t})}};document.body?Xe():document.addEventListener("DOMContentLoaded",Xe);})();
//# sourceMappingURL=zeus_client_chat_trace.js.map
