import { Injectable } from '@nestjs/common';
import { LinkService } from 'src/link/link.service';
import { ILink } from 'src/models/link.model';

@Injectable()
export class TelegramService {
  constructor(private readonly linkService: LinkService) { }

  async getAllLinksByUser(userId: number): Promise<ILink[]> {
    return this.linkService.findAllById(userId)
  }
}
