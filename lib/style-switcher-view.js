/** @babel */

import SelectListView from 'atom-select-list'
import {humanizeKeystroke} from 'underscore-plus'
import fuzzaldrin from 'fuzzaldrin'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

export default class StyleSwitcherView {
  constructor (switcher) {
    this.switcher = switcher
    this.styleProfiles = []
    this.selectListView = new SelectListView({
      items: this.styleProfiles,
      emptyMessage: 'No matches found',
      filterKeyForItem: (item) => item,
      elementForItem: (name) => {
        const li = document.createElement('li')
        li.dataset.eventName = name

        const div = document.createElement('div')
        li.appendChild(div)

        const span = document.createElement('span')
        span.title = name

        const query = this.selectListView.getQuery()
        const matches = this.useAlternateScoring ? fuzzaldrinPlus.match(name, query) : fuzzaldrin.match(name, query)
        let matchedChars = []
        let lastIndex = 0
        for (const matchIndex of matches) {
          const unmatched = name.substring(lastIndex, matchIndex)
          if (unmatched) {
            if (matchedChars.length > 0) {
              const matchSpan = document.createElement('span')
              matchSpan.textContent = matchedChars.join('')
              span.appendChild(matchSpan)
              matchedChars = []
            }

            span.appendChild(document.createTextNode(unmatched))
          }

          matchedChars.push(name[matchIndex])
          lastIndex = matchIndex + 1
        }

        if (matchedChars.length > 0) {
          const matchSpan = document.createElement('span')
          matchSpan.textContent = matchedChars.join('')
          span.appendChild(matchSpan)
        }

        const unmatched = name.substring(lastIndex)
        if (unmatched) {
          span.appendChild(document.createTextNode(unmatched))
        }

        li.appendChild(span)
        return li
      },
      didConfirmSelection: (name) => {
        this.hide()
        this.switcher.selectStyle(name)
      },
      didCancelSelection: () => {
        this.hide()
      }
    })
  }

  async destroy () {
    await this.selectListView.destroy()
  }

  toggle() {
    if (this.panel && this.panel.isVisible()) {
      this.hide()
      return Promise.resolve()
    } else {
      return this.show()
    }
  }

  async show () {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this.selectListView})
    }

    this.selectListView.reset()

    this.activeElement = (document.activeElement === document.body) ? atom.views.getView(atom.workspace) : document.activeElement
    this.styleProfiles = this.switcher.getStyles()
    await this.selectListView.update({items: this.styleProfiles})

    this.previouslyFocusedElement = document.activeElement
    this.panel.show()
    this.selectListView.focus()
  }

  hide () {
    this.panel.hide()
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  setStyles(array) {
      this.styleProfiles = array;
  }
}
