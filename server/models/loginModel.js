import mongoose from 'mongoose';
import db from '../config/db';

const LoginSchema = new mongoose.Schema({
    email : { type: String },
    passwd: { type: Number}
}, { versionKey: false });

const loginModel = db.model("logins", LoginSchema );

export default loginModel;