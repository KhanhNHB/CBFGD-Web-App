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
    List
} from '@material-ui/core';
import API from '../../../api/API';
import { HUB_ENDPOINT, SHIPPER_ENDPOINT } from '../../../api/endpoint';

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: 200
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'auto',
        maxHeight: '100%',
    },
    formControl: {
        padding: 10,
        top: 10,
        maxHeight: '50%',
    }
}));

const ModalAssign = ({
    onInvisibleModel,
    onVisibleModal,
    onHandleAssign
}) => {
    const classes = useStyles();

    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState(null);

    const fetchHub = async () => {
        const response = await API.get(HUB_ENDPOINT);
        const json = await response.json();

        if (!json.data.length) {
            return;
        }

        setHubs(json.data);
    };

    useEffect(() => {
        fetchHub();
    }, []);

    const handleChange = (event) => {
        setSelectedHub(+event.target.value);
    };

    const handleSubmit = () => {
        if (!selectedHub) {
            alert('Please select shipper!');
        }
        onHandleAssign(selectedHub);
        setSelectedHub(null);
    };

    return (
        <>
            <List className={classes.container} subheader={<li />}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend">List Hub</FormLabel>
                    <RadioGroup
                        aria-label="List hubs"
                        onChange={handleChange}
                        value={selectedHub}
                    >
                        {hubs.map((hub, index) => {
                            return <FormControlLabel
                                key={index}
                                value={+hub.id}
                                control={<Radio />}
                                label={hub.name}
                            />
                        })}
                    </RadioGroup>
                </FormControl>
            </List>
            <Divider />
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
        </>
    );
};

export default ModalAssign;
