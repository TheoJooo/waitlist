alter table public.waitlist
  add column if not exists form_location text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists gender text,
  add column if not exists categories text,
  add column if not exists favourite_designers text,
  add column if not exists first_name text,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

update public.waitlist
set email = lower(trim(email))
where email is not null
  and email <> lower(trim(email));

delete from public.waitlist older
using public.waitlist newer
where older.email = newer.email
  and older.ctid < newer.ctid;

create unique index if not exists waitlist_email_unique_idx
  on public.waitlist (email);

create or replace function public.touch_waitlist_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_waitlist_updated_at on public.waitlist;

create trigger set_waitlist_updated_at
before update on public.waitlist
for each row
execute function public.touch_waitlist_updated_at();
