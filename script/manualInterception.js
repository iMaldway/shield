/**
 * 手动拦截脚本
 */
const INTERCEPT = `
<div id="_s-dialog" data-shield="true" style="display: none;" class="_s-dialog">
<header id="_s-dialogHeader" data-shield="true" class="_s-dialog_header">
    拦截内容
</header>
<section id="_s-dialogBody" data-shield="true" class="_s-dialog_body">
    <span id="_s-title" data-shield="true">点击需要拦截的内容</span>
    <form id="_s-form" class="_s-form" data-shield="true" style="display: none;">
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true">标签</label>
            <div disabled class="_s-form-input" data-shield="true">
                <input id="_s-div"  disabled data-shield="true" class="_s-input" />
            </div>
        </div>
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true">ID</label>
            <div disabled class="_s-form-input" data-shield="true">
                <input id="_s-id"  disabled data-shield="true" class="_s-input" />
            </div>
        </div>
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true">样式类</label>
            <div  class="_s-form-textarea" data-shield="true">
                <textarea  data-shield="true" id="_s-className" style="height: 100px;" class="_s-textarea" maxlength="200"></textarea>
            </div>
        </div>
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true">元素内容</label>
            <div  class="_s-form-textarea" data-shield="true">
                <textarea disabled data-shield="true" id="_s-key" style="height: 100px;"  class="_s-textarea" maxlength="200"></textarea>
            </div>
        </div>
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true">调整选取</label>
            <span id="_s-superior" data-shield="true" class="_s-button _s-btn-primary">上一级</span>
            <span id="_s-subordinate" data-shield="true" class="_s-button _s-btn-success">下一级</span>
        </div>
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true"></label>
            <div class="_s-form-info" data-shield="true">
                ID存在值时候优先取ID，样式类只能存在一种。
                当只有一个ID和只有一个样式类时，可同时生效。
            </div>
        </div>
    </form>
</section>
<footer id="_s-dialogFooter" data-shield="true" class="_s-dialog_footer">
    <span id="_s-confirm" data-shield="true" class="_s-button _s-btn-primary">确定</span>
    <span id="_s-cancel" data-shield="true" class="_s-button _s-btn-danger">取消</span>
</footer>
</div>
`
const $dialog = $(INTERCEPT)
$('html').append($dialog)
// 可以拖拽的元素
const header = $('#_s-dialogHeader')
const dialog = $('#_s-dialog')
const body = $('body')
const html = $('html')
let timeout
let isTimeout = true
// 当前选中
let lastHover
// 上一步堆栈
let beforeHover = []
// 是否激活拖拽状态
let dragging
// 鼠标按下时相对于选中元素的位移
let tLeft, tTop
// 是否已选择元素
let seleteEvent = false
// 重置函数
const reset = () => {
  if (lastHover) {
    lastHover.removeClass('_s-hover ')
  }
  $('#_s-dialog').css('display', 'none')
  $('#_s-form').css('display', 'none')
  $('#_s-title').css('display', 'block')
  $('#_s-className').val('')
  $('#_s-id').val('')
  $('#_s-key').val('')
  $('#_s-div').val('')
  $(document).off('mouseover')
  $(document).off('mousemove')
  $('a,button,input,img').off('click')
  clearTimeout(timeout)
  isTimeout = false
  dragging = false
  seleteEvent = false
  timeout = null
  lastHover = null
  beforeHover = []
}
// 鼠标指针移出某个元素到另一个元素上时发生
const mouseoverEvent = e => {
  // 关闭拖拽状态
  if (e.target !== body[0] && e.target !== html[0]) {
    const target = $(e.target)
    const isShield = target.data('shield')
    if (!isShield && !seleteEvent) {
      if (lastHover) {
        lastHover.removeClass('_s-hover ')
        lastHover = null
      } else {
        lastHover = $(e.target)
        $(e.target).addClass('_s-hover ')
      }
    }
  } else {
    if (lastHover) {
      lastHover.removeClass('_s-hover ')
    }
  }
  isTimeout = true
}
const init = () => {
  // 鼠标指针移出某个元素到另一个元素上时发生
  $(document).on('mouseover', mouseoverEvent)
  // 初始化弹窗位置至可见位置
  $('#_s-dialog').css({
    top: window.innerHeight * 0.2 + window.scrollY + 'px',
    left: '20%',
    display: 'block'
  })
  // 取消默认事件，阻止事件冒泡
  $('a,button,input,img').on('click', e => {
    const target = $(e.target)
    const isShield = target.data('shield')
    if (!isShield) {
      e.preventDefault()
      return false
    }
  })
  // 监听鼠标移动事件
  $(document).on('mousemove', e => {
    // 拖拽状态
    if (dragging) {
      let moveX = e.clientX - tLeft
      let moveY = e.clientY - tTop
      let dialog = $('#_s-dialog')
      dialog.css({
        top: moveY + 'px',
        left: moveX + 'px'
      })
    } else {
      if (!isTimeout) {
        return
      }
      if (timeout !== null) {
        clearTimeout(timeout)
        isTimeout = false
        setTimeout(function () {
          timeout = null
          isTimeout = true
        }, 500)
      } else {
        timeout = setTimeout(mouseoverEvent(e), 1000)
      }
    }
  })
}
// 监听鼠按下事件
$(document).on('mousedown', e => {
  if (e.target == header[0]) {
    // 激活拖拽状态
    dragging = true
    // 鼠标按下时和选中元素的坐标偏移:x坐标
    tLeft = e.clientX - dialog.offset().left
    // 鼠标按下时和选中元素的坐标偏移:y坐标
    tTop = e.clientY - dialog.offset().top
  } else if (lastHover && e.target == lastHover[0]) {
    const isShield = lastHover.data('shield')
    if (!isShield) {
      $('#_s-form').css('display', 'block')
      $('#_s-title').css('display', 'none')
      let className = lastHover.attr('class')
      className = className.replace('_s-hover', '')
      const text = lastHover.text()
      $('#_s-className').val(className)
      $('#_s-id').val(lastHover.attr('id'))
      $('#_s-key').val(text)
      $('#_s-div').val(e.target.nodeName)
      // 已经选择元素
      seleteEvent = true
    } else {
      $('#_s-form').css('display', 'none')
      $('#_s-title').css('display', 'block')
    }
  }
})
// 监听鼠标放开事件
$(document).on('mouseup', e => {
  // 关闭拖拽状态
  dragging = false
})

// 提交
$('#_s-confirm').on('click', e => {
  const is = {
    msg: '',
    result: true
  }
  const data = {
    label: $('#_s-div').val(),
    id: $('#_s-id').val(),
    className: $('#_s-className').val(),
    text: $('#_s-key').val()
  }
  /**
   * id的优先级最高
   */
  if (data.id && data.id !== '') {
    operation.shieldId = operation.shieldId + '/' + data.id
  } else if (data.className && data.className !== '') {
    let list = data.className.split(' ')
    if (list.length <= 1) {
      operation.shieldAppointClsaaName = operation.shieldAppointClsaaName + '/' + data.className
    } else {
      is.result = false
      is.msg = '请精简样式类，只能存在一个！'
    }
  }
  if (is.result) {
    let obj = {}
    obj[CURRENT_URL] = operation
    chrome.storage.local.set(obj, function () {
      chrome.storage.local.get([CURRENT_URL], function (result) {
        getData(result)
      })
    })
    reset()
  } else {
    alert(is.msg)
  }
})
// 取消
$('#_s-cancel').on('click', e => {
  reset()
})
// 上一级
$('#_s-superior').on('click', e => {
  if (seleteEvent && lastHover) {
    // 移除当前元素
    lastHover.removeClass('_s-hover ')
    // 替换
    beforeHover.push(lastHover)
    lastHover = $(lastHover[0].parentNode)
    // 添加
    lastHover.addClass('_s-hover ')
    let className = lastHover.attr('class')
    className = className.replace('_s-hover', '')
    const text = lastHover.text()
    $('#_s-className').val(className)
    $('#_s-id').val(lastHover.attr('id'))
    $('#_s-key').val(text)
    $('#_s-div').val(lastHover[0].nodeName)
  }
})
// 下一级
$('#_s-subordinate').on('click', e => {
  if (seleteEvent && beforeHover.length > 0) {
    // 移除当前元素
    lastHover.removeClass('_s-hover ')
    lastHover = beforeHover.pop()
    // 添加
    lastHover.addClass('_s-hover ')
    let className = lastHover.attr('class')
    className = className.replace('_s-hover', '')
    const text = lastHover.text()
    $('#_s-className').val(className)
    $('#_s-id').val(lastHover.attr('id'))
    $('#_s-key').val(text)
    $('#_s-div').val(lastHover[0].nodeName)
  }
})
