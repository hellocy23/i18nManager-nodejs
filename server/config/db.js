import config from './config';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
console.log(`env: ${process.env.NODE_ENV}`);
var db = '';
if (process.env.NODE_ENV === 'production') {
    db = mongoose.connect("mongodb://i18n_runner:mgi18npw1234@127.0.0.1:29999/i18n");
} else {
    db = mongoose.connect("mongodb://localhost:27017/i18n");
}
 
db.connection.on("error", function (error) {
    console.log(`数据库连接失败: ${error}`);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

export default db;
