import axios from 'axios'

export function request(config) {
    //创建axios实例
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 3000
    })
    instance.interceptors.request.use(config => {
        console.log(config)
        return config
    }, err => {
        console.log(err)
    })
    instance.interceptors.response.use(res => {
        console.log(res)
        return res.data
    }, err => {
        console.log(err)
    })
    //发送真正的网络请求
    return instance(config)
}
