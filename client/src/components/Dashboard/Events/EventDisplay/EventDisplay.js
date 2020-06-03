import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EventCard from "../EventCard/EventCard";
import CreateNew from "../../CreateNew/CreateNew";
import Spinner from "react-bootstrap/Spinner";
import API from "../../../../utils/API";
import SearchBar from "../../SearchBar/Search";
import debounce from "lodash.debounce";

class EventDisplay extends React.Component {
  constructor() {
    super();
    this.admin = true;
    this.coordinator = false;
    this.createObj = {
      name: "Event",
      title: "Events",
      path: "/dashboard/newEvent",
    };
    this.state = {
      search: "",
      events: [],
      loading: false,
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    API.getEvents().then((data) => {
      this.setState({ events: data.data, loading: false });
    });
  }

  async onDelete(_id, this4) {
    try {
      await API.deleteEvent(_id);
      let filter_events = this4.state.events
      const indexOfDeleteEvent = filter_events.findIndex(a => {
        return a._id === _id
      })
      filter_events.splice(indexOfDeleteEvent, 1)
      this4.setState({ events: filter_events });
      alert("Deleted");
    } catch (err) {
      alert(err.message);
    }
  };

  async onVolunteerDelete(event, _id, this4) {
    try {
      let filter_volunteers = event.volunteers
      const indexOfDeleteEvent = filter_volunteers.findIndex(a => {
        return a._id === _id
      })
      filter_volunteers.splice(indexOfDeleteEvent, 1)

      let new_arr = filter_volunteers.map((v) => {
        return v._id;
      });
    
      let eventData = {
        _id: event._id,
        site: event.site,
        coordinator: event.coordinator,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        volunteers: new_arr
      };
  
      try {
        await API.updateEvent(eventData);
        alert("Volunteer Deleted");
        
        let updated_events = this4.state.events
        updated_events.volunteers = filter_volunteers
        this4.setState({ events: updated_events });

      } catch (err) {
        console.log(err.message);
      }

    } catch (err) {
      alert(err.message);
    }
  };

  clearSearch = () => {
    this.setState({ loading: true });
    document.getElementById("searchInput").value = "";

    API.getEvents().then((data) => {
      this.setState({ events: data.data, loading: false });
    });

    this.setState({
      search: ""
    })
  }

  handleSearch = async () => {

    try {
      this.setState({ loading: true });
      await API.searchEvents(this.state.search).then(data => {
        this.setState({ events: data.data, loading: false })
      });
    } catch (err) {
      alert(err.message);
    }
  }


  handleInputChange = debounce((search) => {
    this.setState({ search });

    if (this.state.search === "") {
      API.getEvents().then((data) => {
        this.setState({ events: data.data, loading: false });
      });
      return
    } else {
      this.handleSearch()
    } 

  }, 800);

  render() {
    return (
      <>
        {this.admin && <CreateNew obj={this.createObj} />}
        <SearchBar
          search={this.state.search}
          handleInputChange={this.handleInputChange}
          clearSearch={this.clearSearch} />
        {!this.state.loading ? (
          this.state.events.length > 0 ? (
            <Row>
              {this.state.events.map((event, index) => (
                <Col sm={12} key={index}>
                  <EventCard event={event} onDelete={this.onDelete} onVolunteerDelete={this.onVolunteerDelete} this3={this}/>
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col sm={12}>
                <h6 className="color-white">No Record Founds</h6>
              </Col>
            </Row>
          )
        ) : (
          <Row>
            <Col sm={12}>
              <Spinner animation="border" role="status" variant="light">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        )}
      </>
    );
  }
}

export default EventDisplay;

