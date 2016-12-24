'use babel';

import StyleSwapperView from './style-swapper-view';
import { CompositeDisposable } from 'atom';

export default {

  styleSwapperView: null,
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

    this.styleSwapperView = new StyleSwapperView(this);
    this.startDelimiter = atom.config.get('style-swapper.startDelimiter')
    this.endDelimiter = atom.config.get('style-swapper.endDelimiter')
    this.separator = atom.config.get('style-swapper.separator')

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'style-swapper:Swap': () => this.swap()
    }));
    this.subscriptions.add(atom.config.onDidChange('style-swapper.startDelimiter', () => {
        this.startDelimiter = atom.config.get('style-swapper.startDelimiter')
    }))
    this.subscriptions.add(atom.config.onDidChange('style-swapper.endDelimiter', () => {
        this.endDelimiter = atom.config.get('style-swapper.endDelimiter')
    }))
    this.subscriptions.add(atom.config.onDidChange('style-swapper.separator', () => {
        this.separator = atom.config.get('style-swapper.separator')
    }))
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.styleSwapperView.destroy();
  },

  swap() {
    this.styleSwapperView.setStyles(this.getStyles())
    this.styleSwapperView.toggle()
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
