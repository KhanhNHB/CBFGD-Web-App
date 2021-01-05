import React from 'react';
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
    Radio,
    Box
} from '@material-ui/core';
import API from '../api/API';
import { SHIPPER_ENDPOINT } from '../api/endpoint';
import { GENDER_ITEMS } from '../common';
import CloseIcon from '@material-ui/icons/Close';
import { Formik } from 'formik';
import * as Yup from 'yup';
import datetimeUtils from '../utils/datetimeUtils';

const formSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is not empty"),
    last_name: Yup.string().required("First name is not empty"),
    password: Yup.string().required("Password is not empty"),
    phone: Yup.string().required("Phone is not empty").min(7),
    identify_number: Yup.string().required("Identify number is not empty").min(8),
    license_number: Yup.string().required("License number is not empty").min(8),
    DOB: Yup.date()
});

const useStyles = makeStyles((theme) => ({
    container: {
        width: "80%",
        height: "70%",
        position: "absolute",
        marginTop: "10%",
        left: "50%",
        top: "20%",
        overflowY: 'auto',
        transform: "translate(-50%, -50%)",
        padding: "10px",
    },
    closeBtn: {
        margin: "10px",
        cursor: 'pointer',
        color: 'white'
    },
    detailHeader: {
        display: "flex",
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "#00bdb6",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
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

const ModalShipperAdd = (props) => {
    const classes = useStyles();

    const shipper = {
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        gender: "",
        DOB: "",
        address: "",
        identify_number: "",
        license_number: ""
    };

    const handleCreateShipper = async (data) => {
        const isChanged = JSON.stringify(shipper) !== JSON.stringify(data);
        if (!isChanged) return;

        const dataBody = {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: "0" + data.phone,
            password: data.password,
            gender: data.gender,
            DOB: data.DOB,
            address: data.address,
            identify_number: data.identify_number,
            license_number: data.license_number
        };
        const response = await API.post(`${SHIPPER_ENDPOINT}`, dataBody);
        if (response.ok) {
            props.onCloseModal(true);
        } else {
            const fetchData = await response.json();
            if (fetchData.message) {
                alert(fetchData.message);
                return;
            }
        }
    }

    return (
        <div className={classes.container}>
            <Formik
                validationSchema={formSchema}
                initialValues={shipper}
                onSubmit={(data) => handleCreateShipper(data)}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    touched,
                }) => {
                    return (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className={classes.detailHeader}>
                                <div style={{
                                    margin: "10px",
                                    color: 'white'
                                }}>
                                    <h3>Create Shipper</h3>
                                </div>
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
                                                label="First Name (*)"
                                                name="first_name"
                                                placeholder="Input shipper first name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.first_name}
                                                variant="outlined"
                                                helperText={errors.first_name}
                                                error={(errors.first_name && touched.first_name) ? true : false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Last Name (*)"
                                                name="last_name"
                                                placeholder="Input shipper last name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.last_name}
                                                variant="outlined"
                                                helperText={errors.last_name}
                                                error={(errors.last_name && touched.last_name) ? true : false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number (*)"
                                                name="phone"
                                                placeholder="Input shipper phone"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="number"
                                                value={values.phone}
                                                variant="outlined"
                                                helperText={errors.phone}
                                                error={(errors.phone && touched.phone) ? true : false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Password (*)"
                                                name="password"
                                                placeholder="Input shipper password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="password"
                                                value={values.password}
                                                variant="outlined"
                                                helperText={errors.password}
                                                error={(errors.password && touched.password) ? true : false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl style={{ marginLeft: 15 }}>
                                                <FormLabel>Gender</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-label="gender"
                                                    name="gender"
                                                    value={values.gender}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
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
                                                className={classes.textField}
                                                label="Birthday"
                                                type="date"
                                                name="DOB"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={datetimeUtils.DisplayDatePicker(values.DOB)}
                                                variant="outlined"
                                                helperText={errors.DOB}
                                                error={(errors.DOB && touched.DOB) ? true : false}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                name="address"
                                                placeholder="Input shipper address"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.address}
                                                variant="outlined"
                                                helperText={errors.address}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Identify Number (*)"
                                                name="identify_number"
                                                placeholder="Input shipper identify number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.identify_number}
                                                variant="outlined"
                                                helperText={errors.identify_number}
                                                error={(errors.identify_number && touched.identify_number) ? true : false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="License Number (*)"
                                                name="license_number"
                                                placeholder="Input shipper license number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.license_number}
                                                variant="outlined"
                                                helperText={errors.license_number}
                                                error={(errors.license_number && touched.license_number) ? true : false}
                                            />
                                        </Grid>
                                        <Divider />
                                        <Box display="flex" justifyContent="flex-end" p={2}>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                style={{ color: 'white' }}
                                                type="submit"
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Container>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default ModalShipperAdd;