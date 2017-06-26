import React, {Component} from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";

import "./MessageList.css";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {isAtBottom: true};
  }

  get maxScrollTop() {
    return this.messagesContainer.offsetHeight - this.messagesContainer.parentNode.offsetHeight;
  }

  get scrollTop() {
    return this.messagesContainer.parentNode.scrollTop;
  }

  set scrollTop(value) {
    this.messagesContainer.parentNode.scrollTop = value;
  }

  componentWillReceiveProps() {
    this.setState({isAtBottom: this.maxScrollTop <= this.scrollTop});
  }

  componentDidUpdate() {
    if (this.state.isAtBottom) {
      this.scrollTop = this.maxScrollTop;
    }
  }

  render() {
    const b = bem("MessageList");
    const {messages} = this.props;

    return (
      <div className={b} ref={(ref) => this.messagesContainer = ref}>
        {messages.map((message, i) => <div key={i}>{message}</div>)}
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
