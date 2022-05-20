console.log('----注入脚本----')
const TIME = 1000;
const CURRENT_URL = window.location.href
// 关键字屏蔽定时器
let shieldKeyInterval;
// 屏蔽指定组件
let shieldAppointInterval;
// 关键字屏蔽函数
function shieldKey(className,keys){
    if(!className || className === ''){
        console.log('----没有输入className----')
        return
    }
    if(!keys || keys === ''){
        console.log('----没有输入关键字----')
        return
    }
    let arr = [];
    if(typeof keys === 'string'){
        arr = keys.split('/')
    }
    if(shieldKeyInterval){
        clearInterval(shieldKeyInterval)
    }
    shieldKeyInterval = setInterval(()=>{
        let y = document.getElementsByClassName(className)
        for(let i = 0;i < y.length;i++){
            let item = y[i]
            const innerText = item.innerText;
            for(let m = 0;m<arr.length;m++){
                let key = arr[m]
                if(innerText.indexOf(key) !== -1){
                    item.style.display = 'none'
                    break;
                }
            }
        }
    },TIME)
}

// 屏蔽指定组件
function shieldAppoint(className){
    if(!className || className === ''){
        console.log('----没有输入className----')
        return
    }
    if(shieldAppointInterval){
        clearInterval(shieldAppointInterval)
    }
    shieldAppointInterval = setInterval(()=>{
        let appointArr = document.getElementsByClassName(className);
        for(let i = 0;i < appointArr.length;i++){
            let item = appointArr[i]
            item.style.display = 'none'
        }
    },TIME)
}

function cancelInterval(){
    console.log('----取消执行屏蔽----')
    if(shieldAppointInterval){
        clearInterval(shieldAppointInterval)
    }
    if(shieldKeyInterval){
        clearInterval(shieldKeyInterval)
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if(request && request.operation){
        //执行屏蔽函数
        console.log('----执行屏蔽函数----')
        const operation = request.operation
        if(operation.implement){
            shieldKey(operation.shieldKeyClsaaName,operation.shieldKey)
            shieldAppoint(operation.shieldAppointClsaaName)
        }else{
            cancelInterval()
        }
    }
	sendResponse('----执行屏蔽操作----'); // 回调回去

});
chrome.storage.sync.get([CURRENT_URL],function(result) {
    console.log('----执行上次设置---- ');
    if(result && result[CURRENT_URL] ){
        const operation = result[CURRENT_URL]
        if(operation.implement){
            shieldKey(operation.shieldKeyClsaaName,operation.shieldKey)
            shieldAppoint(operation.shieldAppointClsaaName)
        }else{
            cancelInterval()
        }
    }
})


