import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  FormText,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardFooter
} from "reactstrap";
import states from "../utils/States";
import { AppSwitch } from "@coreui/react";
import classnames from "classnames";

export default ({
  data,
  handleInputChange,
  submit,
  handleNumberInputChange,
  fetching,
  activeTab,
  toggle
}) => (
  <Form>
    <FormGroup>
      <Label for="exampleEmail">Full Name</Label>
      <Input
        type="text"
        name="fullName"
        id="exampleEmail"
        placeholder="Full Name"
        value={data.fullName}
        onChange={e => handleInputChange(e)}
      />
      <FormText color="muted">Surname first</FormText>
    </FormGroup>
    <Row>
      <Col>
        <FormGroup>
          <Label for="exampleText">Phone Number</Label>
          <Input
            type="text"
            name="phoneNumber"
            id="exampleText"
            value={data.phoneNumber}
            onChange={e => handleNumberInputChange(e)}
          />
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label for="exampleText">Gender</Label>
          <Input
            type="select"
            name="gender"
            id="exampleText"
            value={data.gender}
            onChange={e => handleInputChange(e)}
          >
            <option value="" disabled>
              Select One
            </option>
            <option value="M"> Male </option>
            <option value="F"> Female </option>
          </Input>
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col xs="6">
        <FormGroup>
          <Label for="exampleText">State</Label>
          <Input
            type="select"
            name="state"
            id="exampleText"
            value={data.state}
            onChange={e => handleInputChange(e)}
          >
            <option value="" selected disabled>
              {" "}
              Select One{" "}
            </option>
            {states.map(state => (
              <option value={state.state.name} key={state.state.id}>
                {" "}
                {state.state.name}{" "}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col xs="6">
        <FormGroup>
          <Label for="exampleText">Local Govt.</Label>
          <Input
            type="select"
            name="localGovtArea"
            id="exampleText"
            value={data.localGovtArea}
            onChange={e => handleInputChange(e)}
          >
            <option value="" selected disabled>
              {" "}
              Select One{" "}
            </option>
            {states.map(
              state =>
                data.state
                  ? states
                      .filter(state => state.state.name === data.state)[0]
                      .state.locals.map(local => (
                        <option value={local.name} key={local.id}>
                          {" "}
                          {local.name}{" "}
                        </option>
                      ))
                  : ""
            )}
          </Input>
        </FormGroup>
      </Col>
    </Row>
    <FormGroup>
      <Label for="exampleEmail">Denomination</Label>
      <Input
        type="text"
        name="denomination"
        id="exampleEmail"
        placeholder="Denomination"
        value={data.denomination}
        onChange={e => handleInputChange(e)}
      />
      <FormText color="muted">E.g. DLCF, NCCF, RCCG</FormText>
    </FormGroup>
    <FormGroup>
      <Label for="exampleEmail">Languages Spoken</Label>
      <Input
        type="text"
        name="languagesSpoken"
        id="exampleEmail"
        placeholder="Languages Spoken"
        value={data.languagesSpoken}
        onChange={e => handleInputChange(e)}
      />
      <FormText color="muted">Please separate with a comma</FormText>
    </FormGroup>
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1", "FYS");
            }}
          >
            FYS
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2", "PCM");
            }}
          >
            CM
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "3" })}
            onClick={() => {
              toggle("3", "PCM");
            }}
          >
            PCM
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "4" })}
            onClick={() => {
              toggle("4", "Others");
            }}
          >
            Others
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <FormGroup>
            <Label for="exampleEmail">School Name</Label>
            <Input
              type="text"
              name="institution"
              id="exampleEmail"
              placeholder="School Name"
              value={data.institution}
              onChange={e => handleInputChange(e)}
            />
            <FormText color="muted">
              Please school name should be in full
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">School Address</Label>
            <Input
              type="textarea"
              name="institutionAddress"
              id="exampleEmail"
              value={data.institutionAddress}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
        </TabPane>
        <TabPane tabId="2">
          <FormGroup>
            <Label for="exampleEmail">PPA</Label>
            <Input
              type="text"
              name="institution"
              id="exampleEmail"
              placeholder="Place of Primary Assignment"
              value={data.institution}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">PPA Address</Label>
            <Input
              type="textarea"
              name="institutionAddress"
              id="exampleEmail"
              value={data.institutionAddress}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
        </TabPane>
        <TabPane tabId="3">
          <FormGroup>
            <Label for="exampleEmail">School Graduated From</Label>
            <Input
              type="text"
              name="institution"
              id="exampleEmail"
              placeholder="School Name"
              value={data.institution}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">School Address</Label>
            <Input
              type="textarea"
              name="institutionAddress"
              id="exampleEmail"
              value={data.institutionAddress}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
        </TabPane>
        <TabPane tabId="4">
          <FormGroup>
            <Label for="exampleEmail">School</Label>
            <Input
              type="text"
              name="institution"
              id="exampleEmail"
              placeholder="School Name"
              value={data.institution}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Level</Label>
            <Input
              type="text"
              name="level"
              id="exampleEmail"
              placeholder="Level"
              value={data.level}
              onChange={e => handleInputChange(e)}
            />
            <FormText color="muted">
              E.g 300L, HND1, NA (Not Applicable)
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">School Address</Label>
            <Input
              type="textarea"
              name="institutionAddress"
              id="exampleEmail"
              value={data.institutionAddress}
              onChange={e => handleInputChange(e)}
            />
          </FormGroup>
        </TabPane>
      </TabContent>
    </div>
    <Card>
      <CardFooter>
        <Button
          onClick={() => submit()}
          className={"pull-right"}
          disabled={fetching}
          block
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  </Form>
);
