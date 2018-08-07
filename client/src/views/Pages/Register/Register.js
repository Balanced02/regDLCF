import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { startRegister } from '../../../actions/auth'

import { Button, Card, CardBody, CardFooter, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { showError } from '../../../actions/feedback';

class Register extends Component {

  constructor(props){
    super(props);
    this.state = {
      disabled: true,
      userDetails: {
        fullName: '',
        username: '',
        password: '',
        passwordC: '',
        email: '',
        userType: 'admin',
        phoneNumber: ''
      }
    }
    // this.check = this.check.bind(this)
  }

  submit(){
    const { username, password, passwordC, email, phoneNumber, fullName } = this.state.userDetails
    if (!fullName) return this.props.dispatch(showError('Please provide your full name'))
    if (!username) return this.props.dispatch(showError('Username field is required'))
    if (!email) return this.props.dispatch(showError('Email is required'))
    if (!password) return this.props.dispatch(showError('Please provide a password'))
    if (!passwordC) return this.props.dispatch(showError('Please confirm your password'))
    if (!phoneNumber || phoneNumber.length < 9) return this.props.dispatch(showError('Please provide a valid phone Number'))
    if (password !== passwordC) return this.props.dispatch(showError('Passwords do not match'))
    this.props.dispatch(startRegister(this.state.userDetails))
  }

  handleInputChange(e){
    let { name, value } = e.target
    let newState = {
        ...this.state.userDetails,
        [name] : value
    }
    this.check(newState)
  }

  check(newState) {
    let checkArray = Object.values(newState)
    let result = checkArray.every(value => value !== '' )
    console.log(result)
    if (result) {
      this.setState({
        ...this.state,
        disabled: false,
        userDetails: {
          ...newState
        }
      })
    } else {
      this.setState({
        ...this.state,
        disabled: true,
        userDetails: {
          ...newState
        }
      })
    }
  }

  handleNumberInputChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value.match(/^\d+$/) || value === '') {
      let newState = {
          ...this.state.userDetails,
          phoneNumber: value
      }
      this.check(newState)
    }
}

  render() {
    const { fullName, username, password, passwordC, email, phoneNumber } = this.state.userDetails
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Full Name" name='fullName' onChange={(e) => this.handleInputChange(e)} value={fullName} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Username" name='username' onChange={(e) => this.handleInputChange(e)} value={username} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Email" name='email' onChange={(e) => this.handleInputChange(e)} value={email} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Password" name='password' onChange={(e) => this.handleInputChange(e)} value={password}/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Repeat password" name='passwordC' onChange={(e) => this.handleInputChange(e)} value={passwordC} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="08188274143" name='phoneNumber' onChange={(e) => this.handleNumberInputChange(e)} value={phoneNumber}/>
                  </InputGroup>
                  <Button color="success" block onClick={() => this.submit()} disabled={this.state.disabled} >Create Account</Button>
                </CardBody>
                <CardFooter className="p-4">
                <Link to='/login'> <Button color="primary" block >Login</Button></Link>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect()(Register)
