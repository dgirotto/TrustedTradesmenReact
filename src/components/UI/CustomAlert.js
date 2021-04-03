import React, { Component } from "react";
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import Paper from "@material-ui/core/Paper";

export default class CustomAlert extends Component {
  getIcon = () => {
    let icon = null;
    if (this.props.type === "warning") {
      icon = <ReportProblemOutlinedIcon style={{ fontSize: "55", color: "#ff9800" }} />
    }
    else if (this.props.type === "info") {
      icon = <InfoOutlined style={{ fontSize: "55", color: "#2196f3" }} />
    }
    else if (this.props.type === "success") {
      icon = <CheckCircleOutlinedIcon style={{ fontSize: "55", color: "#4caf50" }} />
    }
    return icon;
  }

  render() {
    return (
      <Paper className={`${this.props.type}-alert`} style={{ maxWidth: "600px", margin: "0 auto 20px", padding: "20px", boxShadow: "none" }}>
        <div style={{ fontSize: "15px" }}>
          <div style={{ textAlign: "center" }}>
            {this.getIcon()}
            <h3 style={{ margin: "15px 0" }}>{this.props.title}</h3>
          </div>
          {this.props.children}
        </div>
      </Paper>
    );
  }
}