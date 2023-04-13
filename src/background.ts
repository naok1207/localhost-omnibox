// chrome.omnibox.onInputEntered.addListener((text) => {
//   // Encode user input for special characters , / ? : @ & = + $ #
//   var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
//   chrome.tabs.create({ url: newURL });
// });

// 検索バーにデフォルトで表示される提案の設定
// chrome.omnibox.setDefaultSuggestion({ description: '...' })

const openLink = (url: string, disposition: chrome.omnibox.OnInputEnteredDisposition) => {
  if (disposition === 'currentTab') {
    chrome.tabs.update({url});
  } else {
    chrome.tabs.create({
      url,
      active: true,
      openerTabId: chrome.tabs.TAB_ID_NONE
    })
  }
}

const localhostUrl = (port: number | string) => 'http://localhost:' + port

const localhost3000 = { content: '3000', description: '3000'}

const helperPortList = [ '3000', '3001', '8080', '8081' ]

chrome.omnibox.setDefaultSuggestion({ description: 'open localhost:3000' })

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  let url = ''

  if (!text) {
    url = localhostUrl(localhost3000.content)
  } else {
    url = localhostUrl(text)
  }

  openLink(url, disposition)
})

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log('onInputChanged')
  chrome.omnibox.setDefaultSuggestion({ description: `open localhost:${text || 3000}` })
  const prefix = text
  const result = helperPortList.filter((str) => str.startsWith(prefix))
  suggest(result.map(val => ({ content: val, description: val })))
})
