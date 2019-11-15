import React, { Component } from "react";
import superagent from "superagent";

export default class App extends Component {
  state = {
    messages: [],
    value: ""
  };

  stream = new EventSource("http://localhost:4000/stream");

  componentDidMount() {
    this.stream.onmessage = event => {
      const { data } = event;
      console.log("data test", data);

      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData)) {
        console.log("array test");

        this.setState({ messages: parsedData });
      } else {
        console.log("else test");

        const messages = [...this.state.messages, parsedData];
        this.setState({ messages });
      }
    };
  }

  onChange = event => {
    const { value } = event.target;
    console.log("VALUE TEST", value);
    this.setState({ value });
  };

  onSubmit = event => {
    event.preventDefault();

    const { value } = this.state;
    const url = "http://localhost:4000/message";

    superagent
      .post(url)
      .send({ message: value })
      .then(response => {
        console.log("response test", response);
      });
  };

  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    const list = this.state.messages.map((message, index) => (
      <p key={index}>{message}</p>
    ));
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.onChange}
          />
          <button type="button" onClick={this.reset}>
            Reset
          </button>
          <button>Submit</button>
        </form>

        {list}
      </div>
    );
  }
}
