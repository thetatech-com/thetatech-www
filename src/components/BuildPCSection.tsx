import {
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Settings,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const BuildPCSection = () => {
  const buildOptions = [
    {
      icon: Cpu,
      title: 'Gaming PC Build',
      description:
        'High-performance gaming rigs with latest graphics cards and processors for ultimate gaming experience',
      price: 'Starting from ₹45,000',
      features: [
        'Latest AMD Ryzen / Intel Core processors',
        'NVIDIA RTX / AMD RX graphics cards',
        '16GB+ DDR4/DDR5 RAM',
        'SSD + HDD storage options',
      ],
      popular: true,
    },
    {
      icon: Monitor,
      title: 'Workstation Build',
      description:
        'Professional workstations for content creation, 3D rendering, video editing, and professional work',
      price: 'Starting from ₹35,000',
      features: [
        'Multi-core processors for productivity',
        'Professional graphics solutions',
        '32GB+ ECC RAM options',
        'High-speed NVMe storage',
      ],
      popular: false,
    },
    {
      icon: HardDrive,
      title: 'Budget PC Build',
      description:
        'Affordable custom builds perfect for office work, study, and light gaming without compromising quality',
      price: 'Starting from ₹25,000',
      features: [
        'Efficient entry-level processors',
        'Integrated or budget graphics',
        '8GB DDR4 RAM',
        'SSD for fast boot times',
      ],
      popular: false,
    },
  ]

  const buildProcess = [
    {
      icon: Settings,
      title: 'Consultation',
      description: 'Discuss your requirements and budget',
    },
    {
      icon: Cpu,
      title: 'Component Selection',
      description: 'Choose the best parts for your needs',
    },
    {
      icon: Zap,
      title: 'Assembly & Testing',
      description: 'Professional build and thorough testing',
    },
    {
      icon: CheckCircle,
      title: 'Delivery & Support',
      description: 'Setup assistance and warranty coverage',
    },
  ]

  return (
    <section id="build-pc" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Custom{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              PC Builds
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Professional custom PC building services tailored to your specific
            needs and budget
          </p>
        </div>

        {/* Build Options */}
        <div className="mx-auto mb-16 grid max-w-7xl gap-8 lg:grid-cols-3">
          {buildOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <Card
                key={index}
                className={`transition-smooth relative border-glass bg-card/80 p-8 shadow-card backdrop-blur-glass hover:shadow-glow ${option.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-gradient-primary px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-primary">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{option.title}</h3>
                      <p className="leading-relaxed text-muted-foreground">
                        {option.description}
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {option.price}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold">Includes:</h4>
                    <ul className="space-y-2">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="gradient" size="lg" className="w-full">
                    Get Quote
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Build Process */}
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-12 text-center text-3xl font-bold">
            Our Build{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Process
            </span>
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {buildProcess.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {index < buildProcess.length - 1 && (
                    <div className="absolute left-full top-8 hidden h-px w-full translate-x-1/2 transform bg-gradient-primary opacity-30 lg:block" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuildPCSection
