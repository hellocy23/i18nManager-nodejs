import AjaxUtils from '../utils/AjaxUtils';


//获取数据
export const getProjectListRequest = function () {
    return AjaxUtils.doGetRequest('/i18nproject/getProjectList');
};


//添加数据
export const addProjectRequest = function (data) {
    return AjaxUtils.doPostRequest('/i18nproject/addProject',data);
};

//编辑数据
export const updateProjectRequest = function (data) {
    return AjaxUtils.doPutRequest('/i18nproject/updateProject',data);
};

//删除数据
export const deleteProjectRequest = function (data) {
    return AjaxUtils.doDeleteRequest('/i18nproject/deleteProject',data);
};