var React = require('react');
var Layout = require('./layout');

module.exports = React.createClass({
  onButtonClick: function () {
    alert('I was rendered on server side but I am clickable because of client mounting!');
  },

  render: function () {
    return (
        <Layout title={this.props.title}>
          <h1>Helloworld!</h1>
          <button onClick={this.onButtonClick}>___Click Me___</button>
        </Layout>
        );
  }
});
