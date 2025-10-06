import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    image: '/placeholder.svg',
    badge: 'New',
    description: 'Latest iPhone with titanium design and A17 Pro chip',
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    price: 2499,
    originalPrice: 2699,
    rating: 4.9,
    image: '/placeholder.svg',
    badge: 'Sale',
    description: 'Powerful laptop with M3 Max chip for professionals',
  },
  {
    id: 3,
    name: 'AirPods Pro 3rd Gen',
    price: 249,
    originalPrice: 279,
    rating: 4.7,
    image: '/placeholder.svg',
    badge: 'Popular',
    description: 'Advanced noise cancellation and spatial audio',
  },
  {
    id: 4,
    name: 'PlayStation 5',
    price: 499,
    rating: 4.8,
    image: '/placeholder.svg',
    badge: 'Hot',
    description: 'Next-gen gaming console with ultra-fast SSD',
  },
  {
    id: 5,
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299,
    rating: 4.7,
    image: '/placeholder.svg',
    description: 'Premium Android phone with S Pen and AI features',
  },
]

const ProductSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
  }

  const currentProduct = products[currentSlide]

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <Card className="overflow-hidden border-glass bg-gradient-card shadow-glow backdrop-blur-glass">
        <CardContent className="p-0">
          <div className="grid gap-0 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-8">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="h-48 w-full object-contain"
              />
              {currentProduct.badge && (
                <Badge className="absolute left-4 top-4 bg-gradient-primary text-white">
                  {currentProduct.badge}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-4 p-8">
              <div>
                <h3 className="mb-2 text-2xl font-bold">
                  {currentProduct.name}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {currentProduct.description}
                </p>

                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{currentProduct.rating}</span>
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${currentProduct.price}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${currentProduct.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="gradient" className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Slide Indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-primary'
                : 'bg-muted hover:bg-muted-foreground/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductSlideshow
