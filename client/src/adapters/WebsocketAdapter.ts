export type MessageHandler = [
    messageType: string,
    callback: (body: any) => void,
];

const SEPARATOR = ':';


export class WebSocketAdapter {

    private ws: WebSocket;
    private handlers: MessageHandler[] = [];

    constructor(url: string) {
        const ws = new WebSocket(url);
        this.ws = ws;

        ws.onopen = () => {
            // connection opened
            ws.send('Connection established');
        };

        ws.onmessage = e => {
            // a message was received
            console.log(e.data);
            const [dataType, data] = e.data.split(SEPARATOR);
            for (const [messageType, callback] of this.handlers) {
                if (messageType === dataType) {
                    callback(JSON.parse(data));
                }
            }
        };

        ws.onerror = e => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = e => {
            // connection closed
            console.log(e.code, e.reason);
        };
    }

    sendMessage = (
        messageType: string,
        messageBody: string
    ) => {
        this.ws.send(`${messageType}${SEPARATOR}${messageBody}`);
    }

    addEventListener = (
        messageType: string,
        callback: (body: any) => void
    ) => {
        this.handlers.push([messageType, callback])
    }
}
