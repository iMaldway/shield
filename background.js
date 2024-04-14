// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('收到来自content-script的消息：')
  handle(request, sender, sendResponse)
})
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  console.log('收到来自未知页的消息：')
  handle(request, sender, sendResponse)
})
function handle(request, sender, sendResponse) {
  // 动态注入手动选择框css
  if (request && request.dialogCSS === 'insert') {
    chrome.scripting.insertCSS({
      origin: 'AUTHOR',
      target: { tabId: sender.tab.id, allFrames: true },
      files: ['style/interception.css']
    })
  } else if (request && request.dialogCSS === 'remove') {
    chrome.scripting.removeCSS({
      origin: 'AUTHOR',
      target: { tabId: sender.tab.id, allFrames: true },
      files: ['style/interception.css']
    })
  }
  // 动态注入纯净模式css
  if (request && request.insertCSS) {
    if (request.insertCSS === 'insert') {
      chrome.scripting.insertCSS({
        origin: 'AUTHOR',
        target: { tabId: sender.tab.id, allFrames: true },
        files: ['style/page.css']
      })
    } else if (request && request.insertCSS === 'remove') {
      chrome.scripting.removeCSS({
        origin: 'AUTHOR',
        target: { tabId: sender.tab.id, allFrames: true },
        files: ['style/page.css']
      })
    }
    sendResponse({ text: '--处理--', tabId: sender.tab.id }, request)
  }
  if (request && request.shieldNumber && request.shieldNumber !== '0') {
    chrome.action.setBadgeText({ text: request.shieldNumber + '' || '99', tabId: sender.tab.id })
    sendResponse({ text: '--处理--', tabId: sender.tab.id }, request)
  }
}
function sendMessage(id, data, cbk) {
  chrome.tabs.sendMessage(id, data, function (response) {
    if (cbk) {
      cbk(response)
    }
  })
}
