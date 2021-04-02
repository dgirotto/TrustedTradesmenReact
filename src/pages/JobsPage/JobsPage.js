import React, { Component } from "react";

import { JobService } from "../../services/jobs";
import { AccountService } from "../../services/account";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import ResponsiveDialog from "../../components/ResponsiveDialog";
import { formatNumber, formatPhoneNumber, formatDate, formatTimeFrame, formatBudget } from '../../helpers/Utils';

import "./JobsPage.css";

import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles';
import {
  FaFileInvoiceDollar, FaRegClock, FaAt, FaPhone, FaUser, FaCheck, FaTimes,
  FaRegCalendarAlt, FaRegBuilding, FaExternalLinkAlt, FaCheckCircle,
  FaTimesCircle, FaMinusCircle, FaSearch, FaSync, FaSortAmountDown, FaSortAmountUp
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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
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
  // Constants
  ttFeePct = 0.06;
  hstPct = 0.13;
  holdingFeePct = 0.15;
  invoiceThreshold = 5000;
  holdingFeeThreshold = 1000;
  // Non-constants
  requiresInspection = false;
  holdingFeeRequired = false;
  holdingFee = 0;
  holdingFeeHst = 0;
  holdingFeeTotal = 0;
  invoicePriceHst = 0;
  invoicePriceTotal = 0;
  ttFee = 0;

  constructor(props) {
    super(props);
    this.setInitialVals(props);
    this.state = {
      open: false,
      row: this.props.row,
      notes: "",
      invoicePrice: 0,
      completionDate: "",
      contractor: this.props.row.contractors && this.props.row.contractors.length > 0 ? this.props.row.contractors[0].contractorId : null,
      inspectionPassed: null,
      reworkCompleted: null,
      // reportSent: false
    };
  }

  // TODO: Convert this to componentDidUpdate()
  componentWillReceiveProps(newProps) {
    this.setInitialVals(newProps);
    this.setState({
      row: newProps.row,
      notes: "",
      invoicePrice: 0,
      completionDate: "",
      contractor: newProps.row.contractors && newProps.row.contractors.length > 0 ? newProps.row.contractors[0].contractorId : null,
      inspectionPassed: null,
      reworkCompleted: null,
      // reportSent: false
    });
  }

  setInitialVals = (props) => {
    this.requiresInspection = parseInt(props.row.invoicePrice) >= this.invoiceThreshold;
    this.holdingFeeRequired = parseInt(props.row.invoicePrice) >= this.holdingFeeThreshold;

    this.invoicePriceHst = props.row.invoicePrice * this.hstPct;
    this.invoicePriceTotal = props.row.invoicePrice * 1.00 + this.invoicePriceHst;

    if (this.holdingFeeRequired) {
      this.holdingFee = props.row.invoicePrice * this.holdingFeePct;
      this.holdingFeeHst = this.holdingFee * this.hstPct;
      this.holdingFeeTotal = this.holdingFee + this.holdingFeeHst;
      this.ttFee = this.invoicePriceTotal * this.ttFeePct;
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

    this.props.handleClose();
  }

  paymentSent = () => {
    let body = {
      jobId: this.state.row.jobId,
      contractorPaid: 1
    };

    JobService.updateJob(body)
      .then(() => {
        this.props.getJobs(true);
        // this.props.setMessage(false, "Successfully updated invoice status");
      })
      .catch(err => {
        // this.props.setMessage(false, "Unable to update invoice status");
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

  completeJob = () => {
    let body = null;

    if (this.props.userType === 1) {
      body = {
        jobId: this.state.row.jobId,
      };

      if (this.state.row.completionDate === null) {
        body.completionDate = this.state.completionDate;
        body.contractorNotes = this.state.notes;
      }
      else {
        body.reworkCompletionDate = this.state.completionDate;
        body.reworkCompleted = this.state.reworkCompleted === "true" ? true : false;

        if (!body.reworkCompleted) {
          body.reworkNotes = this.state.notes;
        }
      }
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
        content: 'Are you sure you wish to hire the selected contractor? This action cannot be undone.',
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
    else if (modalType === 2) {
      modalContent = {
        title: 'Confirm Received Payment',
        content: "Are you sure you've received the payment for this job?",
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
    else {
      modalContent = {
        title: 'Confirm Sent Payment',
        content: "Are you sure you've sent the payment to the contractor?",
        actions: <>
          <Button onClick={this.paymentSent}>
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

  contractorIsCommitted = () => {
    let result = this.state.row.contractors.find(contractor => {
      return contractor.contractorId === this.state.contractor
    });

    return result.isCommitted;
  }

  getUIContent = () => {
    let content = null;

    if (this.props.userType === 0) {
      // CUSTOMER
      if (this.state.row.contractors && this.state.row.contractors.length > 0) {
        content = (
          <>
            {this.state.row.contractors.length > 0 && (
              <Alert className="alert-msg" severity="info" color="info">
                Contractors have shown an interest in your job! When you wish to commit to a particular contractor, select the <b>Hire Contractor</b> button. <b>Note:
                This button will be available once the contractor has confirmed their commitment to the job.</b>
              </Alert>
            )}
            <div className="textfield-container-col">
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
                VIEW CONTRACTOR'S PROFILE
              </Button>
              {this.contractorIsCommitted() && (
                <Button
                  style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
                  onClick={() => this.setModal(0)}
                  variant="contained"
                >
                  HIRE CONTRACTOR
                </Button>
              )}
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
      else if (this.state.row.invoicePrice && this.state.row.invoiceAccepted === null) {
        content = (
          <>
            <Alert className="alert-msg" severity="info" color="info">The contractor has suggested an invoice of <b>${formatNumber((this.state.row.invoicePrice * 1.00).toFixed(2))}</b> (HST not included).</Alert>
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
      else if (this.state.row.contractorId === null || this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === false) {
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
      if (this.state.row.invoicePrice === null || this.state.row.invoiceAccepted === false) {
        content = (
          <>
            {this.state.row.invoiceAccepted === false ?
              <>
                <Alert className="alert-msg" severity="error" color="error">The customer rejected your invoice of $<b>{this.state.row.invoicePrice}</b>. Please contact the customer to resolve pricing discrepancies.</Alert>
                <span className="field-desc">
                  Please enter a new invoice price.
                </span>
              </>
              :
              <span className="field-desc">
                Enter the invoice price. This will have to be confirmed by the customer.
              </span>
            }
            <div className="textfield-container-col">
              <TextField
                type="text"
                name="invoicePrice"
                label="Invoice Price"
                value={this.state.invoicePrice}
                variant="outlined"
                error={isNaN(this.state.invoicePrice)}
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
                onClick={this.sendInvoice}
                disabled={this.state.invoicePrice === 0 || !this.state.invoicePrice || isNaN(this.state.invoicePrice)}
                color="primary"
              >
                SEND INVOICE
              </Button>
            </div>
          </>
        );
      }
      else if (this.state.row.invoiceAccepted &&
        (this.state.row.holdingFeePaid || !this.holdingFeeRequired) &&
        (this.state.row.completionDate === null || (this.state.row.inspectionPassed === false && this.state.row.reworkCompletionDate === null))
      ) {
        content = (
          <>
            {this.state.row.completionDate === null ? (
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
                <span className="field-desc">Record the date when your work was completed.</span>
                <div className="textfield-container-col">
                  <TextField
                    type="date"
                    value={this.state.completionDate}
                    onChange={event => {
                      this.setState({ completionDate: event.target.value });
                    }}
                    style={{ width: "175px", marginRight: "20px" }}
                    variant="outlined"
                  />
                </div>
                <div className="button-container">
                  <Button
                    style={{ fontWeight: "bold" }}
                    variant="contained"
                    onClick={this.completeJob}
                    disabled={this.state.completionDate === ""}
                    color="primary"
                  >
                    SUBMIT
                  </Button>
                </div>
              </>
            ) : (
              <>
                <RadioGroup
                  value={this.state.reworkCompleted}
                  onChange={event => {
                    this.setState({ reworkCompleted: event.target.value });
                  }}
                >
                  <span style={{ marginBottom: "0px" }} className="field-desc">Were the inspector's rework suggestions completely met?</span>
                  <span style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </span>
                </RadioGroup>
                {this.state.reworkCompleted === "false" && (
                  <>
                    <span className="field-desc">Explain what was not completed and why.</span>
                    <div className="textfield-container-col">
                      <TextField
                        multiline
                        rowsMax={6}
                        type="text"
                        label="Explanation"
                        value={this.state.notes}
                        variant="outlined"
                        required
                        onChange={event => { this.setState({ notes: event.target.value }); }}
                      />
                    </div>
                  </>
                )}
                {this.state.reworkCompleted !== null && (
                  <>
                    <span className="field-desc">Record the date when your post-inspection work was conducted.</span>
                    <div className="textfield-container-col">
                      <TextField
                        type="date"
                        value={this.state.completionDate}
                        onChange={event => {
                          this.setState({ completionDate: event.target.value });
                        }}
                        style={{ width: "175px", marginRight: "20px" }}
                        variant="outlined"
                      />
                    </div>
                  </>
                )}
                <div className="button-container">
                  <Button
                    style={{ fontWeight: "bold" }}
                    variant="contained"
                    onClick={this.completeJob}
                    disabled={this.state.reworkCompleted === null || 
                      (this.state.reworkCompleted === "true" && this.state.completionDate === "") || 
                      (this.state.reworkCompleted === "false" && (this.state.notes === "" || this.state.completionDate === ""))}
                    color="primary"
                  >
                    SUBMIT
                  </Button>
                </div>
              </>
            )}
          </>
        );
      }
      else if ((this.holdingFeeRequired || !this.state.row.invoicePaid) &&
        ((this.state.row.completionDate && !this.requiresInspection) || this.state.row.inspectionPassed || this.state.row.reworkCompletionDate))
      {
        content = (
          <>
            {this.holdingFeeRequired && (
              <Alert className="alert-msg" severity="info" color="info">
                The holding fee will be paid by Trusted Tradesmen (minus TT's fee) in the amount of <b>${formatNumber((this.holdingFeeTotal - this.ttFee).toFixed(2))}</b>.
              </Alert>
            )}
            {!this.state.row.invoicePaid && (
              <>
                <Alert className="alert-msg" severity="info" color="info">The remainder of the invoice is owed by the customer.</Alert>
                <div className="button-container">
                  <Button
                    style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold" }}
                    variant="contained"
                    onClick={() => this.setModal(2)}
                  >
                    CUSTOMER PAYMENT RECEIVED
                  </Button>
                </div>
              </>
            )}
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
              onClick={this.claimJob}
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
            <span style={{ marginBottom: "0px" }} className="field-desc">Did the job pass inspection?</span>
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
                <span className="field-desc">Explain in detail what the contractor is required to repair in order for their work to pass inspection.</span>
                <div className="textfield-container-col">
                  <TextField
                    multiline
                    rowsMax={6}
                    type="text"
                    label="Notes"
                    value={this.state.notes}
                    variant="outlined"
                    onChange={event => { this.setState({ notes: event.target.value }); }}
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
                  onChange={event => { this.setState({ completionDate: event.target.value }); }}
                  style={{ width: "175px", marginRight: "20px" }}
                  variant="outlined"
                />
              </div>
              {/* <FormControlLabel
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
              /> */}
              <div className="button-container">
                <Button
                  variant="contained"
                  onClick={this.completeJob}
                  // disabled={this.state.completionDate === "" || !this.state.reportSent}
                  disabled={this.state.completionDate === ""}
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
      if (this.state.row.isOrphaned) {
        content = <Alert className="alert-msg" severity="info" color="info">JOB IS ORPHANED. PICK A CONTRACTOR TO ASSIGN A LEAD TO FOR THIS JOB.</Alert>
      }
      else if (this.state.row.invoiceAccepted && this.holdingFeeRequired && !this.state.row.holdingFeePaid) {
        content = (
          <>
            <Alert className="alert-msg" severity="info" color="info">A holding fee of <b>${formatNumber(this.holdingFeeTotal.toFixed(2))}</b> is owed by the customer.</Alert>
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
      else if (this.state.row.completionDate !== null &&
        !this.state.row.contractorPaid &&
        (this.requiresInspection && (this.state.row.inspectionPassed || this.state.row.reworkCompleted !== null))) {
        content = (
          <>
            <Alert className="alert-msg" severity="info" color="info">
              The remaining payment of <b>${formatNumber((this.holdingFeeTotal - this.ttFee).toFixed(2))}</b> is owed to the contractor.
            </Alert>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => this.setModal(3)}
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                PAYMENT SENT
              </Button>
            </div>
          </>
        );
      }
    }
    return content;
  }

  // TODO: Move this logic to the back end? (add status and statusType (required, cancelled, inProgress) fields to dto)
  getJobStatus = () => {
    let status = null;

    if (this.state.row.isAbandoned) {
      status = <Chip className="status cancelled" label="Cancelled" />;
    }
    else if (this.props.userType === 3 && this.state.row.isOrphaned) {
      status = <Chip className="status interested" label="Orphaned" />;
    }
    else if (this.state.row.contractorId === null) {
      if (this.state.row.contractors && this.state.row.contractors.length > 0) {
        status = (
          <Chip className="status interested"
            label={this.state.row.contractors.length === 1 ?
              <span>1 Contractor Interested</span> :
              <span>{this.state.row.contractors.length} Contractors Interested</span>
            }
          />
        );
      }
      else {
        status = <Chip className="status required" label="Waiting for Contractors" />
      }
    }
    else if (this.state.row.invoicePrice === null || (this.props.userType !== 1 && this.state.row.invoiceAccepted === false)) {
      status = <Chip className="status required" label="Invoice Required" />;
    }
    else if (this.state.row.invoiceAccepted === null) {
      status = <Chip className="status required" label="Response Required" />;
    }
    else if (this.props.userType === 1 && this.state.row.invoiceAccepted === false) {
      status = <Chip className="status in-progress" label="Invoice Rejected" />;
    }
    else if (this.holdingFeeRequired && !this.state.row.holdingFeePaid) {
      status = <Chip className="status required" label="Holding Fee Required" />;
    }
    else if (this.state.row.completionDate === null) {
      status = <Chip className="status in-progress" label="Job In Progress" />;
    }
    else if (this.state.row.holdingFeePaid &&
      this.requiresInspection &&
      (this.state.row.inspectorId === null || this.state.row.inspectionDate === null || (this.state.row.inspectionPassed === false && this.state.row.reworkCompletionDate === null))
    ) {
      if (this.state.row.inspectorId === null) {
        status = <Chip className="status required" label="Inspector Required" />;
      }
      else if (this.state.row.inspectionPassed === null) {
        status = <Chip className="status required" label="Requires Inspection" />;
      }
      else {
        status = <Chip className="status required" label="Requires Rework" />;
      }
    }
    else if ((!this.state.row.holdingFeePaid && this.holdingFeeRequired) || !this.state.row.invoicePaid) {
      status = <Chip className="status required" label="Payment Required" />;
    }
    else {
      status = <Chip className="status completed" label="Completed" />;
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
          <TableCell>{this.state.row.address}, {this.state.row.city}</TableCell>
          <TableCell>{formatDate(this.state.row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{this.getJobStatus()}</TableCell>
        </>
      );
    }
    return content;
  }

  getAlertContent = () => {
    let content = null;

    if (this.state.row.isAbandoned) {
      content = <Alert className="alert-msg" severity="error" color="error">The job was cancelled by the customer on {formatDate(this.state.row.lastUpdatedDate.split(" ")[0])}.</Alert>;
    }
    else if (this.props.userType === 0) {
      if (this.state.row.contractorId !== null && this.state.row.invoicePrice === null) {
        content = <Alert className="alert-msg" severity="info" color="info">Waiting for the contractor to submit an invoice.</Alert>;
      }
      else if (this.state.row.contractorId !== null && this.state.row.invoiceAccepted === false) {
        content = <Alert className="alert-msg" severity="info" color="info">The contractor will contact you to discuss a revised invoice.</Alert>;
      }
      else if (this.state.row.invoiceAccepted && this.holdingFeeRequired && !this.state.row.holdingFeePaid) {
        content = <Alert className="alert-msg" severity="info" color="info">Please E-transfer the holding fee of <b>${formatNumber(this.holdingFeeTotal.toFixed(2))}</b> to <b>trustedtradesmen@gmail.com</b>. This amount will be deducted from your final invoice bill. Work can begin once this payment is received.</Alert>;
      }
      else if (this.state.row.completionDate !== null &&
        (!this.requiresInspection || (this.requiresInspection && this.state.row.inspectionPassed) || this.state.row.reworkCompletionDate)
      ) {
        if (this.state.row.invoicePaid) {
          content = <Alert className="alert-msg" severity="success" color="success">The job was completed on {formatDate(this.state.row.completionDate.split(" ")[0])} and the invoice payment has been processed.</Alert>;
        }
        else {
          content = <Alert className="alert-msg" severity="info" color="info">The job was completed on {formatDate(this.state.row.completionDate.split(" ")[0])}. Please ensure that any remaining payments are sent to the contractor.</Alert>;
        }
      }
    }
    else if (this.props.userType === 1) {
      if (this.state.row.invoicePrice !== null && this.state.row.invoiceAccepted === null) {
        content = <Alert className="alert-msg" severity="info" color="info">Waiting for the customer to confirm the invoice.</Alert>;
      }
      else if (this.state.row.invoiceAccepted && this.holdingFeeRequired && !this.state.row.holdingFeePaid) {
        content = <Alert className="alert-msg" severity="info" color="info">Waiting for the customer to submit the holding fee.</Alert>;
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
          <TableCell style={{ padding: 0 }} colSpan={5}>
            <Collapse in={this.state.open} timeout="auto">
              <Box margin={1}>
                <div className="job-details">
                  <div className="job-details-column job-details-column-1">
                    <Card className="job-details-card">
                      <p className="item-title">JOB ID</p>
                      {this.state.row.jobId}
                      <p className="item-title">SERVICE</p>
                      {this.state.row.serviceName}
                      <p className="item-title">SUBMITTED</p>
                      <span className="item-with-icon">
                        <FaRegCalendarAlt className="item-icon" size={16} />
                        {formatDate(this.state.row.creationDate.split(" ")[0])}
                      </span>
                      <p className="item-title">LOCATION</p>
                      {this.state.row.address}, {this.state.row.city}, {this.state.row.province}, {this.state.row.postalCode}
                      <p className="item-title">TIME FRAME</p>
                      <span className="item-with-icon">
                        <FaRegClock className="item-icon" size={16} />
                        {formatTimeFrame(this.state.row.timeFrame)}
                      </span>
                      <p className="item-title">DESCRIPTION</p>
                      {this.state.row.description}
                      <p className="item-title">BUDGET</p>
                      <span className="item-with-icon">
                        <FaFileInvoiceDollar className="item-icon" size={16} />
                        {formatBudget(this.state.row.budget)}
                      </span>
                    </Card>
                    {this.props.userType !== 2 && this.state.row.invoicePrice && (
                      <Card className="job-details-card">
                        <p className="item-title">INVOICE STATUS</p>
                        {this.state.row.invoiceAccepted === null ?
                          <span className="item-with-icon grey">
                            <FaMinusCircle className="item-icon grey" size={16} />Pending Approval
                          </span> :
                          this.state.row.invoiceAccepted ?
                            <span className="item-with-icon green">
                              <FaCheckCircle className="item-icon green" size={16} />Approved
                            </span> :
                            <span className="item-with-icon red">
                              <FaTimesCircle className="item-icon red" size={16} />Revision Requested
                            </span>
                        }
                        {this.state.row.invoiceAccepted && this.holdingFeeRequired && (
                          <>
                            <p className="item-title item-with-icon">
                              HOLDING FEE DETAILS
                              <HelpOutlineIcon className="help-icon" />
                            </p>
                            {this.state.row.holdingFeePaid ?
                              <span className="item-with-icon green">
                                <FaCheckCircle className="item-icon green" size={16} />Paid
                              </span> :
                              <>
                                <span className="item-with-icon red">
                                  <FaTimesCircle className="item-icon red" size={16} />Not Paid
                                </span>
                                <div style={{ maxWidth: "285px", textAlign: "center", margin: "10px 0", padding: "3px", fontSize: "14px", fontWeight: "bold", background: "#ffd2d2" }} className="red">
                                  MUST BE PAID PRIOR TO START OF JOB
                                </div>
                              </>
                            }
                            <div className="fee-table-container">
                              <table className="fee-table">
                                <tbody>
                                  <tr>
                                    <td>Subtotal (15% of Invoice)</td>
                                    <td>${formatNumber(this.holdingFee.toFixed(2))}</td>
                                  </tr>
                                  <tr>
                                    <td>HST ({this.hstPct * 100}%)</td>
                                    <td>${formatNumber(this.holdingFeeHst.toFixed(2))}</td>
                                  </tr>
                                  <tr className="table-divider">
                                    <td>Total</td>
                                    <td>
                                      <span className={this.state.row.holdingFeePaid ? "green" : "red"} style={{ fontWeight: "bold" }}>
                                        ${formatNumber(this.holdingFeeTotal.toFixed(2))}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        <p className="item-title item-with-icon">
                          INVOICE DETAILS
                          <HelpOutlineIcon className="help-icon" />
                          {/* {this.props.userType === 1 && ( 
                            <>
                              We do not advise that a full payment is taken before the job is complete. We respect that funding may be required
                              for materials and other costs, but payments should be received in increments.
                            </>
                          )} */}
                        </p>
                        {this.state.row.invoiceAccepted && (
                          this.state.row.invoicePaid ?
                            <span className="item-with-icon green">
                              <FaCheckCircle className="item-icon green" size={16} />Paid
                            </span> :
                            <span className="item-with-icon red">
                              <FaTimesCircle className="item-icon red" size={16} />Not Paid
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
                                <td>HST ({this.hstPct * 100}%)</td>
                                <td>${formatNumber(this.invoicePriceHst.toFixed(2))}</td>
                              </tr>
                              {this.state.row.holdingFeePaid && (
                                <tr>
                                  <td>Holding Fee</td>
                                  <td>- ${formatNumber(this.holdingFeeTotal.toFixed(2))}</td>
                                </tr>
                              )}
                              <tr className="table-divider">
                                <td>Total</td>
                                <td>
                                  <span className={this.state.row.invoicePaid ? "green" : "red"} style={{ fontWeight: "bold" }}>
                                    {this.state.row.holdingFeePaid ? (
                                      <>${formatNumber((this.invoicePriceTotal - this.holdingFeeTotal).toFixed(2))}</>
                                    ) :
                                      (
                                        <>${formatNumber(this.invoicePriceTotal.toFixed(2))}</>
                                      )}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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
                            <p className="item-title">NOTES TO INSPECTOR</p>
                            {this.state.row.contractorNotes}
                          </>
                        )}
                        {this.state.row.inspectionDate && (
                          <>
                            <p className="item-title">INSPECTION DATE</p>
                            <span className="item-with-icon">
                              <FaRegCalendarAlt className="item-icon" size={16} />
                              {formatDate(this.state.row.inspectionDate.split(" ")[0])}
                            </span>
                            <p className="item-title">INSPECTION STATUS</p>
                            {this.state.row.inspectionPassed ?
                              <span className="item-with-icon green">
                                <FaCheckCircle className="item-icon green" size={16} />Inspection Passed
                            </span> :
                              <span className="item-with-icon red">
                                <FaTimesCircle className="item-icon red" size={16} />Inspection Failed
                            </span>
                            }
                            {this.props.userType !== 0 && this.state.row.inspectorNotes && (
                              <>
                                <p className="item-title">NOTES TO CONTRACTOR</p>
                                {this.state.row.inspectorNotes}
                              </>
                            )}
                            {this.state.row.reworkCompletionDate && (
                              <>
                                <p className="item-title">REWORK COMPLETION DATE</p>
                                <span className="item-with-icon">
                                  <FaRegCalendarAlt className="item-icon" size={16} />
                                  {formatDate(this.state.row.reworkCompletionDate.split(" ")[0])}
                                </span>
                              </>
                            )}
                            {this.props.userType !== 0 && this.state.row.reworkCompleted !== null && (
                              <>
                                <p className="item-title">REWORK STATUS</p>
                                {this.state.row.reworkCompleted ?
                                  <span className="item-with-icon green">
                                    <FaCheckCircle className="item-icon green" size={16} />Completed
                                  </span> :
                                  <span className="item-with-icon red">
                                    <FaTimesCircle className="item-icon red" size={16} />Not Completed
                                  </span>
                                }
                                {!this.state.row.reworkCompleted && (
                                  <>
                                    <p className="item-title">REWORK NOTES</p>
                                    {this.state.row.reworkNotes}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Card>
                    )}
                  </div>
                  <div className="job-details-column job-details-column-2">
                    {this.props.userType !== 3 && (
                      <Card style={{ background: "#fff5d1", border: "1px solid #e8daa2" }} className="job-details-card">
                        <p className="item-title">HAVE QUESTIONS? CONTACT US</p>
                        <span className="item-with-icon">
                          <FaUser className="item-icon" size={16} />
                            Christopher Willick
                          </span>
                        {this.props.userType !== 0 &&
                          <span className="item-with-icon">
                            <FaPhone className="item-icon" size={16} />
                            {formatPhoneNumber("9056017247")}
                          </span>
                        }
                        <span className="item-with-icon">
                          <FaAt className="item-icon" size={16} />
                          <a href="mailto:trustedtradesmen@gmail.com">trustedtradesmen@gmail.com</a>
                        </span>
                      </Card>
                    )}
                    {this.props.userType !== 0 && (
                      <Card className="job-details-card">
                        <p className="item-title">CUSTOMER DETAILS</p>
                        <span className="item-with-icon">
                          <FaUser className="item-icon" size={16} />
                          {this.state.row.customerName ? this.state.row.customerName : <span className="grey" style={{ fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaPhone className="item-icon" size={16} />
                          {this.state.row.customerPhone ? formatPhoneNumber(this.state.row.customerPhone) : <span className="grey" style={{ fontStyle: "italic" }}>N/A</span>}
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
                          {this.state.row.contractorName ? this.state.row.contractorName : <span className="grey" style={{ fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaPhone className="item-icon" size={16} />
                          {this.state.row.contractorPhone ? formatPhoneNumber(this.state.row.contractorPhone) : <span className="grey" style={{ fontStyle: "italic" }}>N/A</span>}
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
                          {this.state.row.inspectorName ? this.state.row.inspectorName : <span className="grey" style={{ fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaPhone className="item-icon" size={16} />
                          {this.state.inspectorPhone ? formatPhoneNumber(this.state.row.inspectorPhone) : <span className="grey" style={{ fontStyle: "italic" }}>N/A</span>}
                        </span>
                        <span className="item-with-icon">
                          <FaAt className="item-icon" size={16} />
                          <a href={"mailto:" + this.state.row.inspectorEmail}>{this.state.row.inspectorEmail}</a>
                        </span>
                      </Card>
                    )}
                  </div>
                </div>
                {this.getAlertContent()}
                {!this.state.row.isAbandoned && this.getUIContent()}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }
}

class JobsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: AuthService.getRole(),
      jobs: null,
      contractorDetails: null,
      jobCount: null,
      pageNumber: 0,
      itemsPerPage: 10,
      isLoading: true,
      isFiltered: false,
      sortDateDesc: true,
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
  }

  componentDidMount() {
    this.getJobs();
  }

  // TODO: Replace
  componentWillReceiveProps(newProps) {
    if (this.props.location.key !== newProps.location.key) {
      // Make call to getJobs() if props change
      this.getJobs();
    }
  }

  getContractorDetails = () => {
    AccountService.getAccountDetails()
      .then(res => {
        console.log(res.data);
        this.setState({ contractorDetails: res.data});
      })
      .catch(error => {
        // this.setMessage(true, "Unable to obtain account details");
      });
  }

  getJobs = (loadFirstPage = false) => {
    var pageNumberToLoad = loadFirstPage ? 0 : this.state.pageNumber;

    JobService.getJobs(pageNumberToLoad + 1, this.state.itemsPerPage, this.state.sortDateDesc, this.state.addressFilterVal)
      .then(res => {
        if (this.state.userType === 1 && !this.state.isFiltered && res.data.jobs.length === 0)
        {
          this.getContractorDetails();
        }

        this.setState({
          jobs: res.data.jobs,
          jobCount: res.data.job_count,
          pageNumber: pageNumberToLoad,
          isLoading: false,
          isFiltered: this.state.addressFilterVal !== ""
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

  hasRequiredFields = () => {
    return (this.state.contractorDetails.firstName 
      && this.state.contractorDetails.lastName
      && this.state.contractorDetails.phone
      && this.state.contractorDetails.address
      && this.state.contractorDetails.city
      && this.state.contractorDetails.postalCode
      && this.state.contractorDetails.maxDistance
      && this.state.contractorDetails.services);
  }

  hasExtraFields = () => {
    return (this.state.contractorDetails.bio 
      && this.state.contractorDetails.photo
      && (this.state.contractorDetails.linkedin 
        || this.state.contractorDetails.facebook 
        || this.state.contractorDetails.youtube 
        || this.state.contractorDetails.instagram)
      && this.state.contractorDetails.website
      && this.state.contractorDetails.specials);
  }

  getContractorReqContent = () => {
    let content = null;

    content = <div style={{ fontSize: "15px" }}>
      <div style={{ textAlign: "center" }}>
        <ReportProblemOutlinedIcon style={{ fontSize: "55", color: "#ff9800" }} />
        <h3 style={{ margin: "15px 0" }}>Wait! You're missing some key information</h3>
      </div>
      {!this.hasRequiredFields() && (
        <>
          <div style={{ marginBottom: "10px", fontSize: "16px" }}>Before you can receive any jobs (or leads), you must fill out the following fields:</div>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.firstName && this.state.contractorDetails.lastName ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Full Name
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.phone ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Phone Number
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.address ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Address
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.city ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            City
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.postalCode ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Postal Code
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.maxDistance ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Travel Distance
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.services ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Services
          </span>
        </>
      )}
      {!this.hasExtraFields() && (
        <>
          <div style={{ margin: "20px 0 10px", fontSize: "16px" }}>
            The following fields will help bolster your <a href={"/contractors/" + this.state.contractorDetails.userId}>profile page</a>. Filling these
            out gives your client a better idea of who you are and the skills you're capable of providing.
          </div>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.bio ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Bio
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.photo ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Photo
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {(this.state.contractorDetails.linkedin 
              || this.state.contractorDetails.facebook
              || this.state.contractorDetails.youtube 
              || this.state.contractorDetails.instagram) ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Social Media Links
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.website ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Website Link
          </span>
          <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
            {this.state.contractorDetails.specials ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
            Specials
          </span>
        </>
      )}
      <div style={{ justifyContent: "space-around", marginTop: "10px" }} className="button-container">
        <Button
          style={{ backgroundColor: "#282828", color: "white", fontWeight: "bold" }}
          onClick={() => window.location.href = "/settings"}
          variant="contained"
        >
          FILL OUT DETAILS
        </Button>
      </div>
    </div>
    return content;
  }

  render() {
    return (
      <div className="page-container">
        <>
          {this.state.userType === 3 ? <Title>All Jobs</Title> : <Title>My Jobs</Title>}
          {this.state.userType === 0 && this.state.jobCount === 0 && !this.state.isLoading && (
            <Alert style={{ marginBottom: "20px" }} className="alert-msg" severity="info" color="info">
              You don't have any jobs at the moment. Find a contractor today!
            </Alert>
          )}
          {this.state.userType === 0 && !this.state.isLoading && (
            <div style={{ justifyContent: "space-around", marginBottom: "20px" }} className="button-container">
              <Button
                style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold", marginRight: "0px" }}
                onClick={() => window.location.href = "/services"}
                variant="contained"
              >
                FIND A CONTRACTOR
              </Button>
            </div>
          )}
          {this.state.userType !== 0 && (this.state.jobCount > 0 || this.state.isFiltered) && (
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
                style={{ margin: "0 10px" }}
                onClick={this.handleSearchClick}
                variant="contained"
                color="primary"
                disabled={this.state.addressFilterVal === ""}
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <FaSearch style={{margin: "2px auto 0"}} size={22} />
                  <div style={{margin: "0 0 -4px 0", fontWeight: "bold"}}>SEARCH</div>
                </div>
              </Button>
              <Button
                style={{ background: "#47a747" }}
                onClick={this.handleRefreshClick}
                variant="contained"
                color="primary"
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <FaSync style={{margin: "2px auto 0"}} size={22} />
                  <div style={{margin: "0 0 -4px 0", fontWeight: "bold"}}>SYNC</div>
                </div>
              </Button>
            </div>
          )}
          {this.state.userType !== 0 && this.state.jobCount === 0 && this.state.isFiltered && !this.state.isLoading && (
            <Alert style={{ marginBottom: "20px" }} className="alert-msg" severity="info" color="info">
              We could not find any jobs that match that address. Please try a different one.
            </Alert>
          )}
          {this.state.userType === 1 && this.state.jobCount === 0 && !this.state.isFiltered && !this.state.isLoading && (
            <>
              {this.state.contractorDetails !== null && (!this.hasRequiredFields() || !this.hasExtraFields()) && (
                <Paper style={{ color: "rgb(102, 60, 0)", backgroundColor: "rgb(255, 244, 229)", maxWidth: "600px", margin: "0 auto 20px", padding: "20px", boxShadow: "none" }}>
                  {this.state.contractorDetails && this.getContractorReqContent()}
                </Paper>
              )}
            </>
          )}
          {(this.state.userType === 2 || this.state.userType === 3) && this.state.jobCount === 0 && !this.state.isFiltered && !this.state.isLoading && (
            <Alert style={{ marginBottom: "20px" }} className="alert-msg" severity="info" color="info">
              You do not have any jobs assigned to you at the moment.            
            </Alert>
          )}
          {this.state.userType === 1 && this.state.jobCount === 0 && !this.state.isLoading && (
            <div style={{ justifyContent: "space-around" }} className="button-container">
              <Button
                style={{ backgroundColor: "#3bb13b", color: "white", fontWeight: "bold", marginRight: "0px" }}
                onClick={() => window.location.href = "/leads"}
                variant="contained"
              >
                MY LEADS
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
                        SERVICE
                      </TableCell>
                      <TableCell>
                        LOCATION
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
                        JOB STATUS
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
                onChangeRowsPerPage={this.handleChangeItemsPerPage} />
            </ThemeProvider>
          )}
        </>
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
