// @flow

import React, {Component} from "react";
import bem from "bem-cn";

import ScrollToBottom from "./ScrollToBottom";

import "./MessageList.css";

class MessageList extends Component {
  props: {messages: Array<React.Element<any>>};
  state: {isAtBottom: boolean, isScrollingDown: boolean};

  messagesContainer: Object;

  static defaultProps = {messages: []};
  state = {isAtBottom: true, isScrollingDown: false};

  get maxScrollTop(): number {
    return this.messagesContainer.offsetHeight - this.messagesContainer.parentNode.offsetHeight;
  }

  get scrollTop(): number {
    return this.messagesContainer.parentNode.scrollTop;
  }

  set scrollTop(value: number) {
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

  handleWheel(e: any): void {
    if (e.deltaY > 0) {
      this.setState({isScrollingDown: true});
    }
  }

  render(): React.Element<any> {
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
          onClick={() => this.setState({isAtBottom: true, isScrollingDown: false})}
        />
      </div>
    );
  }
}

export default MessageList;
