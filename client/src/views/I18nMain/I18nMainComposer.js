import React from 'react';
import _ from 'underscore';
import {message} from 'antd';
import I18nMainView from './I18nMainView';
import {getProjectListRequest} from '../../api/I18nProjectApi';
import { queryI18nItemList, deleteI18nItemRequest, addI18nItemRequest, updateI18nItemByIdRequest } from '../../api/I18nItemApi';
import {toMutiValueString, parseMultiValueString} from '../../utils/StringUtils';
import { languageCodes, languageMap } from '../../const';

const CONST_ShowLanguageColumns = "ShowLanguageColumns";

function getShowLanguageColumns() {
    var d = localStorage.getItem(CONST_ShowLanguageColumns);
    if (d) {
        return JSON.parse(d);
    } else {
        return ['source_key', 'value_en', 'value_zh', 'projects']
    }
}

export default class I18nMainComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenDialog_ColumnSelectDialog: false,
            dialogData_ColumnSelectDialog: null,

            isOpenDialog_ModifyOrAddI18nItemDialog: false,
            dialogData_ModifyOrAddI18nItemDialog: null,

            languageCodes: languageCodes,//所有的语言的Code值
            languageMap: languageMap, //所有的语言
            projectList: [],  //所有的项目
            queryCondition: {
                limitStart: 1,
                limitSize: 10
            },
            i18nItemTotal: 0,
            i18nItemList: [],
            selectedRowIsSelectAllPage: false,
            selectedRowKeys: [],//表格中显示的行
            selectedColumnKeys: getShowLanguageColumns(),//表格中显示的列
            refreshLoading: false
        };
    }

    toggleSelectAllPage = (selectedRowIsSelectAllPage)=> {
        this.setState({selectedRowIsSelectAllPage: selectedRowIsSelectAllPage});
    };

    componentWillMount() {
        this.doQueryI18nItemList(this.state.queryCondition);
        getProjectListRequest().then((response)=> {
            var projectList = response.data || [];
            projectList.forEach((val, index)=> {
                val.key = index;
            });
            this.setState({projectList: projectList});
        })
    }

    doQueryI18nItemList = (queryCondition)=> {
        return queryI18nItemList(queryCondition).then((resp)=> {
            var {data,total} = resp.data;
            data.forEach((val, index)=> {
                val.key = index;
                val.projects = parseMultiValueString(val.projects);
            });
            this.setState({
                i18nItemTotal: total,
                i18nItemList: data,
                refreshLoading: false
            });
        });
    };

    refreshQueryI18nItemList = (queryCondition) => {
        this.setState({refreshLoading: true});
        this.doQueryI18nItemList(queryCondition);
    }


    doQueryWithCondition = (newCondition, clearSelectedRows)=> {


        var queryCondition = this.state.queryCondition;

        if (clearSelectedRows) {
            queryCondition = newCondition;
        } else {
            queryCondition = Object.assign(queryCondition, newCondition);
        }


        queryI18nItemList(queryCondition).then((resp)=> {
            var {data,total} = resp.data;
            data.forEach((val, index)=> {
                val.key = index;
                val.projects = parseMultiValueString(val.projects);
            });
            if (clearSelectedRows) {
                this.setState({
                    selectedRowIsSelectAllPage: false,
                    selectedRowKeys: [],

                    queryCondition: queryCondition,
                    i18nItemTotal: total,
                    i18nItemList: data
                });
            } else {
                this.setState({
                    queryCondition: queryCondition,
                    i18nItemTotal: total,
                    i18nItemList: data
                });
            }
        });

    };

    doClearSelectedRows = ()=> {
        this.setState({
            selectedRowIsSelectAllPage: false,
            selectedRowKeys: []
        });
    };


    handleSelectI18nRowChange = (selectedRowKeys)=> {
        this.setState({selectedRowKeys: selectedRowKeys});
    };

    handleToggleDialog = (dialogName, isShow, data)=> {
        var newState = {};
        newState["isOpenDialog_" + dialogName] = isShow;
        newState["dialogData_" + dialogName] = data;
        this.setState(newState);
    };

    handleSubmitSelectShowColumns = (values, finished, dialogName)=> {
        this.doClearSelectedRows();

        var json = JSON.stringify(values);
        localStorage.setItem(CONST_ShowLanguageColumns, json);
        this.setState({selectedColumnKeys: values});
        finished();
    };

    handleDeleteI18nItem = ({source_key})=> {

        this.doClearSelectedRows();
        var requestData = {
            source_key: source_key
        }
        deleteI18nItemRequest(requestData).then(()=> {
            this.doQueryI18nItemList(this.state.queryCondition);
        });
    };


    handleModifyOrAddI18nItem = (values, dialogData, finished)=> {

        this.doClearSelectedRows();

        if (_.isArray(values.checkedList)) {
            var projectString = toMutiValueString(values.checkedList);
            values.projects = projectString;
        }

        if (dialogData) {
            //修改
            updateI18nItemByIdRequest(values).then(()=> {
                message.success('Update I18n Item Successfully');
                this.doQueryI18nItemList(this.state.queryCondition).then(()=>{
                    finished();
                    this.handleToggleDialog("ModifyOrAddI18nItemDialog", false, null);
                });
            },()=>{
                message.error("The unique key is already exists,please check");
                finished();
            });

        } else {
            //新建
            addI18nItemRequest(values).then(()=> {
                message.success('Add I18n Item Successfully');
                this.doQueryI18nItemList(this.state.queryCondition).then(()=>{
                    finished();
                    this.handleToggleDialog("ModifyOrAddI18nItemDialog", false, null);
                });
            },(resp)=>{
                message.error("The unique key is already exists,please check");
                finished();
            });
        }
    };


    render() {
        return (
            <I18nMainView actions={this} store={this.state}/>
        );
    }

}
