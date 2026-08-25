(()=>{var ze=Object.defineProperty;var Le=(t,r)=>{for(var o in r)ze(t,o,{get:r[o],enumerable:!0})};var Me="http://localhost:8080";var He="1.0.0",wt=null;function Ut(t){wt=t}function et(){return He||"dev"}function J(t){if(!t)return null;if(typeof t=="object"&&!Array.isArray(t))return{v1:Array.isArray(t.v1)?t.v1:[],v2:Array.isArray(t.v2)?t.v2:[]};if(typeof t=="string")try{return J(JSON.parse(t))}catch{return null}return null}function Bt(t){if(t===!0||t===!1)return t;if(t==null||t==="")return null;let r=String(t).trim().toLowerCase();return["1","true","yes","on"].includes(r)?!0:["0","false","no","off"].includes(r)?!1:null}function Oe(t){try{let r=t!==void 0?t:typeof location<"u"?location.search:"",o=r.startsWith("?")||r===""?r:`?${r}`;return Bt(new URLSearchParams(o).get("debug"))}catch{return null}}function Ne(t={}){let r=t.fromWindow!==void 0?t.fromWindow||{}:(typeof window<"u"?window.ZeusTraceConfig:null)||{},o=t.script!==void 0?t.script:wt||(typeof document<"u"?document.currentScript:null),e=Bt(r.enabled!==void 0?r.enabled:o?.dataset?.enabled);if(e!==null)return e;let l=Oe(t.search);return l!==null?l:!1}function at(t={}){let r=t.fromWindow!==void 0?t.fromWindow||{}:window.ZeusTraceConfig||{},o=t.script!==void 0?t.script:wt||document.currentScript,e=(r.zeusApiUrl||o?.dataset?.zeusApiUrl||Me||"").replace(/\/$/,""),l=(r.hubBaseUrl||o?.dataset?.hubBaseUrl||"").replace(/\/$/,""),c=String(r.mount||o?.dataset?.mount||"overlay").toLowerCase()==="docked"?"docked":"overlay",u=(r.mountSelector||o?.dataset?.mountSelector||"").trim();return{zeusApiUrl:e,hubBaseUrl:l,zeusAuthToken:r.zeusAuthToken||o?.dataset?.zeusAuthToken||""||"",toolOrder:J(r.toolOrder??o?.dataset?.toolOrder),enabled:Ne({fromWindow:r,script:o,search:t.search}),mount:c,mountSelector:u}}function jt(t){return{zeusApiUrl:t.zeusApiUrl,hubBaseUrl:t.hubBaseUrl,toolOrder:t.toolOrder,enabled:!!t.enabled,mount:t.mount||"overlay",mountSelector:t.mountSelector||"",version:et()}}function Pt(t,r,o={}){let e={};r.zeusAuthToken&&(e.Authorization=`Bearer ${r.zeusAuthToken}`);let l={headers:e};return o.signal&&(l.signal=o.signal),fetch(`${r.zeusApiUrl}${t}`,l)}var gt={};Le(gt,{asDisplayText:()=>Z,attachPipelineCostsToSteps:()=>pt,decompositionCardHTML:()=>Xe,detectiveCheckSummary:()=>dt,detectivePromptChecks:()=>ct,escapeHtml:()=>F,expandTraceSpans:()=>Xt,extractDecomposition:()=>Qe,extractGather:()=>bt,extractJobUnits:()=>rr,extractStepCosts:()=>D,fmtBytes:()=>De,fmtMs:()=>Gt,fmtTokens:()=>Ue,formatDetectiveOverview:()=>lt,hubDebugReqUrl:()=>Ye,hubDebugSessionUrl:()=>tr,isMultiAgentTrace:()=>er,jsnviewOptions:()=>ee,mountJsnviewViewer:()=>Ge,normalizeHubBase:()=>Et,pipelineSpansFromStep:()=>Qt,prettyJSON:()=>Kt,shortId:()=>Fe,synthesizeTraceSpans:()=>ut,tallyToolCalls:()=>te,tokenTotal:()=>K,toolFrequencyChartHTML:()=>$e,traceMetrics:()=>At,traceWallMs:()=>Ct,tryParseJSON:()=>rt,waterfallHTML:()=>We});var qt="https://cdn.jsdelivr.net/npm/jsnview@3.0.0/dist/index.min.js",G=null;function Zt(){return window.jsnview?Promise.resolve(window.jsnview):G||(G=new Promise((t,r)=>{let o=()=>{if(window.jsnview){t(window.jsnview);return}G=null,r(new Error("jsnview loaded but window.jsnview is missing"))},e=a=>{G=null,r(new Error(a||"Failed to load jsnview"))};document.querySelectorAll(`script[src="${qt}"]`).forEach(a=>{if(a.dataset.jsnviewFailed==="1")try{a.remove()}catch{}});let l=document.querySelector(`script[src="${qt}"]`);if(l){if(window.jsnview){o();return}let a=()=>{l.removeEventListener("error",c),o()},c=()=>{l.dataset.jsnviewFailed="1",l.removeEventListener("load",a);try{l.remove()}catch{}e("Failed to load jsnview")};if(l.addEventListener("load",a),l.addEventListener("error",c),l.dataset.loaded==="1"){l.removeEventListener("load",a),l.removeEventListener("error",c),l.dataset.jsnviewFailed="1";try{l.remove()}catch{}Jt(o,e)}return}Jt(o,e)}),G)}function Jt(t,r){let o=document.createElement("script");o.src=qt,o.async=!0,o.onload=()=>{o.dataset.loaded="1",t()},o.onerror=()=>{o.dataset.jsnviewFailed="1";try{o.remove()}catch{}r("Failed to load jsnview")},document.head.appendChild(o)}function F(t){return String(t).replace(/[&<>]/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[r])}function Z(t){if(t==null||t==="")return"";let r=typeof t;return r==="string"?t:r==="number"&&isFinite(t)?String(t):r==="boolean"?t?"true":"false":""}function Re(t){if(!t||typeof t!="object"||Array.isArray(t))return"";let r=[];if(t.hop_count!=null&&t.hop_count!==""){let e=Number(t.hop_count);isFinite(e)&&r.push(e+" hop"+(e===1?"":"s"))}if(t.rounds!=null&&t.rounds!==""){let e=Number(t.rounds);isFinite(e)&&r.push(e+" round"+(e===1?"":"s"))}t.total_ms!=null&&t.total_ms!==""&&r.push(Gt(t.total_ms));let o=K(t.tokens);return o>0&&r.push("tokens "+o.toLocaleString()),r.join(" \xB7 ")}function lt(t){if(!t)return"";let r=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,o=r.overview||t.overview||r.detail||t.detail||"";return typeof o=="string"?o:o&&typeof o=="object"?Re(o):Z(o)}function Ie(t){if(!t||typeof t!="object")return!0;let r=String(t.status||"").toLowerCase();if(r){if(["fail","error","err","failed","warn","warning"].includes(r))return!1;if(["pass","ok","healthy","clear"].includes(r))return!0}return!(t.ok===!1||t.pass===!1)}function Vt(t){if(typeof t=="string")return{ok:!0,lab:t,status:"pass"};let r=Z(t&&t.status).toLowerCase();return{ok:Ie(t),lab:Z(t&&(t.lab||t.label||t.name)||"?")||"?",status:r}}function ct(t){if(!t)return[];let r=t.prompt||t.prompt_check||t.checklist;return Array.isArray(r)?r.map(Vt):r&&Array.isArray(r.items)?r.items.map(Vt):[]}function dt(t){let r=Array.isArray(t)?t:[],o=r.length,e=r.filter(a=>a&&a.ok).length;if(!o)return{passed:0,total:0,label:"",tone:""};let l=e===o;return{passed:e,total:o,label:e+"/"+o+(l?" PASSED":" FAILED"),tone:l?"ok":"err"}}function Gt(t){let r=Number(t)||0;return r>=1e3?(r/1e3).toFixed(2)+"s":r+"ms"}function De(t){let r=Number(t)||0;return r<1024?r+"B":r<1024*1024?(r/1024).toFixed(1)+"kB":(r/(1024*1024)).toFixed(1)+"MB"}function Fe(t,r){if(r=r??10,!t)return"";let o=String(t);return o.length>r?o.slice(0,r)+"\u2026":o}function Kt(t){try{return JSON.stringify(t,null,2)}catch{return String(t)}}function rt(t){if(t==null||t==="")return null;if(typeof t=="object")return t;try{return JSON.parse(t)}catch{return null}}function K(t){if(t==null||t==="")return 0;if(typeof t=="number")return isFinite(t)?t:0;if(typeof t=="string"){let a=Number(t);return isFinite(a)?a:0}if(typeof t!="object")return 0;let r=t.total!=null?t.total:t.total_tokens;if(r!=null&&r!==""){let a=Number(r);if(isFinite(a)&&a>0)return a}let o=Number(t.prompt!=null?t.prompt:t.prompt_tokens)||0,e=Number(t.completion!=null?t.completion:t.completion_tokens)||0;if(o||e)return o+e;let l=Number(r);return isFinite(l)?l:0}function Ue(t){let r=K(t);return r>0?r.toLocaleString():"?"}function At(t){t=t||{};let r=0,o=0,e=0,l=0;(t.steps||[]).forEach(u=>{(u.type==="llm"||u.type==="llm_error")&&(r+=u.ms||0),u.type==="tool"&&(o+=u.ms||0,l+=u.bytes||0),u.usage&&(e+=K(u.usage))}),t.ai_ms!=null&&(r=t.ai_ms),(t.zeus_ms!=null||t.tool_ms!=null)&&(o=t.zeus_ms!=null?t.zeus_ms:t.tool_ms),t.tokens!=null&&(e=K(t.tokens));let a=t.total_ms||Ct(t)||r+o,c=Math.max(0,a-r-o);return{total:a,aiMs:r,zeusMs:o,other:c,tokens:e,bytes:l}}function Qt(t,r,o){let e=o&&o.pipeline_step_costs,l={};if(!e||!e.length){let v=o&&(o.result_full||o.result)||"";try{let w=typeof v=="string"?JSON.parse(v):v;l=w&&w.meta||{},e=l.step_costs}catch{e=null}}if(!Array.isArray(e)||!e.length)return null;let a={};(o&&o.args&&o.args.steps||o&&o.pipeline_json&&o.pipeline_json.steps||[]).forEach(v=>{v&&(v.name||v.as)&&(a[v.name||v.as]=v.verb||"")});let u=[],f=0;e.forEach(v=>{let w=v.as||v.name||"step",j=a[w]||"",T=v.ms||0,h="pipeline."+w;j&&(h+="."+j);let d=[];v.cost!=null&&d.push("cost "+v.cost),v.result_size!=null&&d.push(v.result_size+" rows"),v.status&&d.push(v.status),u.push({name:h,cls:"tool",at:(t||0)+f,ms:T,detail:d.join(" \xB7 ")||null,pipeline:!0}),f+=T});let _=(r||0)-f;return _>0&&u.push({name:"pipeline.overhead",cls:"tool",at:(t||0)+f,ms:_,detail:"HTTP / orchestration",pipeline:!0}),u}function Xt(t,r){let o=(r||[]).filter(a=>a.type==="tool"&&a.name==="pipeline"),e=0,l=[];return(t||[]).forEach(a=>{if(a.name!=="tool.pipeline"){l.push(a);return}let c=Qt(a.at,a.ms,o[e++]);c?l.push(...c):l.push(a)}),l}function Be(t,r){if(!t||r<0||r>=t.length||t[r]!=="[")return null;let o=0,e=!1,l=!1;for(let a=r;a<t.length;a++){let c=t[a];if(e){l?l=!1:c==="\\"?l=!0:c==='"'&&(e=!1);continue}if(c==='"'){e=!0;continue}if(c==="[")o++;else if(c==="]"&&(o--,o===0))try{let u=JSON.parse(t.slice(r,a+1));return Array.isArray(u)?u:null}catch{return null}}return null}function D(t){if(t==null||t==="")return null;if(Array.isArray(t))return t.length?t:null;if(typeof t=="object"){if(Array.isArray(t.step_costs)&&t.step_costs.length)return t.step_costs;let l=t.meta||t.data&&t.data.meta||{};if(Array.isArray(l.step_costs)&&l.step_costs.length)return l.step_costs;let a=t.data&&typeof t.data=="object"?D(t.data):null;return a||null}let r=String(t);try{return D(JSON.parse(r))}catch{}let o=r.search(/"step_costs"\s*:/);if(o<0)return null;let e=r.indexOf("[",o);return Be(r,e)}function Tt(t){return t&&(t.verb||t.name||t.tool)||"hop"}function pt(t,r){let o=(t||[]).map(c=>c&&typeof c=="object"?Object.assign({},c):c),e={},l=[];(r||[]).forEach(c=>{!c||typeof c!="object"||(c.req_id&&(e[String(c.req_id)]=c),Tt(c)==="pipeline"&&l.push(c))});let a=0;return o.forEach(c=>{if(!c||c.type!=="tool"||c.name!=="pipeline"||Array.isArray(c.pipeline_step_costs)&&c.pipeline_step_costs.length)return;let u=c.req_id&&e[String(c.req_id)]||l[a]||null;Tt(c)==="pipeline"&&a++;let f=D(c.pipeline_step_costs)||D(c.result_full||c.result)||u&&(D(u.step_costs)||D(u.snippet)||D(u.res)||D(u.body));f&&f.length&&(c.pipeline_step_costs=f)}),o}function U(t){let r=Number(t);return isFinite(r)&&r>0?r:0}function Ct(t){let r=t||{},o=U(r.total_ms);if(o)return o;let e=r.detective&&typeof r.detective=="object"?r.detective:{},l=e.overview&&typeof e.overview=="object"?e.overview:{},a=U(l.total_ms);if(a)return a;let c=e.diagnosis&&e.diagnosis.slow;return U(c&&c.total_ms)}function Pe(t,r){let o=0;return(t||[]).forEach(e=>{!e||typeof e!="object"||(o+=U(e.ms!=null?e.ms:e.duration_ms))}),o||((r||[]).forEach(e=>{e&&e.type==="tool"&&(o+=U(e.ms))}),o)}function Wt(t,r){let o=Number(r)||0;return o?(t||[]).map(e=>e&&typeof e=="object"?Object.assign({},e,{at:(e.at||0)+o}):e):t||[]}function Yt(t){return t&&(t.type==="llm"||t.type==="llm_error"||t.type==="force_final")}function Je(t){let r=[],o=0;return(t||[]).forEach(e=>{if(!Yt(e))return;let l=U(e.ms);if(!l)return;let a=e.type==="force_final"?"llm.force_final":"ai.chat.round."+(e.round!=null?e.round:r.length+1);r.push({name:a,cls:"ai",at:o,ms:l}),o+=l}),r}function Ze(t){let r=[],o=0;return(t||[]).forEach(e=>{if(!e||typeof e!="object"||e.type!=="tool")return;let l=e.name||"tool",a=U(e.ms);if(!a&&l!=="pipeline")return;let c=l==="pipeline"?"tool.pipeline":"tool."+l;r.push({name:c,cls:"tool",at:o,ms:a}),o+=a}),r}function Ve(t){let r=[],o=0;return(t||[]).forEach(e=>{if(!e||typeof e!="object")return;let l=Tt(e),a=U(e.ms!=null?e.ms:e.duration_ms),c=l==="pipeline"?"tool.pipeline":"tool."+l;r.push({name:c,cls:"tool",at:o,ms:a}),o+=a}),r}function ut(t,r,o){let e=t&&Array.isArray(t.spans)?t.spans:[];if(e.length)return e;let l=(()=>{let v=Ze(o);return v.length?v:Ve(r)})(),a=Je(o);if(a.length){let v=a.reduce((w,j)=>Math.max(w,(j.at||0)+(j.ms||0)),0);return a.concat(Wt(l,v))}let c=Ct(t),u=Pe(r,o),f=c>u?c-u:0,_=(o||[]).some(Yt);return f>0&&(_||c>=500)?[{name:"ai.chat.round.1",cls:"ai",at:0,ms:f}].concat(Wt(l,f)):l}function We(t,r,o){let e=Xt(t,o);if(!e.length)return"";let l=e.reduce((u,f)=>Math.max(u,(f.at||0)+(f.ms||0)),0),a=Math.max(Number(r)||0,l)||1,c='<div class="trace-waterfall">';return e.forEach(u=>{let f=Math.max(0,Math.min(100,(u.at||0)/a*100)),_=Math.max(.5,Math.min(100-f,(u.ms||0)/a*100)),v=u.pipeline?"tw-lab tw-lab-pipeline":"tw-lab",w=(u.ms||0)+" ms"+(u.detail?' <span class="tw-detail">\xB7 '+F(u.detail)+"</span>":"");c+='<div class="'+v+'" title="'+F(u.name)+'">'+F(u.name)+'</div><div class="tw-track"><i class="'+F(u.cls||"other")+'" style="left:'+f.toFixed(2)+"%;width:"+_.toFixed(2)+'%"></i></div><div class="tw-dur">'+w+"</div>"}),c+='<div class="tw-legend" style="grid-column:1/-1"><span><i class="sw ai"></i>ai \xB7 external LLM</span><span><i class="sw tool"></i>tool \xB7 zeus / pipeline step</span><span><i class="sw other"></i>other \xB7 dispatch / auth / rate / storage</span></div></div>',c}function te(t){let r={},o={},e=(l,a)=>{r[l]=(r[l]||0)+1;let c=a&&a.status;(c===0||typeof c=="number"&&c>=400)&&(o[l]=(o[l]||0)+1)};return(t||[]).forEach(l=>{if(l.type==="tool"){if(l.name==="pipeline"){let a=l.args&&l.args.steps||l.pipeline_json&&l.pipeline_json.steps||[],c={};a.forEach(f=>{f&&(f.name||f.as)&&(c[f.name||f.as]=f)});let u=l.pipeline_step_costs;if(!u||!u.length)try{let f=rt(l.result_full||l.result||"{}")||{};u=f.meta&&f.meta.step_costs}catch{u=null}u&&u.length?u.forEach(f=>{let _=f.as||f.name,v=c[_]&&c[_].verb||_;v&&e(v,l)}):a.forEach(f=>{f&&f.verb&&e(f.verb,l)});return}e(l.name||"?",l)}}),{counts:r,errs:o}}function $e(t,r,o){let{counts:e,errs:l}=te(t),a=Object.keys(e);if(!a.length)return"";let c=o||{v1:[],v2:[]},u=String(r||"v2").toLowerCase()==="v1"?"v1":"v2",f=c[u]||c.v1||[],_=new Set(f),v=f.slice();a.forEach(d=>{_.has(d)||v.push(d)});let w=0;v.forEach(d=>{w=Math.max(w,e[d]||0)});let j=78,T="",h="";return v.forEach(d=>{let A=e[d]||0,L=l[d]||0,C=w>0&&A>0?Math.max(2,Math.round(A/w*j)):0,x=!_.has(d),z=L>0?"b err":x?"b unknown":"b",k=d+" \xB7 "+A+" call"+(A===1?"":"s")+(L>0?" ("+L+" error"+(L===1?"":"s")+")":"")+(x?" \xB7 off-catalog":"");T+='<div class="vbar-col" title="'+F(k)+'"><div class="'+(A>0?"n":"n zero")+'">'+(A>0?A:"")+'</div><div class="'+z+'" style="height:'+C+'px"></div></div>',h+='<div class="'+(A>0?"l":"l zero")+'" title="'+F(d)+'">'+F(d)+"</div>"}),'<div class="trace-vbar mt-3"><h3 class="trace-vbar-title">Tool-call frequency vs. canonical order</h3><div class="vbar-wrap">'+T+'</div><div class="vbar-labels">'+h+'</div><div class="trace-vbar-hint">'+(u==="v2"?"x-axis = Zeus docs/API/V2 verbs (cheap left \u2192 expensive right) \xB7 grey = off-catalog":"x-axis = V1 tools from chat history \xB7 grey = off-catalog")+"</div></div>"}function ee(t){return{showType:!0,showFoldmarker:!0,showLen:!0,collapsed:!t,maxDepth:1/0}}async function Ge(t,r,o){if(t){t.innerHTML="";try{let e=await Zt(),a=new e(r,ee(!!o)).getElement();a.addEventListener("click",c=>{let u=c.target.closest(".jsv-toggle");if(!u)return;c.stopPropagation();let f=u.closest("li");if(!f)return;let _=[...f.children].find(v=>v.classList&&v.classList.contains("jsv-content"));_&&(c.preventDefault(),c.stopImmediatePropagation(),u.classList.toggle("-rotate-90"),_.classList.toggle("hidden"))},!0),t.appendChild(a)}catch{let e=document.createElement("pre");e.className="trace-pre",e.textContent=Kt(r),t.appendChild(e)}}}function re(){return{decomposition:null,query_decomposition:null,summary:"",confidence:"",policy_action:"",source:""}}function ft(t){return!!t&&typeof t=="object"&&!Array.isArray(t)}function $t(t){return ft(t)&&(Array.isArray(t.targets)||t.predicates!=null||t.output!=null)}function Ke(t){return ft(t)&&(t.intent!=null||t.entity!=null||t.entity_type!=null||t.geo!=null||t.theme!=null||t.audience!=null)}function O(t,r,o){ft(t)&&(!r.decomposition&&$t(t.decomposition)&&(r.decomposition=t.decomposition,r.source||(r.source=o)),!r.decomposition&&$t(t.query_understanding)&&(r.decomposition=t.query_understanding,r.source||(r.source=o)),!r.query_decomposition&&Ke(t.query_decomposition)&&(r.query_decomposition=t.query_decomposition,r.source||(r.source=o)),!r.summary&&typeof t.summary=="string"&&t.summary.trim()&&(r.summary=t.summary.trim()),!r.confidence&&typeof t.confidence=="string"&&(r.confidence=t.confidence),!r.policy_action&&typeof t.policy_action=="string"&&(r.policy_action=t.policy_action))}function ne(t){return t==null?null:typeof t=="string"?rt(t):typeof t=="object"?t:null}function St(t,r){if(!t)return;(Array.isArray(t)?t:[t]).forEach(e=>{if(!e||typeof e!="object")return;let l=e.message||e.choices&&e.choices[0]&&e.choices[0].message,a=e.tool_calls||l&&l.tool_calls||[];(Array.isArray(a)?a:[]).forEach(c=>{let u=c&&(c.function||c)||{},f=ne(u.arguments!=null?u.arguments:c&&c.arguments);f&&r(f)}),(e.decomposition||e.query_decomposition)&&r(e)})}function Qe(t){let r=re(),o=t&&t.trace||{},e=t&&t.structured||o.structured||{};return O(o.layer_a,r,"layer_a"),O(t&&t.layer_a,r,"layer_a"),O(o,r,"trace"),O(e.artifacts,r,"artifacts"),O(e.layer_a,r,"layer_a"),(o.steps||[]).forEach(l=>{O(l&&l.args,r,"steps"),O(ne(l&&(l.result_full||l.result)),r,"steps")}),(o.hops||t&&t.hops||[]).forEach(l=>{O(l&&(l.req||l.args||l.request),r,"hops"),O(l&&(l.res||l.result||l.body||l.response),r,"hops")}),St([].concat(o.ai_requests||[],o.ai_responses||[]),l=>O(l,r,"llm")),(t&&t.llmRounds?t.llmRounds:[]).forEach(l=>{St(l&&l.req,a=>O(a,r,"llm")),St(l&&l.res,a=>O(a,r,"llm"))}),r}function it(t,r){return'<span class="tt-decomp-chip">'+r(String(t))+"</span>"}function Xe(t,r){let o=r||F;if(t=t||re(),!t.decomposition&&!t.query_decomposition)return'<div class="tt-decomp empty">No decomposition on this turn.</div>';let e=t.decomposition||{},l=t.query_decomposition||{},a=Array.isArray(e.targets)?e.targets:[],c=e.predicates,u=e.output!=null?String(e.output):"",f="";t.confidence&&(f+='<span class="tt-badge info">confidence:'+o(t.confidence)+"</span>"),u&&(f+='<span class="tt-badge">output:'+o(u)+"</span>"),t.policy_action&&(f+='<span class="tt-badge">'+o(t.policy_action)+"</span>");let _=[];l.intent!=null&&_.push(it(l.intent,o)),["entity","entity_type","geo","audience","theme","occasion","price"].forEach(d=>{l[d]!=null&&l[d]!==""&&_.push('<span class="tt-decomp-kv"><span class="k">'+o(d)+"</span> "+o(String(l[d]))+"</span>")});let v=_.length?'<div class="tt-decomp-row"><div class="lab">Query</div><div class="val">'+_.join("")+"</div></div>":"",w=a.map(d=>{if(!d||typeof d!="object")return"";let A=d.entity_type||d.entity||"?",L=d.focus||d.fields||[],C=Array.isArray(L)?L.map(x=>it(x,o)).join(""):"";return'<div class="tt-decomp-row"><div class="lab">Target</div><div class="val"><strong>'+o(String(A))+"</strong> "+C+"</div></div>"}).join(""),j="";Array.isArray(c)?j=c.map(d=>{if(!d||typeof d!="object")return it(d,o);let A=d.field||d.path||"",L=d.op||"=",C=d.value!=null?d.value:"";return'<span class="tt-decomp-kv"><span class="k">'+o(String(A))+"</span> "+o(String(L))+" "+o(String(C))+"</span>"}).join(""):ft(c)&&(j=Object.keys(c).map(d=>'<span class="tt-decomp-kv"><span class="k">'+o(d)+"</span> = "+o(String(c[d]))+"</span>").join(""));let T=j?'<div class="tt-decomp-row"><div class="lab">Where</div><div class="val">'+j+"</div></div>":"",h=u?'<div class="tt-decomp-row"><div class="lab">Output</div><div class="val">'+it(u,o)+"</div></div>":"";return'<div class="tt-decomp"><header><span>Decomposition</span><span class="tt-decomp-badges">'+f+'</span><button type="button" class="tt-btn ghost ml-auto" id="tt-decomp-copy">Copy</button></header>'+(t.summary?'<p class="tt-decomp-summary">'+o(t.summary)+"</p>":"")+v+w+T+h+"</div>"}function Et(t){let r=String(t||"").trim();if(!r)return"";let o=r.indexOf("#");return o>=0&&(r=r.slice(0,o)),r=r.replace(/\/+$/,""),r=r.replace(/\/hub$/i,""),r.replace(/\/+$/,"")}function Ye(t,r){let o=Et(t);return!o||!r?"":o+"/hub/#/debug/req/"+encodeURIComponent(String(r))}function tr(t,r){let o=Et(t);return!o||!r?"":o+"/hub/debug/session/"+encodeURIComponent(String(r))}function bt(t,r){t=t&&typeof t=="object"?t:{},r=r&&typeof r=="object"?r:{};let o=t.session&&typeof t.session=="object"?t.session:{},e=t.detective&&typeof t.detective=="object"?t.detective:{},l=t.inject&&typeof t.inject=="object"?t.inject:e.prompt&&e.prompt.inject&&typeof e.prompt.inject=="object"?e.prompt.inject:{},a=t.catalog&&typeof t.catalog=="object"?t.catalog:{},c=t.target&&typeof t.target=="object"?t.target:{},u=t.layer_a&&typeof t.layer_a=="object"?t.layer_a:{},f=Array.isArray(t.hops)?t.hops:[],_=t.chat_id||o.chat_id||r.chat_id||"\u2014",v=t.turn_id||o.turn_id||"\u2014",w=t.session_id||o.id||o.session_id||r.session_id||"\u2014",j=t.preferred_req_id||o.preferred_req_id||"\u2014",T=Array.isArray(t.req_ids)?t.req_ids:Array.isArray(o.req_ids)?o.req_ids:f.map(M=>M&&(M.req_id||"")).filter(Boolean),h=f.map(M=>{let st=M&&(M.name||M.verb||M.path_class)||"?",$=M&&M.status!=null?M.status:"",X=M&&M.error?" err":"";return st+($!==""?":"+$:"")+X}),d=c.bucket||"\u2014",A=c.scope||"\u2014",L=c.collection||"\u2014",C=c.mode||r.mode||"\u2014",x=t.zeus_url||"\u2014",z=t.client_version||"\u2014",k=a.tools_count!=null?a.tools_count:"\u2014",E=t.contract_status||o.contract_status||r.contract_status||"\u2014",B=l.brief_sha12||a.brief_sha12||"\u2014",P=l.mini_sha12||a.mini_sha12||"\u2014",W=u.via||"\u2014",Q=u.confidence||"\u2014",ht=u.policy_action||"\u2014",N=t.tokens&&typeof t.tokens=="object"?t.tokens:{},ot=t.export_ref||t.turn_id||"\u2014";return[{id:"ids",label:"1. Ids",value:"chat "+_+" \xB7 turn "+v+" \xB7 sess "+w},{id:"hops",label:"2. Hops",value:"preferred "+j+(T.length?" \xB7 "+T.join(", "):"")+(h.length?" \xB7 "+h.join(" \xB7 "):"")},{id:"target",label:"3. Target",value:x+" \xB7 "+d+"/"+A+"/"+L+" \xB7 "+C+" \xB7 client "+z},{id:"catalog",label:"4. Catalog",value:"brief="+(a.has_scope_brief===!0?"yes":a.has_scope_brief===!1?"no":"\u2014")+" \xB7 mini="+(a.has_mini_schema===!0?"yes":a.has_mini_schema===!1?"no":"\u2014")+" \xB7 tools="+k+" \xB7 contract="+E},{id:"inject",label:"5. Inject",value:"brief_sha "+B+" \xB7 mini_sha "+P},{id:"hoperr",label:"6. Hop table",value:h.length?h.join(" \xB7 "):"(no hops)"},{id:"layer",label:"7. Layer A",value:"via="+W+" \xB7 conf="+Q+" \xB7 policy="+ht},{id:"tokens",label:"8. Tokens",value:(N.prompt!=null?N.prompt:"?")+" / "+(N.completion!=null?N.completion:"?")+" / "+(N.total!=null?N.total:K(N)||"?")+(N.ok===!1?" \xB7 ok=false":"")},{id:"export",label:"9. Journal",value:String(ot)}]}function er(t,r){let o=t&&typeof t=="object"?t:{},e=r&&typeof r=="object"?r:{};if(o.multi_agent===!0||e.multi_agent===!0)return!0;let l=o.engine||e.engine||"";if(l==="local_units"||l==="sidecar")return!0;let a=o.units||o.unit_summaries||e.units;return Array.isArray(a)&&a.length>0}function rr(t,r){let o=t&&typeof t=="object"?t:{},e=r&&typeof r=="object"?r:{},l=o.units||o.unit_summaries||e.units||[];return Array.isArray(l)?l.map((a,c)=>{let u=a&&typeof a=="object"?a:{},f=Array.isArray(u.req_ids)?u.req_ids.filter(Boolean).map(String):[],_=Array.isArray(u.hops)?u.hops:f.map((j,T)=>({req_id:j,verb:u.kind==="zeus_direct"?"find":"unit",status:u.status==="error"||u.status==="err"?500:200,ms:u.ms||0,bytes:null,preferred:T===0,req:u.call||{},res:{}})),v=String(u.status||"ok"),w=v==="error"||v==="err"||!!u.error_code;return{unit_id:String(u.unit_id||"u"+(c+1)),status:w?"err":v==="partial"||v==="warn"?"warn":"ok",kind:u.kind||"agent_turn",goal:u.goal||"",stuffed_goal:u.stuffed_goal||"",synth:!!u.synth,wave:Number(u.wave)||(u.synth?2:1),catalog_mode:u.catalog_mode||"",has_inject:!!u.has_inject,answer:u.answer||"",req_ids:f,error_code:u.error_code||"",hops:_,llm:Array.isArray(u.llm)?u.llm:Array.isArray(u.llmRounds)?u.llmRounds:[]}}):[]}var se=["wish_i_knew","jail_break_attempt","hooks_jailbreak_score"],nr=["chat_id","turn_id","session_id","req_ids","zeus_url","client_version","target","catalog","contract_status","tokens","export_ref","stamp"];function zt(t){if(!t||typeof t!="object")return t;if(Array.isArray(t))return t.map(zt);let r={};return Object.keys(t).forEach(o=>{se.includes(o)||(r[o]=zt(t[o]))}),r}function oe(t){if(!t||typeof t!="object"||Array.isArray(t))return t;let r={...t};return se.forEach(o=>{delete r[o]}),Array.isArray(r.business_rules_triggers)&&delete r.business_rules_triggers,r}function or(t){if(!t||typeof t!="object")return{};let r={...t.public_trace&&typeof t.public_trace=="object"?t.public_trace:{}};if(t.detective!=null&&(r.detective=t.detective),t.preferred_req_id){r.preferred_req_id=t.preferred_req_id;let o=r.session&&typeof r.session=="object"?{...r.session}:{};o.preferred_req_id=t.preferred_req_id,r.session=o}if(t.hops!=null&&!r.hops)try{r.hops=Array.from(t.hops)}catch{r.hops=t.hops}if(t.notes!=null&&!r.notes)try{r.notes=Array.from(t.notes)}catch{r.notes=t.notes}return nr.forEach(o=>{t[o]!=null&&r[o]==null&&(r[o]=t[o])}),t.rounds!=null&&r.rounds==null&&(r.rounds=t.rounds),r}function mt(t){if(!t||typeof t!="object")return null;let r=t;if(!r.trace&&r.debug&&(r={...r,trace:or(r.debug)}),!r.trace||typeof r.trace!="object")return null;let o=zt({...r.trace});return o.layer_a&&(o.layer_a=oe(o.layer_a)),r.layer_a&&(r={...r,layer_a:oe(r.layer_a)}),o.question==null&&r.question,{...r,trace:o}}function sr(t){if(!t||typeof t!="object")return"";let r=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,o=String(r.grade||t.diagnosis_grade||r.status||t.grade||"").toLowerCase();if(["fail","error","err","failed"].includes(o))return"fail";if(["warn","warning"].includes(o))return"warn";if(["pass","ok","healthy","clear"].includes(o))return"pass";let e=t.playbooks||r.playbooks||[];return Array.isArray(e)&&e.length?"warn":"pass"}function ar(t){if(!t||typeof t!="object")return"";let r=t.prompt||t.prompt_check||{};return String(t.prompt_grade||r.grade||(r.ok===!1?"warn":r.ok?"pass":"")).toLowerCase()}function ir(t){if(!t)return"";let r=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,o=r.headline||t.headline||r.summary||t.summary||r.title||"";return Z?Z(o):typeof o=="string"?o:""}function lr(t){if(lt)return lt(t)||"";if(!t)return"";let r=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,o=r.overview||t.overview||r.detail||t.detail||"";return typeof o=="string"?o:""}function cr(t){if(!t)return[];let r=t.diagnosis&&typeof t.diagnosis=="object"?t.diagnosis:t,o=t.playbooks||r.playbooks||[];return Array.isArray(o)?o.map((e,l)=>typeof e=="string"?{id:e,title:e,body:e,tip:e}:{id:e.id||e.name||"pb_"+(l+1),title:e.title||e.name||e.id||"Playbook",body:e.body||e.tip||e.message||e.description||"",tip:e.tip||e.body||""}):[]}function dr(t,r,o){return Array.isArray(t.hops)&&t.hops.length?t.hops.map(e=>({req_id:e.req_id||e.id||"",verb:e.verb||e.name||e.tool||"?",status:e.status!=null?e.status:e.http_status!=null?e.http_status:0,ms:e.ms!=null?e.ms:e.duration_ms!=null?e.duration_ms:0,bytes:e.bytes!=null?e.bytes:e.byte_size!=null?e.byte_size:null,preferred:!!(e.preferred||o&&(e.req_id===o||e.id===o)),req:e.req!=null?e.req:e.request!=null?e.request:e.args!=null?e.args:{},res:e.res!=null?e.res:e.response!=null?e.response:e.result!=null?e.result:e.body!=null?e.body:{},snippet:e.snippet||"",step_costs:Array.isArray(e.step_costs)?e.step_costs:null,body:e.body!=null?e.body:null,url:e.url||"",error:e.error||"",path_class:e.path_class||e.name||e.verb||""})):(r||[]).filter(e=>e&&e.type==="tool").map(e=>{let l=rt(e.result_full||e.result);return{req_id:e.req_id||"",verb:e.name||"?",status:e.status!=null?e.status:0,ms:e.ms||0,bytes:e.bytes!=null?e.bytes:null,preferred:!!(o&&e.req_id===o),req:e.args||e.pipeline_json||{},res:l||(e.result!=null?{preview:String(e.result).slice(0,2e3)}:{})}})}function pr(t,r){let o=t.ai_requests||[],e=t.ai_responses||[],l=Math.max(o.length,e.length);return l?Array.from({length:l},(a,c)=>({round:c+1,call:c+1,kind:"llm",label:"Round "+(c+1),finish:e[c]&&(e[c].finish_reason||e[c].finish)||"",tok_in:o[c]&&o[c].usage&&o[c].usage.prompt_tokens||e[c]&&e[c].usage&&e[c].usage.prompt_tokens,tok_out:e[c]&&e[c].usage&&e[c].usage.completion_tokens,tok_total:e[c]&&e[c].usage&&e[c].usage.total_tokens||o[c]&&o[c].usage&&o[c].usage.total_tokens,req:o[c]||{},res:e[c]||{}})):(r||[]).filter(a=>a&&(a.type==="llm"||a.type==="llm_error"||a.type==="force_final")).map((a,c)=>{let u=a.type||"llm",f=u==="force_final",_=u==="llm_error",v=a.round!=null?a.round:c+1;return{round:v,call:c+1,kind:u,label:f?"force_final":"Round "+v,finish:f?a.cause||a.finish_reason||"force_final":a.finish_reason||(_?"error":""),tok_in:a.usage&&a.usage.prompt_tokens,tok_out:a.usage&&a.usage.completion_tokens,tok_total:a.usage&&a.usage.total_tokens,req:f?{type:"force_final",cause:a.cause,content_len:a.content_len,ms:a.ms,model:a.model}:{tool_calls:a.tool_calls,ms:a.ms,model:a.model},res:_?{error:a.detail}:f?{type:"force_final",cause:a.cause,content_len:a.content_len,finish_reason:a.finish_reason,usage:a.usage}:{tool_calls:a.tool_calls,finish_reason:a.finish_reason,usage:a.usage}}})}function ur(t,r){return t&&t.created!=null?"c:"+t.created+":"+r:t&&t.trace&&t.trace.turn_id?"t:"+t.trace.turn_id:"i:"+r}function fr(t,r){let o={...r},e=t.tokens&&typeof t.tokens=="object"?t.tokens:null;if(e)o.tokensIn=Number(e.prompt)||0,o.tokensOut=Number(e.completion)||0,o.tokensCached=Number(e.cached)||0,o.hasIn=e.prompt!=null,o.hasOut=e.completion!=null,o.hasTokens=!!(e.ok||e.total!=null||e.prompt!=null||e.completion!=null),e.total!=null&&(o.tokens=Number(e.total)||o.tokens);else{let l=0,a=0,c=!1,u=!1;(t.steps||[]).forEach(f=>{let _=f&&f.usage;_&&(_.prompt_tokens!=null&&(l+=Number(_.prompt_tokens)||0,c=!0),_.completion_tokens!=null&&(a+=Number(_.completion_tokens)||0,u=!0))}),o.tokensIn=l,o.tokensOut=a,o.tokensCached=0,o.hasIn=c,o.hasOut=u,o.hasTokens=o.tokens>0||c||u}return o}function br(t){return(Array.isArray(t.notes)?t.notes:[]).map(String).filter(o=>o.startsWith("semantic_cache."))}function Lt(t,r){let o=mt(t)||t||{},e=o.trace||{},l=Array.isArray(e.steps)?e.steps:[],a=e.session&&typeof e.session=="object"?e.session:{},c=o.session_id||e.session_id||a.id||a.session_id||"",u=e.preferred_req_id||a.preferred_req_id||o.preferred_req_id||"",f=e.detective&&typeof e.detective=="object"?e.detective:null,_=At(e)||{total:0,aiMs:0,zeusMs:0,other:0,tokens:0,bytes:0},v=fr(e,_),w=dr(e,l,u),j=Array.isArray(e.hops)&&e.hops.length?e.hops:w,T=pt?pt(l,j):l,h=w.filter(k=>(Number(k.status)||0)>=400).length,d=sr(f),A=ct?ct(f):[],L="ok";o.session_error||d==="fail"?L="err":(h||d==="warn")&&(L="warn"),o.session_error&&(L="err");let C=e.catalog&&typeof e.catalog=="object"?e.catalog:{},x=e.inject&&typeof e.inject=="object"?e.inject:{},z=e.stamp&&typeof e.stamp=="object"?e.stamp:{};return{key:ur(o,r),index:r,question:o.question||e.question||"(loaded turn)",answer:o.answer||e.answer||"",status:L,api_version:o.api_version||e.api_version||"v2",mode:o.mode||C&&C.source||e.target&&e.target.mode||"",target:typeof o.target=="string"?o.target:e.target&&typeof e.target=="object"?[e.target.bucket,e.target.scope,e.target.collection].filter(Boolean).join("/"):typeof e.target=="string"?e.target:"",provider:o.provider||"",model:o.model||"",session_id:c,session_round:o.session_round!=null?o.session_round:a.round!=null?a.round:null,contract_status:o.contract_status||a.contract_status||e.contract_status||"",preferred_req_id:u,turn_id:e.turn_id||a.turn_id||"",metrics:v,spans:ut?ut(e,w,T):Array.isArray(e.spans)?e.spans:[],steps:T,hops:w,llmRounds:pr(e,T),detective:f,grade:d,prompt_grade:ar(f),headline:ir(f),overview:lr(f),playbooks:cr(f),promptChecks:A,checkSummary:dt?dt(A):{passed:0,total:0,label:"",tone:""},gather:bt?bt(e,o):[],toolsCount:w.length,errCount:h,session_error:o.session_error||a.error||e.session_error||"",catalog:C,inject:x,stamp:z,semanticCache:br(e),layer_a:e.layer_a||o.layer_a||null,raw:o,trace:e}}var S=()=>gt,V=12;function ae(t){if(!t)throw new Error("createTracePanel requires a root element");let r={getClientVersion:()=>"",getHubBase:()=>"",getChatId:()=>null,getChartOrder:()=>({v1:[],v2:[]}),showToast:n=>console.log(n)},o=[],e=null,l="all",a="",c="timeline",u=0,f=0,_=!1,v=null,w=!1,j=!1,T=0;function h(n){return t.querySelector("#"+n)}function d(n){return(S().escapeHtml||(s=>String(s)))(n)}function A(n){return(S().fmtMs||(s=>s+"ms"))(n)}function L(n){return(S().fmtBytes||(s=>s+"B"))(n)}function C(n,s){return(S().shortId||(i=>String(i||"")))(n,s)}function x(n){return(S().prettyJSON||JSON.stringify)(n,null,2)}function z(n){if(S().tryParseJSON)return S().tryParseJSON(n);if(n==null)return null;if(typeof n=="object")return n;try{return JSON.parse(n)}catch{return null}}function k(n,s){try{r.showToast(n,s||"success")}catch{}}function E(n){let s=String(n??"");if(!s){k("Nothing to copy","warning");return}navigator.clipboard.writeText(s).then(()=>k("\u2713 copied "+C(s,28)),()=>k("Copy failed","error"))}function B(){for(let n=o.length-1;n>=0;n--){let s=o[n],i=s&&s.trace||{};if(S().isMultiAgentTrace?S().isMultiAgentTrace(i,s):i.multi_agent)return s}return null}function P(n){let s=n||B()||{},i=S().extractJobUnits;return i?i(s.trace||{},s):[]}function W(n){let s=n||P();return s.length?((T<0||T>=s.length)&&(T=0),s[T]):null}function Q(n){let s=t.querySelector(".tt-title");s&&(s.textContent=n?"Job traces":"Zeus Tracer");let i=h("tt-search");i&&(i.placeholder=n?"Filter unit, req_id\u2026":"Filter turns, tools, req_id\u2026");let p=h("tt-empty");p&&!o.length&&(p.textContent=n?"No job run yet.":"No turn run yet.");let b=t.querySelector(".tt-turn-list");b&&b.setAttribute("aria-label",n?"Units":"Turns"),t.querySelectorAll(".tt-tab[data-job], .tt-tab[data-turn]").forEach(y=>{let q=y.hasAttribute("data-job")&&!y.hasAttribute("data-turn"),H=y.hasAttribute("data-turn")&&!y.hasAttribute("data-job");y.hidden=q&&!n||H&&n});let g=h("tt-filters");if(g){let y=g.querySelector('[data-filter="tools"]'),q=g.querySelector('[data-filter="agent"]');y&&(y.hidden=!!n),q&&(q.hidden=!n)}let m=h("tt-panel");m&&m.classList.toggle("tt-job-mode",!!n)}function ht(n){let s=!!n;if(j===s){Q(j);return}j=s,T=0,u=0,f=0,v=null,l="all";let i=h("tt-filters");i&&i.querySelectorAll(".tt-chip").forEach(p=>p.classList.toggle("on",p.dataset.filter==="all")),c=j?"hops":"timeline",Q(j),Y(),I()}function N(){return o.map((s,i)=>Lt(s,i)).reverse()}function ot(){let n=N();return n.length?n.find(s=>s.key===e)||n[0]:null}function M(n){if(l==="error"&&n.status==="ok"&&n.errCount===0||l==="tools"&&n.toolsCount===0)return!1;let s=(a||"").toLowerCase().trim();return s?[n.question,n.mode,n.target,String(n.index+1),n.turn_id,n.preferred_req_id,n.session_id,...n.hops.map(p=>p.verb+" "+p.req_id)].join(" ").toLowerCase().includes(s):!0}function st(){try{let n=String(r.getHubBase()||""),s=S().normalizeHubBase;return s?s(n):n.replace(/\/$/,"")}catch{return""}}function $(n){let s=S().hubDebugSessionUrl;if(s)try{return s(r.getHubBase()||"",n)}catch{return""}return""}function X(n){let s=S().hubDebugReqUrl;if(s)try{return s(r.getHubBase()||"",n)}catch{return""}return""}function Ot(n){if(!n){k("Set hub_url on the Zeus connection to open Detective","warning");return}window.open(n,"_blank","noopener,noreferrer")}function yt(n){c=n,t.querySelectorAll(".tt-tab").forEach(s=>{s.classList.toggle("on",s.dataset.tab===n)}),t.querySelectorAll(".tt-tab-panel").forEach(s=>{s.classList.toggle("on",s.id==="tt-panel-"+n)})}function Nt(n){let s=h("tt-turn-count");if(s)if(j){let p=P().length;s.textContent=p+" unit"+(p===1?"":"s")}else s.textContent=n+" turn"+(n===1?"":"s");let i=h("tt-client-ver");if(i){let p="";try{p=r.getClientVersion()||""}catch{p=""}if(!p){let b=h("client-version-badge");b&&(p=(b.textContent||"").replace(/^client\s*v?/i,"").trim())}i.textContent=p?"client v"+p.replace(/^v/,""):"",i.hidden=!p}}function pe(n,s){let i=h("tt-session");if(!i)return;let p=n||{},b=p.trace||{},g=b.job_id||p.job_id||"",m=b.pack||p.pack||"",y=b.engine||p.engine||"local_units",q=b.status||p.status||"",H=q==="ok"?"ok":q==="partial"?"warn":q?"err":"info";i.hidden=!1,i.innerHTML="<span>job</span>"+(g?'<button type="button" class="tt-id" data-copy="'+d(g)+'" title="Click to copy">'+d(g)+"</button>":'<span class="tt-muted">\u2014</span>')+'<span class="tt-sep">\xB7</span>'+(m?"<span>pack <strong>"+d(m)+"</strong></span>":'<span class="tt-muted">no pack</span>')+'<span class="tt-sep">\xB7</span><span>engine '+d(y)+"</span>"+(q?'<span class="tt-sep">\xB7</span><span class="tt-badge '+H+'">'+d(q)+"</span>":"")+'<span class="tt-sep">\xB7</span><span>'+(s?s.length:0)+" units \xB7 isolated \xB7 no shared session</span>"}function vt(n){let s=h("tt-session");if(!s)return;if(!n||!n.session_id&&!n.preferred_req_id&&!n.contract_status&&!(n.gather&&n.gather.length)&&!(n.semanticCache&&n.semanticCache.length)&&!(n.stamp&&n.stamp.user)){s.hidden=!0,s.innerHTML="";return}s.hidden=!1;let i=n.contract_status||"",p=i==="match"?"ok":i==="drift"?"warn":"info",b=$(n.session_id),g=n.semanticCache&&n.semanticCache[0]||"",m=g.includes("recall")?"recall":g.includes("write")?"write":g.includes("probe")?"probe":g?"on":"";s.innerHTML="<span>Session</span>"+(n.session_id?'<button type="button" class="tt-id" data-copy="'+d(n.session_id)+'" title="Click to copy">'+d(C(n.session_id,14))+"</button>":'<span class="tt-muted">\u2014</span>')+'<span class="tt-sep">\xB7</span>'+(n.session_round!=null?"<span>round <strong>"+d(String(n.session_round))+"</strong></span>":'<span class="tt-muted">round \u2014</span>')+(i?'<span class="tt-sep">\xB7</span><span class="tt-badge '+p+'">contract:'+d(i)+"</span>":"")+(n.preferred_req_id?'<span class="tt-sep">\xB7</span><span>preferred</span><button type="button" class="tt-id" data-copy="'+d(n.preferred_req_id)+'">'+d(C(n.preferred_req_id,14))+"</button>":"")+(b?'<span class="tt-sep">\xB7</span><a class="tt-link" href="'+d(b)+'" target="_blank" rel="noopener">Hub session \u2197</a>':'<span class="tt-sep">\xB7</span><button type="button" class="tt-linkish" data-action="hub-missing">Hub session \u2197</button>')+(n.gather&&n.gather.length?'<span class="tt-sep">\xB7</span><span class="tt-badge info">gather 9</span>':"")+(m?'<span class="tt-sep">\xB7</span><span class="tt-badge info" title="'+d(g)+'">cache:'+d(m)+"</span>":"")+(n.stamp&&n.stamp.user?'<span class="tt-sep">\xB7</span><span class="tt-muted">user '+d(String(n.stamp.user))+"</span>":"")}function ue(n){if(!n||l==="error"&&n.status==="ok"||l==="agent"&&n.kind!=="agent_turn")return!1;let s=(a||"").toLowerCase().trim();return s?[n.unit_id,n.goal,n.kind,n.answer,...n.req_ids||[]].join(" ").toLowerCase().includes(s):!0}function fe(n){let s=h("tt-turns");if(!s)return;let i=n.filter(ue);if(s.innerHTML="",!i.length){s.innerHTML='<div class="tt-empty-inline">No units match</div>';return}i.forEach(p=>{let b=n.indexOf(p),g=[];g.push('<span class="tt-turn-tag">'+d(p.kind)+"</span>"),p.synth?g.push('<span class="tt-turn-tag synth">synth</span>'):g.push('<span class="tt-turn-tag">isolated</span>'),g.push('<span class="tt-turn-tag">'+(p.req_ids||[]).length+" req</span>"),p.error_code&&g.push('<span class="tt-turn-tag err">'+d(p.error_code)+"</span>");let m=document.createElement("div");m.className="tt-turn-item"+(b===T?" active":""),m.setAttribute("role","button"),m.tabIndex=0,m.innerHTML='<div class="row1"><span class="dot '+d(p.status)+'" aria-hidden="true"></span><span class="n">'+d(p.unit_id)+'</span><span class="meta">w'+d(String(p.wave))+'</span></div><div class="q">'+d(p.goal||p.answer||p.unit_id)+'</div><div class="row3">'+g.join("")+"</div>";let y=()=>{T=b,u=0,f=0,I()};m.onclick=y,m.onkeydown=q=>{(q.key==="Enter"||q.key===" ")&&(q.preventDefault(),y())},s.appendChild(m)})}function be(n){let s=h("tt-turns");if(!s)return;let i=n.filter(M);if(s.innerHTML="",!i.length){s.innerHTML='<div class="tt-empty-inline">No turns match</div>';return}i.forEach(p=>{let b=p.index+1,g=p.llmRounds.length||p.trace.rounds||0,m=p.status==="ok"?"ok":p.status,y=[];p.mode&&y.push('<span class="tt-turn-tag">'+d(p.mode)+"</span>"),p.target&&y.push('<span class="tt-turn-tag">'+d(C(p.target,28))+"</span>"),p.errCount&&y.push('<span class="tt-turn-tag err">'+p.errCount+" err</span>");let q=document.createElement("div");q.className="tt-turn-item"+(p.key===e?" active":""),q.dataset.key=p.key,q.setAttribute("role","button"),q.tabIndex=0,q.innerHTML='<div class="row1"><span class="dot '+d(m)+'" aria-hidden="true"></span><span class="n">#'+b+'</span><span class="dur">'+d(A(p.metrics.total))+'</span><span class="meta">'+g+"r \xB7 "+p.toolsCount+' tools</span></div><div class="q">'+d(p.question)+"</div>"+(y.length?'<div class="row3">'+y.join("")+"</div>":"");let H=()=>{e=p.key,u=0,f=0,I()};q.onclick=H,q.onkeydown=tt=>{(tt.key==="Enter"||tt.key===" ")&&(tt.preventDefault(),H())},s.appendChild(q)})}function ge(n){let s=h("tt-detail-head");if(!s)return;if(!n){s.innerHTML="";return}s.innerHTML='<div class="tt-d-title">'+d(n.goal||n.unit_id)+'</div><div class="tt-metrics"><div class="metric"><div class="k">Unit</div><div class="v">'+d(n.unit_id)+'</div></div><div class="metric"><div class="k">Hops</div><div class="v">'+(n.hops||[]).length+'</div><div class="v sub">'+(n.req_ids||[]).length+' req_id</div></div><div class="metric"><div class="k">LLM</div><div class="v">'+(n.llm||[]).length+'r</div></div><div class="metric"><div class="k">Status</div><div class="v"><span class="tt-badge '+(n.status==="ok"?"ok":"err")+'">'+d(n.error_code||n.status)+"</span></div></div></div>";let i=h("tt-hop-count");i&&(i.textContent=String((n.hops||[]).length))}function me(n){let s=n.catalog||{},i=n.inject||{},p=[],b=s.has_mini_schema===!0||i.has_mini_schema===!0,g=s.has_scope_brief===!0||i.has_scope_brief===!0;return p.push('<span class="tt-turn-tag">'+(b?"MINI yes":"MINI no")+"</span>"),p.push('<span class="tt-turn-tag">'+(g?"BRIEF yes":"BRIEF no")+"</span>"),s.base_id&&p.push('<span class="tt-turn-tag">'+d(String(s.base_id))+"</span>"),s.client_floor&&p.push('<span class="tt-turn-tag">floor-'+d(String(s.client_floor))+"</span>"),p.length?'<div class="tt-chip-row">'+p.join("")+"</div>":""}function he(n){let s=h("tt-detail-head");if(!s||!n){s&&(s.innerHTML="");return}let i=n.metrics,p=i.total||1;s.innerHTML='<div class="tt-d-title">'+d(n.question)+'</div><div class="tt-metrics"><div class="metric"><div class="k">Wall</div><div class="v">'+d(A(i.total))+'</div><div class="mm-bar"><i class="ai" style="width:'+(i.aiMs/p*100).toFixed(1)+'%"></i><i class="zeus" style="width:'+(i.zeusMs/p*100).toFixed(1)+'%"></i><i class="other" style="width:'+(i.other/p*100).toFixed(1)+'%"></i></div></div><div class="metric"><div class="k">AI / Zeus</div><div class="v">'+d(A(i.aiMs))+' <span class="sub">/ '+d(A(i.zeusMs))+'</span></div></div><div class="metric"><div class="k">Tokens</div><div class="v">'+d((S().fmtTokens||(g=>g?Number(g).toLocaleString():"?"))(i.tokens))+'</div><div class="v sub" title="Sum of usage.total_tokens across all billed LLM calls (llm + force_final), not a single round">'+(function(){let g=n.llmRounds&&n.llmRounds.length||0,m=n.trace.rounds||0,y=[];return(i.hasIn||i.tokensIn)&&y.push("in "+(S().fmtTokens?S().fmtTokens(i.tokensIn):i.tokensIn)),(i.hasOut||i.tokensOut)&&y.push("out "+(S().fmtTokens?S().fmtTokens(i.tokensOut):i.tokensOut)),i.tokensCached&&y.push("cached "+Number(i.tokensCached).toLocaleString()),g>0?(y.push(g+(g===1?" LLM call":" LLM calls")),m>0&&m!==g&&y.push(m+" rounds")):y.push((m||0)+" rounds"),y.join(" \xB7 ")})()+'</div></div><div class="metric"><div class="k">Turn ID</div><div class="v sub mono" data-copy="'+d(n.turn_id||"")+'">'+d(n.turn_id?C(n.turn_id,16):"\u2014")+"</div></div></div>"+me(n);let b=h("tt-hop-count");b&&(b.textContent=String(n.hops.length))}function Rt(n){return n?!!(n.status!=="ok"||n.grade==="warn"||n.grade==="fail"||n.errCount>0||n.playbooks&&n.playbooks.length):!1}function ye(n){return`# Support pack
**Headline:** `+(n.headline||"(none)")+`
**Grade:** `+(n.grade||n.status)+`
**turn_id:** `+(n.turn_id||"")+`
**session_id:** `+(n.session_id||"")+`
**preferred_req_id:** `+(n.preferred_req_id||"")+`
**Playbooks:** `+(n.playbooks.map(s=>s.id).join(", ")||"none")+`
**Question:** `+(n.question||"")+`
`}function ve(n){let s=h("tt-diagnosis");if(!s)return;if(!n||!Rt(n)){s.hidden=!0,s.innerHTML="";return}s.hidden=!1,s.className="tt-diagnosis"+(n.grade==="fail"||n.status==="err"?" fail":" warn");let i=n.grade||n.status;s.innerHTML='<div class="eyebrow"><span class="tt-badge '+(i==="fail"||i==="err"?"err":"warn")+'">diagnosis '+d(i)+"</span><span>"+n.hops.length+" hops \xB7 "+(n.llmRounds.length||0)+" rounds</span></div><h3>"+d(n.headline||"Turn needs attention")+"</h3>"+(n.overview?'<p class="detail">'+d(n.overview)+"</p>":"")+(n.session_error?'<p class="detail">Session error: '+d(String(n.session_error).slice(0,240))+"</p>":"")+'<div class="hero-actions">'+(n.turn_id?'<span class="idchip" data-copy="'+d(n.turn_id)+'"><b>turn</b> '+d(C(n.turn_id,14))+"</span>":"")+(n.session_id?'<span class="idchip" data-copy="'+d(n.session_id)+'"><b>session</b> '+d(C(n.session_id,14))+"</span>":"")+(n.preferred_req_id?'<span class="idchip" data-copy="'+d(n.preferred_req_id)+'"><b>preferred</b> '+d(C(n.preferred_req_id,14))+"</span>":"")+'<button type="button" class="tt-btn primary" data-action="open-pref">Open preferred hop</button><button type="button" class="tt-btn" data-action="copy-pack">Copy support pack</button></div>'}function It(n){let s=h("tt-panel-timeline");if(!s||!n)return;let i='<label class="tt-story-toggle"><input type="checkbox" id="tt-story"'+(_?" checked":"")+" /> Story</label>";if(_){s.innerHTML='<div class="tt-tab-toolbar">'+i+"</div>"+xe(n),Dt(n);return}let p=(S().waterfallHTML||(()=>""))(n.spans,n.metrics.total,n.steps),b=(S().toolFrequencyChartHTML||(()=>""))(n.steps,n.api_version,r.getChartOrder());s.innerHTML='<div class="tt-tab-toolbar">'+i+"</div>"+(p||'<div class="tt-empty-inline">No spans for this turn.</div>')+'<div class="tt-kv"><div class="k">Status</div><div class="v"><span class="tt-badge '+(n.status==="ok"?"ok":n.status==="err"?"err":"warn")+'">'+d(n.status)+'</span></div><div class="k">Mode / target</div><div class="v">'+d(n.mode||"\u2014")+" \xB7 "+d(n.target||"\u2014")+'</div><div class="k">API</div><div class="v">'+d(String(n.api_version||"").toUpperCase())+" \xB7 "+d(n.provider||"")+" / "+d(n.model||"")+"</div></div>"+(b?'<details class="tt-fold"><summary>Tool-call frequency</summary>'+b+"</details>":""),Dt(n)}function Dt(n){let s=h("tt-story");s&&(s.onchange=()=>{_=!!s.checked,It(n)})}function xe(n){let s=[];return(n.spans||[]).forEach(i=>{let p="sys";i.cls==="ai"?p="ai":i.cls==="tool"?p="tool":p="sys",s.push({kind:p,title:i.name,t:"+"+(i.at||0)+"ms",ms:i.ms,body:i.detail||null})}),n.hops.filter(i=>(Number(i.status)||0)>=400).forEach(i=>{s.push({kind:"err",title:"Hop failed \xB7 "+i.verb,t:i.ms+"ms",ms:i.ms,autoOpen:!0,req:i.req,res:i.res,meta:"status="+i.status+" req="+C(i.req_id,12)})}),s.push({kind:"out",title:"Turn result",t:A(n.metrics.total),meta:"status="+n.status+(n.grade?" \xB7 detective="+n.grade:"")}),s.length?'<div class="tt-story-spine">'+s.map((i,p)=>{let b=i.autoOpen?" open":"",g=i.req||i.res?'<div class="tt-split-io"><div class="io-card"><header>Request</header><pre></pre></div><div class="io-card"><header>Response</header><pre></pre></div></div>':i.body?'<pre class="story-body"></pre>':"";return'<details class="story-card kind-'+d(i.kind)+'"'+b+' data-i="'+p+'"><summary><span class="skind">'+d(i.kind)+'</span><span class="stitle">'+d(i.title)+'</span><span class="st">'+d(i.t||"")+"</span></summary>"+(i.meta?'<div class="smeta">'+d(i.meta)+"</div>":"")+g+"</details>"}).join("")+"</div>":'<div class="tt-empty-inline">No story events.</div>'}function _e(n){let s=h("tt-panel-timeline");if(!s||!_)return;let i=[];(n.spans||[]).forEach(p=>{let b=p.cls==="ai"?"ai":p.cls==="tool"?"tool":"sys";i.push({kind:b,title:p.name,body:p.detail,req:null,res:null})}),n.hops.filter(p=>(Number(p.status)||0)>=400).forEach(p=>{i.push({kind:"err",title:p.verb,req:p.req,res:p.res})}),s.querySelectorAll(".story-card").forEach(p=>{let b=+p.dataset.i,g=i[b];if(!g)return;let m=p.querySelectorAll("pre");g.req!=null||g.res!=null?(m[0]&&(m[0].textContent=x(g.req||{})),m[1]&&(m[1].textContent=x(g.res||{}))):g.body&&m[0]&&(m[0].textContent=String(g.body))})}function xt(n){let s=h("tt-panel-hops");if(!s||!n)return;if(!n.hops.length){s.innerHTML='<div class="tt-empty-inline">No hops recorded for this turn.</div>';return}u>=n.hops.length&&(u=0);let i=n.hops[u],p=n.hops.map((m,y)=>{let q=(Number(m.status)||0)>=400;return'<tr class="'+(y===u?"sel":"")+'" data-i="'+y+'"><td>'+(m.preferred?"\u2605 ":"")+'<span class="mono">'+d(C(m.req_id||"\u2014",12))+"</span></td><td><strong>"+d(m.verb)+'</strong></td><td><span class="status-pill '+(q?"bad":"ok")+'">'+d(String(m.status))+'</span></td><td class="mono">'+d(A(m.ms))+'</td><td class="mono">'+d(m.bytes==null?"\u2014":typeof m.bytes=="number"?L(m.bytes):String(m.bytes))+"</td></tr>"}).join("");s.innerHTML='<table class="tt-table"><thead><tr><th>req_id</th><th>Verb</th><th>Status</th><th>ms</th><th>Bytes</th></tr></thead><tbody>'+p+'</tbody></table><div class="tt-hop-actions"><strong>Hop detail</strong><button type="button" class="tt-btn ghost" data-copy="'+d(i.req_id||"")+'">Copy req_id</button><button type="button" class="tt-btn ghost" data-action="open-req" data-req="'+d(i.req_id||"")+'">Open in Hub \u2197</button></div><div class="tt-split-io"><div class="io-card"><header><span class="ai-lab">Request</span> <span class="tt-badge">'+d(i.verb)+'</span><button type="button" class="tt-btn ghost ml-auto" data-copy-json="req">Copy</button></header><pre id="tt-hop-req"></pre></div><div class="io-card"><header><span class="zeus-lab">Response</span> <span class="status-pill '+((Number(i.status)||0)>=400?"bad":"ok")+'">'+d(String(i.status))+'</span><button type="button" class="tt-btn ghost ml-auto" data-copy-json="res">Copy</button></header><pre id="tt-hop-res"></pre></div></div>';let b=h("tt-hop-req"),g=h("tt-hop-res");b&&(b.textContent=x(i.req)),g&&(g.textContent=x(i.res)),s.querySelectorAll("tbody tr").forEach(m=>{m.onclick=()=>{u=+m.dataset.i,xt(n)}}),s.querySelector('[data-copy-json="req"]')?.addEventListener("click",()=>E(x(i.req))),s.querySelector('[data-copy-json="res"]')?.addEventListener("click",()=>E(x(i.res)))}function _t(n){let s=h("tt-panel-llm");if(!s||!n)return;let i=S().extractDecomposition?S().extractDecomposition(Object.assign({},n.raw||{},{trace:n.trace,hops:n.hops,llmRounds:n.llmRounds})):{decomposition:null,query_decomposition:null},p=S().decompositionCardHTML?S().decompositionCardHTML(i,d):"";function b(){h("tt-decomp-copy")?.addEventListener("click",()=>E(x({query_decomposition:i.query_decomposition,decomposition:i.decomposition,summary:i.summary,confidence:i.confidence,policy_action:i.policy_action})))}if(!n.llmRounds.length){s.innerHTML=p+'<div class="tt-empty-inline">No LLM rounds recorded for this turn.</div>',b();return}f>=n.llmRounds.length&&(f=0);let g=n.llmRounds[f];s.innerHTML=p+'<div class="round-pills">'+n.llmRounds.map((m,y)=>'<button type="button" class="round-pill '+(y===f?"on":"")+'" data-i="'+y+'">'+d(String(m.label||"Round "+m.round))+" \xB7 "+d(m.finish||"\u2014")+"</button>").join("")+'</div><div class="tt-tokline">tokens in <strong>'+d(String(g.tok_in!=null?g.tok_in:"?"))+"</strong> \xB7 out <strong>"+d(String(g.tok_out!=null?g.tok_out:"?"))+"</strong>"+(g.tok_total!=null?" \xB7 total <strong>"+d(String(g.tok_total))+"</strong>":"")+'</div><div class="tt-split-io"><div class="io-card"><header>AI request <button type="button" class="tt-btn ghost ml-auto" id="tt-llm-copy-req">Copy</button></header><pre id="tt-llm-req"></pre></div><div class="io-card"><header>AI response <button type="button" class="tt-btn ghost ml-auto" id="tt-llm-copy-res">Copy</button></header><pre id="tt-llm-res"></pre></div></div>',h("tt-llm-req").textContent=x(g.req),h("tt-llm-res").textContent=x(g.res),s.querySelectorAll(".round-pill").forEach(m=>{m.onclick=()=>{f=+m.dataset.i,_t(n)}}),h("tt-llm-copy-req")?.addEventListener("click",()=>E(x(g.req))),h("tt-llm-copy-res")?.addEventListener("click",()=>E(x(g.res))),b()}function ke(n){let s=h("tt-panel-inject");if(!s)return;if(!n){s.innerHTML='<div class="tt-empty-inline">No inject data.</div>';return}let i=n.inject||{},p=n.catalog||{},b=n.semanticCache||[],g={inject:i,catalog:{has_mini_schema:p.has_mini_schema,has_scope_brief:p.has_scope_brief,base_id:p.base_id,client_floor:p.client_floor,brief_sha12:p.brief_sha12||i.brief_sha12,mini_sha12:p.mini_sha12||i.mini_sha12},semantic_cache:b,semantic_memory:i.semantic_memory||null},m=b.length?b.join(" \xB7 "):i.has_scope_brief||i.has_mini_schema?"Catalog inject present (SCOPE BRIEF / MINI-SCHEMA).":"No catalog inject flags on this turn.";s.innerHTML='<div class="tt-inject-note">'+d(m)+'</div><div class="io-card"><header><span class="ai-lab">inject / catalog</span><button type="button" class="tt-btn ghost ml-auto" id="tt-inj-copy-req">Copy</button></header><pre id="tt-inj-req"></pre></div>';let y=h("tt-inj-req");y&&(y.textContent=x(g)),h("tt-inj-copy-req")?.addEventListener("click",()=>E(x(g)))}function we(n){let s=h("tt-panel-inject");if(!s)return;if(!n){s.innerHTML='<div class="tt-empty-inline">No unit selected.</div>';return}let i=n.stuffed_goal||n.goal||"",p=n.synth?"Synth unit: no shared session. Goal is stuffed with prior artifacts only.":n.has_inject?"Isolated agent unit. Catalog inject present (SCOPE BRIEF / MINI-SCHEMA).":n.kind==="zeus_direct"?"zeus_direct: no catalog inject (Mode 2 verb).":"Isolated agent unit. Fail-closed without ## SCOPE BRIEF (130012).";s.innerHTML='<div class="tt-inject-note">'+d(p)+'</div><div class="tt-split-io"><div class="io-card"><header><span class="ai-lab">Unit goal + inject</span><button type="button" class="tt-btn ghost ml-auto" id="tt-inj-copy-req">Copy</button></header><pre id="tt-inj-req"></pre></div><div class="io-card"><header><span class="zeus-lab">Artifact / answer</span>'+(n.error_code?'<span class="status-pill bad">'+d(n.error_code)+"</span>":"")+'<button type="button" class="tt-btn ghost ml-auto" id="tt-inj-copy-res">Copy</button></header><pre id="tt-inj-res"></pre></div></div>';let b=h("tt-inj-req"),g=h("tt-inj-res");b&&(b.textContent=i||"(empty goal)"),g&&(g.textContent=n.answer||"(no artifact)"),h("tt-inj-copy-req")?.addEventListener("click",()=>E(i)),h("tt-inj-copy-res")?.addEventListener("click",()=>E(n.answer||""))}function je(n){let s=h("tt-panel-detective");if(!s||!n)return;let i=n.detective,p=n.playbooks||[],b=n.promptChecks||[],g=n.grade||"pass",m=n.prompt_grade||"",y=n.checkSummary||(S().detectiveCheckSummary?S().detectiveCheckSummary(b):{label:"",tone:""}),q=n.overview||(i?"":"Detective data not attached on this turn."),H=Array.isArray(n.gather)?n.gather:[],tt=H.length?'<div class="tt-gather"><div class="tt-gather-head">E2E gather</div>'+H.map(R=>'<div class="tt-gather-row"><span class="k">'+d(R.label)+'</span><span class="v">'+d(R.value)+"</span></div>").join("")+"</div>":"";s.innerHTML=tt+'<div class="diag-card"><div class="diag-badges"><span class="tt-badge '+(g==="pass"?"ok":g==="fail"?"err":"warn")+'">diagnosis:'+d(g||"\u2014")+"</span>"+(m?'<span class="tt-badge '+(m==="pass"?"ok":"warn")+'">prompt:'+d(m)+"</span>":"")+(y&&y.label?'<span class="tt-badge '+(y.tone==="ok"?"ok":"err")+'">'+d(y.label)+"</span>":"")+"</div><h3>"+d(n.headline||(i?"Detective briefing":"No detective briefing"))+"</h3>"+(q?"<p>"+d(q)+"</p>":"")+(p.length?'<div class="playbooks">'+p.map((R,Ee)=>'<div class="playbook"><span class="num">'+(Ee+1)+'</span><div><div class="id">'+d(R.id)+"</div><div>"+d(R.title)+(R.body?" \u2014 "+d(R.body):"")+"</div></div></div>").join("")+"</div>":'<div class="playbook empty-ok">\u2713 No playbooks triggered</div>')+(b.length?'<div class="checklist">'+(y&&y.label?'<div class="checklist-head'+(y.tone==="ok"?"":" fail")+'">'+d(y.label)+"</div>":"")+b.map(R=>'<div class="check '+(R.ok?"pass":"fail")+'"><span class="mark">'+(R.ok?"\u2713":"\u2717")+'</span><span class="lab">'+d(R.lab)+"</span></div>").join("")+"</div>":"")+'</div><div class="tt-kv"><div class="k">Support pack</div><div class="v"><button type="button" class="tt-btn" data-action="copy-pack">Copy markdown pack</button></div><div class="k">Hub links</div><div class="v">'+(n.session_id?'<a class="tt-link" href="'+d($(n.session_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-session">session</a>':'<span class="tt-muted">session</span>')+" \xB7 "+(n.preferred_req_id?'<a class="tt-link" href="'+d(X(n.preferred_req_id)||"#")+'" target="_blank" rel="noopener" data-action="hub-req">preferred req</a>':'<span class="tt-muted">preferred req</span>')+"</div></div>"}function Ft(n){let s=h("tt-panel-raw");if(!s||!n)return;let i={question:n.question,answer:n.answer,target:n.target,mode:n.mode,api_version:n.api_version,provider:n.provider,model:n.model,session_id:n.session_id,session_round:n.session_round,contract_status:n.contract_status,preferred_req_id:n.preferred_req_id,turn_id:n.turn_id,gather:n.gather,status:n.status,detective:n.detective,hops:n.hops,spans:n.spans,trace:n.trace};s.innerHTML='<div class="io-card raw-card"><header>TurnResult.debug / public_trace projection<button type="button" class="tt-btn ghost ml-auto" id="tt-raw-copy">Copy JSON</button></header><div class="trace-dump-viewer" id="tt-raw-host"></div></div>';let p=h("tt-raw-host");if(S().mountJsnviewViewer)S().mountJsnviewViewer(p,i,!1);else{let b=document.createElement("pre");b.textContent=x(i),p.appendChild(b)}h("tt-raw-copy")?.addEventListener("click",()=>E(x(i)))}function kt(){let n=(o||[]).slice(-V);return{copied_at:new Date().toISOString(),chat_id:r.getChatId?r.getChatId():null,shown_turns:n.length,max_shown_turns:V,traces:n}}function I(){let n=h("tt-empty"),s=h("tt-body");if(Q(j),j){let g=B(),m=P(g);if(Nt(m.length),!g){n&&(n.hidden=!1,n.textContent="No job run yet."),s&&(s.hidden=!0),vt(null);return}n&&(n.hidden=!0),s&&(s.hidden=!1),T>=m.length&&(T=0);let y=W(m),q=y?{hops:y.hops||[],llmRounds:y.llm||[],question:y.goal,status:y.status,grade:y.status==="err"?"fail":"pass",playbooks:[],errCount:y.status==="err"?1:0,preferred_req_id:y.req_ids&&y.req_ids[0]||"",session_id:"",turn_id:y.unit_id,raw:g,trace:g&&g.trace||{},detective:null,headline:"",overview:"",promptChecks:[],checkSummary:{label:"",tone:""},gather:[]}:null;fe(m),pe(g,m),ge(y);let H=h("tt-diagnosis");H&&(H.hidden=!(y&&y.status==="err"),y&&y.status==="err"?(H.className="tt-diagnosis fail",H.innerHTML='<div class="eyebrow"><span class="tt-badge err">'+d(y.error_code||y.status)+"</span></div><h3>"+d(y.unit_id+" failed")+'</h3><p class="detail">'+d((y.answer||"").slice(0,280))+"</p>"):H.innerHTML=""),(c==="timeline"||c==="detective")&&(c="hops"),yt(c),xt(q),_t(q),we(y),Ft(q);return}let i=N();if(Nt(i.length),!i.length){n&&(n.hidden=!1),s&&(s.hidden=!0),vt(null);return}n&&(n.hidden=!0),s&&(s.hidden=!1),(!e||!i.some(g=>g.key===e))&&(e=i[0].key,u=0,f=0,v=null);let p=i.filter(M),b=i.find(g=>g.key===e);if(b&&!M(b)&&p.length&&(e=p[0].key,b=p[0],u=0,f=0),b&&u===0&&b.hops.length){let g=b.hops.findIndex(m=>m.preferred);g>0&&!b._hopTouched&&(u=g)}be(i),vt(b),he(b),ve(b),b&&Rt(b)&&v!==b.key&&(v=b.key,c="detective"),yt(c),It(b),_&&_e(b),xt(b),_t(b),ke(b),je(b),Ft(b)}function qe(n){let s=n.target.closest("[data-copy]");if(s&&s.dataset.copy!=null){n.preventDefault(),E(s.dataset.copy);return}let i=n.target.closest("[data-action]");if(!i)return;let p=i.dataset.action,b=ot();if(p==="hub-missing"){k("Set hub_url on the Zeus connection to open Detective","warning");return}if(p==="copy-pack"&&b){E(ye(b));return}if(p==="open-pref"&&b){let g=b.hops.findIndex(m=>m.preferred);u=g>=0?g:0,c="hops",b&&(b._hopTouched=!0),I(),k("Jumped to preferred hop");return}if(p==="open-req"){let g=i.dataset.req||b&&b.preferred_req_id,m=X(g);!m&&g?(E(g),k("Hub URL unknown \u2014 copied req_id","warning")):Ot(m);return}p==="hub-session"&&!st()&&(n.preventDefault(),k("Set hub_url on the Zeus connection to open Detective","warning")),p==="hub-req"&&!st()&&(n.preventDefault(),k("Set hub_url on the Zeus connection to open Detective","warning"))}function Y(){if(w)return;w=!0;let n=h("tt-panel");n&&n.addEventListener("click",qe),h("tt-search")?.addEventListener("input",s=>{a=s.target.value||"",I()}),h("tt-filters")?.addEventListener("click",s=>{let i=s.target.closest(".tt-chip");i&&(l=i.dataset.filter||"all",h("tt-filters").querySelectorAll(".tt-chip").forEach(p=>p.classList.toggle("on",p===i)),I())}),t.querySelectorAll(".tt-tab").forEach(s=>{s.addEventListener("click",()=>{c=s.dataset.tab||"timeline",e&&(v=e),yt(c)})}),h("tt-copy-all")?.addEventListener("click",()=>{let s=kt();if(!s.traces.length){k("No trace to copy yet","warning");return}E(x(s)),k("\u2713 full trace copied")}),h("tt-export")?.addEventListener("click",()=>{let s=kt();if(!s.traces.length){k("No trace to export yet","warning");return}let i=new Blob([x(s)],{type:"application/json"}),p=document.createElement("a");p.href=URL.createObjectURL(i);let b=s.chat_id||"local";p.download="zeus-traces-"+b+"-"+Date.now()+".json",p.click(),URL.revokeObjectURL(p.href),k("\u2713 exported")}),h("tt-detective")?.addEventListener("click",()=>{let s=ot();if(!s){k("No turn selected","warning");return}let i=s.preferred_req_id,p=i?X(i):$(s.session_id);if(!p){let b=i||s.session_id||"";b&&E(b),k("Set hub_url on the Zeus connection to open Detective","warning");return}Ot(p)})}function Se(n){o=(Array.isArray(n)?n:[]).map(mt).filter(s=>s&&s.trace),o.length>V&&(o=o.slice(-V)),j=o.some(s=>S().isMultiAgentTrace&&S().isMultiAgentTrace(s.trace,s)),e=null,u=0,f=0,v=null,Y(),I()}function Te(n){let s=mt(n);if(!s||!s.trace)return;o.includes(s)||o.push(s),o.length>V&&(o=o.slice(-V));let i=Lt(s,o.length-1);S().isMultiAgentTrace&&S().isMultiAgentTrace(s.trace,s)&&(j=!0),e=i.key,u=0,f=0,v=null,Y(),I()}function Ae(){o=[],e=null,v=null,j=!1,T=0,Y(),I()}function Ce(n){r=Object.assign({},r,n||{}),Y(),I()}return{init:Ce,setEntries:Se,pushEntry:Te,clear:Ae,getBundle:kt,setJobMode:ht,TRACE_MAX_CARDS:V}}function ie(t,r={}){let o=x=>t.querySelector(`#${x}`),e=J(r.toolOrder)??{v1:[],v2:[]},l=null,a=r.mount==="docked",c=ae(t);c.init({getClientVersion:()=>et(),getHubBase:()=>r.hubBaseUrl||"",getChatId:()=>l,getChartOrder:()=>e,showToast:v});function u(){let x=o("debug-panel"),z=o("debug-toggle");x&&(x.classList.remove("is-hidden"),x.setAttribute("aria-hidden","false"),z?.setAttribute("aria-expanded","true"))}function f(){if(a)return;let x=o("debug-panel"),z=o("debug-toggle");x&&(x.classList.add("is-hidden"),x.setAttribute("aria-hidden","true"),z?.setAttribute("aria-expanded","false"))}function _(){let x=o("debug-panel");x&&(x.classList.contains("is-hidden")?u():f())}function v(x,z){let k=o("toast"),E=o("toast-msg");!k||!E||(E.textContent=x,k.classList.toggle("tt-toast-warn",z==="warning"||z==="error"),k.classList.remove("hidden"),setTimeout(()=>k.classList.add("hidden"),2200))}function w(x){let z=J(x);z&&(e=z)}async function j(){let x=J(r.toolOrder);if(x){e=x;return}if(!r.zeusApiUrl)return;let z=Number(r.toolOrderTimeoutMs),k=Number.isFinite(z)&&z>0?z:3e3,E=typeof AbortController<"u"?new AbortController:null,B=E?setTimeout(()=>{try{E.abort()}catch{}},k):null;try{let P=await Pt("/api/tool-order",r,E?{signal:E.signal}:{}),W=J(await P.json());W&&(e=W)}catch{}finally{B!=null&&clearTimeout(B)}}function T(x,z){if(!z)return;let k={...z};x&&!k.question&&(k.question=x),!(!k.trace&&!k.debug)&&(w(k.tool_order),l=k.chat_id||l,c.pushEntry(k),a||u())}function h(x){c.setEntries(x)}function d(){c.clear()}function A(){return c.getBundle()}o("debug-toggle")?.addEventListener("click",_),o("debug-close")?.addEventListener("click",f);let L=o("debug-panel-version");if(L){let x=et();L.textContent=x.startsWith("v")?x:`v${x}`,L.setAttribute("title",`zeus_client_chat_trace ${x}`)}a&&u();let C=j();return{appendTraceCard:T,openDebugPanel:u,closeDebugPanel:f,setEntries:h,clear:d,exportBundle:A,setJobMode:x=>c.setJobMode(x),setToolOrder:w,readyToolOrder:C,version:et()}}var le=`<button
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

<aside id="debug-panel" class="debug-panel tt-panel is-hidden" aria-hidden="true" role="dialog" aria-labelledby="debug-panel-title">
  <div class="tt-panel-inner" id="tt-panel">
    <header class="tt-header">
      <h2 id="debug-panel-title" class="tt-title">Zeus Tracer</h2>
      <span class="tt-badge" id="tt-turn-count">0 turns</span>
      <span class="tt-badge tt-badge-info" id="tt-client-ver" hidden></span>
      <div class="tt-hdr-actions">
        <button type="button" class="tt-btn ghost" id="tt-export" title="Download journal JSON">Export</button>
        <button type="button" class="tt-btn ghost" id="tt-copy-all" title="Copy full trace bundle">Copy all</button>
        <button type="button" class="tt-btn primary" id="tt-detective" title="Open Hub Detective">Detective \u2197</button>
        <button type="button" class="tt-btn ghost tt-close" id="debug-close" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </header>
    <div class="tt-session" id="tt-session" hidden></div>
    <div class="tt-body" id="tt-body" hidden>
      <nav class="tt-turn-list" aria-label="Turns">
        <div class="tt-list-tools">
          <input class="tt-search" id="tt-search" placeholder="Filter turns, tools, req_id\u2026" />
          <div class="tt-filters" id="tt-filters">
            <button type="button" class="tt-chip on" data-filter="all">All</button>
            <button type="button" class="tt-chip" data-filter="error">Errors</button>
            <button type="button" class="tt-chip" data-filter="tools">Has tools</button>
            <button type="button" class="tt-chip" data-filter="agent" hidden>Agent</button>
          </div>
        </div>
        <div id="tt-turns" class="tt-turns"></div>
      </nav>
      <div class="tt-detail">
        <div class="tt-detail-head" id="tt-detail-head"></div>
        <div class="tt-diagnosis" id="tt-diagnosis" hidden></div>
        <div class="tt-tabs" role="tablist">
          <button type="button" class="tt-tab on" data-tab="timeline" data-turn role="tab">Timeline</button>
          <button type="button" class="tt-tab" data-tab="hops" data-turn data-job role="tab">Hops <span class="tt-count" id="tt-hop-count">0</span></button>
          <button type="button" class="tt-tab" data-tab="llm" data-turn data-job role="tab">LLM I/O</button>
          <button type="button" class="tt-tab" data-tab="inject" data-turn data-job role="tab">Inject / goal</button>
          <button type="button" class="tt-tab" data-tab="detective" data-turn role="tab">Detective</button>
          <button type="button" class="tt-tab" data-tab="raw" data-turn data-job role="tab">Raw</button>
        </div>
        <div class="tt-tab-panels">
          <div class="tt-tab-panel on" id="tt-panel-timeline" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-hops" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-llm" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-inject" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-detective" role="tabpanel"></div>
          <div class="tt-tab-panel" id="tt-panel-raw" role="tabpanel"></div>
        </div>
      </div>
    </div>
    <div id="tt-empty" class="tt-empty">No turn run yet.</div>
    <footer id="debug-panel-footer" class="debug-panel-footer" aria-label="Widget version">
      <span id="debug-panel-version" class="debug-panel-version">v\u2014</span>
    </footer>
  </div>
</aside>

<div id="toast" class="tt-toast hidden">
  <span id="toast-msg"></span>
</div>
`;var ce=`/* Zeus Tracer v1 \u2014 overlay inspector (sample-app .tt-* tokens) */

:host, .zeus-trace-root {
  all: initial;
  display: block;
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #e8eef6;
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

.hidden,
[hidden] {
  display: none !important;
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
  outline: 2px solid #5b8cff;
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
  background: #0b0f14;
  color: #e8eef6;
  border: 1px solid #243041;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.25);
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
}

.debug-panel-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.3rem 0.75rem 0.45rem;
  border-top: 1px solid var(--tt-border, #243041);
  background: var(--tt-elev, #121820);
}
.debug-panel-version {
  font: 10px/1.2 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--tt-dim, #5d6d82);
  letter-spacing: 0.02em;
  user-select: text;
  background: var(--tt-elev-2, #18212c);
  border-radius: 0.25rem;
  padding: 0.15rem 0.4rem;
}

.tt-toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 70;
  background: #18212c;
  color: #e8eef6;
  border: 1px solid #243041;
  border-radius: 8px;
  padding: 0.45rem 0.75rem;
  font-size: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
}
.tt-toast.hidden { display: none !important; }
.tt-toast-warn { border-color: rgba(245,158,11,.45); color: #fde68a; }

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
.zeus-trace-root[data-mount="docked"] .debug-panel.is-hidden {
  display: flex !important;
}


.trace-waterfall {
  display: grid; grid-template-columns: max-content 1fr max-content;
  gap: 3px 10px; align-items: center;
  font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  margin-bottom: 12px;
}
.trace-waterfall .tw-lab {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 260px; opacity: 0.85;
}
.trace-waterfall .tw-lab-pipeline {
  padding-left: 0.65rem;
  border-left: 2px solid #10b981;
  max-width: 280px;
}
.trace-waterfall .tw-dur .tw-detail {
  opacity: 0.65;
  white-space: nowrap;
}
.trace-waterfall .tw-track {
  height: 14px; background: #1a2430; border-radius: 3px; position: relative;
}
.trace-waterfall .tw-track > i {
  position: absolute; top: 0; bottom: 0; border-radius: 3px; min-width: 2px;
}
.trace-waterfall .tw-track > i.ai    { background: #f97316; }
.trace-waterfall .tw-track > i.tool  { background: #10b981; }
.trace-waterfall .tw-track > i.other { background: #6366f1; }
.trace-waterfall .tw-dur {
  text-align: right; opacity: 0.6; min-width: 64px;
}
.trace-waterfall .tw-legend {
  display: flex; gap: 16px; flex-wrap: wrap; margin-top: 4px; opacity: 0.7;
}
.trace-waterfall .tw-legend .sw {
  display: inline-block; width: 10px; height: 10px; border-radius: 2px;
  margin-right: 5px; vertical-align: middle;
}
.trace-waterfall .tw-legend .sw.ai    { background: #f97316; }
.trace-waterfall .tw-legend .sw.tool  { background: #10b981; }
.trace-waterfall .tw-legend .sw.other { background: #6366f1; }

/* \u2500\u2500 Tool-call frequency chart (vertical bars; V2 x-axis from docs/API/V2) \u2500 */
.trace-vbar {
  border: 1px solid var(--tt-border, #243041);
  border-radius: 8px;
  background: var(--tt-elev, #121820);
  padding: 10px 12px 8px;
  margin-top: 12px;
}
.trace-vbar-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tt-muted, #8b9bb0);
  margin: 0 0 8px;
}
.trace-vbar-hint {
  margin-top: 4px;
  font-size: 11px;
  color: var(--tt-dim, #5d6d82);
}
.vbar-wrap {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 90px;
  padding: 4px 0 0;
  border-bottom: 1px solid var(--tt-border, #243041);
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
  background: var(--tt-accent, #5b8cff);
  border-radius: 2px 2px 0 0;
  min-height: 0;
}
.vbar-col .b.err { background: var(--tt-err, #f43f5e); }
.vbar-col .b.unknown { background: #94a3b8; }
.vbar-col .n {
  font: 9px ui-monospace, SFMono-Regular, Menlo, monospace;
  line-height: 1;
  margin-bottom: 1px;
  color: var(--tt-muted, #8b9bb0);
}
.vbar-col .n.zero { visibility: hidden; }
.vbar-labels {
  display: flex;
  gap: 2px;
  margin-top: 2px;
  font: 9px ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--tt-dim, #5d6d82);
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

/* \u2500\u2500 Turn traces inspector (sketches hybrid 001+003) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tt-panel {
  --tt-bg: #0b0f14;
  --tt-elev: #121820;
  --tt-elev-2: #18212c;
  --tt-hover: #1c2734;
  --tt-border: #243041;
  --tt-fg: #e8eef6;
  --tt-muted: #8b9bb0;
  --tt-dim: #5d6d82;
  --tt-accent: #5b8cff;
  --tt-ai: #f59e0b;
  --tt-zeus: #22c55e;
  --tt-other: #818cf8;
  --tt-ok: #22c55e;
  --tt-warn: #f59e0b;
  --tt-err: #f43f5e;
  --tt-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: var(--tt-bg) !important;
  color: var(--tt-fg);
  border: 1px solid var(--tt-border);
}
.tt-panel .card-body { background: transparent; }
.tt-header {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 10px 12px; border-bottom: 1px solid var(--tt-border);
  background: var(--tt-elev);
}
.tt-title { font-size: 14px; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
.tt-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 600; letter-spacing: .03em;
  padding: 2px 8px; border-radius: 999px;
  border: 1px solid var(--tt-border); color: var(--tt-muted); background: var(--tt-elev-2);
}
.tt-badge.ok, .tt-badge-info.ok { color: #bbf7d0; border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.12); }
.tt-badge.warn { color: #fde68a; border-color: rgba(245,158,11,.35); background: rgba(245,158,11,.12); }
.tt-badge.err { color: #fecdd3; border-color: rgba(244,63,94,.4); background: rgba(244,63,94,.12); }
.tt-badge.info, .tt-badge-info { color: #bfdbfe; border-color: rgba(91,140,255,.4); background: rgba(91,140,255,.12); }
.tt-hdr-actions { margin-left: auto; display: flex; gap: 4px; align-items: center; }
.tt-btn, .tt-panel .btn {
  font-size: 11px; border-radius: 6px; border: 1px solid var(--tt-border);
  background: var(--tt-elev-2); color: var(--tt-fg); padding: 3px 8px; cursor: pointer;
  /* icon + label stay on one baseline (footer History / New chat, hdr actions) */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: auto;
  white-space: nowrap;
  line-height: 1;
  box-sizing: border-box;
}
.tt-btn:hover, .tt-panel .btn:hover { background: var(--tt-hover); }
.tt-btn.primary, .tt-panel .btn-primary { background: rgba(91,140,255,.2); border-color: rgba(91,140,255,.5); color: #dbeafe; }
.tt-btn.ghost { background: transparent; }
.tt-btn svg, .tt-panel .btn svg {
  display: block; /* flex item \u2014 no line-break vs label */
  flex-shrink: 0;
}
.tt-session {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px;
  padding: 6px 12px; font-size: 11px; color: var(--tt-muted);
  border-bottom: 1px solid var(--tt-border); background: rgba(18,24,32,.9);
}
.tt-session .tt-id, .tt-id {
  font-family: var(--tt-mono); font-size: 11px; color: #b7ccff;
  background: var(--tt-elev-2); border: 1px solid var(--tt-border);
  border-radius: 6px; padding: 1px 6px; cursor: pointer;
}
.tt-session .tt-id:hover, .tt-id:hover { border-color: var(--tt-accent); }
.tt-sep { opacity: .4; }
.tt-link, .tt-linkish { color: #9cbcff; font-size: 11px; text-decoration: none; background: none; border: 0; cursor: pointer; padding: 0; }
.tt-link:hover, .tt-linkish:hover { text-decoration: underline; }
.tt-muted { color: var(--tt-dim); }
.tt-body {
  flex: 1; min-height: 0; display: grid; grid-template-columns: 220px 1fr;
  overflow: hidden;
}
.tt-turn-list {
  border-right: 1px solid var(--tt-border); display: flex; flex-direction: column; min-height: 0;
  background: #0c1117;
}
.tt-list-tools {
  padding: 8px; border-bottom: 1px solid #1a2430; display: grid; gap: 6px;
  position: sticky; top: 0; background: #0c1117; z-index: 2;
}
.tt-search {
  width: 100%; background: var(--tt-elev); border: 1px solid var(--tt-border);
  color: var(--tt-fg); border-radius: 7px; padding: 6px 8px 6px 28px; font-size: 12px;
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%235d6d82' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M20 20l-3-3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 8px center;
}
.tt-search:focus { border-color: var(--tt-accent); }
.tt-filters { display: flex; gap: 4px; flex-wrap: wrap; }
.tt-chip {
  font-size: 10.5px; padding: 2px 7px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--tt-border); background: transparent; color: var(--tt-muted);
}
.tt-chip.on { background: rgba(91,140,255,.14); border-color: rgba(91,140,255,.45); color: #b7ccff; }
/* Turn list \u2014 sketch 001 / screenshot: flat rows, inset active, tag pills */
.tt-turns { flex: 1; overflow: auto; padding: 0; min-height: 0; }
.tt-turn-item {
  padding: 10px 12px;
  border-bottom: 1px solid #1a2430;
  border-radius: 0;
  cursor: pointer;
  border-left: 0;
  margin: 0;
  display: grid;
  gap: 4px;
  background: transparent;
  outline: none;
}
.tt-turn-item:hover { background: var(--tt-hover); }
.tt-turn-item:focus-visible { background: var(--tt-hover); }
.tt-turn-item.active {
  background: rgba(91, 140, 255, 0.14);
  box-shadow: inset 3px 0 0 var(--tt-accent);
  border-color: #1a2430;
}
.tt-turn-item .row1 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--tt-muted);
  font-variant-numeric: tabular-nums;
}
.tt-turn-item .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--tt-ok); flex-shrink: 0;
}
.tt-turn-item .dot.ok { background: var(--tt-ok); }
.tt-turn-item .dot.warn { background: var(--tt-warn); }
.tt-turn-item .dot.err { background: var(--tt-err); }
.tt-turn-item .n {
  font-family: var(--tt-mono);
  font-weight: 600;
  color: var(--tt-fg);
  font-size: 11px;
}
.tt-turn-item .dur {
  font-variant-numeric: tabular-nums;
  color: var(--tt-muted);
}
.tt-turn-item .meta {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  color: var(--tt-muted);
  white-space: nowrap;
}
.tt-turn-item .q {
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.35;
  color: var(--tt-fg);
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
  margin-top: 0;
}
.tt-turn-tag {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 500;
  line-height: 1.2;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #243041;
  background: #121820;
  color: #8b9bb0;
  font-variant-numeric: tabular-nums;
}
.tt-turn-tag.err {
  color: #fecdd3;
  border-color: rgba(244, 63, 94, 0.4);
  background: rgba(244, 63, 94, 0.12);
}
.tt-turn-tag.synth {
  color: #c4b5fd;
  border-color: rgba(167, 139, 250, 0.35);
  background: rgba(167, 139, 250, 0.12);
}
.tt-inject-note {
  font-size: 12px;
  color: var(--tt-muted);
  line-height: 1.45;
  padding: 8px 10px;
  border: 1px dashed var(--tt-border);
  border-radius: 8px;
  margin-bottom: 8px;
}
.tt-tab[hidden], .tt-chip[hidden] { display: none !important; }
.tt-detail { display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: hidden; }
.tt-detail-head { padding: 10px 12px 6px; border-bottom: 1px solid var(--tt-border); }
.tt-d-title { font-size: 13px; font-weight: 650; margin-bottom: 8px; line-height: 1.35; }
.tt-metrics { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
.tt-metrics .metric { background: var(--tt-elev); border: 1px solid var(--tt-border); border-radius: 8px; padding: 6px 8px; }
.tt-metrics .k { font-size: 10px; color: var(--tt-dim); text-transform: uppercase; letter-spacing: .04em; }
.tt-metrics .v { font-size: 13px; font-weight: 650; font-family: var(--tt-mono); }
.tt-metrics .sub { font-size: 11px; color: var(--tt-muted); font-weight: 500; }
.tt-metrics .mm-bar { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: #1a2430; margin-top: 4px; }
.tt-metrics .mm-bar > i { display: block; height: 100%; }
.tt-metrics .mm-bar > i.ai { background: var(--tt-ai); }
.tt-metrics .mm-bar > i.zeus { background: var(--tt-zeus); }
.tt-metrics .mm-bar > i.other { background: var(--tt-other); }
.tt-metrics .mono { cursor: pointer; color: #b7ccff; }
.tt-diagnosis {
  margin: 8px 12px 0; padding: 10px 12px; border-radius: 10px;
  border: 1px solid rgba(245,158,11,.35); background: rgba(245,158,11,.1);
}
.tt-diagnosis.fail { border-color: rgba(244,63,94,.4); background: rgba(244,63,94,.12); }
.tt-diagnosis .eyebrow { display: flex; gap: 8px; align-items: center; font-size: 11px; color: var(--tt-muted); margin-bottom: 6px; }
.tt-diagnosis h3 { font-size: 14px; font-weight: 700; margin: 0 0 4px; }
.tt-diagnosis .detail { font-size: 12px; color: var(--tt-muted); margin: 0 0 8px; line-height: 1.4; }
.tt-diagnosis .hero-actions, .hero-actions { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.idchip {
  font-family: var(--tt-mono); font-size: 10px; padding: 2px 7px; border-radius: 6px;
  border: 1px solid var(--tt-border); background: var(--tt-elev); cursor: pointer; color: var(--tt-fg);
}
.idchip b { color: var(--tt-muted); font-weight: 600; margin-right: 4px; }
.tt-tabs {
  display: flex; gap: 2px; padding: 8px 10px 0; border-bottom: 1px solid var(--tt-border);
  flex-shrink: 0;
}
.tt-tab {
  background: transparent; border: 0; color: var(--tt-muted); font-size: 12px; font-weight: 600;
  padding: 6px 10px; border-bottom: 2px solid transparent; cursor: pointer; border-radius: 6px 6px 0 0;
}
.tt-tab:hover { color: var(--tt-fg); background: var(--tt-hover); }
.tt-tab.on { color: var(--tt-fg); border-bottom-color: var(--tt-accent); }
.tt-tab .tt-count, .tt-count {
  font-size: 10px; margin-left: 4px; padding: 0 5px; border-radius: 999px;
  background: var(--tt-elev-2); color: var(--tt-muted);
}
.tt-tab-panels { flex: 1; min-height: 0; overflow: auto; padding: 10px 12px 16px; }
.tt-tab-panel { display: none; }
.tt-tab-panel.on { display: block; }
.tt-tab-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.tt-story-toggle { font-size: 11px; color: var(--tt-muted); display: flex; gap: 6px; align-items: center; cursor: pointer; }
.tt-empty { padding: 16px; color: var(--tt-muted); flex: 1 1 auto; }
.tt-empty-inline { color: var(--tt-dim); font-size: 12px; padding: 12px 4px; }
.tt-kv { display: grid; grid-template-columns: 120px 1fr; gap: 6px 10px; margin-top: 12px; font-size: 12px; }
.tt-kv .k { color: var(--tt-dim); }
.tt-kv .v { color: var(--tt-fg); }
.tt-gather {
  margin: 0 0 12px;
  border: 1px solid var(--tt-border);
  border-radius: 8px;
  background: var(--tt-elev);
  padding: 8px 10px 6px;
}
.tt-gather-head {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tt-muted);
  margin-bottom: 6px;
}
.tt-gather-row {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 4px 10px;
  font-size: 12px;
  padding: 3px 0;
  border-top: 1px solid rgba(36, 48, 65, 0.7);
}
.tt-gather-row .k { color: var(--tt-dim); }
.tt-gather-row .v { color: var(--tt-fg); word-break: break-word; }
.tt-fold { margin-top: 12px; border: 1px solid var(--tt-border); border-radius: 8px; padding: 6px 10px; background: var(--tt-elev); }
.tt-fold summary { cursor: pointer; font-size: 11px; font-weight: 650; color: var(--tt-muted); }
.tt-panel .trace-waterfall { color: var(--tt-fg); }
.tt-panel .trace-waterfall .tw-track { background: #1a2430; }
.tt-panel .trace-waterfall .tw-track > i.ai { background: var(--tt-ai); }
.tt-panel .trace-waterfall .tw-track > i.tool { background: var(--tt-zeus); }
.tt-panel .trace-waterfall .tw-track > i.other { background: var(--tt-other); }
.tt-panel .trace-waterfall .tw-legend .sw.ai { background: var(--tt-ai); }
.tt-panel .trace-waterfall .tw-legend .sw.tool { background: var(--tt-zeus); }
.tt-panel .trace-waterfall .tw-legend .sw.other { background: var(--tt-other); }
.tt-panel .trace-vbar { border-color: var(--tt-border); background: var(--tt-elev); }
.tt-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.tt-table th { text-align: left; color: var(--tt-dim); font-weight: 600; padding: 4px 6px; border-bottom: 1px solid var(--tt-border); }
.tt-table td { padding: 6px; border-bottom: 1px solid rgba(36,48,65,.7); }
.tt-table tr { cursor: pointer; }
.tt-table tr:hover { background: var(--tt-hover); }
.tt-table tr.sel { background: rgba(91,140,255,.12); }
.tt-table .mono { font-family: var(--tt-mono); }
.status-pill { font-family: var(--tt-mono); font-size: 10px; padding: 1px 6px; border-radius: 999px; }
.status-pill.ok { background: rgba(34,197,94,.15); color: #bbf7d0; }
.status-pill.bad { background: rgba(244,63,94,.15); color: #fecdd3; }
.tt-hop-actions { display: flex; gap: 8px; align-items: center; margin: 10px 0 8px; font-size: 12px; }
.tt-split-io { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.io-card {
  border: 1px solid var(--tt-border); border-radius: 8px; background: var(--tt-elev);
  min-height: 140px; display: flex; flex-direction: column; overflow: hidden;
}
.io-card header {
  display: flex; align-items: center; gap: 6px; padding: 6px 8px;
  border-bottom: 1px solid var(--tt-border); font-size: 11px; font-weight: 650;
}
.io-card .ai-lab { color: var(--tt-ai); }
.io-card .zeus-lab { color: var(--tt-zeus); }
.io-card .ml-auto { margin-left: auto; }
.io-card pre {
  margin: 0; padding: 8px; overflow: auto; flex: 1; max-height: 360px;
  font: 11px/1.4 var(--tt-mono); color: #c9d4e3; white-space: pre-wrap; word-break: break-word;
}
.round-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.round-pill {
  border: 1px solid var(--tt-border); background: var(--tt-elev); color: var(--tt-muted);
  border-radius: 999px; padding: 3px 10px; font-size: 11px; cursor: pointer;
}
.round-pill.on { background: rgba(91,140,255,.18); border-color: rgba(91,140,255,.45); color: #dbeafe; }
.tt-tokline { font-size: 11.5px; color: var(--tt-muted); margin-bottom: 10px; }
.tt-tokline strong { color: var(--tt-fg); }
.tt-decomp {
  border: 1px solid var(--tt-border);
  border-radius: 8px;
  background: var(--tt-elev);
  margin-bottom: 10px;
  overflow: hidden;
}
.tt-decomp.empty {
  padding: 8px 10px;
  font-size: 12px;
  color: var(--tt-dim);
}
.tt-decomp header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--tt-border);
  font-size: 11px;
  font-weight: 650;
}
.tt-decomp-badges { display: flex; flex-wrap: wrap; gap: 6px; }
.tt-decomp-summary {
  margin: 8px 10px 4px;
  font-size: 12px;
  color: var(--tt-muted);
  line-height: 1.4;
}
.tt-decomp-row {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 8px;
  padding: 4px 10px 6px;
  align-items: start;
}
.tt-decomp-row .lab {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--tt-dim);
  padding-top: 3px;
}
.tt-decomp-row .val {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
  font-size: 12px;
}
.tt-decomp-chip {
  display: inline-flex;
  font-size: 10.5px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--tt-border);
  background: var(--tt-elev-2);
  color: var(--tt-fg);
}
.tt-decomp-kv { font-size: 11.5px; color: var(--tt-fg); }
.tt-decomp-kv .k {
  font-family: var(--tt-mono);
  color: var(--tt-muted);
  font-size: 10.5px;
}
.diag-card {
  border: 1px solid var(--tt-border); border-radius: 10px; padding: 12px;
  background: var(--tt-elev); margin-bottom: 10px;
}
.diag-card h3 { font-size: 14px; margin: 6px 0; }
.diag-card p { font-size: 12px; color: var(--tt-muted); margin: 0 0 8px; }
.diag-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.playbooks { display: grid; gap: 6px; }
.playbook {
  display: flex; gap: 8px; align-items: flex-start; padding: 8px;
  border-radius: 8px; border: 1px solid var(--tt-border); background: var(--tt-elev-2);
  font-size: 12px;
}
.playbook .num {
  width: 20px; height: 20px; border-radius: 50%; background: rgba(91,140,255,.2);
  color: #bfdbfe; display: grid; place-items: center; font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.playbook .id { font-family: var(--tt-mono); font-size: 10px; color: var(--tt-accent); margin-bottom: 2px; }
.playbook.empty-ok { color: var(--tt-dim); }
.checklist { display: grid; gap: 4px; margin-top: 10px; }
.checklist-head {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .04em;
  color: var(--tt-ok);
  margin-bottom: 2px;
}
.checklist-head.fail { color: var(--tt-err); }
.check { display: flex; gap: 8px; font-size: 12px; align-items: center; }
.check.pass .mark { color: var(--tt-ok); }
.check.fail .mark { color: var(--tt-err); }
.raw-card { min-height: 320px; }
.tt-panel .trace-dump-viewer {
  max-height: 480px;
  overflow: auto;
  padding: 8px 10px;
  background: #0a0e13;
  color: #c9d4e3;
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
  color: #c9d4e3;
}
.tt-panel .trace-dump-viewer .jsv-content {
  list-style: none;
  margin: 0;
  padding-left: 1.1rem;
  border-left: 1px dotted var(--tt-border, #243041);
}
.tt-panel .trace-dump-viewer .jsv-toggle {
  color: var(--tt-dim, #5d6d82);
  font-size: 10px;
}
.tt-panel .trace-dump-viewer .text-amber-800 { color: #fbbf24; }
.tt-panel .trace-dump-viewer .text-green-700 { color: #86efac; }
.tt-panel .trace-dump-viewer .text-blue-700 { color: #93c5fd; }
.tt-panel .trace-dump-viewer .text-rose-700 { color: #fda4af; }
.tt-panel .trace-dump-viewer .text-stone-700,
.tt-panel .trace-dump-viewer .text-gray-500,
.tt-panel .trace-dump-viewer .text-gray-600 {
  color: var(--tt-muted, #8b9bb0);
}
.tt-panel .trace-dump-viewer .trace-pre {
  margin: 0;
  color: #c9d4e3;
  white-space: pre-wrap;
  word-break: break-word;
}
.tt-story-spine { display: grid; gap: 8px; position: relative; padding-left: 12px; }
.tt-story-spine::before {
  content: ""; position: absolute; left: 4px; top: 4px; bottom: 4px; width: 2px; background: var(--tt-border);
}
.story-card {
  border: 1px solid var(--tt-border); border-radius: 8px; background: var(--tt-elev); padding: 0;
}
.story-card summary {
  list-style: none; cursor: pointer; display: flex; gap: 8px; align-items: center;
  padding: 8px 10px; font-size: 12px;
}
.story-card summary::-webkit-details-marker { display: none; }
.story-card .skind {
  font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: .04em;
  padding: 1px 6px; border-radius: 4px; background: var(--tt-elev-2); color: var(--tt-muted);
}
.story-card.kind-ai .skind { color: #fde68a; }
.story-card.kind-tool .skind { color: #bbf7d0; }
.story-card.kind-err .skind { color: #fecdd3; background: rgba(244,63,94,.15); }
.story-card .stitle { font-weight: 600; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.story-card .st { font-family: var(--tt-mono); font-size: 10px; color: var(--tt-dim); }
.story-card .smeta { padding: 0 10px 8px; font-size: 11px; color: var(--tt-muted); }
.story-card .tt-split-io { padding: 0 10px 10px; }
.story-card pre.story-body { margin: 0 10px 10px; font: 11px var(--tt-mono); color: #c9d4e3; }
@media (max-width: 900px) {
  .tt-body { grid-template-columns: 1fr; }
  .tt-turn-list { max-height: 180px; border-right: 0; border-bottom: 1px solid var(--tt-border); }
  .tt-split-io { grid-template-columns: 1fr; }
  .tt-metrics { grid-template-columns: 1fr 1fr; }
}

.tt-panel {
  min-height: 0;
}
.tt-body {
  flex: 1 1 auto;
}

@media (max-width: 720px) {
  .debug-panel {
    width: calc(100vw - 1rem);
    left: 0.5rem;
    bottom: 4.25rem;
    height: min(78vh, 720px);
  }
  .tt-body { grid-template-columns: 1fr; }
  .tt-turn-list { max-height: 160px; border-right: 0; border-bottom: 1px solid var(--tt-border); }
  .tt-split-io { grid-template-columns: 1fr; }
  .tt-metrics { grid-template-columns: 1fr 1fr; }
}

/* Last so author display:flex/grid cannot override HTML hidden. */
.hidden,
[hidden] {
  display: none !important;
}
`;Ut(document.currentScript);var nt=[],Mt=!1;function hr(){return{appendTraceCard(){},openDebugPanel(){},setEntries(){},clear(){},exportBundle(){return{traces:[]}},setJobMode(){}}}function yr(){Mt||(window.appendTraceCard=(...t)=>nt.push({type:"card",args:t}),window.openDebugPanel=()=>nt.push({type:"open"}))}function vr(t){for(let r of nt)r.type==="open"?t.openDebugPanel():r.type==="card"&&t.appendTraceCard(...r.args);nt.length=0}function xr(t){let r=t.mount==="docked",o=t.mountSelector,e;return r&&o&&(e=document.querySelector(o)),e?(e.style.display=e.style.display||"block",e.style.position=e.style.position||"relative",e.style.minHeight=e.style.minHeight||"320px"):(e=document.createElement("div"),e.id="zeus-trace-host",e.style.cssText=r?"all:initial;display:block;position:relative;width:100%;height:100%;min-height:320px;z-index:1;":"all:initial;display:block;position:fixed;inset:0;z-index:99999;pointer-events:none;",document.body.appendChild(e)),e.id||(e.id="zeus-trace-host"),{host:e,docked:r}}function _r(){let t=at();if(!t.enabled){let u=hr();return window.appendTraceCard=u.appendTraceCard,window.openDebugPanel=u.openDebugPanel,nt.length=0,Mt=!0,{api:u,config:t}}let{host:r,docked:o}=xr(t),e=r.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=ce;let a=document.createElement("div");a.className="zeus-trace-root",a.setAttribute("data-theme","dark"),a.setAttribute("data-mount",o?"docked":"overlay"),a.style.pointerEvents="auto",a.innerHTML=le,e.append(l,a);let c=ie(a,t);return window.appendTraceCard=c.appendTraceCard,window.openDebugPanel=c.openDebugPanel,window.ZeusTrace&&(window.ZeusTrace.setEntries=c.setEntries,window.ZeusTrace.clear=c.clear,window.ZeusTrace.exportBundle=c.exportBundle,window.ZeusTrace.setJobMode=c.setJobMode),vr(c),Mt=!0,{api:c,config:t}}yr();var Ht,kr=new Promise(t=>{Ht=t});window.ZeusTrace={ready:kr,get config(){return jt(at())},get version(){return jt(at()).version}};var de=()=>{try{let{api:t,config:r}=_r();Ht({api:t,config:r})}catch(t){console.error("[ZeusTrace] Failed to mount widget:",t),Ht({api:null,config:null,error:t})}};document.body?de():document.addEventListener("DOMContentLoaded",de);})();
//# sourceMappingURL=zeus_client_chat_trace.js.map
