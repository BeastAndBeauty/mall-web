import Cookies from "js-cookie"
//是否显示登录页面的对话框
const SupportKey = 'supportKey'

export function getSupport() {
    return Cookies.get(SupportKey)
}

export function setSupport(isSupport) {
    return Cookies.set(SupportKey, isSupport, { expires: 3 })
}
