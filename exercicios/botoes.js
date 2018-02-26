const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

let contagem = 0

const botoes = Extra.markup(Markup.inlineKeyboard([ 
    Markup.callbackButton('+1', 'add 1'),
    Markup.callbackButton('+10', 'add 10'),
    Markup.callbackButton('+100', 'add 100'),
    Markup.callbackButton('-1', 'sub 1'),
    Markup.callbackButton('-10', 'sub 10'),
    Markup.callbackButton('-100', 'sub 100'),
    Markup.callbackButton('🔃 Zerar', 'reset'),
    Markup.callbackButton('Resultado', 'result')
], { columns: 3 }))

bot.start(async ctx => {
    const nome = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${nome}!`)
    await ctx.reply(`A contagem atual está em ${contagem}`, botoes)
})

bot.action(/add (\d+)/, ctx => {
    contagem += parseInt(ctx.match[1])
    ctx.reply(`A contagem atual está em ${contagem}`, botoes)
})

bot.action(/sub (\d+)/, ctx => {
    contagem -= parseInt(ctx.match[1])
    ctx.reply(`A contagem atual está em ${contagem}`, botoes)
})

bot.action('reset', ctx => {
    contagem = 0
    ctx.reply(`A contagem atual está em ${contagem}`, botoes)
})

bot.action('result', ctx => {
    ctx.answerCbQuery(`A contagem atual está em ${contagem}`)
})

bot.startPolling()
