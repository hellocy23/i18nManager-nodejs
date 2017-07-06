import _ from 'underscore';

export function toMutiValueString(valueList){
    var arr = [];
    _.forEach(valueList,function(v){
        arr.push(v);
    });
    //#23432#3423#3423#
    return "#"+arr.join("#")+"#";
}


export function parseMultiValueString(multiValueString){
    multiValueString = multiValueString || "";
    var arr1 = multiValueString.split("#");
    var arr2 = [];
    _.forEach(arr1,function(v){
        if(v && v.length > 0 ){
            arr2.push(v);
        }
    });
    var arr3 = arr2.join(",");

    return arr3;
}

export function parseMultiValueArray(multiValueString){
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

