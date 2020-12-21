import { USER_TOKEN } from "../common";
import Cookies from 'js-cookie';

export default {
    get: async (url) => {
        return await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN)
            }
        })
    },
    post: async (url, body) => {
        return await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN)
            },
            body: JSON.stringify(body),
        })
    },
    put: async (url, body) => {
        return await fetch(url, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN)
            },
            body: JSON.stringify(body),
        })
    },
    patch: async (url, body) => {
        return await fetch(url, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get(USER_TOKEN)
            },
            body: JSON.stringify(body),
        })
    },
    post_form_data: async (url, body) => {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data'
            },
            body: JSON.stringify(body),
        })
    },
}
