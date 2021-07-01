import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { RiCloseLine } from "react-icons/ri";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { AuthService } from "../services/auth";
import { CacheService } from "../services/caching";

export default function LoginDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const change = event => {
        console.log(event.target.name);
        if (event.target.name == 'email') {
            setEmail(event.target.value);
        }
        else if (event.target.name == 'password') {
            setPassword(event.target.value);
        }
        else if (event.target.name == 'confirmPassword') {
            setConfirmPassword(event.target.value);
        }
    };

    const generateToken = () => {
        AuthService.generateToken({
            email: email
        })
            .then(() => {
                // this.setState({
                //   emailToReset: "",
                //   isLoading: false,
                //   showSnackbar: true,
                //   isError: false,
                //   message: "A password reset token has been sent to your email address."
                // });
            })
            .catch(error => {
                // this.setState({
                //   isLoading: false,
                //   showSnackbar: true,
                //   isError: true,
                //   message: error.response.data.message
                // });
            });
    };

    const login = () => {
        const loginDetails = {
            email: email,
            password: password
        };

        AuthService.login(loginDetails)
            .then(res => {
                const token = res.data.jwt;
                localStorage.setItem("jwt-token", token);
                CacheService.cacheToken(token);
                window.location.href = "/jobs";
            })
            .catch(error => {
                // var loginDetailsNew = { ...this.state.loginDetails };
                // loginDetailsNew.password = "";

                // this.setState({
                //   loginDetails: loginDetailsNew,
                //   isLoading: false,
                //   showSnackbar: true,
                //   isError: true,
                //   message: error.response.data.message
                // });
            });
    };

    const getUIContent = () => {
        var userInterface =
            <div className="textfield-container-col">
                <TextField
                    type="text"
                    name="email"
                    label="Email"
                    value={email || ""}
                    variant="outlined"
                    onChange={change}
                />
            </div>

        if (props.modalTypeToShow === 2) {
            userInterface = <>
                <h1>FORGOT PASSWORD</h1>
                {userInterface}
            </>;
        }
        else {
            userInterface = <>
                {userInterface}
                <div className="textfield-container-col">
                    <TextField
                        type="password"
                        name="password"
                        label="Password"
                        value={password || ""}
                        variant="outlined"
                        onChange={change}
                    />
                </div>
            </>

            if (props.modalTypeToShow === 0) {
                userInterface = <>
                    <h1>CREATE AN ACCOUNT</h1>
                    {userInterface}
                    <div className="textfield-container-col">
                        <TextField
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={confirmPassword || ""}
                            variant="outlined"
                            onChange={change}
                        />
                    </div>
                </>;
            }
            else {
                userInterface = <>
                    <h1>LOGIN</h1>
                    {userInterface}
                    <div className="forgot-password" onClick={() => props.handleModalTypeChange(2)}>
                        Forgot Password?
                    </div>
                    <Button
                        disabled={!email || !password}
                        onClick={login}
                        variant="contained"
                        color="primary"
                        style={{ width: "175px", fontWeight: "bold" }}
                    >
                        LOGIN
                    </Button>
                    {/* <div className="no-account-msg">
                        Don't have an account? Create one <a href="/register">here</a>.
                    </div> */}
                </>;
            }
        }

        return userInterface;
    }

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.handleClose}
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={'md'}
        >
            <DialogContent className="login-dialog">
                <div className="login-image" style={{
                    flex: 1,
                    background: `url('${process.env.PUBLIC_URL}/images/login-background-2.jpg')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                }}>
                </div>
                <div style={{ flex: 1 }}>
                    <RiCloseLine
                        className="close-icon"
                        size="43"
                        onClick={props.handleClose}
                    />
                    <div>
                        {getUIContent()}
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    );
}