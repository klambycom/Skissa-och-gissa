import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import DrawingArea from "./DrawingArea";
import Chat from "./Chat";
import UserList from "./UserList";
import Websocket from "./Websocket";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: `Christian (${Math.random()})`,
      users: [],
      messages: [
        {body: "foo"},
        {body: "bar"},
        {body: "baz"}
      ]
    };
  }

  handleMessage(type, message) {
    switch(type) {
      case "message:new":
        this.setState({messages: this.state.messages.concat([message])});
        break;

      default:
        // Nothing
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
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
          <UserList users={this.state.users} />
          <Chat
            messages={this.state.messages}
            onMessage={(text) => this.ws.send("message:new", text)}
          />
          <DrawingArea />
        </div>
      </div>
    );
  }
}

export default App;
