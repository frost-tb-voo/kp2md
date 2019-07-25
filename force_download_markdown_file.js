
function getAllItemizedNotesByMarkdown() {
  let markdown = '';
  let targets = [];
  let items = document.getElementsByTagName('div');
  for (let item of items) {
      if (!item.hasAttribute('aria-label')) {
          continue;
      }
      let text = item.textContent.trim()
      if (!text) {
          continue;
      }
      let ariaLabel = item.getAttribute('aria-label');
      if (ariaLabel.startsWith('Created')) {
        targets.push(item);
      }
  }
  for (let target of targets) {
    target.parentElement.click();
    markdown += getItemizedNoteByMarkdown();
    markdown += '---';
    markdown += '\n';
}
  targets = [];
  return markdown;
}

function getItemizedNoteByMarkdown() {
  let items = document.getElementsByTagName('div');
  let markdown = '';
  
  for (let item of items) {
      if (!item.hasAttribute('aria-label')) {
          continue;
      }
      let contenteditable = item.getAttribute('contenteditable') == 'true'
      if (!contenteditable) {
        continue;
      }
      let text = item.textContent.trim()
      if (!text) {
          continue;
      }
      let ariaLabel = item.getAttribute('aria-label');
      switch (ariaLabel) {
        case 'Title':
          markdown += '# ';
          markdown += text;
          markdown += '\n';
          break;
        case 'list item':
          markdown += '  ';
          markdown += '- ';
          markdown += text;
          markdown += '\n';
          break;
        case 'parent list item':
          markdown += '- ';
          markdown += text;
          markdown += '\n';
          break;
        default:
      }
  }
  return markdown;
}

function forceDownload() {
  let links = document.getElementsByClassName('k2m-download-link');
  for (let link of links) {
    document.body.removeChild(link);
  }

  let fileName = 'keep.md'
  let content = getAllItemizedNotesByMarkdown();
  if (!content.length) {
    window.alert('Open any itemized note.')
    return;
  }

  var downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  downloadLink.href = URL.createObjectURL(new Blob([content], {type: 'text.plain'}));
  downloadLink.dataset.downloadurl = ['text/plain', downloadLink.download, downloadLink.href].join(':');
  downloadLink.setAttribute('class', 'k2m-download-link');
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

forceDownload();
