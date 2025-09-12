import ServiceBookingForm from "@/components/service-booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Laptop, 
  Tablet,
  Monitor,
  Headphones,
  Gamepad2,
  Shield,
  Clock,
  Star,
  CheckCircle,
  Wrench,
  Settings,
  Cpu,
  HardDrive
} from "lucide-react";

export default function Repairs() {
  const services = [
    {
      icon: Smartphone,
      title: "Smartphone Repair",
      description: "Complete mobile device repair services",
      price: "Starting ₹500",
      features: [
        "Screen Replacement (LCD, OLED, AMOLED)",
        "Battery Replacement with Warranty",
        "Speaker & Microphone Repair",
        "Camera & Flash Issues",
        "Water Damage Repair",
        "Charging Port & Cable Issues",
        "Software & OS Problems",
        "Network & Connectivity Issues"
      ],
      color: "blue"
    },
    {
      icon: Laptop,
      title: "Laptop & Computer Repair",
      description: "Professional computer repair and maintenance",
      price: "Starting ₹800",
      features: [
        "Hardware Diagnostics & Repair",
        "Screen & Keyboard Replacement",
        "RAM & Storage Upgrades",
        "Motherboard Repair",
        "Cooling System Cleaning",
        "Software Installation & Setup",
        "Virus Removal & Security",
        "Data Recovery Services"
      ],
      color: "green"
    },
    {
      icon: Tablet,
      title: "Tablet Repair",
      description: "iPad and Android tablet repair services",
      price: "Starting ₹600",
      features: [
        "Touchscreen Replacement",
        "Battery Replacement",
        "Charging Port Repair",
        "Speaker & Audio Issues",
        "Camera Problems",
        "Software Troubleshooting",
        "Water Damage Assessment",
        "Case & Frame Repair"
      ],
      color: "purple"
    },
    {
      icon: Gamepad2,
      title: "Gaming Console Repair",
      description: "PlayStation, Xbox, and Nintendo repairs",
      price: "Starting ₹1000",
      features: [
        "Controller Repair & Replacement",
        "HDMI Port Issues",
        "Overheating Problems",
        "Disc Drive Repair",
        "Network Connectivity",
        "Software Updates",
        "Storage Upgrades",
        "Performance Optimization"
      ],
      color: "red"
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "6 Months Warranty",
      description: "All repairs come with comprehensive warranty coverage"
    },
    {
      icon: Clock,
      title: "Same Day Service",
      description: "Most repairs completed within 24 hours"
    },
    {
      icon: Star,
      title: "Expert Technicians",
      description: "Certified professionals with 5+ years experience"
    },
    {
      icon: CheckCircle,
      title: "Genuine Parts",
      description: "We use only authentic parts and components"
    }
  ];

  const repairProcess = [
    {
      step: 1,
      title: "Free Diagnosis",
      description: "Quick 30-minute inspection to identify the issue",
      icon: Settings
    },
    {
      step: 2,
      title: "Quote & Approval",
      description: "Transparent pricing with no hidden costs",
      icon: Cpu
    },
    {
      step: 3,
      title: "Expert Repair",
      description: "Skilled technicians fix your device",
      icon: Wrench
    },
    {
      step: 4,
      title: "Quality Testing",
      description: "Thorough testing before device return",
      icon: HardDrive
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Professional Electronics Repair</h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Expert repair services for all your electronic devices. Fast, reliable, and backed by warranty.
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="repair-stat-warranty">6 Months</div>
            <div className="text-sm text-muted-foreground">Warranty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="repair-stat-time">Same Day</div>
            <div className="text-sm text-muted-foreground">Service</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="repair-stat-experience">5+ Years</div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary" data-testid="repair-stat-rating">4.9/5</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>
      </div>

      {/* Repair Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Repair Services</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${service.color}-500/20`}>
                      <IconComponent className={`h-6 w-6 text-${service.color}-500`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <p className="text-muted-foreground">{service.description}</p>
                      <p className="text-primary font-semibold">{service.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-3">Services Included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    data-testid={`button-book-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Book {service.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Repair Process */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Repair Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {repairProcess.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-primary/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm text-primary font-semibold mb-2">Step {step.step}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Our Repair Service?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-accent/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                    <IconComponent className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Booking Form */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">Book Your Repair Service</h2>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <ServiceBookingForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
