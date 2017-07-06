/**
 * 登录用户的信息,是全局性信息.单独存储.
 * 界面各自的数据,直接使用State存储
 */

const TOKEN = 'token';
class LoginStore {

    constructor(props) {
        var token = localStorage.getItem(TOKEN);
        if(token) {
            this.token = token;
        }else {
            this.token = null;
        }
    }

    getToken(){
        return this.token;
    }

    setToken(data){
        let token = '';
        if(data) {
            token = data.token;
        }
        localStorage.setItem(TOKEN, token);
        this.token = token;
    }
    
}

export default new LoginStore();