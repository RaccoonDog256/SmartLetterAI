// Gemini APIキーを設定
const GEMINI_API_KEY = ""; // ここに取得したAPIキーを入力

// AI要約リクエストを処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarize") {
    // 送信するテキストをログ出力（デバッグ用）
    console.log("✅ AI要約リクエスト：", message.text);

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `以下の文章を簡潔に要約してください:\n${message.text}`
              }
            ]
          }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.candidates && data.candidates.length > 0) {
        const summary = data.candidates[0].content.parts[0].text;
        sendResponse({ summary });
      } else {
        sendResponse({ summary: "要約に失敗しました" });
      }
    })
    .catch(error => {
      sendResponse({ summary: "エラーが発生しました: ネットワークエラー" });
    });

    // 非同期応答を許可
    return true;
  }
});
