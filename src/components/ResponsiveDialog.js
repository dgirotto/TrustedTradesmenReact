import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


export default function ResponsiveDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

    return (
        <Dialog
            open={props.isOpen}
            onClose={props.handleClose}
            fullScreen={fullScreen}
            fullWidth={true}
        >
            <DialogTitle style={{ background: "#fbfbfb" }}>{props.modalContent.title}</DialogTitle>
            <DialogContent style={{ background: "#fbfbfb" }}>
                <DialogContentText>
                    {props.modalContent.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions style={{ background: "#fbfbfb" }}>
                {props.modalContent.actions}
            </DialogActions>
        </Dialog>
    );
}