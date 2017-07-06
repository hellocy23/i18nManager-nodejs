const jwt = require("jwt-simple");

export default function(req,res,next){
    const token = req.header('x-access-token');
    let email;
    if(token){
        try{
            var decoded = jwt.decode(token, 'jwtTokenSecret');
            if(decoded.exp < Date.now()){
                return res.status(401).end('token expired');
            }
            email = decoded.email;
        } catch(err){
            return res.status(401).end('token err');
        }
    } else {
        return res.status(401).end('no token')
    }
    req.email = email;
    next();
}