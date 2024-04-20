import { Store, Item } from "./Store";
import { WebSocketAdapter } from "./adapters/WebsocketAdapter";

export interface UpdateItemsMessage {
    items: Item[];
}

export class Controller {
    private store: Store;
    private adapter: WebSocketAdapter;

    constructor(store: Store) {
        this.store = store;
        this.adapter = new WebSocketAdapter('ws://localhost:8765');
        this.adapter.addEventListener('updateItems', this.onUpdateItemsMessage);
    }

    onItemChoose = (itemId: number) => {
        this.store.isLoading = true;
        this.adapter.sendMessage('addItem', JSON.stringify({ itemId: itemId }));
    }

    private onUpdateItemsMessage = ({ items }: UpdateItemsMessage) => {
        this.store.isLoading = false;
        this.store.items = items;
    }
}
