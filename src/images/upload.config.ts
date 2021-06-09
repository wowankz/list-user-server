import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, parse } from "path";

const Log = new Logger('Uploader-config')
const DIR_UPLOAD = './../images';
const MAX_FILE_SIZE = 6 * 1024 * 1024

export const multerConfig = {
    dest: DIR_UPLOAD,
};

// Multer upload options
export const multerOptions = {
    limits: {
        fileSize: MAX_FILE_SIZE,
    },

    fileFilter: (req: any, file: any, cb: Function) => {
        if (file.mimetype.match(/\/(png|jpeg|gif)$/)) {
            cb(null, true);
        } else {
            Log.error(`Unsupported file type ${extname(file.originalname)}`)
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }

    },
    // Storage properties
    storage: diskStorage({
        destination: (req: any, file: any, cb: Function) => {
            const uploadPath = multerConfig.dest;
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);

        },

        filename: (req: any, file: any, cb: Function) => {
            cb(null, `${new Date().getTime()}_${parse(file.originalname).name}${extname(file.originalname)}`);
        },
    }),
};


