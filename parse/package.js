import t from"fs";const s=JSON.parse(t.readFileSync("./package.json","utf8"));s.scripts={start:s.scripts.start},t.writeFileSync("./build/package.json",JSON.stringify(s,null,2));
