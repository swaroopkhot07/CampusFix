import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand, 
  PutCommand, 
  DeleteCommand 
} from '@aws-sdk/lib-dynamodb';
import { calculatePriority } from '../utils/priorityEngine.js';

export const TABLE_NAME = process.env.DYNAMODB_TABLE || process.env.DYNAMODB_ISSUES_TABLE || 'CampusFixIssues';
export const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1';

// Build DynamoDB client configuration
const clientConfig = { region: REGION };
if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const rawClient = new DynamoDBClient(clientConfig);
export const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

/**
 * Sanitizes image for DynamoDB storage.
 * - Base64 data URLs (data:image/...) are NOT stored in DynamoDB to avoid exceeding 400KB item limits.
 * - HTTP/HTTPS/S3 URLs are preserved directly.
 * - Prepared for future S3 implementation.
 * 
 * @param {string|null} image
 * @returns {string|null}
 */
export function sanitizeImageForStorage(image) {
  if (!image || typeof image !== 'string') return null;
  const trimmed = image.trim();
  
  // Valid remote URLs (e.g. S3 presigned / public URLs or HTTPS assets) are kept
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('s3://')) {
    return trimmed;
  }
  
  // Base64 payloads (data:image/... or raw base64 string) are stripped for DynamoDB
  if (trimmed.startsWith('data:') || trimmed.length > 2048) {
    return null;
  }
  
  return null;
}

/**
 * Normalizes an issue item to strictly preserve every field of the Issue data model:
 * - id and issueId
 * - title, description, category
 * - priority, priorityReason
 * - building, floor, location
 * - reporterId, reporterName, reporterEmail
 * - image
 * - status, assignedDepartment, resolutionNotes
 * - createdAt, updatedAt, activityLog
 * 
 * @param {object} item
 * @returns {object|null}
 */
export function normalizeIssueItem(item) {
  if (!item) return null;
  const id = item.issueId || item.id;
  return {
    id,
    issueId: id,
    title: item.title || '',
    description: item.description || '',
    category: item.category || 'Other',
    priority: item.priority || 'Medium',
    priorityReason: item.priorityReason || '',
    building: item.building || 'Campus',
    floor: item.floor || 'Ground Floor',
    location: item.location || '',
    reporterId: item.reporterId || '',
    reporterName: item.reporterName || '',
    reporterEmail: item.reporterEmail || '',
    image: item.image || null,
    status: item.status || 'Pending',
    assignedDepartment: item.assignedDepartment || 'Estate & Maintenance Office',
    resolutionNotes: item.resolutionNotes || '',
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    activityLog: Array.isArray(item.activityLog) ? item.activityLog : [],
  };
}

/**
 * Retrieves all issues from the DynamoDB CampusFixIssues table
 * @returns {Promise<Array<object>>}
 */
export async function getIssuesFromDynamo() {
  const items = [];
  let lastEvaluatedKey = undefined;

  do {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      ExclusiveStartKey: lastEvaluatedKey,
    });
    const response = await docClient.send(command);
    if (response.Items) {
      items.push(...response.Items);
    }
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  const normalized = items.map(normalizeIssueItem);
  // Sort descending by createdAt (newest first)
  return normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Retrieves a single issue by its partition key issueId
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getIssueByIdFromDynamo(id) {
  if (!id) return null;
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      issueId: id,
    },
  });
  const response = await docClient.send(command);
  return normalizeIssueItem(response.Item);
}

/**
 * Retrieves issues filtered by reporterId
 * @param {string} reporterId
 * @returns {Promise<Array<object>>}
 */
export async function getIssuesByReporterIdFromDynamo(reporterId) {
  const all = await getIssuesFromDynamo();
  return all.filter(i => i.reporterId === reporterId);
}

/**
 * Creates a new issue in the DynamoDB CampusFixIssues table
 * - Automatically computes priority & reason using the authoritative priority engine
 * - Sanitizes images (no Base64 in DynamoDB, compatible with future S3)
 * - Preserves all Issue data model fields
 * 
 * @param {object} issueData
 * @returns {Promise<object>}
 */
export async function createIssueInDynamo(issueData) {
  const currentYear = new Date().getFullYear();
  
  // Calculate next sequential number (CF-YYYY-XXX)
  let nextSeq = 1;
  try {
    const existing = await getIssuesFromDynamo();
    const maxSeq = existing.reduce((acc, curr) => {
      const targetId = curr.issueId || curr.id || '';
      if (targetId.startsWith('CF-')) {
        const parts = targetId.split('-');
        if (parts.length === 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num)) return Math.max(acc, num);
        }
      }
      return acc;
    }, 0);
    nextSeq = maxSeq + 1;
  } catch (err) {
    nextSeq = Math.floor(100 + (Date.now() % 900));
  }

  const newId = `CF-${currentYear}-${String(nextSeq).padStart(3, '0')}`;
  const now = new Date().toISOString();

  // Authoritative Priority Engine calculation
  const priorityResult = (issueData.priority && issueData.priorityReason)
    ? { priority: issueData.priority, reason: issueData.priorityReason }
    : calculatePriority(issueData.category, issueData.title, issueData.description);

  // S3-compatible image sanitization (no Base64 in DynamoDB)
  const sanitizedImage = sanitizeImageForStorage(issueData.image);

  const newIssue = {
    issueId: newId,                   // DynamoDB Partition Key
    id: newId,                        // Data model compatibility
    title: (issueData.title || '').trim(),
    description: (issueData.description || '').trim(),
    category: issueData.category || 'Other',
    priority: priorityResult.priority,
    priorityReason: priorityResult.reason,
    building: issueData.building || 'Campus',
    floor: issueData.floor || 'Ground Floor',
    location: (issueData.location || '').trim(),
    reporterId: issueData.reporterId || '',
    reporterName: issueData.reporterName || '',
    reporterEmail: issueData.reporterEmail || '',
    image: sanitizedImage,
    status: 'Pending',
    assignedDepartment: issueData.assignedDepartment || 'Estate & Maintenance Office',
    resolutionNotes: '',
    createdAt: now,
    updatedAt: now,
    activityLog: [
      {
        date: now,
        text: `Issue registered by ${issueData.reporterName} (${newId}) with priority ${priorityResult.priority}.`,
      },
    ],
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: newIssue,
  });

  await docClient.send(command);
  return newIssue;
}

/**
 * Updates an issue in the DynamoDB CampusFixIssues table
 * - Preserves existing fields, updates status, resolutionNotes, assignedDepartment
 * - Records status transition in activityLog
 * 
 * @param {string} id
 * @param {object} updateData
 * @returns {Promise<object|null>}
 */
export async function updateIssueInDynamo(id, updateData) {
  const current = await getIssueByIdFromDynamo(id);
  if (!current) return null;

  const now = new Date().toISOString();
  const newStatus = updateData.status || current.status;
  const statusChanged = newStatus !== current.status;

  const logEntries = [...(current.activityLog || [])];
  if (statusChanged) {
    logEntries.unshift({
      date: now,
      text: `Status changed from ${current.status} to ${newStatus}${updateData.resolutionNotes ? ` (Notes: "${updateData.resolutionNotes}")` : ''}`,
    });
  }

  const updated = {
    ...current,
    ...updateData,
    issueId: id,
    id: id,
    status: newStatus,
    updatedAt: now,
    activityLog: logEntries,
  };

  if ('image' in updateData) {
    updated.image = sanitizeImageForStorage(updateData.image);
  }

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: updated,
  });

  await docClient.send(command);
  return updated;
}

/**
 * Deletes an issue from the DynamoDB CampusFixIssues table
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function deleteIssueFromDynamo(id) {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      issueId: id,
    },
  });
  await docClient.send(command);
  return true;
}

/**
 * Migrates array of issues from JSON into the DynamoDB CampusFixIssues table
 * @param {Array<object>} jsonIssues
 * @returns {Promise<{ total: number, migrated: number }>}
 */
export async function migrateIssuesToDynamo(jsonIssues) {
  if (!Array.isArray(jsonIssues) || jsonIssues.length === 0) {
    return { total: 0, migrated: 0 };
  }

  let migrated = 0;
  for (const issue of jsonIssues) {
    const issueId = issue.id || issue.issueId;
    if (!issueId) continue;

    const existing = await getIssueByIdFromDynamo(issueId).catch(() => null);
    if (!existing) {
      const sanitized = {
        ...normalizeIssueItem(issue),
        issueId,
        id: issueId,
        image: sanitizeImageForStorage(issue.image),
      };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: sanitized,
      }));
      migrated++;
    }
  }

  return { total: jsonIssues.length, migrated };
}
