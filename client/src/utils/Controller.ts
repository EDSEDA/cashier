import { Store, Item } from "./Store";
import { WebSocketAdapter } from "./WebsocketAdapter";

export interface UpdateItemsMessage {
    items: string[];
}

export class Controller {
    private store: Store;
    private adapter: WebSocketAdapter;
    private forceRerender: () => void;

    constructor(store: Store, forceRerender: () => void) {
        this.store = store;
        this.forceRerender = forceRerender;
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
        this.adapter.sendMessage('addItem', JSON.stringify({ item }));
    }

    private onUpdateItemsMessage = ({ items }: { items: string[]}) => {
        const decodedItems = items.map(item => decodeURIComponent(item))
        console.log(`Updating items: '${decodedItems.join(',')}'`);
        this.store.setItems(items);
        this.forceRerender();
    }
}
