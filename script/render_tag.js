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
    if (result) {
      this.list.push(value)
    } else {
      console.error('内容已存在')
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
        let innerText = e.path[1].innerText
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
    this.list = character.split(separator)
    this.list = this.list.map(function (value) {
      return value.trim()
    })
    let last = this.list[this.list.length - 1]
    if (last === '') {
      if (this.list.length == 1) {
        this.list = []
      } else {
        this.list.pop()
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
      fragment += '<i class="tag-i" name="tag-' + this.id + '" id=' + item + '>×</i>'
      fragment += '</label>'
      html += fragment
    }
    html += '<div class="form-input tag-input"><input id="tag-input-' + this.id + '" maxlength="100"></input></div>'
    html += '<label class="tag-add" id="tag-add-' + this.id + '">+</label>'
    const target = document.getElementById(this.id)
    target.innerHTML = html
    this.monitor()
  }
}
