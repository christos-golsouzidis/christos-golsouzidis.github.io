import{am as i,ad as f,an as p,J as _,ao as h,ap as E,h as s,q as o,R as T,b as g}from"./CiOJEScW.js";function y(n){var t=document.createElement("template");return t.innerHTML=n,t.content}function r(n,t){var e=_;e.nodes_start===null&&(e.nodes_start=n,e.nodes_end=t)}function M(n,t){var e=(t&h)!==0,c=(t&E)!==0,a,m=!n.startsWith("<!>");return()=>{if(s)return r(o,null),o;a===void 0&&(a=y(m?n:"<!>"+n),e||(a=f(a)));var d=c||p?document.importNode(a,!0):a.cloneNode(!0);if(e){var l=f(d),v=d.lastChild;r(l,v)}else r(d,d);return d}}function N(n=""){if(!s){var t=i(n+"");return r(t,t),t}var e=o;return e.nodeType!==3&&(e.before(e=i()),T(e)),r(e,e),e}function b(){if(s)return r(o,null),o;var n=document.createDocumentFragment(),t=document.createComment(""),e=i();return n.append(t,e),r(t,e),n}function L(n,t){if(s){_.nodes_end=o,g();return}n!==null&&n.before(t)}const w="5";var u;typeof window<"u"&&((u=window.__svelte??(window.__svelte={})).v??(u.v=new Set)).add(w);export{L as a,N as b,b as c,r as d,M as t};
