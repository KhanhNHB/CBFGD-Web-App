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
} from '@material-ui/core';
import Page from '../../components/Page';
import API from '../../api/API';
import { useSelector, useDispatch } from 'react-redux';
import { actLoadHubManager, actLoadProfile } from '../../actions'
import Cookies from 'js-cookie';
import { HUB_MANAGER_ENDPOINT, PROFILE_ENDPOINT } from '../../api/endpoint';
import { RESPONSE_STATUS, ROLE, USER_DEVICE_TOKEN, USER_TOKEN } from '../../common';
import HubManagerList from './HubManagerList'
import { useNavigate } from 'react-router';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    container: {
        display: 'flex',
        width: "100%",
        height: "80%",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
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

const HubManager = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();
    const [loadingModal, setLoadingModal] = useState(false);
    const profile = useSelector(state => state.profile.profile);
    const [user, setUser] = useState(null);
    const data = useSelector(state => state.hubmanager.listHubManager);

    useEffect(() => {
        if (profile && profile.roleId === ROLE.HUB_MANAGER) {
            navigate('/app/invoices-list', { replace: true });
        }
    }, [profile, navigate]);

    useEffect(() => {
        setLoadingModal(true);

        const fetchHubManager = async () => {
            const response = await API.get(`${HUB_MANAGER_ENDPOINT}?page=1&limit=50`);
            if (response.status === RESPONSE_STATUS.FORBIDDEN) {
                Cookies.remove(USER_TOKEN);
                Cookies.remove(USER_DEVICE_TOKEN);
                navigate('/', { replace: true });
            }
            if (response.ok) {
                const fetchData = await response.json();
                const data = {
                    hub_managers: fetchData.data.items,
                    meta: fetchData.data.meta
                };
                dispatch(actLoadHubManager(data));
            }
            setLoadingModal(false);
        };

        const readCookie = async () => {
            const user = Cookies.get(USER_TOKEN);
            if (user) {
                const response = await API.post(`${PROFILE_ENDPOINT}`, {
                    "access_token": user
                });

                if (response.ok) {
                    const fetchData = await response.json();
                    setUser(fetchData.data);
                    fetchHubManager();
                    dispatch(actLoadProfile(fetchData.data));
                }
            } else {
                Cookies.remove(USER_DEVICE_TOKEN);
                navigate('/', { replace: true });
            }
        };
        readCookie();
    }, [dispatch, navigate]);

    return (
        <Page
            className={classes.root}
            title="Hub_Managers">
            <Container maxWidth={false}>
                <Box mt={3}>
                    <Grid container spacing={3}>
                        {(data && data.hub_managers && user) && <HubManagerList data={data} user={user} />}
                    </Grid>
                </Box>
            </Container>
            <Modal open={loadingModal} className={classes.loadingModal}>
                <CircularProgress />
            </Modal>
        </Page>
    );
};

export default HubManager;