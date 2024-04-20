import * as React from 'react';

import { RecommendationPage } from './View';
import { Store } from './utils/Store';
import { Controller } from './utils/Controller';


export interface Context {
    store: Store;
    ctrl: Controller;
}


export const Ctx = React.createContext<Context>(null!);


class App extends React.Component {

    private store: Store;
    private ctrl: Controller;

    constructor(props: {}) {
        super(props);
        this.store = new Store();
        this.ctrl = new Controller(this.store, () => this.forceUpdate());
    }

    render(): React.ReactNode {

        return (
            <Ctx.Provider value={{ store: this.store, ctrl: this.ctrl }}>
                <RecommendationPage/>
            </Ctx.Provider>
        );
    }
}

export default App;
