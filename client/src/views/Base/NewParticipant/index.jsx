import React, { Component } from "react";
import { Card, Row, Col, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { callApi } from "../../../utils/index";
import { showError, showInfo } from "../../../actions/feedback";
import ParticipantDetails from "../../../components/ParticipantDetails.jsx";

class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      inputs: {
        fullName: "",
        phoneNumber: "",
        gender: "",
        state: "Nasarawa State",
        denomination: "",
        languagesSpoken: "",
        institution: "",
        institutionAddress: "",
        level: "",
        category: "FYB"
      },
      fetching: false,
      activeTab: "1"
    };
  }

  handleInputChange(e) {
    let { name, value } = e.target;
    let expectedInputs = {
      ...this.state.inputs,
      [name]: value
    };
    if (name === "state") {
      expectedInputs = {
        ...expectedInputs,
      };
    }
    this.setState({
      ...this.state,
      inputs: {
        ...expectedInputs
      }
    });
  }

  handleNumberInputChange = event => {
    event.preventDefault();
    const { value } = event.target;
    if (value.match(/^\d+$/) || value === "") {
      this.setState({
        ...this.state,
        inputs: {
          ...this.state.inputs,
          phoneNumber: value
        }
      });
    }
  };

  handleSwitchChange = type => {
    this.setState({
      ...this.state,
      inputs: {
        ...this.state.inputs,
        negotiable: type === "negotiable"
      }
    });
  };

  clearFetching() {
    this.setState({
      ...this.state,
      fetching: false
    });
  }

  submit() {
    const {
      fullName,
      phoneNumber,
      gender,
      state,
      denomination
    } = this.state.inputs;
    if (!fullName) {
      this.props.dispatch(showError("Provide name"));
      return;
    }
    if (!phoneNumber) {
      this.props.dispatch(showError("Provide Phone Number"));
      return;
    }
    if (!gender) {
      this.props.dispatch(showError("Provide gender"));
      return;
    }
    if (!state) {
      this.props.dispatch(showError("Provide State of Origin"));
      return;
    }
    if (!denomination) {
      this.props.dispatch(showError("Provide denomination"));
      return;
    } else {
      this.setState({
        ...this.state,
        fetching: true
      });
      callApi("/createParticipant", this.state.inputs, "POST")
        .then(data => {
          this.props.dispatch(showInfo("Participant Successfully Registered"));
          this.clearFetching();
          this.resetState();
        })
        .catch(err => {
          this.props.dispatch(showError("Error Creating Participant"));
          this.clearFetching();
        });
    }
  }

  resetState() {
    const resetState = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      uploadFile: null,
      uploading: false,
      imageUrl: "",
      inputs: {
        fullName: "",
        phoneNumber: "",
        gender: "",
        state: "Nasarawa State",
        denomination: "",
        languagesSpoken: "",
        institution: "",
        institutionAddress: "",
        level: "",
        category: "FYB"
      },
      activeTab: "1"
    };
    this.setState({
      ...resetState
    });
  }

  toggleFade() {
    this.setState(prevState => {
      return { fadeIn: !prevState };
    });
  }

  toggle = (tab, tabName) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        inputs: {
          ...this.state.inputs,
          category: tabName
        }
      });
    }
  };

  render() {
    const { inputs, fetching, activeTab } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody>
            <Row>
              <Col>
                <ParticipantDetails
                  data={inputs}
                  handleInputChange={e => this.handleInputChange(e)}
                  submit={() => this.submit()}
                  handleNumberInputChange={e => this.handleNumberInputChange(e)}
                  handleSwitchChange={e => this.handleSwitchChange(e)}
                  fetching={fetching}
                  toggle={this.toggle}
                  activeTab={activeTab}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect()(NewProduct);
