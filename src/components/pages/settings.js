var React = require('react');
var Layout = require('./layout');

module.exports = React.createClass({
  render: function () {
    return (
        <Layout {...this.props}>
          Inga settings än!
        </Layout>
        );
  }
});
