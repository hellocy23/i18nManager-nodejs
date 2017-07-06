import React from 'react';
import {Button} from 'antd';

export default class AppBreadcrumbView extends React.Component {


    render() {
        var routeInfo = this.props.routeInfo || {};
        return (
            <div className="ant-breadcrumb">
                <div className="item">
                    {routeInfo.name}
                </div>
                <div className="floatRight">
                </div>
            </div>
        );
    }

}
