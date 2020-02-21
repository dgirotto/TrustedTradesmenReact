// import React, { Component } from "react";
// import { AuthService } from "../../services/auth";
// // import { CacheService } from "../../services/caching";
// import { CacheService } from "../../services/caching";

// import Box from "@material-ui/core/Box";
// import TextField from "@material-ui/core/TextField";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import Button from "@material-ui/core/Button";
// import Lock from "@material-ui/icons/Lock";
// import Person from "@material-ui/icons/Person";
// import Checkbox from "@material-ui/core/Checkbox";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

// import "./Login.css";

// class LoginPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isAuth: false,
//       isLoading: false,
//       email: "",
//       password: "",
//       checked: false
//     };
//   }

//   handleRemberMeChange = event => {
//     this.setState({ checked: event.target.checked });
//   };

//   componentDidMount = event => {
//     if (this.props.isAuth) {
//       window.location.href = "/";
//     }
//   };

//   componentDidUpdate = (prevProps, prevState) => {
//     if (this.props.isAuth !== prevProps.isAuth) {
//       this.setState({ isAuth: this.props.isAuth }, () => {
//         if (this.state.isAuth) {
//           window.location.href = "/";
//         }
//       });
//     }
//   };

//   login = () => {
//     if (!this.state.email || !this.state.password) return;

//     const auth = {
//       email: this.state.email,
//       password: this.state.password
//     };

//     this.setState({ isLoading: true });

//     AuthService.login(auth)
//       .then(res => {
//         const token = res.headers["x-amzn-remapped-authorization"];

//         CacheService.cacheToken(token);
//         this.setState({ isLoading: false });
//         this.props.authenticate();
//       })
//       .catch(err => {
//         console.error(err.response.status);
//       });
//   };

//   handleEmailInput = event => {
//     this.setState({ email: event.target.value });
//   };

//   handlePasswordInput = event => {
//     this.setState({ password: event.target.value });
//   };

//   render() {
//     return (
//       <Box
//         className="login-container"
//         justifyContent="center"
//         flexDirection="column"
//         alignItems="center"
//         display="flex"
//         width="100%"
//       >
//         <form className="login-form">
//           <TextField
//             id="user-email"
//             label="Email"
//             type="text"
//             onChange={this.handleEmailInput}
//             value={this.state.email}
//             placeholder="Please enter email"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Person />
//                 </InputAdornment>
//               )
//             }}
//           />
//           <TextField
//             id="user-password"
//             label="Password"
//             type="password"
//             onChange={this.handlePasswordInput}
//             value={this.state.password}
//             placeholder="Please enter password"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Lock />
//                 </InputAdornment>
//               )
//             }}
//           />

//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={this.state.checked}
//                 onChange={this.handleRemberMeChange}
//                 value="primary"
//                 inputProps={{ "aria-label": "primary checkbox" }}
//               />
//             }
//             label="Remember me"
//           />

//           <Button
//             variant="contained"
//             disabled={this.state.isLoading}
//             disableElevation
//             className={this.state.isLoading ? "" : ""}
//             onClick={() => this.login()}
//           >
//             {this.state.isLoading ? "Loading..." : "Login"}
//           </Button>
//         </form>
//       </Box>
//     );
//   }
// }

// export default LoginPage;
