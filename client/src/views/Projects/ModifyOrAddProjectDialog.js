import React from 'react';
import _ from 'underscore';
import {Modal,Button,Form,Input,Radio,Checkbox,Row,Col,message} from 'antd';
import {parseMultiValueString} from '../../utils/StringUtils';
import language from '../../const';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;


export class TheForm extends React.Component {
    constructor(props) {
        super(props);
        var dialogData = this.props.dialogData || {};
        var initialValueLanguages = null;
        var languages = dialogData.languages || "";
        var languagesArray = parseMultiValueString(languages);
        languagesArray = languagesArray? languagesArray.split(","): [];
        if(languagesArray.length > 0){
            initialValueLanguages = languagesArray;
        }
        this.state ={
            initialValueName:dialogData.name || '',
            initialValueType:dialogData.type || 'Mobile',
            initialValueLanguages:initialValueLanguages || ['en'],
            checkedList: initialValueLanguages || ['en']
        };
    }

    onChangeValueName(e) {
        this.setState({initialValueName: e.target.value});
    }

    onChangeCheckboxGroup(e){
        let checkboxVal = e.target.value;
        let checked = e.target.checked;
        let checkedList = this.state.checkedList;
        if(checked) {
            checkedList.push(checkboxVal);
            this.setState({
                checkedList: checkedList,
                initialValueLanguages: checkedList
            });
        } else {
            let listIndex = checkedList.indexOf(checkboxVal);
            checkedList.splice(listIndex, 1);
            this.setState({
                checkedList: checkedList,
                initialValueLanguages: checkedList
            });
        }
    }

    onChangeRadioGroup(e){
        this.setState({initialValueType: e.target.value});
    }

    getCurStateValue() {
        return this.state;
    }

    render() {
        const dialogData = this.props.dialogData;
        const {initialValueName, initialValueType, initialValueLanguages, checkedList} = this.state;
        return (
            <Row className="ProjectForm">
                <Col className="text" span={6} style={{"textAlign":"right"}}>
                    Project Name : &nbsp;
                </Col>
                <Col span={18}>
                    <Input style={{width:300}} value={initialValueName} onChange={this.onChangeValueName.bind(this)} />
                    <span className="redStar">*</span>
                </Col>
                <div className="clear20"></div>

                <Col className="text" span={6} style={{"textAlign":"right"}}>
                    Project Name : &nbsp;
                </Col>
                <Col span={18}>
                    <RadioGroup onChange={this.onChangeRadioGroup.bind(this)} value={initialValueType}>
                        <Radio value="Mobile">Mobile</Radio>
                        <Radio value="Web">Web</Radio>
                        <Radio value="Desktop">Desktop</Radio>
                    </RadioGroup>
                </Col>
                <div className="clear20"></div>

                <Col span={6} style={{"textAlign":"right"}}>
                    Project Languages : &nbsp;
                </Col>
                <Col span={18}>
                     {
                        language.map((item, index) => {
                            const {label, value} = item;
                            return (
                                <Checkbox key={index} value={value} checked={checkedList.indexOf(value) != -1? true: false} onChange={this.onChangeCheckboxGroup.bind(this)}>{label}</Checkbox>
                            )
                        })
                     }
                </Col>
            </Row>
        );
    }
}


//ModifyOrAddProjectDialog
export default class ModifyOrAddProjectDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleOk = ()=> {
        var ProjectForm = this.refs['ProjectForm'];
        var {actions,store} = this.props;
        var formValue = ProjectForm.getCurStateValue();
        var projectName = formValue.initialValueName;
        if (projectName) {
            var dialogData = store.dialogData_ModifyOrAddProjectDialog;
            console.log('Received values of form: ', formValue);
            this.setState({loading: true});
            const value = {
                name: formValue.initialValueName,
                type: formValue.initialValueType,
                languages: formValue.initialValueLanguages
            }
            actions.handleModifyOrAddProject(value,dialogData,()=>{
                this.setState({loading:false});
                actions.handleToggleDialog("ModifyOrAddProjectDialog",false,null);
            },()=> {
                this.setState({loading:false}); 
            }, 'ModifyOrAddProjectDialog');
        } else {
            message.error("Please input the project name!");
        }
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleToggleDialog("ModifyOrAddProjectDialog",false,null);
    };


    render() {
        var {actions,store} = this.props;
        var visible = store.isOpenDialog_ModifyOrAddProjectDialog;
        var dialogData = store.dialogData_ModifyOrAddProjectDialog;
        if(!visible){
            return null;
        }

        var title = "Add Project";
        if(dialogData){
            title = "Edit Project";
        }

        return (
            <Modal
                visible={visible}
                title={title}
                width={600}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>Submit </Button>
                    ]}>
                <TheForm ref="ProjectForm" dialogData={dialogData} store={store} actions={actions}></TheForm>
            </Modal>
        );
    }

}
