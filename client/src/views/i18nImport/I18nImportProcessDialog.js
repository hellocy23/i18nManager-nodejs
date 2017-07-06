import React from 'react';
import _ from 'underscore';
import {Modal,Button,Form,Input,Radio,Checkbox,Icon} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;




export default class I18nImportProcessDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    handleOk = ()=> {

    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleToggleDialog("I18nImportProcessDialog",false,null);
    };


    render() {
        var {actions,store} = this.props;

        var visible = store.isOpenDialog_I18nImportProcessDialog;

        return (
            <Modal
                className="I18nImportProcessDialog"
                visible={visible}
                title={""}
                width={600}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[]}>
                <div style={{height:50}} >
                    <Icon type="loading" />
                    <div className="uploading-text">
                        Uploading...
                    </div>
                </div>
            </Modal>
        );
    }

}
