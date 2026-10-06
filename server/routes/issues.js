import express from 'express';
import { 
  getIssues, 
  getIssueById, 
  getIssuesByReporterId, 
  createIssue, 
  updateIssue, 
  deleteIssue 
} from '../utils/db.js';
import { calculatePriority } from '../utils/priorityEngine.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/issues
 * Returns issues: students get only their own, admins get all
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const allIssues = await getIssues();

    let userIssues = [];
    if (req.user.role === 'admin') {
      userIssues = allIssues;
    } else {
      // Student: filter by reporterId or reporterEmail
      userIssues = allIssues.filter(
        i => i.reporterId === req.user.id || (i.reporterEmail && i.reporterEmail.toLowerCase() === req.user.email.toLowerCase())
      );
    }

    // Optional query parameter filtering
    const { status, priority, category, building, search } = req.query;

    let filtered = userIssues;

    if (status && status !== 'All') {
      filtered = filtered.filter(i => i.status === status);
    }
    if (priority && priority !== 'All') {
      filtered = filtered.filter(i => i.priority === priority);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(i => i.category === category);
    }
    if (building && building !== 'All') {
      filtered = filtered.filter(i => i.building === building);
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        i =>
          (i.id && i.id.toLowerCase().includes(s)) ||
          (i.title && i.title.toLowerCase().includes(s)) ||
          (i.building && i.building.toLowerCase().includes(s)) ||
          (i.location && i.location.toLowerCase().includes(s)) ||
          (i.reporterName && i.reporterName.toLowerCase().includes(s))
      );
    }

    return res.json({
      success: true,
      count: filtered.length,
      totalCount: userIssues.length,
      issues: filtered,
    });
  } catch (err) {
    console.error('[GET ISSUES ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve issues.',
    });
  }
});

/**
 * GET /api/issues/:id
 * Retrieve single issue by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const issue = await getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID ${req.params.id} was not found.`,
      });
    }

    // Authorization: Admin can view any, student can only view their own
    if (
      req.user.role !== 'admin' &&
      issue.reporterId !== req.user.id &&
      issue.reporterEmail?.toLowerCase() !== req.user.email?.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view tickets submitted by your account.',
      });
    }

    return res.json({
      success: true,
      issue,
    });
  } catch (err) {
    console.error('[GET ISSUE BY ID ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve issue details.',
    });
  }
});

/**
 * POST /api/issues
 * Report a new issue (automatically calculates priority and generates issue ID)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, category, building, floor, location, image, assignedDepartment } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Issue title is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Issue description is required.' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }
    if (!building) {
      return res.status(400).json({ success: false, message: 'Building/Location is required.' });
    }

    // Deterministic priority calculation on backend
    const priorityResult = calculatePriority(category, title, description);

    const newIssue = await createIssue({
      title,
      description,
      category,
      priority: priorityResult.priority,
      priorityReason: priorityResult.reason,
      building,
      floor: floor || 'Ground Floor',
      location: location || '',
      reporterId: req.user.id,
      reporterName: req.user.name,
      reporterEmail: req.user.email,
      image: image || null,
      assignedDepartment: assignedDepartment || 'Estate & Maintenance Office',
    });

    return res.status(201).json({
      success: true,
      message: `Issue logged successfully with ticket ID ${newIssue.id}.`,
      issue: newIssue,
    });
  } catch (err) {
    console.error('[CREATE ISSUE ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create issue report.',
    });
  }
});

/**
 * PUT /api/issues/:id
 * Admin updates issue status, department assignment, or resolution notes
 */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, resolutionNotes, assignedDepartment } = req.body;

    const existing = await getIssueById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Issue ${req.params.id} does not exist.`,
      });
    }

    // Allowed statuses
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await updateIssue(req.params.id, {
      status,
      resolutionNotes,
      assignedDepartment,
    });

    return res.json({
      success: true,
      message: `Issue ${req.params.id} updated successfully.`,
      issue: updated,
    });
  } catch (err) {
    console.error('[UPDATE ISSUE ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update issue.',
    });
  }
});

/**
 * DELETE /api/issues/:id
 * Admin deletes an issue
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteIssue(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Issue ${req.params.id} not found.`,
      });
    }

    return res.json({
      success: true,
      message: `Issue ${req.params.id} successfully removed.`,
    });
  } catch (err) {
    console.error('[DELETE ISSUE ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete issue.',
    });
  }
});

export default router;
