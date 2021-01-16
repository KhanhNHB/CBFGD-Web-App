import React, { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    Container,
    TextField,
    Grid,
    makeStyles,
    FormControl,
    Box,
    InputLabel,
    MenuItem,
    Select
} from '@material-ui/core';
import API from '../api/API';
import { HUB_ENDPOINT, HUB_MANAGER_ENDPOINT } from '../api/endpoint';
import CloseIcon from '@material-ui/icons/Close';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { actGetListHub } from '../actions';

const formSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is not empty"),
    last_name: Yup.string().required("Last name is not empty"),
    password: Yup.string().required("Password is not empty"),
    phone: Yup.string().required("Phone is not empty").min(7),
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
    formControl: {
        width: 440,
    }
}));

const ModalHubManagerAdd = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const hubLocation = useSelector(state => state.hub.listHub);
    const [hub_id, setHub_id] = useState('');

    useEffect(() => {
        const fetchHub = async () => {
            const response = await API.get(`${HUB_ENDPOINT}?page=1&limit=50&hub_manager_phone=none`);
            if (response.ok) {
                const fetchData = await response.json();
                dispatch(actGetListHub(fetchData.data));
            }
        }
        fetchHub();
    }, [dispatch]);

    const hubManager = {
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        hub_id: "",
    }

    const handleCreateHubManager = async (data) => {
        const isChanged = JSON.stringify(hubManager) !== JSON.stringify(data);
        if (!isChanged) return;

        if (!hub_id) {
            alert('Hub is not empty. Please try again!');
            return;
        }

        const dataBody = {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: "0" + data.phone,
            password: data.password,
            hub_id: hub_id
        };

        const response = await API.post(`${HUB_MANAGER_ENDPOINT}`, dataBody);
        if (response.ok) {
            props.onCloseModal(true);
        } else {
            const fetchData = await response.json();
            if (fetchData.message) {
                alert(fetchData.message);
                return;
            }
        }
    };

    const handleChangeHub = (event) => {
        setHub_id(event.target.value);
    };

    return (
        <div className={classes.container}>
            <Formik
                validationSchema={formSchema}
                initialValues={hubManager}
                onSubmit={(data) => handleCreateHubManager(data)}
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
                                <div style={{ margin: "10px", color: 'white' }}>
                                    <h3>Create Hub Manager</h3>
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
                                                placeholder="Input first name"
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
                                                placeholder="Input last name"
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
                                                placeholder="Input phone number"
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
                                                placeholder="Password (*)"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                variant="outlined"
                                                type="password"
                                                helperText={errors.password}
                                                error={(errors.password && touched.password) ? true : false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">Hub Name</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={hub_id}
                                                    onChange={handleChangeHub}
                                                    label="Hub Name"
                                                >
                                                    {
                                                        hubLocation.map((hub, index) => {
                                                            return (<MenuItem key={index} value={hub.id}>{hub.address}</MenuItem>)
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
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

export default ModalHubManagerAdd;