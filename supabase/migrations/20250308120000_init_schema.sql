/*
  # Kisses Tablosu Kurulumu
  
  Bu migration dosyası, uygulamanın temel fonksiyonu olan öpücük (konum) verilerini saklamak için gerekli tabloyu oluşturur.

  ## Yapı Detayları:
  - Tablo: `public.kisses`
  - Kolonlar: 
    - `id` (UUID, Primary Key)
    - `user_id` (UUID, auth.users tablosuna referans)
    - `lat` (Latitude - Enlem)
    - `lng` (Longitude - Boylam)
    - `created_at` (Oluşturulma tarihi)

  ## Güvenlik (RLS):
  - Row Level Security (RLS) aktif edilir.
  - Kullanıcılar sadece kendi ekledikleri verileri görebilir, ekleyebilir ve silebilir.
*/

-- Kisses tablosunu oluştur
create table if not exists public.kisses (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  lat double precision not null,
  lng double precision not null,
  created_at timestamp with time zone not null default now(),
  constraint kisses_pkey primary key (id),
  constraint kisses_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);

-- RLS'i aktif et
alter table public.kisses enable row level security;

-- Okuma politikası (Sadece kendi verileri)
create policy "Kullanıcılar kendi öpücüklerini görebilir" on public.kisses
  for select using (auth.uid() = user_id);

-- Ekleme politikası
create policy "Kullanıcılar öpücük ekleyebilir" on public.kisses
  for insert with check (auth.uid() = user_id);

-- Silme politikası
create policy "Kullanıcılar kendi öpücüklerini silebilir" on public.kisses
  for delete using (auth.uid() = user_id);
