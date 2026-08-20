/**
 * Eizz - Shadow DOM Overlay Interface Engine
 */

(function (exports) {
  'use strict';

  // Embed core overlay CSS fallback directly to guarantee immediate rendering
  const EMBEDDED_CSS = `
    .eizz-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      width: 370px;
      max-width: calc(100vw - 40px);
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 18px;
      color: #f8fafc;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      pointer-events: auto;
    }
    .eizz-container *, .eizz-container *::before, .eizz-container *::after {
      box-sizing: border-box; margin: 0; padding: 0;
    }
    .eizz-container.eizz-collapsed {
      width: 52px; height: 52px; border-radius: 26px; overflow: hidden;
      cursor: pointer; background: linear-gradient(135deg, #7c3aed, #06b6d4);
      box-shadow: 0 10px 30px rgba(124, 58, 237, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.4);
    }
    .eizz-collapsed-btn {
      display: flex; align-items: center; justify-content: center;
      width: 100%; height: 100%; color: #ffffff; font-size: 22px; font-weight: 800;
    }
    .eizz-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; background: rgba(30, 41, 59, 0.85);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1); user-select: none;
    }
    .eizz-brand { display: flex; align-items: center; gap: 10px; }
    .eizz-logo {
      width: 30px; height: 30px; background: linear-gradient(135deg, #7c3aed, #06b6d4);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 15px; color: #ffffff;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
    }
    .eizz-title-wrap { display: flex; flex-direction: column; }
    .eizz-title { font-size: 14px; font-weight: 700; color: #ffffff; }
    .eizz-subtitle { font-size: 11px; color: #94a3b8; font-weight: 500; }
    .eizz-actions { display: flex; align-items: center; gap: 6px; }
    .eizz-icon-btn {
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1; width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 13px; transition: all 0.2s ease;
    }
    .eizz-icon-btn:hover { background: rgba(255, 255, 255, 0.2); color: #ffffff; }
    .eizz-body { padding: 16px; max-height: 480px; overflow-y: auto; }
    .eizz-exp-card {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2));
      border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 14px;
      padding: 14px; margin-bottom: 16px;
    }
    .eizz-exp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .eizz-exp-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #c084fc; }
    .eizz-level-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; }
    .eizz-level-senior { background: rgba(236, 72, 153, 0.25); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.5); }
    .eizz-level-mid { background: rgba(6, 182, 212, 0.25); color: #38bdf8; border: 1px solid rgba(6, 182, 212, 0.5); }
    .eizz-level-entry { background: rgba(16, 185, 129, 0.25); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.5); }
    .eizz-exp-value { font-size: 22px; font-weight: 800; color: #ffffff; display: flex; align-items: center; gap: 8px; }
    .eizz-exp-matches { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
    .eizz-exp-pill { font-size: 11px; background: rgba(255, 255, 255, 0.12); padding: 3px 8px; border-radius: 6px; color: #e2e8f0; }
    .eizz-section { margin-bottom: 16px; }
    .eizz-section-title { font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
    .eizz-badge-count { background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; }
    .eizz-skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .eizz-skill-tag { background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255, 255, 255, 0.15); color: #f1f5f9; font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 8px; display: inline-flex; align-items: center; gap: 5px; }
    .eizz-skill-tag.eizz-custom-highlight { background: linear-gradient(135deg, rgba(234, 179, 8, 0.25), rgba(249, 115, 22, 0.25)); border: 1px solid rgba(234, 179, 8, 0.6); color: #fef08a; }
    .eizz-skill-count { font-size: 10px; opacity: 0.75; background: rgba(255, 255, 255, 0.15); padding: 1px 5px; border-radius: 8px; }
    .eizz-category-block { margin-bottom: 10px; }
    .eizz-category-label { font-size: 11px; font-weight: 600; color: #94a3b8; margin-bottom: 5px; }
    .eizz-context-list { display: flex; flex-direction: column; gap: 8px; }
    .eizz-context-item { font-size: 11px; line-height: 1.45; color: #cbd5e1; background: rgba(255, 255, 255, 0.05); border-left: 3px solid #38bdf8; padding: 8px 10px; border-radius: 0 8px 8px 0; }
    .eizz-footer { padding: 12px 16px; background: rgba(15, 23, 42, 0.95); border-top: 1px solid rgba(255, 255, 255, 0.1); }
    .eizz-btn-primary { width: 100%; background: linear-gradient(135deg, #7c3aed, #2563eb); border: none; color: #ffffff; font-size: 12px; font-weight: 700; padding: 10px 14px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4); transition: all 0.2s ease; }
    .eizz-btn-primary:hover { opacity: 0.95; }
  `;

  class EizzOverlay {
    constructor() {
      this.hostElement = null;
      this.shadowRoot = null;
      this.container = null;
      this.isCollapsed = false;
      this.latestAnalysis = null;
    }

    /**
     * Initialize Shadow DOM host and container
     */
    async mount() {
      if (document.getElementById('eizz-host-root')) {
        this.hostElement = document.getElementById('eizz-host-root');
        this.shadowRoot = this.hostElement.shadowRoot;
        this.container = this.shadowRoot.querySelector('.eizz-container');
        return;
      }

      // Create host element fixed to top-right
      this.hostElement = document.createElement('div');
      this.hostElement.id = 'eizz-host-root';
      this.hostElement.style.position = 'fixed';
      this.hostElement.style.top = '20px';
      this.hostElement.style.right = '20px';
      this.hostElement.style.zIndex = '2147483647'; // Highest z-index
      this.hostElement.style.pointerEvents = 'none'; // Only container takes clicks

      // Attach shadow root
      this.shadowRoot = this.hostElement.attachShadow({ mode: 'open' });

      // Embed CSS inside Shadow DOM
      const style = document.createElement('style');
      style.textContent = EMBEDDED_CSS;
      this.shadowRoot.appendChild(style);

      // Create main container
      this.container = document.createElement('div');
      this.container.className = 'eizz-container';
      this.shadowRoot.appendChild(this.container);

      document.body.appendChild(this.hostElement);
    }

    /**
     * Render analysis data into the Shadow DOM overlay
     */
    render(analysis) {
      if (!this.container) return;
      this.latestAnalysis = analysis;

      if (this.isCollapsed) {
        this.renderCollapsedView();
        return;
      }

      const { experience, skills, education, contextSentences } = analysis;

      // Classify level tag CSS class
      let levelClass = 'eizz-level-mid';
      if (experience.levelTag.includes('Senior')) levelClass = 'eizz-level-senior';
      if (experience.levelTag.includes('Entry')) levelClass = 'eizz-level-entry';

      // Custom skill tags HTML
      let customSkillsHtml = '';
      if (skills.customMatches && skills.customMatches.length > 0) {
        const customPills = skills.customMatches.map(s => 
          `<span class="eizz-skill-tag eizz-custom-highlight">⭐ ${escapeHtml(s.name)} <span class="eizz-skill-count">${s.count}</span></span>`
        ).join('');
        customSkillsHtml = `
          <div class="eizz-section">
            <div class="eizz-section-title">
              <span>🎯 Custom Target Skills</span>
              <span class="eizz-badge-count">${skills.customMatches.length}</span>
            </div>
            <div class="eizz-skills-grid">${customPills}</div>
          </div>
        `;
      }

      // Categories HTML
      let categoriesHtml = '';
      if (skills.categories && skills.categories.length > 0) {
        categoriesHtml = skills.categories.map(cat => {
          const pills = cat.skills.map(s => 
            `<span class="eizz-skill-tag">${escapeHtml(s.name)} <span class="eizz-skill-count">${s.count}</span></span>`
          ).join('');
          return `
            <div class="eizz-category-block">
              <div class="eizz-category-label">${escapeHtml(cat.category)}</div>
              <div class="eizz-skills-grid">${pills}</div>
            </div>
          `;
        }).join('');
      } else {
        categoriesHtml = `<div style="font-size:12px; color:#94a3b8;">No standard tech keywords detected.</div>`;
      }

      // Context Sentences HTML
      let contextHtml = '';
      if (contextSentences && contextSentences.length > 0) {
        const items = contextSentences.map(c => `<div class="eizz-context-item">"${escapeHtml(c)}"</div>`).join('');
        contextHtml = `
          <div class="eizz-section">
            <div class="eizz-section-title">📌 Key Context Snippets</div>
            <div class="eizz-context-list">${items}</div>
          </div>
        `;
      }

      // Main inner HTML template
      this.container.className = 'eizz-container';
      this.container.innerHTML = `
        <div class="eizz-header">
          <div class="eizz-brand">
            <div class="eizz-logo">E</div>
            <div class="eizz-title-wrap">
              <div class="eizz-title">Eizz Quick Analysis</div>
              <div class="eizz-subtitle">Experience & Skill Scanner</div>
            </div>
          </div>
          <div class="eizz-actions">
            <button class="eizz-icon-btn" id="eizz-btn-reparse" title="Re-scan Page">⚡</button>
            <button class="eizz-icon-btn" id="eizz-btn-collapse" title="Collapse Overlay">─</button>
          </div>
        </div>

        <div class="eizz-body">
          <!-- Experience Summary Card -->
          <div class="eizz-exp-card">
            <div class="eizz-exp-header">
              <div class="eizz-exp-title">Experience Required</div>
              <div class="eizz-level-badge ${levelClass}">${escapeHtml(experience.levelTag)}</div>
            </div>
            <div class="eizz-exp-value">
              <span>💼</span> ${escapeHtml(experience.summary)}
            </div>
            ${experience.matches.length > 0 ? `
              <div class="eizz-exp-matches">
                ${experience.matches.map(m => `<span class="eizz-exp-pill">${escapeHtml(m)}</span>`).join('')}
              </div>
            ` : ''}
          </div>

          ${customSkillsHtml}

          <!-- Key Skills Section -->
          <div class="eizz-section">
            <div class="eizz-section-title">
              <span>🛠️ Key Required Skills</span>
              <span class="eizz-badge-count">${skills.totalUniqueCount} Found</span>
            </div>
            ${categoriesHtml}
          </div>

          <!-- Education Section -->
          <div class="eizz-section">
            <div class="eizz-section-title">🎓 Education Criteria</div>
            <div class="eizz-skills-grid">
              ${education.map(e => `<span class="eizz-skill-tag" style="border-color:rgba(168,85,247,0.4);">🎓 ${escapeHtml(e)}</span>`).join('')}
            </div>
          </div>

          ${contextHtml}
        </div>

        <div class="eizz-footer">
          <button class="eizz-btn-primary" id="eizz-btn-copy">
            <span>📋 Copy Quick Summary</span>
          </button>
        </div>
      `;

      this.bindEvents();
    }

    renderCollapsedView() {
      this.container.className = 'eizz-container eizz-collapsed';
      this.container.innerHTML = `
        <div class="eizz-collapsed-btn" id="eizz-btn-expand" title="Expand Eizz Overlay">
          ⚡
        </div>
      `;

      const expandBtn = this.shadowRoot.getElementById('eizz-btn-expand');
      if (expandBtn) {
        expandBtn.onclick = () => {
          this.isCollapsed = false;
          if (this.latestAnalysis) this.render(this.latestAnalysis);
        };
      }
    }

    bindEvents() {
      const collapseBtn = this.shadowRoot.getElementById('eizz-btn-collapse');
      if (collapseBtn) {
        collapseBtn.onclick = () => {
          this.isCollapsed = true;
          this.renderCollapsedView();
        };
      }

      const reparseBtn = this.shadowRoot.getElementById('eizz-btn-reparse');
      if (reparseBtn) {
        reparseBtn.onclick = () => {
          if (window.EizzContentController) {
            window.EizzContentController.scanPage();
          }
        };
      }

      const copyBtn = this.shadowRoot.getElementById('eizz-btn-copy');
      if (copyBtn) {
        copyBtn.onclick = () => this.copyToClipboard();
      }
    }

    copyToClipboard() {
      if (!this.latestAnalysis) return;
      const { experience, skills } = this.latestAnalysis;

      const summaryText = `[Eizz Job Analysis Summary]
Experience Required: ${experience.summary} (${experience.levelTag})
Key Skills: ${skills.flatList.join(', ')}
Total Skills Detected: ${skills.totalUniqueCount}`;

      navigator.clipboard.writeText(summaryText).then(() => {
        const copyBtn = this.shadowRoot.getElementById('eizz-btn-copy');
        if (copyBtn) {
          copyBtn.innerHTML = `<span>✅ Copied to Clipboard!</span>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<span>📋 Copy Quick Summary</span>`;
          }, 2000);
        }
      }).catch(err => console.error('Eizz: Copy failed', err));
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EizzOverlay };
  } else {
    exports.EizzOverlay = EizzOverlay;
  }
})(typeof window !== 'undefined' ? window : this);
