import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Volunteer from './components/GetInvolved/VolunteerForm/volunteer';
import ReforestationMap from "./components/Reforestation/ReforestationMap";
import InformationView from "./components/Information/InformationView";

function App() {
  return (
    <>
    <Router>
        <>
          <Switch>
          <Route exact path="/" component={ Home } />
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/volunteer" component={Volunteer}/>
            <Route path="/reforestation" component={ReforestationMap} />
            <Route path="/information" component={InformationView}/>
          </Switch>
        </>
    </Router>
    </>
  );
}

export default App;
