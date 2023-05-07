import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ErrorSnackbars({open, handleClose, message}) {


    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}  anchorOrigin={{ vertical:'top',horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>

        </>
    );
}