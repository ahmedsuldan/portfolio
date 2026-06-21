-- =====================================================
--  PORTFOLIO DATABASE SCHEMA (Supabase / PostgreSQL)
--  Ku dhej tan gudaha Supabase Dashboard -> SQL Editor -> Run
-- =====================================================

-- 1) PROFILES (xogta dheeraadka ah ee userka, marka la is diiwaan geliyo)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2) CONTACT MESSAGES (fariimaha laga soo diro contact form-ka)
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now(),
  is_read boolean default false
);

alter table public.contact_messages enable row level security;

-- Qof kasta (xitaa aan login gelin) wuu soo diri karaa fariin
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

-- Kaliya admin-ka (adiga) ayaa fariimaha akhrin kara (via service role / dashboard)
-- Ma jirto select policy oo public ah si fariimuhu u ahaadaan kuwo qarsoon.

-- 3) PROJECTS (haddii aad rabto inaad database-ka kaga maamusho projects-ka
--    halkii aad code-ka ku qori lahayd — ikhtiyaari)
create table if not exists public.projects (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  image_url text,
  technologies text[],
  category text,
  demo_url text,
  github_url text,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Anyone can view projects"
  on public.projects for select
  using (true);

-- 4) Function: marka user cusub uu is diiwaan geliyo, si toos ah profile loo abuuro
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================
-- DHAMMAAD — si fudud koobi geli oo ku dhej SQL Editor-ka Supabase
-- =====================================================
