import React, { Component } from "react";
import {Socket, Presence} from "phoenix";

class Websocket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      presences: {}
    };
  }

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

  handleMessage(type) {
    return (message) => this.props.onMessage(type, message);
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

  send(type, message) {
    this.room.push(type, message);
  }

  render() {
    return (<div></div>);
  }
}

export default Websocket;
