import React, { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    makeStyles,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    List,
} from '@material-ui/core';
import API from '../../../api/API';
import { SHIPPER_ENDPOINT } from '../../../api/endpoint';
import { ROLE } from '../../../common';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '80%',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: '5px',
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        position: 'relative',
        overflowY: 'auto',
    },
    formControl: {
        padding: 10,
        top: 10,
        height: '250px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const ModalAssignShipper = ({
    onInvisibleModel,
    onHandleAssign,
    user,
    onCurrentShipper,
}) => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [selectedShipper, setSelectedShipper] = useState(onCurrentShipper);

    useEffect(() => {
        const fetchShipper = async () => {
            if (user && user.roleId === ROLE.HUB_MANAGER) {
                const response = await API.get(`${SHIPPER_ENDPOINT}?page=1&limit=50&hub_manager_phone=${user.phone}`);
                if (response.ok) {
                    const fetchData = await response.json();
                    setData(fetchData.data);
                }
            }
        };
        fetchShipper();
    }, [user]);

    const handleChange = (event) => {
        setSelectedShipper(+event.target.value);
    };

    const handleSubmit = () => {
        if (!selectedShipper) {
            alert('Please select shipper!');
        }
        onHandleAssign(selectedShipper);
    };

    return (
        <div className={classes.root}>
            <List className={classes.container} subheader={<li />}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend" style={{ fontWeight: 'bold' }}>List Shipper</FormLabel>
                    <RadioGroup
                        aria-label="List shipper"
                        onChange={handleChange}
                        value={selectedShipper}
                    >
                        {(data && data.items && data.items.length)
                            ?
                            data.items.map((shipper, index) => (
                                <FormControlLabel
                                    key={index}
                                    value={+shipper.id}
                                    control={<Radio />}
                                    label={shipper.last_name + " " + shipper.first_name}
                                />
                            ))
                            : <p>List Shipper Is Empty!</p>
                        }

                    </RadioGroup>
                </FormControl>
            </List>
            <Divider />
            <div className={classes.actions}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                    style={{ color: 'white', margin: 10 }}
                >
                    Submit
                 </Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onInvisibleModel()}
                    style={{ color: 'white', margin: 10 }}
                >
                    Close
             </Button>
            </div>
        </div>
    );
};

export default ModalAssignShipper;