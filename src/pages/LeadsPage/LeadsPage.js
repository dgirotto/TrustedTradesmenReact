import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import { AuthService } from "../../services/auth";

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
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";

import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';

var tableTheme = createMuiTheme({
  overrides: {
    MuiTableContainer: {
      root: {
        maxWidth: "100%",
        margin: "auto",
        border: "1px solid rgba(224, 224, 224, 1)",
        borderRadius: "0",
        boxShadow: "none"
      }
    },
    MuiTableCell: {
      root: {
        padding: "10px"
      }
    }
  }
});

function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);

  function dismissLead() {
    if (window.confirm("Are you sure you wish to dismiss this lead?")) {
      claimLead(false);
    }
  }

  function claimLead(isAccepted) {
    let body = {
      leadId: row.leadId,
      isAccepted: isAccepted ? 1 : 0
    };

    LeadsService.updateLead(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while updating lead" + err.response);
      });
  }

  function getRowContent() {
    let content = null;

    if (props.isMobile) {
      content = (
        <TableCell>
          <table className="mobile-table">
            <tbody>
              <tr>
                <td>{row.serviceName}</td>
              </tr>
              <tr>
                <td>{row.address}, {row.city}</td>
              </tr>
              <tr>
                <td>Created: {row.creationDate.split(" ")[0]}</td>
              </tr>
              <tr>
                <td>Time Frame: {row.timeFrame} Month(s)</td>
              </tr>
              <tr>
                <td style={{ paddingTop: "5px" }}>
                  <IconButton aria-label="expand row" size="small">
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </td>
              </tr>
            </tbody>
          </table>
        </TableCell>
      );
    }
    else {
      content = (
        <Auxil>
          <TableCell>
            <IconButton aria-label="expand row" size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.serviceName}</TableCell>
          <TableCell>{row.address}</TableCell>
          <TableCell>{row.city}</TableCell>
          <TableCell>{row.creationDate.split(" ")[0]}</TableCell>
          <TableCell>{row.timeFrame} Month(s)</TableCell>
        </Auxil>
      );
    }

    return content;
  }

  return (
    <Auxil>
      <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {getRowContent()}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <table className="job-details-table">
                <tbody>
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
                    <td>Description</td>
                    <td>{row.description}</td>
                  </tr>
                  <tr>
                    <td>Budget</td>
                    <td>{row.budget}</td>
                  </tr>
                  <tr>
                    <td>Time Frame</td>
                    <td>{row.timeFrame} Month(s)</td>
                  </tr>
                </tbody>
              </table>
              {(props.userType === 1) && (
                <div className="button-container">
                  <Button
                    onClick={() => claimLead(true)}
                    variant="contained"
                    style={{ backgroundColor: "#3bb13b", color: "white" }}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    onClick={() => dismissLead()}
                    variant="contained"
                    color="secondary"
                  >
                    DISMISS
                  </Button>
                </div>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Auxil>
  );
}

class LeadsPage extends Component {
  state = {
    userType: null,
    leads: null,
    isLoading: true
  };

  componentDidMount() {
    this.setState({ userType: AuthService.getRole() });

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
    return (
      <div className="leads-page-container">
        {this.state.leads && !this.state.isLoading && (
          <Auxil>
            <Title>LEADS</Title>
            <ThemeProvider theme={tableTheme}>
              <TableContainer className="desktop-table" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "rgb(250 250 250)" }}>
                      <TableCell style={{ width: "10px" }} >
                      </TableCell>
                      <TableCell>
                        <b>Service</b>
                      </TableCell>
                      <TableCell>
                        <b>Address</b>
                      </TableCell>
                      <TableCell>
                        <b>City</b>
                      </TableCell>
                      <TableCell>
                        <b>Created</b>
                      </TableCell>
                      <TableCell>
                        <b>Time Frame</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.leads.map(lead => (
                      <Row
                        key={lead.leadId}
                        row={lead}
                        userType={this.state.userType}
                        isMobile={false}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TableContainer className="mobile-table" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {this.state.leads.map(lead => (
                      <Row
                        key={lead.leadId}
                        row={lead}
                        userType={this.state.userType}
                        isMobile={true}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ThemeProvider>
          </Auxil>
        )}

        {!this.state.leads && !this.state.isLoading && (
          <Auxil>
            <Title>LEADS</Title>
            <Alert severity="info" color="info">You don't have any leads at the moment.</Alert>
          </Auxil>
        )}

        {this.state.isLoading && <Backdrop />}
      </div>
    );
  }
}

export default LeadsPage;
