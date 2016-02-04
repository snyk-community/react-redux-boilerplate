import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import Application from './pages/application/application.view';
import Home from './pages/home/home.view';

export default (store) => {
    return (
        <Route path="/" component={Application}>
            { /* Home (main) route */ }
            <IndexRoute component={Home}/>

            { /* Routes */ }
            { /* ... */ }

            { /* Catch all route */ }
            { /* <Route path="*" component={NotFound} status={404} /> */ }
        </Route>
    );
}
