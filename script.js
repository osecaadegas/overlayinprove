// Enhanced Bonus Hunt Tracker Calculation
function calculateBonusHunt(startMoney, stopMoney, betSize, bonuses) {
  const totalSpent = startMoney - stopMoney;
  // Calculate average bet from bonuses array
  let averageBet = 0;
  if (bonuses.length) {
    const totalBet = bonuses.reduce((sum, b) => sum + (typeof b.bet === "number" ? b.bet : 0), 0);
    averageBet = totalBet / bonuses.length;
  }
  const breakEvenPerBonus = bonuses.length ? totalSpent / bonuses.length : 0;
  const totalBreakEven = totalSpent;
  const actualReturn = bonuses.reduce((sum, b) => sum + (typeof b.value === "number" ? b.value : 0), 0);
  const profit = actualReturn - totalSpent;
  const profitPercent = totalSpent !== 0 ? (profit / totalSpent) * 100 : 0;
  // BE X calculation: (stopMoney - startMoney) / averageBet
  let beX = 0;
  if (averageBet !== 0) {
    beX = (stopMoney - startMoney) / averageBet;
  }
  return {
    totalSpent,
    averageBet,
    breakEvenPerBonus,
    totalBreakEven,
    actualReturn,
    profit,
    profitPercent: Math.round(profitPercent),
    beX
  };
}

// 🧠 New Bonus Hunt Stats Calculation
function calculateBonusHuntStats(startBalance, openingBalance, bonuses) {
  const bonusesCount = bonuses.length;
  const totalCost = startBalance - openingBalance;
  const totalReturn = bonuses.reduce((sum, b) => sum + (typeof b.result === "number" ? b.result : 0), 0);
  const totalBet = bonuses.reduce((sum, b) => sum + (typeof b.bet === "number" ? b.bet : 0), 0);
  const averageBetSize = bonusesCount ? totalBet / bonusesCount : 0;
  const averageWin = bonusesCount ? totalReturn / bonusesCount : 0;
  const averageX = bonusesCount
    ? bonuses.reduce((sum, b) => sum + (b.bet ? b.result / b.bet : 0), 0) / bonusesCount
    : 0;
  const breakEven = totalCost;
  const breakEvenPerBonus = bonusesCount ? breakEven / bonusesCount : 0;
  const breakEvenX = averageBetSize ? breakEvenPerBonus / averageBetSize : 0;
  const totalProfit = totalReturn - totalCost;
  return {
    bonuses: bonusesCount,
    totalCost,
    totalReturn,
    averageBetSize,
    averageWin,
    averageX,
    breakEven,
    breakEvenPerBonus,
    breakEvenX,
    totalProfit
  };
}

function updateTime() {
  const el = document.getElementById('current-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateTime, 1000);
updateTime();

document.addEventListener('DOMContentLoaded', () => {
  const bhBtn = document.getElementById('bh-btn');
  const boBtn = document.getElementById('bo-btn');
  const infoPanel = document.querySelector('.info-panel');
  const middlePanel = document.getElementById('middle-panel');
  let panelVisible = false;

  // Helper to update info panel visibility with slide
  function updateInfoPanelVisibility() {
    const bhActive = bhBtn && bhBtn.classList.contains('active');
    const boActive = boBtn && boBtn.classList.contains('active');
    if (infoPanel) {
      if (bhActive || boActive) {
        infoPanel.classList.add('info-panel--visible');
      } else {
        infoPanel.classList.remove('info-panel--visible');
      }
    }
  }

  // Patch BH button logic
  bhBtn.addEventListener('click', () => {
    panelVisible = !panelVisible;
    middlePanel.style.display = panelVisible ? 'flex' : 'none';
    bhBtn.classList.toggle('active', panelVisible);
    // Remove 'active' from all sidebar buttons except BH
    if (panelVisible) {
      document.querySelectorAll('.sidebar-btn').forEach(btn => {
        if (btn !== bhBtn) btn.classList.remove('active');
      });
    }
    updateInfoPanelVisibility();
  });

  const adInput = document.getElementById('ad-image-input');
  const adPreview = document.getElementById('ad-image-preview');
  const adLabel = document.querySelector('.ad-upload-label');

  adInput.addEventListener('change', (e) => {
    const file = adInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        adPreview.src = evt.target.result;
        adPreview.style.display = 'block';
        adLabel.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Focus bet size after pressing Enter in slot name
  const slotNameInput = document.getElementById('slot-name-input');
  const betSizeInput = document.getElementById('bet-size-input');
  if (slotNameInput && betSizeInput) {
    slotNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        betSizeInput.focus();
      }
    });
  }

  // Slot image URL button/input toggle
  const slotImgUrlBtn = document.getElementById('slot-img-url-btn');
  const slotImgUrlInput = document.getElementById('slot-img-url-input');
  if (slotImgUrlBtn && slotImgUrlInput) {
    slotImgUrlBtn.addEventListener('click', () => {
      slotImgUrlBtn.style.display = 'none';
      slotImgUrlInput.style.display = 'inline-block';
      slotImgUrlInput.focus();
    });
    slotImgUrlInput.addEventListener('blur', () => {
      slotImgUrlInput.style.display = 'none';
      slotImgUrlBtn.style.display = 'inline-flex';
    });
    slotImgUrlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        slotImgUrlInput.blur();
      }
    });
  }

  // --- Bonus Opening / BO Button Logic ---
  const bonusOpenBtn = document.getElementById('bonus-opening-btn'); // "Bonus opening" button in BH panel
  const bhPanel = document.getElementById('middle-panel'); // BH panel element

  // Slot image URL (replace with your logic to get the actual image)
  let slotImageUrl = '';
  const slotImgInput = document.getElementById('slot-img-url-input');
  if (slotImgInput) {
    slotImgInput.addEventListener('input', (e) => {
      slotImageUrl = e.target.value;
    });
  }

  // Patch Bonus Opening button in BH panel
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
      // Set BO button as active, BH as inactive
      if (boBtn) boBtn.classList.add('active');
      if (bhBtn) bhBtn.classList.remove('active');
      updateInfoPanelVisibility();
      // --- Ensure slot highlight card updates immediately ---
      setTimeout(updateSlotHighlightCard, 50);
    });
  }

  // Hide info panel by default on load
  if (infoPanel) infoPanel.classList.remove('info-panel--visible');

  // --- Twitch Login/Logout Mockup ---
  const twitchLoginBtn = document.getElementById('twitch-login-btn');
  const twitchUsernameSpan = document.getElementById('twitch-username');

  // Replace this with real OAuth logic
  function mockTwitchLogin() {
    // Simulate login and set username
    const username = prompt('Enter your Twitch username:', 'StreamerName');
    if (username) {
      twitchUsernameSpan.textContent = username;
      twitchUsernameSpan.style.display = '';
      twitchLoginBtn.style.display = 'none';
    }
  }

  if (twitchLoginBtn) {
    twitchLoginBtn.addEventListener('click', mockTwitchLogin);
  }

  // Update Start/Stop Money display in right sidebar
  const startMoneyInput = document.getElementById('start-money-input');
  const stopMoneyInput = document.getElementById('stop-money-input');
  const startMoneyDisplay = document.getElementById('start-money-display');
  const stopMoneyDisplay = document.getElementById('stop-money-display');
  const startMoneyDisplayMain = document.getElementById('start-money-display-main');
  const stopMoneyDisplayMain = document.getElementById('stop-money-display-main');

  function updateStartMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (startMoneyDisplay) startMoneyDisplay.textContent = formatted;
    if (startMoneyDisplayMain) startMoneyDisplayMain.textContent = formatted;
  }
  function updateStopMoneyDisplays(val) {
    const formatted = val ? `€${parseFloat(val).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '--';
    if (stopMoneyDisplay) stopMoneyDisplay.textContent = formatted;
    if (stopMoneyDisplayMain) stopMoneyDisplayMain.textContent = formatted;
  }

  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', () => {
      updateStartMoneyDisplays(startMoneyInput.value);
    });
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', () => {
      updateStopMoneyDisplays(stopMoneyInput.value);
    });
  }

  // --- Slot Database ---
  const slotDatabase = [
    
  { name: "Sweet Powernudge", image: "https://mediumrare.imgix.net/6f48e15d310da3000f6554aad1298b424acd06f8544c64ed68c484fbeafc6980?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy 100", image: "https://mediumrare.imgix.net/7baf7257bf20524a6e25760fe034bbd129797f8ff2905ab22c5adc0c740319c6?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Rush Megaways", image: "https://mediumrare.imgix.net/9b4094155be45b4ad24cde1c86ce6aae384309f308da2190b61d0baa4f605446?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Gummmy", image: "https://mediumrare.imgix.net/ba614293c3ec7b1d3037a7211c7063e27ef4ef53ea75e45b4be03ea9bc764d9e?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy", image: "https://mediumrare.imgix.net/1f358762243f6f9201258778752a0a0c64d820bef568dad2e6737f6dd4109f65?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sweet Alchemy 2", image: "https://mediumrare.imgix.net/cc54de090e5d4949aa9cd9286e554a0ea678f87b19b314daec29988ab9501ef1?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush", image: "https://mediumrare.imgix.net/d460898300e27164e6a059a28fca4b38582c07701a7298566ac08661c8b7dc58?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush 1000", image: "https://mediumrare.imgix.net/14d5410c6cf4c303d291262a10e949dc14b0ac2eca2a7a730b0401919c01358e?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Sugar Rush Xmas", image: "https://mediumrare.imgix.net/0e621a565ef413c50798294d014cb1e96550effe8ab5befcd1d6774d9dc20148?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" },
  { name: "Gates of Hades", image: "https://mediumrare.imgix.net/60206bb76f8d15dd2975ea5d5c908194c66a1183683e6988c83027ada9befbef?w=180&h=236&fit=min&auto=format", provider: "Pragmatic Play" }
    // ...add more slots as needed
  ];

  // --- Slot Name Suggestion Dropdown ---
  if (slotNameInput) {
    let suggestionBox = document.createElement('div');
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.background = '#23272f';
    suggestionBox.style.color = '#fff';
    suggestionBox.style.borderRadius = '8px';
    suggestionBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    suggestionBox.style.zIndex = '1001';
    suggestionBox.style.display = 'none';
    suggestionBox.style.maxHeight = '220px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.fontSize = '1rem';
    suggestionBox.style.padding = '0.2rem 0';
    suggestionBox.className = 'slot-suggestion-box';
    document.body.appendChild(suggestionBox);

    slotNameInput.addEventListener('input', function () {
      const value = slotNameInput.value.trim();
      if (value.length < 3) {
        suggestionBox.style.display = 'none';
        return;
      }
      const matches = slotDatabase.filter(slot =>
        slot.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      if (matches.length === 0) {
        suggestionBox.style.display = 'none';
        return;
      }
      suggestionBox.innerHTML = '';
      matches.forEach(slot => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = '0.4rem 1rem';
        item.style.cursor = 'pointer';
        item.innerHTML = `
          <img src="${slot.image}" alt="${slot.name}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;margin-right:0.7rem;">
          <div>
            <div style="font-weight:600;">${slot.name}</div>
            <div style="font-size:0.92rem;color:#b0b3b8;">${slot.provider}</div>
          </div>
        `;
        item.addEventListener('mousedown', function (e) {
          e.preventDefault();
          slotNameInput.value = slot.name;
          suggestionBox.style.display = 'none';
          slotNameInput.dispatchEvent(new Event('input'));
          // Focus bet size input after selecting a suggestion
          if (betSizeInput) betSizeInput.focus();
        });
        item.addEventListener('mouseover', function () {
          item.style.background = '#9147ff';
        });
        item.addEventListener('mouseout', function () {
          item.style.background = 'transparent';
        });
        suggestionBox.appendChild(item);
      });
      // Position the suggestion box below the input
      const rect = slotNameInput.getBoundingClientRect();
      suggestionBox.style.left = rect.left + window.scrollX + 'px';
      suggestionBox.style.top = rect.bottom + window.scrollY + 'px';
      suggestionBox.style.minWidth = rect.width + 'px';
      suggestionBox.style.display = 'block';
    });

    // Hide suggestions on blur
    slotNameInput.addEventListener('blur', function () {
      setTimeout(() => { suggestionBox.style.display = 'none'; }, 100);
    });
  }

  // Add slot to Bonus List on Enter in Bet Size input
  // Ensure there is a <ul> inside .bonus-list, create if missing
  let bonusListUl = document.querySelector('.bonus-list ul');
  if (!bonusListUl) {
    const bonusListDiv = document.querySelector('.bonus-list');
    if (bonusListDiv) {
      bonusListUl = document.createElement('ul');
      bonusListDiv.appendChild(bonusListUl);
    }
  }
  // --- Super checkbox logic ---
  const superCheckbox = document.getElementById('super-checkbox');
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const slotName = slotNameInput.value.trim();
        const betSize = betSizeInput.value.trim();
        if (slotName && betSize) {
          // Try to find slot in database for image
          let slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
          let imgSrc = slot ? slot.image : 'https://via.placeholder.com/32x32?text=🎰';
          // Create new list item with image and highlight classes
          const li = document.createElement('li');
          li.innerHTML = `
            <img src="${imgSrc}" alt="${slotName}" class="slot-img">
            <span class="slot-name">${slotName}</span>
            <span class="slot-bet">€${parseFloat(betSize).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          `;
          // Highlight if super checkbox is checked
          if (superCheckbox && superCheckbox.checked) {
            li.classList.add('super-slot');
            superCheckbox.checked = false; // Optionally uncheck after use
          }
          bonusListUl.appendChild(li);

          // Optionally clear inputs
          slotNameInput.value = '';
          betSizeInput.value = '';
          slotNameInput.focus();

          renderBonusHuntResults();
          updateBonusListCarousel();
        }
      }
    });
  }

  // --- Bonus Opening Payout Panel Logic (Vanilla JS, styled to match your app) ---

  function getBonusListData() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return [];
    // Only use non-clone lis for calculations and payout
    return Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null
        };
      });
  }

  let payoutPanel = null;
  let payoutBonuses = [];
  let payoutIndex = 0;

  function showPayoutPanel() {
    if (payoutPanel) return;
    payoutBonuses = getBonusListData();
    if (!payoutBonuses.length) return;

    payoutIndex = 0;
    payoutPanel = document.createElement('div');
    payoutPanel.className = 'middle-panel';
    payoutPanel.style.display = 'flex';
    payoutPanel.style.flexDirection = 'column';
    payoutPanel.style.alignItems = 'center';
    payoutPanel.style.position = 'fixed';
    payoutPanel.style.top = '50%';
    payoutPanel.style.left = '50%';
    payoutPanel.style.transform = 'translate(-50%, -50%)';
    payoutPanel.style.zIndex = '1001';
    payoutPanel.style.background = 'rgba(36, 38, 48, 0.97)';
    payoutPanel.style.borderRadius = '24px';
    payoutPanel.style.boxShadow = '0 6px 24px 0 rgba(0,0,0,0.18)';
    payoutPanel.style.padding = '2rem 1.5rem';
    payoutPanel.style.width = '400px';
    payoutPanel.style.height = '420px';

    document.body.appendChild(payoutPanel);
    renderPayoutStep();
  }

  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  function getSlotImage(slotName) {
    // Use the slotDatabase defined in this script
    const slot = slotDatabase.find(s => s.name.toLowerCase() === slotName.toLowerCase());
    return slot ? slot.image : 'https://via.placeholder.com/120x80?text=🎰';
  }

  // --- Hook up Bonus Opening button ---
  // Remove duplicate event listener for bonusOpenBtn
  // Only keep the payout panel logic, not the slot card logic, for the "Bonus Opening" button
  if (bonusOpenBtn) {
    bonusOpenBtn.addEventListener('click', () => {
      if (middlePanel) middlePanel.style.display = 'none';
      showPayoutPanel();
    });
  }

  function renderBonusHuntResults() {
    const startBalance = parseFloat(document.getElementById('start-money-input')?.value) || 0;
    const openingBalance = parseFloat(document.getElementById('stop-money-input')?.value) || 0;
    // Only use non-clone lis for calculations
    const bonusListUl = document.querySelector('.bonus-list ul');
    const bonuses = bonusListUl
      ? Array.from(bonusListUl.children)
          .filter(li => !li.classList.contains('carousel-clone'))
          .map(li => {
            const spans = li.querySelectorAll('span');
            let slot = spans[0] ? spans[0].textContent : '';
            let bet = spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0;
            let result = 0;
            if (li.dataset && li.dataset.payout) {
              result = parseFloat(li.dataset.payout) || 0;
            }
            return { slot, bet, result };
          })
      : [];

    const stats = calculateBonusHuntStats(startBalance, openingBalance, bonuses);

    const resultsDiv = document.getElementById('bonus-hunt-results');
    if (!resultsDiv) return;
    resultsDiv.innerHTML = `
      <div class="bhr-compact" style="
        display:grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 0.07rem 0.2rem;
        font-size: 0.89rem;
        line-height: 1.08;
        ">
        <div><span class="bhr-label">Bon:</span> <span class="bhr-value">${stats.bonuses}</span></div>
        <div><span class="bhr-label">Pft:</span> <span class="bhr-value ${stats.totalProfit >= 0 ? 'bhr-profit' : 'bhr-loss'}">€${stats.totalProfit.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">Bet:</span> <span class="bhr-value">€${stats.averageBetSize.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">Win:</span> <span class="bhr-value">€${stats.averageWin.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">X:</span> <span class="bhr-value">${stats.averageX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BE X:</span> <span class="bhr-value">${stats.breakEvenX.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}x</span></div>
        <div><span class="bhr-label">BEB:</span> <span class="bhr-value">€${stats.breakEvenPerBonus.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">BE:</span> <span class="bhr-value">€${stats.breakEven.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></div>
        <div><span class="bhr-label">Cost:</span> <span class="bhr-value">€${stats.totalCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
        <div><span class="bhr-label">Ret:</span> <span class="bhr-value">€${stats.totalReturn.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits: 2})}</span></div>
      </div>
    `;
  }

  // --- Call renderBonusHuntResults on relevant changes ---

  // After start/stop money input
  if (startMoneyInput) {
    startMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  if (stopMoneyInput) {
    stopMoneyInput.addEventListener('input', renderBonusHuntResults);
  }
  // After bet size input
  if (betSizeInput) {
    betSizeInput.addEventListener('input', renderBonusHuntResults);
  }

  // After adding a bonus to the list, update the results
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        // ...existing code...
        // After adding the li:
        renderBonusHuntResults();
      }
    });
  }

  // When a payout is entered in the payout panel, store it as a data attribute and update results
  function setBonusPayout(slotName, payout) {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .forEach(li => {
        const spans = li.querySelectorAll('span');
        if (spans[0] && spans[0].textContent === slotName) {
          li.dataset.payout = payout;
        }
      });
    renderBonusHuntResults();
  }

  // In renderPayoutStep, after payout is entered, call setBonusPayout
  function renderPayoutStep() {
    if (!payoutPanel) return;
    const bonus = payoutBonuses[payoutIndex];
    payoutPanel.innerHTML = `
      <div class="middle-panel-title" style="margin-bottom:1.2rem;">
        Enter Payout (${payoutIndex + 1}/${payoutBonuses.length})
      </div>
      <img src="${getSlotImage(bonus.name)}" alt="${bonus.name}" style="width:120px;height:80px;object-fit:cover;border-radius:12px;margin-bottom:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);">
      <div style="color:#fff;font-weight:600;margin-bottom:12px;font-size:1.15rem;">${bonus.name}</div>
      <form id="payout-form" style="display:flex;gap:8px;margin-bottom:1.5rem;">
        <input
          id="payout-input"
          type="number"
          min="0"
          step="any"
          value="${bonus.payout !== null ? bonus.payout : ''}"
          placeholder="Enter payout"
          class="middle-input"
          style="width:140px;"
          autofocus
        />
        <button type="submit" class="middle-btn small-btn" style="width:auto;">
          OK
        </button>
      </form>
      <div style="flex:1"></div>
      <button id="cancel-payout-panel" class="middle-btn small-btn" style="margin-top:auto;background:#ff5c5c;color:#fff;">Cancel</button>
    `;

    const form = payoutPanel.querySelector('#payout-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      const val = payoutPanel.querySelector('#payout-input').value;
      if (val && !isNaN(val)) {
        payoutBonuses[payoutIndex].payout = parseFloat(val);
        setBonusPayout(bonus.name, parseFloat(val)); // <-- update sidebar
        if (payoutIndex < payoutBonuses.length - 1) {
          payoutIndex++;
          renderPayoutStep();
        } else {
          document.body.removeChild(payoutPanel);
          payoutPanel = null;
          // Optionally: display results or update sidebar
          // Example: console.log(payoutBonuses);
        }
      }
    };

    payoutPanel.querySelector('#cancel-payout-panel').onclick = function () {
      document.body.removeChild(payoutPanel);
      payoutPanel = null;
      // Optionally: show the BH panel again
      const bhPanel = document.getElementById('middle-panel');
      if (bhPanel) bhPanel.style.display = 'flex';
    };
  }

  // Initial render on page load
  document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
    renderBonusHuntResults();
  });

  // --- Carousel Animation for Bonus List ---
  function setupBonusListCarousel() {
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    // Remove previous clones if any
    Array.from(bonusListUl.querySelectorAll('.carousel-clone')).forEach(clone => clone.remove());

    // Only clone the original items (not clones)
    const items = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone'));
    if (items.length === 0) return;

    // Clone all original li elements and append for seamless loop
    items.forEach(li => {
      const clone = li.cloneNode(true);
      clone.classList.add('carousel-clone');
      bonusListUl.appendChild(clone);
    });
  }

  function updateBonusListCarousel() {
    setupBonusListCarousel();
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    // Only count original items (not clones)
    const itemCount = Array.from(bonusListUl.children).filter(li => !li.classList.contains('carousel-clone')).length;
    // Animation duration: 2s per item, min 6s, then double for 0.5x speed
    const duration = Math.max(6, itemCount * 2) * 2;
    bonusListUl.style.animationDuration = duration + 's';
  }

  // Patch add-to-list logic to update carousel
  if (betSizeInput && slotNameInput && bonusListUl) {
    betSizeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        // ...existing code...
        bonusListUl.appendChild(li);
        updateBonusListCarousel();
      }
    });
  }

  // On page load, setup carousel if there are items
  document.addEventListener('DOMContentLoaded', () => {
    updateBonusListCarousel();
  });

  // --- Navbar Image Switcher ---
  const navbarImages = [
    {
      src: "https://i.imgur.com/KBHsq6S.png",
      alt: "C.balance"
    },
    {
      src: "https://i.imgur.com/bdpt4I7.png",
      alt: "Raw"
    },
    {
      src: "https://i.imgur.com/H5lK0WA.png",
      alt: "wager"
    }
  ];
  let navbarImageIndex = 0;
  const navbarImg = document.getElementById('navbar-image-switcher');
  const navbarLink = document.getElementById('navbar-image-link');
  function updateNavbarImage() {
    if (!navbarImg || !navbarLink) return;
    navbarImg.src = navbarImages[navbarImageIndex].src;
    navbarImg.alt = navbarImages[navbarImageIndex].alt;
    navbarLink.href = navbarImages[navbarImageIndex].link;
  }
  if (navbarImg && navbarLink) {
    navbarImg.addEventListener('click', (e) => {
      e.preventDefault();
      navbarImageIndex = (navbarImageIndex + 1) % navbarImages.length;
      updateNavbarImage();
    });
    // Also allow clicking the link to cycle (optional)
    navbarLink.addEventListener('click', (e) => {
      // Only cycle if clicking the image, not the link itself
      if (e.target === navbarImg) return;
      e.preventDefault();
      navbarImageIndex = (navbarImageIndex + 1) % navbarImages.length;
      updateNavbarImage();
    });
    updateNavbarImage();
  }

  // --- Slot Highlight Card (Bottom Left) ---
  let slotHighlightCard = null;
  function updateSlotHighlightCard() {
    // Only show if BO is active
    const boBtn = document.getElementById('bo-btn');
    if (!boBtn || !boBtn.classList.contains('active')) {
      if (slotHighlightCard) {
        slotHighlightCard.remove();
        slotHighlightCard = null;
      }
      return;
    }

    // Remove old card if present
    if (slotHighlightCard) {
      slotHighlightCard.remove();
      slotHighlightCard = null;
    }

    // Get bonus list data (with payouts)
    const bonusListUl = document.querySelector('.bonus-list ul');
    if (!bonusListUl) return;
    const bonuses = Array.from(bonusListUl.children)
      .filter(li => !li.classList.contains('carousel-clone'))
      .map(li => {
        const spans = li.querySelectorAll('span');
        return {
          name: spans[0] ? spans[0].textContent : '',
          bet: spans[1] ? parseFloat(spans[1].textContent.replace(/[^\d.]/g, '')) : 0,
          payout: li.dataset && li.dataset.payout ? parseFloat(li.dataset.payout) : null,
          img: li.querySelector('img') ? li.querySelector('img').src : 'https://via.placeholder.com/32x32?text=🎰'
        };
      });

    if (!bonuses.length) return;

    // Find best (highest payout), worst (lowest payout), and current (first with payout==null)
    let best = null, worst = null, current = null;
    const bonusesWithPayout = bonuses.filter(b => typeof b.payout === 'number' && !isNaN(b.payout));
    if (bonusesWithPayout.length) {
      best = bonusesWithPayout.reduce((a, b) => (b.payout > a.payout ? b : a), bonusesWithPayout[0]);
      worst = bonusesWithPayout.reduce((a, b) => (b.payout < a.payout ? b : a), bonusesWithPayout[0]);
    }
    current = bonuses.find(b => b.payout === null || isNaN(b.payout));

    // Always show 3 slots: left=best, middle=current, right=worst (even if some are the same)
    const slotsToShow = [
      best ? { ...best, type: 'best' } : null,
      current ? { ...current, type: 'current' } : null,
      worst ? { ...worst, type: 'worst' } : null
    ];

    // If all are null, don't show
    if (!slotsToShow[0] && !slotsToShow[1] && !slotsToShow[2]) return;

    // Card container
    slotHighlightCard = document.createElement('div');
    slotHighlightCard.style.position = 'fixed';
    slotHighlightCard.style.left = '24px';
    slotHighlightCard.style.bottom = '24px';
    slotHighlightCard.style.width = '420px';
    slotHighlightCard.style.height = '161px'; // 140px * 1.15 = 161px
    slotHighlightCard.style.background = 'rgba(34,34,40,0.97)';
    slotHighlightCard.style.borderRadius = '32px';
    slotHighlightCard.style.boxShadow = '0 17px 67px 0 rgba(0,0,0,0.28)';
    slotHighlightCard.style.display = 'flex';
    slotHighlightCard.style.alignItems = 'center';
    slotHighlightCard.style.justifyContent = 'space-between';
    slotHighlightCard.style.zIndex = '1000';
    slotHighlightCard.style.padding = '18px 32px 18px 32px';
    slotHighlightCard.style.gap = '0px';

    // Border colors
    const borderColors = {
      best: '#00ff00',
      current: '#ffe600',
      worst: '#ff3b3b'
    };

    // Helper to render a slot card (empty if slot is null)
    function renderSlot(slot, labelText, borderColor) {
      const card = document.createElement('div');
      card.style.border = `3px solid ${borderColor}`;
      card.style.borderRadius = '16px';
      card.style.padding = '12px 16px';
      card.style.background = '#23242a';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.minWidth = '110px';
      card.style.maxWidth = '120px';
      card.style.boxSizing = 'border-box';
      card.style.height = '100%';

      if (!slot) {
        // Empty placeholder
        card.style.opacity = '0.25';
        card.innerHTML = `<div style="width:48px;height:48px;border-radius:8px;background:#444;margin-bottom:8px;"></div>
          <div style="color:#fff;font-weight:600;font-size:14px;text-align:center;margin-bottom:4px;">---</div>
          <div style="color:${borderColor};font-size:12px;font-weight:bold;">${labelText}</div>`;
        return card;
      }

      const img = document.createElement('img');
      img.src = slot.img;
      img.alt = slot.name;
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      img.style.marginBottom = '8px';
      card.appendChild(img);

      const nameDiv = document.createElement('div');
      nameDiv.textContent = slot.name;
      nameDiv.style.color = '#fff';
      nameDiv.style.fontWeight = '600';
      nameDiv.style.fontSize = '14px';
      nameDiv.style.textAlign = 'center';
      nameDiv.style.marginBottom = '4px';
      card.appendChild(nameDiv);

      const label = document.createElement('div');
      label.textContent = labelText;
      label.style.color = borderColor;
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      card.appendChild(label);

      if (typeof slot.payout === 'number' && !isNaN(slot.payout)) {
        const payoutDiv = document.createElement('div');
        payoutDiv.textContent = `Payout: €${slot.payout.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        payoutDiv.style.color = '#aaa';
        payoutDiv.style.fontSize = '12px';
        payoutDiv.style.marginTop = '2px';
        card.appendChild(payoutDiv);
      }

      return card;
    }

    // Render left (best), middle (current), right (worst)
    slotHighlightCard.appendChild(renderSlot(slotsToShow[0], 'Best', borderColors.best));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[1], 'Current', borderColors.current));
    slotHighlightCard.appendChild(renderSlot(slotsToShow[2], 'Worst', borderColors.worst));

    document.body.appendChild(slotHighlightCard);
  }

  // Call updateSlotHighlightCard whenever the bonus list or payouts change
  function patchSlotHighlightCardUpdates() {
    // After adding a bonus
    if (betSizeInput && slotNameInput && bonusListUl) {
      betSizeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          setTimeout(updateSlotHighlightCard, 50);
        }
      });
    }
    // After payout is set
    const origSetBonusPayout = setBonusPayout;
    setBonusPayout = function(slotName, payout) {
      origSetBonusPayout(slotName, payout);
      setTimeout(updateSlotHighlightCard, 50);
    };
    // On page load
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(updateSlotHighlightCard, 100);
    });
    // Also update when BO button is toggled
    const boBtn = document.getElementById('bo-btn');
    if (boBtn) {
      boBtn.addEventListener('click', () => {
        setTimeout(updateSlotHighlightCard, 50);
      });
    }
  }
  patchSlotHighlightCardUpdates();
});