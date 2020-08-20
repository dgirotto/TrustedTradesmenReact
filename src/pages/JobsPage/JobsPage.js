import React, { Component } from "react";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";
import { isMobile } from "react-device-detect";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";

import "./JobsPage.css";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import { LeadsService } from "../../services/leads";

function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  const [completionDate, setDate] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  function claimClickHandler() {
    setLoading(true);
    let body = { jobId: row.jobId };

    JobService.updateJob(body)
      .then(() => {
        setLoading(false);
      })
      .catch(err => {
        console.error("Error while updating job" + err.response);
        setLoading(false);
      });
  }

  function completeClickHandler() {
    setLoading(true);
    let body = null;
    if (props.userType === 1) {
      body = { jobId: row.jobId, completionDate: completionDate };
    } else if (props.userType === 2) {
      body = { jobId: row.jobId, inspectionDate: completionDate };
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

  function getContent() {
    let content = null;

    if (row.contractors && row.contractors.length > 0) {
      // CUSTOMER
      content = <b>WE HAVE CONTRACTORS</b>;
    } else if (props.userType === 1 && row.completionDate === null) {
      // CONTRACTOR
      content = (
        <div className="button-container" style={{ marginBottom: "30px" }}>
          <TextField
            type="date"
            value={completionDate || null}
            onChange={event => {
              setDate(event.target.value);
            }}
            style={{ width: "150px", marginRight: "20px" }}
          />
          <Button
            variant="contained"
            onClick={() => completeClickHandler()}
            disabled={completionDate === null}
            style={{
              backgroundColor: "#3bb13b",
              color: "white",
              width: "175px"
            }}
          >
            COMPLETE JOB
          </Button>
        </div>
      );
    } else if (props.userType == 2) {
      // INSPECTOR
      if (row.inspectorId === null) {
        content = (
          <div className="button-container" style={{ marginBottom: "30px" }}>
            <Button
              variant="contained"
              onClick={() => claimClickHandler()}
              style={{
                backgroundColor: "#3bb13b",
                color: "white",
                width: "150px"
              }}
            >
              CLAIM JOB
            </Button>
          </div>
        );
      } else if (row.inspectionDate == null) {
        content = (
          <div className="button-container" style={{ marginBottom: "30px" }}>
            <TextField
              type="date"
              value={completionDate || null}
              onChange={event => {
                setDate(event.target.value);
              }}
              style={{
                width: "150px",
                marginRight: "20px"
              }}
            />
            <br />
            <Button
              variant="contained"
              onClick={() => completeClickHandler()}
              disabled={completionDate === null}
              style={{
                backgroundColor: "#3bb13b",
                color: "white",
                width: "175px"
              }}
            >
              COMPLETE JOB
            </Button>
          </div>
        );
      }
    }
    return content;
  }

  function getJobStatus(row) {
    let content = null;

    if (row.contractorId === null) {
      content = (
        <Chip className="status required" label="Contractor Required" />
      );
    } else if (row.completionDate === null) {
      content = <Chip className="status in-progress" label="Job In Progress" />;
    } else if (row.inspectorId === null) {
      content = <Chip className="status required" label="Inspector Required" />;
    } else if (row.inspectionDate === null) {
      content = (
        <Chip className="status in-progress" label="Requires Inspection" />
      );
    } else {
      content = <Chip className="status completed" label="Completed" />;
    }

    return content;
  }

  return (
    <React.Fragment>
      <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.jobId}</TableCell>
        <TableCell>{row.serviceName}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.lastUpdatedDate.split(" ")[0]}</TableCell>
        <TableCell>{getJobStatus(row)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <table className="job-details-table">
                <tr>
                  <td style={{ width: "175px" }}>Job ID</td>
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
                  <tr>
                    <td>Job Completion Date</td>
                    <td>{row.completionDate.split(" ")[0]}</td>
                  </tr>
                ) : null}
                {row.inspectionDate ? (
                  <tr>
                    <td>Inspection Date</td>
                    <td>{row.inspectionDate.split(" ")[0]}</td>
                  </tr>
                ) : null}
                <tr>
                  <td>Location</td>
                  <td>
                    {row.address}, {row.city}, {row.province}, {row.postalCode}
                  </td>
                </tr>
                <tr>
                  <td>Budget</td>
                  <td>${row.budget}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{row.description}</td>
                </tr>
              </table>
              {getContent()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

class JobsPage extends Component {
  state = {
    userType: null,
    jobs: null,
    isLoading: false
  };

  getJobs() {
    JobService.getJobs()
      .then(res => {
        res.data.forEach(job => {
          if (this.state.userType === 0 && job.contractorId === null) {
            LeadsService.getContractors(job.jobId).then(res => {
              job.contractors = res.data;
            });
          }
        });
        this.setState({ jobs: res.data, isLoading: false });
      })
      .catch(err => {
        console.error("Error while getting jobs" + err.response);
        this.setState({ isLoading: false });
      });
  }

  componentDidMount() {
    this.setState({ userType: AuthService.getRole(), isLoading: true });
    this.getJobs();
  }

  render() {
    return (
      <div className="jobs-page-container">
        {this.state.jobs && (
          <Aux>
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
                    <TableCell />
                    <TableCell>
                      <b>ID</b>
                    </TableCell>
                    <TableCell>
                      <b>SERVICE</b>
                    </TableCell>
                    <TableCell>
                      <b>ADDRESS</b>
                    </TableCell>
                    <TableCell>
                      <b>CITY</b>
                    </TableCell>
                    <TableCell>
                      <b>UPDATED</b>
                    </TableCell>
                    <TableCell>
                      <b>STATUS</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.jobs.map(job => (
                    <Row
                      key={job.jobId}
                      row={job}
                      userType={this.state.userType}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Aux>
        )}
        {!this.state.jobs && !this.state.isLoading && (
          <Aux>
            <Title>JOBS</Title>
            <p>You don't have any Jobs yet!</p>
          </Aux>
        )}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default JobsPage;
