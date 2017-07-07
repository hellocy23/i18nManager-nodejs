import loginModel from '../models/loginModel';
import jwt from 'jwt-simple';
import moment from 'moment';

export default function(req,res,next){
    const {email, passwd} = req.query;
    loginModel.findOne({email: email}, (error,data)=> {
        if(error){
            // user not found
            return res.status(500);
        }
        
        if (!data) {
            // incorrect username
            return res.status(404).send("user does not exist");
        }

        if (passwd != data.passwd) {
            // incorrect password
            return res.status(401).send("Incorrect password");
        }

        let expires = moment().add(7,'days').valueOf();
        let token = jwt.encode({
            email: email,
            exp: expires
        }, 'jwtTokenSecret');
        let jsonData = {
            token: token
        }
        return res.status(200).json(jsonData);

    });
}