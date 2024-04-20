import { makeAutoObservable } from "mobx"


export interface Item {
    id: number;
    name: string;
    tag?: string;
    price: number;
    oldPrice?: number;
    imageSrc: string;
}


export class Store {
    isLoading = true;
    items?: string[];
    url: string = 'ws://192.168.50.229:8765';
    isChoosingUrl = true;


    constructor() {
        makeAutoObservable(this);
    }

    setIsLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    }

    setItems = (items: string[]) => {
        this.items = items;
    }

    setUrl = (url: string) => {
        this.url = url;
    }

    setIsChoosingUrl = (isChoosingUrl: boolean) => {
        this.isChoosingUrl = isChoosingUrl;
    }
}
