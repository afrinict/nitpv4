import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { projectSectorEnum, impactSignificanceEnum } from '@shared/schema';

const eiarFormSchema = z.object({
  // Step 1: Applicant & Project Identification
  applicantType: z.enum(['INDIVIDUAL', 'CORPORATE']),
  organizationName: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPersonTitle: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  projectTitle: z.string().min(1),
  projectSector: z.enum(Object.values(projectSectorEnum) as [string, ...string[]]),
  projectDescription: z.string().min(1),
  proposedLandUse: z.string().min(1),
  projectStartDate: z.string(),
  projectDuration: z.number().min(1),
  eiaStudyScope: z.string().optional(),

  // Step 2: Site Location & Demarcation
  siteAddress: z.string().min(1),
  latitude: z.string(),
  longitude: z.string(),
  plotNumber: z.string().min(1),
  cadastralZone: z.string().min(1),
  siteArea: z.number().min(0),
  siteContext: z.string().min(1),
  ecologicalLandmarks: z.string().min(1),

  // Step 3: Baseline Environmental Conditions
  physicalEnvironment: z.object({
    atmosphericConditions: z.string(),
    geologyAndSoil: z.string(),
    hydrologyAndWaterQuality: z.string(),
    noiseAndVibration: z.string(),
  }),
  biologicalEnvironment: z.object({
    flora: z.string(),
    fauna: z.string(),
    ecosystems: z.string(),
    biodiversityHotspots: z.string(),
  }),
  socioEconomicEnvironment: z.object({
    populationDemographics: z.string(),
    landUsePatterns: z.string(),
    culturalHeritage: z.string(),
    healthAndSafety: z.string(),
    economicActivities: z.string(),
  }),

  // Step 4: Project Alternatives & Impact Prediction
  projectAlternatives: z.string().min(1),
  potentialImpacts: z.object({
    constructionPhase: z.array(z.object({
      impact: z.string(),
      significance: z.enum(Object.values(impactSignificanceEnum) as [string, ...string[]]),
      description: z.string(),
    })),
    operationPhase: z.array(z.object({
      impact: z.string(),
      significance: z.enum(Object.values(impactSignificanceEnum) as [string, ...string[]]),
      description: z.string(),
    })),
    decommissioningPhase: z.array(z.object({
      impact: z.string(),
      significance: z.enum(Object.values(impactSignificanceEnum) as [string, ...string[]]),
      description: z.string(),
    })),
    cumulativeImpacts: z.string(),
    positiveImpacts: z.string(),
  }),

  // Step 5: Mitigation, Monitoring & Management Plan
  mitigationMeasures: z.array(z.object({
    impact: z.string(),
    measure: z.string(),
    responsibleParty: z.string(),
  })),
  monitoringPlan: z.array(z.object({
    parameter: z.string(),
    frequency: z.string(),
    methodology: z.string(),
  })),
  managementPlan: z.string().min(1),
  emergencyResponsePlan: z.string().min(1),
  responsibleParties: z.array(z.object({
    role: z.string(),
    name: z.string(),
    contact: z.string(),
  })),

  // Step 6: Public Consultation & Declaration
  publicConsultation: z.object({
    activities: z.string(),
    issuesRaised: z.string(),
    howAddressed: z.string(),
  }),
  declaration: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the declaration',
  }),
});

type EIARFormData = z.infer<typeof eiarFormSchema>;

const steps = [
  { id: 1, title: 'Applicant & Project Identification' },
  { id: 2, title: 'Site Location & Demarcation' },
  { id: 3, title: 'Baseline Environmental Conditions' },
  { id: 4, title: 'Project Alternatives & Impact Prediction' },
  { id: 5, title: 'Mitigation, Monitoring & Management Plan' },
  { id: 6, title: 'Public Consultation & Declaration' },
  { id: 7, title: 'Upload Supporting Documents' },
  { id: 8, title: 'Review & Payment' },
];

export function EIARApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<EIARFormData>({
    resolver: zodResolver(eiarFormSchema),
    defaultValues: {
      applicantType: 'INDIVIDUAL',
      contactEmail: user?.email || '',
      contactPhone: user?.phone || '',
      declaration: false,
    },
  });

  const onSubmit = async (data: EIARFormData) => {
    try {
      // TODO: Implement form submission
      console.log(data);
      toast({
        title: 'Success',
        description: 'EIAR application submitted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit EIAR application',
        variant: 'destructive',
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Applicant Type</Label>
              <Controller
                name="applicantType"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INDIVIDUAL" id="individual" />
                      <Label htmlFor="individual">Individual</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CORPORATE" id="corporate" />
                      <Label htmlFor="corporate">Corporate/Organization</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {form.watch('applicantType') === 'CORPORATE' && (
              <>
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Controller
                    name="organizationName"
                    control={form.control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Controller
                    name="contactPerson"
                    control={form.control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person's Position/Title</Label>
                  <Controller
                    name="contactPersonTitle"
                    control={form.control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Controller
                name="contactEmail"
                control={form.control}
                render={({ field }) => <Input {...field} type="email" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Controller
                name="contactPhone"
                control={form.control}
                render={({ field }) => <Input {...field} />}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Title</Label>
              <Controller
                name="projectTitle"
                control={form.control}
                render={({ field }) => <Input {...field} />}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Sector/Industry</Label>
              <Controller
                name="projectSector"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(projectSectorEnum).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Brief Project Description</Label>
              <Controller
                name="projectDescription"
                control={form.control}
                render={({ field }) => <Textarea {...field} />}
              />
            </div>

            <div className="space-y-2">
              <Label>Proposed Land Use</Label>
              <Controller
                name="proposedLandUse"
                control={form.control}
                render={({ field }) => <Input {...field} />}
              />
            </div>

            <div className="space-y-2">
              <Label>Expected Project Start Date</Label>
              <Controller
                name="projectStartDate"
                control={form.control}
                render={({ field }) => <Input {...field} type="date" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Estimated Project Duration (months)</Label>
              <Controller
                name="projectDuration"
                control={form.control}
                render={({ field }) => <Input {...field} type="number" />}
              />
            </div>

            <div className="space-y-2">
              <Label>EIA Study Scope/Terms of Reference</Label>
              <Controller
                name="eiaStudyScope"
                control={form.control}
                render={({ field }) => <Textarea {...field} />}
              />
            </div>
          </div>
        );

      // Add other steps here...
      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>EIAR Application - Step {currentStep} of {steps.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit">Submit Application</Button>
        )}
      </div>
    </form>
  );
} 