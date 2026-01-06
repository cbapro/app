import{r as i,j as e}from"./jsx-runtime-CNvHvvCs.js";import{P as p}from"./progress-CJl6U-AQ.js";import"./alert-Dv8VQtr3.js";import{B as x}from"./button-7RhbRVm-.js";import{c as h}from"./index-z_6t8hgT.js";import{C as r}from"./card-DT7V15za.js";import{u as g,a as u}from"./components-BATxfdox.js";import{c as j}from"./createLucideIcon-BdpXmnmz.js";import{X as a}from"./x-BjiBxalF.js";import{M as f}from"./index-DzK6_lIe.js";import"./index-tUIF4Hk4.js";import"./index-BvRv39A9.js";import"./index-R_5LapDR.js";import"./index-D3JQEnQH.js";import"./card-b0vSRkw8.js";function v({usedTokens:s=0,totalTokens:t,baseTokens:l,extraTokens:c=0}){const[n,d]=i.useState(0),m=t/100;return i.useEffect(()=>{d(s>=t?100:s/m)},[s]),e.jsxs("div",{className:"grid gap-4",children:[e.jsxs("div",{className:"grid gap-1",children:[e.jsxs("strong",{className:"text-sm text-zinc-400",children:[n.toString().split(".")[0],"%"]}),e.jsx(p,{value:n})]}),e.jsxs("div",{className:"flex gap-4 justify-between text-sm",children:[e.jsxs("div",{children:["Used tokens: ",e.jsx("strong",{children:s})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-1",children:["Total: ",e.jsx("strong",{children:t}),e.jsx("hr",{className:"col-span-2"}),"Base: ",e.jsx("span",{children:l}),"Extra: ",e.jsx("span",{children:c})]})]})]})}/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],o=j("check",y);function R(){const s=g();return u(),i.useEffect(()=>{console.log(s?.plan)},[s]),e.jsx("div",{className:"grid gap-4",children:s?.plan?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"flex justify-center",children:e.jsxs("span",{className:h("text-primary",s.plan?.expired?"text-red-500":"text-green-500"),children:["License: ",e.jsxs("b",{children:[s.plan?.name," ",s.plan?.expired&&"Eexpired!"]})]})}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(r,{className:"shadow-none bg-zinc-50",title:"Credits",children:e.jsx(v,{totalTokens:s.plan?.totalTokens,usedTokens:s.plan?.usedTokens,baseTokens:s?.plan?.baseTokens,extraTokens:s?.plan?.extraTokens})}),e.jsxs(r,{className:"shadow-none bg-zinc-50",title:"Access",children:[e.jsxs("div",{className:"grid grid-cols-2 text-sm [&>svg]:w-4",children:["Competencies: ",e.jsxs("strong",{children:[s?.plan?.cycles," of ",34]}),"Voice to text: ",s?.plan?.voiceToText?e.jsx(o,{}):e.jsx(a,{}),"Draft refinement: ",s?.plan?.draftRefinement?e.jsx(o,{}):e.jsx(a,{})]}),e.jsx("hr",{className:"mt-6 mb-1"}),e.jsx("small",{className:"text-orange-500",children:"Upgrade your license using the plans menu on the left."})]})]}),s.plan?.isFree&&e.jsx(f,{children:N,className:"p-4 text-sm space-y-4 [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:my-2 [&>ul]:pl-4 [&>ol]:list-disc [&>ol]:my-2 [&>ol]:pl-4"})]}):e.jsx("div",{className:"grid gap-2",children:e.jsxs(r,{className:"shadow-none",title:"Get new License",children:[e.jsx("div",{children:"You don't have an active license to start. Please get a new license."}),e.jsx("div",{className:"flex justify-end",children:e.jsx(x,{onClick:()=>window.location=s?.sitePricingUrl,children:"Get License"})})]})})})}const N=`
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
`;export{R as default};
