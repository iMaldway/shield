console.log('----注入脚本----')
const TIME = 1000;
const CURRENT_URL = domainName(window.location.href)
// 关键字屏蔽定时器
let shieldKeyInterval;
// 屏蔽指定组件
let shieldAppointInterval;
// 纯净模式
let pureInterval;
/**
 * @todo 关键字屏蔽函数
*/
function shieldKey(className, keys) {
    if (!className || className === '') {
        console.log('----没有输入className----')
        return
    }
    if (!keys || keys === '') {
        console.log('----没有输入关键字----')
        return
    }
    let arr = [];
    if (typeof keys === 'string') {
        arr = keys.split('/')
    }
    if (shieldKeyInterval) {
        clearInterval(shieldKeyInterval)
    }
    shieldKeyInterval = setInterval(() => {
        let y = document.getElementsByClassName(className)
        for (let i = 0; i < y.length; i++) {
            let item = y[i]
            const innerText = item.innerText;
            for (let m = 0; m < arr.length; m++) {
                let key = arr[m]
                if (innerText.indexOf(key) !== -1) {
                    item.style.display = 'none'
                    break;
                }
            }
        }
    }, TIME)
}

/**
 * @todo 屏蔽指定组件,支持多个组件，className按照/分隔
 * */
function shieldAppoint(classNames) {
    if (!classNames || classNames === '') {
        console.log('----没有输入className----')
        return
    }
    if (shieldAppointInterval) {
        clearInterval(shieldAppointInterval)
    }
    let arr = [];
    if (typeof classNames === 'string') {
        arr = classNames.split('/')
    }
    shieldAppointInterval = setInterval(() => {
        for (let c in arr) {
            const name = arr[c]
            let appointArr = document.getElementsByClassName(name);
            for (let i = 0; i < appointArr.length; i++) {
                let item = appointArr[i]
                item.style.display = 'none'
            }
        }
    }, TIME)
}
/**
 * @todo 开启纯净模式
 */
function pure() {
    if (pureInterval) {
        clearInterval(pureInterval)
    }
    pureInterval = setInterval(() => {
        // 屏蔽所有的背景，并添加统一背景色
        $('html').css('background-image', 'none')
        $('html').css('background-color', '#fffbe8')
        $('body').css('background-image', 'none')
        $('body').css('background-color', '#fffbe8')
        $('body *').css('background-image', 'none')
        $('body *').css('background-color', '#fffbe8')
        // $('body *').css('box-shadow', '0 1px 3px rgb(18 18 18 / 10%)')
        // $('body *').css('border', '1px solid #fffff5')
        $('body *').css('color', '#4d4d4d')
        //屏蔽所有的img元素
        $('img').css('display', 'none')
        // $('img').css('border', '1px solid #666')
        //屏蔽所有的video元素
        $('video').css('display', 'none')
        //屏蔽所有的video元素
        $('svg').css('display', 'none')
        $('title').html(PUBLIC_TITLE)
        $("link[rel*='icon']").attr('href', PUBLIC_ICO)
        $("link[rel*='icon']").attr('rel', 'shortcut icon')
        $("link[rel*='icon']").removeAttr('sizes').removeAttr('type').removeAttr('crossorigin')
        $("link[rel*='search']").remove()
    }, TIME);
}
/**
 * @todo 取消执行所有屏蔽函数
 */
function cancelInterval(type) {
    switch (type) {
        case 'implement':
            if (shieldAppointInterval) {
                clearInterval(shieldAppointInterval)
            }
            if (shieldKeyInterval) {
                clearInterval(shieldKeyInterval)
            }
            break;
        case 'pure':
            if (pureInterval) {
                clearInterval(pureInterval)
            }
            break;
        default:
            // 默认全部清除
            if (shieldAppointInterval) {
                clearInterval(shieldAppointInterval)
            }
            if (shieldKeyInterval) {
                clearInterval(shieldKeyInterval)
            }
            if (pureInterval) {
                clearInterval(pureInterval)
            }
            break;
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.operation) {
        //执行屏蔽函数
        console.log('----执行屏蔽函数----')
        const operation = request.operation
        if (operation.implement) {
            shieldKey(operation.shieldKeyClsaaName, operation.shieldKey)
            shieldAppoint(operation.shieldAppointClsaaName)
        } else {
            if (shieldAppointInterval || shieldKeyInterval) {
                location.reload(true)
            }
            cancelInterval('implement')
        }
        if (operation.pure) {
            pure()
        } else {
            if (pureInterval) {
                location.reload(true)
            }
            cancelInterval('pure')
        }
    }
    sendResponse('----执行屏蔽操作----'); // 回调回去

});
chrome.storage.sync.get([CURRENT_URL], function (result) {
    console.log('----执行上次设置---- ');
    if (result && result[CURRENT_URL]) {
        const operation = result[CURRENT_URL]
        if (operation.implement) {
            shieldKey(operation.shieldKeyClsaaName, operation.shieldKey)
            shieldAppoint(operation.shieldAppointClsaaName)
        } else {
            cancelInterval('implement')
        }
        if (operation.pure) {
            pure()
        } else {
            cancelInterval('pure')
        }
    }
})
/**
 * @todo 获取域名
 */
function domainName(url) {
    let sign = "://";
    let pos = url.indexOf(sign);
    if (pos >= 0) {
        pos += sign.length;
        url = url.slice(pos);
    }
    url = url.replace('//', '')
    let array = url.split("/");
    return array[0];
}


