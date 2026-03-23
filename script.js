const stages = [
  {
    title: "關卡 1：開戶任務",
    desc: "你準備買第一張台股，第一步應該先做什麼？",
    choices: [
      { text: "先去社群找明牌直接下單", correct: false, note: "還沒開戶前無法下單。" },
      { text: "開立證券戶與交割戶", correct: true, note: "正確，這是買賣股票的基礎。" },
      { text: "先把全部存款換成股票", correct: false, note: "先建立流程，再談資金配置。" }
    ]
  },
  {
    title: "關卡 2：資金補給",
    desc: "帳戶開好後，接下來要怎麼讓委託有機會成交？",
    choices: [
      { text: "把錢轉進交割帳戶", correct: true, note: "正確，沒資金通常會導致交割失敗風險。" },
      { text: "先借錢 All in", correct: false, note: "槓桿風險高，新手不建議。" },
      { text: "不用入金，成交再補", correct: false, note: "流程錯誤，先備妥資金。" }
    ]
  },
  {
    title: "關卡 3：下單指令",
    desc: "你想買 2330，最完整的下單資訊是什麼？",
    choices: [
      { text: "只填股號，其他隨便", correct: false, note: "資訊不足，無法正確委託。" },
      { text: "股號、價格、數量、買進別", correct: true, note: "正確，關鍵欄位都到位。" },
      { text: "看漲就市價重壓", correct: false, note: "先理解風險與委託條件。" }
    ]
  },
  {
    title: "關卡 4：風險守門",
    desc: "成交後最重要的習慣是什麼？",
    choices: [
      { text: "每天追高殺低", correct: false, note: "情緒化操作風險高。" },
      { text: "檢查庫存、成本與停損規劃", correct: true, note: "正確，風險管理比猜漲跌更重要。" },
      { text: "把密碼給朋友幫忙看盤", correct: false, note: "帳密安全不可外流。" }
    ]
  },
  {
    title: "關卡 5：技術面判讀",
    desc: "看到股價連續三天急漲，你第一個反應應該是？",
    choices: [
      { text: "怕錯過直接追高", correct: false, note: "先確認成交量與風險，不要只看漲幅。" },
      { text: "先看量價與基本面，再決定是否分批", correct: true, note: "正確，先驗證再決策。" },
      { text: "借錢加碼放大報酬", correct: false, note: "槓桿會放大虧損，新手應保守。" }
    ]
  },
  {
    title: "關卡 6：資金控管",
    desc: "若你總資金 30 萬，單一標的合理上限更接近哪個做法？",
    choices: [
      { text: "一次投入 30 萬，省時間", correct: false, note: "過度集中風險太高。" },
      { text: "先以 5-10 萬試單，保留現金彈性", correct: true, note: "正確，分批與部位控管更穩健。" },
      { text: "看新聞熱度決定全押", correct: false, note: "資訊雜訊多，紀律比情緒重要。" }
    ]
  }
];

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
const simLots = document.getElementById("sim-lots");
const simBudget = document.getElementById("sim-budget");

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
    badgeText.textContent = "已解鎖：冷靜交易員";
  } else if (bestScore >= 75) {
    badgeText.textContent = "已解鎖：穩健新手";
  } else if (bestScore >= 50) {
    badgeText.textContent = "已解鎖：流程探索者";
  } else {
    badgeText.textContent = "尚未解鎖勳章";
  }
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
  questionTitle.textContent = "恭喜通關！你已完成台股買進流程演練";
  questionDesc.textContent = "記得：先流程、後資金、再策略；每一步都要有風險意識。";
  stageIndicator.textContent = `第 ${stages.length} / ${stages.length} 關`;
  progressFill.style.width = "100%";
  progressText.textContent = "100%";
  choicesWrap.innerHTML = "";
  feedback.className = "feedback good";

  if (score === 100) {
    feedback.textContent = "滿分！你拿到『冷靜交易員』勳章。";
  } else if (score >= 67) {
    feedback.textContent = "不錯！再玩一次可拿更高分。";
  } else {
    feedback.textContent = "先別急著下單，建議重玩一次熟悉流程。";
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
  const lots = Number(simLots.value);
  const budget = Number(simBudget.value);

  if (!symbol || price <= 0 || lots <= 0 || budget <= 0) {
    simResult.className = "sim-result warn";
    simResult.textContent = "請輸入有效的股票、價格、張數與預算。";
    return;
  }

  const shares = lots * 1000;
  const tradeAmount = price * shares;
  const fee = Math.max(20, Math.round(tradeAmount * 0.001425));
  const totalCost = tradeAmount + fee;
  const remain = budget - totalCost;

  if (remain >= 0) {
    simResult.className = "sim-result ok";
    simResult.textContent = `${symbol} 買進估算：成交 ${tradeAmount.toLocaleString()} 元，手續費 ${fee.toLocaleString()} 元，總成本 ${totalCost.toLocaleString()} 元，可用餘額 ${remain.toLocaleString()} 元。`;
    addMissionLog(`模擬下單成功：${symbol} ${lots} 張，成本 ${totalCost.toLocaleString()} 元`);
  } else {
    simResult.className = "sim-result warn";
    simResult.textContent = `${symbol} 目前預算不足，尚差 ${Math.abs(remain).toLocaleString()} 元。建議調整張數或價格。`;
    addMissionLog(`模擬下單失敗：${symbol} 預算不足 ${Math.abs(remain).toLocaleString()} 元`);
  }
});

renderStage();
