import { SET_CHAMPIONS } from '../actions/actionTypes';

const initalState = {
  champions: {
    loaded: false,
    championMap: null,
  },
};

export default (state = initalState, action) => {
  switch (action.type) {
    case SET_CHAMPIONS:
      return {
        ...state,
        champions: {
          loaded: true,
          championMap: {
            ...action.payload.championMap,
          },
        },
      };
    default:
      return state;
  }
};
