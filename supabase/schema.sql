-- =========================================================
-- MyJournal Database Schema
-- Run this in your Supabase SQL editor (in order)
-- =========================================================

-- 1. Enable UUID extension (already enabled in Supabase)
create extension if not exists "uuid-ossp";

-- 2. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null,
  avatar_url  text,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 3. Journal entries table
create table public.journal_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  entry       text,
  memory      text,       -- "I'll remember today by..."
  gratitude   text,       -- Gratitude prompt
  situation   text,       -- What I asked for / situations faced
  reflection  text,       -- Daily reflection
  mood        text,       -- great | good | okay | low | terrible
  created_at  timestamptz default now()
);
alter table public.journal_entries enable row level security;
create policy "Users can manage own entries" on public.journal_entries
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Expenses table
create table public.expenses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  category    text not null,   -- food | transport | clothes | upskilling | health | invest | bills | ent | other
  amount      numeric(12, 2) not null check (amount > 0),
  note        text,
  created_at  timestamptz default now()
);
alter table public.expenses enable row level security;
create policy "Users can manage own expenses" on public.expenses
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Streaks table
create table public.streaks (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null unique references public.profiles(id) on delete cascade,
  current_streak   int not null default 0,
  longest_streak   int not null default 0,
  last_entry_date  date
);
alter table public.streaks enable row level security;
create policy "Users can manage own streak" on public.streaks
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Goals table (for productivity feature)
create table public.goals (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  goal_title  text not null,
  status      text not null default 'active',  -- active | achieved | dropped
  created_at  timestamptz default now()
);
alter table public.goals enable row level security;
create policy "Users can manage own goals" on public.goals
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Trigger: auto-create profile on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  insert into public.streaks (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- Sample data (optional — comment out in production)
-- =========================================================
-- insert into public.journal_entries (user_id, memory, gratitude, situation, reflection, mood)
-- values ('<your-user-id>', 'First entry!', 'Grateful for starting', 'Beginning the journey', 'Feels good.', 'great');
