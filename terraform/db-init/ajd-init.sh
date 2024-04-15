#!/bin/bash

if [[ -f ~/app.env ]]
then
    source ~/app.env
fi


sql /nolog <<EOF
set cloudconfig /home/opc/wallet/adb_wallet.zip
connect $AJD_ADMIN_USER/$AJD_ADMIN_PASSWORD@$AJD_TNS_NAME
set serveroutput on;

declare
   userexist integer;
begin
    select count(*) into userexist from dba_users where lower(username)=lower('$AJD_USER');
    DBMS_OUTPUT.put_line('User exists: ' || userexist);
    if userexist = 0 then
        EXECUTE IMMEDIATE 'CREATE USER $AJD_USER IDENTIFIED BY BotWelcome123## ACCOUNT UNLOCK';
        EXECUTE IMMEDIATE 'GRANT CONNECT TO $AJD_USER';
        EXECUTE IMMEDIATE 'GRANT CONNECT, RESOURCE TO $AJD_USER';
        EXECUTE IMMEDIATE 'GRANT UNLIMITED TABLESPACE TO $AJD_USER';
        DBMS_OUTPUT.put_line('$AJD_USER created.');
    end if;
end;
/

EOF