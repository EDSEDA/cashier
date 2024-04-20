import { Store, Item } from "./Store";
import { WebSocketAdapter } from "./WebsocketAdapter";

export interface UpdateItemsMessage {
    items: string[];
}

export class Controller {
    private store: Store;
    private adapter: WebSocketAdapter;

    constructor(store: Store) {
        this.store = store;
    }

    setWebsocketUrl = (url: string) => {
        this.store.setIsChoosingUrl(false);
        try {
            if (this.adapter) {
                this.adapter.close();
            }
            this.adapter = new WebSocketAdapter(url);   
            this.adapter.addEventListener('updateItems', this.onUpdateItemsMessage);
        } catch(e) {
            console.error(e);
        }
    }

    onItemChoose = (item: string) => {
        if (!this.adapter) {
            return;
        }
        this.store.setIsLoading(true);
        this.adapter.sendMessage('addItem', JSON.stringify({ item }));
    }

    private onUpdateItemsMessage = ({ items }: { items: string[]}) => {
        console.log('Updating items');
        this.store.setIsLoading(false);
        this.store.setItems(items);
    }
}
