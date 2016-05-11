import { REHYDRATE } from 'redux-persist/constants';
import { CREATE_HISTORY, SET_HISTORY } from '../actions/history';

const initialState = {
  history: []
};

export default function history(state = initialState, action) {
  switch (action.type) {
    case CREATE_HISTORY:
      return Object.assign({}, state, {
        history: [
          {
            text: action.text,
            html: action.html,
            updated: action.updated,
            id: action.id
          },
          ...state.history
        ]
      });
    case SET_HISTORY:
      return Object.assign({}, state, {
        history: state.history.map(h => {
          if (action.id === h.id) {
            return Object.assign({}, h, {
              updated: action.updated
            });
          }
          return h;
        })
        .sort((a, b) => new Date(b.updated) - new Date(a.updated))
      });
    case REHYDRATE:
      return Object.assign({}, state, {
        history: action.payload.history.history
      });
    default:
      return state;
  }
}
