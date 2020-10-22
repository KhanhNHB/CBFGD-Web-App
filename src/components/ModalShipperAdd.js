import React, { useState } from 'react';
import {
    Button,
    Divider,
    Container,
    TextField,
    Grid,
} from '@material-ui/core';
import API from '../api/API';
import { SHIPPER_ENDPOINT } from '../api/endpoint';
import { useDispatch } from 'react-redux';
import { actCreateShipper } from '../actions';

const ModalShipperAdd = (props) => {
    const dispatch = useDispatch();
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [DOB, setDOB] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [identify_number, setIdentify_number] = useState('');
    const [license_number, setLicense_number] = useState('');

    const handleCreateShipper = async () => {
        const response = await API.post(SHIPPER_ENDPOINT, {
            name: fullname,
            username: username,
            password: password,
            phone: phone,
            DOB: DOB,
            address: address,
            gender: gender,
            identify_number: identify_number,
            license_number: license_number,
            role: "Shipper",
        });
        const fetchData = await response.json();
        if (!fetchData.message) {
            dispatch(actCreateShipper(fetchData.data));
            props.onCloseModal();
        }

    }
    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Fullname"
                        name="fullname"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Username"
                        name="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Phone Number"
                        name="phone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Gender"
                        name="gender"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Date of Birth"
                        name="DOB"
                        value={DOB}
                        onChange={e => setDOB(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Address"
                        name="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Identify Number"
                        name="identify_number"
                        value={identify_number}
                        onChange={e => setIdentify_number(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="License Number"
                        name="license_number"
                        value={license_number}
                        onChange={e => setLicense_number(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        placeholder="Role"
                        name="role"
                        disabled
                        value="Shipper"
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
                            Save details
                        </Button>
                    </Grid>
                    <Grid xs={6} sm={3}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={props.onCloseModal}
                        >
                            Close
                    </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};


export default ModalShipperAdd;
