const { defaultOptions } = require("../util/Constants")
const APIRequest = require("./APIRequest")

class APIManager {
    constructor(client) {
        this.client = client
        this.options = defaultOptions
    }

    request(route, endPoint, options = this.options) {
        const request = new APIRequest(this.client, route, endPoint, options)
        return request.make()
    }
}

module.exports = APIManager