create extension if not exists pgcrypto;

create table if not exists public.gabynails_site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text,
  tagline text,
  about_title text,
  about_text text,
  about_image_url text,
  course_title text,
  course_subtitle text,
  course_text text,
  course_image_url text,
  course_benefits text,
  course_modules text,
  cta_title text,
  cta_subtitle text,
  address text,
  phone text,
  whatsapp text,
  whatsapp_staff text,
  whatsapp_gaby text,
  course_whatsapp text,
  services_whatsapp text,
  instagram text,
  working_hours text,
  maps_embed_url text,
  primary_color text default '#D4AF37',
  whatsapp_float boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  cta_text text,
  cta_link text,
  "order" integer default 1,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration text,
  price_from numeric,
  image_url text,
  category text,
  "order" integer default 1,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  featured boolean default false,
  "order" integer default 1,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  specialty text,
  active boolean default true,
  "order" integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text not null,
  client_email text,
  service_id text,
  service_name text not null,
  professional_id text,
  professional_name text,
  date date not null,
  time text not null,
  status text default 'pendente',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  professional_id text not null,
  professional_name text,
  date date not null,
  time text not null,
  reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer default 5,
  photo_url text,
  service text,
  "order" integer default 1,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  "order" integer default 1,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.gabynails_course_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  city text,
  level text,
  question text,
  status text default 'novo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'gabynails_site_settings',
    'gabynails_hero_slides',
    'gabynails_services',
    'gabynails_portfolio_items',
    'gabynails_professionals',
    'gabynails_appointments',
    'gabynails_schedule_blocks',
    'gabynails_testimonials',
    'gabynails_faq_items',
    'gabynails_course_inquiries'
  ]
  LOOP
    EXECUTE format('drop trigger if exists set_updated_at_%I on public.%I', t, t);
    EXECUTE format('create trigger set_updated_at_%I before update on public.%I for each row execute function public.set_updated_at()', t, t);
  END LOOP;
END $$;

alter table public.gabynails_site_settings enable row level security;
alter table public.gabynails_hero_slides enable row level security;
alter table public.gabynails_services enable row level security;
alter table public.gabynails_portfolio_items enable row level security;
alter table public.gabynails_professionals enable row level security;
alter table public.gabynails_appointments enable row level security;
alter table public.gabynails_schedule_blocks enable row level security;
alter table public.gabynails_testimonials enable row level security;
alter table public.gabynails_faq_items enable row level security;
alter table public.gabynails_course_inquiries enable row level security;

drop policy if exists "public can read gabynails site settings" on public.gabynails_site_settings;
create policy "public can read gabynails site settings" on public.gabynails_site_settings for select using (true);
drop policy if exists "public can read gabynails hero slides" on public.gabynails_hero_slides;
create policy "public can read gabynails hero slides" on public.gabynails_hero_slides for select using (true);
drop policy if exists "public can read gabynails services" on public.gabynails_services;
create policy "public can read gabynails services" on public.gabynails_services for select using (true);
drop policy if exists "public can read gabynails portfolio items" on public.gabynails_portfolio_items;
create policy "public can read gabynails portfolio items" on public.gabynails_portfolio_items for select using (true);
drop policy if exists "public can read gabynails professionals" on public.gabynails_professionals;
create policy "public can read gabynails professionals" on public.gabynails_professionals for select using (true);
drop policy if exists "public can read gabynails testimonials" on public.gabynails_testimonials;
create policy "public can read gabynails testimonials" on public.gabynails_testimonials for select using (true);
drop policy if exists "public can read gabynails faq items" on public.gabynails_faq_items;
create policy "public can read gabynails faq items" on public.gabynails_faq_items for select using (true);
drop policy if exists "public can create gabynails appointments" on public.gabynails_appointments;
create policy "public can create gabynails appointments" on public.gabynails_appointments for insert with check (true);
drop policy if exists "public can create gabynails course inquiries" on public.gabynails_course_inquiries;
create policy "public can create gabynails course inquiries" on public.gabynails_course_inquiries for insert with check (true);
drop policy if exists "public can read gabynails schedule blocks" on public.gabynails_schedule_blocks;
create policy "public can read gabynails schedule blocks" on public.gabynails_schedule_blocks for select using (true);

insert into public.gabynails_site_settings (brand_name)
select 'Gaby Nails Esmalteria'
where not exists (select 1 from public.gabynails_site_settings);

with ranked_settings as (
  select ctid, row_number() over (
    order by updated_at desc nulls last, created_at desc nulls last, id desc
  ) as rn
  from public.gabynails_site_settings
)
delete from public.gabynails_site_settings settings
using ranked_settings
where settings.ctid = ranked_settings.ctid
  and ranked_settings.rn > 1;

create unique index if not exists gabynails_site_settings_singleton
on public.gabynails_site_settings ((true));

insert into storage.buckets (id, name, public)
values ('gabynails-assets', 'gabynails-assets', true)
on conflict (id) do nothing;

drop policy if exists "public can read gabynails assets" on storage.objects;
create policy "public can read gabynails assets" on storage.objects for select using (bucket_id = 'gabynails-assets');
drop policy if exists "service role can write gabynails assets" on storage.objects;
create policy "service role can write gabynails assets" on storage.objects for all using (bucket_id = 'gabynails-assets') with check (bucket_id = 'gabynails-assets');

create unique index if not exists gabynails_unique_slot
on public.gabynails_appointments (professional_id, date, time)
where professional_id is not null and status in ('pendente', 'confirmado');

create unique index if not exists gabynails_unique_schedule_block
on public.gabynails_schedule_blocks (professional_id, date, time)
where professional_id is not null;
