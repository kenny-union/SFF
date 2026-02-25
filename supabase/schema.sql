-- Student Feedback Table Schema
-- Run this in your Supabase SQL Editor to create the table

create table student_feedback (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()),

  -- Student Information
  full_name text not null,
  student_id text,
  email text,
  grade text not null,
  subject text not null,

  -- Ratings
  overall_rating integer not null check (overall_rating >= 1 and overall_rating <= 5),
  teaching_rating integer check (teaching_rating is null or (teaching_rating >= 1 and teaching_rating <= 5)),
  materials_rating integer check (materials_rating is null or (materials_rating >= 1 and materials_rating <= 5)),

  -- Mood & Preferences
  mood text,
  enjoyed text[],

  -- Feedback Text
  liked_most text not null,
  improvements text,
  additional_comments text
);

-- Enable Row-Level Security
alter table student_feedback enable row level security;

-- Create policy to allow PUBLIC inserts (anonymous feedback submission)
create policy "Allow public insert"
  on student_feedback
  for insert
  with check (true);

-- Create policy to allow PUBLIC select (for dashboard - anyone can view feedback)
create policy "Allow public select"
  on student_feedback
  for select
  using (true);

-- Optional: Create an index on created_at for faster queries
create index idx_student_feedback_created_at on student_feedback (created_at desc);

-- Optional: Create an index on subject for filtering
create index idx_student_feedback_subject on student_feedback (subject);

-- Optional: Create an index on grade for filtering
create index idx_student_feedback_grade on student_feedback (grade);
