import React, { Component } from "react";
import { JobsService } from "../../services/jobs";
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

class JobsPage extends Component {
  state = {
    jobs: null,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    JobsService.getJobs()
      .then(res => {
        console.log(res.data);
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
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell align="right">Description</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">City</TableCell>
                    <TableCell align="right">Postal Code</TableCell>
                    <TableCell align="right">Province</TableCell>
                    <TableCell align="right">Creation Date</TableCell>
                    <TableCell align="right">Completion Date</TableCell>
                    <TableCell align="right">Inspection Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.jobs.map(job => (
                    <TableRow className="table-row" key={job.jobId}>
                      <TableCell align="right">{job.serviceId}</TableCell>
                      <TableCell align="right">{job.budget}</TableCell>
                      <TableCell align="right">{job.description}</TableCell>
                      <TableCell align="right">{job.address}</TableCell>
                      <TableCell align="right">{job.city}</TableCell>
                      <TableCell align="right">{job.postalCode}</TableCell>
                      <TableCell align="right">{job.province}</TableCell>
                      <TableCell align="right">{job.creationDate}</TableCell>
                      <TableCell align="right">{job.completionDate}</TableCell>
                      <TableCell align="right">{job.inspectionDate}</TableCell>
                    </TableRow>
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
