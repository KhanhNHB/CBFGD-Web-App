export default {
    get: async (url) => {
        return await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    },
    post: async (url, body) => {
        return await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
    }
}