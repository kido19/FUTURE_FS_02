const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// GET all leads (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    console.log(`Fetched ${leads.length} leads.`);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST new lead (Public - from website form)
router.post('/', async (req, res) => {
  try {
    const { name, email, source } = req.body;
    console.log('Received new lead data:', req.body);
    const newLead = new Lead({ name, email, source });
    await newLead.save();
    console.log('Successfully saved new lead:', newLead._id);
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update lead status (Protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add note to lead (Protected)
router.post('/:id/notes', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    lead.notes.push({ text });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET generate sample leads (For testing purposes)
router.get('/seed', async (req, res) => {
  try {
    const count = await Lead.countDocuments();
    if (count === 0) {
      await Lead.insertMany([
        { name: 'John Doe', email: 'john@example.com', source: 'Website Contact Form', status: 'new' },
        { name: 'Alice Smith', email: 'alice@company.com', source: 'Landing Page', status: 'contacted', notes: [{ text: 'Emailed brochure.' }] },
        { name: 'Bob Jones', email: 'bob@marketing.com', source: 'Referral', status: 'converted', notes: [{ text: 'Signed contract.' }] },
      ]);
      return res.json({ message: 'Sample leads generated' });
    }
    res.json({ message: 'Leads already exist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
