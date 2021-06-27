import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { RiCloseLine } from "react-icons/ri";

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export default function LoginDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

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
                    backgroundSize: "cover",
                }}>
                </div>
                <div style={{ flex: 1 }}>
                    <RiCloseLine
                        className="close-icon"
                        size="43"
                        onClick={props.handleClose}
                    />
                    {props.isRegistering ? (
                        <p>REGISTERING</p>
                    ) : (
                        <p>LOGGING IN</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}