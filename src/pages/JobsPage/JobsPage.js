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
import Typography from "@material-ui/core/Typography";

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
//   createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
//   createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
//   createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5)
// ];

// function createData(name, calories, fat, carbs, protein, price) {
//   return {
//     name,
//     calories,
//     fat,
//     carbs,
//     protein,
//     price,
//     history: [
//       { date: "2020-01-05", customerId: "11091700", amount: 3 },
//       { date: "2020-01-02", customerId: "Anonymous", amount: 1 }
//     ]
//   };
// }

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // const classes = useRowStyles();
  return (
    <React.Fragment>
      {/* <TableRow className={classes.root}> */}
      <TableRow onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            // onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* <TableCell component="th" scope="row">
          {row.name}
        </TableCell> */}
        <TableCell>0</TableCell>
        <TableCell>A</TableCell>
        <TableCell>B</TableCell>
        <TableCell>C</TableCell>
        <TableCell>D</TableCell>
        <TableCell>D</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              {/* <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map(historyRow => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{historyRow.amount}</TableCell>
                      <TableCell>
                        {Math.round(historyRow.amount * row.price * 100) /
                          100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
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
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Service</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>Inspected</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.jobs.map(job => (
                    <Row key={job.jobId} row={job} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Postal Code</TableCell>
                    <TableCell>Province</TableCell>
                    <TableCell>Creation Date</TableCell>
                    <TableCell>Completion Date</TableCell>
                    <TableCell>Inspection Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.jobs.map(job => (
                    <TableRow className="table-row" key={job.jobId}>
                      <TableCell>{job.serviceId}</TableCell>
                      <TableCell>{job.budget}</TableCell>
                      <TableCell>{job.description}</TableCell>
                      <TableCell>{job.address}</TableCell>
                      <TableCell>{job.city}</TableCell>
                      <TableCell>{job.postalCode}</TableCell>
                      <TableCell>{job.province}</TableCell>
                      <TableCell>{job.creationDate}</TableCell>
                      <TableCell>{job.completionDate}</TableCell>
                      <TableCell>{job.inspectionDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> */}
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
