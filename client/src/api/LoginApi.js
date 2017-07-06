import axios from 'axios';
import AjaxUtils from '../utils/AjaxUtils';
import LoginStore from '../stores/LoginStore';

const doGetRequest = function(url){
    url =  `/api/login${url}`;
    return axios({ method: 'get', url: url});
};

//登录
export const loginRequest = function ({email,password}) {

    email = encodeURIComponent(email);
    password = encodeURIComponent(password);

    return doGetRequest('/doLogin?email=' + email + '&passwd=' + password).then(function (d) {
        if (d.status == 200) {
            LoginStore.setToken(d.data);
        }else {
            LoginStore.setToken(null);
        }
        return d;
    });

};
