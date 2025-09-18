#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Ko Chatbot...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`⏳ ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ Failed to ${description.toLowerCase()}`, 'red');
    process.exit(1);
  }
}

// Check if .env.local exists
function setupEnvironment() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('📝 Created .env.local from template', 'yellow');
      log('⚠️  Please edit .env.local with your API keys and Google OAuth credentials', 'yellow');
    } else {
      log('❌ env.example not found', 'red');
    }
  } else {
    log('✅ .env.local already exists', 'green');
  }
}

// Main setup process
async function setup() {
  try {
    log('Ko Chatbot Setup Script', 'bold');
    log('========================\n', 'bold');
    
    // Install dependencies
    runCommand('npm install', 'Installing dependencies');
    
    // Setup environment
    setupEnvironment();
    
    // Setup database
    runCommand('npx prisma generate', 'Generating Prisma client');
    runCommand('npx prisma db push', 'Setting up database');
    
    log('\n🎉 Setup completed successfully!', 'green');
    log('\n📋 Next steps:', 'bold');
    log('1. Edit .env.local with your API keys', 'yellow');
    log('2. Set up Google OAuth credentials', 'yellow');
    log('3. Run: npm run dev', 'yellow');
    log('4. Open: http://localhost:3000\n', 'yellow');
    
    log('🔗 Need help?', 'bold');
    log('- Google OAuth: https://console.cloud.google.com/', 'blue');
    log('- OpenAI API: https://platform.openai.com/', 'blue');
    log('- Anthropic API: https://console.anthropic.com/', 'blue');
    log('- Google AI API: https://makersuite.google.com/', 'blue');
    log('- Perplexity API: https://www.perplexity.ai/settings/api\n', 'blue');
    
  } catch (error) {
    log('❌ Setup failed', 'red');
    console.error(error);
    process.exit(1);
  }
}

setup();
