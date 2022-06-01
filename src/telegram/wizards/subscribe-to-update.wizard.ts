import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { AbortMarkup } from 'src/constants/AbortMarkup';
import { URL_EXP } from 'src/constants/URL';
import { LinkService } from 'src/link/link.service';
import { Markup, Scenes } from 'telegraf';

@Wizard('subscribe-to-update')
export class SubscribeToUpdate {
  constructor(private readonly linkService: LinkService) {}

  @WizardStep(1)
  async startSubscribing(@Context() ctx: Scenes.WizardContext) {
    ctx.replyWithHTML(
      `Введи ссылку, на которую ты хочешь подписаться или отписаться!`,
      AbortMarkup,
    );
    ctx.wizard.next();
  }
  @WizardStep(2)
  async acceptLink(@Context() ctx: Scenes.WizardContext) {
    try {
      const link = (ctx as any).message.text as string;

      if (link === 'Прервать') {
        await ctx.reply('Процесс подписки остановлен', Markup.removeKeyboard());
        return ctx.scene.leave();
      }

      if (link.search(URL_EXP) === -1) {
        await ctx.reply(
          'Кажется, это не ссылка. Попробуйте еще раз! /create',
          Markup.removeKeyboard(),
        );
        return ctx.scene.leave();
      }

      const { message_id } = await ctx.reply(
        'Работаем...',
        Markup.removeKeyboard(),
      );
      const { result, state } =
        await this.linkService.subscribeUserToLinkByLink(link.slice(-9));
      ctx.deleteMessage(message_id);

      if (!result) {
        ctx.reply(
          `Кажется, я не нашел в своих чертогах эту ссылку...Попробуйте еще раз! /subscribe`,
          Markup.removeKeyboard(),
        );
        return ctx.scene.leave();
      }
      ctx.reply(
        `Вы ${
          state ? 'подписаны на ссылку' : 'отписались от ссылки'
        } ${link}\nЧтобы отписаться, воспользуйтесь командой вновь`,
        Markup.removeKeyboard(),
      );
      return ctx.scene.leave();
    } catch (error) {
      console.log(error);
    }
  }
}
