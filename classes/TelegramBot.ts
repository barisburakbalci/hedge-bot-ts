import axios from 'axios';

class TelegramBot {
    private token: string;
    private channel: string;

    constructor(token: string, channel: string) {
        this.token = token;
        this.channel = channel;
    }

    async sendMessage(text: string): Promise<void> {
        const params = { chat_id: this.channel, text, parse_mode: 'HTML' };
        const headers = { 'Content-Type' : 'application/json' };

        try {
            await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage`, params, { headers });
        } catch (error) {
            console.error('Telegram Error', error);
        }
    }
}

export default TelegramBot;