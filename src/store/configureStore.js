// Redux
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import createLogger from 'redux-logger';
// import Immutable from 'immutable';
import rootReducer from '../reducers';

// const __DEV__ = process.env.NODE_ENV === 'production' ? false : true;
const finalCreateStore = compose(
	applyMiddleware(thunk),
    // window.devToolsExtension ? window.devToolsExtension() : f => f
    // applyMiddleware(createLogger({
    //     // Transform Immutable object to plain json for better debuggin experience
    //     stateTransformer: (state) => {
    //         let newState = {};
    //         for (var i of Object.keys(state)) {
    //             if (Immutable.Iterable.isIterable(state[i])) {
    //                 newState[i] = state[i].toJS();
    //             } else {
    //                 newState[i] = state[i];
    //             }
    //         };
    //         return newState;
    //     }
    // }))
)(createStore);

export default function configureStore(initialState) {
	const store = finalCreateStore(rootReducer, initialState);

	if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};
