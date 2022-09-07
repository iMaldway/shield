/**
 * @todo 具体引用来源请查阅shield\popups\popup.html
 */
let tabId = ''
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // 获取页面地址
  tabId = tabs[0]?.id
  let currentURL = domainName(tabs[0]?.url) || '未获取到该页面地址'
  $('#currentURL').text(currentURL)
  // 创建屏蔽组件
  const shieldAppointTAG = new TAG('shieldAppointClsaaName')
  // 创建屏蔽关键字组件
  const shieldKeyTAG = new TAG('shieldKey')
  // 创建屏蔽ID组件
  const shieldIdTAG = new TAG('shieldId')
  // 是否存在过数据
  chrome.storage.local.get([currentURL], function (result) {
    if (result && result[currentURL]) {
      operation = result[currentURL]
      const implement = $('#implement')
      if (operation.implement) {
        implement.addClass('el-btn-danger')
        implement.removeClass('el-btn-success')
        implement.html('停止')
      } else {
        implement.addClass('el-btn-success')
        implement.removeClass('el-btn-danger')
        implement.html('执行')
      }
      const pure = $('#pure')
      if (operation.pure) {
        pure.html('已开启纯净模式')
        pure.addClass('el-btn-success')
        pure.removeClass('el-btn-primary')
      } else {
        pure.html('纯净模式')
        pure.addClass('el-btn-primary')
        pure.removeClass('el-btn-success')
      }
      sendMessage(tabId, { operation })
    } else {
      let obj = {}
      /**
       * 使用默认的配置
       */
      operation.webTitle = PUBLIC_TITLE
      operation.icon = PUBLIC_ICO
      obj[currentURL] = operation
      chrome.storage.local.set(obj, function () {
        console.log('设置对象 ', operation)
      })
    }
    // 屏蔽关键字，以及关键字的class类名
    $('#shieldKeyClsaaName').val(operation.shieldKeyClsaaName)
    shieldKeyTAG.init(operation.shieldKey)
    shieldIdTAG.init(operation.shieldId)
    shieldAppointTAG.init(operation.shieldAppointClsaaName)
    // 替换内容
    $('#formKey').val(operation.formKey)
    $('#toKey').val(operation.toKey)
    // 网站标题以及网站ico
    $('#webTitle').val(operation.webTitle)
    $('#icon').val(operation.icon)
  })

  // 绑定类型选择事件
  $('#shieldType').on('change', function (e) {
    const nowID = $('#shieldType').val()
    for (let i = 1; i <= 6; i++) {
      let id = 'form-item-' + i
      $('#' + id).hide()
    }
    $('#form-item-shortcut').hide()
    $('#form-item-' + nowID).show()
  })

  // 绑定保存事件
  $('#preservation').on('click', function (e) {
    operation.shieldKeyClsaaName = $('#shieldKeyClsaaName').val()
    operation.shieldKey = shieldKeyTAG.toString()
    operation.shieldId = shieldIdTAG.toString()
    operation.shieldAppointClsaaName = shieldAppointTAG.toString()
    // 替换内容
    operation.formKey = $('#formKey').val()
    operation.toKey = $('#toKey').val()
    // 网站标题及ico
    operation.webTitle = $('#webTitle').val()
    operation.icon = $('#icon').val()
    let obj = {}
    obj[currentURL] = operation
    chrome.storage.local.set(obj, function () {
      console.log('设置对象 ', operation)
      sendMessage(tabId, { operation })
    })
  })

  // 绑定执行事件
  $('#implement').on('click', function (ev) {
    // 向content-script.js发送请求信息
    const implement = $('#implement')
    operation.implement = !operation.implement
    if (operation.implement) {
      implement.html('停止')
      implement.addClass('el-btn-danger')
      implement.removeClass('el-btn-success')
    } else {
      implement.html('执行')
      implement.addClass('el-btn-success')
      implement.removeClass('el-btn-danger')
    }
    let obj = {}
    obj[currentURL] = operation
    chrome.storage.local.set(obj, function () {
      console.log('设置对象 ', operation)
      sendMessage(tabId, { operation })
    })
  })

  // 绑定纯净模式事件
  $('#pure').on('click', function (ev) {
    const pure = $('#pure')
    operation.pure = !operation.pure
    if (operation.pure) {
      pure.html('已开启纯净模式')
      pure.addClass('el-btn-success')
      pure.removeClass('el-btn-primary')
    } else {
      pure.html('纯净模式')
      pure.addClass('el-btn-primary')
      pure.removeClass('el-btn-success')
      location.reload(true)
    }
    let obj = {}
    obj[currentURL] = operation
    chrome.storage.local.set(obj, function () {
      console.log('设置对象 ', operation)
      sendMessage(tabId, { operation })
    })
  })
  // 绑定手动选择
  $('#manualSelection').on('click', function (ev) {
    sendMessage(tabId, { event: 'manual' })
  })
})
function sendMessage(id, data, cbk) {
  chrome.tabs.sendMessage(id, data, function (response) {
    if (cbk) {
      cbk(response)
    }
  })
}

function domainName(url) {
  let sign = '://'
  let pos = url.indexOf(sign)
  if (pos >= 0) {
    pos += sign.length
    url = url.slice(pos)
  }
  url = url.replace('//', '')
  let array = url.split('/')
  return array[0]
}
