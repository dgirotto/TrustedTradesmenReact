import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";
import { FaFileInvoiceDollar, FaRegClock, FaRegCalendarAlt } from "react-icons/fa";

import "./LeadsPage.css";
import { formatDate } from '../../helpers/Utils';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';

import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";

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

export class Row extends Component {
  state = {
    row: this.props.row,
    open: false
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      row: newProps.row,
      userType: newProps.userType,
      open: false
    });
  }

  dismissLead = () => {
    if (window.confirm("Are you sure you wish to dismiss this lead?")) {
      this.claimLead(false);
    }
  }

  claimLead = (isAccepted) => {
    let body = {
      leadId: this.state.row.leadId,
      isAccepted: isAccepted ? 1 : 0
    };

    LeadsService.updateLead(body)
      .then(() => {
        this.props.getLeads(true)
      })
      .catch(err => {
        console.error("Error while updating lead" + err.response);
      });
  }

  getRowContent = () => {
    let content = null;

    if (this.props.isMobile) {
      content = (
        <TableCell>
          <table className="mobile-table">
            <tbody>
              <tr>
                <td>{this.state.row.serviceName}</td>
              </tr>
              <tr>
                <td>{this.state.row.address}, {this.state.row.city}</td>
              </tr>
              <tr>
                <td>Submitted: {formatDate(this.state.row.creationDate.split(" ")[0])}</td>
              </tr>
              <tr>
                <td>Time Frame: {this.state.row.timeFrame} Month(s)</td>
              </tr>
              <tr>
                <td style={{ paddingTop: "5px" }}>
                  <IconButton aria-label="expand row" size="small">
                    {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
              {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{this.state.row.serviceName}</TableCell>
          <TableCell>{this.state.row.address}</TableCell>
          <TableCell>{this.state.row.city}</TableCell>
          <TableCell>{formatDate(this.state.row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{this.state.row.timeFrame} Month(s)</TableCell>
        </Auxil>
      );
    }

    return content;
  }

  render() {
    return (
      <Auxil>
        <TableRow onClick={() => this.setState({ open: !this.state.open })} style={{ cursor: "pointer" }}>
          {this.getRowContent()}
        </TableRow>
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Card className="job-details-card">
                  <p className="item-title">LEAD ID</p>
                  {this.state.row.leadId}
                  <p className="item-title">SERVICE</p>
                  {this.state.row.serviceName}
                  <p className="item-title">SUBMISSION DATE</p>
                  <span className="item-with-icon">
                    <FaRegCalendarAlt size={16} />&nbsp;
                    {formatDate(this.state.row.creationDate.split(" ")[0])}
                  </span>
                  <p className="item-title">LOCATION</p>
                  {this.state.row.address}, {this.state.row.city}, {this.state.row.province}, {this.state.row.postalCode}
                  <p className="item-title">DESCRIPTION</p>
                  {this.state.row.description}
                  <p className="item-title">BUDGET</p>
                  <span className="item-with-icon">
                    <FaFileInvoiceDollar size={16} />&nbsp;
                    {this.state.row.budget}
                  </span>
                  <p className="item-title">TIME FRAME</p>
                  <span className="item-with-icon">
                    <FaRegClock size={16} />&nbsp;
                    {this.state.row.timeFrame} Month(s)
                  </span>
                </Card>
                {(this.props.userType === 1) && (
                  <div className="button-container">
                    <Button
                      onClick={() => this.claimLead(true)}
                      variant="contained"
                      style={{ backgroundColor: "#3bb13b", color: "white" }}
                    >
                      ACCEPT
                    </Button>
                    <Button
                      onClick={() => this.dismissLead()}
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
}

class LeadsPage extends Component {
  state = {
    userType: null,
    leads: null,
    leadCount: null,
    pageNumber: 0,
    itemsPerPage: 10,
    isLoading: true
  };

  getLeads = (loadFirstPage = false) => {
    var pageNumberToLoad = loadFirstPage ? 0 : this.state.pageNumber;

    LeadsService.getLeads(pageNumberToLoad + 1, this.state.itemsPerPage)
      .then(res => {
        this.setState({
          leads: res.data.leads,
          leadCount: res.data.lead_count,
          pageNumber: pageNumberToLoad,
          isLoading: false
        });
      })
      .catch(err => {
        console.error("Error while getting leads" + err.response);
        this.setState({ isLoading: false });
      });
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      pageNumber: newPage
    }, () => {
      this.getLeads();
    });
  }

  handleChangeItemsPerPage = (event) => {
    this.setState({
      pageNumber: 0,
      itemsPerPage: event.target.value
    }, () => {
      this.getLeads();
    });
  }

  componentDidMount() {
    this.setState({
      userType: AuthService.getRole()
    }, () => {
      this.getLeads();
    });
  }

  render() {
    return (
      <div className="page-container">
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
                        <b>Submitted</b>
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
                        getLeads={this.getLeads}
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
                        getLeads={this.getLeads}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={this.state.leadCount}
                rowsPerPage={this.state.itemsPerPage}
                page={this.state.pageNumber}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeItemsPerPage}
              />

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
