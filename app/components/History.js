import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
const { BrowserWindow } = require('electron').remote;
import styles from './History.css';
import key from 'keymaster';
import _ from 'lodash';
const { clipboard } = require('electron');

export default class History extends Component {
  static propTypes = {
    selectHistory: PropTypes.func.isRequired,
    addHistoryIfNeeded: PropTypes.func.isRequired,
    history: PropTypes.array.isRequired
  };

  constructor(options) {
    super(options);
    this.state = {
      selected: null,
      filtered: null
    };
  }

  componentDidMount() {
    this.win = BrowserWindow.getAllWindows()[0];

    this.win.on('blur', () => {
      const history = this.state.filtered || this.props.history;
      if (history.length) {
        ReactDOM.findDOMNode(this.refs[history[0].id]).scrollIntoView();
        this.setState({ selected: null, filtered: null });
      }
      window.scrollTo(0, 0);
      ReactDOM.findDOMNode(this.refs.input).value = '';
    });

    ReactDOM.findDOMNode(this.refs.input).focus();

    key('down', (e) => {
      e.preventDefault();
      this.nav('down');
    });

    key('up', (e) => {
      e.preventDefault();
      this.nav('up');
    });

    key('enter', (e) => {
      e.preventDefault();
      this.handleEnter();
    });

    key('esc', (e) => {
      this.win.hide();
    });

    setInterval(() => {
      this.props.addHistoryIfNeeded(clipboard.readText(), clipboard.readHtml());
    }, 1000);
  }

  getPreviewHtml() {
    const selectedHistory = _.find(this.props.history, h => h.id === this.state.selected);
    if (!selectedHistory) return null;
    return (
      <div>
        <pre>
          {selectedHistory.html}
        </pre>
      </div>
    );
  }

  handleEnter() {
    if (!this.state.selected) {
      return this.props.selectHistory(this.props.history[0]);
    }

    return this.props.selectHistory(_.find(this.props.history, h => h.id === this.state.selected));
  }

  handleInputOnKeyUp(e) {
    switch (e.key) {
      case 'ArrowDown':
        return this.nav('down');
      case 'ArrowUp':
        return this.nav('up');
      case 'Enter':
        return this.handleEnter();
      case 'Escape':
        return this.win.hide();
      default:
        return this.search(e.target.value);
    }
  }

  search(term) {
    const filtered = this.props.history.filter(h => h.text.indexOf(term) > -1);
    if (filtered.length) {
      this.setState({ selected: filtered[0].id });
    } else {
      this.setState({ selected: null });
    }
    this.setState({ filtered });
  }

  scroll(refID) {
    ReactDOM.findDOMNode(
      this.refs[refID]
    ).scrollIntoViewIfNeeded({
      block: 'start', behavior: 'smooth'
    });
  }

  nav(dir) {
    let next;
    const history = this.state.filtered || this.props.history;

    if (!this.state.selected) {
      next = history[0].id;
    } else {
      const index = history.findIndex(el => el.id === this.state.selected);
      if (dir === 'up') {
        if (index === 0) return;
        next = history[index - 1].id;
      } else {
        if (index === history.length - 1) return;
        next = history[index + 1].id;
      }
    }

    this.setState({ selected: next });
    this.scroll(next);
  }

  render() {
    const { selectHistory, history } = this.props;
    const effectiveHistories = this.state.filtered || history;
    let historyList = effectiveHistories.map((h, i) => (
        <li
          key={i}
          onClick={selectHistory.bind(this, h)}
          className={this.state.selected === h.id ? 'selected' : ''}
          ref={h.id}
        >
          <span className={styles.listNumber}>
            {i + 1}.
          </span>
          {h.text.slice(0, 28)}{h.text.length > 28 ? '...' : ''}
        </li>
      )
    );
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.searchContainer}>
            <div className={styles.search}>
              <input
                type="text"
                className={styles.searchInput}
                ref="input"
                onKeyUp={this.handleInputOnKeyUp.bind(this)}
              />
            </div>
          </div>
          <div className={styles.logo}>
            <h1>CopyCat</h1>
          </div>
          <div className={styles.listContainer}>
            <ul>
              {historyList}
            </ul>
          </div>
          <div className={styles.preview}>
            {this.getPreviewHtml()}
          </div>
        </div>
      </div>
    );
  }
}
