import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
    baseURL: '/api',
    timeout: 10 * 1000,
    withCredentials: true
})

if (process.env.NODE_ENV == 'development') {
    document.cookie = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTc1MzkzMDIsInVpZCI6MX0.x-6eXqN424sqGYByg508NP390drtw3WdlT7s1sTPOXo'
}


export function get(url, params) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            params,
            method: 'GET',
        }).then(res => {
            resolve(res.data)
        }).catch(reject)
    })
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            data: qs.stringify(params, {arrayFormat: 'brackets'}),
            method: 'POST',
        }).then(res => {
            resolve(res.data)
        }).catch(reject)
    })
}