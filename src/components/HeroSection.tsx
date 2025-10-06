import ProductSlideshow from './ProductSlideshow'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <section className="flex min-h-screen items-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-20">
        <div className="space-y-12 text-center">
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              Your Electronics{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Hub
              </span>
            </h1>
            <p className="text-2xl font-semibold text-primary">
              Get 6 Months Free Service on Every Purchase from AKOE
            </p>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              One-stop destination for all your electronics needs. Professional
              repair services, genuine parts, and complete marketplace for
              electronics.
            </p>
          </div>

          {/* Product Slideshow */}
          <ProductSlideshow />

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
            <Button
              variant="gradient"
              size="lg"
              className="h-auto px-8 py-6 text-lg"
              onClick={() => (window.location.href = '/repair')}
            >
              Book Repair
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto px-8 py-6 text-lg"
              onClick={() => (window.location.href = '/store')}
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
