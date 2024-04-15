do $$
begin
  if not exists (select * from pg_tables where tablename = 'users') then
    alter table users_stage rename to users;
  elsif not exists (select 1 from users limit 1) then
    insert into users select * from users_stage;
    drop table users_stage;
  else
    raise notice 'data already exists.';
  end if;
end $$;
