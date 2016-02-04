import React from 'react';

class Core extends React.Component {

    getChildContext() {
        return {
            transport: this.props.transport
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

Core.propTypes = {
    children: React.PropTypes.element.isRequired
};

Core.childContextTypes = {
    transport: React.PropTypes.object
};

export default Core;
