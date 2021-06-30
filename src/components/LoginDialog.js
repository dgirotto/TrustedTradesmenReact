import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { RiCloseLine } from "react-icons/ri";

import TextField from "@material-ui/core/TextField";

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export default function LoginDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    React.useEffect(() => {
        setShowRegisterForm(props.isRegistering);
    }, [props.isRegistering]);

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

        if (showResetForm) {
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

            if (showRegisterForm) {
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