// @flow

import React, { Component } from "react";

class Input extends Component {
  props: {onEnter(value: string): void};
  state: {value: string};

  state = {value: ""};

  handleKeyPress(e: Event): void {
    if (e.key === "Enter" && this.state.value !== "") {
      this.props.onEnter(this.state.value);
      this.setState({value: ""});
    }
  }

  render(): React.Element<any> {
    return (
      <input
        type="text"
        value={this.state.value}
        onChange={(e) => this.setState({value: e.target.value})}
        onKeyPress={(e) => this.handleKeyPress(e)}
      />
    );
  }
}

export default Input;
