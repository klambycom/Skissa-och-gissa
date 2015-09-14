var React = require('react');

module.exports = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    text: React.PropTypes.string
  },

  getDefaultProps: function () {
    return { show: false, text: '' }
  },

  render: function () {
    if (!this.props.show) { return <div></div>; }

    return (
        <aside id="site-information">
          <img src="http://lorempixel.com/400/200" alt="" />
          <div id="site-information-text">
            <h1>Vad är skissa och gissa?</h1>
            <p>{this.props.text}</p>
            <p><span className="bold">Nytt!</span> Sidan har fått ny fräsh layout</p>
          </div>
        </aside>
        );
  }
});
