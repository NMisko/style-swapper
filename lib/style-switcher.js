'use babel';

import StyleSwitcherView from './style-switcher-view';
import { CompositeDisposable } from 'atom';

export default {

  styleSwitcherView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    startDelimiter: {
      type: 'string',
      title: 'Start delimiter',
      description: 'Defines the start of a style block.',
      default: '//---'
  },
    endDelimiter: {
      type: 'string',
      title: 'End delimiter',
      description: 'Defines the end of a style block.',
      default: '//-'
  },
    separator: {
      type: 'string',
      title: 'Separator',
      description: 'How block names are separated.',
      default: ','
    }
},

  activate(state) {
    this.styleSwitcherView = new StyleSwitcherView(this);
    this.startDelimiter = atom.config.get('style-switcher.startDelimiter')
    this.endDelimiter = atom.config.get('style-switcher.endDelimiter')
    this.separator = atom.config.get('style-switcher.separator')

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'style-switcher:Switch': () => this.Switch()
    }));
    this.subscriptions.add(atom.config.onDidChange('style-switcher.startDelimiter', () => {
        this.startDelimiter = atom.config.get('style-switcher.startDelimiter')
    }))
    this.subscriptions.add(atom.config.onDidChange('style-switcher.endDelimiter', () => {
        this.endDelimiter = atom.config.get('style-switcher.endDelimiter')
    }))
    this.subscriptions.add(atom.config.onDidChange('style-switcher.separator', () => {
        this.separator = atom.config.get('style-switcher.separator')
    }))
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.styleSwitcherView.destroy();
  },

  Switch() {
    this.styleSwitcherView.setStyles(this.getStyles())
    this.styleSwitcherView.toggle()
    },

  getStyles() {
      const fs = require('fs');
      var path = atom.styles.getUserStyleSheetPath()

      var data = fs.readFileSync(path, 'utf-8')
      lines = data.split("\n")

      var array = []
      for (const line of lines) {
          if (line.startsWith(this.startDelimiter)) {
              for (var name of line.split(this.startDelimiter)[1].split(this.separator)) {
                  if (!array.includes(name.trim())) {
                      array.push(name.trim())
                  }
              }
          }
      }
      return array
  },

  trimAll(arr) {
      return arr.map(Function.prototype.call, String.prototype.trim)
  },

  selectStyle(name) {
      const fs = require('fs');
      var path = atom.styles.getUserStyleSheetPath()
      var data = fs.readFileSync(path, 'utf-8')
      lines = data.split("\n")
      uncommenting = false
      commenting = false
      var array = []
      for (var line of lines) {
          if (uncommenting) {
              if (line.startsWith("//") && line != this.endDelimiter) {
                  line = line.replace('//', '')
              }
              if (line.endsWith(this.endDelimiter)) {
                  uncommenting = false
              }
          }
          if (commenting) {
              if (line.endsWith(this.endDelimiter)) {
                  commenting = false
              }
              if (!line.startsWith("//")) {
                  line = "//".concat(line)
              }
          }
          if (line.startsWith(this.startDelimiter)) {
              if(this.trimAll(line.split(this.startDelimiter)[1].split(this.separator)).includes(name)) {
                  uncommenting = true;
              } else {
                  commenting = true;
              }
          }
          array.push(line)
      }
      let output = array.join("\n");
      fs.writeFileSync(path, output, 'utf-8')
  }
};
