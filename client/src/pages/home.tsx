import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import DealOfTheDay from "@/components/deal-of-the-day";
import ProductCard from "@/components/product-card";
import ServiceBookingForm from "@/components/service-booking-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Smartphone, 
  Laptop, 
  Wrench, 
  Headphones,
  Shield,
  Users,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Gamepad2,
  Monitor,
  Zap,
  Trophy
} from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
  });

  const { data: dealProduct } = useQuery<Product>({
    queryKey: ['/api/products/5'], // iPad Air M2
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">Your Electronics Hub</h1>
            <p className="text-lg text-muted-foreground mb-6">Services • Marketplace • Repairs</p>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              One-stop destination for all your electronics needs. Professional repair services, genuine parts, and complete marketplace for electronics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/repairs">
                <Button 
                  className="pulse-ring bg-primary text-primary-foreground hover:bg-primary/90" 
                  data-testid="button-book-repair"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Book Repair
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button 
                  variant="secondary" 
                  className="touch-feedback" 
                  data-testid="button-browse-store"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Browse Store
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Service Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-accent text-2xl font-bold" data-testid="stat-warranty">6 months</div>
                <div className="text-sm text-muted-foreground">Warranty</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-accent text-2xl font-bold" data-testid="stat-service">Same day</div>
                <div className="text-sm text-muted-foreground">Fast Service</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-accent text-2xl font-bold" data-testid="stat-experience">5+ years</div>
                <div className="text-sm text-muted-foreground">Expert Tech</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="text-accent text-2xl font-bold" data-testid="stat-rating">4.9/5</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/marketplace?category=smartphones">
              <Card className="hover:bg-card/80 transition-colors touch-feedback cursor-pointer" data-testid="category-smartphones">
                <CardContent className="p-4">
                  <div className="text-primary text-3xl mb-2 text-center">
                    <Smartphone className="mx-auto" />
                  </div>
                  <div className="text-center font-medium">Smartphones</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/marketplace?category=laptops">
              <Card className="hover:bg-card/80 transition-colors touch-feedback cursor-pointer" data-testid="category-laptops">
                <CardContent className="p-4">
                  <div className="text-primary text-3xl mb-2 text-center">
                    <Laptop className="mx-auto" />
                  </div>
                  <div className="text-center font-medium">Laptops</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/repairs">
              <Card className="hover:bg-card/80 transition-colors touch-feedback cursor-pointer" data-testid="category-repairs">
                <CardContent className="p-4">
                  <div className="text-primary text-3xl mb-2 text-center">
                    <Wrench className="mx-auto" />
                  </div>
                  <div className="text-center font-medium">Repairs</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/marketplace?category=accessories">
              <Card className="hover:bg-card/80 transition-colors touch-feedback cursor-pointer" data-testid="category-accessories">
                <CardContent className="p-4">
                  <div className="text-primary text-3xl mb-2 text-center">
                    <Headphones className="mx-auto" />
                  </div>
                  <div className="text-center font-medium">Accessories</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      {dealProduct && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <DealOfTheDay product={dealProduct} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/marketplace">
              <Button variant="link" className="text-primary hover:text-primary/80" data-testid="link-view-all">
                View All →
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>
          <p className="text-center text-muted-foreground mb-8">
            Comprehensive electronics solutions - from repair services to complete marketplace
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/20 p-3 rounded-lg mr-4">
                    <Smartphone className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Phone Repair Services</h3>
                    <p className="text-muted-foreground">Starting from ₹500</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Complete mobile repair solutions including screen replacement, battery replacement, 
                  speaker & mic repair, network issues, water damage repair, charging port repair, 
                  and all other smartphone related services
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">What's Included:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Screen Replacement (LCD, OLED, AMOLED)</li>
                    <li>• Battery Replacement with Warranty</li>
                    <li>• Speaker & Microphone Repair</li>
                    <li>• Network & Connectivity Issues</li>
                  </ul>
                </div>
                
                <Link href="/repairs">
                  <Button className="w-full" data-testid="button-book-phone-repair">
                    <Clock className="mr-2 h-4 w-4" />
                    Book Repair
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-accent/20 p-3 rounded-lg mr-4">
                    <Laptop className="text-accent text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Electronics Marketplace</h3>
                    <p className="text-muted-foreground">Starting from ₹800</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your one-stop electronics marketplace offering computers, laptops, TVs, gaming consoles, 
                  home appliances, and custom PC builds with professional assembly and upgrade services
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">What's Included:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Computer Assembly & Custom Builds</li>
                    <li>• Laptop & TV Repair Services</li>
                    <li>• Gaming Console Repairs</li>
                    <li>• Data Recovery Solutions</li>
                  </ul>
                </div>
                
                <Link href="/marketplace">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" data-testid="button-browse-electronics">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Browse Electronics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PC Build Section */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Build Your Dream PC</h2>
            <p className="text-muted-foreground">
              Power meets precision. Experience high-performance builds with sleek aesthetics and optimized cooling for peak performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow touch-feedback">
              <CardContent className="p-6 text-center">
                <div className="bg-red-500/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                  <Gamepad2 className="text-red-500 text-3xl" />
                </div>
                <h3 className="font-semibold mb-2">Gaming Beast</h3>
                <h4 className="text-lg font-bold mb-2">Custom Gaming PC Build</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  High-performance gaming rigs with RGB lighting and premium cooling
                </p>
                <div className="text-primary font-bold mb-4">Starting from ₹45,000</div>
                <Button 
                  className="w-full bg-red-500 text-white hover:bg-red-600" 
                  data-testid="button-start-gaming-build"
                >
                  Start Building
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow touch-feedback">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-500/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                  <Monitor className="text-blue-500 text-3xl" />
                </div>
                <h3 className="font-semibold mb-2">Power Station</h3>
                <h4 className="text-lg font-bold mb-2">Workstation PCs</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional workstations for content creation and productivity
                </p>
                <div className="text-primary font-bold mb-4">Starting from ₹60,000</div>
                <Button 
                  className="w-full bg-blue-500 text-white hover:bg-blue-600" 
                  data-testid="button-start-workstation-build"
                >
                  Start Building
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow touch-feedback">
              <CardContent className="p-6 text-center">
                <div className="bg-green-500/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                  <Zap className="text-green-500 text-3xl" />
                </div>
                <h3 className="font-semibold mb-2">Boost Power</h3>
                <h4 className="text-lg font-bold mb-2">Performance Upgrades</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  CPU, GPU, RAM, SSD upgrades for existing systems
                </p>
                <div className="text-primary font-bold mb-4">Starting from ₹8,000</div>
                <Button 
                  className="w-full bg-green-500 text-white hover:bg-green-600" 
                  data-testid="button-start-upgrade"
                >
                  Start Building
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow touch-feedback">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-500/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                  <Trophy className="text-purple-500 text-3xl" />
                </div>
                <h3 className="font-semibold mb-2">Console Gaming</h3>
                <h4 className="text-lg font-bold mb-2">Gaming Consoles</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Latest PlayStation, Xbox and gaming accessories
                </p>
                <div className="text-primary font-bold mb-4">Starting from ₹25,000</div>
                <Button 
                  className="w-full bg-purple-500 text-white hover:bg-purple-600" 
                  data-testid="button-start-console-build"
                >
                  Start Building
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose MOBO?</h2>
          <p className="text-center text-muted-foreground mb-8">
            Your trusted electronics partner with years of experience in repair services and electronics marketplace. 
            We combine quality service with competitive prices.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-customers">10,000+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-devices">50,000+</div>
              <div className="text-muted-foreground">Devices Repaired</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-service-time">Same Day</div>
              <div className="text-muted-foreground">Service Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="stat-warranty-period">6 Months</div>
              <div className="text-muted-foreground">Warranty Period</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                <Shield className="text-primary text-2xl" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">6 months warranty on all repairs</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                <Users className="text-accent text-2xl" />
              </div>
              <h3 className="font-semibold mb-2">Expert Technicians</h3>
              <p className="text-muted-foreground">Certified professionals with 5+ years experience</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 p-4 rounded-lg mb-4 mx-auto w-fit">
                <Clock className="text-blue-500 text-2xl" />
              </div>
              <h3 className="font-semibold mb-2">Fast Service</h3>
              <p className="text-muted-foreground">Same day repairs and quick marketplace delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Get In Touch</h2>
          <p className="text-center text-muted-foreground mb-8">
            Ready to fix your device or shop electronics? Contact us today for fast service.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Store Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Store Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground" data-testid="store-location">Western Hills, Baner, Pune</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">Call Us</div>
                      <div className="text-muted-foreground" data-testid="store-phone">+91 9373547424</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground" data-testid="store-email">info@moborepair.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">Hours</div>
                      <div className="text-muted-foreground" data-testid="store-hours">Mon-Sat: 9AM-8PM</div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium mb-4">Secure Payment Options</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 text-primary h-4 w-4" />
                      Credit/Debit Cards
                    </div>
                    <div className="flex items-center">
                      <Smartphone className="mr-2 text-primary h-4 w-4" />
                      UPI Payments
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-2 text-primary h-4 w-4" />
                      Cash on Service
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 text-primary h-4 w-4" />
                      Bank Transfer
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Service Booking Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Book Your Service</h3>
                <ServiceBookingForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
