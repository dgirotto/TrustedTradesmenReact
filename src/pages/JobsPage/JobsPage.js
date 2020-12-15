import React, { Component } from "react";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";

import "./JobsPage.css";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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

function Row(props) {
  const row = props.row;
  const userType = props.userType;

  const invoiceThreshold = 5000;
  const requiresInspection = parseInt(row.invoicePrice) >= invoiceThreshold;
  const holdingFee = row.invoicePrice * 0.15;
  const holdingFeeHst = (row.invoicePrice * 0.15) * 1.16;
  const invoicePriceHst = row.invoicePrice * 1.16;

  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState(getNotes());
  const [invoicePrice, setPrice] = React.useState(0);
  const [completionDate, setDate] = React.useState("");
  const [contractor, setContractor] = React.useState(row.contractors && row.contractors.length > 0 ? row.contractors[0].contractorId : null);
  const [inspectionPassed, setInspection] = React.useState(null);
  const [reportSent, setReport] = React.useState(false);

  function getNotes() {
    if (userType === 1) {
      return row.contractorNotes;
    }
    else if (userType === 2) {
      return row.inspectorNotes
    }
    else {
      return "";
    }
  }

  function claimJob() {
    let body = { jobId: row.jobId };

    if (contractor !== null) {
      body.contractorId = contractor;
    }

    JobService.updateJob(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while claiming job" + err.response);
      });
  }

  function cancelJob() {
    let body = { jobId: row.jobId, isAbandoned: true };

    JobService.updateJob(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while abandoning job" + err.response);
      });
  }

  function acceptInvoice(isAccepted) {
    let body = { jobId: row.jobId, invoiceAccepted: isAccepted };

    JobService.updateJob(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while accepting job invoice" + err.response);
      });
  }

  function sendInvoice() {
    let body = {
      jobId: row.jobId,
      invoicePrice: invoicePrice
    };

    JobService.updateJob(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while updating job invoice" + err.response);
      });
  }

  function paymentReceived() {
    let body = {
      jobId: row.jobId,
    };
    
    if (userType === 1) {
      body.invoicePaid = 1;
    }
    else {
      body.holdingFeePaid = 1;
    }

    JobService.updateJob(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while updating job invoice status" + err.response);
      });
  }

  function completeJob() {
    let body = null;

    if (userType === 1) {
      body = {
        jobId: row.jobId,
        contractorNotes: notes,
        completionDate: completionDate
      };
    }
    else if (userType === 2) {
      body = {
        jobId: row.jobId,
        inspectionPassed: inspectionPassed === "true" ? true : false,
        inspectionDate: completionDate
      };

      if (inspectionPassed === "false") {
        body.inspectorNotes = notes;
      }
    }

    JobService.updateJob(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while updating job" + err.response);
      });
  }

  function claimJobConfirm() {
    if (window.confirm("Are you sure you wish to hire the selected contractor?")) {
      claimJob();
    }
  }

  function cancelJobConfirm() {
    if (window.confirm("Are you sure you wish to cancel this job? This action cannot be undone.")) {
      cancelJob();
    }
  }

  function paymentReceivedConfirm() {
    let verbiage = userType === 1 ? "holding fee" : "payment";

    if (window.confirm(`Are you sure you've received the ${verbiage} for this job?`)) {
      paymentReceived();
    }
  }

  function getUIContent() {
    let content = null;

    if (userType === 0) {
      // CUSTOMER
      if (row.contractors && row.contractors.length > 0) {
        content = (
          <Auxil>
            {row.contractors.length === 1 ? (
              <Alert severity="info" color="info">A contractor has shown an interest in your job!</Alert>
            ) : (
                <Alert severity="info">
                  <b>{row.contractors.length}</b> contractors have shown an interest in your job!
                </Alert>
              )}
            <div className="textfield-container-row" style={{ marginTop: "15px" }}>
              <TextField
                select
                name="contractor"
                value={contractor || row.contractors[0].contractorId}
                onChange={event => {
                  setContractor(event.target.value);
                }}
                variant="outlined"
              >
                {row.contractors.map(option => (
                  <MenuItem key={option.contractorId} value={option.contractorId}>
                    {option.companyName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="button-container multi-button">
              <Button
                onClick={() => window.open("/contractors/" + contractor)}
                variant="contained"
                color="primary"
              >
                VIEW PROFILE
              </Button>
              <Button
                onClick={() => claimJobConfirm()}
                variant="contained"
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                HIRE CONTRACTOR
              </Button>
              <Button
                onClick={() => cancelJobConfirm()}
                variant="contained"
                color="secondary"
              >
                CANCEL JOB
              </Button>
            </div>
          </Auxil>
        );
      }
      else if (row.invoicePrice && row.invoiceAccepted === null) {
        content = (
          <Auxil>
            <Alert severity="info" color="info">The contractor has suggested an invoice of <b>${(row.invoicePrice * 1.00).toFixed(2)}</b> (HST not included).</Alert>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="button-container">
                <Button
                  variant="contained"
                  onClick={() => acceptInvoice(true)}
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
                  onClick={() => acceptInvoice(false)}
                  color="secondary"
                >
                  DECLINE
                </Button>
              </div>
              <div style={{ margin: "15px 0" }}>
                <Button
                  onClick={() => cancelJobConfirm()}
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
      else if (row.contractorId === null || row.invoicePrice === null || row.invoiceAccepted === "0") {
        content = (
          <div className="button-container">
            <Button
              onClick={() => cancelJobConfirm()}
              variant="contained"
              color="secondary"
            >
              CANCEL JOB
            </Button>
          </div>
        );
      }
    }
    else if (userType === 1) {
      // CONTRACTOR
      if (row.invoicePrice === null || row.invoiceAccepted === "0") {
        content = (
          <Auxil>
            {row.invoiceAccepted === "0" && (
              <Alert severity="error" color="error">The customer rejected your invoice of $<b>{row.invoicePrice}</b>. Please enter a new price.</Alert>
            )}
            <div className="textfield-container-row" style={{ marginTop: "15px" }}>
              <span className="field-desc">Enter the invoice price. This will have to be confirmed by the customer.</span>
              <TextField
                type="text"
                name="invoicePrice"
                label="invoice price"
                value={invoicePrice}
                variant="outlined"
                onChange={event => {
                  setPrice(event.target.value);
                }}
              />
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => sendInvoice()}
                disabled={invoicePrice === 0 || !invoicePrice }
                color="primary"
              >
                SEND INVOICE
            </Button>
            </div>
          </Auxil>
        );
      }
      else if (row.invoiceAccepted === "1" && row.holdingFeePaid && row.completionDate === null) {
        content = (
          <Auxil>
            {requiresInspection && (
              <Auxil>
                <span className="field-desc">Record any relevant notes to pass onto the inspector.</span>
                <div className="textfield-container-row">
                  <TextField
                    multiline
                    rowsMax={6}
                    type="text"
                    label="notes"
                    value={notes}
                    variant="outlined"
                    onChange={event => {
                      setNotes(event.target.value);
                    }}
                  />
                </div>
              </Auxil>
            )}
            <span className="field-desc">Record the date when the job was completed.</span>
            <div className="textfield-container-row">
              <TextField
                type="date"
                value={completionDate}
                onChange={event => {
                  setDate(event.target.value);
                }}
                style={{ width: "175px", marginRight: "20px" }}
              />
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => completeJob()}
                disabled={completionDate === ""}
                color="primary"
              >
                SUBMIT
              </Button>
            </div>
          </Auxil>
        );
      }
      else if (row.completionDate !== null && row.invoicePaid === null) {
        content = (
          <Auxil>
            <Alert severity="info" color="info">The remainder of the invoice <b>${(invoicePriceHst - holdingFeeHst).toFixed(2)}</b> (${(row.invoicePrice - holdingFee).toFixed(2)} + HST) is owed by the customer.</Alert>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => paymentReceivedConfirm()}
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
    else if (userType === 2) {
      // INSPECTOR
      if (row.inspectorId === null) {
        content = (
          <div className="button-container">
            <Button
              variant="contained"
              onClick={() => claimJob()}
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
      else if (row.completionDate !== null && (row.inspectionDate === null || row.inspectionPassed === "0")) {
        content = (
          <RadioGroup
            value={inspectionPassed}
            onChange={event => {
              setInspection(event.target.value);
            }}
          >
            <span style={{ marginBottom: "5px" }}>Did the job pass inspection?</span>
            <span style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </span>
          </RadioGroup>
        );

        if (inspectionPassed !== null) {
          if (inspectionPassed === "false") {
            content = (
              <Auxil>
                {content}
                <span className="field-desc">Record any relevant notes to pass back to the contractor.</span>
                <div className="textfield-container-row">
                  <TextField
                    multiline
                    rowsMax={6}
                    type="text"
                    label="notes"
                    value={notes}
                    variant="outlined"
                    onChange={event => {
                      setNotes(event.target.value);
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
              <div className="textfield-container-row">
                <TextField
                  type="date"
                  value={completionDate}
                  onChange={event => {
                    setDate(event.target.value);
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
                        setReport(true);
                      }
                      else {
                        setReport(false);
                      }
                    }}
                    checked={reportSent}
                  />
                }
                label="I have filled out an inspection report"
              />
              <div className="button-container">
                <Button
                  variant="contained"
                  onClick={() => completeJob()}
                  disabled={completionDate === "" || !reportSent}
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
    else if (userType === 3) {
      // ADMIN
      if (row.invoiceAccepted === "1" && row.holdingFeePaid === null) {
        content = (
          <Auxil>      
            <Alert severity="info" color="info">A holding fee of <b>${holdingFeeHst.toFixed(2)}</b> is owed by the customer.</Alert>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => paymentReceivedConfirm()}
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

  function getJobStatus() {
    let status = null;

    if (row.isAbandoned === "1") {
      status = <Chip className="status cancelled" label="Job Cancelled" />;
    }
    else if (row.contractorId === null) {
      if (row.contractors && row.contractors.length > 0) {
        status = (
          <Chip className="status interested" label={row.contractors.length === 1 ?
            <span><b>1</b> Contractor Interested</span> :
            <span><b>{row.contractors.length}</b> Contractors Interested</span>
          } />
        );
      }
      else {
        status = (
          <Chip className="status required" label="Contractor Required" />
        );
      }
    }
    else if (row.invoicePrice === null || row.invoiceAccepted === "0") {
      status = <Chip className="status required" label="Invoice Required" />;
    }
    else if (row.invoiceAccepted === null) {
      status = <Chip className="status required" label="Response Required" />;
    }
    else if (userType === "1" && row.invoiceAccepted === "0") {
      status = <Chip className="status in-progress" label="Invoice Rejected" />;
    }
    else if (row.holdingFeePaid === "1" && row.completionDate === null) {
      status = <Chip className="status in-progress" label="Job In Progress" />;
    }
    else if (requiresInspection && (row.inspectorId === null || row.inspectionPassed === null || row.inspectionPassed === "0")) {
      if (row.inspectorId === null) {
        status = <Chip className="status required" label="Inspector Required" />;
      }
      else if (row.inspectionPassed === null) {
        status = <Chip className="status required" label="Requires Inspection" />;
      }
      else {
        status = <Chip className="status required" label="Requires Revisit" />;
      }
    }
    else if (row.holdingFeePaid === null || row.invoicePaid === null) {
      status = <Chip className="status required" label="Payment Required" />;
    }
    else {
      status = <Chip className="status completed" label="Completed" />;
    }

    return status;
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
                <td>Creation Date: {row.creationDate.split(" ")[0]}</td>
              </tr>
              <tr>
                <td>{getJobStatus()}</td>
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
          <TableCell>{getJobStatus()}</TableCell>
        </Auxil>
      );
    }

    return content;
  }

  function getAlertContent() {
    let content = null;

    if (row.isAbandoned === "1") {
      content = <Alert severity="error" color="error">The job was cancelled by the customer on {row.lastUpdatedDate.split(" ")[0]}.</Alert>;
    }
    else if (userType === 0) {
      if (row.contractorId !== null && (row.invoicePrice === null || row.invoiceAccepted === "0")) {
        content = <Alert severity="info" color="info">Waiting for the contractor to submit an invoice.</Alert>;
      }
      else if (row.holdingFeePaid === null && row.invoiceAccepted === "1") {
        content = <Alert severity="info" color="info">Please send the holding fee payment of <b>${holdingFeeHst.toFixed(2)}</b> (${holdingFee.toFixed(2)} + HST) to HOLDING_ACCOUNT_HERE.</Alert>;
      }
      else if (row.completionDate !== null) {
        if (row.invoicePaid === null) {
          content = <Alert severity="info" color="info">The job was completed on {row.completionDate.split(" ")[0]}. Please send the remaining invoice payment of <b>${(invoicePriceHst - holdingFeeHst).toFixed(2)}</b> (${row.invoicePrice} - Holding Fee + HST) to the contractor.</Alert>;
        }
        else if (row.invoicePaid === "1") {
          content = <Alert severity="success" color="success">The job was completed on {row.completionDate.split(" ")[0]} and the invoice payment has been processed.</Alert>;
        }
      }
    }
    else if (userType === 1) {
      if (row.invoicePrice !== null && row.invoiceAccepted === null) {
        content = <Alert severity="info" color="info">Waiting for the customer to confirm invoice.</Alert>;
      }
      else if (row.invoiceAccepted === "1" && row.holdingFeePaid === null) {
        content = <Alert severity="info" color="info">Waiting for the customer to pay the holding fee.</Alert>;
      }
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
                    <td>Job ID</td>
                    <td>{row.jobId}</td>
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
                  {row.invoicePrice && (
                    <Auxil>
                      <tr>
                        <td>Invoice Price</td>
                        <td>${(row.invoicePrice * 1.00).toFixed(2)} + HST (${invoicePriceHst.toFixed(2)})</td>
                      </tr>
                      <tr>
                        <td>Invoice Accepted?</td>
                        <td>{row.invoiceAccepted === null ? <span>&ndash;</span> : row.invoiceAccepted === "1" ? "Yes" : "No"}</td>
                      </tr>
                    </Auxil>
                  )}
                  {row.invoiceAccepted === "1" && (
                    <Auxil>
                      <tr>
                        <td>Holding Fee</td>
                        <td>${holdingFee.toFixed(2)} + HST (${holdingFeeHst.toFixed(2)})</td>            
                      </tr>
                      <tr>
                        <td>Holding Fee Paid?</td>
                        <td>{row.holdingFeePaid ? "Yes" : "No"}</td>
                      </tr>
                    </Auxil>
                  )}
                  {row.completionDate && (
                    < tr >
                      <td>Job Completion Date</td>
                      <td>{row.completionDate.split(" ")[0]}</td>
                    </tr>
                  )}
                  {userType !== 0 && row.contractorNotes && (
                    <tr>
                      <td>Contractor Notes</td>
                      <td>{row.contractorNotes}</td>
                    </tr>
                  )}
                  {row.inspectionDate && (
                    <tr>
                      <td>Inspection Date</td>
                      <td>{row.inspectionDate.split(" ")[0]}</td>
                    </tr>
                  )}
                  {row.inspectionPassed !== null && (
                    <tr>
                      <td>Inspection Passed</td>
                      <td>{row.inspectionPassed === "1" ? "Yes" : "No"}</td>
                    </tr>
                  )}
                  {userType !== 0 && row.inspectorNotes && (
                    <tr>
                      <td>Inspector Notes</td>
                      <td>{row.inspectorNotes}</td>
                    </tr>
                  )}
                  {row.completionDate !== null && (
                    <tr>
                      <td>Invoice Paid?</td>
                      <td>{row.invoicePaid ? "Yes" : "No"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {getAlertContent()}
              {row.isAbandoned === null && getUIContent()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Auxil >
  );
}

class JobsPage extends Component {
  state = {
    userType: null,
    jobs: null,
    isLoading: true
  };

  componentDidMount() {
    this.setState({ userType: AuthService.getRole() });

    JobService.getJobs()
      .then(res => {
        this.setState({ jobs: res.data, isLoading: false });
      })
      .catch(err => {
        console.error("Error while getting jobs" + err.response);
        this.setState({ isLoading: false });
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
                        contractor={null}
                        isMobile={false}
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
                        contractor={null}
                        isMobile={true}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </ThemeProvider>

          </Auxil>
        )}

        {!this.state.jobs && !this.state.isLoading && (
          <Auxil>
            <Title>JOBS</Title>
            <Alert severity="info" color="info">You don't have any jobs at the moment.</Alert>
          </Auxil>
        )}

        { this.state.isLoading && <Backdrop />}
      </div >
    );
  }
}

export default JobsPage;
