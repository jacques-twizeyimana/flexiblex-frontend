import {
  ArrowRight,
  Clock,
  DollarSign,
  Users2,
  Calculator,
  Shield,
  Gift,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">
            Ishema Payroll
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-gray-900" />
          <div className="relative container mx-auto px-4 py-32">
            <div className="text-center max-w-4xl mx-auto">
              {/* <div className="inline-block mb-6 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Modernizing Payroll Management
                </span>
              </div> */}
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Automate your payroll process
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Transform your payroll management with Ishema Payroll.
                Streamline payments, taxes, and employee benefits all in one
                powerful platform.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/signup">
                  <Button
                    size="xxl"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Get started <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              Everything You Need in One Platform
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users2 className="w-12 h-12 text-green-600" />}
                title="Employee Management"
                description="Efficiently manage employee records, from onboarding to role changes and departures."
              />
              <FeatureCard
                icon={<Calculator className="w-12 h-12 text-green-600" />}
                title="Payroll Configuration"
                description="Customize pay periods, salary structures, and payment types to fit your needs."
              />
              <FeatureCard
                icon={<Clock className="w-12 h-12 text-green-600" />}
                title="Time & Attendance"
                description="Track working hours, manage leave requests, and monitor overtime automatically."
              />
              <FeatureCard
                icon={<DollarSign className="w-12 h-12 text-green-600" />}
                title="Automated Processing"
                description="Generate payslips and reports with just a few clicks."
              />
              <FeatureCard
                icon={<Shield className="w-12 h-12 text-green-600" />}
                title="Tax Compliance"
                description="Stay compliant with automatic tax calculations based on local laws."
              />
              <FeatureCard
                icon={<Gift className="w-12 h-12 text-green-600" />}
                title="Benefits Administration"
                description="Manage employee benefits, deductions, and contributions effortlessly."
              />
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-green-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">
                Trusted by Growing Companies
              </h3>
            </div>
            <div className="flex justify-center items-center gap-12">
              {/* Add company logos here */}
              <div className="text-2xl text-red-600 font-bold">ALU</div>
              <div className="text-2xl font-bold">SBS Ssystems</div>
              <div className="text-2xl text-green-600 font-bold">
                Ishema Payroll Inc.
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-600 dark:bg-green-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Payroll?
            </h2>
            <p className="text-xl mb-8 text-green-50">
              Join thousands of companies already using Ishema Payroll
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                Get Started Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            © 2024 Ishema Payroll. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
