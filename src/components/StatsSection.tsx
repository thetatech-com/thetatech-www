const StatsSection = () => {
  const stats = [
    {
      number: '10,000+',
      label: 'Happy Customers',
    },
    {
      number: '50,000+',
      label: 'Devices Repaired',
    },
    {
      number: '500+',
      label: 'Products Available',
    },
    {
      number: '24/7',
      label: 'Support Available',
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl bg-gradient-primary p-8 shadow-glow md:p-12">
          <div className="grid grid-cols-2 gap-8 text-center text-white lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
