console.log('----注入脚本----')
let tabId;
const TIME = 1000;
const CURRENT_URL = domainName(window.location.href)
// 配置对象
// let operation;
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
function pure(webTitle, icon) {
    if (pureInterval) {
        clearInterval(pureInterval)
    }
    pureInterval = setInterval(() => {
        $('title').html(webTitle || PUBLIC_TITLE)
        $("link[rel*='icon']").attr('href', icon || PUBLIC_ICO)
        $("link[rel*='icon']").attr('rel', 'shortcut icon')
        $("link[rel*='icon']").removeAttr('sizes').removeAttr('type').removeAttr('crossorigin')
        $("link[rel*='search']").remove()
    }, TIME);
    // 动态执行CSS文件
    sendMessage({ insertCSS: 'insert' })
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
            sendMessage({ insertCSS: 'remove' })
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
            sendMessage({ insertCSS: 'remove' })
            break;
    }
}
function sendMessage(data, cbk) {
    chrome.runtime.sendMessage(data, function (response) {
        console.log('收到来自后台的回复：' + response);
        if (cbk) {
            cbk(response)
        }
    });
}
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
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.operation) {
        //执行屏蔽函数
        console.log('----执行屏蔽函数----')
        operation = request.operation
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
            pure(operation.webTitle, operation.icon)
        } else {
            if (pureInterval) {
                location.reload(true)
            }
            cancelInterval('pure')
        }
        sendResponse('----执行屏蔽操作----'); // 回调回去
    }
    if (request && request.activeInfo) {
        console.log(request.activeInfo)
        tabId = request.activeInfo.tabId
        sendResponse('----执行页面激活操作----'); // 回调回去
    }

});
chrome.storage.local.get([CURRENT_URL], function (result) {
    console.log('----执行上次设置---- ');
    if (result && result[CURRENT_URL]) {
        operation = result[CURRENT_URL]
        console.log(operation);
        if (operation.implement) {
            shieldKey(operation.shieldKeyClsaaName, operation.shieldKey)
            shieldAppoint(operation.shieldAppointClsaaName)
        } else {
            cancelInterval('implement')
        }
        if (operation.pure) {
            pure(operation.webTitle, operation.icon)
        } else {
            cancelInterval('pure')
        }
    }
})
/**
 * @todo 快捷键监听
 */
$(document).keydown(function (event) {
    let obj = {};
    switch (event.keyCode) {
        case 27:
        case '27':
            // Esc 快捷关闭/开启纯净模式
            const pure_ = $("#pure");
            operation.pure = !operation.pure;
            if (operation.pure) {
                pure_.html("已开启纯净模式")
                pure_.addClass('el-btn-success')
                pure_.removeClass('el-btn-primary')
                pure(operation.webTitle, operation.icon)
            } else {
                pure_.html("纯净模式")
                pure_.addClass('el-btn-primary')
                pure_.removeClass('el-btn-success')
                cancelInterval('pure')
            }

            obj[CURRENT_URL] = operation;
            chrome.storage.local.set(obj, function () { });
            break;
        case 192:
        case '192':
            // ~ 快捷关闭/开启纯屏蔽功能
            const implement = $("#implement");
            operation.implement = !operation.implement;
            if (operation.implement) {
                implement.html("停止")
                implement.addClass('el-btn-danger')
                implement.removeClass('el-btn-success')
                shieldKey(operation.shieldKeyClsaaName, operation.shieldKey)
                shieldAppoint(operation.shieldAppointClsaaName)
            } else {
                implement.html("执行")
                implement.addClass('el-btn-success')
                implement.removeClass('el-btn-danger')
                if (shieldAppointInterval || shieldKeyInterval) {
                    location.reload(true)
                }
                cancelInterval('implement')
            }
            obj[CURRENT_URL] = operation;
            chrome.storage.local.set(obj, function () { });
            break;
        case 46:
        case '46':
            // delete 关闭当前页面
            window.close()
            break;
        default:
            console.log("Key: " + event.keyCode);
            break;
    }
});


