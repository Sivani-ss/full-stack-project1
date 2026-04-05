const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Eco-friendly recommendations by issue type
const RECOMMENDATIONS = {
  'Water Leakage': 'Report to facilities immediately. Turn off nearby water sources if safe. Consider rainwater harvesting for campus sustainability.',
  'Energy Misuse': 'Promote LED lighting and smart sensors. Encourage turn-off-when-leaving policy. Consider solar panels for campus buildings.',
  'Waste Overflow': 'Increase recycling bins. Organize awareness campaigns. Implement composting for organic waste.',
  'Other': 'Document the issue with photos. Report to campus sustainability office. Encourage peer awareness.'
};

// Submit new issue (authenticated user)
router.post('/', auth, [
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('issueType').isIn(['Water Leakage', 'Energy Misuse', 'Waste Overflow', 'Other']),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { location, issueType, description } = req.body;
    const recommendation = RECOMMENDATIONS[issueType] || RECOMMENDATIONS['Other'];
    
    const issue = new Issue({
      location,
      issueType,
      description,
      reporterId: req.user._id,
      reporterEmail: req.user.email,
      recommendation
    });
    await issue.save();
    
    res.status(201).json({
      message: 'Issue reported successfully. Your report has been recorded.',
      issue: { id: issue._id, status: issue.status, recommendation }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Get my issues (authenticated user)
router.get('/my', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ reporterId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// Get single issue by ID (for tracking)
router.get('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found.' });
    if (issue.reporterId?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
