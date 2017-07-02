// @flow

import React, { Component } from "react";
import bem from "bem-cn";

import Websocket from "./Websocket";
import DrawingArea from "./DrawingArea";
import Chat from "./Chat";
import Message from "./Message";
import Information from "./Information";
import Canvas from "./Canvas";

import "./Game.css";

const b = bem("Game");
const user = `Christian (${Math.random()})`;

type Point = {x: number, y: number};

class Game extends Component {
  state: {users: Array<any>, messages: Array<React.Element<any>>};

  ws: Object;
  canvas: Canvas;

  state = {users: [], messages: []};

  addMessage(message: React.Element<any>): void {
    this.setState({messages: this.state.messages.concat([message])});
  }

  handleMessage(type: string, message: Object): void {
    switch(type) {
      case Websocket.Type.MESSAGE:
        this.addMessage(<Message.Text {...message} />);
        break;

      case Websocket.Type.PAINT:
        if (message.start) {
          this.canvas.start(message.point);
        }
        this.canvas.continue(message.point);
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
          types={[Websocket.Type.MESSAGE, Websocket.Type.PAINT]}
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
              onMessage={(text) => this.ws.send(Websocket.Type.MESSAGE, text)}
              onCommand={(command, text) => this.handleCommand(command, text)}
            />
          </div>
          <div className={b("playfield", "right")}>
            <DrawingArea
              canvas={(canvas: Canvas) => this.canvas = canvas}
              onPaint={(point: Point, start: boolean) => this.ws.send(Websocket.Type.PAINT, {point, start})}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
