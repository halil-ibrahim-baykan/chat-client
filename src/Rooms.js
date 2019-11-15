import React, { Component } from "react";
import superagent from "superagent";
import { Link } from "react-router-dom";

export default class Room extends Component {
  state = {
    rooms: [],
    value: ""
  };

  stream = new EventSource("http://localhost:4000/stream");

  componentDidMount() {
    //desctructure the data what was passed to stream.send
    this.stream.onmessage = event => {
      const { data } = event;
      console.log("data test", data);
      // there is comment here looak at david repository
      const parsedData = JSON.parse(data);
      //check the sent data in anarray
      if (Array.isArray(parsedData)) {
        // id it  we assume it contains all message                       i think you get all comment from david
        console.log("array test");

        this.setState({ rooms: parsedData });
      } else {
        console.log("else test");

        const rooms = [...this.state.rooms, parsedData];
        this.setState({ rooms });
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
    const url = "http://localhost:4000/room";

    superagent
      .post(url)
      .send({ name: value })
      .then(response => {
        console.log("response test", response);
      });
  };

  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    const list = this.state.rooms.map((name, index) => (
      <p key={index}>
        {""}
        <Link to={`/room/${name}`}>{name}</Link>
        {""}
      </p>
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
