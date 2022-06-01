import { Command, Help, Start, Update } from 'nestjs-telegraf';
import { Context, Scenes } from 'telegraf';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  startCommand(ctx: Context) {
    ctx.replyWithHTML(
      'Доступныe команды:\n/stats - <strong>Просмотр статистики ссылки</strong>\n/create - <strong>Создание короткой ссылки</strong>\n/me - <strong>Список ваших ссылок</strong>',
    );
  }

  @Command('create')
  createShortLink(ctx: Scenes.SceneContext) {
    ctx.scene.enter('create-link');
  }

  @Command('stats')
  showLinkStats(ctx: Scenes.SceneContext) {
    ctx.scene.enter('view-by-full-url');
  }

  @Command('subscribe')
  subscribeToLink(ctx: Scenes.SceneContext) {
    ctx.scene.enter('subscribe-to-update');
  }

  @Command('me')
  async showLinksUser(ctx: Context) {
    const links = await this.telegramService.getAllLinksByUser(ctx.chat.id);
    ctx.replyWithHTML(
      `${
        links.length === 0
          ? 'У вас пока нету ссылок, но все впереди! /create'
          : 'Твои ссылки (возможно тут будет пагинация):\n' +
            links
              .map((link, index) => {
                return (
                  '\n' +
                  `${index + 1}. <strong>${link.title}</strong> - ${
                    process.env.HOST
                  }/${link.shortId}`
                );
              })
              .join('')
      }`,
      {
        disable_web_page_preview: true,
      },
    );
  }
}
