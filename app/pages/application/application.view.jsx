import React from 'react';

export default class ApplicationView extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div id="app">
                {this.props.children}
            </div>        
        )
    }
}
