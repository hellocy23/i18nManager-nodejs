import _ from 'underscore';

export const formatJSON = (data) => {
    let resJSON = [];
    let item = {};
    data.forEach((val, index) => {
        item = {
            name: val.name,
            type: val.type,
            languages: val.languages
        }
        resJSON.push(item);
    })
    return resJSON;
}

export const toMutiValueString=(valueList) =>{
    var arr = [];
    _.forEach(valueList,function(v){
        arr.push(v);
    });
    //#23432#3423#3423#
    return "#"+arr.join("#")+"#";
}


export const parseMultiValueString=(multiValueString) =>{
    multiValueString = multiValueString || "";
    var arr1 = multiValueString.split("#");
    var arr2 = [];
    _.forEach(arr1,function(v){
        if(v && v.length > 0 ){
            arr2.push(v);
        }
    });

    return arr2;
}