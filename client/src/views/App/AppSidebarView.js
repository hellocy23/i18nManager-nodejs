import React from 'react';
import { Menu, Icon } from 'antd';
import {Link} from 'react-router'
import _ from 'underscore';
const SubMenu = Menu.SubMenu;
import './AppSidebarView.less';


export default class AppSidebarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleClick = (e)=> {
        var actions = this.props.actions;
        actions.handleChangeMenu(e);
    };

    onOpenChange = (e)=> {
    };

    render() {

        var {isSideBarFold,menuList,menuCurrent} = this.props.store;


        return (
            <div className={`ant-layout-siderbar  sidebar-fold-${isSideBarFold}`}>

                <div className="header">
                    <div className="header-logo">I18N Management System</div>
                </div>


                <Menu
                    theme="light"
                    mode="inline"
                    openKeys={[menuCurrent]}
                    selectedKeys={[menuCurrent]}
                    onOpenChange={this.onOpenChange}
                    onClick={this.handleClick}
                >
                    {_.map(menuList,function(menu){
                        if(menu.isMenu===false){
                            return null;
                        }
                        return (
                            <Menu.Item key={menu.path}>
                                <Link to={menu.path}>
                                    <Icon type={menu.icon}/>
                                    {menu.name}
                                </Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </div>
        );
    }

}
