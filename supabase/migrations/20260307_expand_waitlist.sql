do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'waitlist'
      and column_name = 'first_name'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'waitlist'
      and column_name = 'name'
  ) then
    alter table public.waitlist rename column first_name to name;
  end if;
end;
$$;

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
  add column if not exists name text,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

with ranked as (
  select
    id,
    row_number() over (
      partition by lower(trim(email))
      order by created_at desc nulls last, id desc
    ) as rn
  from public.waitlist
  where email is not null
)
delete from public.waitlist w
using ranked r
where w.id = r.id
  and r.rn > 1;

update public.waitlist
set email = lower(trim(email))
where email is not null
  and email <> lower(trim(email));

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
