import mongoose from 'mongoose';
import db from './db';

const projectListSchema = new mongoose.Schema({
    name : { type: String },
    type: { type: String },
    languages: { type: String }
}, { versionKey: false });

export const projectListModel = db.model("projectlists", projectListSchema);