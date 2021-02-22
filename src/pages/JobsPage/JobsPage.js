import React, { Component } from "react";

import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import ResponsiveDialog from "../../components/ResponsiveDialog";
import { formatPhoneNumber, formatDate, formatNumber } from '../../helpers/Utils';

import "./JobsPage.css";

import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import {
  FaFileInvoiceDollar, FaRegClock, FaAt, FaPhone, FaUser, FaRegCalendarAlt, FaRegBuilding,
  FaExternalLinkAlt, FaCheckCircle, FaTimesCircle, FaMinusCircle, FaSearch, FaSync
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
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
// import MuiAlert from "@material-ui/lab/Alert";
// import Snackbar from "@material-ui/core/Snackbar";

var tableTheme = createMuiTheme({
  overrides: {
    MuiTableContainer: {
      root: {
        maxWidth: "100%",
        margin: "auto",
        border: "1px solid rgba(224, 224, 224, 1)",
        borderRadius: "0",
        boxShadow: "none",
        boxSizing: "border-box"
      }
    },
    MuiTableCell: {
      root: {
        padding: "10px"
      }
    }
  }
});

// function AlertPopup(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export class Row extends Component {
  hstValue = 0.13;
  invoiceThreshold = 5000;
  requiresInspection = parseInt(this.props.row.invoicePrice) >= this.invoiceThreshold;
  holdingFee = this.props.row.invoicePrice * 0.15;
  holdingFeeHst = this.holdingFee * this.hstValue;
  invoicePriceHst = this.props.row.invoicePrice * this.hstValue;

  state = {
    row: this.props.row,
    open: false,
    notes: this.getNotes,
    invoicePrice: 0,
    completionDate: "",
    contractor: this.props.row.contractors && this.props.row.contractors.length > 0 ? this.props.row.contractors[0].contractorId : null,
    inspectionPassed: null,
    reportSent: false
  };

  componentWillReceiveProps(newProps) {
    this.requiresInspection = parseInt(newProps.row.invoicePrice) >= this.invoiceThreshold;
    this.holdingFee = newProps.row.invoicePrice * 0.15;
    this.holdingFeeHst = this.holdingFee * this.hstValue;
    this.invoicePriceHst = newProps.row.invoicePrice * this.hstValue;

    this.setState({
      row: newProps.row,
      notes: this.getNotes,
      invoicePrice: 0,
      completionDate: "",
      contractor: newProps.row.contractors && newProps.row.contractors.length > 0 ? newProps.row.contractors[0].contractorId : null,
      inspectionPassed: null,
      reportSent: false
    });
  }

  getNotes = () => {
    if (this.props.userType === 1) {
      return this.state.row.contractorNotes;
    }
    else if (this.props.userType === 2) {
      return this.state.row.inspectorNotes;
    }
    else {
      return "";
    }
  }

  claimJob = () => {
    let body = { jobId: this.state.row.jobId };

    if (this.state.contractor !== null) {
      body.contractorId = this.state.contractor;
    }

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Contractor successfully hired");
      })
      .catch(err => {
        // this.props.setMessage(true, "Unable to hire Contractor");
      });

    this.props.handleClose();
  }

  cancelJob = () => {
    let body = { jobId: this.state.row.jobId, isAbandoned: true };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Job successfully cancelled");
      })
      .catch(err => {
        // this.props.setMessage(true, "Unable to cancel Job");
      });

    this.props.handleClose();
  }

  acceptInvoice = (isAccepted) => {
    let body = { jobId: this.state.row.jobId, invoiceAccepted: isAccepted };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Invoice successfully accepted");
      })
      .catch(err => {
        // this.props.setMessage(false, "Unable to accept invoice");
      });

    this.props.handleClose();
  }

  sendInvoice = () => {
    let body = {
      jobId: this.state.row.jobId,
      invoicePrice: this.state.invoicePrice
    };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Invoice successfully sent");
      })
      .catch(err => {
        // this.props.setMessage(false, "Unable to send invoice");
      });
  }

  paymentReceived = () => {
    let body = {
      jobId: this.state.row.jobId,
    };

    if (this.props.userType === 1) {
      body.invoicePaid = 1;
    }
    else {
      body.holdingFeePaid = 1;
    }

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Successfully updated invoice status");
      })
      .catch(err => {
        // this.props.setMessage(false, "Unable to update invoice status");
      });
  }

  completeJob = () => {
    let body = null;

    if (this.props.userType === 1) {
      body = {
        jobId: this.state.row.jobId,
        contractorNotes: this.state.notes,
        completionDate: this.state.completionDate
      };
    }
    else if (this.props.userType === 2) {
      body = {
        jobId: this.state.row.jobId,
        inspectionPassed: this.state.inspectionPassed === "true" ? true : false,
        inspectionDate: this.state.completionDate
      };

      if (this.state.inspectionPassed === "false") {
        body.inspectorNotes = this.state.notes;
      }
    }

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Successfully completed job");
      })
      .catch(err => {
        // this.props.setMessage(false, "Unable to complete job");
      });
  }

  setModal = modalType => {
    var modalContent;

    if (modalType === 0) {
      modalContent = {
        title: 'Confirm Hire',
        content: 'Are you sure you wish to hire the selected contractor?',
        actions: <>
          <Button onClick={this.claimJob}>
            Yes
          </Button>
          <Button onClick={this.props.handleClose}>
            No
          </Button>
        </>
      };
    }
    else if (modalType === 1) {
      modalContent = {
        title: 'Confirm Cancellation',
        content: 'Are you sure you wish to cancel this job? This action cannot be undone.',
        actions: <>
          <Button onClick={this.cancelJob}>
            Yes
          </Button>
          <Button onClick={this.props.handleClose}>
            No
          </Button>
        </>
      };
    }
    else {
      let verbiage = this.state.userType === 1 ? "Holding Fee" : "Payment";

      modalContent = {
        title: `Confirm Received ${verbiage}`,
        content: `Are you sure you've received the ${verbiage.toLowerCase()} for this job?`,
        actions: <>
          <Button onClick={this.paymentReceived}>
            Yes
          </Button>
          <Button onClick={this.props.handleClose}>
            No
          </Button>
        </>
      };
    }

    this.props.setDialog(modalContent);
    this.props.handleOpen();
  }

  getUIContent = () => {
    let content = null;

    if (this.props.userType === 0) {
      // CUSTOMER
      if (this.state.row.contractors && this.state.row.contractors.length > 0) {
        content = (
          <>
            {this.state.row.contractors.length === 1 ? (
              <Alert severity="info" color="info">A contractor has shown an interest in your job!</Alert>
            ) : (
                <Alert severity="info">
                  <b>{this.state.row.contractors.length}</b> contractors have shown an interest in your job!
                </Alert>
              )}
            <div className="textfield-container-col" style={{ marginTop: "15px" }}>
              <TextField
                select
                name="contractor"
                value={this.state.contractor || this.state.row.contractors[0].contractorId}
                onChange={event => {
                  this.setState({ contractor: event.target.value })
                }}
                variant="outlined"
              >
                {this.state.row.contractors.map(option => (
                  <MenuItem key={option.contractorId} value={option.contractorId}>
                    {option.companyName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="button-container multi-button">
              <Button
                style={{ fontWeight: "bold" }}
                onClick={() => window.open("/contractors/" + this.state.contractor)}
                variant="contained"
                color="primary"
              >
                VIEW PROFILE
              </Button>
              <Button
                style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
                onClick={() => this.setModal(0)}
                variant="contained"
              >
                HIRE CONTRACTOR
              </Button>
              <div className="spacer" />
              <Button
                style={{ margin: "0", background: "#2f2f2f", fontWeight: "bold" }}
                onClick={() => this.setModal(1)}
                variant="contained"
              >
                CANCEL JOB
              </Button>
            </div>
          </>
        );
      }
      else if (this.state.row.invoicePrice && this.state.row.invoiceAccepted === null) {
        content = (
          <>
            <Alert severity="info" color="info">The contractor has suggested an invoice of <b>${formatNumber((this.state.row.invoicePrice * 1.00).toFixed(2))}</b> (HST not included).</Alert>
            <div className="button-container">
              <Button
                style={{ background: "#3bb13b", color: "white", fontWeight: "bold" }}
                variant="contained"
                onClick={() => this.acceptInvoice(true)}
                color="primary"
              >
                ACCEPT
              </Button>
              <Button
                style={{ fontWeight: "bold" }}
                variant="contained"
                onClick={() => this.acceptInvoice(false)}
                color="secondary"
              >
                DECLINE
              </Button>
              <div className="spacer" />
              <Button
                style={{ margin: "0", background: "#2f2f2f", fontWeight: "bold" }}
                onClick={() => this.setModal(1)}
                variant="contained"
                color="secondary"
              >
                CANCEL JOB
              </Button>
            </div>
          </>
        );
      }
      else if (this.state.row.contractorId === null || this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === "0") {
        content = (
          <div className="button-container">
            <div className="spacer" />
            <Button
              style={{ margin: "0", background: "#2f2f2f", fontWeight: "bold" }}
              onClick={() => this.setModal(1)}
              variant="contained"
              color="secondary"
            >
              CANCEL JOB
            </Button>
          </div >
        );
      }
    }
    else if (this.props.userType === 1) {
      // CONTRACTOR
      if (this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === "0") {
        content = (
          <>
            {this.state.row.invoiceAccepted === "0" && (
              <Alert severity="error" color="error">The customer rejected your invoice of $<b>{this.state.row.invoicePrice}</b>. Please enter a new price.</Alert>
            )}
            <div className="textfield-container-col" style={{ marginTop: "15px" }}>
              <span className="field-desc">Enter the invoice price. This will have to be confirmed by the customer.</span>
              <TextField
                type="text"
                name="invoicePrice"
                label="Invoice Price"
                value={this.state.invoicePrice}
                variant="outlined"
                onChange={event => {
                  this.setState(
                    { invoicePrice: event.target.value }
                  );
                }}
              />
            </div>
            <div className="button-container">
              <Button
                style={{ fontWeight: "bold" }}
                variant="contained"
                onClick={() => this.sendInvoice()}
                disabled={this.state.invoicePrice === 0 || !this.state.invoicePrice}
                color="primary"
              >
                SEND INVOICE
              </Button>
            </div>
          </>
        );
      }
      else if (this.state.row.invoiceAccepted === "1"
        && this.state.row.holdingFeePaid
        && (this.state.row.completionDate === null || this.state.row.inspectionPassed === "0")) {
        content = (
          <>
            {this.requiresInspection && (
              <>
                <span className="field-desc">Record any relevant notes to pass onto the inspector.</span>
                <div className="textfield-container-col">
                  <TextField
                    multiline
                    rowsMax={6}
                    type="text"
                    label="Notes"
                    value={this.state.notes}
                    variant="outlined"
                    onChange={event => {
                      this.setState({ notes: event.target.value });
                    }}
                  />
                </div>
              </>
            )}
            <span className="field-desc">Record the date when the job was completed.</span>
            <div className="textfield-container-col">
              <TextField
                type="date"
                value={this.state.completionDate}
                onChange={event => {
                  this.setState({ completionDate: event.target.value });
                }}
                style={{ width: "175px", marginRight: "20px" }}
              />
            </div>
            <div className="button-container">
              <Button
                style={{ fontWeight: "bold" }}
                variant="contained"
                onClick={() => this.completeJob()}
                disabled={this.state.completionDate === ""}
                color="primary"
              >
                SUBMIT
              </Button>
            </div>
          </>
        );
      }
      else if (this.state.row.invoicePaid === null
        && ((this.state.row.completionDate !== null && !this.requiresInspection) || this.state.row.inspectionPassed)) {
        content = (
          <>
            <Alert severity="info" color="info">The remainder of the invoice <b>${formatNumber((this.state.row.invoicePrice * 1.00 + this.invoicePriceHst) - (this.holdingFee * 1.00 + this.holdingFeeHst))}</b> is owed by the customer.</Alert>
            <div className="button-container">
              <Button
                style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
                variant="contained"
                onClick={() => this.setModal(2)}
              >
                PAYMENT RECEIVED
              </Button>
            </div>
          </>
        );
      }
    }
    else if (this.props.userType === 2) {
      // INSPECTOR
      if (this.state.row.inspectorId === null) {
        content = (
          <div className="button-container">
            <Button
              style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
              variant="contained"
              onClick={() => this.claimJob()}
            >
              CLAIM JOB
            </Button>
          </div>
        );
      }
      else if (this.state.row.completionDate !== null && this.state.row.inspectionPassed === null) {
        content = (
          <RadioGroup
            value={this.state.inspectionPassed}
            onChange={event => {
              this.setState({ inspectionPassed: event.target.value });
            }}
          >
            <span style={{ marginBottom: "5px" }}>Did the job pass inspection?</span>
            <span style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </span>
          </RadioGroup>
        );

        if (this.state.inspectionPassed !== null) {
          if (this.state.inspectionPassed === "false") {
            content = (
              <>
                {content}
                <span className="field-desc">Record any relevant notes to pass back to the contractor.</span>
                <div className="textfield-container-col">
                  <TextField
                    multiline
                    rowsMax={6}
                    type="text"
                    label="Notes"
                    value={this.state.notes}
                    variant="outlined"
                    onChange={event => {
                      this.setState({ notes: event.target.value });
                    }}
                  />
                </div>
              </>
            );
          }

          content = (
            <>
              {content}
              <span className="field-desc">Record the date when the inspection was completed.</span>
              <div className="textfield-container-col">
                <TextField
                  type="date"
                  value={this.state.completionDate}
                  onChange={event => {
                    this.setState({ completionDate: event.target.value });
                  }}
                  style={{
                    width: "175px",
                    marginRight: "20px"
                  }}
                />
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      if (event.target.checked) {
                        this.setState({ reportSent: true });
                      }
                      else {
                        this.setState({ reportSent: false });
                      }
                    }}
                    checked={this.state.reportSent}
                  />
                }
                label="I have filled out an inspection report"
              />
              <div className="button-container">
                <Button
                  variant="contained"
                  onClick={() => this.completeJob()}
                  disabled={this.state.completionDate === "" || !this.state.reportSent}
                  color="primary"
                >
                  SUBMIT
                </Button>
              </div>
            </>
          );
        }
      }
    }
    else if (this.props.userType === 3) {
      // ADMIN
      if (this.state.row.invoiceAccepted === "1" && this.state.row.holdingFeePaid === null) {
        content = (
          <>
            <Alert severity="info" color="info">A holding fee of <b>${formatNumber(this.holdingFeeHst.toFixed(2))}</b> is owed by the customer.</Alert>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => this.setModal(2)}
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                PAYMENT RECEIVED
              </Button>
            </div>
          </>
        );
      }
    }
    return content;
  }

  getJobStatus = () => {
    let status = null;

    if (this.state.row.isAbandoned === "1") {
      status = <Chip style={{ borderRadius: "5px" }} className="status cancelled" label="Job Cancelled" />;
    }
    else if (this.state.row.contractorId === null) {
      if (this.state.row.contractors && this.state.row.contractors.length > 0) {
        status = (
          <Chip style={{ borderRadius: "5px" }} className="status interested" label={this.state.row.contractors.length === 1 ?
            <span><b>1</b> Contractor Interested</span> :
            <span><b>{this.state.row.contractors.length}</b> Contractors Interested</span>
          } />
        );
      }
      else {
        status = (
          <Chip style={{ borderRadius: "5px" }} className="status required" label="Contractor Required" />
        );
      }
    }
    else if (this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === "0") {
      status = <Chip style={{ borderRadius: "5px" }} className="status required" label="Invoice Required" />;
    }
    else if (this.state.row.invoiceAccepted === null) {
      status = <Chip style={{ borderRadius: "5px" }} className="status required" label="Response Required" />;
    }
    else if (this.props.userType === "1" && this.state.row.invoiceAccepted === "0") {
      status = <Chip style={{ borderRadius: "5px" }} className="status in-progress" label="Invoice Rejected" />;
    }
    else if (this.state.row.holdingFeePaid === "1" && (this.state.row.completionDate === null || this.state.row.inspectionPassed === "0")) {
      status = <Chip style={{ borderRadius: "5px" }} className="status in-progress" label="Job In Progress" />;
    }
    else if (this.requiresInspection && (this.state.row.inspectorId === null || this.state.row.inspectionPassed === null || this.state.row.inspectionPassed === "0")) {
      if (this.state.row.inspectorId === null) {
        status = <Chip style={{ borderRadius: "5px" }} className="status required" label="Inspector Required" />;
      }
      else if (this.state.row.inspectionPassed === null) {
        status = <Chip style={{ borderRadius: "5px" }} className="status required" label="Requires Inspection" />;
      }
      else {
        status = <Chip style={{ borderRadius: "5px" }} className="status required" label="Requires Revisit" />;
      }
    }
    else if (this.state.row.holdingFeePaid === null || this.state.row.invoicePaid === null) {
      status = <Chip style={{ borderRadius: "5px" }} className="status required" label="Payment Required" />;
    }
    else {
      status = <Chip style={{ borderRadius: "5px" }} className="status completed" label="Completed" />;
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
                <td>{this.state.row.address}, {this.state.row.city}</td>
              </tr>
              <tr>
                <td>Date Created: {formatDate(this.state.row.creationDate.split(" ")[0])}</td>
              </tr>
              <tr>
                <td>{this.getJobStatus()}</td>
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
          <TableCell>{this.state.row.address}</TableCell>
          <TableCell>{this.state.row.city}</TableCell>
          <TableCell>{formatDate(this.state.row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{this.getJobStatus()}</TableCell>
        </>
      );
    }
    return content;
  }

  getAlertContent = () => {
    let content = null;

    if (this.state.row.isAbandoned === "1") {
      content = <Alert severity="error" color="error">The job was cancelled by the customer on {formatDate(this.state.row.lastUpdatedDate.split(" ")[0])}.</Alert>;
    }
    else if (this.props.userType === 0) {
      if (this.state.row.contractorId !== null && this.state.row.invoicePrice === null) {
        content = <Alert severity="info" color="info">Waiting for the contractor to submit an invoice.</Alert>;
      }
      if (this.state.row.contractorId !== null && this.state.row.invoiceAccepted === "0") {
        content = <Alert severity="info" color="info">Waiting for the contractor to submit a new invoice.</Alert>;
      }
      else if (this.state.row.holdingFeePaid === null && this.state.row.invoiceAccepted === "1") {
        content = <Alert severity="info" color="info">Please send the holding fee payment of <b>${formatNumber(this.holdingFeeHst.toFixed(2))}</b> ${formatNumber(this.holdingFee.toFixed(2))} + HST ({this.hstValue}%) to HOLDING_ACCOUNT_HERE.</Alert>;
      }
      else if (this.state.row.completionDate !== null && (!this.requiresInspection || (this.requiresInspection && this.state.row.inspectionPassed === "1"))) {
        if (this.state.row.invoicePaid === null) {
          content = <Alert severity="info" color="info">The job was completed on {formatDate(this.state.row.completionDate.split(" ")[0])}. Please send the remaining invoice payment of <b>${formatNumber((this.invoicePriceHst - this.holdingFeeHst).toFixed(2))}</b> (${this.state.row.invoicePrice} - Holding Fee + HST ({this.hstValue}%)) to the contractor.</Alert>;
        }
        else if (this.state.row.invoicePaid === "1") {
          content = <Alert severity="success" color="success">The job was completed on {formatDate(this.state.row.completionDate.split(" ")[0])} and the invoice payment has been processed.</Alert>;
        }
      }
    }
    else if (this.props.userType === 1) {
      if (this.state.row.invoicePrice !== null && this.state.row.invoiceAccepted === null) {
        content = <Alert severity="info" color="info">Waiting for the customer to confirm invoice.</Alert>;
      }
      else if (this.state.row.invoiceAccepted === "1" && this.state.row.holdingFeePaid === null) {
        content = <Alert severity="info" color="info">Waiting for the customer to pay the holding fee.</Alert>;
      }
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
            <Collapse in={this.state.open} timeout="auto">
              {/* <Collapse in={this.state.open} timeout="auto" unmountOnExit> */}
              <Box margin={1}>
                <div className="job-details">
                  <div className="job-details-column job-details-column-1">
                    <Card className="job-details-card">
                      <p className="item-title">JOB ID</p>
                      {this.state.row.jobId}
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
                        {this.state.row.budget}
                      </span>
                      <p className="item-title">TIME FRAME</p>
                      <span className="item-with-icon">
                        <FaRegClock className="item-icon" size={16} />
                        {this.state.row.timeFrame} Month(s)
                     </span>
                    </Card>
                    {this.state.row.invoicePrice && (
                      <Card className="job-details-card">
                        <p className="item-title">INVOICE DETAILS</p>
                        {this.state.row.invoiceAccepted === null ?
                          <span className="item-with-icon" style={{ color: "grey" }}>
                            <FaMinusCircle className="item-icon" style={{ color: "grey" }} size={16} />Pending Customer Approval
                          </span> :
                          this.state.row.invoiceAccepted === "1" ?
                            <span className="item-with-icon" style={{ color: "green" }}>
                              <FaCheckCircle className="item-icon" style={{ color: "green" }} size={16} />Accepted
                            </span> :
                            <span className="item-with-icon" style={{ color: "red" }}>
                              <FaTimesCircle className="item-icon" style={{ color: "red" }} size={16} />Declined
                            </span>
                        }
                        {this.state.row.invoiceAccepted && (
                          this.state.row.invoicePaid ?
                            <span className="item-with-icon" style={{ color: "green" }}>
                              <FaCheckCircle className="item-icon" style={{ color: "green" }} size={16} />Paid
                            </span> :
                            <span className="item-with-icon" style={{ color: "red" }}>
                              <FaTimesCircle className="item-icon" style={{ color: "red" }} size={16} />Not Paid
                            </span>
                        )}
                        <div className="fee-table-container">
                          <table className="fee-table">
                            <tbody>
                              <tr>
                                <td>Subtotal</td>
                                <td>${formatNumber((this.state.row.invoicePrice * 1.00).toFixed(2))}</td>
                              </tr>
                              <tr>
                                <td>HST ({this.hstValue}%)</td>
                                <td>${formatNumber((this.invoicePriceHst * 1.00).toFixed(2))}</td>
                              </tr>
                              <tr>
                                <td>Total</td>
                                <td>
                                  <span style={{ fontWeight: "bold", color: "red" }}>
                                    ${formatNumber(((this.state.row.invoicePrice * 1.00) + (this.invoicePriceHst * 1.00)).toFixed(2))}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {this.state.row.invoiceAccepted === "1" && (
                          <>
                            <p className="item-title">HOLDING FEE DETAILS</p>
                            {this.state.row.holdingFeePaid ?
                              <span className="item-with-icon" style={{ color: "green" }}>
                                <FaCheckCircle className="item-icon" style={{ color: "green" }} size={16} />Paid
                              </span> :
                              <span className="item-with-icon" style={{ color: "red" }}>
                                <FaTimesCircle className="item-icon" style={{ color: "red" }} size={16} />Not Paid
                              </span>
                            }
                            <div className="fee-table-container">
                              <table className="fee-table">
                                <tbody>
                                  <tr>
                                    <td>Subtotal</td>
                                    <td>${formatNumber(this.holdingFee.toFixed(2))}</td>
                                  </tr>
                                  <tr>
                                    <td>HST ({this.hstValue}%)</td>
                                    <td>${formatNumber(this.holdingFeeHst.toFixed(2))}</td>
                                  </tr>
                                  <tr>
                                    <td>Total</td>
                                    <td>
                                      <span style={{ fontWeight: "bold", color: "red" }}>
                                        ${formatNumber((this.holdingFee + this.holdingFeeHst).toFixed(2))}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </Card>
                    )}
                    {this.state.row.completionDate && (
                      <Card className="job-details-card">
                        <p className="item-title">JOB COMPLETION DATE</p>
                        <span className="item-with-icon">
                          <FaRegCalendarAlt className="item-icon" size={16} />
                          {formatDate(this.state.row.completionDate.split(" ")[0])}
                        </span>
                        {this.props.userType !== 0 && this.state.row.contractorNotes && (
                          <>
                            <p className="item-title">CONTRACTOR NOTES</p>
                            {this.state.row.contractorNotes}
                          </>
                        )}
                      </Card>
                    )}
                    {this.state.row.inspectionDate && (
                      <Card className="job-details-card">
                        <p className="item-title">INSPECTION DATE</p>
                        <span className="item-with-icon">
                          <FaRegCalendarAlt className="item-icon" size={16} />
                          {formatDate(this.state.row.inspectionDate.split(" ")[0])}
                        </span>
                        <p className="item-title">INSPECTION OUTCOME</p>
                        {this.state.row.inspectionPassed === "1" ?
                          <span className="item-with-icon" style={{ color: "green" }}>
                            <FaCheckCircle className="item-icon" style={{ color: "green" }} size={16} />Job Passed Inspection
                        </span> :
                          <span className="item-with-icon" style={{ color: "red" }}>
                            <FaTimesCircle className="item-icon" style={{ color: "red" }} size={16} />Job Failed Inspection
                        </span>
                        }
                        {this.props.userType !== 0 && this.state.row.inspectorNotes && (
                          <>
                            <p className="item-title">INSPECTOR NOTES</p>
                            {this.state.row.inspectorNotes}
                          </>
                        )}
                      </Card>
                    )}
                  </div>
                  {!(this.props.userType === 0 && this.state.row.contractorId === null) && (
                    <div className="job-details-column job-details-column-2">
                      {this.props.userType !== 0 && (
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
                      {this.props.userType !== 1 && this.state.row.contractorId && (
                        <Card className="job-details-card">
                          <p className="item-title">CONTRACTOR DETAILS</p>
                          <span className="item-with-icon">
                            <FaRegBuilding className="item-icon" size={16} />
                            {this.state.row.contractorCompany}&nbsp;
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
                      {this.props.userType !== 2 && this.state.row.inspectorId && (
                        <Card className="job-details-card">
                          <p className="item-title">INSPECTOR DETAILS</p>
                          <span className="item-with-icon">
                            <FaUser className="item-icon" size={16} />
                            {this.state.row.inspectorName ? this.state.row.inspectorName : <span style={{ color: "grey", fontStyle: "italic" }}>N/A</span>}
                          </span>
                          <span className="item-with-icon">
                            <FaPhone className="item-icon" size={16} />
                            {this.state.inspectorPhone ? formatPhoneNumber(this.state.row.inspectorPhone) : <span style={{ color: "grey", fontStyle: "italic" }}>N/A</span>}
                          </span>
                          <span className="item-with-icon">
                            <FaAt className="item-icon" size={16} />
                            <a href={"mailto:" + this.state.row.inspectorEmail}>{this.state.row.inspectorEmail}</a>
                          </span>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
                {this.getAlertContent()}
                {this.state.row.isAbandoned === null && this.getUIContent()}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

class JobsPage extends Component {
  state = {
    userType: null,
    jobs: null,
    jobCount: null,
    pageNumber: 0,
    itemsPerPage: 10,
    isLoading: true,
    sortDateDesc: null,
    addressFilterVal: "",
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

  componentDidMount() {
    this.setState({
      userType: AuthService.getRole()
    }, () => {
      this.getJobs();
    });
  }

  getJobs = (loadFirstPage = false) => {
    var pageNumberToLoad = loadFirstPage ? 0 : this.state.pageNumber;

    JobService.getJobs(pageNumberToLoad + 1, this.state.itemsPerPage, this.state.sortDateDesc, this.state.addressFilterVal)
      .then(res => {
        this.setState({
          jobs: res.data.jobs,
          jobCount: res.data.job_count,
          pageNumber: pageNumberToLoad,
          isLoading: false
        });
      })
      .catch(() => {
        // this.setMessage(true, "Unable to retrieve jobs");
        this.setState({ isLoading: false });
      });
  }

  handleSearchClick = () => {
    this.getJobs(true);
  }

  handleRefreshClick = () => {
    this.setState({
      sortDateDesc: null,
      addressFilterVal: "",
    }, () => {
      this.getJobs(true);
    });
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      pageNumber: newPage
    }, () => {
      this.getJobs();
    });
  }

  handleChangeItemsPerPage = (event) => {
    this.setState({
      pageNumber: 0,
      itemsPerPage: event.target.value
    }, () => {
      this.getJobs();
    });
  }

  toggleSortDate = () => {
    this.setState({
      pageNumber: 0,
      sortDateDesc: this.state.sortDateDesc ? !this.state.sortDateDesc : true
    }, () => {
      this.getJobs(true);
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
          <Title>JOBS</Title>
          {this.state.userType !== 0 && (
            <div className="search-container">
              <TextField
                type="search"
                name="search"
                label="Address Search"
                value={this.state.addressFilterVal}
                onChange={event => {
                  this.setState({ addressFilterVal: event.target.value })
                }}
                variant="outlined"
                style={{ width: "100%" }}
              />
              <Button
                style={{ marginLeft: "5px", padding: "16.9px" }}
                onClick={this.handleSearchClick}
                variant="contained"
                color="primary"
                disabled={this.state.addressFilterVal === ""}
              >
                <FaSearch size={22} />
              </Button>
              <Button
                style={{ marginLeft: "5px", padding: "17.5px", background: "#47a747" }}
                onClick={this.handleRefreshClick}
                variant="contained"
                color="primary"
              >
                <FaSync size={21} />
              </Button>
            </div>
          )}

          {this.state.jobCount > 0 && !this.state.isLoading && (
            <ThemeProvider theme={tableTheme}>
              <TableContainer className="desktop-table" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "10px" }} >
                      </TableCell>
                      <TableCell>
                        Service
                      </TableCell>
                      <TableCell>
                        Address
                      </TableCell>
                      <TableCell>
                        City
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ paddingRight: "5px" }}>Date Created</span>
                          <IconButton onClick={this.toggleSortDate} aria-label="expand row" size="small">
                            {this.state.sortDateDesc ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell style={{ width: "190px" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.jobs.map(job => (
                      <Row
                        key={job.jobId}
                        row={job}
                        userType={this.state.userType}
                        isMobile={false}
                        getJobs={this.getJobs}
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
                    {this.state.jobs.map(job => (
                      <Row
                        key={job.jobId}
                        row={job}
                        userType={this.state.userType}
                        isMobile={true}
                        getJobs={this.getJobs}
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
                count={this.state.jobCount}
                rowsPerPage={this.state.itemsPerPage}
                page={this.state.pageNumber}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeItemsPerPage}
              />
            </ThemeProvider>
          )}
        </>

        {this.state.jobCount === 0 && !this.state.isLoading && (
          <Alert severity="info" color="info">Could not find any jobs.</Alert>
        )}

        <ResponsiveDialog
          isOpen={this.state.isOpen}
          modalContent={this.state.modalContent}
          handleClose={this.handleClose}
        />

        { this.state.isLoading && <Backdrop />}

        {/* <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={5000}
          onClose={this.toggleSnackbar}
        >
          <AlertPopup onClose={this.toggleSnackbar} severity={this.state.isError ? "error" : "success"}>
            {this.state.message}
          </AlertPopup>
        </Snackbar> */}
      </div >
    );
  }
}

export default JobsPage;
