import React from 'react';
import {Icon,Modal} from 'antd';
import {Link} from 'react-router';
const confirm = Modal.confirm;
import LoginStore from '../../stores/LoginStore';
import {logoutRequest} from '../../api/LoginApi'
import './AppHeaderView.less';

export default class AppHeaderView extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    handleLogout = ()=> {
        var router = this.context.router;
        confirm({
            title: 'Log out ?',
            content: 'Are you sure you want to log out of the system?',
            onOk() {
                localStorage.removeItem('token');
                router.push('/login');
            },
            onCancel() {
            }
        });
    };

    render() {
        var actions = this.props.actions;
        var store = this.props.store;
        var isSideBarFold = store.isSideBarFold;

        return (
            <div className='ant-layout-header'>
                <div className="header-left floatLeft">
                    <div className="header-menu-fold" onClick={actions.toggleMenuFold}>
                        {isSideBarFold?<Icon type="menu-unfold" title="unfold"/>:<Icon type="menu-fold" title="fold"/> }
                    </div>
                </div>
                <div className="header-right">
                    <span className="logout" onClick={this.handleLogout}>
                        <Icon type="poweroff" className="poweroff"/>Logout</span>
                </div>
            </div>
        );
    }

}
