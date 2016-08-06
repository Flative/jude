import { withPrefix } from '../utils/util';

import { updateUserInfo } from './userInfoAction';
import axios from 'axios';

export const MAIN_FORM_DATA_SAVED = 'MAIN_FORM_DATA_SAVED';
export const MAIN_FORM_DATA_RESET = 'MAIN_FORM_DATA_RESET';
export const MAIN_JOIN_REQUESTED = 'MAIN_JOIN_REQUESTED';
export const MAIN_JOIN_SUCCEEDED = 'MAIN_JOIN_SUCCEEDED';
export const MAIN_JOIN_FAILED = 'MAIN_JOIN_FAILED';
export const MAIN_LOGIN_REQUESTED = 'MAIN_LOGIN_REQUESTED';
export const MAIN_LOGIN_SUCCEEDED = 'MAIN_LOGIN_SUCCEEDED';
export const MAIN_LOGIN_FAILED = 'MAIN_LOGIN_FAILED';

export const saveInputValues = (email, password) => ({
  type: MAIN_FORM_DATA_SAVED,
  email, password,
});
export const resetInputValues = () => ({ type: MAIN_FORM_DATA_RESET });

export const join = (email, password, router) => (dispatch, getState) => {
  dispatch({ type: MAIN_JOIN_REQUESTED });
  return fetch(withPrefix('/accounts/register'), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(response => response.json())
    .then(data => {
      dispatch({ type: MAIN_JOIN_SUCCEEDED, data });
      resetInputValues();
      router.push('/');
      alert(data.message);
    })
    .catch(() => {
      dispatch({ type: MAIN_JOIN_FAILED });
      alert('회원가입에 실패했습니다, 잠시 후에 다시 시도해주세요');
      return false;
    })
};

export const login = (email, password, router) => (dispatch, getState) => {
  dispatch({ type: MAIN_LOGIN_REQUESTED });
  return fetch(withPrefix('/accounts/login'), {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  //return axios.post(withPrefix('/accounts/register'), {
  //  headers: {
  //    'Accept': 'application/json',
  //    'Content-Type': 'application/json',
  //  },
  //  data: JSON.stringify({ email, password }),
  //})
  .then(response => response.json())
  .catch(e => {
    dispatch({ type: MAIN_LOGIN_FAILED, e });
    alert('로그인에 실패했습니다, 잠시 후에 시도해주세요');
    return false;
  })
  .then(data => {
    if (!data) return;

    dispatch({ type: MAIN_LOGIN_SUCCEEDED });
    updateUserInfo({
      email,
      token: data.token,
    });
  });
};
