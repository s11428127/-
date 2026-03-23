const stages = [
  {
    title: "關卡 1：零股啟程",
    desc: "你只有 8,000 元，想先買台股，最適合先做哪件事？",
    choices: [
      { text: "先開立證券戶與交割戶", correct: true, note: "正確，零股與整股都需要先開戶。" },
      { text: "先借錢湊一張再說", correct: false, note: "新手先練零股，不要急著借錢。" },
      { text: "直接請朋友代買", correct: false, note: "應使用自己帳戶與風險控管。" }
    ]
  },
  {
    title: "關卡 2：零股規則",
    desc: "下列哪一個是零股買進的正確描述？",
    choices: [
      { text: "零股通常是 1-999 股，不到 1 張", correct: true, note: "正確，1 張是 1000 股。" },
      { text: "零股等於零成本試單", correct: false, note: "零股也是真實交易，有風險。" },
      { text: "零股只能買 ETF 不能買個股", correct: false, note: "多數上市櫃股票都可零股交易。" }
    ]
  },
  {
    title: "關卡 3：下單欄位",
    desc: "你要買 2330 的零股，下單時哪些資訊必填？",
    choices: [
      { text: "股號、限價、股數、買進", correct: true, note: "正確，核心欄位完整。" },
      { text: "只要有股號，系統會自動補完", correct: false, note: "下單資訊不完整會失敗。" },
      { text: "先填停損百分比就好", correct: false, note: "停損是策略，不是委託必要欄位。" }
    ]
  },
  {
    title: "關卡 4：交易時段",
    desc: "你想今天盤中就有機會成交零股，應優先選哪個時段？",
    choices: [
      { text: "盤中零股（09:00-13:30）", correct: true, note: "正確，盤中可依撮合規則嘗試成交。" },
      { text: "盤後零股（14:30 撮合）", correct: false, note: "盤後是特定時間撮合。" },
      { text: "等隔天開盤再看", correct: false, note: "你題目目標是今天盤中。" }
    ]
  },
  {
    title: "關卡 5：資金控管",
    desc: "你預算 12,000 元，想買 700 元股票，較穩健是？",
    choices: [
      { text: "先買 10 股練流程，再視情況分批", correct: true, note: "正確，零股可用小部位練習。" },
      { text: "一次梭哈到極限", correct: false, note: "要保留現金彈性。" },
      { text: "先借錢買滿", correct: false, note: "新手先避免槓桿。" }
    ]
  },
  {
    title: "關卡 6：成交後檢查",
    desc: "零股成交後，最應該先做哪件事？",
    choices: [
      { text: "檢查成交均價、持股與剩餘預算", correct: true, note: "正確，先做交易後核對。" },
      { text: "立刻再追一筆", correct: false, note: "先檢查再決策。" },
      { text: "不看庫存，等漲停", correct: false, note: "缺乏風險管理。" }
    ]
  }
];

const termMap = {
  oddlot: {
    title: "零股",
    desc: "零股是 1 到 999 股的交易單位，適合小資族先用小金額練習流程。"
  },
  limit: {
    title: "限價單",
    desc: "你指定願意買進的最高價格，只有在市場價格符合時才可能成交。"
  },
  t2: {
    title: "T+2 交割",
    desc: "台股通常是交易日後第 2 個營業日完成交割，帳戶需備妥款項。"
  },
  book: {
    title: "委買委賣",
    desc: "委買是市場想買的價格與數量，委賣是想賣的價格與數量，觀察可幫助判斷流動性。"
  }
};

const scoreEl = document.getElementById("score");
const stageIndicator = document.getElementById("stage-indicator");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const stageTag = document.getElementById("stage-tag");
const questionTitle = document.getElementById("question-title");
const questionDesc = document.getElementById("question-desc");
const choicesWrap = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const bestScoreEl = document.getElementById("best-score");
const missionLog = document.getElementById("mission-log");
const badgeText = document.getElementById("badge-text");
const attemptText = document.getElementById("attempt-text");
const simForm = document.getElementById("sim-form");
const simResult = document.getElementById("sim-result");
const simSymbol = document.getElementById("sim-symbol");
const simPrice = document.getElementById("sim-price");
const simShares = document.getElementById("sim-shares");
const simBudget = document.getElementById("sim-budget");
const simSession = document.getElementById("sim-session");
const termButtons = document.querySelectorAll(".term-btn");
const termDetail = document.getElementById("term-detail");

let index = 0;
let score = 0;
let answered = false;
let correctCount = 0;
let bestScore = Number(localStorage.getItem("tw-stock-best-score") || 0);
let attempts = Number(localStorage.getItem("tw-stock-attempts") || 0);

bestScoreEl.textContent = `最佳紀錄：${bestScore}`;
attemptText.textContent = `挑戰次數：${attempts}`;

function addMissionLog(text) {
  const item = document.createElement("li");
  item.textContent = text;
  missionLog.prepend(item);
  while (missionLog.children.length > 5) {
    missionLog.removeChild(missionLog.lastChild);
  }
}

function updateBadge() {
  if (bestScore === 100) {
    badgeText.textContent = "已解鎖：零股紀律王";
  } else if (bestScore >= 75) {
    badgeText.textContent = "已解鎖：零股穩健手";
  } else if (bestScore >= 50) {
    badgeText.textContent = "已解鎖：小資練習生";
  } else {
    badgeText.textContent = "尚未解鎖勳章";
  }
}

function renderTerm(termKey) {
  const term = termMap[termKey];
  if (!term) {
    return;
  }
  termDetail.innerHTML = `<h4>${term.title}</h4><p>${term.desc}</p>`;
}

updateBadge();

function renderStage() {
  const stage = stages[index];
  stageTag.textContent = `關卡 ${index + 1}`;
  questionTitle.textContent = stage.title;
  questionDesc.textContent = stage.desc;
  stageIndicator.textContent = `第 ${index + 1} / ${stages.length} 關`;
  progressFill.style.width = `${Math.round((index / stages.length) * 100)}%`;
  progressText.textContent = `${Math.round((index / stages.length) * 100)}%`;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.disabled = true;
  answered = false;

  choicesWrap.innerHTML = "";
  stage.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", () => handleChoice(button, choice));
    choicesWrap.appendChild(button);
  });
}

function handleChoice(button, choice) {
  if (answered) {
    return;
  }

  answered = true;
  const buttons = choicesWrap.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  if (choice.correct) {
    correctCount += 1;
    score = Math.round((correctCount / stages.length) * 100);
    scoreEl.textContent = String(score);
    button.classList.add("correct");
    feedback.textContent = `答對了！${choice.note}`;
    feedback.classList.add("good");
    addMissionLog(`關卡 ${index + 1}：答對，目前 ${score} 分`);
  } else {
    button.classList.add("wrong");
    feedback.textContent = `再想一下。${choice.note}`;
    feedback.classList.add("bad");
    addMissionLog(`關卡 ${index + 1}：答錯，先補觀念再前進`);

    buttons.forEach((btn, i) => {
      if (stages[index].choices[i].correct) {
        btn.classList.add("correct");
      }
    });
  }

  nextBtn.disabled = false;
}

function showEnding() {
  attempts += 1;
  localStorage.setItem("tw-stock-attempts", String(attempts));
  attemptText.textContent = `挑戰次數：${attempts}`;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("tw-stock-best-score", String(bestScore));
    bestScoreEl.textContent = `最佳紀錄：${bestScore}`;
    addMissionLog(`新紀錄誕生：${bestScore} 分`);
  }

  updateBadge();

  stageTag.textContent = "任務完成";
  questionTitle.textContent = "恭喜通關！你已完成零股下單流程演練";
  questionDesc.textContent = "記得：先小部位練習，再逐步建立自己的紀律。";
  stageIndicator.textContent = `第 ${stages.length} / ${stages.length} 關`;
  progressFill.style.width = "100%";
  progressText.textContent = "100%";
  choicesWrap.innerHTML = "";
  feedback.className = "feedback good";

  if (score === 100) {
    feedback.textContent = "滿分！你拿到『零股紀律王』勳章。";
  } else if (score >= 67) {
    feedback.textContent = "不錯！你已具備零股實作基礎。";
  } else {
    feedback.textContent = "建議重玩一次，把時段與交割概念再熟悉。";
  }

  nextBtn.disabled = true;
}

nextBtn.addEventListener("click", () => {
  if (index < stages.length - 1) {
    index += 1;
    renderStage();
  } else {
    showEnding();
  }
});

restartBtn.addEventListener("click", () => {
  index = 0;
  score = 0;
  correctCount = 0;
  scoreEl.textContent = "0";
  addMissionLog("重啟挑戰：重新進入新手村任務");
  renderStage();
});

simForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const symbol = simSymbol.value.trim().toUpperCase();
  const price = Number(simPrice.value);
  const shares = Number(simShares.value);
  const budget = Number(simBudget.value);
  const session = simSession.value;

  if (!symbol || price <= 0 || shares <= 0 || shares > 999 || budget <= 0) {
    simResult.className = "sim-result warn";
    simResult.textContent = "請輸入有效的股票、價格、零股股數（1-999）與預算。";
    return;
  }

  const tradeAmount = price * shares;
  const fee = Math.max(20, Math.round(tradeAmount * 0.001425));
  const totalCost = tradeAmount + fee;
  const remain = budget - totalCost;
  const sessionText = session === "intraday" ? "盤中零股" : "盤後零股";

  if (remain >= 0) {
    simResult.className = "sim-result ok";
    simResult.textContent = `${symbol} ${sessionText} 買進估算：成交 ${tradeAmount.toLocaleString()} 元，手續費 ${fee.toLocaleString()} 元，總成本 ${totalCost.toLocaleString()} 元，可用餘額 ${remain.toLocaleString()} 元。`;
    addMissionLog(`模擬下單成功：${symbol} ${shares} 股，成本 ${totalCost.toLocaleString()} 元`);
  } else {
    simResult.className = "sim-result warn";
    simResult.textContent = `${symbol} 目前預算不足，尚差 ${Math.abs(remain).toLocaleString()} 元。建議調整股數或價格。`;
    addMissionLog(`模擬下單失敗：${symbol} 預算不足 ${Math.abs(remain).toLocaleString()} 元`);
  }
});

termButtons.forEach((button) => {
  button.addEventListener("click", () => {
    termButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderTerm(button.dataset.term);
  });
});

renderTerm("oddlot");

renderStage();
