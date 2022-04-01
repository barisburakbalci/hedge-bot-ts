import Binance from './classes/Binance';
import Logger from './classes/Logger';
import PositionService from './classes/PositionService';
import TelegramBot from './classes/TelegramBot';
import Settings from './Settings';

const binanceAPI = new Binance(Settings.binance.key, Settings.binance.secret, 'BTCUSDT', 2);
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

setInterval(runHedgeBot, 10000);
