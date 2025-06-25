async function r(){const e=document.createElement("div");e.id="overlay";const t=document.createElement("iframe");t.id="pickerFrame",e.appendChild(t),document.body.appendChild(e),e.style.cssText=`
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
    `,e.offsetWidth,t.offsetWidth,e.style.opacity="1",t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1)";const i=Date.now().toString(36)+Math.random().toString(36).substr(2);e.addEventListener("click",o=>{o.target===e&&t.contentWindow.postMessage({type:"cancel",instanceId:i,error:"Clicked outside"},"*")});const n=t.contentDocument||t.contentWindow.document;return n.open(),n.write(`
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
                    <p class="no-items" id="noItems">No .treegridio files found</p> <!-- Moved outside of itemList -->
                </div>
            </div>
            <script>
                const instanceId = "${i}";
                let selectedItem = null;

                function getAllTreegridioFiles() {
                    const files = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.endsWith('.treegridio')||key.endsWith('.json')) {
                            const value = localStorage.getItem(key);
                            files.push({
                                name: key,
                                size: value ? new Blob([value]).size : 0
                            });
                        }
                    }
                    return files;
                }

                function formatFileSize(bytes) {
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                }

                function loadItems() {
                    const files = getAllTreegridioFiles();
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
                    const files = getAllTreegridioFiles();
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
                }

                function searchItems() {
                    filterItems();
                }

                function sortItems() {
                    const files = getAllTreegridioFiles().sort((a, b) => 
                        a.name.localeCompare(b.name)
                    );
                    const list = document.getElementById('itemList');
                    list.innerHTML = '';
                    selectedItem = null;
                    
                    const noItems = document.getElementById('noItems');                    
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
                            
                            p.onclick = () => {
                                const prevSelected = list.querySelector('.selected');
                                if (prevSelected) prevSelected.classList.remove('selected');
                                p.classList.add('selected');
                                selectedItem = file.name;
                            };
                            
                            p.ondblclick = () => {
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
    `),n.close(),new Promise((o,a)=>{const l=s=>{if(s.data.instanceId!==i)return;const c=()=>{window.removeEventListener("message",l),e.style.opacity="0",setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},300)};s.data.type==="select"?(c(),o({filename:s.data.value,content:localStorage.getItem(s.data.value)})):s.data.type==="cancel"&&(c(),a(new Error(s.data.error)))};window.addEventListener("message",l)})}export{r as p};
