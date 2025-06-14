
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'swapped')),
  category TEXT NOT NULL,
  location TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create swap_requests table
CREATE TABLE public.swap_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Anyone can view available products" 
  ON public.products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own products" 
  ON public.products 
  FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own products" 
  ON public.products 
  FOR DELETE 
  USING (auth.uid() = owner_id);

-- Enable RLS on swap_requests table
ALTER TABLE public.swap_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for swap_requests table
CREATE POLICY "Users can view swap requests for their products or requests they made" 
  ON public.swap_requests 
  FOR SELECT 
  USING (
    auth.uid() = requester_id OR 
    auth.uid() IN (SELECT owner_id FROM public.products WHERE id = product_id)
  );

CREATE POLICY "Users can insert swap requests" 
  ON public.swap_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Product owners can update swap requests for their products" 
  ON public.swap_requests 
  FOR UPDATE 
  USING (
    auth.uid() IN (SELECT owner_id FROM public.products WHERE id = product_id)
  );

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Create policy for product images storage
CREATE POLICY "Anyone can view product images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own product images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own product images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
