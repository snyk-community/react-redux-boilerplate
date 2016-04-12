import React from 'react';

export default class Core extends React.Component {
    static propTypes = {
        children: React.PropTypes.element.isRequired
    }
    static childContextTypes = {
        transport: React.PropTypes.object,
        container: React.PropTypes.object
    }

    getChildContext() {
        return {
            transport: this.props.transport,
            container: this.props.container
        };
    }
    render() {
        return React.Children.only(this.props.children);
    }
}
