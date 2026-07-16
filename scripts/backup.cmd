@echo off
REM Wrapper invoked by the "BOSBA D1 Backup" Windows Scheduled Task.
REM Sets PATH so node/npx resolve under the task's environment, then runs the
REM backup and appends all output (with a timestamp) to backups\backup.log.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "D:\Ecommerce\Bosba Premium Foods"
echo. >> "backups\backup.log"
echo ===== %DATE% %TIME% ===== >> "backups\backup.log"
call npm run backup:auto >> "backups\backup.log" 2>&1
