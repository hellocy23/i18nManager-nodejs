import ReactDOM from 'react-dom';
import React from 'react';
import { Router, browserHistory } from 'react-router';
import { LocaleProvider, message } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import routes from './routes';

const history = browserHistory;

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Router routes={routes} history={history} />
    </LocaleProvider>,
    document.getElementById('root')
);
