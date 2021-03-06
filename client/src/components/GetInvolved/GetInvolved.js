import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import UserEventDisplay from "../GetInvolved/UserEvents/UserEventDisplay";
import API from "../../utils/API";
import Header from "../Header/Header";
import "./getInvolved.css";

const GetInvolved = ({ events }) => {
  const [eventState, setEventState] = useState({
    events: [],
  });

  useEffect(() => {
    async function fetchData() {
      await API.getEvents().then((res => {
        console.log(res);
        
        setEventState({ ...eventState, events: res.data })
      })
        );
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="getInvolved">
        {/* Im here */}
        <Header />
          <Container fluid>
            <Row className="eventDisplay">
              <UserEventDisplay events={eventState.events} />
            </Row>
          </Container>
      </div>
    </>
  );
};

export default GetInvolved;
