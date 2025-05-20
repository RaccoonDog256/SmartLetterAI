// DOMコンテンツが読み込まれたら実行
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleButton");

  // ストレージから現在の置換状態を取得
  chrome.storage.sync.get("replaceEnabled", (data) => {
    const isEnabled = data.replaceEnabled ?? true; // 未設定ならデフォルトで有効化
    updateButton(isEnabled); // ボタンの表示を現在の状態に合わせる
  });

  // ボタンがクリックされたときの動作を設定
  toggleButton.addEventListener("click", () => {
    // 現在の状態を取得
    chrome.storage.sync.get("replaceEnabled", (data) => {
      const newState = !data.replaceEnabled; // 現在の状態を反転
      chrome.storage.sync.set({ replaceEnabled: newState }, () => {
        updateButton(newState); // ボタン表示を更新
        
        // 現在アクティブなタブを取得
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          // 有効化の場合は置換実行、無効化の場合は元に戻す
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id }, // 現在のタブ
            func: newState ? enableReplace : disableReplace // 有効化か無効化かで関数を切り替え
          });
        });
      });
    });
  });

  // ボタンの表示を更新する関数（有効化/無効化の切り替え）
  function updateButton(isEnabled) {
    toggleButton.textContent = isEnabled ? "無効化する" : "有効化する"; // ボタンのテキスト変更
    toggleButton.classList.toggle("off", !isEnabled); // クラスでデザイン変更（赤色など）
  }
});

// 置換を有効化（「〆」を「までだよ🐼」に変更）
function enableReplace() {
  // DOM全体を走査してテキストを置換
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    // 「〆」を「までだよ🐼」に置換
    if (node.nodeValue.includes("〆")) {
      node.nodeValue = node.nodeValue.replace(/〆/g, "までだよ🐼");
    }
  }
}

// 置換を無効化（「までだよ🐼」を「〆」に戻す）
function disableReplace() {
  // DOM全体を走査してテキストを元に戻す
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    // 「までだよ🐼」を「〆」に戻す
    if (node.nodeValue.includes("までだよ🐼")) {
      node.nodeValue = node.nodeValue.replace(/までだよ🐼/g, "〆");
    }
  }
}
