

Alter table tbl_Assetdamage
Add
AutoVoucherNo		int,
ManualVoucherNO		nvarchar(50),
AutoManualNo		nvarchar(50),
IsOutsideRequired   bit not null default 0,
VoucherId			int  null CONSTRAINT fk_Assetdamage_VoucherId FOREIGN KEY REFERENCES TBL_Voucher(VoucherId),
CostClassId		    int  null CONSTRAINT fk_Assetdamage_CostClass FOREIGN KEY REFERENCES TBL_COSTCLASS(CostClassId),
VendorId            int  null CONSTRAINT fk_Assetdamage_VendorId FOREIGN KEY REFERENCES TBL_Ledger(LedgerId),
Attributes			nvarchar(max),
UDFKeyVal			nvarchar(max)

Go


Create Table tbl_RepairedInward(
TranId            int not null identity(1,1) primary key,
RepairedNo        int not null,
RefNo             int null,    
BranchId          int null constraint fk_RepairedInward_BranchId foreign key references tbl_Branch(BranchId),
VoucherDate       Date null,
OutsideLocation   nvarchar(200) null,
VendorId          int null CONSTRAINT fk_RepairedInward_VendorId FOREIGN KEY (VendorId) REFERENCES tbl_Ledger(LedgerId),

AutoVoucherNo     int,
ManualVoucherNO	  nvarchar(50),
AutoManualNo	  nvarchar(50),
VoucherId		  int not null CONSTRAINT fk_RepairedInward_VoucherId FOREIGN KEY REFERENCES TBL_Voucher(VoucherId),
CostClassId		  int not null CONSTRAINT fk_RepairedInward_CostClass FOREIGN KEY REFERENCES TBL_COSTCLASS(CostClassId),
Attributes		  nvarchar(max),
UDFKeyVal		  nvarchar(max),
Remark            nvarchar(200) null,

CreateBy          int not null constraint fk_RepairedInward_CreateBy foreign key references tbl_user(userId),
ModifyBy          int null constraint fk_RepairedInward_ModifyBy foreign key references tbl_user(userId),
UpdateLogDateTime datetime,
LogDateTime       datetime not null default current_timestamp
)

GO

Create table tbl_RepairedInwardDetails(
TranId           int not null constraint fk_RepairedInwardDetails_TranId foreign key references tbl_RepairedInward(TranId) on delete cascade,
ParticularId     int null constraint fk_RepairedInwardDetails_ParticularId foreign key references tbl_Assetsmaster(TranId),
QTY              int null,
StatusId         int null,
RequiredInDate   Date null,
Details          nvarchar(254) null
)

GO


CREATE Table tbl_RepairedInwardAtt(
TranId                 int not null constraint fk_RepairedInwardAtt_TranId foreign key references tbl_RepairedInward(TranId) on delete cascade,
DocumentTypeId         int  null,
Name                   nvarchar(254)  null,
docDescription         nvarchar(254)  null,
Extension              nvarchar(50) not null,
Document               VARBINARY(MAX) NULL,
DocPath                nvarchar(400) null,
)

Go

ALTER procedure usp_AddAssetdamage
(
@ReturnNo		            int=null,
@DamageDate		          date=null,
@BranchId		            int=null,
@Remark		              nvarchar(308)=null,
@OutLocation             nvarchar(254) =null,
@IsOutsideRequired         bit,
@VendorId                 int=null,
@UserId		               int , 
@EntityId		             int=null ,
@TranId		               int=null output ,
@ResponseMSG		          nvarchar(254)='Invalid' output ,
@IsSuccess		             bit=0 output, 
@ErrorNumber		           int=0 output,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int=null,
@CostClassId		         int=null,
@Attributes		          nvarchar(max)=null,
@UDFKeyVal		           nvarchar(max)=null
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

if isnull(@BranchId,0)=0
	 select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'Assetdamage'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 insert into dbo.tbl_Assetdamage(ReturnNo,DamageDate,BranchId,Remark,OutLocation,IsOutsideRequired,VendorId,CreateBy,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal)
	     values(@ReturnNo,@DamageDate,@BranchId,@Remark,@OutLocation,@IsOutsideRequired,@VendorId,@UserId,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal)
	 commit transaction @TranName;
	 	 set @TranId=(select IDENT_CURRENT('tbl_Assetdamage'));
	 SET @ResponseMSG='Assetdamage Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate Assetdamage Data ';  
	 end  
	 else  
	 begin 
		     exec usp_ErrorLog @UserId; 
		     set @ErrorNumber=(select IDENT_CURRENT('tbl_SQLErrorLog')); 
		     SET @ResponseMSG=ERROR_MESSAGE()    
	 end 
 END CATCH   

 END;   

GO

ALTER procedure usp_UpdateAssetdamage
(
@ReturnNo		            int=null,
@DamageDate		          date=null,
@BranchId		            int=null,
@Remark		              nvarchar(308)=null,
@OutLocation nvarchar(254) =null,
@IsOutsideRequired         bit,
@VendorId          int=null,
@UserId		               int , 
@EntityId		             int=null ,
@TranId		               int ,
@ResponseMSG		          nvarchar(254)='Invalid' output ,
@IsSuccess		             bit=0 output, 
@ErrorNumber		           int=0 output,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int=null,
@CostClassId		         int=null,
@Attributes		          nvarchar(max)=null,
@UDFKeyVal		           nvarchar(max)=null
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

if isnull(@BranchId,0)=0
	 select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'Assetdamage'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetdamageDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_Assetdamage set AutoVoucherNo=@AutoVoucherNo,ManualVoucherNO=@ManualVoucherNO,AutoManualNo=@AutoManualNo,VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal, ReturnNo=@ReturnNo,DamageDate=@DamageDate,BranchId=@BranchId,Remark=@Remark,OutLocation=@OutLocation,IsOutsideRequired=@IsOutsideRequired,VendorId=@VendorId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Assetdamage Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate Assetdamage Data ' ;  
	 end  
	 else  
	 begin 
		     exec usp_ErrorLog @UserId; 
		     set @ErrorNumber=(select IDENT_CURRENT('tbl_SQLErrorLog')); 
		     SET @ResponseMSG=ERROR_MESSAGE()    
	 end 
 END CATCH   

 END;   

 GO

ALTER procedure usp_GetAssetdamageById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.ReturnNo,TR.DamageDate,TR.BranchId,TR.Remark,TR.OutLocation,TR.IsOutsideRequired,TR.VendorId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_Assetdamage(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.Qty,CTR.StatusId from dbo.tbl_AssetdamageDetails(nolock) CTR  where CTR.TranId=@TranId ; 
   select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetDamageDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 

END;   

GO

 ALTER procedure usp_GetAllAssetdamage
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.ReturnNo,TR.DamageDate,TR.BranchId,TR.Remark, ND.BS_Date as DamageMitti, B.Name as BranchName,L.Name as PartyName,L.Code as PartyCode from dbo.tbl_Assetdamage(nolock) TR
  left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.DamageDate,101) 
  left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId 
  left join tbl_Ledger(nolock) L on L.LedgerId = TR.vendorId; 
END;   

Go

Create procedure [dbo].[usp_AssetDamageDocAtt]
(
@TranId		              int,
@DocumentTypeId		      int=null,
@Name		                nvarchar(508)=null,
@docDescription		      nvarchar(508)=null,
@Extension		           nvarchar(100),
@Document		            varbinary(max)=null,
@DocPath		             nvarchar(400)=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId;
insert into dbo.tbl_AssetDamageDocAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   

GO

create procedure usp_AddRepairedInward
(
@RepairedNo		          int,
@RefNo		               int=null,
@BranchId		            int=null,
@VoucherDate		         date=null,
@OutsideLocation		     nvarchar(400)=null,
@VendorId		            int=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int,
@CostClassId		         int,
@Attributes		          nvarchar(max)=null,
@UDFKeyVal		           nvarchar(max)=null,
@Remark		              nvarchar(400)=null,
@UserId		               int , 
@EntityId		             int=null ,
@TranId		               int=null output ,
@ResponseMSG		          nvarchar(254)='Invalid' output ,
@IsSuccess		             bit=0 output, 
@ErrorNumber		           int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

if isnull(@BranchId,0)=0
	 select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'RepairedInward'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 insert into dbo.tbl_RepairedInward(RepairedNo,RefNo,BranchId,VoucherDate,OutsideLocation,VendorId,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal,Remark,CreateBy)
	     values(@RepairedNo,@RefNo,@BranchId,@VoucherDate,@OutsideLocation,@VendorId,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal,@Remark,@UserId)
	 commit transaction @TranName; 
	 set @TranId=(select IDENT_CURRENT('tbl_RepairedInward'));
	 SET @ResponseMSG='Repaired Inward Saved Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate RepairedInward Data ';  
	 end  
	 else  
	 begin 
		     exec usp_ErrorLog @UserId; 
		     set @ErrorNumber=(select IDENT_CURRENT('tbl_SQLErrorLog')); 
		     SET @ResponseMSG=ERROR_MESSAGE()    
	 end 
 END CATCH   

 END;   

 GO 

create procedure usp_UpdateRepairedInward
(
@RepairedNo		          int,
@RefNo		               int=null,
@BranchId		            int=null,
@VoucherDate		         date=null,
@OutsideLocation		     nvarchar(400)=null,
@VendorId		            int=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int,
@CostClassId		         int,
@Attributes		          nvarchar(max)=null,
@UDFKeyVal		           nvarchar(max)=null,
@Remark		              nvarchar(400)=null,
@UserId		               int , 
@EntityId		             int=null ,
@TranId		               int ,
@ResponseMSG		          nvarchar(254)='Invalid' output ,
@IsSuccess		             bit=0 output, 
@ErrorNumber		           int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

if isnull(@BranchId,0)=0
	 select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'RepairedInward'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_RepairedInwardDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 delete CTR  from dbo.tbl_RepairedInwardAtt(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_RepairedInward set RepairedNo=@RepairedNo,RefNo=@RefNo,BranchId=@BranchId,VoucherDate=@VoucherDate,OutsideLocation=@OutsideLocation,VendorId=@VendorId,AutoVoucherNo=@AutoVoucherNo,ManualVoucherNO=@ManualVoucherNO,AutoManualNo=@AutoManualNo,VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal,Remark=@Remark,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Repaired Inward Updated Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate RepairedInward Data ' ;  
	 end  
	 else  
	 begin 
		     exec usp_ErrorLog @UserId; 
		     set @ErrorNumber=(select IDENT_CURRENT('tbl_SQLErrorLog')); 
		     SET @ResponseMSG=ERROR_MESSAGE()    
	 end 
 END CATCH   

 END;   

 GO 

create procedure usp_DelRepairedInwardById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null ,
@ResponseMSG		          nvarchar(254)='Invalid' output ,
@IsSuccess		             bit=0 output, 
@ErrorNumber		           int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'RepairedInward'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_RepairedInward(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Repaired Inward Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. RepairedInward was already in used. ' ;  
	 end  
	 else  
	 begin 
		     exec usp_ErrorLog @UserId; 
		     set @ErrorNumber=(select IDENT_CURRENT('tbl_SQLErrorLog')); 
		     SET @ResponseMSG=ERROR_MESSAGE()    
	 end 
 END CATCH   

 END;   

 GO 

create procedure usp_GetAllRepairedInward
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.RepairedNo,TR.RefNo,TR.BranchId,TR.VoucherDate,TR.OutsideLocation,TR.VendorId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,
 TR.Attributes,TR.UDFKeyVal,TR.Remark,L.Name as EmployeeName,L.Code as EmployeeCode,ND.BS_Date as VoucherMitti,B.Name as BranchName
 from dbo.tbl_RepairedInward(nolock) TR   
 left join tbl_Ledger(nolock) L on L.LedgerId = TR.VendorId
  left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
  left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId
 ; 
END;   

 GO 

create procedure usp_AddRepairedInwardDetailsDetails
(
@TranId		              int,
@ParticularId		        int=null,
@QTY		                 int=null,
@StatusId		            int=null,
@RequiredInDate		      date=null,
@Details		             nvarchar(508)=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_RepairedInwardDetails(TranId,ParticularId,QTY,StatusId,RequiredInDate,Details)
	     values(@TranId,@ParticularId,@QTY,@StatusId,@RequiredInDate,@Details)
END;   

 GO 


create procedure usp_GetRepairedInwardById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.RepairedNo,TR.RefNo,TR.BranchId,TR.VoucherDate,TR.OutsideLocation,TR.VendorId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal,TR.Remark from dbo.tbl_RepairedInward(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.QTY,CTR.StatusId,CTR.RequiredInDate,CTR.Details from dbo.tbl_RepairedInwardDetails(nolock) CTR  where CTR.TranId=@TranId ; 
 select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_RepairedInwardAtt(nolock) CTR  where CTR.TranId=@TranId ; 
END;   

 GO 

CREATE procedure usp_AddRepairedInwardAttDetails
(
@TranId		              int,
@DocumentTypeId		      int=null,
@Name		                nvarchar(508)=null,
@docDescription		      nvarchar(508)=null,
@Extension		           nvarchar(100),
@Document		            varbinary(max)=null,
@DocPath		             nvarchar(400)=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_RepairedInwardAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   

GO

CREATE  PROCEDURE usp_GetAutoRepairedNo
(
@UserId int,
@EntityId int=null,
@RepairedNo int out
)
as
set nocount on;
EXEC sp_set_session_context @key=N'UserId', @value=1; 
select @RepairedNo= isnull(max(RepairedNo),0)+1 from tbl_RepairedInward(nolock);

GO

