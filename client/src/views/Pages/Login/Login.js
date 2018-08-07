import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLogin } from '../../../actions/auth'
import { showError, showInfo } from '../../../actions/feedback'

import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      userDetails: {
        username: '',
        password: ''
      }
    }
  }

  handleInputChange(e){
    let { name, value } = e.target
    this.setState({
      ...this.state,
      userDetails: {
        ...this.state.userDetails,
        [name] : value
      }
    })
  }

  submit(){
    let { username, password } = this.state.userDetails
    if (!username) return this.props.dispatch(showError('Username field is required'))
    if (!password) return this.props.dispatch(showError('Please provide a valid password'))
    return this.props.dispatch(startLogin(this.state.userDetails))
  }

  render() {
    const { username, password }  = this.state.userDetails
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" name='username' onChange={(e) => this.handleInputChange(e)} value={username} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password"  name='password' onChange={(e) => this.handleInputChange(e)} value={password} />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" className="px-4" onClick={() => this.submit()} >Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to='/register' > <Button color="primary" className="mt-3" active>Register Now!</Button> </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect()(Login)
