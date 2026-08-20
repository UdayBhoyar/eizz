/**
 * Eizz Popup Options Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleEnabled = document.getElementById('toggle-enabled');
  const skillInput = document.getElementById('skill-input');
  const addBtn = document.getElementById('add-btn');
  const chipsContainer = document.getElementById('chips-container');

  let customSkills = ['React', 'Python', 'AWS', 'TypeScript'];

  // Load initial settings
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['enabled', 'customSkills'], (result) => {
      if (result.enabled !== undefined) {
        toggleEnabled.checked = result.enabled;
      }
      if (Array.isArray(result.customSkills)) {
        customSkills = result.customSkills;
      }
      renderChips();
    });
  } else {
    renderChips();
  }

  // Toggle state change
  toggleEnabled.addEventListener('change', () => {
    saveSettings();
  });

  // Add custom skill keyword
  addBtn.addEventListener('click', () => {
    addSkill();
  });

  skillInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  });

  function addSkill() {
    const val = skillInput.value.trim();
    if (val && !customSkills.includes(val)) {
      customSkills.push(val);
      skillInput.value = '';
      renderChips();
      saveSettings();
    }
  }

  function renderChips() {
    chipsContainer.innerHTML = '';
    customSkills.forEach((skill) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = `
        ⭐ ${escapeHtml(skill)}
        <span class="chip-remove" data-skill="${escapeHtml(skill)}">&times;</span>
      `;
      chipsContainer.appendChild(chip);
    });

    // Bind remove handlers
    document.querySelectorAll('.chip-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetSkill = e.target.getAttribute('data-skill');
        customSkills = customSkills.filter(s => s !== targetSkill);
        renderChips();
        saveSettings();
      });
    });
  }

  function saveSettings() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({
        enabled: toggleEnabled.checked,
        customSkills: customSkills
      }, () => {
        // Notify active tab to re-scan with new settings
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'SETTINGS_UPDATED' }).catch(() => {});
          }
        });
      });
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
});
