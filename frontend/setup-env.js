import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# API Configuration
VITE_API_URL=https://school-backend-1ops.onrender.com

# Development API URL (for local development)
VITE_DEV_API_URL=http://localhost:3001

# App Configuration
VITE_APP_NAME=School Management System
VITE_APP_VERSION=1.0.0
`;

const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Frontend environment file created successfully!');
    console.log('📝 API URL configured for production and development');
  } else {
    console.log('⚠️  Frontend .env file already exists');
  }
} catch (error) {
  console.error('❌ Error creating frontend environment file:', error.message);
} 