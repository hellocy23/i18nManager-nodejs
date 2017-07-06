import _ from 'underscore';
import axios from 'axios';
import {message} from 'antd';
import LoginStore from '../stores/LoginStore';

var requestPromiseCache = {};

export const GET_URL_PREFIX = function(){
  return '/api';
};


class AjaxUtils {

    init(checkTokenRequest) {
        //用于遇到异常情况后检查Token是否已过期
        this.checkTokenRequest = checkTokenRequest;
    }

    doGetRequest(url) {
        return this._doRequest('get', url, null);
    }

    //带缓存的Get请求
    doGetRequestCached(url) {
        var p = requestPromiseCache[url];
        if(!p){
            p =  this._doRequest('get', url, null);
            requestPromiseCache[url] = p;
        }
        return p;
    }

    doPostRequest(url, data) {
        return this._doRequest('post', url, data);
    }

    doPutRequest(url, data){
        return this._doRequest('put', url, data);
    }

    doDeleteRequest(url, data){
        return this._doRequest('delete', url, data);
    }

    getRequestURL(url){
        url = GET_URL_PREFIX() + url;
        return url;
    }

    _doRequest(method, url, data) {

        url = GET_URL_PREFIX() + url;
        let checkTokenRequest = this.checkTokenRequest;
        let token = LoginStore.getToken();
        return axios({
            method: method,
            url: url,
            data: data,
            headers: {'x-access-token': token},
        }).then(function (response) {
            if (response.status !== 200) {
                return Promise.reject(response);
            }
            return response;
        }, function ({response}) {
            var status = response.status;
            if (status === 404) {
                message.error("404 URL  :  " + url);
            }
            else if (status === 401) {
                //用户token不合法
                checkTokenRequest && checkTokenRequest();
            }
            else {
                message.error("Error Code :" + status);
            }
            return Promise.reject(response);
        });

    }

}


export default new AjaxUtils();