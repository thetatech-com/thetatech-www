import { Smartphone, Laptop, Wrench, Zap, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const QuickAccess = () => {
  const categories = [
    {
      icon: Smartphone,
      title: 'Smartphones',
      href: '/marketplace/smartphones',
    },
    {
      icon: Laptop,
      title: 'Laptops',
      href: '/marketplace/laptops',
    },
    {
      icon: Wrench,
      title: 'Repairs',
      href: '/services',
    },
    {
      icon: Settings,
      title: 'Build PC',
      href: '/build-pc',
    },
    {
      icon: Zap,
      title: 'Accessories',
      href: '/marketplace/accessories',
    },
  ]

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Quick Access</h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link to={category.href} key={index}>
                <Card className="transition-smooth group cursor-pointer border-glass bg-gradient-card p-6 text-center backdrop-blur-glass hover:shadow-glow">
                  <div className="transition-smooth mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary group-hover:scale-110">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold">{category.title}</h3>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default QuickAccess
