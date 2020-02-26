import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import Title from "../../components/UI/Title/Title";
import Loader from "../../components/UI/Loader/Loader";

import "./LeadsPage.css";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

class LeadsPage extends Component {
  state = {
    leads: null,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    LeadsService.getLeads()
      .then(res => {
        this.setState({ leads: res.data });
        this.setState({ isLoading: false });
        console.log(rows);
        console.log(this.state.leads);
      })
      .catch(err => {
        console.error("Error while getting leads" + err.response);
      });
  }

  render() {
    return (
      <div className="leads-page-container">
        <Title color="Black" size="Small">
          LEADS
        </Title>
        {this.state.leads && (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell align="right">Budget</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Address</TableCell>
                  <TableCell align="right">City</TableCell>
                  <TableCell align="right">Postal Code</TableCell>
                  <TableCell align="right">Province</TableCell>
                  <TableCell align="right">isAccepted</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.leads.map(lead => (
                  <TableRow className="table-row" key={lead.leadId}>
                    <TableCell align="right">{lead.serviceId}</TableCell>
                    <TableCell align="right">{lead.budget}</TableCell>
                    <TableCell align="right">{lead.description}</TableCell>
                    <TableCell align="right">{lead.address}</TableCell>
                    <TableCell align="right">{lead.city}</TableCell>
                    <TableCell align="right">{lead.postalCode}</TableCell>
                    <TableCell align="right">{lead.province}</TableCell>
                    <TableCell align="right">{lead.isAccepted}</TableCell>
                    <TableCell align="right">{lead.creationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    );
  }
}

export default LeadsPage;
