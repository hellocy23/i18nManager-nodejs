import React from 'react';
import {message} from 'antd';
import I18nImportView from './I18nImportView';
import {getProjectListRequest} from '../../api/I18nProjectApi';
import {getI18nLanguagesRequest,} from '../../api/I18nItemApi';
import {toMutiValueString} from '../../utils/StringUtils';
import { languageCodes, languageMap } from '../../const';


export default class I18nImportComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenDialog_I18nImportProcessDialog: false,
            dialogData_I18nImportProcessDialog: null,
            languageCodes: languageCodes,//所有的语言的Code值
            languageMap: languageMap,//getCodeNameMap
            projectList: []
        };
    }

    componentWillMount() {
        getProjectListRequest().then((response)=> {
            var projectList = response.data || [];
            projectList.forEach((val, index)=> {
                val.key = index;
            });
            this.setState({projectList: projectList});
        })
    }

    handleToggleDialog = (dialogName, isShow, data)=> {
        var newState = {};
        newState["isOpenDialog_" + dialogName] = isShow;
        newState["dialogData_" + dialogName] = data;
        this.setState(newState);
    };

    render() {
        return (
            <I18nImportView actions={this} store={this.state}/>
        );
    }

}
