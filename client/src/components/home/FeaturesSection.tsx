import {
  Award,
  BookOpen,
  Users,
  FileText,
  GraduationCap,
  Shield
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Professional Certification",
      description: "We provide certification and professional development for town planners across Nigeria.",
      icon: <Award className="h-6 w-6" />
    },
    {
      title: "Knowledge Resources",
      description: "Access to cutting-edge research, tools and educational resources for urban planning.",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: "Professional Network",
      description: "Join a community of planning professionals to share knowledge and opportunities.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Site Analysis Reports",
      description: "Official SAR and EIAR certification for urban development projects.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Continuous Learning",
      description: "E-learning platform with courses specific to urban planning in the Nigerian context.",
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      title: "Ethical Standards",
      description: "We uphold the highest ethical standards in urban planning practices.",
      icon: <Shield className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-secondary font-semibold tracking-wide uppercase">Our Mission</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-primary dark:text-white sm:text-4xl">
            Advancing Urban Planning in Nigeria
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 dark:text-neutral-400 lg:mx-auto">
            The Nigerian Institute of Town Planners (NITP) is committed to promoting sustainable urban development and ethical practices in planning.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-start p-6 bg-neutral-50 dark:bg-neutral-700 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-600"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-medium text-neutral-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
