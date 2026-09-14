create table if not exists oral_answers (
  id uuid primary key default gen_random_uuid(),
  staff_name text not null,
  scenario_text text not null,
  scenario_index integer not null,
  recording_path text not null,
  created_at timestamptz not null default now()
);

alter table oral_answers enable row level security;

create policy "allow insert oral answers"
on oral_answers
for insert
to anon
with check (true);

create policy "allow read oral answers"
on oral_answers
for select
to anon
using (true);

-- Create a private Storage bucket named: oral-recordings
-- MVP note: add upload/read policies for anon while testing.
-- Before production, replace public client-side admin access with a server-side protected route.
