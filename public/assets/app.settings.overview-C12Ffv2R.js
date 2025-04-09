import{r as n,j as e}from"./jsx-runtime-kF-aRxYe.js";import{P as l,M as c}from"./index-DRridQs4.js";import{A as d,O as p}from"./alert-DTTcjJsS.js";import{C as r}from"./card-CI__rBma.js";import{c as m}from"./index-Bm4zUeiC.js";import{B as u}from"./createLucideIcon-DG7n1AWV.js";import{c as x}from"./components-Dbuj-jCe.js";import"./index-FAq9z4ls.js";import"./index-Cu60BknP.js";import"./alert-Qr8uk1we.js";import"./x-BsuXUyX7.js";function h({total:s,tokens:t=3e4}){const[i,o]=n.useState(0),a=t/100;return n.useEffect(()=>{o(s>=t?100:s/a)},[s]),e.jsxs("div",{className:"grid gap-4",children:[e.jsxs("div",{className:"grid gap-1",children:[e.jsxs("strong",{className:"text-sm text-zinc-400",children:[i.toString().split(".")[0],"%"]}),e.jsx(l,{value:i})]}),e.jsxs("div",{className:"flex gap-4 justify-between text-sm",children:[e.jsxs("span",{children:["Usage tokens: ",e.jsx("strong",{children:s})]}),e.jsxs("span",{children:["Limit tokens: ",e.jsx("strong",{children:t})]})]})]})}function U(){const s=x();return e.jsx("div",{className:"grid gap-4",children:s?.plan?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"flex justify-between",children:e.jsxs("span",{className:m("text-primary",s.plan?.expired?"text-red-500":"text-green-500"),children:["License: ",s.plan?.name]})}),e.jsxs(r,{className:"shadow-none",title:"Tokens used",children:[e.jsx(h,{tokens:s.plan?.tokens,total:s.plan?.$tokens??0}),s.plan?.expired&&e.jsx(d,{className:"mt-8",icon:e.jsx(p,{}),title:"Free Trial License has come to an end!",description:"License tokens finished, Go to Pricing to get a new license.",variant:"destructive",actionButton:{title:"Upgrade Now",onClick:()=>{window.location=s?.sitePricingUrl}},open:!0})]}),s.plan?.isFree&&e.jsx(c,{children:g,className:"p-4 text-sm space-y-4 [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:my-2 [&>ul]:pl-4 [&>ol]:list-disc [&>ol]:my-2 [&>ol]:pl-4"})]}):e.jsx("div",{className:"grid gap-2",children:e.jsxs(r,{className:"shadow-none",title:"Get new License",children:[e.jsx("div",{children:"You don't have an active license to start. Please get a new license."}),e.jsx("div",{className:"flex justify-end",children:e.jsx(u,{onClick:()=>window.location=s?.sitePricingUrl,children:"Get License"})})]})})})}const g=`
  You're currently using the Free Trial version of CBA Pro.

  The free trial is designed to give you a hands-on experience with how the platform works --- but it includes access to only one competency: **1.1 -- Regulation, Codes & Standards.**

  All other competencies (2.1 to 7.5) are locked in the trial version.
  To unlock the full set of 34 competencies and submit a complete competency report, you'll need to upgrade your license.

  - This limited access allows you to:
  - Explore the dashboard layout
  - Interact with memory-triggering questions
  - Understand how personalized prompts guide your writing
  - Experience the self-assessment scoring system
  - Preview the report writing tool
`;export{U as default};
