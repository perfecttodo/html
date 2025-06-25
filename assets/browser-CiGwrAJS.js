import{j as p}from"./index-DgEyOmge.js";async function f(){const e=document.createElement("div");e.id="overlay";const t=document.createElement("iframe");t.id="pickerFrame",e.appendChild(t),document.body.appendChild(e),e.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `,t.style.cssText=`
        width: 500px;
        height: 400px;
        border: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: all 0.3s ease;
        border-radius: 8px;
    `,e.offsetWidth,t.offsetWidth,e.style.opacity="1",t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1)";const a=Date.now().toString(36)+Math.random().toString(36).substr(2);e.addEventListener("click",o=>{o.target===e&&t.contentWindow.postMessage({type:"cancel",instanceId:a,error:"Clicked outside"},"*")});const n=t.contentDocument||t.contentWindow.document;return n.open(),n.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    height: 100%;
                }
                .file-picker {
                    width: 100%;
                    height: 100%;
                }
                .container {
                    padding: 20px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    position: absolute;
                    inset: 0;
                }
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 20px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: #666;
                }
                .close-btn:hover {
                    color: #333;
                }
                .search-bar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                #searchInput {
                    padding: 8px;
                    flex-grow: 1;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                button {
                    padding: 8px 16px;
                    background-color: #f0f0f0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                button:hover {
                    background-color: #e0e0e0;
                }
                #itemList {
                    flex-grow: 1;
                    max-height: 250px;
                    overflow-y: auto;
                    border: 1px solid #eee;
                    padding: 10px;
                    margin-top: 15px;
                }
                #itemList p {
                    margin: 5px 0;
                    padding: 8px;
                    cursor: pointer;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    transition: background-color 0.2s;
                }
                #itemList p:hover {
                    background-color: #f5f5f5;
                }
                #itemList p.selected {
                    background-color: #e0f0ff;
                    border-left: 4px solid #4a90e2;
                }
                .file-size {
                    color: #666;
                    font-size: 0.9em;
                }
                .no-items {
                    color: #777;
                    text-align: center;
                    padding: 20px;
                    display: none; /* Start hidden */
                }
                .button-container {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .button-container button:first-child {
                    background-color: #4a90e2;
                    color: white;
                }
                .button-container button:first-child:hover {
                    background-color: #3a7bc8;
                }
            </style>
        </head>
        <body>
            <div class="file-picker">
                <div class="container">
                    <button class="close-btn" onclick="closeDialog()">×</button>
                    <h3>Select a .treegridio file</h3>
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Search .treegridio files..." onkeyup="filterItems()">
                        <button onclick="searchItems()">Search</button>
                    </div>
                    <div id="itemList"></div>
                    <p class="no-items" id="noItems">No .treegridio files found</p>
                </div>
            </div>
            <script>
                // Function to open the IndexedDB database
                async function openDatabase(dbName, storeName) {
                    return new Promise((resolve, reject) => {
                        const request = indexedDB.open(dbName, 1);
                        
                        request.onerror = (event) => {
                            reject(event.target.error);
                        };
                        
                        request.onsuccess = (event) => {
                            resolve(event.target.result);
                        };
                        
                        request.onupgradeneeded = (event) => {
                            const db = event.target.result;
                            if (!db.objectStoreNames.contains(storeName)) {
                                db.createObjectStore(storeName, { keyPath: 'id' });
                            }
                        };
                    });
                }

                const instanceId = "${a}";
                let selectedItem = null;

                async function getAllTreegridioFiles() {
                    const db = await openDatabase('database', 'files');
                    return new Promise((resolve, reject) => {
                        const transaction = db.transaction(['files'], 'readonly');
                        const store = transaction.objectStore('files');
                        const request = store.getAll();

                        request.onerror = (event) => {
                            reject(event.target.error);
                        };

                        request.onsuccess = (event) => {
                            const files = event.target.result.map(file => ({
                                name: file.id,
                                size: file.data ? new Blob([file.data]).size : 0
                            }));
                            resolve(files);
                        };
                    });
                }



                function formatFileSize(bytes) {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                }

                async function loadItems() {
                    const files = await getAllTreegridioFiles();
                    const list = document.getElementById('itemList');
                    const noItems = document.getElementById('noItems');
                    list.innerHTML = '';
                    
                    if (files.length === 0) {
                        noItems.style.display = 'block';
                    } else {
                        noItems.style.display = 'none';
                        files.forEach(file => {
                            const p = document.createElement('p');
                            p.innerHTML = \`
                                <span>\${file.name}</span>
                                <span class="file-size">\${formatFileSize(file.size)}</span>
                            \`;
                            
                            // Single click to select
                            p.onclick = () => {
                                const prevSelected = list.querySelector('.selected');
                                if (prevSelected) prevSelected.classList.remove('selected');
                                p.classList.add('selected');
                                selectedItem = file.name;
                                selectItem();
                            };
                            
                            list.appendChild(p);
                        });
                    }
                }

                function filterItems() {
                    const input = document.getElementById('searchInput').value.toLowerCase();
                    loadItems().then(files => {
                        const list = document.getElementById('itemList');
                        list.innerHTML = '';
                        selectedItem = null;

                        const filtered = files.filter(file => 
                            file.name.toLowerCase().includes(input)
                        );
                        
                        const noItems = document.getElementById('noItems');                    
                        if (filtered.length === 0) {
                            noItems.style.display = 'block';
                        } else {
                            noItems.style.display = 'none';
                            filtered.forEach(file => {
                                const p = document.createElement('p');
                                p.innerHTML = \`
                                    <span>\${file.name}</span>
                                    <span class="file-size">\${formatFileSize(file.size)}</span>
                                \`;
                                
                                p.onclick = () => {
                                    const prevSelected = list.querySelector('.selected');
                                    if (prevSelected) prevSelected.classList.remove('selected');
                                    p.classList.add('selected');
                                    selectedItem = file.name;
                                    selectItem();
                                };

                                list.appendChild(p);
                            });
                        }
                    });
                }

                function searchItems() {
                    filterItems();
                }

                function selectItem() {
                    if (!selectedItem) {
                        alert('Please select a file first');
                        return;
                    }
                    window.parent.postMessage({
                        type: 'select',
                        instanceId: instanceId,
                        value: selectedItem
                    }, '*');
                }

                function cancel() {
                    window.parent.postMessage({
                        type: 'cancel',
                        instanceId: instanceId,
                        error: 'Selection cancelled'
                    }, '*');
                }

                function closeDialog() {
                    window.parent.postMessage({
                        type: 'cancel',
                        instanceId: instanceId,
                        error: 'Dialog closed'
                    }, '*');
                }

                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeDialog();
                    } else if (e.key === 'Enter' && document.activeElement.id !== 'searchInput') {
                        selectItem();
                    }
                });

                // Initialize
                document.getElementById('searchInput').focus();
                loadItems();
            <\/script>
        </body>
        </html>
    `),n.close(),new Promise((o,s)=>{const i=async r=>{if(r.data.instanceId!==a)return;const c=()=>{window.removeEventListener("message",i),e.style.opacity="0",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300)};if(r.data.type==="select"){c();try{o({filename:r.data.value})}catch(l){s(l)}}else r.data.type==="cancel"&&(c(),s(new Error(r.data.error)))};window.addEventListener("message",i)})}const u="B";function d(e,t){return new Promise((a,n)=>{const o=indexedDB.open(e,1);o.onerror=s=>{n(s.target.error)},o.onsuccess=s=>{a(s.target.result)},o.onupgradeneeded=s=>{const i=s.target.result;i.objectStoreNames.contains(t)||i.createObjectStore(t,{keyPath:"id"})}})}const b=async()=>{const e=await f();return{mode:u,file:{...e,id:e.filename}}};async function g(e){if(!e||typeof e!="object")throw new Error("Invalid or missing path");const t=await d("database","files");return new Promise((a,n)=>{const i=t.transaction(["files"],"readonly").objectStore("files").get(e.id);i.onerror=r=>{n({code:404,error:`No data found with filename ${e.id}`})},i.onsuccess=r=>{const c=r.target.result;if(!c)n({code:404,error:`No data found with filename ${e.id}`});else{const l=p(c.data);a({content:l,path:{...e,fileName:e.id}})}}})}async function y(e,t){if(!e||typeof e!="object")throw new Error("Invalid or missing data object");if(!t||typeof t!="object")throw new Error("Invalid or missing path");const a=await d("database","files");return new Promise((n,o)=>{const i=a.transaction(["files"],"readwrite").objectStore("files"),r=JSON.stringify(e,null,2),c=i.put({id:t.fileName,data:r});c.onerror=l=>{o(l.target.error)},c.onsuccess=()=>{n({...t,id:t.fileName})}})}const h="Browser";export{b as pickFile,g as readJsonAttachment,h as type,y as writeObjectToJsonAttachment};
