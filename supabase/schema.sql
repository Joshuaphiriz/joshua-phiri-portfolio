-- ============================================================
-- Joshua Phiri Portfolio — Database Schema
-- Run this once in Supabase: Dashboard → SQL Editor → New Query
-- ============================================================

-- SITE SETTINGS (single row: your name, bio, contact info, etc.)
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Joshua Phiri',
  headline text not null default 'Finance & SMEs, powered by technology',
  bio text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  linkedin_url text,
  cv_storage_path text,
  profile_image_path text
);

-- EXPERIENCE (work history — shown like ledger entries)
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  organisation text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date, -- null = "Present"
  bullets text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- PROJECTS (things you've built — the centrepiece of the portfolio)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  body text,
  cover_image_path text,
  tags text[] not null default '{}',
  link_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- MEDIA (photos / documents / videos, optionally attached to a project)
create table if not exists media_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  kind text not null check (kind in ('image', 'document', 'video')),
  storage_path text not null,
  file_name text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ACHIEVEMENTS / CERTIFICATIONS
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date_label text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public can READ everything (it's a portfolio — meant to be seen).
-- Only an authenticated user (you) can WRITE.
-- ============================================================

alter table site_settings enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table media_items enable row level security;
alter table achievements enable row level security;

-- Public read access
create policy "public can read site_settings" on site_settings for select using (true);
create policy "public can read experience" on experience for select using (true);
create policy "public can read published projects" on projects for select using (is_published = true);
create policy "public can read media_items" on media_items for select using (true);
create policy "public can read achievements" on achievements for select using (true);

-- Authenticated (admin) full access
create policy "admin full access site_settings" on site_settings for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access experience" on experience for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access projects" on projects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access media_items" on media_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access achievements" on achievements for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- One public bucket for everything you upload (images, PDFs, videos).
-- Public READ (so the portfolio can display files), admin-only WRITE.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "public can view portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "admin can upload portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "admin can update portfolio media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "admin can delete portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- ============================================================
-- SEED: your starting content, pulled from your CV.
-- Edit any of this later from the admin dashboard — this just
-- gets the site populated on day one.
-- ============================================================

insert into site_settings (full_name, headline, bio, email, phone, location, linkedin_url)
values (
  'Joshua Phiri',
  'Finance & SMEs, built on smart technology',
  'Final-year Economics and Business Administration student at the University of Zambia, focused on finance, investments, and helping SMEs access smart financial solutions through modern technology. Background in financial reconciliation, data analysis (STATA), and process automation across finance, project coordination, and strategic planning.',
  'phirijoshua784@gmail.com',
  '+260 772 366133',
  'Lusaka, Zambia',
  'https://www.linkedin.com/in/phiri-joshua'
);

insert into experience (organisation, role, location, start_date, end_date, bullets, sort_order) values
('National Pension Scheme Authority', 'Finance Intern — Finance Department, Contribution & Benefits', 'Lusaka, Zambia', '2025-11-01', '2026-01-31',
  array['Managed stores and petty cash, and dispatched inventory', 'Built a fleet management system and a reports repository', 'Built a merging tool to streamline document workflows', 'Performed reconciliations and worked closely with procurement and IT', 'Maintained a document management system and built dashboards for reporting'],
  10),
('University of Zambia Humanities and Social Science Association (UNZAHSSA)', 'Chairperson — Internship Committee', 'Lusaka, Zambia', '2025-11-01', null,
  array['Planned and executed a Job Readiness Fair', 'Created a CV repository for students seeking internships', 'Managed all event logistics from venue securing to participant coordination', 'Delivered seamless events with 50+ attendees'],
  20),
('Immaculate Consultants', 'Founder & CEO', 'Lusaka, Zambia', '2025-01-01', null,
  array['Founded and lead the organisation', 'Oversee hiring of senior staff members', 'Head strategic organisational planning', 'Confer with partners and prospective investors'],
  30),
('University of Zambia Economics and Business Association (UNZABECA)', 'Project Coordinator — Debate Committee', 'Lusaka, Zambia', '2023-12-01', '2024-06-30',
  array['Provided direct support to the Chairperson, coordinating strategy meetings', 'Facilitated venues and logistics for guests and attendees', 'Liaised with multiple committees and external organisations to actualise events', 'Built a network of stakeholders across partner organisations'],
  40);

insert into achievements (title, description, date_label, sort_order) values
('Built a student union management app', 'Created an app for UNZAHSSA to manage the association''s activities and improve overall operational efficiency.', null, 10),
('4th place, SADC regional essay writing competition', 'Represented Zambia and placed fourth regionally, demonstrating research, literature, and creative problem-solving skills.', '2021', 20),
('Published author', 'Authored and published a book on Amazon titled "From Adversity to University."', null, 30),
('Data Analysis certifications, UNZA CICT', 'Certified in Data Analysis using Stata, R programming, and Basic ICT — building strong empirical research skills.', '2024/25', 40),
('ZRA tax training', 'Trained and certified by the Zambia Revenue Authority in PAYE appreciation and Indirect Taxes short courses.', '2025', 50);

insert into projects (title, summary, body, tags, is_published, sort_order) values
('Fleet Management System', 'A system built during my NAPSA internship to track and manage fleet operations efficiently.', 'Designed to bring structure to fleet tracking within the Finance Department, replacing manual processes with a clearer, centralised system.', array['Process Automation', 'Excel', 'Finance Ops'], true, 10),
('Document Merging Tool', 'A tool to streamline how recurring documents and reports were assembled and reconciled.', 'Built to remove repetitive manual work from the reconciliation process, saving time across the Contributions & Benefits team.', array['Automation', 'Microsoft Office'], true, 20),
('UNZAHSSA Student Union App', 'An app to help the Humanities and Social Science Association manage its activities.', 'Built to centralise association activity management and improve efficiency for committee members and students alike.', array['Product', 'Student Leadership'], true, 30);
