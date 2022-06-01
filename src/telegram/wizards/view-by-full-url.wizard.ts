import { Context, Wizard, WizardStep } from "nestjs-telegraf";
import { AbortMarkup } from "src/constants/AbortMarkup";
import { URL_EXP } from "src/constants/URL";
import { ViewService } from "src/view/view.service";
import { Markup, Scenes } from "telegraf";

@Wizard('view-by-full-url')
export class ViewByFullUrlWizard {
  constructor(private readonly viewService: ViewService) { }

  @WizardStep(1)
  searchingLinkByUrl(@Context() ctx: Scenes.WizardContext) {
    ctx.replyWithHTML(
      'Вставь <strong>короткую ссылку (не оригинал)</strong>, статистику которой ты хочешь просмотреть\nПока что имеется возможность просматривать только количество переходов по ссылке',
      AbortMarkup,
    );
    ctx.wizard.next();
  }
  @WizardStep(2)
  async resultStep(@Context() ctx: Scenes.WizardContext) {
    try {
      const link = (ctx as any).message.text as string;

      if (link === 'Прервать') {
        await ctx.reply('Поиск статистики прерван', Markup.removeKeyboard());
        return ctx.scene.leave();
      }

      if (link.search(URL_EXP) === -1) {
        await ctx.reply(
          'Кажется, это не ссылка. Попробуйте еще раз! /stats',
          Markup.removeKeyboard(),
        );
        return ctx.scene.leave();
      }

      const { message_id } = await ctx.reply(`Ищу...`, Markup.removeKeyboard());

      const result = await this.viewService.getLinkInformationById(
        link.slice(-9),
      );

      if (!result) {
        ctx.deleteMessage(message_id);
        ctx.reply(
          'Кажется, я ничего не нашел в своих чертогах...\nПопробуйте еще раз! /stats',
          Markup.removeKeyboard(),
        );
        return ctx.scene.leave();
      }

      ctx.deleteMessage(message_id);

      const { title, shortId, url, views } = result;

      ctx.replyWithHTML(
        `Заголовок страницы: <strong>${title}</strong>\nКоличество переходов: <strong>${views}</strong>
      `,
        Markup.inlineKeyboard([
          Markup.button.url('Оригинал', url),
          Markup.button.url(
            'Короткая ссылка',
            `${process.env.HOST}/link/${shortId}`,
          ),
        ]),
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