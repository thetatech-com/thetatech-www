import HeroSection from '@/components/HeroSection'
import QuickAccess from '@/components/QuickAccess'
import StatsSection from '@/components/StatsSection'
import ServicesSection from '@/components/ServicesSection'
import BuildPCSection from '@/components/BuildPCSection'

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <QuickAccess />
      <StatsSection />
      <ServicesSection />
      <BuildPCSection />
    </div>
  )
}

export default Index
