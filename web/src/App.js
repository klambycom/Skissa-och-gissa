import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import DrawingArea from "./DrawingArea";
import Chat from "./Chat";
import Message from "./Message";
import Websocket from "./Websocket";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: `Christian (${Math.random()})`,
      users: [],
      messages: []
    };
  }

  handleMessage(type, message) {
    switch(type) {
      case "message:new":
        this.setState({messages: this.state.messages.concat([Message.Text(message)])});
        break;

      default:
        // Nothing
    }
  }

  handleInput(message) {
    switch(message) {
      case "/users":
        this.setState({
          messages: this.state.messages.concat([
            Message.Users({type: "users", body: "All users", users: this.state.users})
          ])
        });
        break;

      default:
        this.ws.send("message:new", message);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <div>{this.state.users.length} user online</div>
        </div>
        <div className="App-intro">
          <Websocket
            ref={(ref) => this.ws = ref}
            url="ws://localhost:4000/socket"
            room="room:lobby"
            types={["message:new"]}
            user={this.state.user}
            onMessage={(type, msg) => this.handleMessage(type, msg)}
            onPresence={(users) => this.setState({users})}
          />
          <Chat
            messages={this.state.messages}
            onMessage={(text) => this.handleInput(text)}
          />
          <DrawingArea />
        </div>
      </div>
    );
  }
}

export default App;
