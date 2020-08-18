  
import React from "react";
import Messages from "./components/Messages";
import "./styles/main.css";
import Input from "./components/Input";

require("dotenv").config();

//name generator
function randomName() {
  const adjectives = [
    "autumn",
    "hidden",
    "dark",
    "empty",
    "summer",
    "winter",
    "spring",
    "quiet",
    "icy",
    "broken",
    "morgen",
    "pale",
    "salty",
  ];
  const nouns = [
    "star",
    "wind",
    "sun",
    "flower",
    "sea",
    "camel",
    "fenix",
    "noon",
    "feather",
    "eagle",
    "dust",
    "darkness",
    "bird",
    "dog",
    "horse",
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

//random color generator
function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class App extends React.Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    },
  };

  constructor() {
    super();

    this.drone = new window.Scaledrone(process.env.REACT_APP_API_KEY, {
      data: this.state.member,
    });

    this.drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = this.state.messages;
      messages.push({ member, text: data });
      this.setState({ messages });
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Chat App</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };
}

export default App;