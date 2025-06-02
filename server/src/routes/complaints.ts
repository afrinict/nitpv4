import { Router } from 'express';
import { db } from '../db';
import { complaints, complaintStatusEnum } from '../schema';
import { desc, eq, sql } from 'drizzle-orm';

const router = Router();

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const allComplaints = await db.select().from(complaints).orderBy(desc(complaints.createdAt));
    res.json(allComplaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

// Get complaint statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await db.select({ count: sql<number>`count(*)` }).from(complaints);
    const received = await db.select({ count: sql<number>`count(*)` }).from(complaints).where(eq(complaints.status, complaintStatusEnum.RECEIVED));
    const investigating = await db.select({ count: sql<number>`count(*)` }).from(complaints).where(eq(complaints.status, complaintStatusEnum.INVESTIGATING));
    const resolved = await db.select({ count: sql<number>`count(*)` }).from(complaints).where(eq(complaints.status, complaintStatusEnum.RESOLVED));
    const closed = await db.select({ count: sql<number>`count(*)` }).from(complaints).where(eq(complaints.status, complaintStatusEnum.CLOSED));

    res.json({
      total: total[0].count,
      pending: received[0].count,
      underReview: investigating[0].count,
      resolved: resolved[0].count,
      dismissed: closed[0].count,
      byNature: {}, // TODO: Implement nature-based statistics
      byPriority: {
        low: 0,
        medium: 0,
        high: 0
      }
    });
  } catch (error) {
    console.error('Error fetching complaint statistics:', error);
    res.status(500).json({ message: 'Failed to fetch complaint statistics' });
  }
});

// Get a single complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await db.select().from(complaints).where(eq(complaints.id, parseInt(req.params.id)));
    if (!complaint.length) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint[0]);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Failed to fetch complaint' });
  }
});

// Create a new complaint
router.post('/', async (req, res) => {
  try {
    const newComplaint = await db.insert(complaints).values({
      subject: req.body.subject,
      details: req.body.details,
      complainantName: req.body.complainantName,
      complainantEmail: req.body.complainantEmail,
      status: complaintStatusEnum.RECEIVED
    }).returning();
    res.status(201).json(newComplaint[0]);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Failed to create complaint' });
  }
});

// Update a complaint
router.put('/:id', async (req, res) => {
  try {
    const updatedComplaint = await db.update(complaints)
      .set({
        subject: req.body.subject,
        details: req.body.details,
        status: req.body.status,
        assignedTo: req.body.assignedTo,
        updatedAt: new Date()
      })
      .where(eq(complaints.id, parseInt(req.params.id)))
      .returning();
    
    if (!updatedComplaint.length) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(updatedComplaint[0]);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Failed to update complaint' });
  }
});

// Delete a complaint
router.delete('/:id', async (req, res) => {
  try {
    const deletedComplaint = await db.delete(complaints)
      .where(eq(complaints.id, parseInt(req.params.id)))
      .returning();
    
    if (!deletedComplaint.length) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Failed to delete complaint' });
  }
});

export default router; 