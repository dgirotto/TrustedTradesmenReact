import React, { Component } from "react";
import { JobService } from "../../services/jobs";
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

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.serviceName}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.city}</TableCell>
        <TableCell>{row.creationDate.split(" ")[0]}</TableCell>
        <TableCell>
          {row.inspectionDate ? (
            <Chip style={{ backgroundColor: "#99ff66" }} label="Inspected" />
          ) : row.completionDate ? (
            <Chip
              style={{ backgroundColor: "#ffdb4d" }}
              label="Pending Inspection"
            />
          ) : (
            <Chip
              style={{ backgroundColor: "rgb(255 174 154)" }}
              label="In Progress"
            />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <table className="job-details-table">
                <tr>
                  <td>Address</td>
                  <td>
                    {row.address} {row.city}, {row.province} {row.postalCode}
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
                <tr>
                  <td>Last Updated</td>
                  <td>{row.lastUpdatedDate.split(" ")[0]}</td>
                </tr>
              </table>
              <div className="button-container">
                <Button
                  onClick={() => alert("test")}
                  variant="contained"
                  color="secondary"
                >
                  ACCEPT JOB
                </Button>
                <Button
                  onClick={() => alert("test")}
                  variant="contained"
                  color="secondary"
                >
                  DECLINE JOB
                </Button>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

class JobsPage extends Component {
  state = {
    jobs: null,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });
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
                      <b>SERVICE</b>
                    </TableCell>
                    <TableCell>
                      <b>ADDRESS</b>
                    </TableCell>
                    <TableCell>
                      <b>CITY</b>
                    </TableCell>
                    <TableCell>
                      <b>CREATED</b>
                    </TableCell>
                    <TableCell>
                      <b>STATUS</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.jobs.map(job => (
                    <Row key={job.jobId} row={job} />
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
