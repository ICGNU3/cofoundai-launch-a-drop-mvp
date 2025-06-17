
-- Create profiles table
create table public.profiles (
  id text primary key,
  email text not null,
  wallet_address text,
  first_name text,
  last_name text,
  avatar_url text,
  onboarded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid()::text = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid()::text = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid()::text = id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
