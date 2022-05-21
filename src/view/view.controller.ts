import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ViewService } from './view.service';

@Controller(':id')
export class ViewController {

    constructor(private viewService: ViewService) { }

    @Get('view')
    async getText(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const link = await this.viewService.getLinkInformationById(id)
        if (!link) {
            return res.status(404).send({ error: "this short link does not exist!" })
        }
        return res.status(200).send(link)
    }
}
