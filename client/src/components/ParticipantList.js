import React from "react";
import { Card, CardBlock, Table, CardFooter, Button } from "reactstrap";

export default ({ data, downloadList }) => (
  <Card className="card-accent-primary">
    <CardBlock>
      <Table responsive striped hover bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Denomination</th>
            <th>Category</th>
            <th>Institution/PPA</th>
            <th>Reg. Officer</th>
          </tr>
        </thead>
        <tbody>
          {data.map((participant, i) => (
            <tr key={participant._id}>
              <th> {i + 1} </th>
              <td> {participant.fullName} </td>
              <td> {participant.phoneNumber} </td>
              <td> {participant.denomination} </td>
              <td> {participant.category} </td>
              <td> {participant.institution} </td>
              <td> {participant.registrationOfficer} </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </CardBlock>
    <CardFooter>
      <Button onClick={() => downloadList()} outline color="link">
        {" "}
        Download Complete List{" "}
      </Button>
    </CardFooter>
  </Card>
);
