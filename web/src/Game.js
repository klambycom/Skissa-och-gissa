// @flow

import React, { Component } from "react";
import bem from "bem-cn";

import Websocket from "./Websocket";
import DrawingArea from "./DrawingArea";
import Chat from "./Chat";
import Message from "./Message";
import Information from "./Information";

import "./Game.css";

const b = bem("Game");
const user = `Christian (${Math.random()})`;

class Game extends Component {
  state: {users: Array<any>, messages: Array<React.Element<any>>};

  ws: Object;

  state = {users: [], messages: []};

  addMessage(message: React.Element<any>): void {
    this.setState({messages: this.state.messages.concat([message])});
  }

  handleMessage(type: string, message: Object): void {
    switch(type) {
      case Websocket.Type.MESSAGE:
        this.addMessage(<Message.Text {...message} />);
        break;

      default:
        // Do nothing!
    }
  }

  handleCommand(command: string, text: string): void {
    switch(command) {
      case "users":
        this.addMessage(<Message.Users body="All users" users={this.state.users} />);
        break;

      default:
        this.addMessage(<Message.MissingCommand command={command} text={text} />);
    }
  }

  render(): React.Element<any> {
    return (
      <div className={b}>
        <Websocket
          ref={(ref) => this.ws = ref}
          url="ws://localhost:4000/socket"
          room={`room:${this.props.match.params.id}`}
          types={[Websocket.Type.MESSAGE]}
          user={user}
          onMessage={(type, msg) => this.handleMessage(type, msg)}
          onPresence={(users) => this.setState({users})}
        />

        <Information
          title="Allmän kategori"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          users={this.state.users}
        />

        <div className={b("playfield")}>
          <div className={b("playfield", "left")}>
            <Chat
              messages={this.state.messages}
              onMessage={(text) => this.ws.send("message:new", text)}
              onCommand={(command, text) => this.handleCommand(command, text)}
            />
          </div>
          <div className={b("playfield", "right")}>
            <DrawingArea />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
