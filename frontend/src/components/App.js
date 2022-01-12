import React from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import RoomJoin from "./RoomJoin";
import RoomCreate from "./RoomCreate";
import Room from "./Room";
import "./App.css";
function App(props) {
  return (
    <div className="css-selector">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/join" component={RoomJoin} />
          <Route exact path="/create" component={RoomCreate} />
          <Route path="/room/:roomId" component={Room} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
