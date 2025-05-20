document.addEventListener("DOMContentLoaded", () => {
  const aiSummarizeButton = document.getElementById("aiSummarizeButton");
  const summaryDiv = document.getElementById("summary");

  aiSummarizeButton.addEventListener("click", () => {
    summaryDiv.textContent = "AIが要約中…";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getEmailText,
        world: "MAIN"
      }, (results) => {
        if (results[0].result) {
          const emailText = results[0].result;
          requestSummaryFromBackground(emailText);
        } else {
          summaryDiv.textContent = "メール本文が見つかりません";
        }
      });
    });
  });

  // background.js に要約リクエストを送信
  function requestSummaryFromBackground(text) {
    chrome.runtime.sendMessage(
      { action: "summarize", text },
      (response) => {
        summaryDiv.textContent = "📝 要約:\n" + (response.summary || "エラーが発生しました");
      }
    );
  }
});

// メール本文を取得する関数（コンテンツ内で実行）
function getEmailText() {
  const messageBody = document.querySelector('div[aria-label="メッセージ本文"]');
  return messageBody ? messageBody.innerText : null;
}
