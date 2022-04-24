import Binance from './classes/Binance';
import Logger from './classes/Logger';
import PositionService from './classes/PositionService';
import TelegramBot from './classes/TelegramBot';
import Settings from './Settings';
import { Side } from './Enums';

const binanceAPI = new Binance(Settings.binance.key, Settings.binance.secret, Settings.app.symbol, Settings.app.precision);
const telegramBot = new TelegramBot(Settings.telegram.token, Settings.telegram.channel);
const positionService = new PositionService(binanceAPI, telegramBot, Settings.app.tradeRange, Settings.app.startingQuantity, Settings.app.actionRatio, Settings.app.leverage);
let locked = false;
console.log('-'.repeat(10), 'HedgeBot is running', '-'.repeat(10));

async function runHedgeBot() {
    if (locked) {
        console.log('Process is locked');
        return;
    }
    locked = true;
    try {
        await positionService.run();
    } catch (error: any) {
        Logger.LogError(error?.response?.data?.msg, error);
    }
    locked = false;
}

//setInterval(runHedgeBot, 10000);

import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

const app: Express = express();
const port = 80;

app.use(bodyParser.text())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('API Welcome');
});

app.post('/', (req: Request, res: Response) => {
    const [ currency, price, side, token ] = req.body.split(' ');
    if (token != '13579bbb$') {
        res.send('You are not authorized to view this page');
        return;
    }
    try {
        console.log(`Responding hook for ${currency}:${side}:${price}`);
        positionService.respondHooks(currency, price, side);
    } catch (err) {
        console.error("----- ERROR -----");
        console.error(err);
    }
    res.send(currency + price);
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
