import React, { useState } from 'react';
import {
    Button,
    Divider,
    Container,
    TextField,
    Grid,
    makeStyles,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@material-ui/core';
import API from '../api/API';
import { SHIPPER_ENDPOINT } from '../api/endpoint';
import { useDispatch } from 'react-redux';
import { actCreateShipper, actGetAllShipper } from '../actions';
import { GENDER_ITEMS } from '../common';
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles((theme) => ({
    container: {
        width: "50%",
        height: "55%",
        position: "absolute",
        marginTop: "10%",
        left: "50%",
        top: "20%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
    },
    closeBtn: {
        margin: "10px",
        cursor: 'pointer',
        color: 'white'
    },
    detailHeader: {
        backgroundColor: "#00bdb6",
        display: "flex",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        flexDirection: "row-reverse",
    },
    wrapperLeft: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        float: "left",
        padding: 20,
        overflowY: "auto",
        borderRight: "1px solid #e0e0e0",
        borderBottom: "3px solid #e0e0e0",
        borderBottomLeftRadius: "5px",
    },
}));
const ModalShipperAdd = (props, { values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
}) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [DOB, setDOB] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [identify_number, setIdentify_number] = useState('');
    const [license_number, setLicense_number] = useState('');
    const classes = useStyles();
    const handleCreateShipper = async () => {
        const response = await API.post(SHIPPER_ENDPOINT, {
            name: name,
            phone: phone,
            password: password,
            DOB: DOB,
            address: address,
            gender: gender,
            identify_number: identify_number,
            license_number: license_number,
        });
        const fetchData = await response.json();
        if (!fetchData.message) {
            dispatch(actCreateShipper(fetchData.data));
            props.onCloseModal();
            dispatch(actGetAllShipper(fetchData.data));
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.detailHeader}>
                <CloseIcon
                    className={classes.closeBtn}
                    onClick={() => props.onCloseModal()}
                />
            </div>
            <div className={classes.wrapperLeft}>
                <Container maxWidth="md">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Name (*)"
                                name="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Phone Number (*)"
                                name="phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Password (*)"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl style={{ marginLeft: 15 }}>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="Gender"
                                    name="gender"
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                >
                                    {
                                        GENDER_ITEMS.map(item => (
                                            <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="date"
                                fullWidth
                                placeholder="Date of Birth (*)"
                                name="DOB"
                                type="date"
                                // value={datetimeUtils.DisplayDateFormat(DOB)}
                                value={DOB}
                                onChange={e => setDOB(e.target.value)}
                                variant="outlined"
                            // InputLabelProps={{
                            //     shrink: true,
                            // }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Address (*)"
                                name="address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="Identify Number (*)"
                                name="identify_number"
                                value={identify_number}
                                onChange={e => setIdentify_number(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                placeholder="License Number (*)"
                                name="license_number"
                                value={license_number}
                                onChange={e => setLicense_number(e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Divider />
                        <Grid container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end">
                            <Grid xs={6} sm={3}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleCreateShipper}
                                >
                                    Save Shipper
                        </Button>
                            </Grid>
                            {/* <Grid xs={6} sm={3}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={props.onCloseModal}
                            >
                                Close
                            </Button>
                        </Grid> */}
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </div>
    );
};


export default ModalShipperAdd;
