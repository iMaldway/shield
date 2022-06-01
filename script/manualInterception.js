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
            <label class="_s-form-label" data-shield="true">样式类</label>
            <div  class="_s-form-textarea" data-shield="true">
                <textarea  data-shield="1" id="_s-className" style="height: 140px;" class="_s-textarea" maxlength="200"></textarea>
            </div>
        </div>
        <div class="_s-form-item" data-shield="true">
            <label class="_s-form-label" data-shield="true">元素内容</label>
            <div  class="_s-form-textarea" data-shield="true">
                <textarea disabled data-shield="true" id="_s-key" style="height: 140px;"  class="_s-textarea" maxlength="200"></textarea>
            </div>
        </div>
    </form>
</section>
<footer id="_s-dialogFooter" data-shield="true" class="_s-dialog_footer">
    <span id="_s-confirm" data-shield="true" class="_s-button _s-btn-primary">确定</span>
    <span id="_s-cancel" data-shield="true" class="_s-button _s-btn-danger">取消</span>
</footer>
</div>
`;
const $dialog = $(INTERCEPT);
$('html').append($dialog);
// 可以拖拽的元素
const header = $('#_s-dialogHeader')
const dialog = $('#_s-dialog')
const body = $('body')
const html = $('html')
// 重置函数
const reset = () => {
    console.log('关闭选择界面')
    if (lastHover) {
        lastHover.removeClass('_s-hover ')
    }
    $('#_s-dialog').css('display', 'none')
    $('#_s-form').css('display', 'none')
    $('#_s-title').css('display', 'block')
    $('#_s-className').val('')
    $('#_s-key').val('')
    $('#_s-div').val('')
    $(document).off('mouseover')
    $(document).off('mousemove')
    clearTimeout(timeout)
    isTimeout = false;
    dragging = false;
    timeout = null;
    lastHover = null;

}
// 鼠标指针移出某个元素到另一个元素上时发生
const mouseoverEvent = (e) => {
    // 关闭拖拽状态
    if (e.target !== body[0] && e.target !== html[0]) {
        const target = $(e.target);
        const isShield = target.data('shield')
        if (!isShield) {
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
    isTimeout = true;
}
const init = () => {
    // 鼠标指针移出某个元素到另一个元素上时发生
    $(document).on('mouseover', mouseoverEvent)
    $('#_s-dialog').css('display', 'block')
    // 监听鼠标移动事件
    $(document).on('mousemove', (e) => {
        // 拖拽状态
        if (dragging) {
            let moveX = e.clientX - tLeft;
            let moveY = e.clientY - tTop;
            let dialog = $('#_s-dialog')
            dialog.css({
                'top': moveY + 'px',
                'left': moveX + 'px'
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
                timeout = setTimeout(mouseoverEvent(e), 1000);
            }

        }
    })
}
let timeout;
let isTimeout = true;
let lastHover;
// 是否激活拖拽状态
let dragging;
// 鼠标按下时相对于选中元素的位移
let tLeft, tTop;
// 监听鼠按下事件
$(document).on('mousedown', (e) => {
    if (e.target == header[0]) {
        // 激活拖拽状态
        dragging = true;
        // 鼠标按下时和选中元素的坐标偏移:x坐标
        tLeft = e.clientX - dialog.offset().left;
        // 鼠标按下时和选中元素的坐标偏移:y坐标
        tTop = e.clientY - dialog.offset().top;
    } else if (lastHover && e.target == lastHover[0]) {
        const isShield = lastHover.data('shield')
        if (!isShield) {
            $('#_s-form').css('display', 'block')
            $('#_s-title').css('display', 'none')
            let className = lastHover.attr('class');
            className = className.replace('_s-hover', '')
            const text = lastHover.text();
            $('#_s-className').val(className)
            $('#_s-key').val(text)
            $('#_s-div').val(e.target.nodeName)
        } else {
            $('#_s-form').css('display', 'none')
            $('#_s-title').css('display', 'block')
        }
    }
})
// 监听鼠标放开事件
$(document).on('mouseup', (e) => {
    // 关闭拖拽状态
    dragging = false;
})

// 提交
$('#_s-confirm').on('click', (e) => {
    $('#_s-className').val()
    $('#_s-key').val()
    $('#_s-div').val()
    const data = {
        'label': $('#_s-div').val(),
        'className': $('#_s-className').val(),
        'text': $('#_s-key').val()
    }
    operation.shieldAppointClsaaName = operation.shieldAppointClsaaName + '/' + data.className;
    let obj = {}
    obj[CURRENT_URL] = operation;
    chrome.storage.local.set(obj, function () {
        chrome.storage.local.get([CURRENT_URL], function (result) {
            getData(result)
        })
    });
    reset()
})
// 取消
$('#_s-cancel').on('click', (e) => { reset() })