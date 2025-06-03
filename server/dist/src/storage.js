import { users, members, educationQualifications, professionalQualifications, employmentHistory, subscriptions, applications, applicationDocuments, courses, enrollments, tools, toolUsage, chatRooms, chatMessages, roomParticipants, directMessages, elections, electionPositions, electionCandidates, electionVotes, complaints, complaintAttachments, sanctions, appeals, transactions, announcements, events, eventRegistrations, news } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, desc, gte, lte, isNull, asc } from "drizzle-orm";
export class DatabaseStorage {
    // User management
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }
    async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user;
    }
    async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    }
    async getUserByIdentifier(identifier) {
        const [user] = await db.select().from(users).where(or(eq(users.email, identifier), eq(users.username, identifier), eq(users.membershipId, identifier)));
        return user;
    }
    async getUserByVerificationToken(token) {
        const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
        return user;
    }
    async getUserByResetToken(token) {
        const now = new Date();
        const [user] = await db.select().from(users).where(and(eq(users.resetToken, token), gte(users.resetTokenExpiry, now)));
        return user;
    }
    async createUser(user) {
        const [createdUser] = await db.insert(users).values(user).returning();
        return createdUser;
    }
    async updateUserLastLogin(userId) {
        await db.update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, userId));
    }
    async verifyUser(userId) {
        await db.update(users)
            .set({
            isVerified: true,
            verificationToken: null
        })
            .where(eq(users.id, userId));
    }
    async setPasswordResetToken(userId, token, expiry) {
        await db.update(users)
            .set({
            resetToken: token,
            resetTokenExpiry: expiry
        })
            .where(eq(users.id, userId));
    }
    async updatePassword(userId, password) {
        await db.update(users)
            .set({
            password,
            resetToken: null,
            resetTokenExpiry: null
        })
            .where(eq(users.id, userId));
    }
    // Member management
    async getMember(id) {
        const [member] = await db.select().from(members).where(eq(members.id, id));
        return member;
    }
    async getMemberByUserId(userId) {
        const [member] = await db.select().from(members).where(eq(members.userId, userId));
        return member;
    }
    async createMember(member) {
        const [createdMember] = await db.insert(members).values(member).returning();
        return createdMember;
    }
    async updateMember(id, data) {
        const [updatedMember] = await db.update(members)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(members.id, id))
            .returning();
        return updatedMember;
    }
    async updateMemberStatus(id, status) {
        await db.update(members)
            .set({
            status: status,
            updatedAt: new Date()
        })
            .where(eq(members.id, id));
    }
    async updateMemberCredits(id, credits) {
        await db.update(members)
            .set({
            credits,
            updatedAt: new Date()
        })
            .where(eq(members.id, id));
    }
    async addMemberCredits(id, creditsToAdd) {
        const [member] = await db.select({ credits: members.credits })
            .from(members)
            .where(eq(members.id, id));
        if (member) {
            const newCredits = member.credits + creditsToAdd;
            await this.updateMemberCredits(id, newCredits);
        }
    }
    async getMembers(search, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        let query = db.select({
            id: members.id,
            firstName: members.firstName,
            lastName: members.lastName,
            middleName: members.middleName,
            type: members.type,
            status: members.status,
            profilePicture: members.profilePicture,
            city: members.city,
            state: members.state
        }).from(members);
        if (search) {
            query = query.where(or(like(members.firstName, `%${search}%`), like(members.lastName, `%${search}%`), like(members.middleName, `%${search}%`)));
        }
        return await query.limit(limit).offset(offset);
    }
    // Education, Professional, and Employment
    async getEducationQualifications(memberId) {
        return await db.select()
            .from(educationQualifications)
            .where(eq(educationQualifications.memberId, memberId))
            .orderBy(desc(educationQualifications.startYear));
    }
    async getProfessionalQualifications(memberId) {
        return await db.select()
            .from(professionalQualifications)
            .where(eq(professionalQualifications.memberId, memberId))
            .orderBy(desc(professionalQualifications.year));
    }
    async getEmploymentHistory(memberId) {
        return await db.select()
            .from(employmentHistory)
            .where(eq(employmentHistory.memberId, memberId))
            .orderBy(desc(employmentHistory.startDate));
    }
    async addEducationQualification(education) {
        const [result] = await db.insert(educationQualifications)
            .values(education)
            .returning();
        return result;
    }
    async addProfessionalQualification(professional) {
        const [result] = await db.insert(professionalQualifications)
            .values(professional)
            .returning();
        return result;
    }
    async addEmploymentHistory(employment) {
        const [result] = await db.insert(employmentHistory)
            .values(employment)
            .returning();
        return result;
    }
    // Subscription management
    async getActiveSubscription(memberId) {
        const now = new Date();
        const [subscription] = await db.select()
            .from(subscriptions)
            .where(and(eq(subscriptions.memberId, memberId), lte(subscriptions.startDate, now), gte(subscriptions.endDate, now)))
            .orderBy(desc(subscriptions.endDate))
            .limit(1);
        return subscription;
    }
    async getSubscriptionHistory(memberId) {
        return await db.select()
            .from(subscriptions)
            .where(eq(subscriptions.memberId, memberId))
            .orderBy(desc(subscriptions.endDate));
    }
    async createSubscription(subscription) {
        const [result] = await db.insert(subscriptions)
            .values(subscription)
            .returning();
        return result;
    }
    // Application management
    async getApplication(id) {
        const [application] = await db.select()
            .from(applications)
            .where(eq(applications.id, id));
        return application;
    }
    async getMemberApplications(memberId) {
        return await db.select()
            .from(applications)
            .where(eq(applications.memberId, memberId))
            .orderBy(desc(applications.createdAt));
    }
    async createApplication(application) {
        const [result] = await db.insert(applications)
            .values(application)
            .returning();
        return result;
    }
    async updateApplication(id, data) {
        const [result] = await db.update(applications)
            .set({
            ...data,
            updatedAt: new Date()
        })
            .where(eq(applications.id, id))
            .returning();
        return result;
    }
    async updateApplicationStatus(id, status) {
        await db.update(applications)
            .set({
            status: status,
            updatedAt: new Date()
        })
            .where(eq(applications.id, id));
    }
    async updateApplicationCertificate(id, certificateNumber, certificateUrl) {
        await db.update(applications)
            .set({
            certificateNumber,
            certificateUrl,
            updatedAt: new Date()
        })
            .where(eq(applications.id, id));
    }
    async getApplicationDocuments(applicationId) {
        return await db.select()
            .from(applicationDocuments)
            .where(eq(applicationDocuments.applicationId, applicationId))
            .orderBy(desc(applicationDocuments.uploadedAt));
    }
    async addApplicationDocument(document) {
        const [result] = await db.insert(applicationDocuments)
            .values(document)
            .returning();
        return result;
    }
    // E-Learning
    async getCourses() {
        return await db.select()
            .from(courses)
            .where(eq(courses.isPublished, true))
            .orderBy(desc(courses.createdAt));
    }
    async getCourse(id) {
        const [course] = await db.select()
            .from(courses)
            .where(and(eq(courses.id, id), eq(courses.isPublished, true)));
        return course;
    }
    async getEnrollment(memberId, courseId) {
        const [enrollment] = await db.select()
            .from(enrollments)
            .where(and(eq(enrollments.memberId, memberId), eq(enrollments.courseId, courseId)));
        return enrollment;
    }
    async getEnrollmentById(id) {
        const [enrollment] = await db.select()
            .from(enrollments)
            .where(eq(enrollments.id, id));
        return enrollment;
    }
    async getMemberEnrollments(memberId) {
        return await db.select({
            enrollment: enrollments,
            course: courses
        })
            .from(enrollments)
            .innerJoin(courses, eq(enrollments.courseId, courses.id))
            .where(eq(enrollments.memberId, memberId))
            .orderBy(desc(enrollments.startDate));
    }
    async createEnrollment(enrollment) {
        const [result] = await db.insert(enrollments)
            .values(enrollment)
            .returning();
        return result;
    }
    async updateEnrollment(id, data) {
        const [result] = await db.update(enrollments)
            .set(data)
            .where(eq(enrollments.id, id))
            .returning();
        return result;
    }
    // Tools
    async getTools() {
        return await db.select()
            .from(tools)
            .where(eq(tools.isActive, true))
            .orderBy(asc(tools.name));
    }
    async getTool(id) {
        const [tool] = await db.select()
            .from(tools)
            .where(and(eq(tools.id, id), eq(tools.isActive, true)));
        return tool;
    }
    async recordToolUsage(usage) {
        const [result] = await db.insert(toolUsage)
            .values({
            ...usage,
            startTime: new Date()
        })
            .returning();
        return result;
    }
    // Chat and Social
    async getChatRooms() {
        return await db.select()
            .from(chatRooms)
            .where(eq(chatRooms.isApproved, true))
            .orderBy(desc(chatRooms.createdAt));
    }
    async getChatRoom(id) {
        const [room] = await db.select()
            .from(chatRooms)
            .where(eq(chatRooms.id, id));
        return room;
    }
    async createChatRoom(room) {
        const [result] = await db.insert(chatRooms)
            .values({
            ...room,
            createdAt: new Date()
        })
            .returning();
        return result;
    }
    async isRoomParticipant(roomId, memberId) {
        const [participant] = await db.select()
            .from(roomParticipants)
            .where(and(eq(roomParticipants.roomId, roomId), eq(roomParticipants.memberId, memberId)));
        return !!participant;
    }
    async getRoomMessages(roomId) {
        return await db.select({
            message: chatMessages,
            sender: {
                id: members.id,
                firstName: members.firstName,
                lastName: members.lastName,
                profilePicture: members.profilePicture
            }
        })
            .from(chatMessages)
            .innerJoin(members, eq(chatMessages.senderId, members.id))
            .where(eq(chatMessages.roomId, roomId))
            .orderBy(asc(chatMessages.createdAt));
    }
    async addRoomParticipant(participant) {
        const [result] = await db.insert(roomParticipants)
            .values({
            ...participant,
            joinedAt: new Date()
        })
            .returning();
        return result;
    }
    async createChatMessage(message) {
        const [result] = await db.insert(chatMessages)
            .values({
            ...message,
            createdAt: new Date()
        })
            .returning();
        // Get sender details
        const [sender] = await db.select({
            id: members.id,
            firstName: members.firstName,
            lastName: members.lastName,
            profilePicture: members.profilePicture
        })
            .from(members)
            .where(eq(members.id, message.senderId));
        return {
            message: result,
            sender
        };
    }
    async getDirectMessages(senderId, receiverId) {
        return await db.select({
            message: directMessages,
            sender: {
                id: members.id,
                firstName: members.firstName,
                lastName: members.lastName,
                profilePicture: members.profilePicture
            }
        })
            .from(directMessages)
            .innerJoin(members, eq(directMessages.senderId, members.id))
            .where(or(and(eq(directMessages.senderId, senderId), eq(directMessages.receiverId, receiverId)), and(eq(directMessages.senderId, receiverId), eq(directMessages.receiverId, senderId))))
            .orderBy(asc(directMessages.createdAt));
    }
    async createDirectMessage(message) {
        const [result] = await db.insert(directMessages)
            .values({
            ...message,
            isRead: false,
            createdAt: new Date()
        })
            .returning();
        // Get sender details
        const [sender] = await db.select({
            id: members.id,
            firstName: members.firstName,
            lastName: members.lastName,
            profilePicture: members.profilePicture
        })
            .from(members)
            .where(eq(members.id, message.senderId));
        return {
            message: result,
            sender
        };
    }
    async markDirectMessageAsRead(messageId) {
        await db.update(directMessages)
            .set({ isRead: true })
            .where(eq(directMessages.id, messageId));
    }
    async getRecentConversations(memberId) {
        // This is a complex query to get recent conversations
        // For each unique conversation partner, get the most recent message
        const messages = await db.select({
            message: directMessages,
            partner: members
        })
            .from(directMessages)
            .innerJoin(members, eq(or(eq(directMessages.senderId, memberId), eq(directMessages.receiverId, memberId)), members.id !== memberId ? members.id :
            or(eq(directMessages.senderId, members.id), eq(directMessages.receiverId, members.id))))
            .where(or(eq(directMessages.senderId, memberId), eq(directMessages.receiverId, memberId)))
            .orderBy(desc(directMessages.createdAt));
        // Group by conversation partner and take the most recent message
        const conversations = {};
        for (const item of messages) {
            const partnerId = item.partner.id;
            if (!conversations[partnerId]) {
                conversations[partnerId] = {
                    partner: item.partner,
                    lastMessage: item.message
                };
            }
        }
        return Object.values(conversations);
    }
    // Elections
    async getElections() {
        return await db.select()
            .from(elections)
            .orderBy(desc(elections.startDate));
    }
    async getElection(id) {
        const [election] = await db.select()
            .from(elections)
            .where(eq(elections.id, id));
        return election;
    }
    async getElectionPositions(electionId) {
        return await db.select()
            .from(electionPositions)
            .where(eq(electionPositions.electionId, electionId));
    }
    async getElectionPosition(id) {
        const [position] = await db.select()
            .from(electionPositions)
            .where(eq(electionPositions.id, id));
        return position;
    }
    async getPositionCandidates(positionId) {
        return await db.select({
            candidate: electionCandidates,
            member: {
                id: members.id,
                firstName: members.firstName,
                lastName: members.lastName,
                profilePicture: members.profilePicture
            }
        })
            .from(electionCandidates)
            .innerJoin(members, eq(electionCandidates.memberId, members.id))
            .where(eq(electionCandidates.positionId, positionId));
    }
    async getCandidate(id) {
        const [candidate] = await db.select()
            .from(electionCandidates)
            .where(eq(electionCandidates.id, id));
        return candidate;
    }
    async getCandidateByMember(electionId, positionId, memberId) {
        const [candidate] = await db.select()
            .from(electionCandidates)
            .where(and(eq(electionCandidates.electionId, electionId), eq(electionCandidates.positionId, positionId), eq(electionCandidates.memberId, memberId)));
        return candidate;
    }
    async createCandidate(candidate) {
        const [result] = await db.insert(electionCandidates)
            .values(candidate)
            .returning();
        return result;
    }
    async getVote(electionId, positionId, voterId) {
        const [vote] = await db.select()
            .from(electionVotes)
            .where(and(eq(electionVotes.electionId, electionId), eq(electionVotes.positionId, positionId), eq(electionVotes.voterId, voterId)));
        return vote;
    }
    async recordVote(vote) {
        const [result] = await db.insert(electionVotes)
            .values({
            ...vote,
            votedAt: new Date()
        })
            .returning();
        return result;
    }
    async getCandidateVotes(electionId, positionId, candidateId) {
        const result = await db.select({
            count: db.count()
        })
            .from(electionVotes)
            .where(and(eq(electionVotes.electionId, electionId), eq(electionVotes.positionId, positionId), eq(electionVotes.candidateId, candidateId)));
        return result[0]?.count || 0;
    }
    // Ethics
    async getComplaints() {
        return await db.select()
            .from(complaints)
            .orderBy(desc(complaints.createdAt));
    }
    async getComplaint(id) {
        const [complaint] = await db.select()
            .from(complaints)
            .where(eq(complaints.id, id));
        return complaint;
    }
    async createComplaint(complaint) {
        const [result] = await db.insert(complaints)
            .values({
            ...complaint,
            status: 'RECEIVED',
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .returning();
        return result;
    }
    async updateComplaintStatus(id, status) {
        await db.update(complaints)
            .set({
            status: status,
            updatedAt: new Date()
        })
            .where(eq(complaints.id, id));
    }
    async assignComplaint(id, ethicsOfficerId) {
        await db.update(complaints)
            .set({
            assignedTo: ethicsOfficerId,
            updatedAt: new Date()
        })
            .where(eq(complaints.id, id));
    }
    async getComplaintAttachments(complaintId) {
        return await db.select()
            .from(complaintAttachments)
            .where(eq(complaintAttachments.complaintId, complaintId))
            .orderBy(desc(complaintAttachments.uploadedAt));
    }
    async createSanction(sanction) {
        const [result] = await db.insert(sanctions)
            .values({
            ...sanction,
            issuedAt: new Date()
        })
            .returning();
        return result;
    }
    async getSanction(id) {
        const [sanction] = await db.select()
            .from(sanctions)
            .where(eq(sanctions.id, id));
        return sanction;
    }
    async createAppeal(appeal) {
        const [result] = await db.insert(appeals)
            .values({
            ...appeal,
            status: 'PENDING',
            submittedAt: new Date()
        })
            .returning();
        return result;
    }
    async getAppealBySanction(sanctionId) {
        const [appeal] = await db.select()
            .from(appeals)
            .where(eq(appeals.sanctionId, sanctionId));
        return appeal;
    }
    // Financial
    async createTransaction(transaction) {
        const [result] = await db.insert(transactions)
            .values({
            ...transaction,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .returning();
        return result;
    }
    async getTransactionByReference(reference) {
        const [transaction] = await db.select()
            .from(transactions)
            .where(eq(transactions.reference, reference));
        return transaction;
    }
    async updateTransaction(id, data) {
        const [result] = await db.update(transactions)
            .set({
            ...data,
            updatedAt: new Date()
        })
            .where(eq(transactions.id, id))
            .returning();
        return result;
    }
    // Content
    async getPublishedAnnouncements() {
        const now = new Date();
        return await db.select()
            .from(announcements)
            .where(and(eq(announcements.isPublished, true), or(isNull(announcements.expiresAt), gte(announcements.expiresAt, now))))
            .orderBy(desc(announcements.publishedAt))
            .limit(10);
    }
    async getUpcomingEvents() {
        const now = new Date();
        return await db.select()
            .from(events)
            .where(gte(events.startDate, now))
            .orderBy(asc(events.startDate))
            .limit(5);
    }
    async getPublishedNews() {
        return await db.select()
            .from(news)
            .where(eq(news.isPublished, true))
            .orderBy(desc(news.publishedAt))
            .limit(10);
    }
    async getNewsArticle(id) {
        const [article] = await db.select()
            .from(news)
            .where(and(eq(news.id, id), eq(news.isPublished, true)));
        return article;
    }
    async getEvent(id) {
        const [event] = await db.select()
            .from(events)
            .where(eq(events.id, id));
        return event;
    }
    async getEventRegistration(eventId, memberId) {
        const [registration] = await db.select()
            .from(eventRegistrations)
            .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.memberId, memberId)));
        return registration;
    }
    async registerForEvent(registration) {
        const [result] = await db.insert(eventRegistrations)
            .values({
            ...registration,
            registeredAt: new Date()
        })
            .returning();
        return result;
    }
}
export const storage = new DatabaseStorage();
