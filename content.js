
const replaceText = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    node.nodeValue = node.nodeValue.replace(/〆/g, "までだよ🐼");
  } else {
    for (let child of node.childNodes) {
      replaceText(child);
    }
  }
};

replaceText(document.body);
