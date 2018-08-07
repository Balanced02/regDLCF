import React, { Component } from "react";
import { Card, Row, Col, CardBody } from "reactstrap";
import { connect } from "react-redux";
import { callApiWithFormData, picUpload } from "../../../utils/index";
import { showError, showInfo } from "../../../actions/feedback";
import Prompt from "../../../components/Prompt";
// import AddProduct from "../../../components/NewProduct";
import ProductDetails from "../../../components/ProductDetails.jsx";

class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      inputs: {
        negotiable: true,
        phoneNumber: "",
        state: "Nasarawa State"
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
        localGovtArea: ""
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
    let check = Object.values(this.state.inputs);
    check = check.every(data => data !== "");
    if (!check) {
      this.props.dispatch(showError("All fields must be filled"));
      return;
    }
    if (!this.state.uploadFile) {
      this.props.dispatch(showError("You must upload an image"));
      return;
    } else {
      this.setState({
        ...this.state,
        fetching: true
      });
      callApiWithFormData(
        "/createProduct",
        this.state.inputs,
        "POST",
        this.state.uploadFile
      )
        .then(data => {
          this.props.dispatch(showInfo("Ad Successfully Posted"));
          this.clearFetching();
          this.resetState();
        })
        .catch(err => {
          this.props.dispatch(showError("Error Uploading Image"));
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
        negotiable: true,
        phoneNumber: "",
        gender: "",
        fullName: ""
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

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
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
                <ProductDetails
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
