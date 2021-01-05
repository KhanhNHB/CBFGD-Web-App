import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  makeStyles
} from '@material-ui/core';
import { Formik } from 'formik';
import { Form } from './Form';
import * as Yup from 'yup';
import API from '../../../api/API';
import { ADMIN_ENDPOINT } from '../../../api/endpoint';
import Cookies from 'js-cookie';
import { USER_DEVICE_TOKEN, USER_TOKEN } from '../../../common';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1)
    }
  }
}));

const formSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is not empty"),
  last_name: Yup.string().required("Last name is not empty"),
  email: Yup.string().email("Email is incorrect"),
  DOB: Yup.date()
});

const ProfileDetails = ({ user, className }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  Object.keys(user).map(key => {
    if (!user[key] || user[key] === undefined) {
      user[key] = '';
    }
    return user[key];
  });

  const handleUpdate = async (data) => {
    const isChanged = JSON.stringify(user) !== JSON.stringify(data);
    if (!isChanged) return;

    const dataBody = {
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      gender: data.gender === 'Other' ? '' : data.gender,
      DOB: data.DOB,
      email: data.email,
      address: data.address
    };

    const response = await API.put(`${ADMIN_ENDPOINT}/${user.phone}`, dataBody);
    if (response.ok) {
      const updatedData = await response.json();
      const messageError = updatedData.message;

      if (messageError) {
        alert(updatedData.message);
        return;
      }



      Cookies.remove(USER_TOKEN);
      Cookies.remove(USER_DEVICE_TOKEN);
      navigate('/', { replace: true });
    }
  }

  return (
    <div className={clsx(classes.root, className)}>
      <Formik
        validationSchema={formSchema}
        initialValues={user}
        onSubmit={(data) => handleUpdate(data)}
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
            <Form
              values={values}
              errors={errors}
              touched={touched}
              handleSubmit={handleSubmit}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          );
        }}
      </Formik>
    </div>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;