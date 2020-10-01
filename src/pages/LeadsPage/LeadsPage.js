import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import { isMobile } from "react-device-detect";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";

import "./LeadsPage.css";
import "../JobsPage/JobsPage.css";

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
import Button from "@material-ui/core/Button";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  const [contractor, setContractor] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  function dismissLead() {
    if (
      window.confirm("Are you sure you wish to dismiss this lead?")
    ) {
      claimLead(false);
    }
  }

  function claimLead(isAccepted) {
    setLoading(true);
    let body = { leadId: row.leadId };

    if (isAccepted) {
      body.isAccepted = 1;
    }
    else {
      body.isAccepted = 0;
    }   

    LeadsService.updateLead(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while updating lead" + err.response);
        setLoading(false);
      });
  }
  
  return (
    <Auxil>
      <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.leadId}</TableCell>
        <TableCell>{row.serviceName}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.creationDate.split(" ")[0]}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <table className="job-details-table">
                <tr>
                  <td style={{ width: "175px" }}>Lead ID</td>
                  <td>{row.leadId}</td>
                </tr>
                <tr>
                  <td>Service</td>
                  <td>{row.serviceName}</td>
                </tr>
                <tr>
                  <td>Creation Date</td>
                  <td>{row.creationDate.split(" ")[0]}</td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>
                    {row.address}, {row.city}, {row.province}, {row.postalCode}
                  </td>
                </tr>
                <tr>
                  <td>Budget</td>
                  <td>${row.budget}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{row.description}</td>
                </tr>
              </table>
              <div className="button-container">
                <Button
                  onClick={() => claimLead(true)}
                  variant="contained"
                  style={{ backgroundColor: "#3bb13b", color: "white" }}
                >
                  INTERESTED
                </Button> 
                <Button
                  onClick={() => dismissLead()}
                  variant="contained"
                  color="secondary"
                >
                  DISMISS
                </Button>
              </div> 
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Auxil>
  );
}

class LeadsPage extends Component {
  state = {
    leads: null,
    isLoading: false,
    showSnackbar: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    LeadsService.getLeads()
      .then(res => {
        this.toggleSnackbar();
        this.setState({ leads: res.data, isLoading: false });
      })
      .catch(err => {
        console.error("Error while getting leads: " + err.response);
        this.setState({ isLoading: false });
      });
  }

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  render() {
    return (
      <div className="leads-page-container">
        {this.state.leads && (
          <Auxil>
            <Title>LEADS</Title>
            <TableContainer
              style={{
                border: "1px solid rgba(224, 224, 224, 1)",
                borderRadius: "0",
                boxShadow: "none"
              }}
              component={Paper}              
            >
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "rgb(243 243 243)" }}>
                    <TableCell />
                    <TableCell>
                      <b>ID</b>
                    </TableCell>
                    <TableCell>
                      <b>SERVICE</b>
                    </TableCell>
                    <TableCell>
                      <b>ADDRESS</b>
                    </TableCell>
                    <TableCell>
                      <b>CITY</b>
                    </TableCell>
                    <TableCell>
                      <b>CREATED</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.leads.map(lead => (
                    <Row key={lead.leadId} row={lead} />
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
        <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={6000}
          onClose={this.toggleSnackbar}
        >
          <Alert onClose={this.toggleSnackbar} severity="success">
            This is a success message!
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default LeadsPage;
