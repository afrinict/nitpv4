import React, { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// Define the form schema with validation
const complaintSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  membershipId: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  complaintType: z.enum([
    "PROFESSIONAL_MISCONDUCT", 
    "ETHICAL_VIOLATION", 
    "CONFIDENTIALITY_BREACH", 
    "CONFLICT_OF_INTEREST", 
    "NEGLIGENCE", 
    "OTHER"
  ]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  againstMemberId: z.string().optional(),
  againstMemberName: z.string().optional(),
  anonymous: z.boolean().default(false)
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

const SubmitComplaint = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      anonymous: false
    }
  });

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await axios.post('/api/complaints', data);
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">NITP</h1>
              <span className="ml-2 text-gray-600 dark:text-gray-300">Abuja Chapter</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Login
              </button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Submit a Complaint</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use this form to submit a complaint or report ethical issues related to town planning professionals or practices.
            </p>

            {isSuccess ? (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-400">Complaint Submitted Successfully</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Thank you for your submission. Your complaint has been received and will be reviewed by our Ethics Committee. You will be contacted if further information is needed.</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                      >
                        Submit another complaint
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-md p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Complainant Information */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md mb-4">
                  <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Complainant Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="phone"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                        {...register("phone")}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        NITP Membership ID (If applicable)
                      </label>
                      <input
                        type="text"
                        id="membershipId"
                        placeholder="e.g. TP-A32XXXXXX"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                        {...register("membershipId")}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center">
                      <input
                        id="anonymous"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        {...register("anonymous")}
                      />
                      <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Submit this complaint anonymously
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Note: Anonymous complaints may limit our ability to follow up or investigate thoroughly.
                    </p>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md mb-4">
                  <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Complaint Details</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                      {...register("subject")}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="complaintType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Complaint Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="complaintType"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      {...register("complaintType")}
                    >
                      <option value="">Select a complaint type</option>
                      <option value="PROFESSIONAL_MISCONDUCT">Professional Misconduct</option>
                      <option value="ETHICAL_VIOLATION">Ethical Violation</option>
                      <option value="CONFIDENTIALITY_BREACH">Confidentiality Breach</option>
                      <option value="CONFLICT_OF_INTEREST">Conflict of Interest</option>
                      <option value="NEGLIGENCE">Professional Negligence</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.complaintType && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.complaintType.message}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                      placeholder="Please provide a detailed account of the issue, including dates, locations, and any relevant context."
                      {...register("description")}
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                {/* Member Information */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md mb-4">
                  <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Member Information (If complaint is against a specific NITP member)</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="againstMemberId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Member's NITP ID (If known)
                      </label>
                      <input
                        type="text"
                        id="againstMemberId"
                        placeholder="e.g. TP-A32XXXXXX"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                        {...register("againstMemberId")}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="againstMemberName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Member's Name
                      </label>
                      <input
                        type="text"
                        id="againstMemberName"
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                        {...register("againstMemberName")}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Complaint Process Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">What happens next?</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  After submitting your complaint, our Ethics Committee will review the information provided within 7 working days.
                  You may be contacted for additional information if necessary.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confidentiality</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  All complaints are handled with strict confidentiality. Your information will only be shared with those directly involved in the investigation process.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Investigation</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  The Ethics Committee will conduct a thorough investigation following established protocols. This may include interviewing relevant parties,
                  reviewing documents, and gathering evidence.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resolution</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  You will be notified of the resolution or outcome of your complaint. Resolution timelines vary depending on the complexity of each case.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;