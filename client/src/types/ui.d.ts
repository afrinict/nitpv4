declare module '@/components/ui/*' {
  import { ComponentType, ReactNode } from 'react';
  
  // Button and its variants
  export const Button: ComponentType<any>;
  export const buttonVariants: (props: any) => string;
  export type ButtonProps = any;

  // Dialog components
  export const Dialog: ComponentType<any>;
  export const DialogContent: ComponentType<any>;
  export const DialogDescription: ComponentType<any>;
  export const DialogHeader: ComponentType<any>;
  export const DialogTitle: ComponentType<any>;

  // Form components
  export const Form: ComponentType<any>;
  export const FormControl: ComponentType<any>;
  export const FormDescription: ComponentType<any>;
  export const FormField: ComponentType<any>;
  export const FormItem: ComponentType<any>;
  export const FormLabel: ComponentType<any>;
  export const FormMessage: ComponentType<any>;

  // Input components
  export const Input: ComponentType<any>;
  export const Textarea: ComponentType<any>;
  export const Label: ComponentType<any>;
  export const Checkbox: ComponentType<any>;

  // Select components
  export const Select: ComponentType<any>;
  export const SelectContent: ComponentType<any>;
  export const SelectItem: ComponentType<any>;
  export const SelectTrigger: ComponentType<any>;
  export const SelectValue: ComponentType<any>;

  // Toast components
  export const Toast: ComponentType<any>;
  export const ToastActionElement: ComponentType<any>;
  export const ToastClose: ComponentType<any>;
  export const ToastDescription: ComponentType<any>;
  export const ToastProvider: ComponentType<any>;
  export const ToastTitle: ComponentType<any>;
  export const ToastViewport: ComponentType<any>;
  export type ToastProps = any;

  // Sheet components
  export const Sheet: ComponentType<any>;
  export const SheetContent: ComponentType<any>;
  export const SheetDescription: ComponentType<any>;
  export const SheetHeader: ComponentType<any>;
  export const SheetTitle: ComponentType<any>;

  // Other UI components
  export const Separator: ComponentType<any>;
  export const Skeleton: ComponentType<any>;
  export const Tooltip: ComponentType<any>;
  export const TooltipContent: ComponentType<any>;
  export const TooltipProvider: ComponentType<any>;
  export const TooltipTrigger: ComponentType<any>;
}

declare module '@/lib/utils' {
  export function cn(...inputs: any[]): string;
  export function formatCurrency(amount: number): string;
  export function formatDate(date: string | Date): string;
  export function formatTimeAgo(date: string | Date): string;
  export function formatShortDate(date: string | Date): string;
  export function getMembershipFee(): number;
}

declare module '@/hooks/use-auth' {
  export interface User {
    id: number;
    username: string;
    email: string;
    role: 'MEMBER' | 'ADMINISTRATOR' | 'FINANCIAL_ADMINISTRATOR' | 'FINANCIAL_OFFICER' | 'FINANCIAL_AUDITOR' | 'ETHICS_OFFICER';
    firstName?: string;
    lastName?: string;
    phone?: string;
  }

  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    hasRole: (role: string) => boolean;
    logout: () => void;
  }

  export function useAuth(): AuthContextType;
}

declare module '@/hooks/use-toast' {
  export interface Toast {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
  }

  export function useToast(): {
    toast: (props: any) => void;
    toasts: Toast[];
  };
}

declare module '@/hooks/use-mobile' {
  export function useIsMobile(): boolean;
}

declare module '@/lib/queryClient' {
  export function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;
}

declare module '@shared/schema' {
  export const projectSectorEnum: Record<string, string>;
  export const impactSignificanceEnum: Record<string, string>;
}

// Add Jest DOM matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
} 