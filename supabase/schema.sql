-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
create table profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  role text check (role in ('admin', 'member')),
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: channels
create table channels (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: messages
create table messages (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references channels(id) not null,
  user_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  edited_at timestamp with time zone
);

-- Table: guestbook
create table guestbook (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- Channels
alter table channels enable row level security;
create policy "Channels are viewable by everyone." on channels for select using ( true );
create policy "Admins can insert channels." on channels for insert with check ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- Messages
alter table messages enable row level security;
create policy "Messages are viewable by everyone." on messages for select using ( true );
create policy "Users can insert their own messages." on messages for insert with check ( auth.uid() = user_id );

-- Guestbook
alter table guestbook enable row level security;
create policy "Guestbook is viewable by everyone." on guestbook for select using ( true );
create policy "Users can insert into guestbook." on guestbook for insert with check ( auth.uid() = user_id );
