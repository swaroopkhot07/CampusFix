import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  TABLE_NAME, 
  REGION, 
  migrateIssuesToDynamo, 
  getIssuesFromDynamo 
} from '../services/dynamoDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  console.log(`====================================================`);
  console.log(`  CampusFix: JSON to DynamoDB Migration Tool`);
  console.log(`  Target Table : ${TABLE_NAME}`);
  console.log(`  AWS Region   : ${REGION}`);
  console.log(`  Partition Key: issueId`);
  console.log(`====================================================`);

  const issuesFilePath = path.resolve(__dirname, '../data/issues.json');

  try {
    const rawData = await fs.readFile(issuesFilePath, 'utf-8');
    const jsonIssues = JSON.parse(rawData);

    if (!Array.isArray(jsonIssues) || jsonIssues.length === 0) {
      console.log('No issues found in server/data/issues.json to migrate.');
      return;
    }

    console.log(`Read ${jsonIssues.length} issues from ${issuesFilePath}`);
    console.log(`Starting migration to Amazon DynamoDB table "${TABLE_NAME}"...`);

    const result = await migrateIssuesToDynamo(jsonIssues);
    console.log(`\nMigration completed successfully!`);
    console.log(`- Total issues processed: ${result.total}`);
    console.log(`- New issues migrated:   ${result.migrated}`);

    // Verify
    const currentTableIssues = await getIssuesFromDynamo();
    console.log(`- Current total issues in DynamoDB "${TABLE_NAME}": ${currentTableIssues.length}`);
  } catch (err) {
    console.error('Migration failed:', err.message);
    if (err.name === 'ResourceNotFoundException') {
      console.error(`\nHint: The DynamoDB table "${TABLE_NAME}" was not found in region "${REGION}".`);
      console.error(`Please create the table with partition key "issueId" (String).`);
    } else if (err.name === 'CredentialsProviderError' || err.name === 'UnrecognizedClientException') {
      console.error(`\nHint: AWS credentials are missing or invalid.`);
      console.error(`Ensure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION are set.`);
    }
    process.exit(1);
  }
}

runMigration();
