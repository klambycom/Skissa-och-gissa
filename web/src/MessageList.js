import React, {Component} from "react";
import PropTypes from "prop-types";
import bem from "bem-cn";

import ScrollToBottom from "./ScrollToBottom";

import "./MessageList.css";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {isAtBottom: true, isScrollingDown: false};
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
    this.setState({isAtBottom: this.maxScrollTop <= this.scrollTop, isScrollingDown: false});
  }

  componentDidUpdate() {
    if (this.state.isAtBottom) {
      this.scrollTop = this.maxScrollTop;
    }
  }

  scrollToBottom() {
    this.setState({isAtBottom: true, isScrollingDown: false});
    this.scrollTop = this.maxScrollTop;
  }

  handleWheel(e) {
    if (e.deltaY > 0) {
      this.setState({isScrollingDown: true});
    }
  }

  render() {
    const b = bem("MessageList");
    const {messages} = this.props;

    return (
      <div
        className={b}
        ref={(ref) => this.messagesContainer = ref}
        onWheel={(e) => this.handleWheel(e)}
      >
        {messages.map((message, i) => <div key={i}>{message}</div>)}

        <ScrollToBottom
          text="Se nya meddelanden"
          isAtBottom={this.state.isAtBottom}
          isScrollingDown={this.state.isScrollingDown}
          onClick={() => this.scrollToBottom()}
        />
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
