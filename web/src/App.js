import React, { Component } from "react";
import {Socket, Presence} from "phoenix";
import logo from "./logo.svg";
import "./App.css";

import DrawingArea from "./DrawingArea";
import Chat from "./Chat";
import UserList from "./UserList";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: `Christian (${Math.random()})`,
      presences: {},
      messages: [
        {body: "foo"},
        {body: "bar"},
        {body: "baz"}
      ]
    };
  }

  componentDidMount() {
    // Set up the websocket connection
    this.socket = new Socket("ws://localhost:4000/socket", {params: {user: this.state.user}});
    this.socket.connect();

    // Set up room
    this.room = this.socket.channel("room:lobby");

    // Sync presence state
    this.room.on("presence_state", state => {
      this.setState({presences: Presence.syncState(this.state.presences, state)});
    });

    this.room.on("presence_diff", state => {
      this.setState({presences: Presence.syncDiff(this.state.presences, state)});
    });

    // Set up new message handler
    this.room.on("message:new", this.handleMessage.bind(this));

    // Join the room
    this.room.join();
  }

  formatTimestamp(timestamp) {
    let date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  formatPresences(presences) {
    return Presence.list(presences, (user, {metas}) => {
      return {
        user: user,
        onlineAt: this.formatTimestamp(metas[0].online_at)
      };
    });
  }

  handleMessage(message) {
    console.log(this);
    console.log(message);
    this.setState({messages: this.state.messages.concat([message])});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          <UserList users={this.formatPresences(this.state.presences)} />
          <Chat
            messages={this.state.messages}
            onMessage={(text) => this.room.push("message:new", text)}
          />
          <DrawingArea />
        </div>
      </div>
    );
  }
}

export default App;
