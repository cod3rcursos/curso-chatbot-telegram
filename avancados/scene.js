const env = require('../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { enter, leave } = Stage
const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo, ${name}!`)
    ctx.reply(`Entre com /echo ou /soma para iniciar...`)
})

const echoScene = new Scene('echo')
echoScene.enter(ctx => ctx.reply('Entrando em Echo Scene'))
echoScene.leave(ctx => ctx.reply('Saindo de Echo Scene'))
echoScene.command('sair', leave())
echoScene.on('text', ctx => ctx.reply(ctx.message.text))
echoScene.on('message', ctx => ctx.reply('Apenas mensagens de texto, por favor'))

let sum = 0
const sumScene = new Scene('sum')
sumScene.enter(ctx => ctx.reply('Entrando em Sum Scene'))
sumScene.leave(ctx => ctx.reply('Saindo de Sum Scene'))

sumScene.use(async (ctx, next) => {
    await ctx.reply('Você está em Soma Scene, escreva números para somar')
    await ctx.reply('Outros comandos: /zerar /sair')
    next()
})

sumScene.command('zerar', ctx => {
    sum  = 0
    ctx.reply(`Valor: ${sum}`)
})

sumScene.command('sair', leave())

sumScene.hears(/(\d+)/, ctx => {
    sum += parseInt(ctx.match[1])
    ctx.reply(`Valor: ${sum}`)
})

sumScene.on('message', ctx => ctx.reply('Apenas números, por favor'))

const stage = new Stage([echoScene, sumScene])
bot.use(session())
bot.use(stage.middleware())
bot.command('soma', enter('sum'))
bot.command('echo', enter('echo'))
bot.on('message', ctx => ctx.reply('Entre com /echo ou /soma para iniciar...'))

bot.startPolling()