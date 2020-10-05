// import React, { Component } from "react";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import MenuItem from "@material-ui/core/MenuItem";
// import Auxil from "../../helpers/Auxil";
// import Backdrop from "../../components/UI/Backdrop/Backdrop";
// import Title from "../../components/UI/Title/Title";
// import "./ContractorDetailsPage.css";

// import { AccountService } from "../../services/account";
// import { AuthService } from "../../services/auth";

// class ContractorDetailsPage extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       serviceDetails: null,
//       accountDetails: null,
//       isLoading: false
//     };
//   }

//   componentDidMount() {
//     this.setState({ isLoading: true });

//     ServicesService.getServiceDetails(this.props.match.params.id)
//       .then(res => {
//         this.setState({ serviceDetails: res.data });

//         AccountService.getAccountDetails()
//           .then(res => {
//             var jobDetailsCopy = this.state.jobDetails;

//             jobDetailsCopy.address = res.data.address;
//             jobDetailsCopy.city = res.data.city;
//             jobDetailsCopy.province = res.data.province;
//             jobDetailsCopy.postalCode = res.data.postalCode;

//             this.setState({
//               accountDetails: res.data,
//               jobDetails: jobDetailsCopy,
//               isLoading: false
//             });
//           })
//           .catch(error => {
//             alert(
//               "Error while getting account details: " + error.response,
//               false
//             );
//           });
//       })
//       .catch(err => {
//         console.error("Error while getting service details" + err.response);
//       });
//   }

//   jobDetailsChange = event => {
//     const newJobDetails = Object.assign(this.state.jobDetails, {
//       [event.target.name]: event.target.value
//     });
//     this.setState({
//       jobDetails: newJobDetails
//     });
//   };

//   submitJobClickHandler = () => {
//     this.setState({ isLoading: true });

//     JobService.addJob(this.state.jobDetails)
//       .then(res => {
//         this.setState({ isLoading: false });
//       })
//       .catch(error => {
//         this.displayMessage("Error while adding job: " + error.response, false);
//         this.setState({ isLoading: false });
//       });
//   };

//   renderContent() {
//     return (
//       <Auxil>
//         <Title>{this.state.serviceDetails.serviceName.toUpperCase()}</Title>
//         <h2 className="form-title">DESCRIPTION</h2>
//         <p>{this.state.serviceDetails.description}</p>
//         <br />
//         <p style={{ fontStyle: "italic" }}>Interested in hiring a <b>{this.state.serviceDetails.serviceName}</b> contractor? Fill out the form below and submit a request.</p>
//         {this.state.userType === 0 ? (
//           <div className="textfield-container">
//             <div className="textfield-container-row">
//               <TextField
//                 type="text"
//                 name="budget"
//                 label="budget"
//                 value={this.state.jobDetails.budget || ""}
//                 variant="outlined"
//                 onChange={this.jobDetailsChange}
//               />
//             </div>
//             <div className="textfield-container-row">
//               <TextField
//                 type="text"
//                 name="description"
//                 label="description"
//                 value={this.state.jobDetails.description || ""}
//                 variant="outlined"
//                 onChange={this.jobDetailsChange}
//               />
//             </div>
//             <div className="textfield-container-row">
//               <TextField
//                 type="text"
//                 name="address"
//                 label="address"
//                 value={this.state.jobDetails.address || ""}
//                 variant="outlined"
//                 onChange={this.jobDetailsChange}
//               />
//             </div>
//             <div className="textfield-container-row">
//               <TextField
//                 type="text"
//                 name="city"
//                 label="city"
//                 value={this.state.jobDetails.city || ""}
//                 variant="outlined"
//                 onChange={this.jobDetailsChange}
//               />
//             </div>
//             <div className="textfield-container-row">
//               <TextField
//                 type="text"
//                 name="postalCode"
//                 label="postal code"
//                 value={this.state.jobDetails.postalCode || ""}
//                 variant="outlined"
//                 onChange={this.jobDetailsChange}
//               />
//             </div>
//             <div className="textfield-container-row">
//               <TextField
//                 select
//                 name="province"
//                 label="province"
//                 value={this.state.jobDetails.province || ""}
//                 onChange={this.jobDetailsChange}
//                 variant="outlined"
//               >
//                 {this.provinces.map(option => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </div>
//             <Button
//               onClick={this.submitJobClickHandler}
//               variant="contained"
//               color="primary"
//               disabled={
//                 !(
//                   this.state.jobDetails.budget &&
//                   this.state.jobDetails.description &&
//                   this.state.jobDetails.address &&
//                   this.state.jobDetails.city &&
//                   this.state.jobDetails.postalCode &&
//                   this.state.jobDetails.province
//                 )
//               }
//             >
//               SUBMIT REQUEST
//             </Button>
//           </div>
//         ) : null}
//       </Auxil>
//     );
//   }

//   render() {
//     return (
//       <div className="service-details-page-container">
//         {this.state.serviceDetails &&
//           this.state.accountDetails &&
//           this.renderContent()}
//         {this.state.isLoading ? <Backdrop /> : null}
//       </div>
//     );
//   }
// }

// export default ContractorDetailsPage;
