let operation = {
    'shieldKeyClsaaName':'',
    'shieldKey':'',
    'shieldAppointClsaaName':'',
    'implement':false
}
let tabId = ''
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    // 获取页面地址
    tabId = tabs[0]?.id
    let currentURL = tabs[0]?.url || '未获取到该页面地址';
    let h3 = document.getElementById('currentURL')
    h3.innerText = currentURL
    // 是否存在过数据
    chrome.storage.sync.get([currentURL],function(result) {
        if(result && result[currentURL] ){
            operation = result[currentURL]
            const implement = document.getElementById('implement')
            if(operation.implement){
                implement.innerHTML = '停止'
                sendMessage(tabId,operation)
            }else{
                implement.innerHTML = '执行'
            }
        }else{
            let obj = {}
            obj[currentURL] = operation
            chrome.storage.sync.set(obj, function() {
                console.log('设置对象 ' , operation);
            })
        }
        // 屏蔽关键字，以及关键字的class类名
        const shieldKeyClsaaName = document.getElementById('shieldKeyClsaaName')
        const shieldKey = document.getElementById('shieldKey')
        const shieldAppointClsaaName = document.getElementById('shieldAppointClsaaName')
        shieldKeyClsaaName.value  = operation.shieldKeyClsaaName
        shieldKey.value  = operation.shieldKey
        shieldAppointClsaaName.value  = operation.shieldAppointClsaaName
    });
    
    // 绑定保存事件
    document.getElementById('preservation').addEventListener('click',(ev)=>{
        console.log(ev)
        const shieldKeyClsaaName = document.getElementById('shieldKeyClsaaName')
        const shieldKey = document.getElementById('shieldKey')
        const shieldAppointClsaaName = document.getElementById('shieldAppointClsaaName')
        operation.shieldKeyClsaaName = shieldKeyClsaaName.value 
        operation.shieldKey =shieldKey.value
        operation.shieldAppointClsaaName =shieldAppointClsaaName.value
        let obj = {}
        obj[currentURL] = operation
        chrome.storage.sync.set(obj, function() {
            console.log('设置对象 ' , operation);
        })
    })

    // 绑定执行事件
    document.getElementById('implement').addEventListener('click',(ev)=>{
        // 向content-script.js发送请求信息
        const implement = document.getElementById('implement')
        operation.implement = !operation.implement;
        if(operation.implement){
           implement.innerHTML = '停止'
        }else{
            implement.innerHTML = '执行'
        }
        let obj = {}
        obj[currentURL] = operation
        chrome.storage.sync.set(obj, function() {
            console.log('设置对象 ' , operation);
            sendMessage(tabId,operation)
        })
        
    })
    
});
function sendMessage(id,data,cbk){
    chrome.tabs.sendMessage(id, {'operation':data}, function(response) {
        console.log(response);
        if(cbk){
            cbk(response)
        }
    });
}

