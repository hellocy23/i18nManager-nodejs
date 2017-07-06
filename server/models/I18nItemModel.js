import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import db from './db';

const i18nItemSchema = new mongoose.Schema({
    source_key : { type: String }, 
    projects: { type: String },  //在哪些项目中使用
    value_en: { type: String },
    value_ar: { type: String },
    value_es: { type: String },
    value_pt: { type: String },
    value_ru: { type: String },
    value_pl: { type: String },
    value_fa: { type: String },
    value_zh: { type: String },
    value_ms: { type: String },
    value_nl: { type: String },
    value_th: { type: String },
    value_tr: { type: String },
    value_uk: { type: String },
    value_vi: { type: String },
    value_fr: { type: String },
    value_de: { type: String },
    value_it: { type: String },
    value_ja: { type: String },
    value_hi: { type: String },
    value_hu: { type: String },
    value_id: { type: String },
    value_ko: { type: String },
    value_nb: { type: String },
    value_ca: { type: String },
    value_hr: { type: String },
    value_cs: { type: String },
    value_da: { type: String },
    value_fi: { type: String },
    value_el: { type: String },
    value_he: { type: String },
    value_ro: { type: String },
    value_sk: { type: String },
}, { versionKey: false });

i18nItemSchema.plugin(mongoosePaginate);

export const I18nItemModel = db.model("i18nitems", i18nItemSchema);


