import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
// import MuiAlert from "@material-ui/lab/Alert";
// import Snackbar from "@material-ui/core/Snackbar";

import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import {
  FaFileInvoiceDollar, FaRegClock, FaRegCalendarAlt, FaRoute,
  FaRegBuilding, FaExternalLinkAlt, FaAt, FaPhone, FaUser
} from "react-icons/fa";

import { LeadsService } from "../../services/leads";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import ResponsiveDialog from "../../components/ResponsiveDialog";
import { formatPhoneNumber, formatDate, formatTimeFrame, formatBudget } from '../../helpers/Utils';

import "./LeadsPage.css";

var tableTheme = createMuiTheme({
  overrides: {
    MuiTableContainer: {
      root: {
        maxWidth: "100%",
        margin: "auto",
        border: "1px solid rgba(224, 224, 224, 1)",
        borderRadius: "0",
        boxShadow: "none",
        boxSizing: "border-box",
      }
    },
    MuiTableCell: {
      root: {
        padding: "10px",
        fontSize: "15px"
      },
      head: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#444444"
      }
    }
  }
});

// function AlertPopup(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export class Row extends Component {
  state = {
    row: this.props.row,
    open: false
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      row: newProps.row
    });
  }

  dismissLead = () => {
    let modalContent = {
      title: `Confirm Dismissal`,
      content: `Are you sure you wish to dismiss this lead? It will be removed from your feed.`,
      actions: <>
        <Button onClick={() => this.claimLead(false)}>
          Yes
        </Button>
        <Button onClick={this.props.handleClose}>
          No
        </Button>
      </>
    };

    this.props.setDialog(modalContent);
    this.props.handleOpen();
  }

  claimLead = (claim) => {
    let body = {
      leadId: this.state.row.leadId
    };

    if (this.state.row.isInterested === null) {
      body.isInterested = claim ? 1 : 0;
    }
    else {
      body.isCommitted = claim ? 1 : 0;
    }

    LeadsService.updateLead(body)
      .then(() => {
        this.props.getLeads(true);
        // this.props.setMessage(false, "Lead successfully updated");
      })
      .catch(() => {
        // this.props.setMessage(true, "Unable to update lead");
      });

    this.props.handleClose();
  }

  formatDistance = () => {
    let content = "N/A";

    if (this.state.row.travelDistance !== null) {
      content = `${this.state.row.travelDistance} km`;
    }
    return content;
  }

  getLeadStatus = () => {
    let status = null;

    if (this.state.row.isInterested === false || this.state.row.isCommitted === false) {
      status = (
        <Chip className="status cancelled" label="Dismissed" />
      );
    }
    else if (this.state.row.isCommitted) {
      status = (
        <Chip className="status required" label="Awaiting Approval" />
      );
    }
    else if (this.state.row.isInterested) {
      status = (
        <Chip className="status completed" label="Interested" />
      );
    }
    else {
      // TODO: Label should be "<x> HRS REMAINING"
      status = (
        <Chip className="status required" label="Response Required" />
      );
    }

    return status;
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
                <td>Creation Date: {formatDate(this.state.row.creationDate.split(" ")[0])}</td>
              </tr>
              <tr>
                <td>Time Frame: {formatTimeFrame(this.state.row.timeFrame)}</td>
              </tr>
              <tr>
                <td>Travel Distance: {this.formatDistance()}</td>
              </tr>
              <tr>
                <td>{this.getLeadStatus()}</td>
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
        <>
          <TableCell>
            <IconButton aria-label="expand row" size="small">
              {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{this.state.row.serviceName}</TableCell>
          <TableCell>{formatDate(this.state.row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{formatTimeFrame(this.state.row.timeFrame)}</TableCell>
          <TableCell>{this.formatDistance()}</TableCell>
          <TableCell>{this.getLeadStatus()}</TableCell>
        </>
      );
    }

    return content;
  }

  getAlertContent = () => {
    let content = null;

    if (this.props.row.isCommitted) {
      content = <Alert className="alert-msg" severity="info" color="info">Waiting on the customer to make their decision.</Alert>;
    }
    else if (this.props.row.isInterested) {
      content = <Alert className="alert-msg" severity="info" color="info">We advise that you visit the customer before committing to this job.</Alert>;
    }

    return content;
  }

  getUIContent = () => {
    let content = null;

    if (this.props.userType !== 1) {
      return;
    }

    if (this.state.row.isInterested === null) {
      content = (
        <div className="button-container">
          <Button
            style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
            onClick={() => this.claimLead(true)}
            variant="contained"
          >
            I'M INTERESTED
          </Button>
          <Button
            style={{ fontWeight: "bold" }}
            onClick={this.dismissLead}
            variant="contained"
            color="secondary"
          >
            NO THANKS
          </Button>
        </div>
      )
    }
    else if (this.state.row.isCommitted === null) {
      content = (
        <div className="button-container">
          <Button
            style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
            onClick={() => this.claimLead(true)}
            variant="contained"
          >
            I'M COMMITTED
          </Button>
          <Button
            style={{ fontWeight: "bold" }}
            onClick={this.dismissLead}
            variant="contained"
            color="secondary"
          >
            NO THANKS
          </Button>
        </div>
      )
    }

    return content;
  }

  render() {
    return (
      <>
        <TableRow onClick={() => this.setState({ open: !this.state.open })} style={{ cursor: "pointer" }}>
          {this.getRowContent()}
        </TableRow>
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={6}>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <div className="job-details">
                  <div className="job-details-column job-details-column-1">
                    <Card className="job-details-card">
                      <p className="item-title">LEAD ID</p>
                      {this.state.row.leadId}
                      <p className="item-title">SERVICE</p>
                      {this.state.row.serviceName}
                      <p className="item-title">CREATION DATE</p>
                      <span className="item-with-icon">
                        <FaRegCalendarAlt className="item-icon" size={16} />
                        {formatDate(this.state.row.creationDate.split(" ")[0])}
                      </span>
                      <p className="item-title">LOCATION</p>
                      {this.state.row.address}, {this.state.row.city}, {this.state.row.province}, {this.state.row.postalCode}
                      <p className="item-title">DESCRIPTION</p>
                      {this.state.row.description}
                      <p className="item-title">BUDGET</p>
                      <span className="item-with-icon">
                        <FaFileInvoiceDollar className="item-icon" size={16} />
                        {formatBudget(this.state.row.budget)}
                      </span>
                      <p className="item-title">TIME FRAME</p>
                      <span className="item-with-icon">
                        <FaRegClock className="item-icon" size={16} />
                        {formatTimeFrame(this.state.row.timeFrame)}
                      </span>
                      <p className="item-title">TRAVEL DISTANCE</p>
                      <span className="item-with-icon">
                        <FaRoute className="item-icon" size={16} />
                        {this.formatDistance()}
                      </span>
                    </Card>
                  </div>
                  <div className="job-details-column job-details-column-2">
                    {this.props.userType !== 3 && (
                      <Card style={{ background: "#fff5d1", border: "1px solid #e8daa2" }} className="job-details-card">
                        <p className="item-title">SUPPORT CONTACT</p>
                        <span className="item-with-icon">
                          <FaUser className="item-icon" size={16} />
                          Christopher Willick
                        </span>
                        <span className="item-with-icon">
                          <FaPhone className="item-icon" size={16} />
                          {formatPhoneNumber("9056017247")}
                        </span>
                        <span className="item-with-icon">
                          <FaAt className="item-icon" size={16} />
                          <a href="mailto:trustedtradesmen@gmail.com">trustedtradesmen@gmail.com</a>
                        </span>
                      </Card>
                    )}
                    {(this.props.userType !== 1 || this.state.row.isInterested) && (
                      <Card className="job-details-card">
                        <p className="item-title">CUSTOMER DETAILS</p>
                        <span className="item-with-icon">
                          <FaUser className="item-icon" size={16} />
                          {this.state.row.customerName ? this.state.row.customerName : <span style={{ color: "grey", fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaPhone className="item-icon" size={16} />
                          {this.state.row.customerPhone ? formatPhoneNumber(this.state.row.customerPhone) : <span style={{ color: "grey", fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaAt className="item-icon" size={16} />
                          <a href={"mailto:" + this.state.row.customerEmail}>{this.state.row.customerEmail}</a>
                        </span>
                      </Card>
                    )}
                    {this.props.userType !== 1 && (
                      <Card className="job-details-card">
                        <p className="item-title">CONTRACTOR DETAILS</p>
                        <span className="item-with-icon">
                          <FaRegBuilding className="item-icon" size={16} />
                          {this.state.row.contractorCompany}&nbsp;&nbsp;
                            <a className="item-with-icon" href={"/contractors/" + this.state.row.contractorId} rel="noopener noreferrer" target="_blank">
                            <FaExternalLinkAlt size={14} />
                          </a>
                        </span>
                        <span className="item-with-icon">
                          <FaUser className="item-icon" size={16} />
                          {this.state.row.contractorName ? this.state.row.contractorName : <span style={{ color: "grey", fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaPhone className="item-icon" size={16} />
                          {this.state.row.contractorPhone ? formatPhoneNumber(this.state.row.contractorPhone) : <span style={{ color: "grey", fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaAt className="item-icon" size={16} />
                          <a href={"mailto:" + this.state.row.contractorEmail}>{this.state.row.contractorEmail}</a>
                        </span>
                      </Card>
                    )}
                  </div>
                </div>
                {this.props.userType === 1 && (
                  <>
                    {this.getAlertContent()}
                    {this.getUIContent()}
                  </>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

class LeadsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: AuthService.getRole(),
      leads: null,
      leadCount: null,
      pageNumber: 0,
      itemsPerPage: 10,
      isLoading: true,
      sortDateDesc: true,
      // showSnackbar: false,
      isError: false,
      message: "",
      isOpen: false,
      modalContent: {
        title: null,
        content: null,
        actions: null
      }
    };
  }

  componentDidMount() {
    this.getLeads();
  }

  // TODO: Replace
  componentWillReceiveProps(newProps) {
    if (this.props.location.key !== newProps.location.key) {
      // Make call to getLeads() if props change
      this.getLeads();
    }
  }

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
      .catch(() => {
        // this.setMessage(true, "Unable to retrieve leads");
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

  setDialog = (content) => {
    this.setState({
      modalContent: {
        title: content.title,
        content: content.content,
        actions: content.actions
      }
    });
  }

  handleOpen = () => {
    this.setState({ isOpen: true });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  // setMessage = (isError, message) => {
  //   this.setState({
  //     showSnackbar: true,
  //     isError: isError,
  //     message: message
  //   });
  // }

  // toggleSnackbar = () => {
  //   this.setState({ showSnackbar: !this.state.showSnackbar });
  // };

  render() {
    return (
      <div className="page-container">
        <>
          {this.state.userType === 3 ? <Title>All Leads</Title> : <Title>My Leads</Title>}
          {this.state.leadCount > 0 && !this.state.isLoading && (
            <ThemeProvider theme={tableTheme}>
              <TableContainer className="desktop-table" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "10px" }}>
                      </TableCell>
                      <TableCell>
                        SERVICE
                        </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ paddingRight: "5px" }}>CREATION DATE</span>
                          <IconButton onClick={this.toggleSortDate} aria-label="expand row" size="small">
                            {this.state.sortDateDesc ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell>
                        TIME FRAME
                        </TableCell>
                      <TableCell>
                        TRAVEL DISTANCE
                        </TableCell>
                      <TableCell style={{ width: "210px" }}>
                        STATUS
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
                        setDialog={this.setDialog}
                        handleOpen={this.handleOpen}
                        handleClose={this.handleClose}
                      // setMessage={this.setMessage}
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
                        setDialog={this.setDialog}
                        handleOpen={this.handleOpen}
                        handleClose={this.handleClose}
                      // setMessage={this.setMessage}
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
          )}
        </>

        {this.state.leadCount === 0 && !this.state.isLoading && (
          <>
            <Alert style={{ marginBottom: "20px" }} severity="info" color="info">You don't have any leads at the moment.</Alert>
            <div style={{ justifyContent: "space-around" }} className="button-container">
              <Button
                style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold", marginRight: "0px" }}
                onClick={() => window.location.href = "/jobs"}
                variant="contained"
              >
                MY JOBS
              </Button>
            </div>
          </>
        )}

        <ResponsiveDialog
          isOpen={this.state.isOpen}
          modalContent={this.state.modalContent}
          handleClose={this.handleClose}
        />

        {this.state.isLoading && <Backdrop />}

        {/* <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={5000}
          onClose={this.toggleSnackbar}
        >
          <AlertPopup onClose={this.toggleSnackbar} severity={this.state.isError ? "error" : "success"}>
            {this.state.message}
          </AlertPopup>
        </Snackbar> */}
      </div>
    );
  }
}

export default LeadsPage;
