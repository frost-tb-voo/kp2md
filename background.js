
// https://developer.mozilla.org/en-US/docs/Plugins/Guide/URLs
function getBrowser() {
  try {
    return browser;
  } catch (err) {
    return chrome;
  }
}

function tabsQuery(query) {
  return new Promise(function (resolv, reject) {
    try {
      let querying = getBrowser().tabs.query(query);
      if (!querying) {
        getBrowser().tabs.query(query, resolv);
        return;
      }
      querying.then(resolv).catch(reject);
    } catch (err) {
      try {
        getBrowser().tabs.query(query, resolv);
      } catch (err) {
        reject('browser.tabs.query unsupported!');
      }
    }
  });
}

function tabsGetCurrent() {
  return new Promise(function (resolv, reject) {
    try {
      let querying = getBrowser().tabs.getCurrent();
      if (!querying) {
        getBrowser().tabs.getCurrent(resolv);
        return;
      }
      querying.then(resolv).catch(reject);
    } catch (err) {
      try {
        getBrowser().tabs.getCurrent(resolv);
      } catch (err) {
        reject('browser.tabs.getCurrent unsupported!');
      }
    }
  });
}

function tabsExecuteScript(tabId, code) {
  return new Promise(function (resolv, reject) {
    try {
      let executing = getBrowser().tabs.executeScript(tabId, code);
      if (!executing) {
        getBrowser().tabs.executeScript(tabId, code, resolv);
        return;
      }
      executing.then(resolv).catch(reject);
    } catch (err1) {
      console.warn(err1);
      try {
        getBrowser().tabs.executeScript(tabId, code, resolv);
      } catch (err2) {
        console.warn(err2);
        reject('browser.tabs.executeScript unsupported!');
      }
    }
  });
}

function downloadsDownload(query) {
  return new Promise(function (resolv, reject) {
    try {
      let downloading = getBrowser().downloads.download(query);
      if (!downloading) {
        getBrowser().downloads.download(query, resolv);
        return;
      }
      downloading.then(resolv).catch(reject);
    } catch (err) {
      try {
        getBrowser().downloads.download(query, resolv);
      } catch (err) {
        reject('browser.downloads.download unsupported!');
      }
    }
  });
}

function updatePageAction(tab) {
  let url = new URL(tab.url);
  if (!url.hostname.endsWith('keep.google.com')) {
    return;
  }
  tabsExecuteScript(tab.id, {
    file : './force_download_markdown_file.js'
  });
}

if (chrome.pageAction && chrome.pageAction.onClicked) {
  chrome.pageAction.onClicked.addListener(updatePageAction);
} else {
  console.warn('chrome.pageAction.onClicked unsupported!');
}
if (chrome.browserAction && chrome.browserAction.onClicked) {
  chrome.browserAction.onClicked.addListener(updatePageAction);
} else {
  console.warn('chrome.browserAction.onClicked unsupported!');
}

function initializePageAction(tab) {
  if (chrome.pageAction && chrome.pageAction.show) {
    chrome.pageAction.show(tab.id);
  }
}

if (chrome.tabs && chrome.tabs.onUpdated) {
  chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    // for chrome only, enable page action for each tab
    initializePageAction(tab);
  });
} else {
  console.warn('chrome.tabs.onUpdated unsupported!');
}
