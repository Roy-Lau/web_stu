var VueDOMCompiler=function(e){"use strict";function t(e,t){const n=Object.create(null),o=e.split(",");for(let e=0;e<o.length;e++)n[o[e]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}const n={1:"TEXT",2:"CLASS",4:"STYLE",8:"PROPS",32:"NEED_PATCH",16:"FULL_PROPS",64:"KEYED_FRAGMENT",128:"UNKEYED_FRAGMENT",256:"DYNAMIC_SLOTS",[-1]:"BAIL"},o=()=>!1,r=(e,t)=>{for(const n in t)e[n]=t[n];return e},s=Array.isArray,c=e=>"function"==typeof e,i=e=>"string"==typeof e,l=e=>"symbol"==typeof e,a=e=>null!==e&&"object"==typeof e,u=/-(\w)/g;function p(e){throw e}function f(e,t,n){const o=e,r=t?` (${t.start.line}:${t.start.column})`:"",s=new SyntaxError(o+r);return s.code=e,s.loc=t,s}const d={source:"",start:{line:1,column:1,offset:0},end:{line:1,column:1,offset:0}};function h(e,t=d){return{type:16,loc:t,elements:e}}function g(e,t=d){return{type:14,loc:t,properties:e}}function m(e,t){return{type:15,loc:d,key:i(e)?y(e,!0):e,value:t}}function y(e,t,n=d,o=!1){return{type:4,loc:n,isConstant:o,content:e,isStatic:t}}function x(e,t=d){return{type:8,loc:t,children:e}}function v(e,t=[],n=d){return{type:13,loc:n,callee:e,arguments:t}}function b(e,t,n=!1,o=d){return{type:17,params:e,returns:t,newline:n,loc:o}}function S(e){return{type:18,expressions:e,loc:d}}function N(e,t,n){return{type:19,test:e,consequent:t,alternate:n,loc:d}}function k(e,t,n=!1){return{type:20,index:e,value:t,isVNode:n,loc:d}}const T=Symbol(""),E=Symbol(""),w=Symbol(""),$=Symbol(""),C=Symbol(""),O=Symbol(""),M=Symbol(""),_=Symbol(""),P=Symbol(""),I=Symbol(""),L=Symbol(""),R=Symbol(""),A=Symbol(""),V=Symbol(""),D=Symbol(""),j=Symbol(""),F=Symbol(""),J=Symbol(""),W=Symbol(""),z=Symbol(""),q={[T]:"Fragment",[E]:"Portal",[w]:"Suspense",[$]:"openBlock",[C]:"createBlock",[O]:"createVNode",[M]:"createCommentVNode",[_]:"createTextVNode",[P]:"resolveComponent",[I]:"resolveDynamicComponent",[L]:"resolveDirective",[R]:"withDirectives",[A]:"renderList",[V]:"renderSlot",[D]:"createSlots",[j]:"toString",[F]:"mergeProps",[J]:"toHandlers",[W]:"camelize",[z]:"setBlockTracking"};function B(e){Object.getOwnPropertySymbols(e).forEach(t=>{q[t]=e[t]})}let G,H;function U(e){return"undefined"!=typeof process&&c(require)?require(e):window._deps[e]}const Y=/^\d|[^\$\w]/,K=e=>!Y.test(e),Z=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\[[^\]]+\])*$/,Q=e=>Z.test(e);function X(e,t,n){const o={source:e.source.substr(t,n),start:ee(e.start,e.source,t),end:e.end};return null!=n&&(o.end=ee(e.start,e.source,t+n)),o}function ee(e,t,n=t.length){return te({...e},t,n)}function te(e,t,n=t.length){let o=0,r=-1;for(let e=0;e<n;e++)10===t.charCodeAt(e)&&(o++,r=e);return e.offset+=n,e.line+=o,e.column=-1===r?e.column+n:Math.max(1,n-r),e}function ne(e,t){if(!e)throw new Error(t||"unexpected compiler condition")}function oe(e,t,n=!1){for(let o=0;o<e.props.length;o++){const r=e.props[o];if(7===r.type&&(n||r.exp)&&(i(t)?r.name===t:t.test(r.name)))return r}}function re(e,t,n=!1){for(let o=0;o<e.props.length;o++){const r=e.props[o];if(6===r.type){if(n)continue;if(r.name===t&&r.value)return r}else if("bind"===r.name&&r.arg&&4===r.arg.type&&r.arg.isStatic&&r.arg.content===t&&r.exp)return r}}function se(e,t){return S([v(t.helper($)),e])}const ce=e=>7===e.type&&"slot"===e.name,ie=e=>1===e.type&&3===e.tagType,le=e=>1===e.type&&2===e.tagType;function ae(e,t,n){let o;const r=e.callee===V?e.arguments[2]:e.arguments[1];if(null==r||i(r))o=g([t]);else if(13===r.type){const e=r.arguments[0];i(e)||14!==e.type?r.arguments.unshift(g([t])):e.properties.unshift(t),o=r}else 14===r.type?(r.properties.unshift(t),o=r):o=v(n.helper(F),[g([t]),r]);e.callee===V?e.arguments[2]=o:e.arguments[1]=o}function ue(e,t){return`_${t}_${e.replace(/[^\w]/g,"_")}`}const pe={delimiters:["{{","}}"],getNamespace:()=>0,getTextMode:()=>0,isVoidTag:o,isPreTag:o,isCustomElement:o,namedCharacterReferences:{"gt;":">","lt;":"<","amp;":"&","apos;":"'","quot;":'"'},onError:p};function fe(e,t={}){const n=function(e,t){return{options:{...pe,...t},column:1,line:1,offset:0,originalSource:e,source:e,maxCRNameLength:Object.keys(t.namedCharacterReferences||pe.namedCharacterReferences).reduce((e,t)=>Math.max(e,t.length),0),inPre:!1}}(e,t),o=Ee(n);return{type:0,children:de(n,0,[]),helpers:[],components:[],directives:[],hoists:[],cached:0,codegenNode:void 0,loc:we(n,o)}}function de(e,t,n){const o=$e(n),r=o?o.ns:0,s=[];for(;!Ie(e,t,n);){const c=e.source;let i=void 0;if(!e.inPre&&Ce(c,e.options.delimiters[0]))i=Ne(e,t);else if(0===t&&"<"===c[0])if(1===c.length)Pe(e,8,1);else if("!"===c[1])Ce(c,"\x3c!--")?i=me(e):Ce(c,"<!DOCTYPE")?i=ye(e):Ce(c,"<![CDATA[")?0!==r?i=ge(e,n):(Pe(e,2),i=ye(e)):(Pe(e,14),i=ye(e));else if("/"===c[1])if(2===c.length)Pe(e,8,2);else{if(">"===c[2]){Pe(e,17,2),Oe(e,3);continue}if(/[a-z]/i.test(c[2])){Pe(e,31),ve(e,1,o);continue}Pe(e,15,2),i=ye(e)}else/[a-z]/i.test(c[1])?i=xe(e,n):"?"===c[1]?(Pe(e,28,1),i=ye(e)):Pe(e,15,1);if(i||(i=ke(e,t)),Array.isArray(i))for(let e=0;e<i.length;e++)he(s,i[e]);else he(s,i)}let c=!1;if(!o||!e.options.isPreTag(o.tag))for(let e=0;e<s.length;e++){const t=s[e];if(2===t.type)if(t.content.trim())t.content=t.content.replace(/\s+/g," ");else{const n=s[e-1],o=s[e+1];!n||!o||3===n.type||3===o.type||1===n.type&&1===o.type&&/[\r\n]/.test(t.content)?(c=!0,s[e]=null):t.content=" "}}return c?s.filter(e=>null!==e):s}function he(e,t){if(3!==t.type){if(2===t.type){const n=$e(e);if(n&&2===n.type&&n.loc.end.offset===t.loc.start.offset)return n.content+=t.content,n.loc.end=t.loc.end,void(n.loc.source+=t.loc.source)}e.push(t)}}function ge(e,t){Oe(e,9);const n=de(e,3,t);return 0===e.source.length?Pe(e,9):Oe(e,3),n}function me(e){const t=Ee(e);let n;const o=/--(\!)?>/.exec(e.source);if(o){o.index<=3&&Pe(e,0),o[1]&&Pe(e,13),n=e.source.slice(4,o.index);const t=e.source.slice(0,o.index);let r=1,s=0;for(;-1!==(s=t.indexOf("\x3c!--",r));)Oe(e,s-r+1),s+4<t.length&&Pe(e,20),r=s+1;Oe(e,o.index+o[0].length-r+1)}else n=e.source.slice(4),Oe(e,e.source.length),Pe(e,10);return{type:3,content:n,loc:we(e,t)}}function ye(e){const t=Ee(e),n="?"===e.source[1]?1:2;let o;const r=e.source.indexOf(">");return-1===r?(o=e.source.slice(n),Oe(e,e.source.length)):(o=e.source.slice(n,r),Oe(e,r+1)),{type:3,content:o,loc:we(e,t)}}function xe(e,t){const n=e.inPre,o=$e(t),r=ve(e,0,o),s=e.inPre&&!n;if(r.isSelfClosing||e.options.isVoidTag(r.tag))return r;t.push(r);const c=e.options.getTextMode(r.tag,r.ns),i=de(e,c,t);if(t.pop(),r.children=i,Le(e.source,r.tag))ve(e,1,o);else if(Pe(e,32),0===e.source.length&&"script"===r.tag.toLowerCase()){const t=i[0];t&&Ce(t.loc.source,"\x3c!--")&&Pe(e,11)}return r.loc=we(e,r.loc.start),s&&(e.inPre=!1),r}function ve(e,t,n){const o=Ee(e),s=/^<\/?([a-z][^\t\r\n\f \/>]*)/i.exec(e.source),c=s[1],i=e.options.getNamespace(c,n);Oe(e,s[0].length),Me(e);const l=Ee(e),a=e.source;let u=be(e,t);!e.inPre&&u.some(e=>7===e.type&&"pre"===e.name)&&(e.inPre=!0,r(e,l),e.source=a,u=be(e,t).filter(e=>"v-pre"!==e.name));let p=!1;0===e.source.length?Pe(e,12):(p=Ce(e.source,"/>"),1===t&&p&&Pe(e,7),Oe(e,p?2:1));let f=0;return e.inPre||e.options.isCustomElement(c)||(e.options.isNativeTag?e.options.isNativeTag(c)||(f=1):/^[A-Z]/.test(c)&&(f=1),"slot"===c?f=2:"template"===c?f=3:"portal"===c||"Portal"===c?f=4:"suspense"!==c&&"Suspense"!==c||(f=5)),{type:1,ns:i,tag:c,tagType:f,props:u,isSelfClosing:p,children:[],loc:we(e,o),codegenNode:void 0}}function be(e,t){const n=[],o=new Set;for(;e.source.length>0&&!Ce(e.source,">")&&!Ce(e.source,"/>");){if(Ce(e.source,"/")){Pe(e,29),Oe(e,1),Me(e);continue}1===t&&Pe(e,6);const r=Se(e,o);0===t&&n.push(r),/^[^\t\r\n\f \/>]/.test(e.source)&&Pe(e,19),Me(e)}return n}function Se(e,t){const n=Ee(e),o=/^[^\t\r\n\f \/>][^\t\r\n\f \/>=]*/.exec(e.source)[0];t.has(o)&&Pe(e,5),t.add(o),"="===o[0]&&Pe(e,26);{const t=/["'<]/g;let n;for(;null!==(n=t.exec(o));)Pe(e,24,n.index)}Oe(e,o.length);let r=void 0;/^[\t\r\n\f ]*=/.test(e.source)&&(Me(e),Oe(e,1),Me(e),(r=function(e){const t=Ee(e);let n;const o=e.source[0],r='"'===o||"'"===o;if(r){Oe(e,1);const t=e.source.indexOf(o);-1===t?n=Te(e,e.source.length,4):(n=Te(e,t,4),Oe(e,1))}else{const t=/^[^\t\r\n\f >]+/.exec(e.source);if(!t)return;let o,r=/["'<=`]/g;for(;null!==(o=r.exec(t[0]));)Pe(e,25,o.index);n=Te(e,t[0].length,4)}return{content:n,isQuoted:r,loc:we(e,t)}}(e))||Pe(e,16));const s=we(e,n);if(!e.inPre&&/^(v-|:|@|#)/.test(o)){const t=/(?:^v-([a-z0-9-]+))?(?:(?::|^@|^#)([^\.]+))?(.+)?$/i.exec(o);let c;if(t[2]){const r=o.split(t[2],2).shift().length,s=we(e,_e(e,n,r),_e(e,n,r+t[2].length));let i=t[2],l=!0;i.startsWith("[")&&(l=!1,i.endsWith("]")||Pe(e,34),i=i.substr(1,i.length-2)),c={type:4,content:i,isStatic:l,isConstant:l,loc:s}}if(r&&r.isQuoted){const e=r.loc;e.start.offset++,e.start.column++,e.end=ee(e.start,r.content),e.source=e.source.slice(1,-1)}return{type:7,name:t[1]||(Ce(o,":")?"bind":Ce(o,"@")?"on":"slot"),exp:r&&{type:4,content:r.content,isStatic:!1,isConstant:!1,loc:r.loc},arg:c,modifiers:t[3]?t[3].substr(1).split("."):[],loc:s}}return{type:6,name:o,value:r&&{type:2,content:r.content,loc:r.loc},loc:s}}function Ne(e,t){const[n,o]=e.options.delimiters,r=e.source.indexOf(o,n.length);if(-1===r)return void Pe(e,33);const s=Ee(e);Oe(e,n.length);const c=Ee(e),i=Ee(e),l=r-n.length,a=e.source.slice(0,l),u=Te(e,l,t),p=u.trim(),f=u.indexOf(p);return f>0&&te(c,a,f),te(i,a,l-(u.length-p.length-f)),Oe(e,o.length),{type:5,content:{type:4,isStatic:!1,isConstant:!1,content:p,loc:we(e,c,i)},loc:we(e,s)}}function ke(e,t){const[n]=e.options.delimiters,o=Math.min(...[e.source.indexOf("<",1),e.source.indexOf(n,1),3===t?e.source.indexOf("]]>"):-1,e.source.length].filter(e=>-1!==e)),r=Ee(e);return{type:2,content:Te(e,o,t),loc:we(e,r)}}function Te(e,t,n){if(2===n||3===n){const n=e.source.slice(0,t);return Oe(e,t),n}const o=e.offset+t;let r="";for(;e.offset<o;){const t=/&(?:#x?)?/i.exec(e.source);if(!t||e.offset+t.index>=o){const t=o-e.offset;r+=e.source.slice(0,t),Oe(e,t);break}if(r+=e.source.slice(0,t.index),Oe(e,t.index),"&"===t[0]){let t="",o=void 0;if(/[0-9a-z]/i.test(e.source[1])){for(let n=e.maxCRNameLength;!o&&n>0;--n)t=e.source.substr(1,n),o=e.options.namedCharacterReferences[t];if(o){const s=t.endsWith(";");4===n&&!s&&/[=a-z0-9]/i.test(e.source[1+t.length]||"")?(r+="&",r+=t,Oe(e,1+t.length)):(r+=o,Oe(e,1+t.length),s||Pe(e,18))}else Pe(e,30),r+="&",r+=t,Oe(e,1+t.length)}else r+="&",Oe(e,1)}else{const n="&#x"===t[0],o=(n?/^&#x([0-9a-f]+);?/i:/^&#([0-9]+);?/).exec(e.source);if(o){let t=Number.parseInt(o[1],n?16:10);0===t?(Pe(e,22),t=65533):t>1114111?(Pe(e,3),t=65533):t>=55296&&t<=57343?(Pe(e,23),t=65533):t>=64976&&t<=65007||65534==(65534&t)?Pe(e,21):(t>=1&&t<=8||11===t||t>=13&&t<=31||t>=127&&t<=159)&&(Pe(e,4),t=Re[t]||t),r+=String.fromCodePoint(t),Oe(e,o[0].length),o[0].endsWith(";")||Pe(e,18)}else r+=t[0],Pe(e,1),Oe(e,t[0].length)}}return r}function Ee(e){const{column:t,line:n,offset:o}=e;return{column:t,line:n,offset:o}}function we(e,t,n){return{start:t,end:n=n||Ee(e),source:e.originalSource.slice(t.offset,n.offset)}}function $e(e){return e[e.length-1]}function Ce(e,t){return e.startsWith(t)}function Oe(e,t){const{source:n}=e;te(e,n,t),e.source=n.slice(t)}function Me(e){const t=/^[\t\r\n\f ]+/.exec(e.source);t&&Oe(e,t[0].length)}function _e(e,t,n){return ee(t,e.originalSource.slice(t.offset,n),n)}function Pe(e,t,n){const o=Ee(e);n&&(o.offset+=n,o.column+=n),e.options.onError(f(t,{start:o,end:o,source:""}))}function Ie(e,t,n){const o=e.source;switch(t){case 0:if(Ce(o,"</"))for(let e=n.length-1;e>=0;--e)if(Le(o,n[e].tag))return!0;break;case 1:case 2:{const e=$e(n);if(e&&Le(o,e.tag))return!0;break}case 3:if(Ce(o,"]]>"))return!0}return!o}function Le(e,t){return Ce(e,"</")&&e.substr(2,t.length).toLowerCase()===t.toLowerCase()&&/[\t\n\f \/>]/.test(e[2+t.length]||">")}const Re={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};function Ae(e,t){!function e(t,n,o,r=!1){for(let s=0;s<t.length;s++){const c=t[s];if(1===c.type&&0===c.tagType){if(!r&&De(c,o)){c.codegenNode=n.hoist(c.codegenNode);continue}{const e=c.codegenNode;if(13===e.type){const t=qe(e);if(!(t&&32!==t&&1!==t||je(c)||Fe())){const t=Je(c);t&&"null"!==t&&(ze(e).arguments[1]=n.hoist(t))}}}}if(1===c.type)e(c.children,n,o);else if(11===c.type)e(c.children,n,o,1===c.children.length);else if(9===c.type)for(let t=0;t<c.branches.length;t++){const r=c.branches[t].children;e(r,n,o,1===r.length)}}}(e.children,t,new Map,Ve(e,e.children[0]))}function Ve(e,t){const{children:n}=e;return 1===n.length&&1===t.type&&!le(t)}function De(e,t=new Map){switch(e.type){case 1:if(0!==e.tagType)return!1;const n=t.get(e);if(void 0!==n)return n;const o=e.codegenNode;if(13!==o.type)return!1;if(qe(o)||je(e)||Fe())return t.set(e,!1),!1;for(let n=0;n<e.children.length;n++)if(!De(e.children[n],t))return t.set(e,!1),!1;return t.set(e,!0),!0;case 2:case 3:return!0;case 9:case 11:return!1;case 5:case 12:return De(e.content,t);case 4:return e.isConstant;case 8:return e.children.every(e=>i(e)||l(e)||De(e,t));default:return!1}}function je(e){return!(!re(e,"key",!0)&&!re(e,"ref",!0))}function Fe(e){return!1}function Je(e){const t=e.codegenNode;if(13===t.type)return We(t,1)}function We(e,t){return ze(e).arguments[t]}function ze(e){return e.callee===R?e.arguments[0]:e}function qe(e){const t=We(e,3);return t?parseInt(t,10):void 0}function Be(e,t){const n=function(e,{prefixIdentifiers:t=!1,hoistStatic:n=!1,cacheHandlers:o=!1,nodeTransforms:r=[],directiveTransforms:s={},onError:c=p}){const i={root:e,helpers:new Set,components:new Set,directives:new Set,hoists:[],cached:0,identifiers:{},scopes:{vFor:0,vSlot:0,vPre:0,vOnce:0},prefixIdentifiers:t,hoistStatic:n,cacheHandlers:o,nodeTransforms:r,directiveTransforms:s,onError:c,parent:null,currentNode:e,childIndex:0,helper:e=>(i.helpers.add(e),e),helperString:e=>(i.prefixIdentifiers?"":"_")+q[i.helper(e)],replaceNode(e){i.parent.children[i.childIndex]=i.currentNode=e},removeNode(e){const t=i.parent.children,n=e?t.indexOf(e):i.currentNode?i.childIndex:-1;e&&e!==i.currentNode?i.childIndex>n&&(i.childIndex--,i.onNodeRemoved()):(i.currentNode=null,i.onNodeRemoved()),i.parent.children.splice(n,1)},onNodeRemoved:()=>{},addIdentifiers(e){},removeIdentifiers(e){},hoist:e=>(i.hoists.push(e),y(`_hoisted_${i.hoists.length}`,!1,e.loc,!0)),cache:(e,t=!1)=>k(++i.cached,e,t)};return i}(e,t);He(e,n),t.hoistStatic&&Ae(e,n),function(e,t){const{helper:n}=t,{children:o}=e,r=o[0];if(1===o.length)if(Ve(e,r)&&r.codegenNode){const o=r.codegenNode;20!==o.type?(o.callee===R?o.arguments[0].callee=n(C):o.callee=n(C),e.codegenNode=se(o,t)):e.codegenNode=o}else e.codegenNode=r;else o.length>1&&(e.codegenNode=se(v(n(C),[n(T),"null",e.children]),t));e.helpers=[...t.helpers],e.components=[...t.components],e.directives=[...t.directives],e.hoists=t.hoists,e.cached=t.cached}(e,n)}function Ge(e,t){let n=0;const o=()=>{n--};for(;n<e.children.length;n++){const r=e.children[n];i(r)||(t.currentNode=r,t.parent=e,t.childIndex=n,t.onNodeRemoved=o,He(r,t))}}function He(e,t){const{nodeTransforms:n}=t,o=[];for(let r=0;r<n.length;r++){const c=n[r](e,t);if(c&&(s(c)?o.push(...c):o.push(c)),!t.currentNode)return;e=t.currentNode}switch(e.type){case 3:t.helper(M);break;case 5:t.helper(j);break;case 9:for(let n=0;n<e.branches.length;n++)Ge(e.branches[n],t);break;case 11:case 1:case 0:Ge(e,t)}let r=o.length;for(;r--;)o[r]()}function Ue(e,t){const n=i(e)?t=>t===e:t=>e.test(t);return(e,o)=>{if(1===e.type){const{props:r}=e;if(3===e.tagType&&r.some(ce))return;const s=[];for(let c=0;c<r.length;c++){const i=r[c];if(7===i.type&&n(i.name)){r.splice(c,1),c--;const n=t(e,i,o);n&&s.push(n)}}return s}}}function Ye(e,t={}){const n=function(e,{mode:t="function",prefixIdentifiers:n="module"===t,sourceMap:o=!1,filename:r="template.vue.html"}){const s={mode:t,prefixIdentifiers:n,sourceMap:o,filename:r,source:e.loc.source,code:"",column:1,line:1,offset:0,indentLevel:0,map:void 0,helper(e){const t=q[e];return n?t:`_${t}`},push(e,t,n){s.code+=e},resetMapping(e){},indent(){c(++s.indentLevel)},deindent(e=!1){e?--s.indentLevel:c(--s.indentLevel)},newline(){c(s.indentLevel)}};function c(e){s.push("\n"+"  ".repeat(e))}return s}(e,t),{mode:o,push:r,helper:s,prefixIdentifiers:c,indent:i,deindent:l,newline:a}=n,u=e.helpers.length>0,p=!c&&"module"!==o;return"function"===o?(u&&(c?r(`const { ${e.helpers.map(s).join(", ")} } = Vue\n`):(r("const _Vue = Vue\n"),e.hoists.length&&(r(`const _${q[O]} = Vue.${q[O]}\n`),e.helpers.includes(M)&&r(`const _${q[M]} = Vue.${q[M]}\n`)))),Ze(e.hoists,n),a(),r("return ")):(u&&r(`import { ${e.helpers.map(s).join(", ")} } from "vue"\n`),Ze(e.hoists,n),a(),r("export default ")),r("function render() {"),i(),p?(r("with (this) {"),i(),u&&(r(`const { ${e.helpers.map(e=>`${q[e]}: _${q[e]}`).join(", ")} } = _Vue`),a(),e.cached>0&&(r("const _cache = $cache"),a()),a())):(r("const _ctx = this"),e.cached>0&&(a(),r("const _cache = _ctx.$cache")),a()),e.components.length&&Ke(e.components,"component",n),e.directives.length&&Ke(e.directives,"directive",n),(e.components.length||e.directives.length)&&a(),r("return "),e.codegenNode?et(e.codegenNode,n):r("null"),p&&(l(),r("}")),l(),r("}"),{ast:e,code:n.code,map:n.map?n.map.toJSON():void 0}}function Ke(e,t,n){const o=n.helper("component"===t?P:L);for(let r=0;r<e.length;r++){const s=e[r];n.push(`const ${ue(s,t)} = ${o}(${JSON.stringify(s)})`),n.newline()}}function Ze(e,t){e.length&&(t.newline(),e.forEach((e,n)=>{t.push(`const _hoisted_${n+1} = `),et(e,t),t.newline()}))}function Qe(e,t){const n=e.length>3||!1;t.push("["),n&&t.indent(),Xe(e,t,n),n&&t.deindent(),t.push("]")}function Xe(e,t,n=!1){const{push:o,newline:r}=t;for(let c=0;c<e.length;c++){const l=e[c];i(l)?o(l):s(l)?Qe(l,t):et(l,t),c<e.length-1&&(n?(o(","),r()):o(", "))}}function et(e,t){if(i(e))t.push(e);else if(l(e))t.push(t.helper(e));else switch(e.type){case 1:case 9:case 11:et(e.codegenNode,t);break;case 2:!function(e,t){t.push(JSON.stringify(e.content),e)}(e,t);break;case 4:tt(e,t);break;case 5:!function(e,t){const{push:n,helper:o}=t;n(`${o(j)}(`),et(e.content,t),n(")")}(e,t);break;case 12:et(e.codegenNode,t);break;case 8:nt(e,t);break;case 3:break;case 13:!function(e,t){const n=i(e.callee)?e.callee:t.helper(e.callee);t.push(n+"(",e,!0),Xe(e.arguments,t),t.push(")")}(e,t);break;case 14:!function(e,t){const{push:n,indent:o,deindent:r,newline:s,resetMapping:c}=t,{properties:i}=e;if(!i.length)return void n("{}",e);const l=i.length>1||!1;n(l?"{":"{ "),l&&o();for(let e=0;e<i.length;e++){const{key:o,value:r,loc:l}=i[e];c(l),ot(o,t),n(": "),et(r,t),e<i.length-1&&(n(","),s())}l&&r();const a=t.code[t.code.length-1];n(l||/[\])}]/.test(a)?"}":" }")}(e,t);break;case 16:!function(e,t){Qe(e.elements,t)}(e,t);break;case 17:!function(e,t){const{push:n,indent:o,deindent:r}=t,{params:c,returns:i,newline:l}=e;n("(",e),s(c)?Xe(c,t):c&&et(c,t);n(") => "),l&&(n("{"),o(),n("return "));s(i)?Qe(i,t):et(i,t);l&&(r(),n("}"))}(e,t);break;case 18:!function(e,t){t.push("("),Xe(e.expressions,t),t.push(")")}(e,t);break;case 19:!function(e,t){const{test:n,consequent:o,alternate:r}=e,{push:s,indent:c,deindent:i,newline:l}=t;if(4===n.type){const e=!K(n.content);e&&s("("),tt(n,t),e&&s(")")}else s("("),nt(n,t),s(")");c(),t.indentLevel++,s("? "),et(o,t),t.indentLevel--,l(),s(": ");const a=19===r.type;a||t.indentLevel++;et(r,t),a||t.indentLevel--;i(!0)}(e,t);break;case 20:!function(e,t){const{push:n,helper:o,indent:r,deindent:s,newline:c}=t;n(`_cache[${e.index}] || (`),e.isVNode&&(r(),n(`${o(z)}(-1),`),c());n(`_cache[${e.index}] = `),et(e.value,t),e.isVNode&&(n(","),c(),n(`${o(z)}(1),`),c(),n(`_cache[${e.index}]`),s());n(")")}(e,t)}}function tt(e,t){const{content:n,isStatic:o}=e;t.push(o?JSON.stringify(n):n,e)}function nt(e,t){for(let n=0;n<e.children.length;n++){const o=e.children[n];i(o)?t.push(o):et(o,t)}}function ot(e,t){const{push:n}=t;if(8===e.type)n("["),nt(e,t),n("]");else if(e.isStatic){n(K(e.content)?e.content:JSON.stringify(e.content),e)}else n(`[${e.content}]`,e)}const rt=Ue(/^(if|else|else-if)$/,(e,t,n)=>{if(!("else"===t.name||t.exp&&t.exp.content.trim())){const o=t.exp?t.exp.loc:e.loc;n.onError(f(35,t.loc)),t.exp=y("true",!1,o)}if("if"===t.name){const o=st(e,t),r=S([v(n.helper($))]);return n.replaceNode({type:9,loc:e.loc,branches:[o],codegenNode:r}),()=>{r.expressions.push(ct(o,0,n))}}{const o=n.parent.children;let r=o.indexOf(e);for(;r-- >=-1;){const s=o[r];if(s&&9===s.type){n.removeNode();const o=st(e,t);s.branches.push(o),Ge(o,n),n.currentNode=null;let r=s.codegenNode.expressions[1];for(;;){if(19!==r.alternate.type){r.alternate=ct(o,s.branches.length-1,n);break}r=r.alternate}}else n.onError(f(36,e.loc));break}}});function st(e,t){return{type:10,loc:e.loc,condition:"else"===t.name?void 0:t.exp,children:3===e.tagType?e.children:[e]}}function ct(e,t,n){return e.condition?N(e.condition,it(e,t,n),v(n.helper(M),['""',"true"])):it(e,t,n)}function it(e,t,n){const{helper:o}=n,r=m("key",y(t+"",!1)),{children:s}=e,c=s[0];if(1!==s.length||1!==c.type){const e=[o(T),g([r]),s];if(1===s.length&&11===c.type){const t=c.codegenNode.expressions[1].arguments;e[2]=t[2],e[3]=t[3]}return v(o(C),e)}{const e=c.codegenNode;let t=e;return t.callee===R&&(t=t.arguments[0]),t.callee===O&&(t.callee=o(C)),ae(t,r,n),e}}const lt=Ue("for",(e,t,n)=>{if(!t.exp)return void n.onError(f(37,t.loc));const o=ft(t.exp);if(!o)return void n.onError(f(38,t.loc));const{helper:r,addIdentifiers:s,removeIdentifiers:c,scopes:i}=n,{source:l,value:a,key:u,index:p}=o,d=v(r(A),[l]),h=re(e,"key"),x=h?64:128,N=S([v(r($),["false"]),v(r(C),[r(T),"null",d,x+""])]);return n.replaceNode({type:11,loc:t.loc,source:l,valueAlias:a,keyAlias:u,objectIndexAlias:p,children:3===e.tagType?e.children:[e],codegenNode:N}),i.vFor++,()=>{let t;i.vFor--;const s=ie(e),c=le(e)?e:s&&1===e.children.length&&le(e.children[0])?e.children[0]:null,l=h?m("key",6===h.type?y(h.value.content,!0):h.exp):null;if(c)t=c.codegenNode,s&&l&&ae(t,l,n);else if(s)t=se(v(r(C),[r(T),l?g([l]):"null",e.children]),n);else{let o=e.codegenNode;o.callee===R?o.arguments[0].callee=r(C):o.callee=r(C),t=se(o,n)}d.arguments.push(b(ht(o),t,!0))}}),at=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,ut=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,pt=/^\(|\)$/g;function ft(e,t){const n=e.loc,o=e.content,r=o.match(at);if(!r)return;const[,s,c]=r,i={source:dt(n,c.trim(),o.indexOf(c,s.length)),value:void 0,key:void 0,index:void 0};let l=s.trim().replace(pt,"").trim();const a=s.indexOf(l),u=l.match(ut);if(u){l=l.replace(ut,"").trim();const e=u[1].trim();let t;if(e&&(t=o.indexOf(e,a+l.length),i.key=dt(n,e,t)),u[2]){const r=u[2].trim();r&&(i.index=dt(n,r,o.indexOf(r,i.key?t+e.length:a+l.length)))}}return l&&(i.value=dt(n,l,a)),i}function dt(e,t,n){return y(t,!1,X(e,n,t.length))}function ht({value:e,key:t,index:n}){const o=[];return e&&o.push(e),t&&(e||o.push(y("_",!1)),o.push(t)),n&&(t||(e||o.push(y("_",!1)),o.push(y("__",!1))),o.push(n)),o}const gt=e=>4===e.type&&e.isStatic,mt=y("undefined",!1),yt=(e,t)=>{if(1===e.type&&(1===e.tagType||3===e.tagType)){const n=oe(e,"slot");if(n){n.exp;return t.scopes.vSlot++,()=>{t.scopes.vSlot--}}}};function xt(e,t,n){return m("default",b(e,t,!1,t.length?t[0].loc:n))}function vt(e,t){return g([m("name",e),m("fn",t)])}const bt=new WeakMap,St=(e,t)=>{if(!(1!==e.type||2===e.tagType||3===e.tagType&&e.props.some(ce)))return()=>{const n=1===e.tagType;let o,r,s,c=e.props.length>0,i=0;const l=re(e,"is");if("component"===e.tag&&l)if(6===l.type){const e=l.value&&l.value.content;e&&(t.helper(P),t.components.add(e),s=ue(e,"component"))}else l.exp&&(s=v(t.helper(I),[l.exp]));n&&!s&&(t.helper(P),t.components.add(e.tag));const a=[s||(n?ue(e.tag,"component"):4===e.tagType?t.helper(E):5===e.tagType?t.helper(w):`"${e.tag}"`)];if(c){const n=Nt(e,t,e.props.filter(e=>e!==l));i=n.patchFlag,r=n.dynamicPropNames,o=n.directives,n.props?a.push(n.props):c=!1}const u=e.children.length>0;if(u)if(c||a.push("null"),n){const{slots:n,hasDynamicSlots:o}=function(e,t){const{children:n,loc:o}=e,r=[],s=[];let c=t.scopes.vSlot>0||t.scopes.vFor>0;const i=oe(e,"slot",!0);if(i){const{arg:e,exp:o,loc:s}=i;e&&t.onError(f(42,s)),r.push(xt(o,n,s))}let l=!1,a=void 0;const u=new Set;for(let e=0;e<n.length;e++){const o=n[e];let p;if(!ie(o)||!(p=oe(o,"slot",!0))){3===o.type||a||(a=o);continue}if(i){t.onError(f(43,p.loc));break}l=!0;const{children:d,loc:h}=o,{arg:g=y("default",!0),exp:x,loc:S}=p;let k;gt(g)?k=g?g.content:"default":c=!0;const T=b(x,d,!1,d.length?d[0].loc:h);let E,w,$;if(E=oe(o,"if"))c=!0,s.push(N(E.exp,vt(g,T),mt));else if(w=oe(o,/^else(-if)?$/,!0)){let o,r=e;for(;r--&&3===(o=n[r]).type;);if(o&&ie(o)&&oe(o,"if")){n.splice(e,1),e--;let t=s[s.length-1];for(;19===t.alternate.type;)t=t.alternate;t.alternate=w.exp?N(w.exp,vt(g,T),mt):vt(g,T)}else t.onError(f(36,w.loc))}else if($=oe(o,"for")){c=!0;const e=$.parseResult||ft($.exp);e?s.push(v(t.helper(A),[e.source,b(ht(e),vt(g,T),!0)])):t.onError(f(38,$.loc))}else{if(k){if(u.has(k)){t.onError(f(44,S));continue}u.add(k)}r.push(m(g,T))}}l&&a&&t.onError(f(45,a.loc)),i||l||r.push(xt(void 0,n,o));let p=g(r.concat(m("_compiled",y("true",!1))),o);return s.length&&(p=v(t.helper(D),[p,h(s)])),{slots:p,hasDynamicSlots:c}}(e,t);a.push(n),o&&(i|=256)}else if(1===e.children.length){const t=e.children[0],n=t.type,o=5===n||8===n;o&&!De(t)&&(i|=1),o||2===n?a.push(t):a.push(e.children)}else a.push(e.children);0!==i&&(u||(c||a.push("null"),a.push("null")),a.push(i+""),r&&r.length&&a.push(`[${r.map(e=>JSON.stringify(e)).join(", ")}]`));const{loc:p}=e,d=v(t.helper(O),a,p);o&&o.length?e.codegenNode=v(t.helper(R),[d,h(o.map(e=>(function(e,t){const n=[],o=bt.get(e);o?(t.helper(o),n.push(t.helperString(o))):(t.helper(L),t.directives.add(e.name),n.push(ue(e.name,"directive")));const{loc:r}=e;e.exp&&n.push(e.exp);e.arg&&(e.exp||n.push("void 0"),n.push(e.arg));Object.keys(e.modifiers).length&&(e.arg||(e.exp||n.push("void 0"),n.push("void 0")),n.push(g(e.modifiers.map(e=>m(e,y("true",!1,r))),r)));return h(n,e.loc)})(e,t)),p)],p):e.codegenNode=d}};function Nt(e,t,n=e.props){const o=e.loc,r=1===e.tagType;let s=[];const c=[],i=[];let a=0,u=!1,p=!1,d=!1,h=!1;const x=[],b=({key:e,value:t})=>{if(4===e.type&&e.isStatic){if(20===t.type||(4===t.type||8===t.type)&&De(t))return;const n=e.content;"ref"===n?u=!0:"class"===n?p=!0:"style"===n?d=!0:"key"!==n&&x.push(n)}else h=!0};for(let a=0;a<n.length;a++){const p=n[a];if(6===p.type){const{loc:e,name:t,value:n}=p;"ref"===t&&(u=!0),s.push(m(y(t,!0,X(e,0,t.length)),y(n?n.content:"",!0,n?n.loc:e)))}else{const{name:n,arg:a,exp:u,loc:d}=p;if("slot"===n){r||t.onError(f(46,d));continue}if("once"===n)continue;const m="bind"===n,y="on"===n;if(!a&&(m||y)){h=!0,u?(s.length&&(c.push(g(kt(s),o)),s=[]),m?c.push(u):c.push({type:13,loc:d,callee:t.helper(J),arguments:[u]})):t.onError(f(m?39:40,d));continue}const x=t.directiveTransforms[n];if(x){const{props:n,needRuntime:o}=x(p,e,t);n.forEach(b),s.push(...n),o&&(i.push(p),l(o)&&bt.set(p,o))}else i.push(p)}}let S=void 0;return c.length?(s.length&&c.push(g(kt(s),o)),S=c.length>1?v(t.helper(F),c,o):c[0]):s.length&&(S=g(kt(s),o)),h?a|=16:(p&&(a|=2),d&&(a|=4),x.length&&(a|=8)),0===a&&(u||i.length>0)&&(a|=32),{props:S,directives:i,patchFlag:a,dynamicPropNames:x}}function kt(e){const t={},n=[];for(let o=0;o<e.length;o++){const r=e[o];if(8===r.key.type||!r.key.isStatic){n.push(r);continue}const s=r.key.content,c=t[s];c?("style"===s||"class"===s||s.startsWith("on")||s.startsWith("vnode"))&&Tt(c,r):(t[s]=r,n.push(r))}return n}function Tt(e,t){16===e.value.type?e.value.elements.push(t.value):e.value=h([e.value,t.value],e.loc)}const Et=(e,t)=>{if(le(e)){const{props:n,children:o,loc:r}=e,s=t.prefixIdentifiers?"_ctx.$slots":"$slots";let c='"default"',i=-1;for(let e=0;e<n.length;e++){const t=n[e];if(6===t.type){if("name"===t.name&&t.value){c=JSON.stringify(t.value.content),i=e;break}}else if("bind"===t.name){const{arg:n,exp:o}=t;if(n&&o&&4===n.type&&n.isStatic&&"name"===n.content){c=o,i=e;break}}}const l=[s,c],a=i>-1?n.slice(0,i).concat(n.slice(i+1)):n;let u=a.length>0;if(u){const{props:n,directives:o}=Nt(e,t,a);o.length&&t.onError(f(41,o[0].loc)),n?l.push(n):u=!1}o.length&&(u||l.push("{}"),l.push(o)),e.codegenNode=v(t.helper(V),l,r)}},wt=/^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,$t=(e,t,n,o)=>{const{loc:r,modifiers:s,arg:c}=e;let i;e.exp||s.length||n.onError(f(40,r)),4===c.type?i=c.isStatic?y(`on${(e=>e.charAt(0).toUpperCase()+e.slice(1))(c.content)}`,!0,c.loc):x(['"on" + (',c,")"]):((i=c).children.unshift('"on" + ('),i.children.push(")"));let l=e.exp,a=!l;if(l){const e=Q(l.content);(!(e||wt.test(l.content))||a&&e)&&(l=x(["$event => (",...4===l.type?[l]:l.children,")"]))}let u={props:[m(i,l||y("() => {}",!1,r))],needRuntime:!1};return o&&(u=o(u)),a&&(u.props[0].value=n.cache(u.props[0].value)),u},Ct=(e,t,n)=>{const{exp:o,modifiers:r,loc:s}=e,c=e.arg;return o||n.onError(f(39,s)),r.includes("camel")&&(4===c.type?c.isStatic?c.content=(e=>e.replace(u,(e,t)=>t?t.toUpperCase():""))(c.content):c.content=`${n.helperString(W)}(${c.content})`:(c.children.unshift(`${n.helperString(W)}(`),c.children.push(")"))),{props:[m(c,o||y("",!0,s))],needRuntime:!1}},Ot=e=>5===e.type||2===e.type,Mt=(e,t)=>{if(0===e.type||1===e.type)return()=>{const o=e.children;let r=void 0,s=!1;for(let e=0;e<o.length;e++){const t=o[e];if(Ot(t)){s=!0;for(let n=e+1;n<o.length;n++){const s=o[n];if(!Ot(s)){r=void 0;break}r||(r=o[e]={type:8,loc:t.loc,children:[t]}),r.children.push(" + ",s),o.splice(n,1),n--}}}if(s&&o.length>1)for(let e=0;e<o.length;e++){const r=o[e];if(Ot(r)||8===r.type){const s=[];2===r.type&&" "===r.content||s.push(r),2!==r.type&&s.push(`1 /* ${n[1]} */`),o[e]={type:12,content:r,loc:r.loc,codegenNode:v(t.helper(_),s)}}}}},_t=(e,t)=>{if(1===e.type&&oe(e,"once",!0))return t.helper(z),()=>{e.codegenNode&&(e.codegenNode=t.cache(e.codegenNode,!0))}},Pt=(e,t,n)=>{const{exp:o,arg:r}=e;if(!o)return n.onError(f(47,e.loc)),It();const s=4===o.type?o.content:o.loc.source;if(!Q(s))return n.onError(f(48,o.loc)),It();const c=r||y("modelValue",!0),i=r?4===r.type&&r.isStatic?y("onUpdate:"+r.content,!0):x([y("onUpdate:",!0),"+",...4===r.type?[r]:r.children]):y("onUpdate:modelValue",!0),l=[m(c,e.exp),m(i,x(["$event => (",...4===o.type?[o]:o.children," = $event)"]))];if(e.modifiers.length&&1===t.tagType){const t=e.modifiers.map(e=>(K(e)?e:JSON.stringify(e))+": true").join(", ");l.push(m("modelModifiers",y(`{ ${t} }`,!1,e.loc,!0)))}return It(l)};function It(e=[]){return{props:e,needRuntime:!1}}const Lt=2;function Rt(e,t={}){{const e=t.onError||p;!0===t.prefixIdentifiers?e(f(51)):"module"===t.mode&&e(f(52))}const n=i(e)?fe(e,t):e;return Be(n,{...t,prefixIdentifiers:!1,nodeTransforms:[_t,rt,lt,Et,St,yt,Mt,...t.nodeTransforms||[]],directiveTransforms:{on:$t,bind:Ct,model:Pt,...t.directiveTransforms||{}}}),Ye(n,{...t,prefixIdentifiers:!1})}const At=t("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Vt=t("svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,lineGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view"),Dt=t("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr"),jt=t("style,iframe,script,noscript",!0),Ft={isVoidTag:Dt,isNativeTag:e=>At(e)||Vt(e),isPreTag:e=>"pre"===e,getNamespace(e,t){let n=t?t.ns:0;if(t&&2===n)if("annotation-xml"===t.tag){if("svg"===e)return 1;t.props.some(e=>6===e.type&&"encoding"===e.name&&null!=e.value&&("text/html"===e.value.content||"application/xhtml+xml"===e.value.content))&&(n=0)}else/^m(?:[ions]|text)$/.test(t.tag)&&"mglyph"!==e&&"malignmark"!==e&&(n=0);else t&&1===n&&("foreignObject"!==t.tag&&"desc"!==t.tag&&"title"!==t.tag||(n=0));if(0===n){if("svg"===e)return 1;if("math"===e)return 2}return n},getTextMode(e,t){if(0===t){if("textarea"===e||"title"===e)return 1;if(jt(e))return 2}return 0}},Jt=(e,t)=>{1===e.type&&e.props.forEach((n,o)=>{if(6===n.type&&"style"===n.name&&n.value){const r=JSON.stringify(function(e){const t={};return e.split(Wt).forEach(function(e){if(e){const n=e.split(zt);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}(n.value.content)),s=t.hoist(y(r,!1,n.loc));e.props[o]={type:7,name:"bind",arg:y("style",!0,n.loc),exp:s,modifiers:[],loc:n.loc}}})},Wt=/;(?![^(]*\))/g,zt=/:(.+)/;const qt=(e,t)=>({props:[],needRuntime:!1});function Bt(e,t){return f(e,t)}const Gt=(e,t,n)=>{const{exp:o,loc:r}=e;return o||n.onError(Bt(53,r)),t.children.length&&(n.onError(Bt(54,r)),t.children.length=0),{props:[m(y("innerHTML",!0,r),o||y("",!0))],needRuntime:!1}},Ht=(e,t,n)=>{const{exp:o,loc:r}=e;return o||n.onError(Bt(55,r)),t.children.length&&(n.onError(Bt(56,r)),t.children.length=0),{props:[m(y("textContent",!0,r),o||y("",!0))],needRuntime:!1}},Ut=Symbol(""),Yt=Symbol(""),Kt=Symbol(""),Zt=Symbol(""),Qt=Symbol(""),Xt=Symbol(""),en=Symbol("");B({[Ut]:"vModelRadio",[Yt]:"vModelCheckbox",[Kt]:"vModelText",[Zt]:"vModelSelect",[Qt]:"vModelDynamic",[Xt]:"withModifiers",[en]:"withKeys"});const tn=(e,t,n)=>{const o=Pt(e,t,n);if(!o.props.length)return o;const{tag:r,tagType:s}=t;if(0===s)if(e.arg&&n.onError(Bt(58,e.arg.loc)),"input"===r||"textarea"===r||"select"===r){let s=Kt,c=!1;if("input"===r){const o=re(t,"type");if(o)if(7===o.type)s=Qt;else if(o.value)switch(o.value.content){case"radio":s=Ut;break;case"checkbox":s=Yt;break;case"file":c=!0,n.onError(Bt(59,e.loc))}}else"select"===r&&(s=Zt);c||(o.needRuntime=n.helper(s))}else n.onError(Bt(57,e.loc));return o},nn=t("passive,once,capture"),on=t("stop,prevent,self,ctrl,shift,alt,meta,exact,left,middle,right"),rn=t("onkeyup,onkeydown,onkeypress",!0),sn=(e,t,n)=>$t(e,t,n,t=>{const{modifiers:o}=e;if(!o.length)return t;let{key:r,value:s}=t.props[0];const c=o.filter(nn),i=o.filter(e=>!nn(e)),l=i.filter(on);l.length&&(s=v(n.helper(Xt),[s,JSON.stringify(l)]));const a=i.filter(e=>!on(e));return!a.length||8!==r.type&&r.isStatic&&!rn(r.content)||(s=v(n.helper(en),[s,JSON.stringify(a)])),c.length&&(s=g([m("handler",s),m("options",g(c.map(e=>m(e,y("true",!1)))))])),{props:[m(r,s)],needRuntime:!1}});return e.advancePositionWithClone=ee,e.advancePositionWithMutation=te,e.assert=ne,e.baseCompile=Rt,e.compile=function(e,t={}){return Rt(e,{...t,...Ft,nodeTransforms:[Jt,...t.nodeTransforms||[]],directiveTransforms:{cloak:qt,html:Gt,text:Ht,model:tn,on:sn,...t.directiveTransforms||{}}})},e.createArrayExpression=h,e.createBlockExpression=se,e.createCacheExpression=k,e.createCallExpression=v,e.createCompilerError=f,e.createCompoundExpression=x,e.createConditionalExpression=N,e.createFunctionExpression=b,e.createInterpolation=function(e,t){return{type:5,loc:t,content:i(e)?y(e,!1,t):e}},e.createObjectExpression=g,e.createObjectProperty=m,e.createSequenceExpression=S,e.createSimpleExpression=y,e.createStructuralDirectiveTransform=Ue,e.findDir=oe,e.findProp=re,e.generate=Ye,e.generateCodeFrame=function(e,t=0,n=e.length){const o=e.split(/\r?\n/);let r=0;const s=[];for(let e=0;e<o.length;e++)if((r+=o[e].length+1)>=t){for(let c=e-Lt;c<=e+Lt||n>r;c++){if(c<0||c>=o.length)continue;s.push(`${c+1}${" ".repeat(3-String(c+1).length)}|  ${o[c]}`);const i=o[c].length;if(c===e){const e=t-(r-i)+1,o=n>r?i-e:n-t;s.push("   |  "+" ".repeat(e)+"^".repeat(o))}else if(c>e){if(n>r){const e=Math.min(n-r,i);s.push("   |  "+"^".repeat(e))}r+=i+1}}break}return s.join("\n")},e.getInnerRange=X,e.hasScopeRef=function e(t,n){if(!t||0===Object.keys(n).length)return!1;switch(t.type){case 1:for(let o=0;o<t.props.length;o++){const r=t.props[o];if(7===r.type&&(e(r.arg,n)||e(r.exp,n)))return!0}return t.children.some(t=>e(t,n));case 11:return!!e(t.source,n)||t.children.some(t=>e(t,n));case 9:return t.branches.some(t=>e(t,n));case 10:return!!e(t.condition,n)||t.children.some(t=>e(t,n));case 4:return!t.isStatic&&K(t.content)&&!!n[t.content];case 8:return t.children.some(t=>a(t)&&e(t,n));case 5:case 12:return e(t.content,n);case 2:case 3:default:return!1}},e.injectProp=ae,e.isHTMLTag=At,e.isMemberExpression=Q,e.isSVGTag=Vt,e.isSimpleIdentifier=K,e.isSlotOutlet=le,e.isTemplateNode=ie,e.isVSlot=ce,e.isVoidTag=Dt,e.loadDep=U,e.locStub=d,e.parse=fe,e.parseJS=(e,t)=>{return ne(!1,"Expression AST analysis can only be performed in non-browser builds."),(G||(G=U("acorn").parse))(e,t)},e.registerRuntimeHelpers=B,e.toValidAssetId=ue,e.transform=Be,e.transformModel=Pt,e.transformOn=$t,e.walkJS=(e,t)=>{return ne(!1,"Expression AST analysis can only be performed in non-browser builds."),(H||(H=U("estree-walker").walk))(e,t)},e}({});
