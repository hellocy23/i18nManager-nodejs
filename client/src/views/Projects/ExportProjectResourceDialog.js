import React from 'react';
import _ from 'underscore';
import {Modal,Button,Form,Input,Radio,Checkbox} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import {parseMultiValueArray} from '../../utils/StringUtils';
import {languageMap} from '../../const';


function toLanguageOptions(map){
    var result = [];
    var keys = _.keys(map);
    _.forEach(keys,function(k){
        var value = map[k];
        result.push({ label: value, value: k });
    });
    return result;
}


const TheForm = Form.create()(React.createClass({
    getInitialState() {
        return {
        };
    },


    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const projectData = this.props.data;
        const projectType = projectData.type;
        const languages = projectData.languages;
        var codeArr = parseMultiValueArray(languages);
        return (
            <Form layout="horizontal">

                {projectType === "Mobile" ? (
                        <FormItem
                            {...formItemLayout}
                            label="Export Format"
                        >
                            {getFieldDecorator('type', {
                                initialValue: "Android"
                            })(
                                <RadioGroup>
                                    <Radio value="Android">Android</Radio>
                                    <Radio value="IOS">IOS</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    ) : null
                }

                <FormItem
                    {...formItemLayout}
                    label="Export Languages"
                >
                    {getFieldDecorator('langCode', {
                        initialValue: codeArr[0]
                    })(
                        <RadioGroup>
                            {
                                _.map(codeArr, function (langCode) {
                                    var langName = languageMap[langCode];
                                    return <Radio key={langCode} value={langCode}>{langName}</Radio>;
                                })
                            }
                        </RadioGroup>
                    )}
                </FormItem>
            </Form>
        );
    }
}));


export default class ExportProjectResourceDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleOk = ()=> {
        var theForm = this.refs['theForm'];
        var {actions,store} = this.props;
        var dialogData = store.dialogData_ExportProjectResourceDialog;
        theForm.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({loading:true});
                actions.handleExportProjectI18n(values,dialogData,()=>{
                    this.setState({loading:false});
                    actions.handleToggleDialog("ExportProjectResourceDialog",false,null);
                },'ExportProjectResourceDialog');
            }
        });
    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleToggleDialog("ExportProjectResourceDialog",false,null);
    };


    render() {
        var {actions,store} = this.props;
        var visible = store.isOpenDialog_ExportProjectResourceDialog;
        var dialogData = store.dialogData_ExportProjectResourceDialog;
        if(!visible){
            return null;
        }

        var languageMap = store.languageMap;

        return (
            <Modal
                visible={visible}
                title={'Export Project I18n Resource'}
                width={600}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>Export </Button>
                    ]}>
                <TheForm ref="theForm" data={dialogData} />
            </Modal>
        );
    }

}
