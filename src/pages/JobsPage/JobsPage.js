import React, { Component } from "react";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";
import {
  FaFileInvoiceDollar, FaRegClock, FaAt, FaPhone, FaUser, FaRegCalendarAlt,
  FaRegBuilding, FaExternalLinkAlt, FaCheckCircle, FaTimesCircle, FaMinusCircle
} from "react-icons/fa";

import "./JobsPage.css";
import { formatPhoneNumber, formatDate, formatNumber } from '../../helpers/Utils';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
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
  hstValue = 0.13;
  invoiceThreshold = 5000;
  requiresInspection = parseInt(this.props.row.invoicePrice) >= this.invoiceThreshold;
  holdingFee = this.props.row.invoicePrice * 0.15;
  holdingFeeHst = (this.props.row.invoicePrice * 0.15) * (1 + this.hstValue);
  invoicePriceHst = this.props.row.invoicePrice * (1 + this.hstValue);

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
    this.holdingFeeHst = (newProps.row.invoicePrice * 0.15) * (1 + this.hstValue);
    this.invoicePriceHst = newProps.row.invoicePrice * (1 + this.hstValue);

    this.setState({
      row: newProps.row,
      userType: newProps.userType,
      open: false,
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
      return this.state.row.inspectorNotes
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
      })
      .catch(err => {
        console.error("Error while claiming job" + err.response);
      });
  }

  cancelJob = () => {
    let body = { jobId: this.state.row.jobId, isAbandoned: true };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
      })
      .catch(err => {
        console.error("Error while abandoning job" + err.response);
      });
  }

  acceptInvoice = (isAccepted) => {
    let body = { jobId: this.state.row.jobId, invoiceAccepted: isAccepted };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
      })
      .catch(err => {
        console.error("Error while accepting job invoice" + err.response);
      });
  }

  sendInvoice = () => {
    let body = {
      jobId: this.state.row.jobId,
      invoicePrice: this.state.invoicePrice
    };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
      })
      .catch(err => {
        console.error("Error while updating job invoice" + err.response);
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
      })
      .catch(err => {
        console.error("Error while updating job invoice status" + err.response);
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
      })
      .catch(err => {
        console.error("Error while updating job" + err.response);
      });
  }

  claimJobConfirm = () => {
    if (window.confirm("Are you sure you wish to hire the selected contractor?")) {
      this.claimJob();
    }
  }

  cancelJobConfirm = () => {
    if (window.confirm("Are you sure you wish to cancel this job? This action cannot be undone.")) {
      this.cancelJob();
    }
  }

  paymentReceivedConfirm = () => {
    let verbiage = this.props.userType === 1 ? "holding fee" : "payment";

    if (window.confirm(`Are you sure you've received the ${verbiage} for this job?`)) {
      this.paymentReceived();
    }
  }

  getUIContent = () => {
    let content = null;

    if (this.props.userType === 0) {
      // CUSTOMER
      if (this.state.row.contractors && this.state.row.contractors.length > 0) {
        content = (
          <Auxil>
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
                onClick={() => window.open("/contractors/" + this.state.contractor)}
                variant="contained"
                color="primary"
              >
                VIEW PROFILE
              </Button>
              <Button
                onClick={() => this.claimJobConfirm()}
                variant="contained"
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                HIRE CONTRACTOR
              </Button>
              <Button
                onClick={() => this.cancelJobConfirm()}
                variant="contained"
                color="secondary"
              >
                CANCEL JOB
              </Button>
            </div>
          </Auxil>
        );
      }
      else if (this.state.row.invoicePrice && this.state.row.invoiceAccepted === null) {
        content = (
          <Auxil>
            <Alert severity="info" color="info">The contractor has suggested an invoice of <b>${formatNumber((this.state.row.invoicePrice * 1.00).toFixed(2))}</b> (HST not included).</Alert>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="button-container">
                <Button
                  variant="contained"
                  onClick={() => this.acceptInvoice(true)}
                  color="primary"
                  style={{
                    backgroundColor: "#3bb13b",
                    color: "white",
                  }}
                >
                  ACCEPT
                </Button>
                <Button
                  variant="contained"
                  onClick={() => this.acceptInvoice(false)}
                  color="secondary"
                >
                  DECLINE
                </Button>
              </div>
              <div style={{ margin: "15px 0" }}>
                <Button
                  onClick={() => this.cancelJobConfirm()}
                  variant="contained"
                  color="secondary"
                >
                  CANCEL JOB
                </Button>
              </div>
            </div>
          </Auxil>
        );
      }
      else if (this.state.row.contractorId === null || this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === "0") {
        content = (
          <div className="button-container">
            <Button
              onClick={() => this.cancelJobConfirm()}
              variant="contained"
              color="secondary"
            >
              CANCEL JOB
            </Button>
          </div>
        );
      }
    }
    else if (this.props.userType === 1) {
      // CONTRACTOR
      if (this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === "0") {
        content = (
          <Auxil>
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
                variant="contained"
                onClick={() => this.sendInvoice()}
                disabled={this.state.invoicePrice === 0 || !this.state.invoicePrice}
                color="primary"
              >
                SEND INVOICE
            </Button>
            </div>
          </Auxil>
        );
      }
      else if (this.state.row.invoiceAccepted === "1"
        && this.state.row.holdingFeePaid
        && (this.state.row.completionDate === null || this.state.row.inspectionPassed === "0")) {
        content = (
          <Auxil>
            {this.requiresInspection && (
              <Auxil>
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
              </Auxil>
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
                variant="contained"
                onClick={() => this.completeJob()}
                disabled={this.state.completionDate === ""}
                color="primary"
              >
                SUBMIT
              </Button>
            </div>
          </Auxil>
        );
      }
      else if (this.state.row.invoicePaid === null
        && ((this.state.row.completionDate !== null && !this.requiresInspection) || this.state.row.inspectionPassed)) {
        content = (
          <Auxil>
            <Alert severity="info" color="info">The remainder of the invoice <b>${formatNumber((this.invoicePriceHst - this.holdingFeeHst).toFixed(2))}</b> ${formatNumber((this.state.row.invoicePrice - this.holdingFee).toFixed(2))} + HST ({this.hstValue}%) is owed by the customer.</Alert>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => this.paymentReceivedConfirm()}
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                PAYMENT RECEIVED
              </Button>
            </div>
          </Auxil>
        );
      }
    }
    else if (this.props.userType === 2) {
      // INSPECTOR
      if (this.state.row.inspectorId === null) {
        content = (
          <div className="button-container">
            <Button
              variant="contained"
              onClick={() => this.claimJob()}
              style={{
                backgroundColor: "#3bb13b",
                color: "white"
              }}
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
          if (this.inspectionPassed === "false") {
            content = (
              <Auxil>
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
              </Auxil>
            );
          }

          content = (
            <Auxil>
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
            </Auxil>
          );
        }
      }
    }
    else if (this.props.userType === 3) {
      // ADMIN
      if (this.state.row.invoiceAccepted === "1" && this.state.row.holdingFeePaid === null) {
        content = (
          <Auxil>
            <Alert severity="info" color="info">A holding fee of <b>${formatNumber(this.holdingFeeHst.toFixed(2))}</b> is owed by the customer.</Alert>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => this.paymentReceivedConfirm()}
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                PAYMENT RECEIVED
              </Button>
            </div>
          </Auxil>
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
                <td>Created: {formatDate(this.state.row.creationDate.split(" ")[0])}</td>
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
        <Auxil>
          <TableCell>
            <IconButton aria-label="expand row" size="small">
              {this.state.reportSent ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{this.state.row.serviceName}</TableCell>
          <TableCell>{this.state.row.address}</TableCell>
          <TableCell>{this.state.row.city}</TableCell>
          <TableCell>{formatDate(this.state.row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{this.getJobStatus()}</TableCell>
        </Auxil>
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
      <Auxil>
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
                        <span className="item-with-icon">
                          <FaFileInvoiceDollar className="item-icon" size={16} />
                        Total Price:&nbsp;<span style={{ fontWeight: "bold", color: "red", background: "#ffe7e7" }}>${formatNumber(this.invoicePriceHst.toFixed(2))}</span>
                        </span>
                        <span style={{ fontStyle: "italic", fontSize: "smaller", color: "grey" }}>
                          ${formatNumber((this.state.row.invoicePrice * 1.00).toFixed(2))} + HST ({this.hstValue}%)
                      </span>
                        {this.state.row.invoiceAccepted === null ?
                          <span className="item-with-icon" style={{ color: "grey" }}>
                            <FaMinusCircle className="item-icon" size={16} />Pending Approval
                        </span> :
                          this.state.row.invoiceAccepted === "1" ?
                            <span className="item-with-icon" style={{ color: "green" }}>
                              <FaCheckCircle className="item-icon" size={16} />Accepted
                          </span> :
                            <span className="item-with-icon" style={{ color: "red" }}>
                              <FaTimesCircle className="item-icon" size={16} />Declined
                          </span>
                        }
                        {this.state.row.invoicePaid ?
                          <span className="item-with-icon" style={{ color: "green" }}>
                            <FaCheckCircle className="item-icon" size={16} />Paid
                        </span> :
                          <span className="item-with-icon" style={{ color: "red" }}>
                            <FaTimesCircle className="item-icon" size={16} />Not Paid
                        </span>
                        }
                        {this.state.row.invoiceAccepted === "1" && (
                          <Auxil>
                            <p className="item-title">HOLDING FEE DETAILS</p>
                            <span className="item-with-icon">
                              <FaFileInvoiceDollar className="item-icon" size={16} />
                            Fee:&nbsp;<span style={{ fontWeight: "bold", color: "red", background: "#ffe7e7" }}>${formatNumber(this.holdingFeeHst.toFixed(2))}</span>
                            </span>
                            <span style={{ fontStyle: "italic", fontSize: "smaller", color: "grey" }}>
                              ${formatNumber(this.holdingFee.toFixed(2))} + HST ({this.hstValue}%)
                          </span>
                            {this.state.row.holdingFeePaid ?
                              <span className="item-with-icon" style={{ color: "green" }}>
                                <FaCheckCircle className="item-icon" size={16} />Paid
                            </span> :
                              <span className="item-with-icon" style={{ color: "red" }}>
                                <FaTimesCircle className="item-icon" size={16} />Not Paid
                            </span>
                            }
                          </Auxil>
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
                          <Auxil>
                            <p className="item-title">CONTRACTOR NOTES</p>
                            {this.state.row.contractorNotes}
                          </Auxil>
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
                        {this.state.row.inspectionPassed === "1" ?
                          <span className="item-with-icon" style={{ color: "green" }}>
                            <FaCheckCircle className="item-icon" size={16} />Inspection Passed
                        </span> :
                          <span className="item-with-icon" style={{ color: "red" }}>
                            <FaTimesCircle className="item-icon" size={16} />Job Failed Inspection
                        </span>
                        }
                        {this.props.userType !== 0 && this.state.row.inspectorNotes && (
                          <Auxil>
                            <p className="item-title">INSPECTOR NOTES</p>
                            {this.state.row.inspectorNotes}
                          </Auxil>
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
                            {this.state.row.customerName}
                          </span>
                          <span className="item-with-icon">
                            <FaPhone className="item-icon" size={16} />
                            {formatPhoneNumber(this.state.row.customerPhone)}
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
                            {this.state.row.contractorName}
                          </span>
                          <span className="item-with-icon">
                            <FaPhone className="item-icon" size={16} />
                            {formatPhoneNumber(this.state.row.contractorPhone)}
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
                            {this.state.row.inspectorName}
                          </span>
                          <span className="item-with-icon">
                            <FaPhone className="item-icon" size={16} />
                            {formatPhoneNumber(this.state.row.inspectorPhone)}
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
      </Auxil >
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
    isLoading: true
  };

  getJobs = (loadFirstPage = false) => {
    var pageNumberToLoad = loadFirstPage ? 0 : this.state.pageNumber;

    JobService.getJobs(pageNumberToLoad + 1, this.state.itemsPerPage)
      .then(res => {
        this.setState({
          jobs: res.data.jobs,
          jobCount: res.data.job_count,
          pageNumber: pageNumberToLoad,
          isLoading: false
        });
      })
      .catch(err => {
        console.error("Error while getting jobs" + err.response);
        this.setState({ isLoading: false });
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

  componentDidMount() {
    this.setState({
      userType: AuthService.getRole()
    }, () => {
      this.getJobs();
    });
  }

  render() {
    return (
      <div className="page-container">
        {this.state.jobs && !this.state.isLoading && (
          <Auxil>
            <Title>JOBS</Title>
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
                        <b>Creation Date</b>
                      </TableCell>
                      <TableCell style={{ width: "190px" }}>
                        <b>Status</b>
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

          </Auxil>
        )}

        {!this.state.jobs && !this.state.isLoading && (
          <Auxil>
            <Title>JOBS</Title>
            <Alert severity="info" color="info">You don't have any jobs at the moment.</Alert>
          </Auxil>
        )}

        {this.state.isLoading && <Backdrop />}
      </div >
    );
  }
}

export default JobsPage;
