import React from 'react';
import _ from 'underscore';
import {Card,Input,Table,Upload,message,Icon,Select,Button,Alert,Popconfirm} from 'antd';
const Dragger = Upload.Dragger;
const Search = Input.Search;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

import ColumnSelectDialog from './ColumnSelectDialog';
import ModifyOrAddI18nItemDialog from './ModifyOrAddI18nItemDialog';
import './I18nMainView.less';

function createColumn(title,key,render){
    return {
        title: title,
        dataIndex: key,
        key: key,
        render:render
    };
}

function filterSelectColumns(columns,selectedColumnKeys){
    var result = [];
    _.forEach(columns,(column)=>{
        var key = column.key;
        if(selectedColumnKeys.indexOf(key)>=0){
            result.push(column);
        }
    });
    return result;
}

const constTextDeletePopConfirm = 'Are you sure to delete ?';

export default class I18nMainView extends React.Component {


    constructor(props) {
        super(props);
        this.selectSearchType_defaultValue = null;
        this.selectSearchType_currentValue = null;
    }

    openEditItemDialog=(row)=>{
        var {store,actions} = this.props;
        actions.handleToggleDialog('ModifyOrAddI18nItemDialog',true,row);
    };

    deleteI18nItem=(row)=>{
        var {store,actions} = this.props;
        actions.handleDeleteI18nItem(row);
    };

    getColumns = (onlySearch)=> {
        var that = this;
        var {store,actions} = this.props;
        var columns = [
            createColumn('Key','source_key'),
            createColumn('Projects','projects',function(cell,row){
                return cell;
            })
        ];

        var languageCodes = store.languageCodes;
        var languageMap = store.languageMap;
        _.forEach(languageCodes,function(c){
            var languageName = languageMap[c];
            columns.push(createColumn(languageName,`value_${c}`));
        });

        var selectedColumnKeys = store.selectedColumnKeys;
        columns = filterSelectColumns(columns,selectedColumnKeys);

        if(!onlySearch){
            var operationColumn = createColumn("Operation",'id',function(cell,row){
                return (
                    <div>
                        <span className="linkStyle" onClick={()=>that.openEditItemDialog(row)}>Edit</span>
                        <span className="width10"></span>
                        <Popconfirm placement="left" title={constTextDeletePopConfirm} onConfirm={()=>that.deleteI18nItem(row)} okText="Yes" cancelText="No">
                                <span className="linkStyle">Delete</span>
                        </Popconfirm>
                    </div>
                    )
            });

            operationColumn['width']=100;

            columns.push(operationColumn);
        }


        return columns;
    };

    getPagination = (store, actions)=> {
        var queryCondition = store.queryCondition;
        var i18nItemTotal = store.i18nItemTotal;
        var {limitSize,limitStart} = queryCondition;

        //0 / 10 = 0 + 1 =1
        // var currentNumber = parseInt(limitStart/limitSize) + 1;


        const pagination = {
            total: i18nItemTotal,
            showSizeChanger: true,
            showTotal:function(total){
                return `Total ${total} items`
            },
            current:limitStart,
            pageSize: limitSize,
            onShowSizeChange: (current, pageSize) => {
                var queryCondition = store.queryCondition;
                actions.doQueryWithCondition(Object.assign(queryCondition,{
                    limitStart: current,
                    limitSize: pageSize
                }),true);
            },
            onChange: (current) => {
                var queryCondition = store.queryCondition;
                var pageSize = queryCondition.limitSize;
                actions.doQueryWithCondition(Object.assign(queryCondition,{
                    limitStart: current
                }),true);
            }
        };
        return pagination;
    };


    onSelectRowChange = (selectedRowKeys,ab)=> {
        var {actions} = this.props;
        actions.handleSelectI18nRowChange(selectedRowKeys);
    };

    doSearch = (searchText)=> {
        searchText = searchText || "";
        var searchType = this.selectSearchType_currentValue || this.selectSearchType_defaultValue;
        var {actions} = this.props;
        var queryCondition = {};
        queryCondition[searchType] = searchText.trim();
        queryCondition.searchType = searchType;
        queryCondition['limitStart'] = 1;
        queryCondition['limitSize'] = 10;
        actions.doQueryWithCondition(queryCondition,true);
    };

    onChangeSelectSearchType=(v)=>{
        this.selectSearchType_currentValue = v;
    };

    renderSearchSearchOptions =()=>{
        var columns = this.getColumns(true);

        var options = _.map(columns,function(column){
            return <Option key={column.key} value={column.key}>{column.title}</Option>
        });

        var defaultValue = columns[0] ? columns[0].key : '';
        this.selectSearchType_defaultValue = defaultValue;
        return (
            <Select ref="SelectSearchType" defaultValue={defaultValue}
                    style={{ width: 150 }}
                    showSearch={false}
                    onChange={this.onChangeSelectSearchType}
            >
                {options}
            </Select>
        );

    };


    handleSelectAllPage=()=>{
        var {store,actions} = this.props;
        actions.toggleSelectAllPage(true);
    };

    renderSelectedMessage(actions,store){

        var {i18nItemList,i18nItemTotal,selectedRowKeys,queryCondition,selectedRowIsSelectAllPage} = store;
        var limitSize = queryCondition.limitSize;
        var isSelectPageAll = false;
        if (limitSize === selectedRowKeys.length) {
            isSelectPageAll = true;
        }

        if (!isSelectPageAll) {
            return null;
        }

        if (selectedRowIsSelectAllPage) {
            return (
                <div>
                    <Alert message={
                        <span>
                            {`${i18nItemTotal} items have been selected, `}
                            <span className="linkStyle" onClick={()=>{actions.doClearSelectedRows()}}>{`Clear Selected`}</span>
                        </span>
                } type="info" showIcon/>
                    <div className="clear10"></div>
                </div>
            );
        }

        return (
            <div>
                <Alert message={
                <span>
                    {`${limitSize} items have been selected for the current page, `}
                    <span className="linkStyle" onClick={this.handleSelectAllPage}>{`Select all ${i18nItemTotal} items. `}</span>
                </span>
                } type="info" showIcon/>
                <div className="clear10"></div>
            </div>
        );
    }


    render() {
        var columns = this.getColumns();
        var {store,actions} = this.props;
        var {i18nItemList,selectedRowKeys, refreshLoading} = store;
        var pagination = this.getPagination(store, actions);
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectRowChange
        };
        const initialQueryCondition = {
            limitStart: 1,
            limitSize: 10
        };

        //rowSelection={rowSelection}
        return (
            <div className="I18nMainView">

                Search By : &nbsp;
                {this.renderSearchSearchOptions()}

                <span className="width10"></span>
                <Search placeholder="input search text" onSearch={this.doSearch} style={{width:300}}/>
                
                <div className="floatRight">
                    <Button type="primary" loading={refreshLoading} onClick={()=>{actions.refreshQueryI18nItemList(initialQueryCondition)}}>Refresh</Button>
                    <span className="width20"></span>
                    <Button type="primary" onClick={()=>{actions.handleToggleDialog('ModifyOrAddI18nItemDialog',true,null)}}>Add</Button>
                    <span className="width10"></span>
                    <Button type="primary" onClick={()=>{actions.handleToggleDialog('ColumnSelectDialog',true,null)}}>Settings</Button>
                </div>
                <div className="clear10"></div>

                {this.renderSelectedMessage(actions,store)}

                <Table dataSource={i18nItemList}
                       rowKey="id"
                       columns={columns}
                       pagination={pagination}/>
                <ColumnSelectDialog actions={actions} store={store}/>
                <ModifyOrAddI18nItemDialog actions={actions} store={store}/>
            </div>
        );
    }
}
