import React from 'react';
import {Modal,Button,Form,Input,Transfer} from 'antd';
const FormItem = Form.Item;
import _ from 'underscore';

function createColumnOpt(key, title) {
    return {
        key: key,
        title: title,
        description: title,
        disabled: false
    };
}

//ModifyPassword
export default class ColumnSelectDialog extends React.Component {

    constructor(props) {
        super(props);
        var {store} = props;
        var selectedColumnKeys = store.selectedColumnKeys;
        this.state = {
            tempSelectedKeys: [],
            tempTargetKeys: selectedColumnKeys
        };
    }

    componentWillReceiveProps(nextProps){
        var oldStore = this.props.store;
        var {store} = nextProps;
        if (store.isOpenDialog_ColumnSelectDialog !== oldStore.isOpenDialog_ColumnSelectDialog) {
            //弹出框显示或隐藏的时候数据恢复原状.
            var selectedColumnKeys = store.selectedColumnKeys;
            this.setState({
                tempSelectedKeys: [],
                tempTargetKeys: selectedColumnKeys
            });
        }
    }

    handleOk = ()=> {
        var theForm = this.refs['theForm'];
        var {actions} = this.props;

        var tempTargetKeys = this.state.tempTargetKeys;
        actions.handleSubmitSelectShowColumns(tempTargetKeys, ()=> {
            this.setState({loading: false});
            actions.handleToggleDialog("ColumnSelectDialog", false,null)
        }, 'ColumnSelectDialog');

    };

    handleCancel = ()=> {
        var {actions} = this.props;
        actions.handleToggleDialog("ColumnSelectDialog", false,null)
    };

    handleChange = (nextTargetKeys, direction, moveKeys)=> {
        this.setState({tempTargetKeys: nextTargetKeys});
        //console.log('targetKeys: ', targetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys)=> {
        this.setState({tempSelectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };


    getLanguageDataSource = (languageMap)=> {
        var result = [];
        var keys = _.keys(languageMap);//code name

        result.push(createColumnOpt('source_key', "Key"));
        result.push(createColumnOpt('projects', "Projects"));

        _.forEach(keys, function (key) {
            var value = languageMap[key] || key;
            result.push(createColumnOpt(`value_${key}`, value));
        });

        return result;
    };

    render() {
        var {store,actions} = this.props;
        var visible = store.isOpenDialog_ColumnSelectDialog;
        if (!visible) {
            return null;
        }
        var {languageMap,selectedColumnKeys} = store;
        var languageDataSource = this.getLanguageDataSource(languageMap);
        var state = this.state;

        return (
            <Modal
                visible={visible}
                title="Column Setting"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>Submit </Button>
                    ]}>


                <Transfer className="ColumnSelectDialogTransfer"
                    dataSource={languageDataSource}
                    titles={['Available', 'Selected']}
                    targetKeys={state.tempTargetKeys}
                    selectedKeys={state.tempSelectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    render={item => item.title}
                />


            </Modal>
        );
    }

}
