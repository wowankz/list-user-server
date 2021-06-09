import { Body, Controller, Get, Logger, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ImagesService } from './images.service';
import { multerOptions, multerConfig } from './upload.config';

@Controller('image')
export class ImagesController {
    private logger: Logger;
    constructor(private ImagesService: ImagesService) { this.logger = new Logger('ImagesController') }

    @Get(':img')
    async getImg(@Param('img') nameImg: string, @Res() res) {
        this.logger.log('Get image : ' + nameImg);
        return await this.ImagesService.uploadImg(join(multerConfig.dest, nameImg), res); //createReadStream(join(multerConfig.dest, nameImg)).pipe(res);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('oldImg') oldImg: string,) {
        this.logger.log('old images: ' + oldImg)
        if (file) {
            this.logger.log(`File ${file.originalname} was uploaded`);
            if (oldImg) this.ImagesService.removeImg(join(multerConfig.dest, oldImg));
            return {
                "statusCode": 200,
                "message": `File ${file.originalname} was uploaded`,
                "data": { "avatar": file.filename }
            }
        } else {
            return {
                statusCode: 500,
                message: ' Something went wrong'
            }
        }

    }
}
