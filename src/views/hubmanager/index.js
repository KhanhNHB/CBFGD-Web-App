import React, {
    useState,
    useEffect
} from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Grid,
    makeStyles,
    Modal,
    NativeSelect,
} from '@material-ui/core';
import Page from '../../components/Page';

import API from '../../api/API';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadHubManager } from '../../actions'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HUB_MANAGER_ENDPOINT } from '../../api/endpoint';
import { RESPONSE_STATUS, USER_TOKEN } from '../../common';
import HubManagerList from './HubManagerList'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    productCard: {
        height: '100%'
    },
    loadingModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiCircularProgress-root': {
            outline: 'none'
        }
    }
}));

const HubManagerListView = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();
    const [loadingModal, setLoadingModal] = useState(false);
    const profile = useSelector(state => state.profile.profile);

    const hubmanagers = useSelector(state => state.hubmanager.listHubManager);

    useEffect(() => {
        if (profile && profile.role === 'Hub_Manager') {
            navigate('/app/invoices-list', { replace: true });
        }
    }, [profile]);

    useEffect(() => {
        setLoadingModal(true);
        API.get(HUB_MANAGER_ENDPOINT)
            .then(async response => {
                if (response.status === RESPONSE_STATUS.FORBIDDEN) {
                    Cookies.remove(USER_TOKEN);
                    // Cookies.remove(ACCESS_TOKEN_FABRIC);
                    navigate('/', { replace: true });
                }
                if (response.ok) {
                    const fetchData = await response.json();
                    const listHubManager = fetchData.data;
                    if (listHubManager) {
                        dispatch(actLoadHubManager(listHubManager));
                    }
                }
                setLoadingModal(false);
            });
    }, [dispatch]);

    return (
        <Page
            className={classes.root}
            title="Shippers">
            <Container maxWidth={false}>
                <Box mt={3}>
                    <Grid container spacing={3}>
                        <HubManagerList hubmanagers={hubmanagers} />
                    </Grid>
                </Box>
            </Container>
            <Modal open={loadingModal} className={classes.loadingModal}>
                <CircularProgress />
            </Modal>
        </Page>
    );
};

export default HubManagerListView;