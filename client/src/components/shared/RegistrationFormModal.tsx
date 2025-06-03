import { useState } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { api } from '@/lib/api';
import ImageUpload from '../ImageUpload';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Controller } from "react-hook-form";

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationType: string;
}

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  username: string;
  phone: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  alternatePhone?: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string;
  organization: string;
  position: string;
  startDate: string;
  endDate?: string;
  responsibilities?: string;
  professionalQualification?: string;
  qualificationYear?: string;
  registrationNumber?: string;
  bio?: string;
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

type AccountFormData = z.infer<typeof accountSchema>;

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

type PersonalFormData = z.infer<typeof personalSchema>;

// Define the schema for the education step
const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institution is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  field: z.string().min(1, { message: "Field of study is required" }),
  startYear: z.string().min(1, { message: "Start year is required" }),
  endYear: z.string().optional(),
  certificateFile: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

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

type ProfessionalFormData = z.infer<typeof professionalSchema>;

// Define the schema for the verification step
const verificationSchema = z.object({
  emailOtp: z.string().min(6, { message: "Email OTP must be 6 digits" }),
  phoneOtp: z.string().min(6, { message: "Phone OTP must be 6 digits" }),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function RegistrationFormModal({
  isOpen,
  onClose,
  registrationType,
}: RegistrationFormModalProps) {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("account");
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    username: '',
    phone: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'Nigeria',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    alternatePhone: '',
    institution: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    organization: '',
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    professionalQualification: '',
    qualificationYear: '',
    registrationNumber: '',
    bio: '',
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
  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const personalForm = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'MALE',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
    },
  });

  const educationForm = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      certificateFile: undefined,
    },
  });

  const professionalForm = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      organization: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      professionalQualification: '',
      qualificationYear: '',
      registrationNumber: '',
      bio: '',
    },
  });

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      emailOtp: '',
      phoneOtp: '',
    },
  });

  const handleAccountSubmit = async (data: AccountFormData) => {
    try {
      setIsSubmitting(true);
      setFormData(prev => ({ ...prev, ...data }));
      setCurrentStep("personal");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonalSubmit = async (data: PersonalFormData) => {
    try {
      setIsSubmitting(true);
      setFormData(prev => ({ ...prev, ...data }));
      setCurrentStep("education");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEducationSubmit = async (data: EducationFormData) => {
    try {
      setIsSubmitting(true);
      setFormData(prev => ({ ...prev, ...data }));
      setCurrentStep("professional");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfessionalSubmit = async (data: ProfessionalFormData) => {
    try {
      setIsSubmitting(true);
      setFormData(prev => ({ ...prev, ...data }));
      setCurrentStep("verification");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (data: VerificationFormData) => {
    try {
      setIsSubmitting(true);
      const response = await api.post("/api/auth/register", formData);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Registration completed successfully!",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendOtp = async (type: 'email' | 'phone') => {
    setIsSendingOtp(true);
    try {
      const response = await api.post(`/api/auth/send-otp`, {
        type,
        email: formData.email,
        phone: formData.phoneNumber,
      });
      if (response.status === 200) {
        setOtpSent(prev => ({ ...prev, [type]: true }));
        toast({
          title: "OTP Sent",
          description: `A verification code has been sent to your ${type}.`,
        });
      }
    } catch (error) {
      console.error(`Error sending ${type} OTP:`, error);
      toast({
        title: "Error",
        description: `Failed to send ${type} verification code. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const nextStep = async (data: Partial<RegistrationFormData> | { emailOtp: string; phoneOtp: string }) => {
    if (currentStep === "verification") {
      try {
        const response = await api.post('/api/auth/verify-otp', {
          email: formData.email,
          phone: formData.phoneNumber,
          emailOtp: (data as { emailOtp: string }).emailOtp,
          phoneOtp: (data as { phoneOtp: string }).phoneOtp,
        });
        if (response.status === 200) {
          setCurrentStep("review");
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast({
          title: "Verification Failed",
          description: "Invalid verification codes. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setFormData(prev => ({ ...prev, ...data }));
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
          break;
        case "review":
          setCurrentStep("documents");
          break;
        default:
          break;
      }
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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<EducationFormData, 'certificateFile'>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.url) {
        field.onChange(response.data.url);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.post("/api/auth/register", formData);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Registration completed successfully!",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            {formattedType} Registration
          </DialogTitle>
          <DialogDescription>
            Complete the registration form to create your account
          </DialogDescription>
        </DialogHeader>
        {currentStep === "account" && (
          <Form {...accountForm}>
            <form onSubmit={accountForm.handleSubmit(handleAccountSubmit)} className="space-y-6">
              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Controller
                        name="email"
                        control={accountForm.control}
                        render={({ field }) => (
                          <Input
                            type="email"
                            placeholder="Email"
                            disabled={isSubmitting}
                            {...field}
                          />
                        )}
                      />
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
                      <Input
                        {...field}
                        placeholder="username"
                        disabled={isSubmitting}
                      />
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
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                      />
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
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Next"}
              </Button>
            </form>
          </Form>
        )}
        {currentStep === "personal" && (
          <Form {...personalForm}>
            <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-6">
              <FormField
                control={personalForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Controller
                        name="firstName"
                        control={personalForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="First Name"
                            disabled={isSubmitting}
                            {...field}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Michael" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
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
              <FormField
                control={personalForm.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
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
              <FormField
                control={personalForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
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
              <FormField
                control={personalForm.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="alternatePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        )}
        {currentStep === "education" && (
          <Form {...educationForm}>
            <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-6">
              <FormField
                control={educationForm.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Controller
                        name="institution"
                        control={educationForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="Institution"
                            disabled={isSubmitting}
                            {...field}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="BSc, MSc, PhD, etc." disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Urban Planning, Architecture, etc." disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YYYY" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Year (or Expected)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YYYY" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={educationForm.control}
                name="certificateFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, field)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        )}
        {currentStep === "professional" && (
          <Form {...professionalForm}>
            <form onSubmit={professionalForm.handleSubmit(handleProfessionalSubmit)} className="space-y-6">
              <FormField
                control={professionalForm.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Controller
                        name="organization"
                        control={professionalForm.control}
                        render={({ field }) => (
                          <Input
                            placeholder="Organization"
                            disabled={isSubmitting}
                            {...field}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionalForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your Job Title" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionalForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionalForm.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (if applicable)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionalForm.control}
                name="professionalQualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Qualification</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Professional certification or qualification" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionalForm.control}
                name="qualificationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Obtained</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="YYYY" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={professionalForm.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="If applicable" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        )}
        {currentStep === "verification" && (
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)} className="space-y-6">
              <FormField
                control={verificationForm.control}
                name="emailOtp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email OTP</FormLabel>
                    <FormControl>
                      <Controller
                        name="emailOtp"
                        control={verificationForm.control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="Email OTP"
                            disabled={isSubmitting}
                            {...field}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={verificationForm.control}
                name="phoneOtp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone OTP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter phone OTP"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
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
              <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
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
      </DialogContent>
    </Dialog>
  );
}
