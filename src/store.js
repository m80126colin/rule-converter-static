/// from 'https://my.oschina.net/zhangxuman/blog/1522732'
const STORAGE_KEY='rule-converter'

export default {
    fetch() {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'[]')
    },
    save(items) {
        window.localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
    }
}