declare module '../../../shared/schema' {
  export const applicantTypeEnum: {
    INDIVIDUAL: 'INDIVIDUAL';
    CORPORATE: 'CORPORATE';
  };

  export const projectTypeEnum: {
    RESIDENTIAL: 'RESIDENTIAL';
    COMMERCIAL: 'COMMERCIAL';
    INDUSTRIAL: 'INDUSTRIAL';
    MIXED_USE: 'MIXED_USE';
    INFRASTRUCTURE: 'INFRASTRUCTURE';
    INSTITUTIONAL: 'INSTITUTIONAL';
    AGRICULTURAL: 'AGRICULTURAL';
    RECREATIONAL: 'RECREATIONAL';
    OTHER: 'OTHER';
  };

  export const sarApplicationStatusEnum: {
    DRAFT: 'DRAFT';
    SUBMITTED: 'SUBMITTED';
    UNDER_REVIEW: 'UNDER_REVIEW';
    APPROVED: 'APPROVED';
    REJECTED: 'REJECTED';
    WITHDRAWN: 'WITHDRAWN';
  };

  export const paymentStatusEnum: {
    PENDING: 'PENDING';
    PAID: 'PAID';
    FAILED: 'FAILED';
    REFUNDED: 'REFUNDED';
  };
} 