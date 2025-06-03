import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { eiarApplications, eiarDocuments, eiarReviews } from '@shared/schema';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { eq, desc } from 'drizzle-orm';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    isAdmin: boolean;
  };
}

const router = Router();

// Create a new EIAR application
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const applicationId = `EIAR-${nanoid(8)}`;
    const { applicantType } = req.body;

    // Calculate fees based on applicant type
    const applicationFee = applicantType === 'INDIVIDUAL' ? 150000 : 300000;
    const adminFee = 10000;
    const totalFee = applicationFee + adminFee;

    const [application] = await db
      .insert(eiarApplications)
      .values({
        ...req.body,
        applicationId,
        applicantId: authReq.user.id,
        applicationFee,
        adminFee,
        totalFee,
        status: 'DRAFT',
      })
      .returning();

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating EIAR application:', error);
    res.status(500).json({ error: 'Failed to create EIAR application' });
  }
});

// Get all EIAR applications for the authenticated user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const applications = await db
      .select()
      .from(eiarApplications)
      .where(eq(eiarApplications.applicantId, authReq.user.id))
      .orderBy(desc(eiarApplications.createdAt));

    res.json(applications);
  } catch (error) {
    console.error('Error fetching EIAR applications:', error);
    res.status(500).json({ error: 'Failed to fetch EIAR applications' });
  }
});

// Get a specific EIAR application
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const [application] = await db
      .select()
      .from(eiarApplications)
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'EIAR application not found' });
    }

    if (application.applicantId !== authReq.user.id && !authReq.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this application' });
    }

    // Get associated documents
    const documents = await db
      .select()
      .from(eiarDocuments)
      .where(eq(eiarDocuments.applicationId, application.id));

    // Get review history if user is admin
    let reviews = [];
    if (authReq.user.isAdmin) {
      reviews = await db
        .select()
        .from(eiarReviews)
        .where(eq(eiarReviews.applicationId, application.id))
        .orderBy(desc(eiarReviews.createdAt));
    }

    res.json({ ...application, documents, reviews });
  } catch (error) {
    console.error('Error fetching EIAR application:', error);
    res.status(500).json({ error: 'Failed to fetch EIAR application' });
  }
});

// Update an EIAR application
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const [application] = await db
      .select()
      .from(eiarApplications)
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'EIAR application not found' });
    }

    if (application.applicantId !== authReq.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    if (application.status !== 'DRAFT' && application.status !== 'REVISION_REQUIRED') {
      return res.status(400).json({ error: 'Application cannot be updated in its current state' });
    }

    const [updated] = await db
      .update(eiarApplications)
      .set({
        ...req.body,
        updatedAt: new Date(),
        version: application.version + 1,
      })
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error updating EIAR application:', error);
    res.status(500).json({ error: 'Failed to update EIAR application' });
  }
});

// Submit an EIAR application
router.post('/:id/submit', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const [application] = await db
      .select()
      .from(eiarApplications)
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'EIAR application not found' });
    }

    if (application.applicantId !== authReq.user.id) {
      return res.status(403).json({ error: 'Not authorized to submit this application' });
    }

    if (application.status !== 'DRAFT' && application.status !== 'REVISION_REQUIRED') {
      return res.status(400).json({ error: 'Application cannot be submitted in its current state' });
    }

    if (application.paymentStatus !== 'PAID') {
      return res.status(400).json({ error: 'Application fee must be paid before submission' });
    }

    const [updated] = await db
      .update(eiarApplications)
      .set({
        status: 'SUBMITTED',
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error('Error submitting EIAR application:', error);
    res.status(500).json({ error: 'Failed to submit EIAR application' });
  }
});

// Upload documents for an EIAR application
router.post('/:id/documents', authenticateToken, upload.array('documents'), async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const [application] = await db
      .select()
      .from(eiarApplications)
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'EIAR application not found' });
    }

    if (application.applicantId !== authReq.user.id) {
      return res.status(403).json({ error: 'Not authorized to upload documents for this application' });
    }

    if (application.status !== 'DRAFT' && application.status !== 'REVISION_REQUIRED') {
      return res.status(400).json({ error: 'Documents cannot be uploaded in the current state' });
    }

    const files = req.files as Express.Multer.File[];
    const documents = files.map(file => ({
      applicationId: application.id,
      documentType: req.body.documentType,
      fileName: file.originalname,
      fileUrl: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
    }));

    const inserted = await db
      .insert(eiarDocuments)
      .values(documents)
      .returning();

    res.status(201).json(inserted);
  } catch (error) {
    console.error('Error uploading EIAR documents:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
});

// Admin routes
// Get all EIAR applications (admin only)
router.get('/admin/all', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    const applications = await db
      .select()
      .from(eiarApplications)
      .orderBy(desc(eiarApplications.createdAt));

    res.json(applications);
  } catch (error) {
    console.error('Error fetching all EIAR applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status (admin only)
router.put('/:id/status', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    const { status, comments } = req.body;
    const [application] = await db
      .select()
      .from(eiarApplications)
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'EIAR application not found' });
    }

    const [updated] = await db
      .update(eiarApplications)
      .set({
        status,
        updatedAt: new Date(),
        ...(status === 'REJECTED' && { rejectedAt: new Date(), rejectionReason: comments }),
        ...(status === 'APPROVED' && { approvedAt: new Date() }),
      })
      .where(eq(eiarApplications.id, parseInt(req.params.id)))
      .returning();

    // Create review record
    await db.insert(eiarReviews).values({
      applicationId: application.id,
      reviewerId: authReq.user.id,
      reviewStage: application.status,
      comments: { status, comments },
      status,
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating EIAR application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router; 