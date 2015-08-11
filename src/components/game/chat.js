var React = require('react');
var Cryons = require('./cryons');

module.exports = React.createClass({
  render: function () {
    return (
        <div id="chat-container">
          <div id="game-user-info">
            <div className="players">TODO</div>
          </div>

          <div id="chat">
            <div id="chat-messages"></div>
            <div id="chat-input">
              <img src="/placeholder.png" alt="TODO" />
              <input type="text" placeholder="Gissa på ett ord.." autofocus />
            </div>
          </div>

          <Cryons />
        </div>
        );
  }
});
