import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import SourceCard from "../SourceCard/SourceCard";
import CreateNew from "../../CreateNew/CreateNew";
import API from "../../../../utils/API";
import SearchBar from "../../SearchBar/Search";
import debounce from "lodash.debounce";
import { AuthContext } from "../../../authComponents/userAuth/Auth";



class SourceDisplay extends React.Component {
  static contextType = AuthContext

  constructor() {
    super();
    this.admin = true;
    this.coordinator = false;
    this.createObj = {
      name: "Source",
      title: "Sources",
      path: "/dashboard/newSource"
    }
    this.state = {
      _id: "",
      region: "",
      role: "",
      search: "",
      sources: [],
      loading: false,
    }
  }

  componentWillMount() {
    const currentUser = this.context
    const { _id, role, region } = currentUser.dbUser;

    this.setState({ loading: true });

    if (role === "Coordinator") {
      API.getSourceByRegion(region._id).then((data) => {
        this.setState({ _id: _id, role: role, region: region })
        this.setState({ sources: data.data, loading: false });
      });
    } else {
      API.getSources().then(data => {
        this.setState({ sources: data.data, loading: false })
      })
    }

  }

  async onDelete(_id, this4) {
    try {
      await API.deleteSource(_id);
      let filter_sources = this4.state.sources
      const indexOfDeleteEvent = filter_sources.findIndex(a => {
        return a._id === _id
      })
      filter_sources.splice(indexOfDeleteEvent, 1)
      this4.setState({ sources: filter_sources });
      alert("Deleted");
    } catch (err) {
      alert(err.message);
    }
  };

  clearSearch = () => {
    this.setState({ loading: true });
    document.getElementById("searchInput").value = "";

    if (this.state.role === "Coordinator") {
      API.getSourceByRegion(this.state.region._id).then((data) => {
        this.setState({ sources: data.data, loading: false });
      });
    } else {
      API.getSources().then((data) => {
        this.setState({ sources: data.data, loading: false });
      });
    }

    this.setState({
      search: ""
    })
  }

  handleSearch = async () => {

    try {
      this.setState({ loading: true });

      if (this.state.role === "Coordinator") {
        await API.searchSources(this.state.search).then(data => {
          const filter = data.data.filter(item => item.region !== null)
          const sources = filter.filter(item => item.region._id === this.state.region._id)
          this.setState({ sources: sources, loading: false })
        });
      } else {
        await API.searchSources(this.state.search).then(data => {
          this.setState({ sources: data.data, loading: false })
        });
      }
      
    } catch (err) {
      alert(err.message);
    }
  }


  handleInputChange = debounce((search) => {
    this.setState({ search });

    if (this.state.search === "") {
      if (this.state.role === "Coordinator") {
        API.getSourceByRegion(this.state.region._id).then((data) => {
          this.setState({ sources: data.data, loading: false });
        });
      } else {
        API.getSources().then((data) => {
          this.setState({ sources: data.data, loading: false });
        });
      }
      return
    } else {
      this.handleSearch()
    }

  }, 1000);

  render() {
    return (
      <>
        <CreateNew obj={this.createObj} />
        <SearchBar
          search={this.state.search}
          handleInputChange={this.handleInputChange}
          clearSearch={this.clearSearch} />
        {!this.state.loading ? (
          this.state.sources.length > 0 ? (
            <Row>
              {this.state.sources.map((source, index) => (
                <Col sm={12} key={index}>
                  <SourceCard source={source} onDelete={this.onDelete} this3={this} />
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
    )
  }
}

export default SourceDisplay;