import { 
  users, members, educationQualifications, professionalQualifications, employmentHistory,
  subscriptions, applications, applicationDocuments, courses, enrollments, tools, toolUsage,
  chatRooms, chatMessages, roomParticipants, directMessages, connections, posts, postInteractions,
  groups, elections, electionPositions, electionCandidates, electionVotes, complaints, complaintAttachments,
  sanctions, appeals, transactions, announcements, events, eventRegistrations, news, type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, desc, gte, lte, isNull, asc } from "drizzle-orm";
import { MemberProfile } from "@shared/types";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByIdentifier(identifier: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(userId: number): Promise<void>;
  verifyUser(userId: number): Promise<void>;
  setPasswordResetToken(userId: number, token: string, expiry: Date): Promise<void>;
  updatePassword(userId: number, password: string): Promise<void>;
  
  // Member management
  getMember(id: number): Promise<any | undefined>;
  getMemberByUserId(userId: number): Promise<any | undefined>;
  createMember(member: any): Promise<any>;
  updateMember(id: number, data: any): Promise<any>;
  updateMemberStatus(id: number, status: string): Promise<void>;
  updateMemberCredits(id: number, credits: number): Promise<void>;
  addMemberCredits(id: number, credits: number): Promise<void>;
  getMembers(search?: string, page?: number, limit?: number): Promise<any[]>;
  
  // Education, Professional, and Employment
  getEducationQualifications(memberId: number): Promise<any[]>;
  getProfessionalQualifications(memberId: number): Promise<any[]>;
  getEmploymentHistory(memberId: number): Promise<any[]>;
  addEducationQualification(education: any): Promise<any>;
  addProfessionalQualification(professional: any): Promise<any>;
  addEmploymentHistory(employment: any): Promise<any>;
  
  // Subscription management
  getActiveSubscription(memberId: number): Promise<any | undefined>;
  getSubscriptionHistory(memberId: number): Promise<any[]>;
  createSubscription(subscription: any): Promise<any>;
  
  // Application management
  getApplication(id: number): Promise<any | undefined>;
  getMemberApplications(memberId: number): Promise<any[]>;
  createApplication(application: any): Promise<any>;
  updateApplication(id: number, data: any): Promise<any>;
  updateApplicationStatus(id: number, status: string): Promise<void>;
  updateApplicationCertificate(id: number, certificateNumber: string, certificateUrl: string): Promise<void>;
  getApplicationDocuments(applicationId: number): Promise<any[]>;
  addApplicationDocument(document: any): Promise<any>;
  
  // E-Learning
  getCourses(): Promise<any[]>;
  getCourse(id: number): Promise<any | undefined>;
  getEnrollment(memberId: number, courseId: number): Promise<any | undefined>;
  getEnrollmentById(id: number): Promise<any | undefined>;
  getMemberEnrollments(memberId: number): Promise<any[]>;
  createEnrollment(enrollment: any): Promise<any>;
  updateEnrollment(id: number, data: any): Promise<any>;
  
  // Tools
  getTools(): Promise<any[]>;
  getTool(id: number): Promise<any | undefined>;
  recordToolUsage(usage: any): Promise<any>;
  
  // Chat and Social
  getChatRooms(): Promise<any[]>;
  getChatRoom(id: number): Promise<any | undefined>;
  createChatRoom(room: any): Promise<any>;
  isRoomParticipant(roomId: number, memberId: number): Promise<boolean>;
  getRoomMessages(roomId: number): Promise<any[]>;
  addRoomParticipant(participant: any): Promise<any>;
  createChatMessage(message: any): Promise<any>;
  getDirectMessages(senderId: number, receiverId: number): Promise<any[]>;
  createDirectMessage(message: any): Promise<any>;
  markDirectMessageAsRead(messageId: number): Promise<void>;
  getRecentConversations(memberId: number): Promise<any[]>;
  
  // Elections
  getElections(): Promise<any[]>;
  getElection(id: number): Promise<any | undefined>;
  getElectionPositions(electionId: number): Promise<any[]>;
  getElectionPosition(id: number): Promise<any | undefined>;
  getPositionCandidates(positionId: number): Promise<any[]>;
  getCandidate(id: number): Promise<any | undefined>;
  getCandidateByMember(electionId: number, positionId: number, memberId: number): Promise<any | undefined>;
  createCandidate(candidate: any): Promise<any>;
  getVote(electionId: number, positionId: number, voterId: number): Promise<any | undefined>;
  recordVote(vote: any): Promise<any>;
  getCandidateVotes(electionId: number, positionId: number, candidateId: number): Promise<number>;
  
  // Ethics
  getComplaints(): Promise<any[]>;
  getComplaint(id: number): Promise<any | undefined>;
  createComplaint(complaint: any): Promise<any>;
  updateComplaintStatus(id: number, status: string): Promise<void>;
  assignComplaint(id: number, ethicsOfficerId: number): Promise<void>;
  getComplaintAttachments(complaintId: number): Promise<any[]>;
  createSanction(sanction: any): Promise<any>;
  getSanction(id: number): Promise<any | undefined>;
  createAppeal(appeal: any): Promise<any>;
  getAppealBySanction(sanctionId: number): Promise<any | undefined>;
  
  // Financial
  createTransaction(transaction: any): Promise<any>;
  getTransactionByReference(reference: string): Promise<any | undefined>;
  updateTransaction(id: number, data: any): Promise<any>;
  
  // Content
  getPublishedAnnouncements(): Promise<any[]>;
  getUpcomingEvents(): Promise<any[]>;
  getPublishedNews(): Promise<any[]>;
  getNewsArticle(id: number): Promise<any | undefined>;
  getEvent(id: number): Promise<any | undefined>;
  getEventRegistration(eventId: number, memberId: number): Promise<any | undefined>;
  registerForEvent(registration: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByIdentifier(identifier: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      or(
        eq(users.email, identifier),
        eq(users.username, identifier),
        eq(users.membershipId, identifier)
      )
    );
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const now = new Date();
    const [user] = await db.select().from(users).where(
      and(
        eq(users.resetToken, token),
        gte(users.resetTokenExpiry, now)
      )
    );
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async updateUserLastLogin(userId: number): Promise<void> {
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, userId));
  }

  async verifyUser(userId: number): Promise<void> {
    await db.update(users)
      .set({ 
        isVerified: true, 
        verificationToken: null 
      })
      .where(eq(users.id, userId));
  }

  async setPasswordResetToken(userId: number, token: string, expiry: Date): Promise<void> {
    await db.update(users)
      .set({ 
        resetToken: token, 
        resetTokenExpiry: expiry 
      })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: number, password: string): Promise<void> {
    await db.update(users)
      .set({ 
        password, 
        resetToken: null, 
        resetTokenExpiry: null 
      })
      .where(eq(users.id, userId));
  }

  // Member management
  async getMember(id: number): Promise<any | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async getMemberByUserId(userId: number): Promise<any | undefined> {
    const [member] = await db.select().from(members).where(eq(members.userId, userId));
    return member;
  }

  async createMember(member: any): Promise<any> {
    const [createdMember] = await db.insert(members).values(member).returning();
    return createdMember;
  }

  async updateMember(id: number, data: any): Promise<any> {
    const [updatedMember] = await db.update(members)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return updatedMember;
  }

  async updateMemberStatus(id: number, status: string): Promise<void> {
    await db.update(members)
      .set({ 
        status: status as any, 
        updatedAt: new Date() 
      })
      .where(eq(members.id, id));
  }

  async updateMemberCredits(id: number, credits: number): Promise<void> {
    await db.update(members)
      .set({ 
        credits, 
        updatedAt: new Date() 
      })
      .where(eq(members.id, id));
  }

  async addMemberCredits(id: number, creditsToAdd: number): Promise<void> {
    const [member] = await db.select({ credits: members.credits })
      .from(members)
      .where(eq(members.id, id));

    if (member) {
      const newCredits = member.credits + creditsToAdd;
      await this.updateMemberCredits(id, newCredits);
    }
  }

  async getMembers(search?: string, page: number = 1, limit: number = 20): Promise<any[]> {
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
      query = query.where(
        or(
          like(members.firstName, `%${search}%`),
          like(members.lastName, `%${search}%`),
          like(members.middleName, `%${search}%`)
        )
      );
    }
    
    return await query.limit(limit).offset(offset);
  }

  // Education, Professional, and Employment
  async getEducationQualifications(memberId: number): Promise<any[]> {
    return await db.select()
      .from(educationQualifications)
      .where(eq(educationQualifications.memberId, memberId))
      .orderBy(desc(educationQualifications.startYear));
  }

  async getProfessionalQualifications(memberId: number): Promise<any[]> {
    return await db.select()
      .from(professionalQualifications)
      .where(eq(professionalQualifications.memberId, memberId))
      .orderBy(desc(professionalQualifications.year));
  }

  async getEmploymentHistory(memberId: number): Promise<any[]> {
    return await db.select()
      .from(employmentHistory)
      .where(eq(employmentHistory.memberId, memberId))
      .orderBy(desc(employmentHistory.startDate));
  }

  async addEducationQualification(education: any): Promise<any> {
    const [result] = await db.insert(educationQualifications)
      .values(education)
      .returning();
    return result;
  }

  async addProfessionalQualification(professional: any): Promise<any> {
    const [result] = await db.insert(professionalQualifications)
      .values(professional)
      .returning();
    return result;
  }

  async addEmploymentHistory(employment: any): Promise<any> {
    const [result] = await db.insert(employmentHistory)
      .values(employment)
      .returning();
    return result;
  }

  // Subscription management
  async getActiveSubscription(memberId: number): Promise<any | undefined> {
    const now = new Date();
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.memberId, memberId),
          lte(subscriptions.startDate, now),
          gte(subscriptions.endDate, now)
        )
      )
      .orderBy(desc(subscriptions.endDate))
      .limit(1);
    
    return subscription;
  }

  async getSubscriptionHistory(memberId: number): Promise<any[]> {
    return await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.memberId, memberId))
      .orderBy(desc(subscriptions.endDate));
  }

  async createSubscription(subscription: any): Promise<any> {
    const [result] = await db.insert(subscriptions)
      .values(subscription)
      .returning();
    return result;
  }

  // Application management
  async getApplication(id: number): Promise<any | undefined> {
    const [application] = await db.select()
      .from(applications)
      .where(eq(applications.id, id));
    return application;
  }

  async getMemberApplications(memberId: number): Promise<any[]> {
    return await db.select()
      .from(applications)
      .where(eq(applications.memberId, memberId))
      .orderBy(desc(applications.createdAt));
  }

  async createApplication(application: any): Promise<any> {
    const [result] = await db.insert(applications)
      .values(application)
      .returning();
    return result;
  }

  async updateApplication(id: number, data: any): Promise<any> {
    const [result] = await db.update(applications)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      })
      .where(eq(applications.id, id))
      .returning();
    return result;
  }

  async updateApplicationStatus(id: number, status: string): Promise<void> {
    await db.update(applications)
      .set({ 
        status: status as any, 
        updatedAt: new Date() 
      })
      .where(eq(applications.id, id));
  }

  async updateApplicationCertificate(id: number, certificateNumber: string, certificateUrl: string): Promise<void> {
    await db.update(applications)
      .set({ 
        certificateNumber, 
        certificateUrl, 
        updatedAt: new Date() 
      })
      .where(eq(applications.id, id));
  }

  async getApplicationDocuments(applicationId: number): Promise<any[]> {
    return await db.select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, applicationId))
      .orderBy(desc(applicationDocuments.uploadedAt));
  }

  async addApplicationDocument(document: any): Promise<any> {
    const [result] = await db.insert(applicationDocuments)
      .values(document)
      .returning();
    return result;
  }

  // E-Learning
  async getCourses(): Promise<any[]> {
    return await db.select()
      .from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<any | undefined> {
    const [course] = await db.select()
      .from(courses)
      .where(
        and(
          eq(courses.id, id),
          eq(courses.isPublished, true)
        )
      );
    return course;
  }

  async getEnrollment(memberId: number, courseId: number): Promise<any | undefined> {
    const [enrollment] = await db.select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.memberId, memberId),
          eq(enrollments.courseId, courseId)
        )
      );
    return enrollment;
  }

  async getEnrollmentById(id: number): Promise<any | undefined> {
    const [enrollment] = await db.select()
      .from(enrollments)
      .where(eq(enrollments.id, id));
    return enrollment;
  }

  async getMemberEnrollments(memberId: number): Promise<any[]> {
    return await db.select({
      enrollment: enrollments,
      course: courses
    })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.memberId, memberId))
      .orderBy(desc(enrollments.startDate));
  }

  async createEnrollment(enrollment: any): Promise<any> {
    const [result] = await db.insert(enrollments)
      .values(enrollment)
      .returning();
    return result;
  }

  async updateEnrollment(id: number, data: any): Promise<any> {
    const [result] = await db.update(enrollments)
      .set(data)
      .where(eq(enrollments.id, id))
      .returning();
    return result;
  }

  // Tools
  async getTools(): Promise<any[]> {
    return await db.select()
      .from(tools)
      .where(eq(tools.isActive, true))
      .orderBy(asc(tools.name));
  }

  async getTool(id: number): Promise<any | undefined> {
    const [tool] = await db.select()
      .from(tools)
      .where(
        and(
          eq(tools.id, id),
          eq(tools.isActive, true)
        )
      );
    return tool;
  }

  async recordToolUsage(usage: any): Promise<any> {
    const [result] = await db.insert(toolUsage)
      .values({
        ...usage,
        startTime: new Date()
      })
      .returning();
    return result;
  }

  // Chat and Social
  async getChatRooms(): Promise<any[]> {
    return await db.select()
      .from(chatRooms)
      .where(eq(chatRooms.isApproved, true))
      .orderBy(desc(chatRooms.createdAt));
  }

  async getChatRoom(id: number): Promise<any | undefined> {
    const [room] = await db.select()
      .from(chatRooms)
      .where(eq(chatRooms.id, id));
    return room;
  }

  async createChatRoom(room: any): Promise<any> {
    const [result] = await db.insert(chatRooms)
      .values({
        ...room,
        createdAt: new Date()
      })
      .returning();
    return result;
  }

  async isRoomParticipant(roomId: number, memberId: number): Promise<boolean> {
    const [participant] = await db.select()
      .from(roomParticipants)
      .where(
        and(
          eq(roomParticipants.roomId, roomId),
          eq(roomParticipants.memberId, memberId)
        )
      );
    return !!participant;
  }

  async getRoomMessages(roomId: number): Promise<any[]> {
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

  async addRoomParticipant(participant: any): Promise<any> {
    const [result] = await db.insert(roomParticipants)
      .values({
        ...participant,
        joinedAt: new Date()
      })
      .returning();
    return result;
  }

  async createChatMessage(message: any): Promise<any> {
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

  async getDirectMessages(senderId: number, receiverId: number): Promise<any[]> {
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
      .where(
        or(
          and(
            eq(directMessages.senderId, senderId),
            eq(directMessages.receiverId, receiverId)
          ),
          and(
            eq(directMessages.senderId, receiverId),
            eq(directMessages.receiverId, senderId)
          )
        )
      )
      .orderBy(asc(directMessages.createdAt));
  }

  async createDirectMessage(message: any): Promise<any> {
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

  async markDirectMessageAsRead(messageId: number): Promise<void> {
    await db.update(directMessages)
      .set({ isRead: true })
      .where(eq(directMessages.id, messageId));
  }

  async getRecentConversations(memberId: number): Promise<any[]> {
    // This is a complex query to get recent conversations
    // For each unique conversation partner, get the most recent message
    const messages = await db.select({
      message: directMessages,
      partner: members
    })
      .from(directMessages)
      .innerJoin(
        members, 
        eq(
          or(eq(directMessages.senderId, memberId), eq(directMessages.receiverId, memberId)),
          members.id !== memberId ? members.id : 
            or(eq(directMessages.senderId, members.id), eq(directMessages.receiverId, members.id))
        )
      )
      .where(
        or(
          eq(directMessages.senderId, memberId),
          eq(directMessages.receiverId, memberId)
        )
      )
      .orderBy(desc(directMessages.createdAt));
      
    // Group by conversation partner and take the most recent message
    const conversations: Record<number, any> = {};
    
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
  async getElections(): Promise<any[]> {
    return await db.select()
      .from(elections)
      .orderBy(desc(elections.startDate));
  }

  async getElection(id: number): Promise<any | undefined> {
    const [election] = await db.select()
      .from(elections)
      .where(eq(elections.id, id));
    return election;
  }

  async getElectionPositions(electionId: number): Promise<any[]> {
    return await db.select()
      .from(electionPositions)
      .where(eq(electionPositions.electionId, electionId));
  }

  async getElectionPosition(id: number): Promise<any | undefined> {
    const [position] = await db.select()
      .from(electionPositions)
      .where(eq(electionPositions.id, id));
    return position;
  }

  async getPositionCandidates(positionId: number): Promise<any[]> {
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

  async getCandidate(id: number): Promise<any | undefined> {
    const [candidate] = await db.select()
      .from(electionCandidates)
      .where(eq(electionCandidates.id, id));
    return candidate;
  }

  async getCandidateByMember(electionId: number, positionId: number, memberId: number): Promise<any | undefined> {
    const [candidate] = await db.select()
      .from(electionCandidates)
      .where(
        and(
          eq(electionCandidates.electionId, electionId),
          eq(electionCandidates.positionId, positionId),
          eq(electionCandidates.memberId, memberId)
        )
      );
    return candidate;
  }

  async createCandidate(candidate: any): Promise<any> {
    const [result] = await db.insert(electionCandidates)
      .values(candidate)
      .returning();
    return result;
  }

  async getVote(electionId: number, positionId: number, voterId: number): Promise<any | undefined> {
    const [vote] = await db.select()
      .from(electionVotes)
      .where(
        and(
          eq(electionVotes.electionId, electionId),
          eq(electionVotes.positionId, positionId),
          eq(electionVotes.voterId, voterId)
        )
      );
    return vote;
  }

  async recordVote(vote: any): Promise<any> {
    const [result] = await db.insert(electionVotes)
      .values({
        ...vote,
        votedAt: new Date()
      })
      .returning();
    return result;
  }

  async getCandidateVotes(electionId: number, positionId: number, candidateId: number): Promise<number> {
    const result = await db.select({
      count: db.count()
    })
      .from(electionVotes)
      .where(
        and(
          eq(electionVotes.electionId, electionId),
          eq(electionVotes.positionId, positionId),
          eq(electionVotes.candidateId, candidateId)
        )
      );
    
    return result[0]?.count || 0;
  }

  // Ethics
  async getComplaints(): Promise<any[]> {
    return await db.select()
      .from(complaints)
      .orderBy(desc(complaints.createdAt));
  }

  async getComplaint(id: number): Promise<any | undefined> {
    const [complaint] = await db.select()
      .from(complaints)
      .where(eq(complaints.id, id));
    return complaint;
  }

  async createComplaint(complaint: any): Promise<any> {
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

  async updateComplaintStatus(id: number, status: string): Promise<void> {
    await db.update(complaints)
      .set({ 
        status: status as any, 
        updatedAt: new Date() 
      })
      .where(eq(complaints.id, id));
  }

  async assignComplaint(id: number, ethicsOfficerId: number): Promise<void> {
    await db.update(complaints)
      .set({ 
        assignedTo: ethicsOfficerId, 
        updatedAt: new Date() 
      })
      .where(eq(complaints.id, id));
  }

  async getComplaintAttachments(complaintId: number): Promise<any[]> {
    return await db.select()
      .from(complaintAttachments)
      .where(eq(complaintAttachments.complaintId, complaintId))
      .orderBy(desc(complaintAttachments.uploadedAt));
  }

  async createSanction(sanction: any): Promise<any> {
    const [result] = await db.insert(sanctions)
      .values({
        ...sanction,
        issuedAt: new Date()
      })
      .returning();
    return result;
  }

  async getSanction(id: number): Promise<any | undefined> {
    const [sanction] = await db.select()
      .from(sanctions)
      .where(eq(sanctions.id, id));
    return sanction;
  }

  async createAppeal(appeal: any): Promise<any> {
    const [result] = await db.insert(appeals)
      .values({
        ...appeal,
        status: 'PENDING',
        submittedAt: new Date()
      })
      .returning();
    return result;
  }

  async getAppealBySanction(sanctionId: number): Promise<any | undefined> {
    const [appeal] = await db.select()
      .from(appeals)
      .where(eq(appeals.sanctionId, sanctionId));
    return appeal;
  }

  // Financial
  async createTransaction(transaction: any): Promise<any> {
    const [result] = await db.insert(transactions)
      .values({
        ...transaction,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return result;
  }

  async getTransactionByReference(reference: string): Promise<any | undefined> {
    const [transaction] = await db.select()
      .from(transactions)
      .where(eq(transactions.reference, reference));
    return transaction;
  }

  async updateTransaction(id: number, data: any): Promise<any> {
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
  async getPublishedAnnouncements(): Promise<any[]> {
    const now = new Date();
    return await db.select()
      .from(announcements)
      .where(
        and(
          eq(announcements.isPublished, true),
          or(
            isNull(announcements.expiresAt),
            gte(announcements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(announcements.publishedAt))
      .limit(10);
  }

  async getUpcomingEvents(): Promise<any[]> {
    const now = new Date();
    return await db.select()
      .from(events)
      .where(gte(events.startDate, now))
      .orderBy(asc(events.startDate))
      .limit(5);
  }

  async getPublishedNews(): Promise<any[]> {
    return await db.select()
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(desc(news.publishedAt))
      .limit(10);
  }

  async getNewsArticle(id: number): Promise<any | undefined> {
    const [article] = await db.select()
      .from(news)
      .where(
        and(
          eq(news.id, id),
          eq(news.isPublished, true)
        )
      );
    return article;
  }

  async getEvent(id: number): Promise<any | undefined> {
    const [event] = await db.select()
      .from(events)
      .where(eq(events.id, id));
    return event;
  }

  async getEventRegistration(eventId: number, memberId: number): Promise<any | undefined> {
    const [registration] = await db.select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.memberId, memberId)
        )
      );
    return registration;
  }

  async registerForEvent(registration: any): Promise<any> {
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
