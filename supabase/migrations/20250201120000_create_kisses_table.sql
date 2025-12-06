/*
  # Create Kisses Table
  Creates a table to store kiss locations for users.

  ## Query Description:
  This query creates a 'kisses' table with latitude, longitude, and user association.
  It enables RLS and adds policies for users to insert their own kisses and view them.

  ## Metadata:
  - Schema-Category: "Data"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: kisses
  - Columns: id, user_id, lat, lng, created_at
  - Constraints: Foreign key to auth.users
*/

-- Create the table
CREATE TABLE IF NOT EXISTS public.kisses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.kisses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own kisses"
    ON public.kisses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own kisses"
    ON public.kisses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Optional: Allow users to see all kisses (Social feature)
-- Uncomment the below line and comment out the above SELECT policy if you want a shared map
-- CREATE POLICY "Users can view all kisses" ON public.kisses FOR SELECT USING (true);
