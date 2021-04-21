
exports.defaultOptions = {
    auth: true,
    versioned: true,
    http: {
        version: 1,
        api: "http://yggdrasil-ro.me:5346/api",
    },
}

exports.Routes = {
    mobRoute: `monster`,
    itemRoute: `item`,
    triviaRoute: `trivia`,
    disguiseRoute: `disguise`,
    bossFightRoute: `bossfight`,
    auctionRoute: `auction`,
    utilRoute: `util`
}