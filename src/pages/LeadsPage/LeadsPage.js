import React, { Component } from "react";

import { LeadsService } from "../../services/leads";
import { AuthService } from "../../services/auth";
import { AccountService } from "../../services/account";
import { formatNumber, formatPhoneNumber, formatDate, formatTimeFrame, formatBudget, hasRequiredFields, hasExtraFields } from '../../helpers/Utils';

import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import {
  FaFileInvoiceDollar, FaRegClock, FaRegCalendarAlt, FaRoute, FaRegBuilding,
  FaExternalLinkAlt, FaAt, FaPhone, FaUser, FaSortAmountDown, FaSortAmountUp
} from "react-icons/fa";
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
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import ResponsiveDialog from "../../components/ResponsiveDialog";
import CustomAlert from "../../components/UI/CustomAlert";
import Instructions from "../../components/Instructions";
// import MuiAlert from "@material-ui/lab/Alert";
// import Snackbar from "@material-ui/core/Snackbar";

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
  timeFrames = [1, 2, 4, 8, 12, 24, 48];

  state = {
    row: this.props.row,
    open: false,
    invoiceQuote: '',
    timeFrameQuote: null
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      row: newProps.row
    });
  }

  submitQuote = () => {
    let body = {
      leadId: this.state.row.leadId,
      jobId: this.state.row.jobId,
      invoiceQuote: this.state.invoiceQuote,
      timeFrameQuote: this.state.timeFrameQuote
    };

    LeadsService.submitQuote(body)
      .then(() => {
        this.props.getLeads(true);
        // this.props.setMessage(false, "Lead successfully updated");
      })
      .catch(() => {
        // this.props.setMessage(true, "Unable to update lead");
      });

    this.props.handleClose();
  }

  claim = () => {
    let body = {
      leadId: this.state.row.leadId,
      jobId: this.state.row.jobId
    };

    LeadsService.claim(body)
      .then(() => {
        this.props.getLeads(true);
        // this.props.setMessage(false, "Lead successfully updated");
      })
      .catch(() => {
        // this.props.setMessage(true, "Unable to update lead");
      });

    this.props.handleClose();
  }

  dismiss = () => {
    let body = {
      leadId: this.state.row.leadId,
    };

    if (this.state.row.isClaimed) {
      body.jobId = this.state.row.jobId;

      LeadsService.dismissClaimed(body)
        .then(() => {
          this.props.getLeads(true);
          // this.props.setMessage(false, "Lead successfully updated");
        })
        .catch(() => {
          // this.props.setMessage(true, "Unable to update lead");
        });
    }
    else {
      LeadsService.dismiss(body)
        .then(() => {
          this.props.getLeads(true);
          // this.props.setMessage(false, "Lead successfully updated");
        })
        .catch(() => {
          // this.props.setMessage(true, "Unable to update lead");
        });
    }

    this.props.handleClose();
  }

  confirmDismissal = () => {
    let modalContent = {
      title: `Confirm Dismissal`,
      content: `Are you sure you wish to dismiss this lead? It will be removed from your feed.`,
      actions: <>
        <Button onClick={this.dismiss}>
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

  formatDistance = () => {
    let content = "N/A";

    if (this.state.row.travelDistance !== null) {
      content = `${this.state.row.travelDistance} km`;
    }

    return content;
  }

  getLeadStatus = () => {
    let status = null;

    if (this.state.row.isClaimed === false || this.state.row.isCommitted === false) {
      status = (
        <Chip className="status cancelled" label="Dismissed" />
      );
    }
    else if (!this.state.row.isActive) {
      status = (
        <Chip className="status cancelled" label="Deactivated" />
      );
    }
    else if (this.state.row.isCommitted) {
      status = (
        <Chip className="status required" label="Awaiting Approval" />
      );
    }
    else if (this.state.row.isClaimed) {
      status = (
        <Chip className="status completed" label="Interested" />
      );
    }
    else if (this.state.row.isLocked) {
      status = (
        <Chip className="status cancelled" label="Locked" />
      );
    }
    else {
      let statusVerbiage = '';

      if (this.props.userType === 1) {
        statusVerbiage = "Expires In " + this.state.row.unclaimedHoursRemaining + " Hours";
      }
      else {
        statusVerbiage = "Waiting For Response";
      }

      status = (
        <Chip className="status waiting" label={statusVerbiage} />
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
                <td>Distance: {this.formatDistance()}</td>
              </tr>
              <tr>
                <td>Desired Time Frame: {formatTimeFrame(this.state.row.customerTimeFrame)}</td>
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
          <TableCell>{this.formatDistance()}</TableCell>
          <TableCell>{formatTimeFrame(this.state.row.customerTimeFrame)}</TableCell>
          <TableCell>{formatDate(this.state.row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{this.getLeadStatus()}</TableCell>
        </>
      );
    }

    return content;
  }

  getAlertContent = () => {
    let content = null;

    if (this.props.row.isLocked) {
      content = <Alert className="alert-msg" severity="info" color="info">Sorry, other contractors have already claimed this job. We'll let you know if it frees up again.</Alert>;
    }
    else if (this.props.row.isCommitted) {
      content = <Alert className="alert-msg" severity="info" color="info">Waiting on the customer to make their decision.</Alert>;
    }
    else if (this.props.row.isClaimed) {
      content = <Alert className="alert-msg" severity="info" color="info">We advise that you visit the customer before committing to this job.</Alert>;
    }

    return content;
  }

  getUIContent = () => {
    let content = null;

    if (this.props.userType !== 1) {
      return;
    }

    if (this.state.row.isClaimed === null) {
      content = (
        <div className="button-container">
          <Button
            // style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
            onClick={this.claim}
            variant="contained"
            color="primary"
            disabled={this.state.row.isLocked}
          >
            I'M INTERESTED
          </Button>
          <Button
            style={{ fontWeight: "bold" }}
            onClick={this.confirmDismissal}
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
        <>
          <div className="textfield-container-col">
            <TextField
              required
              type="text"
              name="invoiceQuote"
              label="Invoice Quote"
              value={this.state.invoiceQuote}
              variant="outlined"
              error={isNaN(this.state.invoiceQuote)}
              // helperText="Must be a number"
              onChange={event => {
                this.setState(
                  { invoiceQuote: event.target.value }
                );
              }}
            />
          </div>
          <div className="textfield-container-col">
            <TextField
              required
              select
              name="customerTimeFrame"
              label="Time Frame Quote"
              variant="outlined"
              required
              value={this.state.timeFrameQuote || ""}
              onChange={event => {
                this.setState({ timeFrameQuote: event.target.value })
              }}
            >
              {this.timeFrames.map(option => (
                <MenuItem key={option} value={option}>
                  {formatTimeFrame(option)}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="button-container">
            <Button
              // style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
              onClick={this.submitQuote}
              variant="contained"
              color="primary"
              disabled={this.state.invoiceQuote.length === 0 || isNaN(this.state.invoiceQuote) || this.state.timeFrameQuote === null}
            >
              SUBMIT QUOTE
          </Button>
            <Button
              style={{ fontWeight: "bold" }}
              onClick={this.confirmDismissal}
              variant="contained"
              color="secondary"
            >
              DECLINE JOB
          </Button>
          </div>
        </>
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
              <Box margin={1.5}>
                <div className="job-details">
                  <div className="job-details-column job-details-column-1">
                    <p className="item-title" style={{ marginTop: "0px" }}>SERVICE</p>
                    {this.state.row.serviceName}
                    <p className="item-title">SUBMITTED</p>
                    <span className="item-with-icon">
                      <FaRegCalendarAlt className="item-icon" size={16} />
                      {formatDate(this.state.row.creationDate.split(" ")[0])}
                    </span>
                    <p className="item-title">LOCATION</p>
                    {this.state.row.address}, {this.state.row.city}, {this.state.row.province}, {this.state.row.postalCode}
                    <p className="item-title">DISTANCE</p>
                    <span className="item-with-icon">
                      <FaRoute className="item-icon" size={16} />
                      {this.formatDistance()}
                    </span>
                    <p className="item-title">DESCRIPTION</p>
                    <div className="multi-line-container">{this.state.row.description}</div>
                    <p className="item-title">DESIRED TIME FRAME</p>
                    <span className="item-with-icon">
                      <FaRegClock className="item-icon" size={16} />
                      {formatTimeFrame(this.state.row.customerTimeFrame)}
                    </span>
                    <p className="item-title">BUDGET</p>
                    <span className="item-with-icon">
                      <FaFileInvoiceDollar className="item-icon" size={16} />
                      {formatBudget(this.state.row.budget)}
                    </span>
                    {this.state.row.isCommitted && (
                      <>
                        <p className="item-title">QUOTED TIME FRAME</p>
                        <span className="item-with-icon">
                          <FaRegClock className="item-icon" size={16} />
                          {formatTimeFrame(this.state.row.timeFrameQuote)}
                        </span>
                        <p className="item-title">QUOTED INVOICE</p>
                        <span className="item-with-icon">
                          <FaFileInvoiceDollar className="item-icon" size={16} />
                          ${formatNumber((this.state.row.invoiceQuote * 1.00).toFixed(2))}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="job-details-column job-details-column-2">
                    {this.props.userType !== 3 && (
                      <Card className="job-details-card" style={{ background: "#fff8df", border: "1px solid #e8daa2" }}>
                        <p className="item-title">HAVE QUESTIONS? CONTACT US</p>
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
                    {(this.props.userType !== 1 || this.state.row.isClaimed) && (
                      <Card className="job-details-card">
                        <p className="item-title">CUSTOMER INFO</p>
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
                        <p className="item-title">CONTRACTOR INFO</p>
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
      contractorDetails: null,
      leadCount: null,
      pageNumber: 0,
      itemsPerPage: 10,
      isLoading: true,
      sortDateDesc: null,
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

  getContractorDetails = () => {
    AccountService.getAccountDetails()
      .then(res => {
        this.setState({ contractorDetails: res.data });
      })
      .catch(error => {
        // this.setMessage(true, "Unable to obtain account details");
      });
  }

  getLeads = (loadFirstPage = false) => {
    var pageNumberToLoad = loadFirstPage ? 0 : this.state.pageNumber;

    LeadsService.getLeads(pageNumberToLoad + 1, this.state.itemsPerPage, this.state.sortDateDesc)
      .then(res => {
        if (this.state.userType === 1 && res.data.leads.length === 0) {
          this.getContractorDetails();
        }

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

  toggleSortDate = () => {
    this.setState({
      pageNumber: 0,
      sortDateDesc: this.state.sortDateDesc ? !this.state.sortDateDesc : true
    }, () => {
      this.getLeads(true);
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
                        DISTANCE
                      </TableCell>
                      <TableCell>
                        DESIRED TIME FRAME
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ paddingRight: "4px" }}>SUBMITTED</span>
                          <IconButton onClick={this.toggleSortDate} aria-label="expand row" size="small">
                            {this.state.sortDateDesc ? <FaSortAmountUp style={{ color: "#444444" }} size={15} /> :
                              <FaSortAmountDown style={{ color: "#444444" }} size={15} />}
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell style={{ width: "210px" }}>
                        LEAD STATUS
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
        {this.state.userType === 1 && this.state.leadCount === 0 && !this.state.isLoading && (
          <>
            {this.state.contractorDetails !== null && (!hasRequiredFields(this.state.contractorDetails) || !hasExtraFields(this.state.contractorDetails)) && (
              <CustomAlert type={"warning"} title={"Wait! You're missing some key information"}>
                <Instructions contractorDetails={this.state.contractorDetails} />
              </CustomAlert>
            )}
          </>
        )}
        {this.state.userType !== 0 && this.state.leadCount === 0 && !this.state.isLoading
          && (this.state.userType === 3 || (this.state.userType === 1 && this.state.contractorDetails !== null && hasRequiredFields(this.state.contractorDetails) && hasExtraFields(this.state.contractorDetails))) && (
            <>
              <CustomAlert type={"info"} title={"No Leads Found"}>
                <div style={{ textAlign: "center" }}>You don't have any leads at the moment.</div>
              </CustomAlert>
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
