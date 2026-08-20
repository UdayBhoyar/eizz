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

  const COMPANY_SELECTORS = [
    // Mock / Local Demo
    '#job-company',
    '.company-info',

    // LinkedIn
    '.jobs-unified-top-card__company-name',
    '.job-details-jobs-unified-top-card__company-name',
    '.jobs-details-top-card__company-url',
    '.jobs-company__name',
    'a[href*="/company/"]',

    // Indeed
    '[data-testid="inlineHeader-companyName"]',
    '.jobsearch-CompanyReview--heading',
    '.jobsearch-JobInfoHeader-companyName',

    // Glassdoor
    '[data-test="employer-name"]',
    '.EmployerProfile_employerName',

    // Greenhouse & Lever
    '.company-name',
    '.posting-header h2'
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
      await this.loadSettings();

      if (!this.isEnabled) {
        console.log('Eizz: Extension is disabled in settings.');
        return;
      }

      if (typeof EizzOverlay !== 'undefined') {
        this.overlay = new EizzOverlay();
        await this.overlay.mount();
      }

      this.scanPage();
      this.setupMutationObserver();

      window.EizzContentController = this;
    }

    async loadSettings() {
      return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.get(['enabled', 'customSkills'], (result) => {
            this.isEnabled = result.enabled !== false;
            this.customSkills = result.customSkills || [];
            resolve();
          });
        } else {
          resolve();
        }
      });
    }

    findJobDescriptionText() {
      for (const selector of PLATFORM_SELECTORS) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim().length > 100) {
          return el.innerText;
        }
      }

      const candidates = document.querySelectorAll('article, section, main, div');
      let bestCandidate = null;
      let maxScore = 0;

      const keywords = ['requirements', 'qualifications', 'experience', 'responsibilities', 'skills', 'must have', 'nice to have'];

      candidates.forEach((el) => {
        const text = el.innerText || '';
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

    findCompanyName() {
      for (const selector of COMPANY_SELECTORS) {
        const el = document.querySelector(selector);
        if (el && el.innerText && el.innerText.trim().length > 0) {
          return el.innerText.split('—')[0].split('•')[0].trim();
        }
      }
      return null;
    }

    scanPage() {
      const text = this.findJobDescriptionText();
      const companyName = this.findCompanyName();

      if (!text || (text === this.lastScannedText && companyName === this.lastCompanyName)) return;

      this.lastScannedText = text;
      this.lastCompanyName = companyName;

      if (typeof EizzParser !== 'undefined' && this.overlay) {
        const analysis = EizzParser.analyzeJobDescription(text, this.customSkills, {
          companyName: companyName
        });
        this.overlay.render(analysis);
      }
    }

    setupMutationObserver() {
      let debounceTimer = null;
      this.observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.scanPage();
        }, 600);
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

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
