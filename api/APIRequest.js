const axios = require("axios")

class APIRequest {
    constructor(client, route, endPoint, options) {
        this.client = client
        this.route = route
        this.endPoint = endPoint
        this.path = `${route}/${endPoint}`
        this.options = options
    }

    buildURL = () => {
        const root = this.options.versioned ? 
            `${this.options.http.api}/v${this.options.http.version}` : `${this.options.http.api}`
        return `${root}/${this.route}/${this.endPoint}`
    }

    async make() {
        const url = this.buildURL()
        const body = this.options.data
        const headers = {
            "Content-Type": "application/json"
        }
        if(this.options.auth) headers.Authorization = this.client.getAuth()
        try {
            const res = await axios.post(url, body, { headers })
            return res?.data || 0
        } catch(err) {
            throw new Error(`Ragnabot API error ${err.message}`)
        }
    }
}

module.exports = APIRequest