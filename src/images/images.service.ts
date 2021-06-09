import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, unlinkSync } from 'fs';

@Injectable()
export class ImagesService {
    private logger: Logger;
    constructor() { this.logger = new Logger('ImagesService') }
    async uploadImg(pathImg, res) {
        this.logger.log('Upload image : ' + pathImg);
        return createReadStream(pathImg).pipe(res);
    }

    async removeImg(pathImg) {
        try {
            unlinkSync(pathImg);
            this.logger.log('Images : ' + pathImg + ' was removed')
        } catch (error) {
            this.logger.error(error.message)
        }
    }
}
