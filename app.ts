import cookieParser from 'cookie-parser';
import { Application } from 'express';
import { logger } from './src/config/winston';

const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const morgan = require('morgan');

class App {
    app: Application;

    constructor() {
        this.app = express();
        this.app.use(fileUpload());
        dotenv.config();
        this.setMiddleWare();
        this.getRouting();
    }

    setMiddleWare() {
        this.app.use(morgan('default', { stream: logger.stream })); // morgan 로그 설정
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(methodOverride());
        this.app.use(cookieParser());

        this.app.disable('x-powered-by');
        this.app.set('trust proxy', true);
        this.app.set('case sensitive routing', true);
        this.app.set('strict routing', true);
        this.app.set('etag', 'strong');
        this.app.set('x-powered-by', false);
        this.app.set('view cache', true);
        this.app.set('view engine', 'pug');
    }

    getRouting() {
        this.app.use('/toki-api', require('~/api/analyze'));
        this.app.use('/toki-api', require('~/api/auth'));
    }
}

module.exports = new App().app;
