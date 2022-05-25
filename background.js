// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    // 动态注入css
    if (request && request.insertCSS) {
        if (request.insertCSS === 'insert') {
            chrome.scripting.insertCSS({
                origin: 'USER',
                target: { tabId: sender.tab.id, allFrames: true },
                files: ["style/page.css"],
            });
        } else {
            chrome.scripting.removeCSS({
                origin: 'USER',
                target: { tabId: sender.tab.id, allFrames: true },
                files: ["style/page.css"],
            });
        }
    }
    sendResponse('--处理--', request);
});

function sendMessage(id, data, cbk) {
    chrome.tabs.sendMessage(id, data, function (response) {
        if (cbk) {
            cbk(response);
        }
    });
}