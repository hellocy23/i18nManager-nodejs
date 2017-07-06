/**
 * 获取图片缩略图的路径
 */
export const getThumbUrl = function (url, width, heigth) {
    if (!url) {
        return "";
    }
    try {
        var index = url.lastIndexOf('.');
        if (index <= 0) return url;
        return url.substr(0, index) + "_" + width + "x" + heigth + url.substr(index);
    } catch (e) {
        return url;
    }
};


export const getThumbUrl40 = function (url) {
    return getThumbUrl(url, 40, 40);
};
export const getThumbUrl70 = function (url) {
    return getThumbUrl(url, 70, 70);
};
