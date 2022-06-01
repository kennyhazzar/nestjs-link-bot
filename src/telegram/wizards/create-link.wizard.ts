import { Context, Wizard, WizardStep } from 'nestjs-telegraf';
import { toBuffer } from 'qrcode';
import { AbortMarkup } from 'src/constants/AbortMarkup';
import { URL_EXP } from 'src/constants/URL';
import { LinkService } from 'src/link/link.service';
import { Markup, Scenes } from 'telegraf';

@Wizard('create-link')
export class CreateLinkWizard {
  constructor(private readonly linkService: LinkService) {}

  @WizardStep(1)
  startCreatingLink(@Context() ctx: Scenes.WizardContext) {
    ctx.reply('Отправь мне ссылку!', AbortMarkup);
    ctx.wizard.next();
  }
  @WizardStep(2)
  async createLink(@Context() ctx: Scenes.WizardContext) {
    try {
      const link = (ctx as any).message.text as string;

      if (link === 'Прервать') {
        await ctx.reply('Создание ссылки прервано', Markup.removeKeyboard());
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
        `Создаем...`,
        Markup.removeKeyboard(),
      );

      const result = await this.linkService.create(link, ctx.from.id);

      const shortUrl = `${process.env.HOST}/${result.shortId}`;

      ctx.deleteMessage(message_id);

      await ctx.replyWithPhoto(
        {
          source: await toBuffer(`${shortUrl}`, {
            width: 400,
          }),
        },
        Markup.inlineKeyboard([Markup.button.url(shortUrl, shortUrl)]),
      );
      ctx.scene.leave();
    } catch (error) {
      console.log(error);
      await ctx.reply(
        'Кажется, что-то пошло не так на сервере:(\nПовторите попытку позже!',
        Markup.removeKeyboard(),
      );
      ctx.scene.leave();
    }
  }
}
