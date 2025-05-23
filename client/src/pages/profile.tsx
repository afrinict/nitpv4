import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { User, Building, GraduationCap, Briefcase } from "lucide-react";

// Personal information schema
const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().optional(),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  alternatePhone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
});

// Education form schema
const educationSchema = z.object({
  institution: z.string().min(1, { message: "Institution is required" }),
  degree: z.string().min(1, { message: "Degree is required" }),
  field: z.string().min(1, { message: "Field of study is required" }),
  startYear: z.string().min(1, { message: "Start year is required" }),
  endYear: z.string().optional(),
  certificateUrl: z.string().optional(),
});

// Professional qualification form schema
const professionalSchema = z.object({
  organization: z.string().min(1, { message: "Organization is required" }),
  qualification: z.string().min(1, { message: "Qualification is required" }),
  registrationNumber: z.string().optional(),
  year: z.coerce.number().min(1900, { message: "Valid year is required" }),
  certificateUrl: z.string().optional(),
});

// Employment history form schema
const employmentSchema = z.object({
  employer: z.string().min(1, { message: "Employer is required" }),
  position: z.string().min(1, { message: "Position is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  responsibilities: z.string().optional(),
});

export default function Profile() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State for dialogs
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [isProfessionalDialogOpen, setIsProfessionalDialogOpen] = useState(false);
  const [isEmploymentDialogOpen, setIsEmploymentDialogOpen] = useState(false);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [loading, user, setLocation]);

  // Fetch profile data
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['/api/members/profile'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/members/profile', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        return data.member;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    }
  });

  // Personal info form
  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      phoneNumber: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      bio: "",
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      personalForm.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        middleName: profile.middleName || "",
        phoneNumber: profile.phoneNumber || "",
        alternatePhone: profile.alternatePhone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        postalCode: profile.postalCode || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, personalForm]);

  // Education form
  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      certificateUrl: "",
    }
  });

  // Professional qualification form
  const professionalForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      organization: "",
      qualification: "",
      registrationNumber: "",
      year: new Date().getFullYear(),
      certificateUrl: "",
    }
  });

  // Employment history form
  const employmentForm = useForm<z.infer<typeof employmentSchema>>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      employer: "",
      position: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
    }
  });

  // Profile update mutation
  const updateProfile = useMutation({
    mutationFn: async (data: z.infer<typeof personalInfoSchema>) => {
      const response = await apiRequest('PUT', '/api/members/profile', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/members/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  });

  // Add education mutation
  const addEducation = useMutation({
    mutationFn: async (data: z.infer<typeof educationSchema>) => {
      const response = await apiRequest('POST', '/api/members/education', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add education');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Education Added",
        description: "Your education qualification has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/members/profile'] });
      setIsEducationDialogOpen(false);
      educationForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Education",
        description: error.message || "There was an error adding your education qualification.",
        variant: "destructive",
      });
    }
  });

  // Add professional qualification mutation
  const addProfessional = useMutation({
    mutationFn: async (data: z.infer<typeof professionalSchema>) => {
      const response = await apiRequest('POST', '/api/members/professional', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add professional qualification');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Qualification Added",
        description: "Your professional qualification has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/members/profile'] });
      setIsProfessionalDialogOpen(false);
      professionalForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Qualification",
        description: error.message || "There was an error adding your professional qualification.",
        variant: "destructive",
      });
    }
  });

  // Add employment history mutation
  const addEmployment = useMutation({
    mutationFn: async (data: z.infer<typeof employmentSchema>) => {
      const response = await apiRequest('POST', '/api/members/employment', data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employment history');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Employment History Added",
        description: "Your employment history has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/members/profile'] });
      setIsEmploymentDialogOpen(false);
      employmentForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Employment",
        description: error.message || "There was an error adding your employment history.",
        variant: "destructive",
      });
    }
  });

  // Form submission handlers
  const onPersonalSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    updateProfile.mutate(data);
  };

  const onEducationSubmit = (data: z.infer<typeof educationSchema>) => {
    addEducation.mutate(data);
  };

  const onProfessionalSubmit = (data: z.infer<typeof professionalSchema>) => {
    addProfessional.mutate(data);
  };

  const onEmploymentSubmit = (data: z.infer<typeof employmentSchema>) => {
    addEmployment.mutate(data);
  };

  if (loading || isProfileLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">My Profile</h1>
        
        <div className="py-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-4 h-auto mb-6">
              <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md py-2">
                <User className="h-4 w-4 mr-2" />
                <span className="sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md py-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="professional" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md py-2">
                <Building className="h-4 w-4 mr-2" />
                <span className="sm:inline">Professional</span>
              </TabsTrigger>
              <TabsTrigger value="employment" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md py-2">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="sm:inline">Employment</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...personalForm}>
                    <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={personalForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
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
                                <Input {...field} />
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
                                <Input {...field} />
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
                                <Input {...field} />
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
                              <FormLabel>Alternate Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={personalForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
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
                                <Input {...field} />
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
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <FormField
                        control={personalForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Write a brief professional bio" 
                                className="resize-none min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto"
                        disabled={updateProfile.isPending}
                      >
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Education Qualifications */}
            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Education Qualifications</CardTitle>
                    <CardDescription>
                      Your academic background and qualifications.
                    </CardDescription>
                  </div>
                  <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default">Add Education</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Education Qualification</DialogTitle>
                        <DialogDescription>
                          Add your educational background and qualifications.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...educationForm}>
                        <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-4">
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
                          
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={educationForm.control}
                              name="degree"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Degree</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="BSc, MSc, PhD" />
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
                                    <Input {...field} placeholder="Urban Planning, Architecture" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          
                          <FormField
                            control={educationForm.control}
                            name="certificateUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certificate URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://example.com/certificate.pdf" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="submit"
                              disabled={addEducation.isPending}
                            >
                              {addEducation.isPending ? "Adding..." : "Add Education"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {profile?.educationQualifications?.length ? (
                    <div className="space-y-6">
                      {profile.educationQualifications.map((edu: any) => (
                        <div key={edu.id} className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                              <p className="text-neutral-600 dark:text-neutral-400">{edu.institution}</p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                                {edu.startYear} - {edu.endYear || 'Present'}
                              </p>
                            </div>
                            {edu.certificateUrl && (
                              <a 
                                href={edu.certificateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary dark:text-secondary hover:underline"
                              >
                                View Certificate
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <GraduationCap className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No education qualifications yet</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-1">Add your educational background by clicking the button above.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Professional Qualifications */}
            <TabsContent value="professional">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Professional Qualifications</CardTitle>
                    <CardDescription>
                      Your professional certifications and qualifications.
                    </CardDescription>
                  </div>
                  <Dialog open={isProfessionalDialogOpen} onOpenChange={setIsProfessionalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default">Add Qualification</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Professional Qualification</DialogTitle>
                        <DialogDescription>
                          Add your professional certifications and qualifications.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...professionalForm}>
                        <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-4">
                          <FormField
                            control={professionalForm.control}
                            name="organization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization/Body</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Professional organization or certifying body" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={professionalForm.control}
                            name="qualification"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Qualification</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Certification or qualification name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={professionalForm.control}
                              name="registrationNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registration Number (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Certification number" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={professionalForm.control}
                              name="year"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      placeholder="YYYY" 
                                      min="1900" 
                                      max={new Date().getFullYear()}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={professionalForm.control}
                            name="certificateUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certificate URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="https://example.com/certificate.pdf" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="submit"
                              disabled={addProfessional.isPending}
                            >
                              {addProfessional.isPending ? "Adding..." : "Add Qualification"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {profile?.professionalQualifications?.length ? (
                    <div className="space-y-6">
                      {profile.professionalQualifications.map((qual: any) => (
                        <div key={qual.id} className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{qual.qualification}</h3>
                              <p className="text-neutral-600 dark:text-neutral-400">{qual.organization}</p>
                              {qual.registrationNumber && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                  Reg. No: {qual.registrationNumber}
                                </p>
                              )}
                              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                                Obtained: {qual.year}
                              </p>
                            </div>
                            {qual.certificateUrl && (
                              <a 
                                href={qual.certificateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary dark:text-secondary hover:underline"
                              >
                                View Certificate
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Building className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No professional qualifications yet</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-1">Add your professional certifications by clicking the button above.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Employment History */}
            <TabsContent value="employment">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Employment History</CardTitle>
                    <CardDescription>
                      Your professional work experience.
                    </CardDescription>
                  </div>
                  <Dialog open={isEmploymentDialogOpen} onOpenChange={setIsEmploymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default">Add Employment</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Employment History</DialogTitle>
                        <DialogDescription>
                          Add your professional work experience.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...employmentForm}>
                        <form onSubmit={employmentForm.handleSubmit(onEmploymentSubmit)} className="space-y-4">
                          <FormField
                            control={employmentForm.control}
                            name="employer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employer/Company</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Company or organization name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={employmentForm.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position/Job Title</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Your job title" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={employmentForm.control}
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
                            
                            <FormField
                              control={employmentForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date (leave blank if current)</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={employmentForm.control}
                            name="responsibilities"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Responsibilities (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    {...field} 
                                    placeholder="Describe your key responsibilities and achievements" 
                                    className="resize-none min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="submit"
                              disabled={addEmployment.isPending}
                            >
                              {addEmployment.isPending ? "Adding..." : "Add Employment"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {profile?.employmentHistory?.length ? (
                    <div className="space-y-6">
                      {profile.employmentHistory.map((job: any) => (
                        <div key={job.id} className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <div>
                            <h3 className="text-lg font-semibold">{job.position}</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">{job.employer}</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                              {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                            </p>
                            {job.responsibilities && (
                              <div className="mt-2">
                                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Responsibilities:</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{job.responsibilities}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Briefcase className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No employment history yet</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 mt-1">Add your work experience by clicking the button above.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
