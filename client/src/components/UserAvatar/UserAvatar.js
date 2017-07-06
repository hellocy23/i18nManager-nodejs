import React,{PropTypes} from 'react'
import './UserAvatar.less';

/**
 * 联系人头像
 * 如果有头像显示头像,如果没有头像,把名字的首字母当做头像.
 */
export default class UserAvatar extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        avatar: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func
    };

    onClick = ()=> {
        if (this.props.onClick) {
            this.props.onClick();
        }
    };

    render() {
        var that = this;
        var {avatar,name,className} = that.props;
        className = className || '';

        if (avatar) {
            return <div className={`accountAvatar as-img ${className}`} style={{backgroundImage: `url(${avatar})`}} onClick={this.onClick} ></div>;
        }
        else {
            name = name ||' ';
            var charAvatar = name.charAt(0);
            return (
                <div className={`accountAvatar as-char ${className}`} onClick={this.onClick} >{charAvatar}</div>
            );
        }
    }

}
