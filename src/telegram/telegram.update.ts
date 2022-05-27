import { Command, Help, Start, Update } from "nestjs-telegraf";
import { LinkService } from "src/link/link.service";
import { ViewService } from "src/view/view.service";
import { Context, Scenes } from "telegraf";
import { TelegramService } from "./telegram.service";

@Update()
export class TelegramUpdate {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly viewService: ViewService,
        private readonly linkService: LinkService
    ) { }

    @Start()
    async startCommand(ctx: Context) {
        await ctx.reply('Welcome!')
    }

    @Help()
    async helpCommand(ctx: Context) {
        await ctx.reply('this is my help for you')
    }

    @Command('view')
    async viewLinks(ctx: Context) {
        await ctx.reply(ctx.message.from.first_name)
    }

    @Command('create')
    async createShortLink(ctx: Scenes.SceneContext) {
        // this.linkService.create()
        ctx.scene.enter('create-link')
    }
}