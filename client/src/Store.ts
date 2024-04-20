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
    items?: Item[];

    constructor() {
        makeAutoObservable(this);
    }
}
