import React, { Component } from "react";
import "./App.css";

import Page from "./Page";
import DrawingArea from "./DrawingArea";
import Chat from "./Chat";
import Message from "./Message";
import Websocket from "./Websocket";
import Header from "./Header";

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
      <Page>
        <Header />
        <div className="App-intro">
          <div>{this.state.users.length} user online</div>
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
      </Page>
    );
  }
}

export default App;
