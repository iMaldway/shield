function TAG(targetId, character, separator) {
  /**
   * 初始化
   */
  this.id = targetId || ''
  this.separator = separator || '/'
  this.character = character || ''
  this.list = []

  this.add = function (value) {
    const result = this.list.every(function (item) {
      return item !== value
    })
    // 不允许空字符串
    if (result && result !== '') {
      this.list.push(value)
    } else {
      console.warn('内容已存在')
    }
    this.render()
    return result
  }
  this.remove = function (value) {
    for (let i = 0; i < this.list.length; i++) {
      let item = this.list[i]
      item = item.trim()
      if (value === item) {
        this.list.splice(i, 1)
        break
      }
    }
    this.render()
  }
  this.monitor = function () {
    // 绑定事件
    const $this = this
    /**
     * 绑定删除事件
     */
    const tagIList = document.getElementsByName('tag-' + this.id)
    for (let i = 0; i < tagIList.length; i++) {
      let item = tagIList[i]
      item.onclick = function (e) {
        let innerText = ''
        // 兼容写法
        if (e.path && e.path.length > 1) {
          innerText = e.path[1].innerText || ''
        } else if (e.target && e.target.parentNode) {
          innerText = e.target.parentNode.innerText === '×' ? '' : e.target.parentNode.innerText
        }
        innerText = innerText.replace('\n×', '')
        $this.remove(innerText)
      }
    }
    // 绑定添加事件
    const tagAdd = document.getElementById('tag-add-' + this.id)
    const tagInput = document.getElementById('tag-input-' + this.id)
    tagAdd.onclick = function (e) {
      $this.add(tagInput.value)
    }
  }
  this.analysis = function (character, separator) {
    // 解析字符串
    character = character ? character : this.character
    separator = separator ? separator : '/'
    this.list = []
    // 处理字符串，将空格、空字符串去除
    const valueList = character.split(separator)
    for (let i = 0; i < valueList.length; i++) {
      let value = valueList[i]
      if (value && value !== '') {
        value = value.trim()
        this.list.push(value)
      }
    }
  }
  this.toString = function (separator) {
    separator = separator ? separator : this.separator
    return this.list.join(separator)
  }
  this.init = function (character) {
    if (character) {
      this.character = character
    }
    this.analysis()
    this.render()
  }
  this.render = function (id) {
    if (id) {
      this.id = id
    }
    let html = ''
    for (let i = 0; i < this.list.length; i++) {
      const item = this.list[i]
      let fragment = '<label class="tag">'
      fragment += item
      fragment += '<i class="tag-i" name="tag-' + this.id + '" id=' + item + '>&times;</i>'
      fragment += '</label>'
      html += fragment
    }
    html += '<div class="form-input tag-input"><input id="tag-input-' + this.id + '" maxlength="100"></input></div>'
    html += '<label class="tag-add" id="tag-add-' + this.id + '">&#43;</label>'
    const target = document.getElementById(this.id)
    target.innerHTML = html
    this.monitor()
  }
}
