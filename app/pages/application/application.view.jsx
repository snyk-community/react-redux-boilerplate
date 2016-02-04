import React from 'react';

class ApplicationView extends React.Component {
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

export default ApplicationView;
