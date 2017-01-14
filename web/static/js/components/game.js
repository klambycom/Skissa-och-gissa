import React from "react";
import {Socket, Presence} from "phoenix";

import ChatMessage from "./chat_message";
import ChatInput from "./chat_input";
import UserList from "./user_list";

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      presences: {},
      messages: []
    };

    this.handleMessage = this.handleMessage.bind(this);

    this.initialize(`Anonymous-${Math.floor(Math.random() * 1000)}`, "room:lobby");
  }

  initialize(user, roomName) {
    // Set up the websocket connection
    this.socket = new Socket("/socket", {params: {user: user}});
    this.socket.connect();

    // Set up room
    this.room = this.socket.channel(roomName);

    // Sync presence state
    this.room.on("presence_state", state => {
      this.setState({presences: Presence.syncState(this.state.presences, state)});
    });

    this.room.on("presence_diff", state => {
      this.setState({presences: Presence.syncDiff(this.state.presences, state)});
    });

    // Set up new message handler
    this.room.on("message:new", message => {
      let messages = this.state.messages; // TODO copy messages
      messages.push(message);
      this.setState({messages: messages});
    });

    // Join the room
    this.room.join();
  }

  presencesList() {
    return Presence.list(this.state.presences, (user, {metas}) => {
      return {user, onlineAt: metas[0].online_at}
    });
  }

  handleMessage(message) {
    this.room.push("message:new", message);
  }

  render() {
    return (
      <div className="game">
        <div className="chat col-md-8">
          <h2>Messages</h2>
          <ul id="message-list" className="list-unstyled">
            {this.state.messages.map((x, i) => (
              <li key={i}>
                <ChatMessage user={x.user} body={x.body} timestamp={x.timestamp} />
              </li>
            ))}
          </ul>
          <ChatInput onMessage={this.handleMessage} />
        </div>
        <div className="col-md-4">
          <UserList users={this.presencesList()} />
        </div>
      </div>
    );
  }
}

export default Game;
