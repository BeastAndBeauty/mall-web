import axios from 'axios'
//消息提示，弹框
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

//创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, //API的base_url
    timeout: 15000 //请求超时时间
})

//request拦截器--可以拦截每次或指定HTTP请求，并可修改配置项
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['Authorization'] = getToken() //让每个请求携带自定义token
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

//respone拦截器--可以在每次HTTP请求后拦截每次或指定HTTP请求，并可修改返回结果项
service.interceptors.response.use(
    response => {
        //code为非200是抛错
        const res = response.data
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            })

            //401:未登录
            if (res.code === 401 || res.code === 403) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()//为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error)//for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    }
)

export default service