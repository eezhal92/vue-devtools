// This is the devtools script, which is called when the user opens the
// Chrome devtool on a page. We check to see if we global hook has detected
// Vue presence on the page. If yes, create the Vue panel; otherwise poll
// for 10 seconds.

let created = false
let checkVueInterval
let checkCount = 0

function createPanelIfHasVue () {
  if (created || checkCount++ > 10) {
    return
  }
  chrome.devtools.inspectedWindow.eval(
    '!!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue)',
    function (hasVue) {
      if (!hasVue || created) {
        return
      }
      clearInterval(checkVueInterval)
      created = true
      chrome.devtools.panels.create(
        'Vue Devtools', 'icons/128.png', 'devtools.html',
        function (panel) {
          // panel loaded
        }
      )
    }
  )
}

chrome.devtools.network.onNavigated.addListener(createPanelIfHasVue)
checkVueInterval = setInterval(createPanelIfHasVue, 1000)
createPanelIfHasVue()
