// Redux
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

// const __DEV__ = process.env.NODE_ENV === 'production' ? false : true;
const finalCreateStore = compose(
	applyMiddleware(thunk),
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
