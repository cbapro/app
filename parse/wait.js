async function a(o=1e3){console.log(`wait for ${o/1e3}s`),await new Promise(t=>setTimeout(t,o))}export{a as default};
