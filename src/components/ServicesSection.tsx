import { Smartphone, ShoppingCart, CheckCircle, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const ServicesSection = () => {
  const services = [
    {
      icon: Smartphone,
      title: 'Phone Repair Services',
      description:
        'Complete mobile repair solutions including screen replacement, battery replacement, speaker & mic repair, network issues, water damage repair, charging port repair, and all other smartphone related services',
      price: 'Starting from ₹500',
      features: [
        'Screen Replacement (LCD, OLED, AMOLED)',
        'Battery Replacement with Warranty',
        'Speaker & Microphone Repair',
        'Network & Connectivity Issues',
      ],
      buttonText: 'Book Repair',
    },
    {
      icon: ShoppingCart,
      title: 'Electronics Marketplace',
      description:
        'Browse our extensive collection of electronics including smartphones, laptops, accessories, and genuine replacement parts from trusted brands',
      price: 'Best Prices Guaranteed',
      features: [
        'Latest Smartphones & Tablets',
        'Laptops & Computers',
        'Genuine Accessories',
        'Replacement Parts & Components',
      ],
      buttonText: 'Browse Store',
    },
  ]

  return (
    <section id="services" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Our{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Comprehensive electronics solutions - from repair services to
            complete marketplace
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="transition-smooth border-glass bg-card/80 p-8 shadow-card backdrop-blur-glass hover:shadow-glow"
              >
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-primary">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                      <p className="leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {service.price}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="gradient" size="lg" className="w-full">
                    {service.buttonText}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
