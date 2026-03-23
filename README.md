# 台股新手村：下單冒險

這是一個遊戲化教學網站，用 6 個關卡與模擬器教新手理解「第一次買台股」的基礎流程。

## 功能亮點

- 4 關互動式情境題，逐步學會買進流程
- 分數、進度條、即時回饋與重玩機制
- 本機儲存最佳紀錄與挑戰次數
- 成就牆勳章解鎖
- 模擬下單機：估算買進成本與預算缺口
- 任務日誌：紀錄學習過程

## 教學內容

- 關卡 1：開立證券戶與交割戶
- 關卡 2：入金到交割帳戶
- 關卡 3：填寫下單關鍵資訊（股號、價格、數量）
- 關卡 4：成交後風險檢查（庫存、成本、停損規劃）
- 關卡 5：技術面判讀（量價與分批）
- 關卡 6：資金控管（部位配置）

## 本機執行

1. 直接用瀏覽器開啟 index.html
2. 開始互動答題，完成 4 關

## GitHub Pages 自動部署

本專案已內建 GitHub Actions 部署流程：

- 工作流檔案：.github/workflows/deploy-pages.yml
- 觸發條件：推送到 main 分支

啟用步驟：

1. 將專案推到 GitHub 的 main 分支
2. 到 Repository Settings > Pages
3. Build and deployment 選 GitHub Actions
4. 等待 Actions 跑完，即可取得網站網址

## 自訂網域（可選）

若你要綁定自己的網域，可在專案根目錄新增 CNAME 檔案，內容填入你的網域，例如：

example.com

然後到 GitHub Pages 設定頁面確認 Custom domain 已生效。

## 專案檔案

- index.html：頁面結構
- style.css：視覺風格與版面
- script.js：遊戲與模擬器互動邏輯
- .github/workflows/deploy-pages.yml：Pages 部署流程

## 注意

- 本網站為教學模擬，不構成任何投資建議。
- 台股交易規則可能異動，實際下單請以券商系統與官方公告為準。
