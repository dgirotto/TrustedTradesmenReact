import React, { Component } from "react";
import { LeadsService } from "../../services/leads";
import { AuthService } from "../../services/auth";

import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";
import { FaFileInvoiceDollar, FaRegClock, FaRegCalendarAlt } from "react-icons/fa";

import "./LeadsPage.css";
import { formatDate } from '../../helpers/Utils';

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';

import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
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
  const [open, setOpen] = React.useState(false);

  function dismissLead() {
    if (window.confirm("Are you sure you wish to dismiss this lead?")) {
      claimLead(false);
    }
  }

  function claimLead(isAccepted) {
    let body = {
      leadId: row.leadId,
      isAccepted: isAccepted ? 1 : 0
    };

    LeadsService.updateLead(body)
      .then(() => {
        window.location.reload();
      })
      .catch(err => {
        console.error("Error while updating lead" + err.response);
      });
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
                <td>Submitted: {formatDate(row.creationDate.split(" ")[0])}</td>
              </tr>
              <tr>
                <td>Time Frame: {row.timeFrame} Month(s)</td>
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
          <TableCell>{formatDate(row.creationDate.split(" ")[0])}</TableCell>
          <TableCell>{row.timeFrame} Month(s)</TableCell>
        </Auxil>
      );
    }

    return content;
  }

  return (
    <Auxil>
      <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {getRowContent()}
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Card className="job-details-card">
                <p className="item-title">LEAD ID</p>
                {row.leadId}
                <p className="item-title">SERVICE</p>
                {row.serviceName}
                <p className="item-title">SUBMISSION DATE</p>
                <span className="item-with-icon">
                  <FaRegCalendarAlt size={16} />&nbsp;
                  {formatDate(row.creationDate.split(" ")[0])}
                </span>
                <p className="item-title">LOCATION</p>
                {row.address}, {row.city}, {row.province}, {row.postalCode}
                <p className="item-title">DESCRIPTION</p>
                {row.description}
                <p className="item-title">BUDGET</p>
                <span className="item-with-icon">
                  <FaFileInvoiceDollar size={16} />&nbsp;
                  {row.budget}
                </span>
                <p className="item-title">TIME FRAME</p>
                <span className="item-with-icon">
                  <FaRegClock size={16} />&nbsp;
                  {row.timeFrame} Month(s)
                </span>
              </Card>
              {(props.userType === 1) && (
                <div className="button-container">
                  <Button
                    onClick={() => claimLead(true)}
                    variant="contained"
                    style={{ backgroundColor: "#3bb13b", color: "white" }}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    onClick={() => dismissLead()}
                    variant="contained"
                    color="secondary"
                  >
                    DISMISS
                  </Button>
                </div>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Auxil>
  );
}

class LeadsPage extends Component {
  state = {
    userType: null,
    leads: null,
    leadCount: null,
    pageNumber: 0,
    itemsPerPage: 10,
    isLoading: true
  };

  getLeads = () => {
    LeadsService.getLeads(this.state.pageNumber + 1, this.state.itemsPerPage)
      .then(res => {
        this.setState({
          leads: res.data.leads,
          leadCount: res.data.lead_count,
          isLoading: false
        });
      })
      .catch(err => {
        console.error("Error while getting leads" + err.response);
        this.setState({ isLoading: false });
      });
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      pageNumber: newPage
    }, () => {
      this.getLeads();
    });
  }

  handleChangeItemsPerPage = (event) => {
    this.setState({
      pageNumber: 0,
      itemsPerPage: event.target.value
    }, () => {
      this.getLeads();
    });
  }

  componentDidMount() {
    this.setState({
      userType: AuthService.getRole()
    }, () => {
      this.getLeads();
    });
  }

  render() {
    return (
      <div className="page-container">
        {this.state.leads && !this.state.isLoading && (
          <Auxil>
            <Title>LEADS</Title>
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
                        <b>Submitted</b>
                      </TableCell>
                      <TableCell>
                        <b>Time Frame</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.leads.map(lead => (
                      <Row
                        key={lead.leadId}
                        row={lead}
                        userType={this.state.userType}
                        isMobile={false}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TableContainer className="mobile-table" component={Paper}>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {this.state.leads.map(lead => (
                      <Row
                        key={lead.leadId}
                        row={lead}
                        userType={this.state.userType}
                        isMobile={true}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={this.state.leadCount}
                rowsPerPage={this.state.itemsPerPage}
                page={this.state.pageNumber}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeItemsPerPage}
              />

            </ThemeProvider>
          </Auxil>
        )}

        {!this.state.leads && !this.state.isLoading && (
          <Auxil>
            <Title>LEADS</Title>
            <Alert severity="info" color="info">You don't have any leads at the moment.</Alert>
          </Auxil>
        )}

        {this.state.isLoading && <Backdrop />}
      </div>
    );
  }
}

export default LeadsPage;
