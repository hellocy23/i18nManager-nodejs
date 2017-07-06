import React from 'react';
import audiojs from 'audiojs';
var uniqueId = 1;

/**
 * 提供audiojs的React封装
 */
export default class AudioWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.id = "TalkerAudioWrapperUniqueId_"+uniqueId;
        uniqueId ++;
    }

    componentDidMount() {
        var id = this.id;
        setTimeout(function(){
            audiojs.events.ready(function() {
                var dom = document.getElementById(id);
                audiojs.create(dom);
            });
        },10)
    }

    render(){
        var src = this.props.src;
        return (
            <audio ref="audiojs" src={src} id={this.id} >
                Your browser does not support the audio element.
            </audio>
        );
    }

}