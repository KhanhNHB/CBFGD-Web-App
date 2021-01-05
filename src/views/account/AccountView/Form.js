import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core';
import { GENDER_ITEMS } from '../../../common';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@material-ui/core';
import datetimeUtils from '../../../utils/datetimeUtils';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export const Form = ({
    values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange
}) => {
    const classes = useStyles();

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <Card>
                <CardHeader title="Profile" />
                <Divider />
                <CardContent>
                    <Grid container item spacing={3} xs={12}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name (*)"
                                name="first_name"
                                placeholder="Input your first name"
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
                                placeholder="Input your last name"
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
                                label="Email"
                                name="email"
                                placeholder="Input your email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                variant="outlined"
                                helperText={errors.email}
                                error={(errors.email && touched.email) ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number (*)"
                                name="phone"
                                disabled={true}
                                placeholder="Input your phone"
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
                                label="Address"
                                name="address"
                                placeholder="Input your address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.address}
                                variant="outlined"
                                helperText={errors.address}
                            />
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
                    </Grid>
                </CardContent>
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
            </Card>
        </form>
    );
};
