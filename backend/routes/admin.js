const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, adminAuth);

// Get all issues with filters
router.get('/issues', async (req, res) => {
  try {
    const { status, issueType, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;
    
    const issues = await Issue.find(filter)
      .populate('reporterId', 'name email')
      .sort(sort);
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Update issue status
router.patch('/issues/:id', [
  body('status').optional().isIn(['Pending', 'In Progress', 'Solved']),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('adminNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { status, priority, adminNotes } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found.' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Sustainability analytics summary
router.get('/analytics', async (req, res) => {
  try {
    const issues = await Issue.find();
    
    const byType = {};
    const byStatus = { Pending: 0, 'In Progress': 0, Solved: 0 };
    const byLocation = {};
    
    issues.forEach(i => {
      byType[i.issueType] = (byType[i.issueType] || 0) + 1;
      byStatus[i.status]++;
      byLocation[i.location] = (byLocation[i.location] || 0) + 1;
    });
    
    const topLocations = Object.entries(byLocation)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ location: name, count }));
    
    res.json({
      total: issues.length,
      byType,
      byStatus,
      topLocations,
      solvedRate: issues.length ? ((byStatus.Solved / issues.length) * 100).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
