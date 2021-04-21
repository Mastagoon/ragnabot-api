const Discord = require("discord.js")
const APIManager = require("../api/APIManager")
const { defaultOptions, Routes } = require("../util/Constants")
const CreateEmbedBrowser = require("../util/CreateEmbedBrowser")

class RagnabotClient {
    constructor(config) {
        this.config = config
        this.rest = new APIManager(this)
        this.options = defaultOptions
        // this.validateConfig() #TODO
    }
    /**
     * @returns auth key
     */
    getAuth = () => {
        const key = this.config.api_key
        if(key) return `Bearer ${key}`
        throw new Error('RAGNABOT key MISSING')
    }
    /**
     * checks the validity of given key.
     */
    validateConfig = async () => {
        const isValid = await this.rest.request(Routes.utilRoute, `validate`, { ...this.options, auth: false, data: { key: this.config.api_key } })
        if(!isValid) throw new Error(`Ragnabot Error: Invalid API Key.`)
    }
    /**
     * Creates an embed for help command.
     * @param {Array} commandList a list of all available command objects
     * @returns an embed browser data.
     */
    getHelpBrowser = async (commandList, message, userId) => {
        const data = await this.rest.request(Routes.utilRoute, `help`, { ...this.options, data: { commandList }})
        return CreateEmbedBrowser(data, message, userId)
    }
    /**
     * Creates an embed for an item. used in the iteminfo command.
     * @param {Int} id the ID of the item
     * @param {Object} data item data from the local DB
     * @returns Formatted embed of the item data provided. if data is ommited the result will come from divine-pride API
     */
    getItemEmbed = async (id, itemData) => {
        const data = await this.rest.request(Routes.itemRoute, `embed`, { ...this.options, data: { id, data: itemData } })
        return new Discord.MessageEmbed(data)
    }
    /**
     * Creates an item browser catalogue for item serach by name.
     * @param {Array} items an array of items.
     * @returns an item browser object.
     */
     getItemBrowser = async(items, message, userId) => {
        const data = await this.rest.request(Routes.itemRoute, `browser`, { ...this.options, data: { items } })
        return CreateEmbedBrowser(data, message, userId)
    }
    /**
     * Creates an embed used for the reward command.
     * @param {Int} itemID ID of the reward item 
     * @param {Int} amount item amount
     * @param {String} username name of the reward recipient
     * @returns A discord rich embed on scucess. 0 on failure
     */
    getRewardEmbed = async (itemID, amount, username = "Unknown") => {
        const data = await this.rest.request(Routes.itemRoute, `reward`, { ...this.options, data: { itemID, amount, username } })
        return new Discord.MessageEmbed(data)
    }
    /**
     * Creates an embed for monster search
     * @param {Int} id ID of a monster
     * @returns a formatted embed browser with the required monster's data
     */
    mobDataBrowser = async(id, message, userId) => {
        const data = await this.rest.request(Routes.mobRoute, `embed`, { ...this.options, data: { id } })
        return CreateEmbedBrowser(data, message, userId)
    }
    /**
     * Creates an embed browser for searching monsters by name.
     * @param {String} name the name of the search monster 
     * @returns a browser with all matching results
     */
    getMobBrowser = async(name) => {
        const data = await this.rest.request(Routes.mobRoute, `browser`, { ...this.options, data: { name } })
        return CreateEmbedBrowser(data)
    }
    /* Trivia Event */
    /**
     * Returns a random trivia question
     * @param {String} lang the language of the question (default: english)
     * @returns an object with a trivia question and its answers
     */
     getTriviaQuestion = async (lang = 'en') => {
        return await this.rest.request(Routes.triviaRoute, `q`, { ...this.options, data: { lang } })
    }
    /* Disguise Event */
    /**
     * Returns data for a random monster. Used in disguise event.
     * @returns Mob Data
     */
     randomMob = async () => {
        return await this.rest.request(Routes.disguiseRoute, `mob`, this.options)
    }
    /* Bossfight event */
    /**
     * Spawns a random boss from a given boss list. used in bossfight event
     * @param {Array} list an array list of possible bosses. if not specified, the default boss list will be used instead
     * @param {Int} dropRate the drop rate of items. this is used to calculate boss drops
     * @returns bossData object
     */
    spawnBoss = async (list, dropRate) => {
       const data = await this.rest.request(Routes.bossFightRoute, `boss`, { ...this.options, data: { list, dropRate } })
       data?.drops?.forEach((d, i) => {
            data.drops[i].embed = new Discord.MessageEmbed(d.embed)
       })
       return data
    }
    /**
     * Creates an embed for bossfight, with updated boss data.
     * @param {Object} bossData bossdata object 
     * @returns discord rich embed containing formatted boss data.
     */
    getBossFightEmbed = async (bossData) => {
        const data = await this.rest.request(Routes.bossFightRoute, `embed`, { ...this.options, data: { bossData } })
        return new Discord.MessageEmbed(data)
    }
    /**
     * Creates a gear list for a player to choose from in bossfight event.
     * @param {String} username the name of the participent.
     * @returns a list of gear random gear choices
     */
    generateBossfightGearList = async(username) => {
        const data = await this.rest.request(Routes.bossFightRoute, `gear`, { ...this.options, data: { username } })
        for(catagory in data) {
            data[catagory].forEach((it, i) => {
                data[catagory][i].embed = new Discord.MessageEmbed(it?.embed)
            })
        }
        return data
    }
    /* auction */
    /**
     * Creates an auction object out of an SQL item object
     * @param {Object} item SQL item object
     * @returns auction item object
     */
    createAuction = async(item) => {
        return await this.rest.request(Routes.auctionRoute, `create`, { ...this.options,  data: { item } })
    }
    /**
     * Creates an embed for an auction info or expiry.
     * @param {Object} auction auction data object
     * @param {String} type info / history. default: info
     * @returns an embed of auction data to update the auction channel, or auction winner to send in the auction history channel.
     */
     getAuctionEmbed = async (auction, type = "info") => {
        const data = await this.rest.request(Routes.auctionRoute, `embed`, { ...this.options, data: { auction, type } })
        return new Discord.MessageEmbed(data)
    }
}

module.exports = RagnabotClient