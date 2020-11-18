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
        maxWidth: "1000px",
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
  const requiresInspection = parseInt(row.invoicePrice) >= 5000;

  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState(getNotes());
  const [invoicePrice, setPrice] = React.useState(null);
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

  function invoicePaid() {
    let body = {
      jobId: row.jobId,
      invoicePaid: 1
    };

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

  function invoicePaidConfirm() {
    if (
      window.confirm("Are you sure you've received payment for this job?")
    ) {
      invoicePaid();
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
      if ((row.invoiceAccepted === null && row.invoicePrice === null) || row.invoiceAccepted === "0") {
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
      if (row.invoiceAccepted === "1" && row.invoicePaid === null) {
        content = (
          <div className="button-container">
            <Button
              variant="contained"
              onClick={() => invoicePaidConfirm()}
              style={{
                backgroundColor: "#3bb13b",
                color: "white"
              }}
            >
              INVOICE PAID
            </Button>
          </div>
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
    else if (row.completionDate === null) {
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
    else if (row.invoicePaid === null) {
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
                <td>Last Updated: {row.lastUpdatedDate.split(" ")[0]}</td>
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
          <TableCell>{row.lastUpdatedDate.split(" ")[0]}</TableCell>
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
      else if (row.completionDate !== null) {
        if (row.invoicePaid === null) {
          content = <Alert severity="success" color="success">The job was completed on {row.completionDate.split(" ")[0]}. Please send the invoice payment of <b>${row.invoicePrice}</b> to the contractor.</Alert>;
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
                    </Auxil>)}
                </tbody>
              </table>
              {getAlertContent()}
              {row.isAbandoned === null && getUIContent()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Auxil >
  );;
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
      <div className="jobs-page-container">
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

        {!this.state.isLoading && this.state.userType !== 2 && this.state.userType !== 3 && (
          <h4 className="disclaimer-title">DISCLAIMER</h4>
        )}

        {!this.state.isLoading && this.state.userType === 0 && (
          <div className="disclaimer">
            All persons using our site acknowledges that our contractors are only recommendations.
            All contractors have been vetted by a qualified and licensed inspector and have demonstrated both quality workmanship and integrity.
            We recommend all persons research their suggested contractors prior to making a selection.
            We require all persons choosing a Trusted Tradesmen contractor, prior to the contractor Starting to deposit 15% + HST (see exclusions) of the total job cost into a holding account with Trusted Tradesmen. This will come of the final there final bill and will only be released to the contractor when inspector had checked and no problems were found. If problems are discovered Trusted Tradesmen gives contractor a chance to return to correct or if contractor fails to do so, money in trust is not released to contractor but instead is used to correct problems found. Contractor will now be removed from site NEVER to be allowed back on. Trusted Tradesmen has done our best to investigate all our contractors and only obtain ones with good morals, values and quality of work, no one will get ripped off. Depending on type of job and price, Trusted Tradesmen will send a professional inspector out within 2 weeks of job completion to inspect quality of work at contractors expense.
            All contractors on Trusted Tradesmen will have duel ratings, one from customer and one from professional (inspector). Most sites only have one rating from customers who mostly no nothing about construction methods , Trusted Tradesmen will give customers a clearer picture of contractor performance. This is the site I want you, your parents or grand parents to use knowing they will get a great job done for a fair price and will never get ripped off.
          </div>
        )}

        {!this.state.isLoading && this.state.userType === 1 && (
          <div className="disclaimer">
            Contractors affiliated with Trusted Tradesmen will abide by our motto; "Quality Work for a Fair Price".
            Our contractors are encouraged to maintain honesty, integrity, and quality of work.
            Jobs over $5,000 will be validated by a professional home inspector to ensure they meet our quality standards.
            In the event that a home inspector finds a job which doesn't meet our standards, the contractor will be notified and the issue will be remedied through a return visit.
            Our inspectors are veterans; they understand the industry very well, and are aware of the limitations contractors experience with aspects such as materials and customers.
            Our inspectors are here to validate your workmanship and add to your reputation.
            Trusted Tradesmen is not looking for the cheapest contractors, and we're not looking for the most expensive; we want you to be honest with your estimates as to ensure the job is completed in a quality fashion.
            Trusted Tradesmen wants all of our contractors to earn a good living and be paid what they deserve based on quality and workmanship.
            The ultimate goal of this site is to help contractors to obtain relevant job leads and bolster their reputation, adding nicely to their bottom line.
            The contractor will only have to pay a consultation fee on jobs obtained and completed.
            There is no fee to be featured on our site or to possess a contractor account.
            The jobs leads will be emailed to contractors with pertinent info of the job including client budget and will only be mailed out if it is within the agreed upon contractor coverage area.
            Contractors may decide to contact client and obtain more info or just decline job lead.
            Trusted Tradesmen will require the contractor to pay the consultation fee directly to Trusted Tradesmen on the lower priced jobs completed (see fee schedule below):
            <table className="fee-table">
              <tr>
                <th style={{ paddingRight: "15px" }}>Contract Cost (CC)</th>
                <th>Fee</th>
              </tr>
              <tr>
                <td>Less than $500</td>
                <td>Free</td>
              </tr>
              <tr>
                <td>$501 to $1,500</td>
                <td>$50</td>
              </tr>
              <tr>
                <td>$1,501 to $3,000</td>
                <td>$150</td>
              </tr>
              <tr>
                <td>$3,001 to $5,000</td>
                <td>$250</td>
              </tr>
              <tr>
                <td>$5,001 to $7,500</td>
                <td>$375</td>
              </tr>
              <tr>
                <td>$7,501 to $100k</td>
                <td>5% of CC</td>
              </tr>
              <tr>
                <td>Over $100k</td>
                <td>5% of first $100k, 2.5% of remaining CC</td>
              </tr>
            </table>
            Selected jobs over $5,000 will be subjected to a 15% hold back and a check by a professional inspector within two weeks of job completion.
            Upon favourable check by inspector, remaining funds will be released to contractor minus Trusted Tradesmens fee.This fee is to be deposited into a Trusted Tradesmen holding account by the client prior to contractor starting job.
            This may also protect the contractor in the case where the client doesn’t fully pay the contractor what is owed, Trusted Tradesmen will forgo there fee and release the entire amount to the contractor and client will never be able to use Trusted Tradesmen site again.
            All Trusted Tradesmen contractors will obtain proper permits for jobs, abide by Ontario building codes and be respectable to all clients.
            Trusted Tradesmen wants their site to be recognized by the elderly community as one that can be trusted to obtain reliable and quality contractors at any time; a site you would trust your parents to pick a contractor from.
          </div>
        )}

        { this.state.isLoading && <Backdrop />}
      </div >
    );
  }
}

export default JobsPage;
