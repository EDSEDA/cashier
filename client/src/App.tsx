import * as React from 'react';

import { RecommendationPage } from './View';
import { Store } from './utils/Store';
import { Controller } from './utils/Controller';


export interface Context {
    store: Store;
    ctrl: Controller;
}


export const Ctx = React.createContext<Context>(null!);


function App() {
    const store = new Store();
    const ctrl = new Controller(store);

    return (
        <Ctx.Provider value={{ store, ctrl }}>
            <RecommendationPage/>
        </Ctx.Provider>
    );
}

export default App;
