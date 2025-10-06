import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/components/CartProvider';
import { Filter, Heart, ShoppingCart, Monitor, Cpu, HardDrive, MemoryStick, Fan, Zap, Headphones, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const iconMap = {
  Cpu, Monitor, MemoryStick, HardDrive, Fan, Zap, Headphones
};

const BuildPC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [builds, setBuilds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('low-to-high');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilds = async () => {
      let query = supabase.from('pc_builds').select('*, wishlist:pc_build_wishlist(user_id)');
      if (inStockOnly) query = query.eq('in_stock', true);
      if (priceMin) query = query.gte('price', parseInt(priceMin));
      if (priceMax) query = query.lte('price', parseInt(priceMax));
      if (selectedCategory) query = query.eq('category', selectedCategory);

      const { data, error } = await query;
      if (error) {
        toast({ title: 'Error fetching builds', description: error.message, variant: 'destructive' });
      } else {
        setBuilds(data.map(b => ({ ...b, isWishlisted: b.wishlist.length > 0 })));
      }
      setLoading(false);
    };
    fetchBuilds();
  }, [inStockOnly, priceMin, priceMax, selectedCategory, toast]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('pc_part_categories').select('*');
      if (error) {
        toast({ title: 'Error fetching categories', description: error.message, variant: 'destructive' });
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, [toast]);

  const handleWishlist = async (buildId: string, isWishlisted: boolean) => {
    if (!user) { toast({ title: 'Please login to wishlist items', variant: 'destructive' }); return; }
    if (isWishlisted) {
      const { error } = await supabase.from('pc_build_wishlist').delete().match({ user_id: user.id, build_id: buildId });
      if (error) { toast({ title: 'Error removing from wishlist', description: error.message, variant: 'destructive' }); }
      else { setBuilds(builds.map(b => b.id === buildId ? { ...b, isWishlisted: false } : b)); }
    } else {
      const { error } = await supabase.from('pc_build_wishlist').insert({ user_id: user.id, build_id: buildId });
      if (error) { toast({ title: 'Error adding to wishlist', description: error.message, variant: 'destructive' }); }
      else { setBuilds(builds.map(b => b.id === buildId ? { ...b, isWishlisted: true } : b)); }
    }
  };

  const sortedBuilds = [...builds].sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price;
    if (sortBy === 'high-to-low') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2"><Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={(checked) => setInStockOnly(checked === true)} /><Label htmlFor="in-stock" className="text-sm font-medium">In Stock Only</Label></div>
                <div>
                  <Label className="mb-3 block text-sm font-medium">PRICE</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="₹" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="h-9" />
                    <span className="text-muted-foreground">to</span>
                    <Input placeholder="₹" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-9" />
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block text-sm font-medium">CATEGORIES</Label>
                  <div className="space-y-2">
                    <div onClick={() => setSelectedCategory(null)} className={`transition-smooth flex cursor-pointer items-center justify-between rounded-lg p-2 ${!selectedCategory ? 'bg-accent' : 'hover:bg-accent/50'}`}>All</div>
                    {categories.map((category) => {
                      const Icon = iconMap[category.icon as keyof typeof iconMap];
                      return (
                        <div key={category.id} onClick={() => setSelectedCategory(category.name)} className={`transition-smooth flex cursor-pointer items-center justify-between rounded-lg p-2 ${selectedCategory === category.name ? 'bg-accent' : 'hover:bg-accent/50'}`}>
                          <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /><span className="text-sm">{category.name}</span></div>
                          <span className="text-xs text-muted-foreground">({category.count})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div><h1 className="mb-2 text-3xl font-bold">Custom PC</h1><p className="text-muted-foreground">Build your dream PC with our custom configurations</p></div>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[200px]"><SelectValue placeholder="Sort by price" /></SelectTrigger><SelectContent><SelectItem value="low-to-high">Price: Low to High</SelectItem><SelectItem value="high-to-low">Price: High to Low</SelectItem></SelectContent></Select>
                <span className="text-sm text-muted-foreground">{sortedBuilds.length} Products</span>
              </div>
            </div>
            {loading ? <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedBuilds.map((build) => (
                  <Card key={build.id} className="transition-smooth group overflow-hidden border-glass bg-gradient-card backdrop-blur-glass hover:shadow-glow">
                    <div className="relative">
                      <div className="bg-gradient-subtle flex aspect-square items-center justify-center rounded-t-lg"><Monitor className="h-24 w-24 text-primary/30" /></div>
                      <Button variant="ghost" size="icon" className={`absolute right-3 top-3 ${build.isWishlisted ? 'text-red-500' : 'text-muted-foreground'}`} onClick={() => handleWishlist(build.id, build.isWishlisted)}><Heart className={`h-5 w-5 ${build.isWishlisted ? 'fill-current' : ''}`} /></Button>
                      {!build.inStock && <div className="absolute inset-0 flex items-center justify-center rounded-t-lg bg-black/60"><span className="font-medium text-white">Out of Stock</span></div>}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="transition-smooth mb-2 text-lg font-semibold group-hover:text-primary">{build.name}</h3>
                      <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                        <div>CPU: {build.specs.processor}</div>
                        <div>GPU: {build.specs.graphics}</div>
                        <div>RAM: {build.specs.memory}</div>
                        <div>Storage: {build.specs.storage}</div>
                      </div>
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">₹{build.price.toLocaleString()}</span>
                        {build.originalPrice > build.price && <span className="text-lg text-muted-foreground line-through">₹{build.originalPrice.toLocaleString()}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">Compare</Button>
                        <Button variant="gradient" size="sm" className="flex-1" disabled={!build.inStock} onClick={() => addToCart({ id: build.id, name: build.name, price: build.price, quantity: 1, image: '' })}><ShoppingCart className="mr-2 h-4 w-4" />{build.inStock ? 'Add to Cart' : 'Out of Stock'}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {sortedBuilds.length === 0 && (
                  <div className="py-16 text-center md:col-span-2 xl:col-span-3">
                    <Monitor className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h3 className="mb-2 text-xl font-semibold">No PC builds found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildPC;
