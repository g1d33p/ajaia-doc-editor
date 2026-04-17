mkdir -p docs
cat > docs/schema.sql << 'EOF'
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Documents table
create table documents (
  id uuid default uuid_generate_v4() primary key,
  title text not null default 'Untitled Document',
  content text default '',
  owner_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Document shares table
create table document_shares (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references documents(id) on delete cascade not null,
  shared_with_email text not null,
  shared_with_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
EOF