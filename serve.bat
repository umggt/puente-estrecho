SET PATH=%PATH%;\Program Files (x86)\IIS Express
SET APPPATH=%~dp0

start http://localhost:9090/

iisexpress /path:%APPPATH% /port:9090