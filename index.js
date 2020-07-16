// const Telegraf = require("telegraf")
const { Composer } = require('micro-bot')
// const bot = new Telegraf("1317062358:AAGnfHmBBI1HwB9Wpv-FdOiyYkCo2PwC218")
const bot = new Composer()
const axios = require('axios')
// Bot *start* command
bot.start((ctx) => {
    // bot.telegram.sendChatAction(ctx.chat.id, "typing")
    ctx.reply('Welcome to Fact Bot. Type /help for bot commands.')
})
// Bot *help* command
bot.command(["help"], ctx => {
    // bot.telegram.sendChatAction(ctx.chat.id, "typing")
    let message = `
Help Reference:
/fact - Get random facts
    `;
    ctx.reply(message)
})
let dataStore = []
getData()
// Bot *fact* command
bot.command("fact", ctx => {
    // bot.telegram.sendChatAction(ctx.chat.id, "typing")
    let maxRow = dataStore.filter(item => {
        return (item.row == "1" && item.col == "2")
    })[0].val
    let k = Math.floor(Math.random() * maxRow) + 1;
    let fact = dataStore.filter(item => {
        return (item.row == k && item.col == "5")
    })[0]
    let message =
        `
Fact #${fact.row}:
${fact.val}
`
    ctx.reply(message)
})
// Bot *update* command
bot.command("update", async ctx => {
    // bot.telegram.sendChatAction(ctx.chat.id, "typing")
    try {
        await getData()
        ctx.reply("Updated 👍")
    } catch (e) {
        console.log(e)
        ctx.reply('Error encountered...')
    }
})
async function getData() {
    try {
        let res = await axios("https://spreadsheets.google.com/feeds/cells/1t-uhelpSqmO1i9tTA3k55Uw4TKqiS31WFGMDXx_L-hw/1/public/full?alt=json")
        let data = res.data.feed.entry
        dataStore = []
        data.forEach(item => {
            dataStore.push({
                row: item.gs$cell.row,
                col: item.gs$cell.col,
                val: item.gs$cell.inputValue
            })
        })
    } catch (err) {
        console.log(err)
        throw new Error
    }
}
// Bot *launch* command
// bot.launch()
module.exports = bot