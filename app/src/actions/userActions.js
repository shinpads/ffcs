import axios from 'axios';

import { SET_USER } from './actionTypes';

export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get('api/user/from-session/');
    if (res.data) {
      await dispatch({
        type: SET_USER,
        payload: {
          user: res.data.data,
        },
      });
    } else {
      throw new Error('Failed to get user');
    }
  } catch (err) {
    console.error(err);
  }
};

export default {
  getUser,
};
