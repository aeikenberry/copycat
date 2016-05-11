const { clipboard } = require('electron');
const { BrowserWindow } = require('electron').remote;
import _ from 'lodash';

export const SET_HISTORY = 'SET_HISTORY';
export const CREATE_HISTORY = 'CREATE_HISTORY';

export function addHistoryIfNeeded(text, html) {
  return (dispatch, getState) => {
    const history = getState().history;
    const found = _.find(history.history, h => h.text === text);

    if (!text.trim().length) return;

    if (!found) {
      return dispatch(createHistory(text, html, history.history.length));
    } else if (history.history[0].text !== text) {
      return dispatch(updateHistory(found));
    }
  };
}

export function selectHistory(history) {
  return (dispatch, getState) => {
    const histories = getState().history.history;
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.hide();
    return dispatch(updateHistory(history, _.indexOf(histories, history)));
  };
}

function updateHistory(history) {
  clipboard.writeText(history.text);
  return {
    type: SET_HISTORY,
    updated: new Date(),
    id: history.id
  };
}

function createHistory(text, html, id) {
  return {
    type: CREATE_HISTORY,
    updated: new Date(),
    text,
    html,
    id
  };
}
