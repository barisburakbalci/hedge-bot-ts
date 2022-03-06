import * as FileSystem from 'fs';

class Logger {
    static LogInfo(message: string): void {
        let formattedText = '-'.repeat(10) + new Date().toLocaleString() + '-'.repeat(10);
        formattedText += '\n' + message + ' \n';
        console.info(formattedText);
        Logger.LogToFile(message);
    }
    static LogError(message: string, data: any): void {
        console.error('-'.repeat(20), 'ERROR', '-'.repeat(20));
        console.error(new Date().toLocaleString(), '-', message);
        console.error('-'.repeat(20));
        console.error(data);
        console.error('-'.repeat(20), '/ERROR', '-'.repeat(20));
        Logger.LogToFile(message + '\n' + JSON.stringify(data, null, 2));
    }
    static LogToFile(message: string): void {
        const dividerText = '-'.repeat(20) + new Date().toLocaleString() + '-'.repeat(20);
        const formattedText = '\n' + dividerText + '\n' + message + '\n';
        FileSystem.appendFile('logs.txt', formattedText, err => {
            if (err) {
                console.error('Error occured while logging to logs.txt', err);
            }
        });
    }
}

export default Logger;
