function e(r){return JSON.parse(r,(n,t)=>typeof t=="string"&&t.length===24&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(t)?new Date(t):t)}export{e as j};
