const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  location: { type: String, required: true },
  issueType: { 
    type: String, 
    required: true, 
    enum: ['Water Leakage', 'Energy Misuse', 'Waste Overflow', 'Other'] 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Solved'], 
    default: 'Pending' 
  },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reporterEmail: { type: String },
  adminNotes: { type: String },
  recommendation: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

issueSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
