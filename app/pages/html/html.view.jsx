import React from 'react';

class Html extends React.Component {
    render() {
        const style = (process.env.NODE_ENV === 'production') ? (<link rel="stylesheet" href={this.props.assets.styles.main}/>) : null;
        const vendors = (process.env.NODE_ENV === 'production') ? (<script src={this.props.assets.javascript.vendors} defer></script>) : null;
        let noScript = (process.env.NODE_ENV === 'development') ? (
            <noscript>
                <div style={{
                    'background':'red',
                    'color': '#000',
                    'fontWeight': 'bold',
                    'textAlign': 'center',
                    'position': 'relative',
                    'padding': '10px'
                }}>
                    JavaScript is disabled! Turn on JavaScript.
                </div>
            </noscript>
        ) : null;

        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <title></title>
                    <meta name="viewport" content="width=device-width" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    {style}
                </head>
                <body>
                    {noScript}
                    <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                    <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                    {vendors}
                    <script src={this.props.assets.javascript.main} defer></script>
                </body>
            </html>
        )
    }
}

export default React.createFactory(Html);
