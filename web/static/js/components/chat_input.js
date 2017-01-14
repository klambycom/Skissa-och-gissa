import React from "react";

class ChatInput extends React.Component {
  constructor() {
    super();

    this.state = {
      message: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onMessage(this.state.message);
    this.setState({message: ""});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="Type and press enter..."
          value={this.state.message}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default ChatInput;
