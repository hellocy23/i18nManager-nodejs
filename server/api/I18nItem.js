import { I18nItemModel } from '../models/I18nItemModel';
import { projectListModel } from '../models/I18nProjectModel';
import multer from 'multer'; // 上传模块
import xlstojson from "xls-to-json-lc";
import xlsxtojson from "xlsx-to-json-depfix";
import fsExtra from 'fs-extra';
import path from 'path';
import _ from 'underscore';
import languageMap from '../const';
import {toMutiValueString, parseMultiValueString} from '../StringUtils';

//查询I18nItem数据
export const queryItem = (req, res, next) => {
    const { limitStart, limitSize, searchType } = req.body;
    const queryConditons = {};
    if (searchType) {
        const searchTypeKey = searchType;
        const searchTypeValue = req.body[searchTypeKey];
        queryConditons[searchTypeKey] = new RegExp(searchTypeValue);
    }

    I18nItemModel.paginate(queryConditons, { page: limitStart, limit: limitSize }, function (err, result) {
        if (err) {
            return res.status(500).end('server error');
        } else {
            const { docs, total } = result;
            const queryResult = {
                data: docs,
                total: total
            }
            return res.status(200).json(queryResult);
        }
    });

};

//添加一条I18nItem数据
export const addItem = (req, res, next) => {
    const { source_key, projects, selectLanguage } = req.body;
    const value_key = `value_${selectLanguage}`;
    const value_data = req.body[value_key];
    const item_data = {
        source_key: source_key,
        projects: projects
    }
    item_data[value_key] = value_data;
    const conditions = { source_key: source_key };

    I18nItemModel.findOne(conditions, (error, data) => {
        if (error) {
            return res.status(500).end('server error');
        } else if (data) {
            I18nItemModel.update(conditions, item_data, function (error) {
                if (error) {
                    return res.status(500).end('server error');
                } else {
                    return res.status(200).end('Update success!');
                }
            });
        } else {
            I18nItemModel.create(item_data, (error, data) => {
                if (error) {
                    return res.status(500).end('server error');
                } else {
                    return res.status(200).end('add I18nItem success!');
                }

            });
        }
    })

};


//更新编辑I18nItem数据
export const updateItemById = (req, res, next) => {
    const reqValues = req.body;
    const { source_key, new_source_key, projects } = reqValues;
    const item_data = {
        source_key: new_source_key,
        projects: projects
    }
    for (let childKey in reqValues) {
        if(childKey.indexOf('value_') != -1) {
            let value_data = reqValues[childKey];
            item_data[childKey] = value_data;
        }
    }
    const conditions = { source_key: source_key };
    I18nItemModel.update(conditions, item_data, function (error) {
        if (error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Update success!');
        }
    });

};

//删除一条I18nItem数据
export const deleteItem = (req, res, next) => {
    const { source_key } = req.body;
    const conditions = { source_key: source_key };

    I18nItemModel.remove(conditions, function (error) {
        if (error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Delete success!');
        }
    });

};

const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './server/public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

// 实例化上传模块(前端使用参数名为file)
const upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

//将表格json数据存到数据库
const importDataToMongodb = (req, res, projects, languageArray, result) => {
    for (var value of result) {
        var key = value.key;
        var languages = languageArray.split(",");
        var conditions = { source_key: key };
        var item_data = {
            source_key: key
        }

        //所选项目包含几种语言就导入几种语言
        for (var childKey in value) {
            if(childKey != "key") {
                for(let language of languages) {
                    let languageCode = languageMap[childKey];
                    if(language === languageCode) {
                        let value_key = `value_${languageCode}`;
                        let value_data = value[childKey];
                        item_data[value_key] = value_data;
                    }
                }
            }
        }

        (function(item_data, projects, conditions) {
            I18nItemModel.findOne(conditions, (error, data) => {
                if (error) {
                    return res.status(500).end('server error');
                } else if (data) {
                    //存在该source_key，先删除该文档，再新建文档，根据项目设定的语言种类导入
                    const oldProjectsArray = parseMultiValueString(data._doc.projects);
                    const addProjectsArray = parseMultiValueString(projects);
                    const newProjectsArray = _.union(oldProjectsArray, addProjectsArray);
                    item_data.projects = toMutiValueString(newProjectsArray);
                    I18nItemModel.update(conditions, {$set: item_data}, (err)=> {
                        if(err) {
                            console.log(err);
                            return res.status(500).end('server error');
                        }
                    })
                    
                } else {
                    //不存在该source_key,则新增文档
                    item_data.projects = projects;
                    I18nItemModel.create(item_data, (error, data) => {
                        if (error) {
                            return res.status(500).end('server error');
                        }
                    });
                }
            })
        })(item_data, projects, conditions);

    }
}




//导入excel文件
export const batchImportUploadByExcel = (req, res, next) => {
    var exceltojson;
    //每次导入前先清空文件夹
    const emptyPath = path.join(__dirname, '../public/uploads');
    fsExtra.emptyDir(emptyPath, err => {
        if (err) {
            return console.error(err)
        } 
        console.log('empty uploads success!');
        upload(req, res, function (err) {
            const projects = req.body.projects;
            const languageArray = req.body.languageArray;
            if (err) {
                return res.status(500).end('server error');
            }
            /** Multer gives us file info in req.file object */
            if (!req.file) {
                return res.status(404).end('No file passed');
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders: true
                }, function (err, result) {
                    if (err) {
                        return res.status(404).json({err_desc: err});
                    }
                    importDataToMongodb(req, res, projects, languageArray, result);
                    return res.status(200).end('import excel success!');
                    
                });
            } catch (e) {
                res.status(404).json({ err_desc: "Corupted excel file" });
            }
        })
    })



};

