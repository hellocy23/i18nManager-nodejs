import AjaxUtils from '../utils/AjaxUtils';


export const queryI18nItemList = function (paramMap) { //这玩意直接透传到数据库层.
    return AjaxUtils.doPostRequest('/i18nitem/queryItem', paramMap);
};


export const addI18nItemRequest = function (data) {
    return AjaxUtils.doPostRequest('/i18nitem/addItem', data);
};


export const updateI18nItemByIdRequest = function (data) {
    return AjaxUtils.doPutRequest('/i18nitem/updateItemById', data);
};

export const deleteI18nItemRequest = function (requestData) {
    return AjaxUtils.doDeleteRequest('/i18nitem/deleteItem', requestData);
};


export const getExcelImportI18nUploadURL = function () {
    //后台需要projects/file两个参数
    return AjaxUtils.getRequestURL('/i18nitem/batchImportUploadByExcel'); //返回一个URL字符串
};


export const updateAndroidKeyRequest = function (data) {
    return AjaxUtils.doPostRequest('/i18nitem/updateAndroidKey', data);
};

export const exportProjectI18nResource = function (projectId, langCode, format, options) {
    var optionsJSON = JSON.stringify(options);
    optionsJSON = encodeURIComponent(optionsJSON);
    var url = AjaxUtils.getRequestURL(`/i18nitem/exportProjectI18nResource?projectId=${projectId}&langCode=${langCode}&format=${format}&options=${optionsJSON}`);
    window.open(url);
    return Promise.resolve();
};


export const exportProjectAllI18nResource = function (projectId, langCodes, options) {
    var optionsJSON = JSON.stringify(options);
    optionsJSON = encodeURIComponent(optionsJSON);

    var url = AjaxUtils.getRequestURL(`/i18nitem/exportProjectAllI18nResource?projectId=${projectId}&langCodes=${langCodes}&options=${optionsJSON}`);
    window.open(url);
    return Promise.resolve();
};
