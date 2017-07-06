import React from 'react';
import { Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import {message} from 'antd';
import LoginComposer from '../views/Login/LoginComposer';
import AppComposer from '../views/App/AppComposer';
import I18nMainComposer from '../views/I18nMain/I18nMainComposer';
import ProjectsComposer from '../views/Projects/ProjectsComposer';
import I18nImportComposer from '../views/i18nImport/I18nImportComposer';
import AjaxUtils from '../utils/AjaxUtils';
import LoginStore from '../stores/LoginStore';
import '../views/index.less';

const history = browserHistory;

AjaxUtils.init(function(){
        message.error("Login information has expired, please login again.");
        history.push('/login');
});

const validateLogin = function (next, replace, callback) {
    var tokenInfo = LoginStore.getToken();
    if (!tokenInfo) {
        replace('/login');
    }
    callback()
};

const routes = 
  <Route path="/">
    <Route path="login" component={LoginComposer}/>
    <Route path="main" component={AppComposer} onEnter={validateLogin}>
        <Route path="home" component={ProjectsComposer}></Route>
        <Route path="i18n" component={I18nMainComposer}></Route>
        <Route path="i18n/:id" component={I18nMainComposer}></Route>
        <Route path="i18nImport" component={I18nImportComposer}></Route>
        <Route path="*" >
            <IndexRedirect to="/main/home"></IndexRedirect>
        </Route>
    </Route>
    <Route path="" >
        <IndexRedirect to="/login"></IndexRedirect>
    </Route>
    <Route path="*" >
        <IndexRedirect to="/login"></IndexRedirect>
    </Route>
  </Route>


export default routes;