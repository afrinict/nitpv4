import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMembershipFee } from "@/lib/utils";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRegistration: (type: string) => void;
  onLoginClick: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onStartRegistration,
  onLoginClick,
}: RegistrationModalProps) {
  const membershipTypes = [
    {
      type: "student",
      title: "Student",
      description: "For currently enrolled students in urban planning programs.",
      fee: getMembershipFee("STUDENT"),
    },
    {
      type: "associate",
      title: "Associate",
      description: "For recent graduates and junior planning professionals.",
      fee: getMembershipFee("ASSOCIATE"),
    },
    {
      type: "professional",
      title: "Professional",
      description: "For qualified urban planning professionals.",
      fee: getMembershipFee("PROFESSIONAL"),
    },
    {
      type: "fellow",
      title: "Fellow",
      description: "For distinguished members with significant contributions to the field.",
      fee: getMembershipFee("FELLOW"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            Register for NITP Membership
          </DialogTitle>
          <DialogDescription>
            Select the membership type you're applying for:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {membershipTypes.map((membership) => (
              <button
                key={membership.type}
                onClick={() => onStartRegistration(membership.type)}
                className="p-4 border border-neutral-300 rounded-lg text-left hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-neutral-900 dark:text-white">
                    {membership.title}
                  </h4>
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                    ₦{membership.fee.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  {membership.description}
                </p>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-neutral-500">
            * All membership applications are subject to verification and approval by NITP.
          </p>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">
                Already a member?
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={onLoginClick}
          >
            Log In to Your Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
