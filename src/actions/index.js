import * as types from '../constants/ActionTypes';

export const actSignIn = (userToken) =>{
    return{
        type: types.SIGN_IN,
        userToken,
    };
};