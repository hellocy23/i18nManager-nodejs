import Express from 'express';
import login from './login';
import bodyParser from 'body-parser';
import jwtAuth from '../middleware/jwtAuth';
import { getProjectList, addProject, updateProject, exportProjectI18nResource, deleteProject, exportProjectAllI18nResource } from './I18nProject';
import { queryItem, addItem, updateItemById, deleteItem, batchImportUploadByExcel } from './I18nItem';
const router = Express.Router();

//登录接口
router.get('/login/doLogin', login);

//获取projectList数据
router.get('/i18nproject/getProjectList', [jwtAuth], getProjectList);

//添加新的项目数据
router.post('/i18nproject/addProject', [jwtAuth], addProject);

//更新项目数据
router.put('/i18nproject/updateProject', [jwtAuth], updateProject);

//删除项目数据
router.delete('/i18nproject/deleteProject', [jwtAuth], deleteProject);

//查询I18nItem数据
router.post('/i18nitem/queryItem', [jwtAuth], queryItem);

//添加一条I18nItem数据
router.post('/i18nitem/addItem', [jwtAuth], addItem);

//更新编辑I18nItem数据
router.put('/i18nitem/updateItemById', [jwtAuth], updateItemById);

//删除一条I18nItem数据
router.delete('/i18nitem/deleteItem', [jwtAuth], deleteItem);

//导入excel文件
router.post('/i18nitem/batchImportUploadByExcel', batchImportUploadByExcel);

//导出单个文件
router.get('/i18nitem/exportProjectI18nResource', exportProjectI18nResource);

//导出全部文件
router.get('/i18nitem/exportProjectAllI18nResource', exportProjectAllI18nResource);

export default router;