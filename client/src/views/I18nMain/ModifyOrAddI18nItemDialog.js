import React from 'react';
import {Modal,Button,Form,Input,Transfer,Checkbox,Radio,Select,Row, Col, message} from 'antd';
import {parseMultiValueString} from '../../utils/StringUtils';
const FormItem = Form.Item;
import _ from 'underscore';
import languageMap from '../../const';
import {toMutiValueString, parseMultiValueArray} from '../../utils/StringUtils';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

//根据选中的项目来决定语言选项展示几种语言，使添加或者编辑的时候与项目设置的语言保持统一
const toLanguageSelectOptions=(store, checkedList) => {
    const {projectList, languageMap, languageCodes} = store;
    let languageArray = [];
    const checkedLength = checkedList.length;
    if(checkedLength !== 0) {
        for(let project of checkedList) {
            for(let value of projectList) {
                if(value.name === project) {
                    let languages = parseMultiValueArray(value.languages);
                    languageArray = [...languageArray, ...languages];
                }
            }
        }
        languageArray = _.union(languageArray);
        
    } else {
        languageArray = languageCodes;
    }   
    
    return _.map(languageArray, function (code) {
        var langName = languageMap[code];
        return <Select.Option key={code} value={code}>{langName}</Select.Option>;
    });

    
}

export class TheForm extends React.Component {

    constructor(props) {
        super(props);
        var {store, data} = this.props;
        data = data || {};
        const projectsArray = data.projects? data.projects.split(","): [];
        const source_key = data.source_key;
        this.state = _.extend({}, data, {
            selectLanguage: 'en',
            checkedList: projectsArray,
            new_source_key: source_key
        });
    }

    handleChangeSelectLanguage = (value)=> {
        this.setState({selectLanguage: value});
    };

    handleChangeLanguageValue = (e)=> {
        var value = (e.target.value);
        var newState = {};
        newState['value_' + this.state.selectLanguage] = value;
        this.setState(newState);
    };

    handleChangeSourceKey = (e)=> {
        this.setState({new_source_key: e.target.value});
    }

    handleChangeCheckbox = (e)=> {
        let checkboxVal = e.target.value;
        let checked = e.target.checked;
        let checkedList = this.state.checkedList;
        if(checked) {
            checkedList.push(checkboxVal);
            this.setState({checkedList: checkedList});
        } else {
            let listIndex = checkedList.indexOf(checkboxVal);
            checkedList.splice(listIndex, 1);
            this.setState({checkedList: checkedList});
        }
    }

    getCurStateValue = ()=> {
        return this.state;
    };

    render() {

        var that = this;
        var {state,props} = that;
        var {store,actions} = props;
        const projectList = store.projectList;
        const {new_source_key, checkedList} = state;
        return (
            <Row className="theForm">
                <Col className="text" span={6} style={{"textAlign":"right"}}>
                    Key : &nbsp;
                </Col>
                <Col span={18}>
                    <Input style={{width:300}} value={new_source_key} onChange={this.handleChangeSourceKey} />
                    <span className="redStar">*</span>
                </Col>
                <div className="clear20"></div>
                <Col span={6} style={{"textAlign":"right"}}>
                    Projects : &nbsp;
                </Col>
                <Col span={18}>
                     {
                        projectList.map((item, index) => {
                            const itemName = item.name;
                            return (
                                <Checkbox key={index} value={itemName} checked={checkedList.indexOf(itemName) != -1? true: false} onChange={this.handleChangeCheckbox}>{itemName}</Checkbox>
                            )
                        })
                     }
                </Col>
                <div className="clear20"></div>
                <Col className="text" span={6} style={{"textAlign":"right"}}>
                    Language : &nbsp;
                </Col>
                <Col span={18}>
                    <Select style={{ width: 120 }}
                            value={state.selectLanguage}
                            onChange={this.handleChangeSelectLanguage}>
                        {toLanguageSelectOptions(store, checkedList)}
                    </Select>
                </Col>
                <div className="clear20"></div>
                <Col span={6} style={{"textAlign":"right"}}>
                    value : &nbsp;
                </Col>
                <Col span={18}>
                    <Input type="textarea"
                           placeholder=""
                           onChange={this.handleChangeLanguageValue}
                           value={state['value_'+state.selectLanguage] || ''}
                           style={{ width:300 }}
                           autosize={{ minRows: 3, maxRows: 6 }}/>
                </Col>
            </Row>
        );
    }

}


export default class ModifyOrAddI18nItemDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleOk = ()=> {
        var theForm = this.refs['theForm'];
        var {actions,store} = this.props;
        var dialogData = store.dialogData_ModifyOrAddI18nItemDialog;
        var formValue = theForm.getCurStateValue();
        var source_key = formValue.new_source_key;
        console.log('Received values of form: ', formValue);
        if (source_key) {
            this.setState({loading: true});
            actions.handleModifyOrAddI18nItem(formValue, dialogData, ()=> {
                this.setState({loading: false});
            }, 'ModifyOrAddI18nItemDialog');
        } else {
            message.error("Please input the source key!");
        }
        
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleToggleDialog("ModifyOrAddI18nItemDialog", false, null)
    };


    render() {
        var {store,actions} = this.props;
        var visible = store.isOpenDialog_ModifyOrAddI18nItemDialog;
        var dialogData = store.dialogData_ModifyOrAddI18nItemDialog;
        if (!visible) {
            return null;
        }
        var state = this.state;
        var title = dialogData ? "Edit I18n Item" : "Add I18n Item";

        var submitBtnText = dialogData ? "Update I18n" : "Add I18n";

        return (
            <Modal
                className="ModifyOrAddI18nItemDialog"
                visible={visible}
                title={title}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>{submitBtnText}</Button>
                    ]}>

                <TheForm ref="theForm" store={store} data={dialogData} ></TheForm>
            </Modal>
        );
    }

}
