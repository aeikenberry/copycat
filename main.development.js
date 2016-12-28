import menubar from 'menubar';
const electron = require('electron');
const { globalShortcut } = electron;

const mb = menubar({
  dir: `file://${__dirname}/app`,
  index: `file://${__dirname}/app/index.html`,
  preloadWindow: true,
  windowPosition: 'trayCenter',
  width: 600,
  icon: `${__dirname}/app/IconTemplate.png`
});

mb.on('ready', () => {
  console.log('app is ready');
  // mb.window.setResizable(false);
  registerHotkey(() => {
    if (mb.window.isVisible()) {
      mb.hideWindow();
    } else {
      mb.showWindow();
    }
  });
});

mb.app.on('will-quit', () => { unregisterHotkeys(); });

const registerHotkey = (cb) => {
  globalShortcut.register('CommandOrControl+Shift+D', cb);
};

const unregisterHotkeys = () => {
  globalShortcut.unregisterAll();
};
