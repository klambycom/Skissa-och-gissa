// @flow

import React, { Component } from "react";
import {Socket, Presence, Channel} from "phoenix";

type User = {
  user: string,
  onlineAt: string
};

type ChatMessage = {
  body: string,
  timestamp: number,
  user: string
};

type Message = ChatMessage;

class Websocket extends Component {
  props: {
    url: string,
    user: string,
    room: string,
    types: Array<string>,
    onPresence(users: Array<User>): void,
    onMessage(type: string, message: Message): void
  };
  state: {presences: Object};

  socket: Socket;
  room: Channel;

  static Type = Object.freeze({
    MESSAGE: "message:new"
  });

  state = {presences: {}};

  componentDidMount() {
    // Set up the websocket connection
    this.socket = new Socket(this.props.url, {params: {user: this.props.user}});
    this.socket.connect();

    // Set up room
    this.room = this.socket.channel(this.props.room);

    // Sync presence state
    this.room.on("presence_state", state => {
      this.setState({presences: Presence.syncState(this.state.presences, state)});
      this.props.onPresence(this.formatPresences(this.state.presences));
    });

    this.room.on("presence_diff", state => {
      this.setState({presences: Presence.syncDiff(this.state.presences, state)});
      this.props.onPresence(this.formatPresences(this.state.presences));
    });

    // Set up new message handler
    this.props.types.forEach((type) => this.room.on(type, this.handleMessage(type)));

    // Join the room
    this.room.join();
  }

  handleMessage(type: string): Function {
    return (message: Message) => this.props.onMessage(type, message);
  }

  formatTimestamp(timestamp: string): string {
    let date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  formatPresences(presences: Object): Array<User> {
    return Presence.list(presences, (user, {metas}) => {
      return {
        user: user,
        onlineAt: this.formatTimestamp(metas[0].online_at)
      };
    });
  }

  send(type: string, message: string): void {
    this.room.push(type, message);
  }

  render() {
    return (<div></div>);
  }
}

export default Websocket;
