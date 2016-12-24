/** @babel */

import SelectListView from 'atom-select-list'
import {humanizeKeystroke} from 'underscore-plus'
import fuzzaldrin from 'fuzzaldrin'
import fuzzaldrinPlus from 'fuzzaldrin-plus'

export default class StyleSwapperView {
  constructor () {
    this.commandsForActiveElement = []
    this.selectListView = new SelectListView({
      items: this.commandsForActiveElement,
      emptyMessage: 'No matches found',
      filterKeyForItem: (item) => item,
      elementForItem: (name) => {
        const li = document.createElement('li')
        li.classList.add('event')
        li.dataset.eventName = name

        const div = document.createElement('div')
        div.classList.add('pull-right')
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
              matchSpan.classList.add('character-match')
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
          matchSpan.classList.add('character-match')
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
        this.selectStyle(name)
      },
      didCancelSelection: () => {
        this.hide()
      }
    })
    this.selectListView.element.classList.add('command-palette')
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
    this.commandsForActiveElement = this.getStyles()
    await this.selectListView.update({items: this.commandsForActiveElement})

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

  setDelimiters(start, end, seperator) {
      this.startDelimiter = start
      this.endDelimiter = end
      this.seperator = seperator
  }

  getStyles() {
      const fs = require('fs');
      var path = atom.styles.getUserStyleSheetPath()

      var data = fs.readFileSync(path, 'utf-8')
      lines = data.split("\n")

      var array = []
      for (const line of lines) {
          if (line.startsWith(this.startDelimiter)) {
              for (var name of line.split(this.startDelimiter)[1].split(this.seperator)) {
                  if (!array.includes(name.trim())) {
                      array.push(name.trim())
                  }
              }
          }
      }
      return array
  }

  trimAll(arr) {
      return arr.map(Function.prototype.call, String.prototype.trim)
  }

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
              if(this.trimAll(line.split(this.startDelimiter)[1].split(this.seperator)).includes(name)) {
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
}
