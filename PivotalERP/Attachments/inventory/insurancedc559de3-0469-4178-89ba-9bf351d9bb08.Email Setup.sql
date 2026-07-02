sp_configure 'show advanced', 1; 
GO
RECONFIGURE;
GO
sp_configure;
GO

go

EXECUTE msdb.dbo.sysmail_add_profile_sp

@profile_name = 'DAttendanceProfile',

@description ='This is database Mail Alert profile.';

GO

EXECUTE msdb.dbo.sysmail_add_principalprofile_sp  
    @profile_name = 'DAttendanceProfile',  
    @principal_name = 'public',  
    @is_default = 1 ;
GO

EXECUTE msdb.dbo.sysmail_add_account_sp  
    @account_name = 'Support',  
    @description = 'This is Database Mail Account',  
    @email_address = 'noreply@atfnepal.com',  
    @display_name = 'Database Mail Alert',  
    @mailserver_name = 'mail.atfnepal.com',
    @port = 587,
    @enable_ssl = 1,
    @username = 'noreply@atfnepal.com',
    @password = 'Asian@123' ;  
GO

EXECUTE msdb.dbo.sysmail_add_profileaccount_sp

@profile_name = 'DAttendanceProfile',

@account_name = 'Support',

@sequence_number =1 ;

GO

EXEC msdb.dbo.sp_send_dbmail

@profile_name = 'DAttendanceProfile',

@recipients = 'sachin@dynamic.net.np',

@body = 'provide e- mail message last',

@subject = 'New Email Test asasasaas';

GO


select * from V_Employee

DECLARE @xml NVARCHAR(MAX)
DECLARE @body NVARCHAR(MAX)

SET @xml = CAST(( SELECT [Name] AS 'td','',[PAddress] AS 'td','', [OfficeContact] AS 'td','', Branch AS 'td'
FROM D_Attendance_Live.dbo.V_Employee 
ORDER BY Name 
FOR XML PATH('tr'), ELEMENTS ) AS NVARCHAR(MAX))

SET @body ='<html><body><H3>Employee Contact Details</H3>
<table border = 1> 
<tr>
<th> Name </th> <th> Address </th> <th> ContactNo </th> <th> Branch </th></tr>'    

SET @body = @body + @xml +'</table></body></html>'

EXEC msdb.dbo.sp_send_dbmail
@profile_name = 'DAttendanceProfile',
@body_format = 'HTML',
@body = @body,
@recipients = 'sachin@dynamic.net.np',
--@query = 'USE D_Attendance_Live;
--GO
--exec sp_GetEmployeeContact 8
--GO',
@query_result_separator = ',',
@subject = 'Employee Contact List'
--@attach_query_result_as_file = 1,
--@query_result_header = 1,
--@query_attachment_filename = 'ContactList.csv'

go


EXECUTE msdb.dbo.sysmail_delete_profileaccount_sp @profile_name = 'DAttendanceProfile'

EXECUTE msdb.dbo.sysmail_delete_principalprofile_sp @profile_name ='DAttendanceProfile'

EXECUTE msdb.dbo.sysmail_delete_account_sp @account_name = 'Support'

EXECUTE msdb.dbo.sysmail_delete_profile_sp @profile_name = 'DAttendanceProfile'