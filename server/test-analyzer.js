import aiAnalyzer from './services/aiAnalyzer.js';
import configurableAnalyzer from './services/aiAnalyzerConfigurable.js';

console.log('Testing Hardcoded Analysis System\n');
console.log('='*50);

// Test cases for text analysis
const testCases = [
  {
    type: 'text',
    content: 'Hello, this is a normal message.',
    expected: 'safe'
  },
  {
    type: 'text',
    content: 'URGENT! Your account has been suspended. Click here immediately to verify your identity.',
    expected: 'dangerous'
  },
  {
    type: 'text',
    content: 'Congratulations! You have won $1,000,000 in our lottery. Claim your prize now!',
    expected: 'dangerous'
  },
  {
    type: 'text',
    content: 'Your PayPa1 account needs verification. Update your password now.',
    expected: 'dangerous'
  },
  {
    type: 'text',
    content: 'Click here to see the latest news updates.',
    expected: 'suspicious'
  },
  {
    type: 'text',
    content: 'hello im hacker virus',
    expected: 'suspicious/dangerous'
  },
  {
    type: 'text',
    content: 'Transfer funds immediately or your account will be closed. This is your final notice!',
    expected: 'dangerous'
  },
  {
    type: 'url',
    content: 'https://bit.ly/suspicious-link',
    expected: 'suspicious'
  },
  {
    type: 'url',
    content: 'https://www.google.com',
    expected: 'safe'
  },
  {
    type: 'url',
    content: 'http://secure-paypal.phishing.tk',
    expected: 'suspicious'
  }
];

// Test with aiAnalyzer
console.log('\n### Testing aiAnalyzer (Main Service) ###\n');

async function runTests() {
  for (const testCase of testCases) {
    try {
      console.log(`\nTest: "${testCase.content.substring(0, 50)}..."`);
      console.log(`Type: ${testCase.type}`);
      console.log(`Expected: ${testCase.expected}`);
      
      const result = await aiAnalyzer.analyze(testCase.type, testCase.content);
      
      console.log(`Result: ${result.threatLevel} (${result.confidence}% confidence)`);
      console.log(`Source: ${result.source || 'hardcoded'}`);
      
      if (result.keywords && result.keywords.length > 0) {
        console.log(`Keywords found: ${result.keywords.slice(0, 5).join(', ')}`);
      }
      
      if (result.threats && result.threats.length > 0) {
        console.log(`Threats: ${result.threats.join(', ')}`);
      }
      
      if (result.scores) {
        console.log(`Scores:`, result.scores);
      }
      
      console.log('-'.repeat(50));
    } catch (error) {
      console.error(`Error testing: ${error.message}`);
    }
  }
  
  // Test with configurableAnalyzer
  console.log('\n### Testing configurableAnalyzer (Configurable Service) ###\n');
  
  for (const testCase of testCases.slice(0, 3)) { // Test first 3 cases
    try {
      console.log(`\nTest: "${testCase.content.substring(0, 50)}..."`);
      console.log(`Type: ${testCase.type}`);
      console.log(`Expected: ${testCase.expected}`);
      
      const result = await configurableAnalyzer.analyze(testCase.type, testCase.content);
      
      console.log(`Result: ${result.threatLevel} (${result.confidence}% confidence)`);
      console.log(`Source: ${result.source || 'fallback'}`);
      
      if (result.keywords && result.keywords.length > 0) {
        console.log(`Keywords found:`, result.keywords.slice(0, 3));
      }
      
      console.log('-'.repeat(50));
    } catch (error) {
      console.error(`Error testing: ${error.message}`);
    }
  }
  
  console.log('\n### Summary ###');
  console.log('All external API calls have been replaced with hardcoded analysis.');
  console.log('The system now uses comprehensive keyword matching and pattern detection.');
  console.log('No external dependencies on Hugging Face, Google Safe Browsing, or Gemini APIs.');
}

runTests().then(() => {
  console.log('\nTest completed!');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
