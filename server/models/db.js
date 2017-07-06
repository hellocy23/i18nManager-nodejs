import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const db = mongoose.connect("mongodb://localhost:27017/i18n");

db.connection.on("error", function (error) {
    console.log(`数据库连接失败: ${error}`);
});
db.connection.on("open", function () {
    console.log("------数据库连接成功！------");
});

export default db;
