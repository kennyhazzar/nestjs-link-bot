import { Context, Wizard, WizardStep } from "nestjs-telegraf";
import { Context as TelegrafContext, Markup, Scenes } from "telegraf";

const URL_EXP = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi

@Wizard('create-link')
export class CreateLinkWizard {
    @WizardStep(1)
    startCreatingLink(@Context() ctx: Scenes.WizardContext) {
        ctx.reply('Отправь мне ссылку!', Markup.keyboard([
            ['Прервать']
        ]).resize())
        ctx.wizard.next()
    }
    @WizardStep(2)
    async createLink(@Context() ctx: Scenes.WizardContext) {
        if (((ctx as any).message.text as string) === 'Прервать') {
            await ctx.reply('Создание ссылки прервано', Markup.removeKeyboard())
            return ctx.scene.leave()
        }
        if (((ctx as any).message.text as string).search(URL_EXP) === -1) {
            await ctx.reply('Кажется, это не ссылка. Попробуйте еще раз!', Markup.removeKeyboard())
            return ctx.scene.leave()
        }
        await ctx.reply('Короткая ссылка создана:)\n[ссылка]', Markup.removeKeyboard())
        ctx.scene.leave()
    }
    // ^(http|https):\/\/cs[0-9]+\.[a-zA-Z0-9]+\.me\/[^.]+
}