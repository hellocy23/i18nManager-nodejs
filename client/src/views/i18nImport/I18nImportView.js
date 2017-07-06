import React from 'react';
import {Card,Input,Upload,message,Icon,Checkbox,Select,Modal} from 'antd';
import _ from 'underscore';
import {getExcelImportI18nUploadURL} from '../../api/I18nItemApi';
import {toMutiValueString, parseMultiValueArray} from '../../utils/StringUtils';
const Dragger = Upload.Dragger;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

import I18nImportProcessDialog from './I18nImportProcessDialog';
import './I18nImportView.less';


export default class I18nImportView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectLanguage_currentValue: null,
            checkboxGroupValue: []
        };
    }

    getExcelUploadProps=()=>{
        var that = this;

        const props = {
            name: 'file',
            multiple: true,
            showUploadList: true,
            beforeUpload: function (info) {
                var {actions} = that.props;
                actions.handleToggleDialog("I18nImportProcessDialog", true);
                console.log("beforeUpload", info);
                return true;
            },
            data: function () {
                var {projectList} = that.props.store;
                var projectsArray = that.state.checkboxGroupValue;
                var projects = toMutiValueString(projectsArray);
                var languageArray = [];
                for(var project of projectsArray) {
                    for(var item of projectList) {
                        if(item.name === project) {
                            let languages = parseMultiValueArray(item.languages);
                            languageArray = [...languageArray, ...languages];
                        }
                    }
                }
                languageArray = _.union(languageArray);
                return {
                    projects: projects,
                    languageArray: languageArray   //选中项目设定的语言
                }
            },
            action: getExcelImportI18nUploadURL(),
            onChange(info) {
                const {actions} = that.props;
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log("uploading", info.file, info.fileList);
                }
                if (status === 'done') {
                    console.log("uploading done", info.file, info.fileList);
                    actions.handleToggleDialog("I18nImportProcessDialog", false);

                    var response = info.file.response || {};
                    var respMessage = response.message;

                    if ("DuplicateKey" === respMessage) {
                        //上传失败
                        var respData = response.data || [];
                        Modal.error({
                            title: 'Duplicate Key !',
                            content: (
                                <div className="DuplicateKeyItemList">
                                    {
                                        _.map(respData, function (d) {
                                            return <div className="DuplicateKeyItem">{d}</div>
                                        })
                                    }
                                </div>
                            )
                        });

                    } else {
                        message.success(`${info.file.name} file uploaded successfully.`);
                    }
                } else if (status === 'error') {
                    actions.handleToggleDialog("I18nImportProcessDialog", false);
                    console.log("uploading error", info.file, info.fileList);
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
        };

        return props;
    };

    getProjectCheckboxOptions = ()=> {

        var {projectList} = this.props.store;

        var result = [];

        _.forEach(projectList, function (p) {
            result.push({
                label: p.name,
                value: p.name
            });
        });
        return result;
    };

    onChangeCheckboxGroup = (checkboxGroupValue)=> {
        this.setState({checkboxGroupValue: checkboxGroupValue});
    };

    render() {
        var {actions,store} = this.props;
        var excelUploadProps = this.getExcelUploadProps();

        var projectCheckboxOptions = this.getProjectCheckboxOptions();
        var selectLanguage_currentValue = this.state.selectLanguage_currentValue;
        var isExcelUploadDraggerDisabled = !this.state.checkboxGroupValue || this.state.checkboxGroupValue.length === 0;
        return (
            <div className="I18nImportView">
                <Card>
                    <div>
                        <div className="form">
                            <div className="row">
                                <div className="clear20"></div>
                                <div className="title">Import to Projects :</div>
                                <div className="content">
                                    <CheckboxGroup options={projectCheckboxOptions}
                                                    value={this.state.checkboxGroupValue}
                                                    onChange={this.onChangeCheckboxGroup}/>
                                </div>
                                <div className="clear20"></div>
                                <div className="clear20"></div>
                            </div>

                        </div>


                        <Dragger {...excelUploadProps} disabled={isExcelUploadDraggerDisabled}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">Click or drag <span style={{color:'red'}}>.xls/.xlsx</span> file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                        </Dragger>
                    </div>
                </Card>
                <I18nImportProcessDialog store={store} actions={actions}/>

            </div>

        );
    }
}
