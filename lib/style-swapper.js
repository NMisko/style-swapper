'use babel';

import StyleSwapperView from './style-swapper-view';
import { CompositeDisposable } from 'atom';

export default {

  styleSwapperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {

    this.styleSwapperView = new StyleSwapperView();


    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'style-swapper:Swap': () => this.swap()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.styleSwapperView.destroy();
  },

  swap() {
    console.log('StyleSwapper is swapping!');
    this.styleSwapperView.toggle()
  }

};
