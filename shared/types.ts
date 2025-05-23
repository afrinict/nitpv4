import { membershipTypeEnum, roleEnum, applicationStatusEnum, complaintStatusEnum } from "./schema";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: typeof roleEnum.enumValues[number];
  membershipId?: string;
  isVerified: boolean;
}

export interface MemberProfile {
  id: number;
  userId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: Date;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  type: typeof membershipTypeEnum.enumValues[number];
  status: string;
  profilePicture?: string;
  bio?: string;
  credits: number;
  educationQualifications?: EducationQualification[];
  professionalQualifications?: ProfessionalQualification[];
  employmentHistory?: EmploymentRecord[];
}

export interface EducationQualification {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  certificateUrl?: string;
}

export interface ProfessionalQualification {
  id: number;
  organization: string;
  qualification: string;
  registrationNumber?: string;
  year: number;
  certificateUrl?: string;
}

export interface EmploymentRecord {
  id: number;
  employer: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  responsibilities?: string;
}

export interface SubscriptionDetails {
  id: number;
  type: typeof membershipTypeEnum.enumValues[number];
  amount: number;
  startDate: Date;
  endDate: Date;
  transactionReference?: string;
}

export interface ApplicationDetails {
  id: number;
  applicationType: string;
  applicantType: string;
  status: typeof applicationStatusEnum.enumValues[number];
  projectTitle: string;
  siteAddress: string;
  coordinates?: string;
  plotNumber?: string;
  projectDescription?: string;
  proponentInfo?: any;
  certificateNumber?: string;
  certificateUrl?: string;
  amount?: number;
  documents?: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: number;
  documentType: string;
  documentUrl: string;
  uploadedAt: Date;
}

export interface CourseDetails {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  instructor?: string;
  duration?: number;
  modules: number;
  isPublished: boolean;
}

export interface EnrollmentDetails {
  id: number;
  courseId: number;
  progress: number;
  completedModules: number;
  startDate: Date;
  completionDate?: Date;
  certificateUrl?: string;
  course?: CourseDetails;
}

export interface ToolDetails {
  id: number;
  name: string;
  description: string;
  thumbnail?: string;
  creditCost: number;
  isActive: boolean;
}

export interface ChatRoomDetails {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdBy?: number;
  isApproved: boolean;
  createdAt: Date;
}

export interface ChatMessageDetails {
  id: number;
  roomId: number;
  senderId: number;
  senderName?: string;
  message: string;
  attachmentUrl?: string;
  createdAt: Date;
}

export interface DirectMessageDetails {
  id: number;
  senderId: number;
  senderName?: string;
  receiverId: number;
  receiverName?: string;
  message: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ConnectionDetails {
  id: number;
  requesterId: number;
  requesterName?: string;
  receiverId: number;
  receiverName?: string;
  status: string;
  createdAt: Date;
}

export interface PostDetails {
  id: number;
  memberId: number;
  memberName?: string;
  content: string;
  attachmentUrl?: string;
  createdAt: Date;
  interactions?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface GroupDetails {
  id: number;
  name: string;
  description: string;
  createdBy?: number;
  thumbnail?: string;
  memberCount?: number;
}

export interface ElectionDetails {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  positions?: ElectionPositionDetails[];
}

export interface ElectionPositionDetails {
  id: number;
  title: string;
  description?: string;
  maxCandidates: number;
  candidates?: ElectionCandidateDetails[];
}

export interface ElectionCandidateDetails {
  id: number;
  memberId: number;
  memberName?: string;
  bio?: string;
  manifesto?: string;
  voteCount?: number;
}

export interface ComplaintDetails {
  id: number;
  subject: string;
  details: string;
  complainantName?: string;
  complainantEmail?: string;
  respondentId?: number;
  respondentName?: string;
  status: typeof complaintStatusEnum.enumValues[number];
  assignedTo?: number;
  assigneeName?: string;
  createdAt: Date;
  attachments?: {
    id: number;
    fileUrl: string;
    fileName: string;
  }[];
}

export interface SanctionDetails {
  id: number;
  complaintId: number;
  memberId: number;
  memberName?: string;
  sanctionType: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  amount?: number;
  issuedBy: number;
  issuerName?: string;
  issuedAt: Date;
}

export interface TransactionDetails {
  id: number;
  memberId?: number;
  memberName?: string;
  type: string;
  amount: number;
  reference: string;
  status: string;
  description?: string;
  createdAt: Date;
}

export interface AnnouncementDetails {
  id: number;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  createdBy?: number;
  createdAt: Date;
}

export interface EventDetails {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  thumbnail?: string;
  attendeeCount?: number;
}

export interface NewsArticleDetails {
  id: number;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  thumbnail?: string;
  isPublished: boolean;
  publishedAt?: Date;
  authorId?: number;
  authorName?: string;
  createdAt: Date;
}

export interface NotificationDetails {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: Date;
}
