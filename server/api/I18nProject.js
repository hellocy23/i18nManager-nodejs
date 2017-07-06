import { projectListModel } from '../Models/I18nProjectModel';
import { I18nItemModel } from '../Models/I18nItemModel';
import fs from 'fs';
import path from 'path';
import zipFolder from 'zip-folder';
import _ from 'underscore';
import fsExtra from 'fs-extra';
import { formatJSON, parseMultiValueString, toMutiValueString } from '../StringUtils';

//获取projectList数据
export const getProjectList = (req, res, next) => {
    projectListModel.find({}, function (error, data) {
        if (error) {
            return res.status(500).end('server error');
        } else {
            if (data) {

                const resJSON = formatJSON(data);
                return res.status(200).json(resJSON);
            } else {
                return res.status(200).json({});
            }
        }

    });
};

//添加新的项目数据
export const addProject = (req, res, next) => {
    const reqData = req.body;
    const name = reqData.name;
    projectListModel.findOne({ name: name }, (error, data) => {
        if (error) {
            return res.status(500).end('server error');
        } else if (data) {
            return res.status(400).end('The project name can not be repeated');
        } else {
            projectListModel.create(reqData, (error, data) => {
                if (error) {
                    return res.status(500).end('server error');
                } else {
                    return res.status(200).end('add project success!');
                }

            });
        }
    })

};

//更新项目数据
export const updateProject = (req, res, next) => {
    const { name, id, languages, type } = req.body;
    const conditions = { name: id };
    const updateJson = {
        name: name,
        type: type,
        languages: languages
    }
    const update = { $set: updateJson };
    projectListModel.update(conditions, update, (error) => {
        if (error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Update success!');
        }
    });

};

//删除项目数据
export const deleteProject = (req, res, next) => {
    const { projectId } = req.body;
    let conditions = { name: projectId };
    projectListModel.remove(conditions, (error, data) => {
        if (error) {
            return res.status(500).end('server error');
        } else {
            return res.status(200).end('Delete Project Successfully');
        }
    })

    const I18nItemConditions = {
        projects: new RegExp(projectId),
    }
    //删除该项目后，同时删除item列表里projects对应的该项目
    //先查找所有包含该项目的文档，然后通过循环文档，更新文档里的projects
    I18nItemModel.find(I18nItemConditions, (error, docs) => {
        if (error) {
            console.log(error);
        } else if (docs) {
            for (let item of docs) {
                const { source_key, projects } = item._doc;
                const projectsArray = parseMultiValueString(projects);
                let newProjects = _.without(projectsArray, projectId);
                newProjects = toMutiValueString(newProjects);
                const updataDate = { projects: newProjects };
                I18nItemModel.update({ source_key: source_key }, { $set: updataDate }, (error, data) => {
                    if (error) {
                        console.log(error);
                    }
                })

            }
        }

    })

};

//导出单个文件
export const exportProjectI18nResource = (req, res, next) => {
    const { projectId, langCode, format } = req.query;
    const value_key = `value_${langCode}`;
    const conditions = {
        projects: new RegExp(projectId),
    }
    const writeOrDownload = 'download';
    I18nItemModel.find(conditions, (error, docs) => {
        if (format === 'Android') {
            exportXml(req, res, docs, langCode, value_key, writeOrDownload);
        } else if (format === 'IOS') {
            exportString(req, res, docs, langCode, value_key, writeOrDownload);
        }
    })

};

//导出xml文件
const exportXml = (req, res, docs, langCode, value_key, writeOrDownload) => {
    const file = path.join(__dirname, `../public/export/Android/string_${langCode}.xml`);
    let content = '';
    for (let value of docs) {
        const { source_key } = value;
        let value_data = value[value_key];
        if(value_data) {
            let formatValue = formatXmlValue(value_data);
            const smath = formatValue.match(/%s/g); //判断value值是否含有多个%s和%d,如果含有两个以上，则添加属性formatted="false"
            const dmath = formatValue.match(/%d/g);
            let sdlength = 0;
            if(smath) {
                sdlength += smath.length;
            }
            if(dmath) {
                sdlength += dmath.length;
            }
            if(sdlength > 1) {
                content += `${" "}${" "}${" "}${" "}<string name="${source_key}" formatted="false">${formatValue}</string>\r\n`;
            } else {
                content += `${" "}${" "}${" "}${" "}<string name="${source_key}">${formatValue}</string>\r\n`;
            }
        }
        
    }
    const data = `<?xml version="1.0" encoding="utf-8"?>\r\n<resources>\r\n${content}</resources>`;
    if (writeOrDownload === 'download') {
        writeDonwloadFile(res, file, data);
    } else {
        writeFile(res, file, data);
    }

}

//替换xml文件占位符
const formatXmlValue = (value) => {
    let value_data = value.replace(/&/g, "&amp;").replace(/%@/g, "%s").replace(/\.\.\./g, "&#8230;").replace(/\'/g, "\\'").replace(/\\U200E/g, "\\u200E").replace(/\\U200F/g, "\\u200F");
    return value_data;
}

//导出string文件
const exportString = (req, res, docs, langCode, value_key, writeOrDownload) => {
    const file = path.join(__dirname, `../public/export/IOS/Localizable_${langCode}.strings`);
    let content = '';
    for (let value of docs) {
        const { source_key } = value;
        const value_data = value[value_key];
        if(value_data) {
            content += `${" "}${" "}${" "}${" "}"${source_key}" = "${value_data}";\r\n`;
        }
    }
    const data = `{\r\n${content}}`;
    if (writeOrDownload === 'download') {
        writeDonwloadFile(res, file, data);
    } else {
        writeFile(res, file, data);
    }

}

//写入文件流并下载该文件
const writeDonwloadFile = (res, file, data) => {
    let ws = fs.createWriteStream(file);
    fs.writeFile(file, data, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('写入成功');
            res.download(file, function (err) {
                if (err) {
                    console.log("Error");
                    console.log(err);
                } else {
                    console.log("download Success");
                }
            });
        }
    });

}

//仅写入文件流
const writeFile = (res, file, data) => {
    let ws = fs.createWriteStream(file);
    fs.writeFile(file, data, (err) => {
        if (err) {
            console.error(err);
        }
    });
}


//导出全部文件
export const exportProjectAllI18nResource = (req, res, next) => {
    const { projectId, langCodes } = req.query;
    const langCodesArray = langCodes.split(",");
    const conditions = {
        projects: new RegExp(projectId),
    }
    I18nItemModel.find(conditions, (error, docs) => {
        //每次导出前先清空文件夹
        const emptyAndroidPath = path.join(__dirname, '../public/export/Android');
        const emptyIOSPath = path.join(__dirname, '../public/export/IOS');
        fsExtra.emptyDir(emptyAndroidPath, err => {
            if (err) {
                return console.error(err);
            }
            console.log('empty Android success!');
            fsExtra.emptyDir(emptyIOSPath, err => {
                if (err) {
                    return console.error(err);
                }
                console.log('empty IOS success!');
                for (let langCode of langCodesArray) { //导出该项目设置的所有语言，而不是数据库里的所有语言
                    const value_key = `value_${langCode}`;
                    const writeOrDownload = 'write';
                    exportXml(req, res, docs, langCode, value_key, writeOrDownload);
                    exportString(req, res, docs, langCode, value_key, writeOrDownload);
                }
                const source_path = path.join(__dirname, '../public/export');
                const target_path = path.join(__dirname, '../public/exportZip/exportAllI18nResource.zip');
                zipFolder(source_path, target_path, function (err) {  //压缩文件夹
                    if (err) {
                        console.log(err);
                    } else {
                        res.download(target_path, function (err) {  //客户端下载文件
                            if (err) {
                                console.log("Error");
                                console.log(err);
                            } else {
                                console.log("download exportAllI18nResource.zip Success");
                            }
                        });
                    }
                });
            })
        })

    })

};