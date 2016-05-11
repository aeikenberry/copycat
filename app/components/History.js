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
    };
  }

  componentDidMount() {

    const win = BrowserWindow.getAllWindows()[0];

    win.on('blur', () => {
      if (this.props.history.length) {
        ReactDOM.findDOMNode(this.refs[this.props.history[0].id]).scrollIntoView();
        this.setState({ selected: null });
      }
    });

    key('down', (e) => {
      e.preventDefault();
      this.handleDownArrow();
    });

    key('up', (e) => {
      e.preventDefault();
      this.handleUpArrow();
    });

    key('enter', (e) => {
      e.preventDefault();
      this.handleEnter();
    });

    key('esc', (e) => {
      e.preventDefault();
      win.hide();
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

  handleDownArrow() {
    if (!this.state.selected) {
      this.setState({ selected: this.props.history[0].id });
      ReactDOM.findDOMNode(this.refs[this.props.history[0].id]).scrollIntoView({
        block: 'start', behavior: 'smooth'
      });
    } else {
      const index = this.props.history.findIndex(el => el.id === this.state.selected);
      if (index === this.props.history.length - 1) return;
      this.setState({ selected: this.props.history[index + 1].id });
      ReactDOM.findDOMNode(this.refs[this.props.history[index + 1].id]).scrollIntoView({
        block: 'start', behavior: 'smooth'
      });
    }
  }

  handleEnter() {
    if (!this.state.selected) {
      return this.props.selectHistory(this.props.history[0]);
    }

    return this.props.selectHistory(_.find(this.props.history, h => h.id === this.state.selected));
  }

  handleUpArrow() {
    if (!this.state.selected) {
      this.setState({ selected: this.props.history[0].id });
      ReactDOM.findDOMNode(this.refs[this.props.history[0].id]).scrollIntoView({
        block: 'start', behavior: 'smooth'
      });
    } else {
      const index = this.props.history.findIndex(el => el.id === this.state.selected);
      if (index === 0) return;
      this.setState({ selected: this.props.history[index - 1].id });
      ReactDOM.findDOMNode(this.refs[this.props.history[index - 1].id]).scrollIntoView({
        block: 'start', behavior: 'smooth'
      });
    }
  }

  render() {
    const { selectHistory, history } = this.props;
    let historyList = history.map((h, i) => (
        <li
          key={i}
          onClick={selectHistory.bind(this, h)}
          className={this.state.selected === h.id ? 'selected' : ''}
          ref={h.id}
        >
          <span className={styles.listNumber}>{i + 1}.</span> {h.text.slice(0, 28)}{h.text.length > 28 ? '...' : ''}
        </li>
      )
    );
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.logo}>
            <h1>CopyCat</h1>
          </div>
          <ul>
            {historyList}
          </ul>
          <div className={styles.preview}>
            {this.getPreviewHtml()}
          </div>
        </div>
      </div>
    );
  }
}
