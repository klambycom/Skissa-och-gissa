import React, { Component } from "react";
import PropTypes from "prop-types";

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ""};
  }

  handleKeyPress(e) {
    if (this.props.onEnter && e.key === "Enter" && this.state.value !== "") {
      this.props.onEnter(this.state.value);
      this.setState({value: ""});
    }
  }

  render() {
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

Input.propTypes = {
  onEnter: PropTypes.func
};

export default Input;
