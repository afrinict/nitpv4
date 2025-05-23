import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";

const complaintSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  details: z.string().min(10, { message: "Please provide more details (minimum 10 characters)" }),
  privacy: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy terms",
  }),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function EthicsSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      details: "",
      privacy: false,
    },
  });

  async function onSubmit(data: ComplaintFormValues) {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/ethics/complaints", {
        complainantName: data.name,
        complainantEmail: data.email,
        subject: data.subject,
        details: data.details,
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      toast({
        title: "Complaint Submitted",
        description: "Your ethics complaint has been submitted successfully. We will review it and contact you if necessary.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your complaint. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-12 bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary dark:text-white">Ethics & Professional Conduct</h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
              NITP is committed to upholding the highest standards of professional conduct in urban planning. 
              If you have concerns about professional conduct, you can submit a complaint through our ethics portal.
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">Ethical Principles</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex">
                  <CheckCircle className="text-success mt-1 mr-2 h-5 w-5" />
                  <span className="dark:text-neutral-300">Integrity in professional practice</span>
                </li>
                <li className="flex">
                  <CheckCircle className="text-success mt-1 mr-2 h-5 w-5" />
                  <span className="dark:text-neutral-300">Responsibility to the public interest</span>
                </li>
                <li className="flex">
                  <CheckCircle className="text-success mt-1 mr-2 h-5 w-5" />
                  <span className="dark:text-neutral-300">Professional competence and due care</span>
                </li>
                <li className="flex">
                  <CheckCircle className="text-success mt-1 mr-2 h-5 w-5" />
                  <span className="dark:text-neutral-300">Fairness, transparency and objectivity</span>
                </li>
                <li className="flex">
                  <CheckCircle className="text-success mt-1 mr-2 h-5 w-5" />
                  <span className="dark:text-neutral-300">Environmental stewardship and sustainable development</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0">
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg shadow-sm p-6 border border-neutral-100 dark:border-neutral-600">
              <h3 className="text-2xl font-semibold text-primary dark:text-white">Submit an Ethics Complaint</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300">Use this form to submit concerns about professional conduct of NITP members.</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complaint Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            {...field} 
                            disabled={isSubmitting}
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I understand that this information will be used to address my complaint and may be shared with relevant NITP officials.
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Complaint"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
