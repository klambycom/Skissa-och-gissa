import React, {Component} from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";

import "./MessageList.css";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {isAtBottom: true};
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({behavior: "smooth"});
  }

  // TODO This do not work? It only works when window is to small.
  isAtBottom() {
    const end = this.messagesEnd.getBoundingClientRect();
    const container = this.messagesContainer.parentElement;

    return end.bottom < container.clientHeight;
  }

  componentWillReceiveProps() {
    this.setState({isAtBottom: this.isAtBottom()});
  }

  componentDidUpdate() {
    if (this.state.isAtBottom) {
      this.scrollToBottom();
    }
  }

  render() {
    const b = bem("MessageList");
    const {messages} = this.props;

    return (
      <div
        className={b}
        ref={(ref) => this.messagesContainer = ref}
      >
        {messages.map((message, i) => <div key={i}>{message}</div>)}
        <div ref={(ref) => this.messagesEnd = ref}></div>
      </div>
    );
  }
}

MessageList.defaultProps = {
  messages: []
};

MessageList.propTypes = {
  messages: PropTypes.array
};

export default MessageList;
