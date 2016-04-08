import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';

export default combineReducers({
    router,
    reduxAsyncConnect
});
