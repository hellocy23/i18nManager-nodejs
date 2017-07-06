import React from 'react';
import AppView from './AppView';
import _ from 'underscore';


export default class AppComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSideBarFold:false, //左侧菜单是否折叠
            menuList : [
                {path: '/main/home', name: 'Project Management', icon: 'home'},
                {path: '/main/i18n', name: 'Resource Management', icon: 'file-text'},
                {path:'/main/i18nImport',name:'Resource Import',icon:'select'}
            ]
        };
    }

    handleChangeMenu = (e)=> {
        //nothing
    };

    toggleMenuFold=()=>{
        var isSideBarFold = this.state.isSideBarFold;
        this.setState({isSideBarFold:!isSideBarFold});
    };


    getMenuItem = (path)=>{
        var menu = _.find(this.state.menuList, function (m) {
            if (m.path === path) {
                return m;
            }
        });
        return menu || {};
    };

     getMenuItemByRoute =  (routes)=>{
        var paths = _.map(routes, function (r) {
            if (r.path === '/') {
                return '';
            }
            return r.path;
        });
        var path = paths.join('/');
        return this.getMenuItem(path);
    };

    render() {

        var routes = this.props.routes;
        var routeInfo = this.getMenuItemByRoute(routes);
        var store = _.extend({
            menuList: this.state.menuList,
            menuCurrent: routeInfo.path
        },this.state);

        return (
            <AppView actions={this} store={store} routeInfo={routeInfo}>{this.props.children}</AppView>
        );
    }

}
