import React from 'react';
import {message} from 'antd';
import {getProjectListRequest, addProjectRequest, updateProjectRequest, deleteProjectRequest} from '../../api/I18nProjectApi';
import {getI18nLanguagesRequest, exportProjectI18nResource, exportProjectAllI18nResource} from '../../api/I18nItemApi';
import {toMutiValueString, parseMultiValueArray} from '../../utils/StringUtils';
import ProjectsView from './ProjectsView';

export default class ProjectsComposer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenDialog_ModifyOrAddProjectDialog: false,
            dialogData_ModifyOrAddProjectDialog:null,

            isOpenDialog_ExportProjectResourceDialog: false,
            dialogData_ExportProjectResourceDialog:null,//{}
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

    refreshProjectList=()=>{
        return getProjectListRequest().then((response)=>{
            var projectList = response.data || [];
            projectList.forEach((val, index)=> {
                val.key = index;
            });
            this.setState({projectList: projectList});
            return response;
        });
    };

    handleToggleDialog = (dialogName, isShow, data)=> {
        var newState = {};
        newState["isOpenDialog_" + dialogName] = isShow;
        newState["dialogData_" + dialogName] = data;
        this.setState(newState);
    };


    handleModifyOrAddProject = (values, dialogData,finished, stopLoading, dialogName)=>{
        var languages = values.languages;
        var type = values.type;
        var name = values.name;
        languages = toMutiValueString(languages);

        var newData = {
            name:name,
            type:type,
            languages:languages
        };

        var promiseHandler = null;
        if(dialogData){
            newData.id = dialogData.name;
            promiseHandler = updateProjectRequest(newData);
        }else {
            promiseHandler =  addProjectRequest(newData);
        }

        promiseHandler.then((response)=>{
            this.refreshProjectList().then(()=>{
                finished();
            });
            message.success("Save Project Successfully");
        },(error)=>{
            if(error.status == 400) {
                stopLoading();
                message.error("The project name can not be repeated");
            } else {
                finished();
            }
            
        });

    };


    handleExportProjectI18n=(values, dialogData,finished)=>{

        var projectId,langCode,format;

        langCode = values.langCode;
        projectId = dialogData.name;
        format = values.type;
        if(dialogData.type!=='Mobile'){
            format = dialogData.type;
        }

        exportProjectI18nResource(projectId,langCode,format);

        finished();
    };


    handleExportProjectAllI18nResource=(row)=>{
        var projectId = row.name;
        var langCodes = parseMultiValueArray(row.languages);
        exportProjectAllI18nResource(projectId, langCodes);
    };

    handleDeleteProject=(row)=> {
        let  projectId = row.name;
        let requestJson = {
            projectId: projectId
        }
        deleteProjectRequest(requestJson).then((response)=> {
            if(response.status === 200) {
                message.success("Delete Project Successfully");
                this.refreshProjectList();
            }
            
        })
    }

    render() {
        return (
            <ProjectsView actions={this} store={this.state}/>
        );
    }

}
