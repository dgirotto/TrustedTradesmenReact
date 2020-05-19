import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import Title from "../../components/UI/Title/Title";
import Loader from "../../components/UI/Loader/Loader";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";

import "./LeadsPage.css";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

class LeadsPage extends Component {
  state = {
    leads: null,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    LeadsService.getLeads()
      .then(res => {
        this.setState({ leads: res.data, isLoading: false });
      })
      .catch(err => {
        console.error("Error while getting leads: " + err.response);
      });
  }

  render() {
    return (
      <div className="leads-page-container">
        {this.state.leads && (
          <Aux>
            <Title color="Black" size="Medium">
              LEADS
            </Title>
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
                    <TableCell align="right">Creation Date</TableCell>
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
          </Aux>
        )}
        {this.state.isLoading ? (
          <Aux>
            <Loader size={60} />
            <Backdrop />
          </Aux>
        ) : null}
      </div>
    );
  }
}

export default LeadsPage;
