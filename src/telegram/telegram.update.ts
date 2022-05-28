import { Command, Help, Start, Update } from 'nestjs-telegraf';
import { LinkService } from 'src/link/link.service';
import { ViewService } from 'src/view/view.service';
import { Context, Scenes } from 'telegraf';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  @Start()
  startCommand(ctx: Context) {
    ctx.replyWithHTML(
      'Доступны команды(alpha: v0.0.1):\n/stats - <strong>Просмотр статистики ссылки</strong>\n/create - <strong>Создание короткой ссылки</strong>\n/me - <strong>Список ваших ссылок</strong>',
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
}
