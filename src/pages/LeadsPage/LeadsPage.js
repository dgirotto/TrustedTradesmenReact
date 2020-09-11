import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import { AuthService } from "../../services/auth";
import { isMobile } from "react-device-detect";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";

import "./LeadsPage.css";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

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
        this.setState({ isLoading: false });
      });
  }

  render() {
    /* 
    <div className="button-container">
      <Button
        onClick={() => alert("test")}
        variant="contained"
        style={{ backgroundColor: "#3bb13b", color: "white" }}
      >
        ACCEPT JOB
      </Button>
      <Button
        onClick={() => alert("test")}
        variant="contained"
        color="secondary"
      >
        DECLINE JOB
      </Button>
    </div> 
    */
    return (
      <div className="leads-page-container">
        {this.state.leads && (
          <Auxil>
            <Title>LEADS</Title>
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
          </Auxil>
        )}
        {!this.state.leads && !this.state.isLoading && (
          <Auxil>
            <Title>LEADS</Title>
            <p>You don't have any Leads yet!</p>
          </Auxil>
        )}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default LeadsPage;
