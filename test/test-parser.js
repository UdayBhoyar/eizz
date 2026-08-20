/**
 * Test runner for Eizz Job Experience & Skill Parser
 */
const { analyzeJobDescription } = require('../src/parser.js');
const assert = require('assert');

console.log('🧪 Running Eizz Parser Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${testName}: ${err.message}`);
  }
}

// Test 1: Standard Senior Software Engineer Job Post
runTest('Extracts experience and skills from Senior Software Engineer post', () => {
  const sampleText = `
    We are looking for a Senior Full Stack Engineer with 5+ years of experience building modern web applications.
    Requirements:
    - Minimum 5 years of experience in JavaScript, TypeScript, and React.
    - 3-5 years working with Node.js, Express, and PostgreSQL.
    - Strong experience with AWS, Docker, Kubernetes, and CI/CD pipelines.
    - Bachelor's Degree in Computer Science or equivalent.
    - Excellent communication and Agile team leadership skills.
  `;

  const result = analyzeJobDescription(sampleText);
  
  assert.strictEqual(result.experience.minYears, 3);
  assert.strictEqual(result.experience.maxYears, 5);
  assert.strictEqual(result.experience.levelTag, 'Senior Level');
  assert(result.skills.flatList.includes('React'), 'Should find React');
  assert(result.skills.flatList.includes('TypeScript'), 'Should find TypeScript');
  assert(result.skills.flatList.includes('Node.js'), 'Should find Node.js');
  assert(result.skills.flatList.includes('AWS'), 'Should find AWS');
  assert(result.skills.flatList.includes('Docker'), 'Should find Docker');
  assert(result.education.includes("Bachelor's Degree"), 'Should extract Bachelor\'s Degree');
});

// Test 2: Entry Level / Graduate Job Post
runTest('Detects Entry Level / Fresher requirements correctly', () => {
  const sampleText = `
    Junior Frontend Developer (Entry Level / Freshers Welcome)
    Qualifications:
    - 0 to 1 years of experience in HTML, CSS, JavaScript, and Vue.js.
    - Familiarity with Git, GitHub, and REST APIs.
    - Bachelor's degree in CS or relevant field.
  `;

  const result = analyzeJobDescription(sampleText);
  assert.strictEqual(result.experience.minYears, 0);
  assert.strictEqual(result.experience.maxYears, 1);
  assert.strictEqual(result.experience.levelTag, 'Entry / Junior');
  assert(result.skills.flatList.includes('Vue.js'), 'Should find Vue.js');
  assert(result.skills.flatList.includes('Git'), 'Should find Git');
});

// Test 3: Custom user skills matching
runTest('Matches custom user defined target skills', () => {
  const sampleText = `
    Role: Backend Developer. Required: Python, Django, GraphQL, microservices, and Snowflake.
  `;

  const result = analyzeJobDescription(sampleText, ['Snowflake', 'Microservices', 'GraphQL', 'Kafka']);
  
  assert.strictEqual(result.skills.customMatches.length, 3); // Snowflake, Microservices, GraphQL matched
  const names = result.skills.customMatches.map(m => m.name);
  assert(names.includes('Snowflake'));
  assert(names.includes('Microservices'));
  assert(names.includes('GraphQL'));
});

// Test 4: Handles edge case empty or null input
runTest('Handles empty or invalid input gracefully without crashing', () => {
  const resultNull = analyzeJobDescription(null);
  assert.strictEqual(resultNull.experience.summary, 'Not Specified');
  assert.strictEqual(resultNull.skills.totalUniqueCount, 0);

  const resultEmpty = analyzeJobDescription('');
  assert.strictEqual(resultEmpty.experience.summary, 'Not Specified');
});

console.log(`\n📊 Test Results: ${passedTests}/${totalTests} Passed.`);
if (passedTests !== totalTests) {
  process.exit(1);
}
