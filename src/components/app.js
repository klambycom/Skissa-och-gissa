var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var State = require('react-router').State;
var Layout = require('./layout');
var Flash = require('./flash');

module.exports = React.createClass({
  displayName: 'App',

  mixins: [ State ],

  _testPath: function () {
    return /\/game\//.test(this.context.router.getCurrentPathname());
  },

  _cssPaths: function () {
    return [
      this.props.css_path,
      this.props.fontAwesome_path,
      'https://fonts.googleapis.com/css?family=Lora|Raleway:400,700'
    ];
  },

  _jsPaths: function () {
    return [this.props.js_path];
  },

  render: function () {
    return (
        <Layout
          inGame={this._testPath()}
          title={this.props.page_title}
          description={this.props.page_description}
          css={this._cssPaths()}
          js={this._jsPaths()}
          user={this.props.user}>

          <Flash messages={this.props.message} />
          <RouteHandler {...this.props} />
        </Layout>
        );
  }
});
