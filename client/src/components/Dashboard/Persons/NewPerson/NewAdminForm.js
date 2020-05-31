import React, { setFormState, useCallback } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../../../../utils/API";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import app from "../../../authComponents/userAuth/baseAuth";

class PersonForm extends React.Component {
  // const availableRegions = regions.filter((data) => {
  //   return data.coordinator === null;
  // })
  constructor(props) {
    super(props);
    this.regions = [];
    this.state = {
      region: null,
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    };
  }

  componentWillMount() {
    API.getRegions().then((data) => this.setState((this.regions = data.data)));
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    if (value === "none") {
      this.setState({
        name: null,
      });
      return;
    }

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.name === "" || this.state.email === "") {
      alert("Looks like you forgot one!");
      return;
    }

    API.createPerson(this.state)
      .then(() => alert("Admin Created"))
      .catch((err) => alert(err.message));

    this.setState({
      region: null,
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    });
  };

  // console.log(formState)

  handleSignUp /*useCallback(*/ = async (event) => {
    event.preventDefault();
    const { email, password, name, phone } = event.target.elements;
    try {
      await app
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
      await app.auth().currentUser.updateProfile({
        displayName: name.value,
        phoneNumber: phone.value,
      });
      // this.props.history.push("/dashboard")
    } catch (error) {
      alert(error);
    }
  }; /*,*/
  //   [this.props.history]
  // );

  render() {
    return (
      <>
        <Form
          className="formContainer"
          // temporarily removed && this.handleSignUp from the onSubmit
          onSubmit={this.handleSubmit}
        >
          <h1>New Admin or Coordinator</h1>
          <Form.Row>
            <Form.Group as={Col} controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="phone"
                value={this.state.phone}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirm"
                value={this.state.confirm}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Region</Form.Label>
            <Form.Control
              as="select"
              onChange={this.handleChange}
              name="region"
              custom
            >
              <option>none</option>
              {this.regions.map((region, index) => (
                <option key={index} value={region._id}>
                  {region.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            {["radio"].map((type) => (
              <div key={`inline-${type}`} className="mb-3" value>
                <Form.Check
                  inline
                  label="Coordinator"
                  type={type}
                  id={`inline-${type}-Coordinator`}
                  name="role"
                  value="Coordinator"
                  onChange={this.handleChange}
                />
                <Form.Check
                  inline
                  label="Admin"
                  type={type}
                  id={`inline-${type}-Admin`}
                  name="role"
                  value="Admin"
                  onChange={this.handleChange}
                />
              </div>
            ))}
          </Form.Group>

          <Form.Group
            controlId="formDescription"
            style={{ height: 30, marginTop: 22 }}
          >
            <Button variant="primary" className="btn float-right" type="submit">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </>
    );
  }
}

export default PersonForm;