let PUBLIC_ICO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
let PUBLIC_TITLE = 'protected web content'
/**
 * @param shieldKey{String} 屏蔽关键字,多个按照/分隔
 * @param shieldKeyClsaaName{String} 包含关键字的信息流主题样式类
 * @param shieldAppointClsaaName{String} 无差别的屏蔽样式类内容，多个类按照 / 分隔
 * @param webTitle{String} 网站的标题
 * @param icon{String} 网站的图标,base64格式，10kb以内;不填默认;
 * @param implement{Boolean} 是否开启执行;false--没有开启，true--开启
 * @param pure{Boolean} 是否开启纯净模式;false--没有开启，true--开启
 * @param formKey{String} 目标关键字
 * @param toKey{String} 替换为的关键字
 */
let operation = {
  shieldKeyClsaaName: '',
  shieldKey: '',
  shieldAppointClsaaName: '',
  shieldId: '',
  webTitle: PUBLIC_TITLE,
  icon: PUBLIC_ICO,
  formKey: '',
  toKey: '',
  implement: false,
  pure: false
}
