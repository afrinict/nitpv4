import { pgTable, text, serial, integer, boolean, timestamp, json, pgEnum, numeric, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
// Define enums with proper typing
const membershipTypes = ['INDIVIDUAL', 'CORPORATE'];
const membershipStatuses = ['PENDING', 'ACTIVE', 'EXPIRED', 'SUSPENDED'];
const roles = ['MEMBER', 'ADMINISTRATOR', 'FINANCIAL_ADMINISTRATOR', 'FINANCIAL_OFFICER', 'FINANCIAL_AUDITOR', 'ETHICS_OFFICER'];
const paymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
const eiarApplicationStatuses = [
    'DRAFT',
    'SUBMITTED',
    'INITIAL_REVIEW',
    'TECHNICAL_REVIEW',
    'ETHICS_REVIEW',
    'REVISION_REQUIRED',
    'APPROVED',
    'REJECTED'
];
const projectSectors = [
    'RESIDENTIAL',
    'COMMERCIAL',
    'INDUSTRIAL',
    'INFRASTRUCTURE',
    'INSTITUTIONAL',
    'AGRICULTURAL',
    'RECREATIONAL'
];
const impactSignificances = [
    'NEGLIGIBLE',
    'MINOR',
    'MODERATE',
    'MAJOR',
    'SEVERE'
];
// Enums
export const membershipTypeEnum = pgEnum('membership_type', membershipTypes);
export const membershipStatusEnum = pgEnum('membership_status', membershipStatuses);
export const roleEnum = pgEnum('role', roles);
export const applicationTypeEnum = pgEnum('application_type', ['SAR', 'EIAR']);
export const applicantTypeEnum = pgEnum('applicant_type', ['INDIVIDUAL', 'CORPORATE']);
export const applicationStatusEnum = pgEnum('application_status', ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING', 'COMPLETED']);
export const complaintStatusEnum = pgEnum('complaint_status', ['RECEIVED', 'INVESTIGATING', 'RESOLVED', 'CLOSED']);
export const electionStatusEnum = pgEnum('election_status', ['SETUP', 'NOMINATIONS', 'VOTING', 'CLOSED']);
export const transactionTypeEnum = pgEnum('transaction_type', ['SUBSCRIPTION', 'APPLICATION_FEE', 'CREDIT_PURCHASE', 'OTHER']);
// SAR Application Types
export const projectTypeEnum = {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    INDUSTRIAL: 'INDUSTRIAL',
    MIXED_USE: 'MIXED_USE',
    INFRASTRUCTURE: 'INFRASTRUCTURE',
    INSTITUTIONAL: 'INSTITUTIONAL',
    AGRICULTURAL: 'AGRICULTURAL',
    RECREATIONAL: 'RECREATIONAL',
    OTHER: 'OTHER'
};
export const sarApplicationStatusEnum = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    WITHDRAWN: 'WITHDRAWN'
};
export const paymentStatusEnum = pgEnum('payment_status', paymentStatuses);
// EIAR Application Types
export const eiarApplicationStatusEnum = pgEnum('eiar_application_status', eiarApplicationStatuses);
export const projectSectorEnum = pgEnum('project_sector', projectSectors);
export const impactSignificanceEnum = pgEnum('impact_significance', impactSignificances);
// Users table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').default('MEMBER').notNull(),
    membershipId: text('membership_id').unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastLogin: timestamp('last_login'),
    isVerified: boolean('is_verified').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    verificationToken: text('verification_token'),
    resetToken: text('reset_token'),
    resetTokenExpiry: timestamp('reset_token_expiry'),
});
// Members table
export const members = pgTable('members', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name'),
    lastName: text('last_name').notNull(),
    gender: text('gender'),
    dateOfBirth: timestamp('date_of_birth'),
    nationality: text('nationality'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    postalCode: text('postal_code'),
    phoneNumber: text('phone_number'),
    alternatePhone: text('alternate_phone'),
    type: membershipTypeEnum('type').notNull(),
    status: membershipStatusEnum('status').default('PENDING').notNull(),
    profilePicture: text('profile_picture'),
    bio: text('bio'),
    credits: integer('credits').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Education qualifications
export const educationQualifications = pgTable('education_qualifications', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    institution: text('institution').notNull(),
    degree: text('degree').notNull(),
    field: text('field').notNull(),
    startYear: integer('start_year').notNull(),
    endYear: integer('end_year'),
    certificateUrl: text('certificate_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Professional qualifications
export const professionalQualifications = pgTable('professional_qualifications', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    organization: text('organization').notNull(),
    qualification: text('qualification').notNull(),
    registrationNumber: text('registration_number'),
    year: integer('year').notNull(),
    certificateUrl: text('certificate_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Employment history
export const employmentHistory = pgTable('employment_history', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    employer: text('employer').notNull(),
    position: text('position').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    responsibilities: text('responsibilities'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Subscriptions
export const subscriptions = pgTable('subscriptions', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    type: membershipTypeEnum('type').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    paymentId: integer('payment_id'),
    transactionReference: text('transaction_reference'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Site Analysis Report (SAR) and Ecological Impact Assessment Report (EIAR) applications
export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    applicationType: applicationTypeEnum('application_type').notNull(),
    applicantType: applicantTypeEnum('applicant_type').notNull(),
    status: applicationStatusEnum('status').default('DRAFT').notNull(),
    projectTitle: text('project_title').notNull(),
    siteAddress: text('site_address').notNull(),
    coordinates: text('coordinates'),
    plotNumber: text('plot_number'),
    projectDescription: text('project_description'),
    proponentInfo: json('proponent_info'),
    certificateNumber: text('certificate_number'),
    certificateUrl: text('certificate_url'),
    amount: numeric('amount', { precision: 10, scale: 2 }),
    paymentId: integer('payment_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Application documents
export const applicationDocuments = pgTable('application_documents', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull(),
    documentType: text('document_type').notNull(),
    documentUrl: text('document_url').notNull(),
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
// E-Learning courses
export const courses = pgTable('courses', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    thumbnail: text('thumbnail'),
    instructor: text('instructor'),
    duration: integer('duration'),
    modules: integer('modules').notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Course enrollments
export const enrollments = pgTable('enrollments', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    progress: integer('progress').default(0).notNull(),
    completedModules: integer('completed_modules').default(0).notNull(),
    startDate: timestamp('start_date').defaultNow().notNull(),
    completionDate: timestamp('completion_date'),
    certificateUrl: text('certificate_url'),
});
// Professional tools
export const tools = pgTable('tools', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    thumbnail: text('thumbnail'),
    creditCost: integer('credit_cost').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Tool usage records
export const toolUsage = pgTable('tool_usage', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    toolId: integer('tool_id').references(() => tools.id, { onDelete: 'cascade' }).notNull(),
    creditsUsed: integer('credits_used').notNull(),
    startTime: timestamp('start_time').defaultNow().notNull(),
    endTime: timestamp('end_time'),
});
// Chat rooms
export const chatRooms = pgTable('chat_rooms', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    isPrivate: boolean('is_private').default(false).notNull(),
    createdBy: integer('created_by').references(() => members.id),
    isApproved: boolean('is_approved').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Chat messages
export const chatMessages = pgTable('chat_messages', {
    id: serial('id').primaryKey(),
    roomId: integer('room_id').references(() => chatRooms.id, { onDelete: 'cascade' }).notNull(),
    senderId: integer('sender_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    message: text('message').notNull(),
    attachmentUrl: text('attachment_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Room participants
export const roomParticipants = pgTable('room_participants', {
    id: serial('id').primaryKey(),
    roomId: integer('room_id').references(() => chatRooms.id, { onDelete: 'cascade' }).notNull(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
});
// Direct messages
export const directMessages = pgTable('direct_messages', {
    id: serial('id').primaryKey(),
    senderId: integer('sender_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    receiverId: integer('receiver_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    message: text('message').notNull(),
    attachmentUrl: text('attachment_url'),
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Member connections (social network)
export const connections = pgTable('connections', {
    id: serial('id').primaryKey(),
    requesterId: integer('requester_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    receiverId: integer('receiver_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    status: text('status').notNull().default('PENDING'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Social posts
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    content: text('content').notNull(),
    attachmentUrl: text('attachment_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Post interactions
export const postInteractions = pgTable('post_interactions', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    type: text('type').notNull(), // LIKE, COMMENT, SHARE
    content: text('content'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
// Interest groups
export const groups = pgTable('groups', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description').notNull(),
    createdBy: integer('created_by').references(() => members.id, { onDelete: 'set null' }),
    thumbnail: text('thumbnail'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Group members
export const groupMembers = pgTable('group_members', {
    id: serial('id').primaryKey(),
    groupId: integer('group_id').references(() => groups.id, { onDelete: 'cascade' }).notNull(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    role: text('role').default('MEMBER').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
});
// Elections
export const elections = pgTable('elections', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    status: electionStatusEnum('status').default('SETUP').notNull(),
    createdBy: integer('created_by').references(() => members.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Election positions
export const electionPositions = pgTable('election_positions', {
    id: serial('id').primaryKey(),
    electionId: integer('election_id').references(() => elections.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    maxCandidates: integer('max_candidates').default(0),
});
// Election candidates
export const electionCandidates = pgTable('election_candidates', {
    id: serial('id').primaryKey(),
    electionId: integer('election_id').references(() => elections.id, { onDelete: 'cascade' }).notNull(),
    positionId: integer('position_id').references(() => electionPositions.id, { onDelete: 'cascade' }).notNull(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    bio: text('bio'),
    manifesto: text('manifesto'),
    approvedAt: timestamp('approved_at'),
    approvedBy: integer('approved_by').references(() => members.id, { onDelete: 'set null' }),
});
// Election votes
export const electionVotes = pgTable('election_votes', {
    id: serial('id').primaryKey(),
    electionId: integer('election_id').references(() => elections.id, { onDelete: 'cascade' }).notNull(),
    positionId: integer('position_id').references(() => electionPositions.id, { onDelete: 'cascade' }).notNull(),
    candidateId: integer('candidate_id').references(() => electionCandidates.id, { onDelete: 'cascade' }).notNull(),
    voterId: integer('voter_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    votedAt: timestamp('voted_at').defaultNow().notNull(),
    ipAddress: text('ip_address'),
});
// Ethics complaints
export const complaints = pgTable('complaints', {
    id: serial('id').primaryKey(),
    subject: text('subject').notNull(),
    details: text('details').notNull(),
    complainantName: text('complainant_name'),
    complainantEmail: text('complainant_email'),
    respondentId: integer('respondent_id').references(() => members.id),
    status: complaintStatusEnum('status').default('RECEIVED').notNull(),
    assignedTo: integer('assigned_to').references(() => members.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Complaint attachments
export const complaintAttachments = pgTable('complaint_attachments', {
    id: serial('id').primaryKey(),
    complaintId: integer('complaint_id').references(() => complaints.id, { onDelete: 'cascade' }).notNull(),
    fileUrl: text('file_url').notNull(),
    fileName: text('file_name').notNull(),
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
// Complaint sanctions
export const sanctions = pgTable('sanctions', {
    id: serial('id').primaryKey(),
    complaintId: integer('complaint_id').references(() => complaints.id, { onDelete: 'cascade' }).notNull(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    sanctionType: text('sanction_type').notNull(),
    description: text('description').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    amount: numeric('amount', { precision: 10, scale: 2 }),
    issuedBy: integer('issued_by').references(() => members.id, { onDelete: 'set null' }).notNull(),
    issuedAt: timestamp('issued_at').defaultNow().notNull(),
});
// Sanction appeals
export const appeals = pgTable('appeals', {
    id: serial('id').primaryKey(),
    sanctionId: integer('sanction_id').references(() => sanctions.id, { onDelete: 'cascade' }).notNull(),
    reason: text('reason').notNull(),
    status: text('status').default('PENDING').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
    resolvedAt: timestamp('resolved_at'),
    resolvedBy: integer('resolved_by').references(() => members.id, { onDelete: 'set null' }),
});
// Transactions (for financial management)
export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').references(() => members.id),
    type: transactionTypeEnum('type').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    reference: text('reference').unique(),
    status: text('status').notNull(),
    description: text('description'),
    metadata: json('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Announcements
export const announcements = pgTable('announcements', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    category: text('category').notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at'),
    expiresAt: timestamp('expires_at'),
    createdBy: integer('created_by').references(() => members.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Events
export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    location: text('location'),
    isVirtual: boolean('is_virtual').default(false).notNull(),
    meetingLink: text('meeting_link'),
    thumbnail: text('thumbnail'),
    createdBy: integer('created_by').references(() => members.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Event registrations
export const eventRegistrations = pgTable('event_registrations', {
    id: serial('id').primaryKey(),
    eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
    memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
    registeredAt: timestamp('registered_at').defaultNow().notNull(),
    attendedAt: timestamp('attended_at'),
});
// News articles
export const news = pgTable('news', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    summary: text('summary'),
    category: text('category'),
    thumbnail: text('thumbnail'),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at'),
    authorId: integer('author_id').references(() => members.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// SAR Application Tables
export const sarApplications = pgTable('sar_applications', {
    id: serial('id').primaryKey(),
    applicantType: applicantTypeEnum('applicant_type').notNull(),
    memberId: integer('member_id').references(() => members.id),
    organizationName: text('organization_name'),
    contactPerson: text('contact_person'),
    contactPersonPosition: text('contact_person_position'),
    contactEmail: text('contact_email').notNull(),
    contactPhone: text('contact_phone').notNull(),
    projectTitle: text('project_title').notNull(),
    projectType: text('project_type').notNull(),
    projectTypeOther: text('project_type_other'),
    projectDescription: text('project_description').notNull(),
    proposedLandUse: text('proposed_land_use').notNull(),
    expectedStartDate: timestamp('expected_start_date').notNull(),
    estimatedDuration: integer('estimated_duration').notNull(), // in months
    siteAddress: text('site_address').notNull(),
    latitude: text('latitude').notNull(),
    longitude: text('longitude').notNull(),
    plotNumber: text('plot_number').notNull(),
    cadastralZone: text('cadastral_zone').notNull(),
    siteArea: numeric('site_area').notNull(), // in square meters
    existingLandUse: text('existing_land_use').notNull(),
    surroundingLandUses: text('surrounding_land_uses').notNull(),
    nearestLandmarks: text('nearest_landmarks').notNull(),
    topography: text('topography').notNull(),
    hydrology: text('hydrology').notNull(),
    geology: text('geology').notNull(),
    vegetation: text('vegetation').notNull(),
    existingInfrastructure: text('existing_infrastructure').notNull(),
    socioEconomicContext: text('socio_economic_context').notNull(),
    environmentalSensitivities: text('environmental_sensitivities').notNull(),
    status: applicationStatusEnum('status').notNull().default('DRAFT'),
    applicationFee: numeric('application_fee').notNull(),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('PENDING'),
    paymentId: text('payment_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});
export const sarApplicationDocuments = pgTable('sar_application_documents', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id').references(() => sarApplications.id).notNull(),
    documentType: text('document_type').notNull(),
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    fileSize: integer('file_size').notNull(),
    mimeType: text('mime_type').notNull(),
    uploadedAt: timestamp('uploaded_at').notNull().defaultNow()
});
// EIAR Applications
export const eiarApplications = pgTable('eiar_applications', {
    id: serial('id').primaryKey(),
    applicationId: text('application_id').notNull().unique(),
    applicantType: applicantTypeEnum('applicant_type').notNull(),
    applicantId: integer('applicant_id').notNull().references(() => users.id),
    organizationName: text('organization_name'),
    contactPerson: text('contact_person'),
    contactPersonTitle: text('contact_person_title'),
    contactEmail: text('contact_email').notNull(),
    contactPhone: text('contact_phone').notNull(),
    projectTitle: text('project_title').notNull(),
    projectSector: text('project_sector').notNull(),
    projectDescription: text('project_description').notNull(),
    proposedLandUse: text('proposed_land_use').notNull(),
    projectStartDate: date('project_start_date').notNull(),
    projectDuration: integer('project_duration').notNull(),
    eiaStudyScope: text('eia_study_scope'),
    siteAddress: text('site_address').notNull(),
    latitude: text('latitude').notNull(),
    longitude: text('longitude').notNull(),
    plotNumber: text('plot_number').notNull(),
    cadastralZone: text('cadastral_zone').notNull(),
    siteArea: numeric('site_area').notNull(),
    siteContext: text('site_context').notNull(),
    ecologicalLandmarks: text('ecological_landmarks').notNull(),
    physicalEnvironment: jsonb('physical_environment').notNull(),
    biologicalEnvironment: jsonb('biological_environment').notNull(),
    socioEconomicEnvironment: jsonb('socio_economic_environment').notNull(),
    projectAlternatives: text('project_alternatives').notNull(),
    potentialImpacts: jsonb('potential_impacts').notNull(),
    mitigationMeasures: jsonb('mitigation_measures').notNull(),
    monitoringPlan: jsonb('monitoring_plan').notNull(),
    managementPlan: text('management_plan').notNull(),
    emergencyResponsePlan: text('emergency_response_plan').notNull(),
    responsibleParties: jsonb('responsible_parties').notNull(),
    publicConsultation: jsonb('public_consultation').notNull(),
    declaration: boolean('declaration').notNull(),
    status: eiarApplicationStatusEnum('status').notNull().default('DRAFT'),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('PENDING'),
    applicationFee: numeric('application_fee').notNull(),
    adminFee: numeric('admin_fee').notNull(),
    totalFee: numeric('total_fee').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    submittedAt: timestamp('submitted_at'),
    approvedAt: timestamp('approved_at'),
    rejectedAt: timestamp('rejected_at'),
    rejectionReason: text('rejection_reason'),
    version: integer('version').notNull().default(1),
});
export const eiarDocuments = pgTable('eiar_documents', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id').notNull().references(() => eiarApplications.id),
    documentType: text('document_type').notNull(),
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    fileSize: integer('file_size').notNull(),
    mimeType: text('mime_type').notNull(),
    uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
export const eiarReviews = pgTable('eiar_reviews', {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id').notNull().references(() => eiarApplications.id),
    reviewerId: integer('reviewer_id').notNull().references(() => users.id),
    reviewStage: text('review_stage').notNull(),
    comments: jsonb('comments').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastLogin: true,
    isVerified: true,
    isActive: true,
    verificationToken: true,
    resetToken: true,
    resetTokenExpiry: true,
});
export const insertMemberSchema = createInsertSchema(members).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    credits: true,
    status: true
});
export const insertEducationSchema = createInsertSchema(educationQualifications).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
export const insertProfessionalSchema = createInsertSchema(professionalQualifications).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
export const insertEmploymentSchema = createInsertSchema(employmentHistory).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
export const insertApplicationSchema = createInsertSchema(applications).omit({
    id: true,
    status: true,
    certificateNumber: true,
    certificateUrl: true,
    createdAt: true,
    updatedAt: true
});
export const insertComplaintSchema = createInsertSchema(complaints).omit({
    id: true,
    status: true,
    assignedTo: true,
    createdAt: true,
    updatedAt: true
});
export const loginSchema = z.object({
    identifier: z.string().min(1, "Email, username, or membership ID is required"),
    password: z.string().min(1, "Password is required"),
});
