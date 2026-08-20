/**
 * Eizz - Content Script Controller
 * Injected into job portals to detect job descriptions, handle SPA navigation, and trigger parsing.
 */

(function () {
  'use strict';

  // Site-specific DOM Selectors for popular job platforms
  const PLATFORM_SELECTORS = [
    // LinkedIn
    '.jobs-description__content',
    '.jobs-description-content',
    '#job-details',
    '.jobs-box__html-content',
    '.job-view-layout',
    
    // Indeed
    '#jobDescriptionText',
    '.jobsearch-JobComponent-description',
    '.jobsearch-jobDescriptionText',

    // Glassdoor
    '[class*="JobDetails_jobDescription"]',
    '.jobDescriptionContent',
    '#JobDescriptionContainer',

    // Greenhouse
    '#content',
    '#main',
    '.job-post',

    // Lever
    '.section-wrapper',
    '[data-qa="job-description"]',

    // Workday
    '[data-automation-id="jobPostingDescription"]'
  ];

  class ContentController {
    constructor() {
      this.overlay = null;
      this.customSkills = [];
      this.isEnabled = true;
      this.lastScannedText = '';
      this.observer = null;
    }

    async init() {
      // Read settings
      await this.loadSettings();

      if (!this.isEnabled) {
        console.log('Eizz: Extension is disabled in settings.');
        return;
      }

      // Initialize overlay UI
      if (typeof EizzOverlay !== 'undefined') {
        this.overlay = new EizzOverlay();
        await this.overlay.mount();
      }

      // Initial scan
      this.scanPage();

      // Observe DOM changes for single-page applications (LinkedIn/Indeed job switching)
      this.setupMutationObserver();

      // Expose controller globally for manual triggers
      window.EizzContentController = this;
    }

    async loadSettings() {
      return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.get(['enabled', 'customSkills'], (result) => {
            this.isEnabled = result.enabled !== false; // Default true
            this.customSkills = result.customSkills || [];
            resolve();
          });
        } else {
          resolve();
        }
      });
    }

    /**
     * Find job description container using targeted selectors or heuristic algorithm
     */
    findJobDescriptionText() {
      // 1. Try platform-specific selectors
      for (const selector of PLATFORM_SELECTORS) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim().length > 100) {
          return el.innerText;
        }
      }

      // 2. Fallback Heuristic: find block with highest frequency of job keywords
      const candidates = document.querySelectorAll('article, section, main, div');
      let bestCandidate = null;
      let maxScore = 0;

      const keywords = ['requirements', 'qualifications', 'experience', 'responsibilities', 'skills', 'must have', 'nice to have'];

      candidates.forEach((el) => {
        const text = el.innerText || '';
        // Skip body / giant wrappers
        if (text.length < 150 || text.length > 25000) return;

        const lower = text.toLowerCase();
        let score = 0;
        keywords.forEach(kw => {
          if (lower.includes(kw)) score += 10;
        });

        if (score > maxScore) {
          maxScore = score;
          bestCandidate = text;
        }
      });

      return bestCandidate || document.body.innerText || '';
    }

    scanPage() {
      const text = this.findJobDescriptionText();
      if (!text || text === this.lastScannedText) return;

      this.lastScannedText = text;

      if (typeof EizzParser !== 'undefined' && this.overlay) {
        const analysis = EizzParser.analyzeJobDescription(text, this.customSkills);
        this.overlay.render(analysis);
      }
    }

    setupMutationObserver() {
      let debounceTimer = null;
      this.observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.scanPage();
        }, 600); // 600ms debounce
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const controller = new ContentController();
      controller.init();
    });
  } else {
    const controller = new ContentController();
    controller.init();
  }
})();
