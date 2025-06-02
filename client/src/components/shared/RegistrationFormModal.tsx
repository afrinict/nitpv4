import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { api } from '@/lib/api';
import ImageUpload from '../ImageUpload';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationType: string;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profilePicture: string[];
  identificationDocuments: string[];
  academicDocuments: string[];
}

// Define the steps of the registration process
type RegistrationStep = 
  | "account" 
  | "personal" 
  | "education" 
  | "professional" 
  | "verification"
  | "review"
  | "documents";

// Define the schema for the account step
const accountSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Define the schema for the personal information step
const personalSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postalCode: z.string().optional(),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  alternatePhone: z.string().optional(),
});

// Define the schema for the education step
const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institution is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  field: z.string().min(1, { message: "Field of study is required" }),
  startYear: z.string().min(1, { message: "Start year is required" }),
  endYear: z.string().optional(),
  certificateFile: z.instanceof(File).optional(),
});

// Define the schema for the professional step
const professionalSchema = z.object({
  organization: z.string().min(1, { message: "Organization is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  responsibilities: z.string().optional(),
  professionalQualification: z.string().optional(),
  qualificationYear: z.string().optional(),
  registrationNumber: z.string().optional(),
  bio: z.string().optional(),
});

// Define the schema for the verification step
const verificationSchema = z.object({
  emailOtp: z.string().min(6, { message: "Email OTP must be 6 digits" }),
  phoneOtp: z.string().min(6, { message: "Phone OTP must be 6 digits" }),
});

export default function RegistrationFormModal({
  isOpen,
  onClose,
  registrationType,
}: RegistrationFormModalProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("account");
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePicture: [],
    identificationDocuments: [],
    academicDocuments: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState({ email: false, phone: false });
  const { toast } = useToast();
  
  // Format the registration type for display
  const formattedType = registrationType.charAt(0).toUpperCase() + registrationType.slice(1);

  // Setup forms for each step
  const accountForm = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const personalForm = useForm<z.infer<typeof personalSchema>>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "Nigeria",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phoneNumber: "",
      alternatePhone: "",
    },
  });

  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
    },
  });

  const professionalForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      organization: "",
      position: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      professionalQualification: "",
      qualificationYear: "",
      registrationNumber: "",
      bio: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      emailOtp: "",
      phoneOtp: "",
    },
  });

  const sendOtp = async (type: 'email' | 'phone') => {
    setIsSendingOtp(true);
    try {
      const endpoint = type === 'email' ? '/api/auth/send-email-otp' : '/api/auth/send-phone-otp';
      const data = type === 'email' ? { email: formData.email } : { phone: formData.phoneNumber };
      
      await api.post(endpoint, data);
      setOtpSent(prev => ({ ...prev, [type]: true }));
      toast({
        title: 'OTP Sent',
        description: `Verification code has been sent to your ${type}.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send ${type} OTP. Please try again.`,
        variant: 'destructive'
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const nextStep = async (data: any) => {
    // Merge form data with existing data
    setFormData({ ...formData, ...data });

    // Move to next step
    switch (currentStep) {
      case "account":
        setCurrentStep("personal");
        break;
      case "personal":
        setCurrentStep("education");
        break;
      case "education":
        setCurrentStep("professional");
        break;
      case "professional":
        setCurrentStep("verification");
        // Send OTPs when reaching verification step
        await Promise.all([
          sendOtp('email'),
          sendOtp('phone')
        ]);
        break;
      case "verification":
        setCurrentStep("review");
        break;
      case "review":
        setCurrentStep("documents");
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "personal":
        setCurrentStep("account");
        break;
      case "education":
        setCurrentStep("personal");
        break;
      case "professional":
        setCurrentStep("education");
        break;
      case "verification":
        setCurrentStep("professional");
        break;
      case "review":
        setCurrentStep("verification");
        break;
      case "documents":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'object') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      // Add membership type
      formDataToSend.append('membershipType', registrationType.toUpperCase());

      // Submit registration
      const response = await apiRequest("POST", "/api/auth/register", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      
      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted. Please check your email for verification.",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: urls
    }));
  };

  const handleIdentificationDocumentsUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      identificationDocuments: [...prev.identificationDocuments, ...urls]
    }));
  };

  const handleAcademicDocumentsUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      academicDocuments: [...prev.academicDocuments, ...urls]
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl leading-6 font-semibold text-primary">
            NITP Membership Registration
          </DialogTitle>
          <p className="mt-2 text-sm text-neutral-600">
            {formattedType} Membership Registration
          </p>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="w-full py-6">
          <div className="flex">
            <div className={`step-item ${currentStep === "account" || currentStep === "personal" || currentStep === "education" || currentStep === "professional" || currentStep === "verification" || currentStep === "review" || currentStep === "documents" ? "complete" : ""}`}>
              <div className={`step ${currentStep === "account" ? "active" : ""}`}>1</div>
              <p className="text-xs mt-2">Account</p>
            </div>
            <div className={`step-item ${currentStep === "personal" || currentStep === "education" || currentStep === "professional" || currentStep === "verification" || currentStep === "review" || currentStep === "documents" ? "complete" : ""}`}>
              <div className={`step ${currentStep === "personal" ? "active" : ""}`}>2</div>
              <p className="text-xs mt-2">Personal Info</p>
            </div>
            <div className={`step-item ${currentStep === "education" || currentStep === "professional" || currentStep === "verification" || currentStep === "review" || currentStep === "documents" ? "complete" : ""}`}>
              <div className={`step ${currentStep === "education" ? "active" : ""}`}>3</div>
              <p className="text-xs mt-2">Education</p>
            </div>
            <div className={`step-item ${currentStep === "professional" || currentStep === "verification" || currentStep === "review" || currentStep === "documents" ? "complete" : ""}`}>
              <div className={`step ${currentStep === "professional" ? "active" : ""}`}>4</div>
              <p className="text-xs mt-2">Professional</p>
            </div>
            <div className={`step-item ${currentStep === "verification" || currentStep === "review" || currentStep === "documents" ? "complete" : ""}`}>
              <div className={`step ${currentStep === "verification" ? "active" : ""}`}>5</div>
              <p className="text-xs mt-2">Verification</p>
            </div>
            <div className={`step-item ${currentStep === "review" || currentStep === "documents" ? "complete" : ""}`}>
              <div className={`step ${currentStep === "review" ? "active" : ""}`}>6</div>
              <p className="text-xs mt-2">Review</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {currentStep === "account" && (
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(nextStep)} className="space-y-6">
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Next</Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === "personal" && (
            <Form {...personalForm}>
              <form onSubmit={personalForm.handleSubmit(nextStep)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Nigeria">Nigeria</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={personalForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={personalForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={personalForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="abuja">Federal Capital Territory</SelectItem>
                              <SelectItem value="lagos">Lagos</SelectItem>
                              <SelectItem value="rivers">Rivers</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      control={personalForm.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={personalForm.control}
                      name="alternatePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alternate phone (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === "education" && (
            <Form {...educationForm}>
              <form onSubmit={educationForm.handleSubmit(nextStep)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <FormField
                      control={educationForm.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="University or College Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={educationForm.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="BSc, MSc, PhD, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={educationForm.control}
                      name="field"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Urban Planning, Architecture, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={educationForm.control}
                      name="startYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Year</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="YYYY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={educationForm.control}
                      name="endYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Year (or Expected)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="YYYY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={educationForm.control}
                      name="certificateFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate File (if available)</FormLabel>
                          <FormControl>
                            <Input type="file" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === "professional" && (
            <Form {...professionalForm}>
              <form onSubmit={professionalForm.handleSubmit(nextStep)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      control={professionalForm.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Organization</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Company or Organization Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={professionalForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your Job Title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={professionalForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={professionalForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date (if applicable)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={professionalForm.control}
                      name="responsibilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsibilities</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Describe your key responsibilities and achievements"
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={professionalForm.control}
                      name="professionalQualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Qualification</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Professional certification or qualification" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={professionalForm.control}
                      name="qualificationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Obtained</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="YYYY" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={professionalForm.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="If applicable" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <FormField
                      control={professionalForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Brief professional bio"
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === "verification" && (
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(nextStep)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <FormField
                      control={verificationForm.control}
                      name="emailOtp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email OTP</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter email OTP" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <FormField
                      control={verificationForm.control}
                      name="phoneOtp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone OTP</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter phone OTP" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </form>
            </Form>
          )}

          {currentStep === "review" && (
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Review Your Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-neutral-500">Account Information</h4>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Username:</span> {formData.username}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-500">Personal Information</h4>
                    <p><span className="font-medium">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName}</p>
                    <p><span className="font-medium">Gender:</span> {formData.gender}</p>
                    <p><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phoneNumber}</p>
                    <p><span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.state}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-500">Education</h4>
                    <p><span className="font-medium">Institution:</span> {formData.institution}</p>
                    <p><span className="font-medium">Degree:</span> {formData.degree} in {formData.field}</p>
                    <p><span className="font-medium">Period:</span> {formData.startYear} - {formData.endYear || 'Present'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-neutral-500">Professional</h4>
                    <p><span className="font-medium">Organization:</span> {formData.organization}</p>
                    <p><span className="font-medium">Position:</span> {formData.position}</p>
                    <p><span className="font-medium">Qualification:</span> {formData.professionalQualification} ({formData.qualificationYear})</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-orange-50 dark:bg-amber-900/20 border border-orange-200 dark:border-amber-700 p-4 rounded-md">
                  <p className="text-sm text-orange-700 dark:text-amber-400">
                    By submitting this application, you confirm that all information provided is accurate and complete. 
                    Your membership application will be reviewed by NITP, and payment details will be sent upon approval.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button onClick={submitRegistration} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          )}

          {currentStep === "documents" && (
            <div className="space-y-6">
              <div>
                <Label>Profile Picture</Label>
                <ImageUpload
                  onImageUploaded={handleProfilePictureUploaded}
                  multiple={false}
                  maxSize={5}
                  label="Upload Profile Picture"
                  description="Upload a professional headshot or passport photograph"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Identification Documents</Label>
                <ImageUpload
                  onImageUploaded={handleIdentificationDocumentsUploaded}
                  multiple={true}
                  maxFiles={3}
                  maxSize={10}
                  label="Upload ID Documents"
                  description="Upload government-issued ID, passport, or other identification documents"
                  className="mt-2"
                />
                {formData.identificationDocuments?.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.identificationDocuments.length} document(s) uploaded
                  </p>
                )}
              </div>

              {registrationType === 'student' && (
                <div>
                  <Label>Academic Documents</Label>
                  <ImageUpload
                    onImageUploaded={handleAcademicDocumentsUploaded}
                    multiple={true}
                    maxFiles={5}
                    maxSize={10}
                    label="Upload Academic Documents"
                    description="Upload student ID, admission letter, or other academic documents"
                    className="mt-2"
                  />
                  {formData.academicDocuments?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.academicDocuments.length} document(s) uploaded
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("personal")}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep("review")}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
