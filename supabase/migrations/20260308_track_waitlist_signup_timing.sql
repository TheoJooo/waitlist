alter table public.waitlist
  add column if not exists landing_arrived_at timestamptz,
  add column if not exists time_to_signup_ms integer;

alter table public.waitlist
  drop constraint if exists waitlist_time_to_signup_ms_check;

alter table public.waitlist
  add constraint waitlist_time_to_signup_ms_check
  check (
    time_to_signup_ms is null
    or (time_to_signup_ms >= 0 and time_to_signup_ms <= 86400000)
  );
