import fetch from '../../utils/api';
// import fetch from 'isomorphic-fetch';
// import auth from '../../utils/auth';
// import { checkForSubscription, checkForAccess, clearSubscription, subscribe } from '../ecom/ecom';

export const VERIFIED_LOGIN = Symbol('VERIFIED_LOGIN');


const verified = ({ loggedIn }) => {
  return {
    type: VERIFIED_LOGIN,
    loggedIn,
  };
};

 export function verify() {
  return (dispatch, getState) => {
    return fetch(getState().log)('/api/auth/verify/')
      .then((response) => {
        console.log('verified', response)
        const { loggedIn} = response;
        return dispatch(verified({loggedIn}));
      });
    };
  }


export function login({ username, password }) {
  const self=this;
  return (dispatch, getState) => {
    return fetch(getState().log)('/api/auth/login/',
      {
        body: JSON.stringify(
          {
            username,
            password,
          }),
        method: 'POST',
      })
      .then((response) => {
        console.log('response', response)
        return dispatch(verify());
       
      });
  };
}



