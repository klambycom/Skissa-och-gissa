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

  addMessage(message) {
    this.setState({messages: this.state.messages.concat([message])});
  }

  handleMessage(type, message) {
    switch(type) {
      case "message:new":
        this.addMessage(Message.Text(message));
        break;

      default:
        // Do nothing!
    }
  }

  handleCommand(command, text) {
    switch(command) {
      case "users":
        this.addMessage(<Message.Users body="All users" users={this.state.users} />);
        break;

      default:
        this.addMessage(<Message.MissingCommand command={command} text={text} />);
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
            onMessage={(text) => this.ws.send("message:new", text)}
            onCommand={(command, text) => this.handleCommand(command, text)}
          />
          <DrawingArea />
        </div>
      </div>
    );
  }
}

export default App;
