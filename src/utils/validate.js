export function isvalidUsername(str) {
    const valid_map = ['admin', 'test']
    //valid_map.indexOf(str.trim()) --返回数组中某个指定的元素位置，如果在数组中没找到指定元素则返回 -1
    return valid_map.indexOf(str.trim()) >= 0
}