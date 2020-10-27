import React, { Component } from "react";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";
import { isMobile } from "react-device-detect";

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

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Alert from "@material-ui/lab/Alert";

function AlertPopup(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState(null);
  const [invoicePrice, setPrice] = React.useState(null);
  const [completionDate, setDate] = React.useState(null);
  const [contractor, setContractor] = React.useState(row.contractors && row.contractors.length > 0 ? row.contractors[0].contractorId : null);
  const [isLoading, setLoading] = React.useState(false);

  function claimJob() {
    setLoading(true);
    let body = { jobId: row.jobId };

    if (contractor !== null) {
      body.contractorId = contractor;
    }

    JobService.updateJob(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while claiming job" + err.response);
        setLoading(false);
      });
  }

  function cancelJob() {
    setLoading(true);
    let body = { jobId: row.jobId, isAbandoned: true };

    JobService.updateJob(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while abandoning job" + err.response);
        setLoading(false);
      });
  }

  function acceptInvoice(isAccepted) {
    setLoading(true);
    let body = { jobId: row.jobId, invoiceAccepted: isAccepted };

    JobService.updateJob(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while accepting job invoice" + err.response);
        setLoading(false);
      });
  }

  function sendInvoice() {
    setLoading(true);
    let body = { jobId: row.jobId, invoicePrice: invoicePrice };

    JobService.updateJob(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while updating job invoice" + err.response);
        setLoading(false);
      });
  }

  function completeJob() {
    setLoading(true);
    let body = null;

    if (props.userType === 1) {
      body = { jobId: row.jobId, contractorNotes: notes, completionDate: completionDate };
    }
    else if (props.userType === 2) {
      body = { jobId: row.jobId, inspectorNotes: notes, inspectionDate: completionDate };
    }

    JobService.updateJob(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while updating job" + err.response);
        setLoading(false);
      });
  }

  function claimJobConfirm() {
    if (
      window.confirm("Are you sure you wish to hire the selected contractor?")
    ) {
      claimJob();
    }
  }

  function cancelJobConfirm() {
    if (
      window.confirm("Are you sure you wish to cancel this job? This action cannot be undone.")
    ) {
      cancelJob();
    }
  }

  function getUIContent() {
    let content = null;

    if (props.userType === 0) {
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
            <div className="textfield-container-row">
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
                    {option.firstName} {option.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="button-container">
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
      else if (row.invoicePrice && row.invoiceAccepted === null) {
        content = (
          <Auxil>
            <Alert severity="info" color="info">The contractor has suggested an invoice of <b>${row.invoicePrice}</b>.</Alert>
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
                  ACCEPT INVOICE
              </Button>
                <Button
                  variant="contained"
                  onClick={() => acceptInvoice(false)}
                  color="secondary"
                >
                  DECLINE INVOICE
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
    else if (props.userType === 1) {
      // CONTRACTOR
      if ((row.invoiceAccepted === null && row.invoicePrice === null) || row.invoiceAccepted === "0") {
        content = (
          <Auxil>
            {row.invoiceAccepted === "0" ? (
              <Alert severity="error" color="error">The customer rejected your invoice of $<b>{row.invoicePrice}</b>. Please enter a new price.</Alert>
            ) : null}
            <div className="textfield-container-row" style={{ marginTop: "15px" }}>
              <span className="field-desc">Enter the invoice price. This will have to be confirmed by the customer.</span>
              <TextField
                type="text"
                name="invoicePrice"
                label="invoice price"
                value={invoicePrice || null}
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
                disabled={invoicePrice === null}
                color="primary"
              >
                SEND INVOICE
            </Button>
            </div>
          </Auxil>
        );
      }
      else if (row.invoiceAccepted === "1" && row.completionDate === null) {
        content = (
          <Auxil>
            <span className="field-desc">Record any relevant notes to pass onto the inspector.</span>
            <div className="textfield-container-row">
              <TextField
                multiline
                rowsMax={6}
                type="text"
                label="notes"
                value={notes || null}
                variant="outlined"
                onChange={event => {
                  setNotes(event.target.value);
                }}
              />
            </div>
            <div className="button-container">
              <TextField
                type="date"
                value={completionDate || null}
                onChange={event => {
                  setDate(event.target.value);
                }}
                style={{ width: "175px", marginRight: "20px" }}
              />
              <Button
                variant="contained"
                onClick={() => completeJob()}
                disabled={completionDate === null}
                color="primary"
              >
                COMPLETE JOB
              </Button>
            </div>
          </Auxil>
        );
      }
    }
    else if (props.userType === 2) {
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
      else if (row.inspectionDate === null) {
        content = (
          <Auxil>
            <span className="field-desc">Record any relevant notes to pass back to the contractor.</span>
            <div className="textfield-container-row">
              <TextField
                multiline
                rowsMax={6}
                type="text"
                label="notes"
                value={notes || null}
                variant="outlined"
                onChange={event => {
                  setNotes(event.target.value);
                }}
              />
            </div>
            <div className="button-container">
              <TextField
                type="date"
                value={completionDate || null}
                onChange={event => {
                  setDate(event.target.value);
                }}
                style={{
                  width: "175px",
                  marginRight: "20px"
                }}
              />
              <Button
                variant="contained"
                onClick={() => completeJob()}
                disabled={completionDate === null}
                style={{
                  backgroundColor: "#3bb13b",
                  color: "white"
                }}
              >
                COMPLETE JOB
            </Button>
            </div>
          </Auxil>
        );
      }
    }

    return content;
  }

  function getJobStatus(row) {
    let status = null;

    if (row.isAbandoned) {
      status = <Chip style={{ width: "185px" }} className="status cancelled" label="Job Cancelled" />;
    }
    else if (row.contractorId === null) {
      if (row.contractors && row.contractors.length > 0) {
        status = (
          <Chip style={{ width: "185px" }} style={{ width: "185px" }} className="status interested" label={row.contractors.length === 1 ?
            <span><b>1</b> Contractor Interested</span> :
            <span><b>{row.contractors.length}</b> Contractors Interested</span>
          } />
        );
      }
      else {
        status = (
          <Chip style={{ width: "185px" }} className="status required" label="Contractor Required" />
        );
      }
    }
    else if (row.invoicePrice === null || row.invoiceAccepted === "0") {
      status = <Chip style={{ width: "185px" }} className="status in-progress" label="Invoice Required" />;
    }
    else if (row.invoiceAccepted === null) {
      status = <Chip style={{ width: "185px" }} className="status in-progress" label="Invoice Pending" />;
    }
    else if (props.userType === "1" && row.invoiceAccepted === "0") {
      status = <Chip style={{ width: "185px" }} className="status in-progress" label="Invoice Rejected" />;
    }
    else if (row.completionDate === null) {
      status = <Chip style={{ width: "185px" }} className="status in-progress" label="Job In Progress" />;
    }
    else if (row.inspectorId === null) {
      status = <Chip style={{ width: "185px" }} className="status required" label="Inspector Required" />;
    }
    else if (row.inspectionDate === null) {
      status = (
        <Chip style={{ width: "185px" }} className="status in-progress" label="Requires Inspection" />
      );
    }
    else {
      status = <Chip style={{ width: "185px" }} className="status completed" label="Completed" />;
    }

    return status;
  }

  return (
    <Auxil>
      <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.serviceName}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.lastUpdatedDate.split(" ")[0]}</TableCell>
        <TableCell>{getJobStatus(row)}</TableCell>
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
                  {row.completionDate ? (
                    < tr >
                      <td>Job Completion Date</td>
                      <td>{row.completionDate.split(" ")[0]}</td>
                    </tr>
                  ) : null}
                  {row.completionDate && props.userType !== 0 && row.contractorNotes ? (
                    <tr>
                      <td>Contractor Notes</td>
                      <td>{row.contractorNotes}</td>
                    </tr>
                  ) : null}
                  {row.inspectionDate ? (
                    <tr>
                      <td>Inspection Date</td>
                      <td>{row.inspectionDate.split(" ")[0]}</td>
                    </tr>
                  ) : null}
                  {row.inspectionDate && props.userType !== 0 && row.inspectorNotes ? (
                    <tr>
                      <td>Inspector Notes</td>
                      <td>{row.inspectorNotes}</td>
                    </tr>
                  ) : null}
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
                  {row.invoicePrice ? (
                    <Auxil>
                      <tr>
                        <td>Invoice Price</td>
                        <td>${row.invoicePrice}</td>
                      </tr>
                      <tr>
                        <td>Invoice Accepted?</td>
                        <td>{row.invoiceAccepted === null ? <span>&ndash;</span> : row.invoiceAccepted === "1" ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td>Invoice Paid?</td>
                        <td>{row.invoicePaid ? "Yes" : <span>&ndash;</span>}</td>
                      </tr>
                    </Auxil>) : null}
                </tbody>
              </table>

              {/* TODO: Move the below to its own function */}
              {props.userType === 0 && !row.isAbandoned && row.contractorId && (row.invoicePrice === null || row.invoiceAccepted === "0") ? (
                <Alert severity="info" color="info">Waiting for the contractor to submit an invoice.</Alert>
              ) : null}
              {props.userType === 0 && row.completionDate && row.invoicePaid === null ? (
                <Alert severity="success" color="success">The job was completed on {row.completionDate.split(" ")[0]}. Please send the invoice payment of <b>${row.invoicePrice}</b> to the contractor.</Alert>
              ) : null}
              {props.userType === 0 && row.completionDate && row.invoicePaid === "1" ? (
                <Alert severity="success" color="success">The job was completed on {row.completionDate.split(" ")[0]} and the invoice payment has been processed.</Alert>
              ) : null}
              {props.userType === 1 && !row.isAbandoned && row.invoicePrice && !row.invoiceAccepted ? (
                <Alert severity="info" color="info">Waiting for the customer to confirm invoice.</Alert>
              ) : null}
              {row.isAbandoned ? (
                <Alert severity="error" color="error">The job was cancelled by the customer on {row.lastUpdatedDate.split(" ")[0]}.</Alert>
              ) : null}

              {!row.isAbandoned ? getUIContent() : null}
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
    isLoading: true,
    showSnackbar: false
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

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  render() {
    return (
      <div className="jobs-page-container">
        {this.state.jobs && !this.state.isLoading && (
          <Auxil>
            <Title>JOBS</Title>
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
                    <TableCell style={{ width: "130px" }}>
                      <b>Last Updated</b>
                    </TableCell>
                    <TableCell style={{ width: "180px" }}>
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
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Auxil>
        )}

        {!this.state.jobs && !this.state.isLoading && (
          <Auxil>
            <Title>JOBS</Title>
            <p>You don't have any Jobs yet!</p>
          </Auxil>
        )}

        {this.state.isLoading ? <Backdrop /> : null}

        <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={6000}
          onClose={this.toggleSnackbar}
        >
          <AlertPopup onClose={this.toggleSnackbar} severity="success">
            This is a success message!
          </AlertPopup>
        </Snackbar>
      </div>
    );
  }
}

export default JobsPage;
