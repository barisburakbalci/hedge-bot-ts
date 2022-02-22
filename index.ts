import Binance from './classes/Binance';
import PositionService from './classes/PositionService';
import TelegramBot from './classes/TelegramBot';
import Settings from './Settings';

const binanceAPI = new Binance(Settings.binanceApiKey, Settings.binanceApiSecret, 'BTCUSDT', 2);
const telegramBot = new TelegramBot(Settings.telegramToken, Settings.telegramChannel);
const positionService = new PositionService(binanceAPI, telegramBot, Settings.tradeRange, Settings.startingQuantity);
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
    } catch (error) {
        console.log('----------- General Error --------------');
        console.log(new Date().toLocaleString());
        console.error(error);
        console.log('----------- /General Error --------------');
    }
    locked = false;
}

setInterval(runHedgeBot, 10000);
