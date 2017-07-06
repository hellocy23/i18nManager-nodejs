import React from 'react';
import {message} from 'antd';
import LoginView from './LoginView';
import {loginRequest} from '../../api/LoginApi';

export default class LoginComposer extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading:false
        };
    }

    doLogin = (values)=> {
        var router = this.context.router;
        this.setState({isLoading:true});
        loginRequest(values).then((d)=>{
            this.setState({isLoading:false});
            setTimeout(()=>{
                if (d.status == 200) {
                    router.push('/main/home');
                    message.success('Logged in successfully.');
                }else {
                    message.error("Incorrect email or password , please try again.");
                }
            },10)
        },()=>{
            message.error("Login error , Please retry.");
            this.setState({isLoading:false});
        });
    };

    render() {
        return (
            <LoginView actions={this} store={this.state}/>
        );
    }
}
