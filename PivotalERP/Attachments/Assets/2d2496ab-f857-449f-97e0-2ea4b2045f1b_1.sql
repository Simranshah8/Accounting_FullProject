
CREATE FUNCTION fn_PurposeColl
(
@id		INT
)
RETURNS NVARCHAR(100)
BEGIN
    RETURN (case @id 
                when  1 then 'Department Work' 
                when  2 then 'Administrative Tasks'
                when  3 then 'Personal Use (Authorized'
                when 4 then 'Official Tour'
                when 5 then 'Field Visit'
                when 6 then 'Guest Use'
                when  7 then 'Training / Workshop'
                when 8 then 'Event / Seminar / Conference'
                else '' end)
end

GO

CREATE FUNCTION fn_CategoryColl
(
@id		INT
)
RETURNS NVARCHAR(100)
BEGIN
    RETURN (case @id 
                when  1 then 'Internal Use' 
                when  2 then 'External Activities'
                when  3 then 'Events & Training'
                else '' end)
end

GO

create FUNCTION fn_RamColl
(
@id    INT
)
RETURNS NVARCHAR(100)
BEGIN
    RETURN (case @id 
                when  1 then '4GB' 
                when  2 then '8GB'
                when  3 then '12GB'
                when 4 then '16GB'
                when 5 then '32GB'
                when 6 then '64GB'
                when  7 then 'N/A'
                else '' end)
end

GO 

 Create FUNCTION fn_ROMColl
(
@id    INT
)
RETURNS NVARCHAR(100)
BEGIN
    RETURN (case @id 
                when  1 then '64GB' 
                when  2 then '128GB'
                when  3 then '256GB'
                when 4 then '512GB'
                when 5 then '1TB SSD'
                when 6 then '2TB SSD'
                when  7 then '500 GB HHD'
                when 8 then '1TB  HHD'
                when 9 then 'N/A'
                else '' end)
end

 GO

  Create FUNCTION fn_ReturnStatusColl
(
@id    INT
)
RETURNS NVARCHAR(100)
BEGIN
    RETURN (case @id 
                WHEN 1 THEN 'Good Condition' 
                WHEN 2 THEN 'Minor Scratches'
                WHEN 3 THEN 'Damaged'
                WHEN 4 THEN 'Defective'
                WHEN 5 THEN 'Repair'
                ELSE '' END
                )
end

 GO

-----------------Asset Inward

CREATE TABLE tbl_AssetInward
(
    TranId              INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    AutoVoucherNo       INT NULL,
    ManualVoucherNO     nvarchar(50) NULL,
    AutoManualNo        nvarchar(50) NULL,
    Attributes          nvarchar(max) NULL,
    InwardNo            INT NULL,
    InVoiceNo           nvarchar(254) NULL,
    VoucherDate         DATE NULL,
    VendorId            int NULL CONSTRAINT fk_AssetInward_VendorId  FOREIGN KEY REFERENCES tbl_Ledger (LedgerId),
    VoucherId           INT NOT NULL CONSTRAINT fk_AssetInward_VoucherId  FOREIGN KEY REFERENCES tbl_Voucher (VoucherId),
    BranchId            INT NOT NULL CONSTRAINT fk_AssetInward_BranchId   FOREIGN KEY REFERENCES tbl_Branch (BranchId),
    CostClassId         INT NOT NULL CONSTRAINT fk_AssetInward_CostClass  FOREIGN KEY REFERENCES tbl_CostClass (CostClassId),
    DocUrl              nvarchar(254) NULL,
    Remarks             nvarchar(254) NULL,
    CreateBy            int NOT NULL CONSTRAINT fk_AssetInward_CreateBy   FOREIGN KEY REFERENCES tbl_User (UserId),
    ModifyBy            int NULL CONSTRAINT fk_AssetInward_ModifyBy  FOREIGN KEY REFERENCES tbl_User (UserId),
    UpdateLogDateTime   datetime NULL,
    LogDateTime         datetime NOT NULL DEFAULT current_timestamp,
    FYearId             int NULL,
    UDFKeyVal           nvarchar(max) NULL

);
GO
CREATE TABLE tbl_AssetInwardDetails
(
    TranId              INT NULL CONSTRAINT fk_AssetInwardDetails_InwardId  FOREIGN KEY REFERENCES tbl_AssetInward (TranId)  ON DELETE CASCADE,
    ParticularId        INT NULL CONSTRAINT fk_AssetInwardDetails_ParticularId  FOREIGN KEY REFERENCES tbl_Assetsmaster (TranId),
    WarrantyDate        DATE NULL,
    Qty                 float NULL,
    QtyRate             float NULL,
    QtyDisAmt           float NULL,
    PRate               float NULL,
    DisAmt              float NULL,
    Amt                 float NULL,
    [Status]            INT NULL,
    USno                INT NULL
);
GO

CREATE TABLE tbl_AssetInwardDocAtt
(
    TranId              INT NOT NULL  CONSTRAINT fk_AssetInwardDocAtt_TranId  FOREIGN KEY REFERENCES tbl_AssetInward (TranId)  ON DELETE CASCADE,
    DocumentTypeId      INT NULL,
    Name                nvarchar(254) NULL,
    docDescription      nvarchar(254) NULL,
    Extension           nvarchar(50) NOT NULL,
    Document            varbinary(max) NULL,
    DocPath             nvarchar(400) NULL
);
GO


-----------------Asset Transfer

CREATE TABLE tbl_AssetTransfer
(
    TranId              INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    AutoVoucherNo       INT NULL,
    ManualVoucherNO     nvarchar(50) NULL,
    AutoManualNo        nvarchar(50) NULL,
    Attributes          nvarchar(max) NULL,
    TransferNo          INT NULL,
    VoucherDate         DATE NULL,
    VoucherId           int NOT NULL  CONSTRAINT fk_AssetTransfer_VoucherId FOREIGN KEY REFERENCES tbl_Voucher (VoucherId),
    CostClassId         int NOT NULL CONSTRAINT fk_AssetTransfer_CostClass FOREIGN KEY REFERENCES tbl_CostClass (CostClassId),
    FromBranchId        int NOT NULL CONSTRAINT fk_AssetTransfer_FromBranchId FOREIGN KEY REFERENCES tbl_Branch (BranchId),
    ToBranchId          int NOT NULL CONSTRAINT fk_AssetTransfer_ToBranchId FOREIGN KEY REFERENCES tbl_Branch (BranchId),
    Remarks             nvarchar(254) NULL,
    CreateBy            int NOT NULL  CONSTRAINT fk_AssetTransfer_CreateBy  FOREIGN KEY REFERENCES tbl_User (UserId),
    ModifyBy            int NULL CONSTRAINT fk_AssetTransfer_ModifyBy FOREIGN KEY REFERENCES tbl_User (UserId),
    UpdateLogDateTime   datetime NULL,
    LogDateTime         datetime NOT NULL DEFAULT current_timestamp,
    FYearId             int NULL,
    UDFKeyVal           nvarchar(max) NULL
);
GO

CREATE TABLE tbl_AssetTransferDetails
(
    TranId          int NULL CONSTRAINT fk_AssetTransferDetails_TranId FOREIGN KEY REFERENCES tbl_AssetTransfer (TranId) ON DELETE CASCADE,
    ParticularId    int NULL CONSTRAINT fk_AssetTransferDetails_ParticularId FOREIGN KEY REFERENCES tbl_Assetsmaster (TranId),
    Qty             float NULL,
    Rate            float NULL,
    Amount          float NULL
);
GO

CREATE TABLE tbl_AssetTransferDocAtt
(
    TranId          int NOT NULL CONSTRAINT fk_AssetTransferDocAtt_TranId FOREIGN KEY REFERENCES tbl_AssetTransfer (TranId) ON DELETE CASCADE,
    DocumentTypeId  int NULL,
    Name            nvarchar(254) NULL,
    docDescription  nvarchar(254) NULL,
    Extension       nvarchar(50) NOT NULL,
    Document        varbinary(max) NULL,
    DocPath         nvarchar(400) NULL
);
GO

------------------------Asset Request


CREATE TABLE tbl_AssetRequest
(
    TranId              int NOT NULL IDENTITY (1,1) PRIMARY KEY,
    AutoVoucherNo       int NULL,
    ManualVoucherNO     nvarchar(50) NULL,
    AutoManualNo        nvarchar(50) NULL,
    Attributes          nvarchar(max) NULL,
    AssetReqNo          int NOT NULL,
    RequestById         int NULL,
    DepartmentId        int NULL,
    HODId               int NULL CONSTRAINT fk_AssetRequest_HODId FOREIGN KEY REFERENCES tbl_HeadOfDepartment (TranId),
    VoucherDate             date NULL,
    UserId              int NULL CONSTRAINT fk_AssetRequest_UserId FOREIGN KEY REFERENCES tbl_User (UserId),
    VoucherId           int NOT NULL CONSTRAINT fk_AssetRequest_VoucherId FOREIGN KEY REFERENCES tbl_Voucher (VoucherId),
    CostClassId         int NOT NULL CONSTRAINT fk_AssetRequest_CostClass FOREIGN KEY REFERENCES tbl_CostClass (CostClassId),
    BranchId            int NOT NULL CONSTRAINT fk_AssetRequest_BranchId FOREIGN KEY REFERENCES tbl_Branch (BranchId),
    BarCode             nvarchar(200) NULL,
    CreateBy            int NOT NULL CONSTRAINT fk_AssetRequest_CreateBy FOREIGN KEY REFERENCES tbl_User (UserId),
    ModifyBy            int NULL CONSTRAINT fk_AssetRequest_ModifyBy FOREIGN KEY REFERENCES tbl_User (UserId),
    UpdateLogDateTime   datetime NULL,
    LogDateTime         datetime NOT NULL DEFAULT current_timestamp,
    Remarks             nvarchar(200) NULL,
    FYearId             int NULL,
    UDFKeyVal           nvarchar(max) NULL
);
GO

CREATE TABLE tbl_AssetsReqDetails
(
    RequestDetId    int NOT NULL IDENTITY (1,1) PRIMARY KEY,
    TranId          int NOT NULL CONSTRAINT fk_AssetsReqDetails_TranId FOREIGN KEY REFERENCES tbl_AssetRequest (TranId) ON DELETE CASCADE,
    ParticularId    int NULL CONSTRAINT fk_AssetsReqDetails_ParticularId FOREIGN KEY REFERENCES tbl_Assetsmaster (TranId),
    CategoryId      int NULL,
    PurposeId       int NULL,
    QTY             int NULL,
    ReqFrom         date NULL,
    ReqTO           date NULL
);
GO

CREATE TABLE tbl_AssetRequestDocAtt
(
    TranId          int NOT NULL CONSTRAINT fk_AssetRequestDocAtt_TranId FOREIGN KEY REFERENCES tbl_AssetRequest (TranId) ON DELETE CASCADE,
    DocumentTypeId  int NULL,
    Name            nvarchar(254) NULL,
    docDescription  nvarchar(254) NULL,
    Extension       nvarchar(50) NOT NULL,
    Document        varbinary(max) NULL,
    DocPath         nvarchar(400) NULL
);
GO

-------------------Asset Issue

CREATE TABLE tbl_AssetIssue
(
    TranId              int NOT NULL IDENTITY (1,1) PRIMARY KEY,
    AutoVoucherNo       int NULL,
    ManualVoucherNO     nvarchar(50) NULL,
    AutoManualNo        nvarchar(50) NULL,
    Attributes          nvarchar(max) NULL,
    IssueNo             int NULL,
    IssueById           int NULL,
    DepartmentId        int NULL,
    HODId               int NULL CONSTRAINT fk_AssetIssue_HODId FOREIGN KEY REFERENCES tbl_HeadOfDepartment (TranId),
    VoucherDate         date NULL,
    UserId              int NULL CONSTRAINT fk_AssetIssue_UserId FOREIGN KEY REFERENCES tbl_User (UserId),
    VoucherId           int not NULL CONSTRAINT fk_AssetIssue_VoucherId FOREIGN KEY REFERENCES tbl_Voucher (VoucherId),
    CostClassId         int not NULL CONSTRAINT fk_AssetIssue_CostClass FOREIGN KEY REFERENCES tbl_CostClass (CostClassId),
    BranchId            int not NULL CONSTRAINT fk_AssetIssue_BranchId FOREIGN KEY REFERENCES tbl_Branch (BranchId),
    BarCode             nvarchar(200) NULL,
    Remarks             nvarchar(250) NULL,
    IsReturnable        bit NOT NULL DEFAULT (0),
    AssetReqNo          nvarchar(50) NULL,
    CreateBy            int NOT NULL CONSTRAINT fk_AssetIssue_CreateBy FOREIGN KEY REFERENCES tbl_User (UserId),
    ModifyBy            int NULL CONSTRAINT fk_AssetIssue_ModifyBy FOREIGN KEY REFERENCES tbl_User (UserId),
    UpdateLogDateTime   datetime NULL,
    LogDateTime         datetime NOT NULL DEFAULT current_timestamp,
    UDFKeyVal           nvarchar(max) NULL
);
GO

CREATE TABLE tbl_AssetsIssueDetails
(
    IssueDetId          int NOT NULL IDENTITY (1,1) PRIMARY KEY,
    TranId              int NOT NULL CONSTRAINT fk_AssetsIssueDetails_TranId FOREIGN KEY REFERENCES tbl_AssetIssue (TranId) ON DELETE CASCADE,
    ParticularId        int NULL CONSTRAINT fk_AssetsIssueDetails_ParticularId FOREIGN KEY REFERENCES tbl_Assetsmaster (TranId),
    ReqDetailsId        int NULL CONSTRAINT fk_AssetsIssueDetails_ReqDetailsId FOREIGN KEY REFERENCES tbl_AssetsReqDetails (RequestDetId),
    CategoryId          int NULL,
    PurposeId           int NULL,
    QTY                 int NULL,
    ReqFrom             date NULL,
    ReqTO               date NULL,
    IssueRemakes        nvarchar(254) NULL
);
GO

CREATE TABLE tbl_AssetIssueDocAtt
(
    TranId              int NOT NULL CONSTRAINT fk_AssetIssueDocAtt_TranId FOREIGN KEY REFERENCES tbl_AssetIssue (TranId) ON DELETE CASCADE,
    DocumentTypeId      int NULL,
    Name                nvarchar(254) NULL,
    docDescription      nvarchar(254) NULL,
    Extension           nvarchar(50) NOT NULL,
    Document            varbinary(max) NULL,
    DocPath             nvarchar(400) NULL
);
GO


-------------------Asset Return

CREATE TABLE tbl_AssetReturn
(
    TranId              int NOT NULL IDENTITY (1,1) PRIMARY KEY,
    ReturnNo            int NULL,
    ReturnById          int NULL,
    DepartmentId        int NULL,
    IssueNo             nvarchar(50) NULL,
    HODId               int NULL CONSTRAINT fk_AssetReturn_HODId FOREIGN KEY REFERENCES tbl_HeadOfDepartment (TranId),
    VoucherDate          date NULL,
    UserId              int NULL CONSTRAINT fk_AssetReturn_UserId FOREIGN KEY REFERENCES tbl_User (UserId),
    VoucherId           int NOT NULL CONSTRAINT fk_AssetReturn_VoucherId FOREIGN KEY REFERENCES tbl_Voucher (VoucherId),
    CostClassId         int NOT NULL CONSTRAINT fk_AssetReturn_CostClass FOREIGN KEY REFERENCES tbl_CostClass (CostClassId),
    BranchId            int NOT NULL CONSTRAINT fk_AssetReturn_BranchId FOREIGN KEY REFERENCES tbl_Branch (BranchId),
    BarCode             nvarchar(200) NULL,
    Remarks             nvarchar(250) NULL,
    CreateBy            int NOT NULL CONSTRAINT fk_AssetReturn_CreateBy FOREIGN KEY REFERENCES tbl_User (UserId),
    ModifyBy            int NULL CONSTRAINT fk_AssetReturn_ModifyBy FOREIGN KEY REFERENCES tbl_User (UserId),
    UpdateLogDateTime   datetime NULL,
    LogDateTime         datetime NOT NULL DEFAULT current_timestamp,
    AutoVoucherNo       int NULL,
    ManualVoucherNO     nvarchar(50) NULL,
    AutoManualNo        nvarchar(50) NULL,
    Attributes          nvarchar(max) NULL,
    UDFKeyVal           nvarchar(max) NULL
);
GO
CREATE TABLE tbl_AssetReturnDetails
(
    DamageDetId         int NOT NULL IDENTITY (1,1) PRIMARY KEY,
    TranId              int NOT NULL CONSTRAINT fk_AssetReturnDetails_TranId FOREIGN KEY REFERENCES tbl_AssetReturn (TranId) ON DELETE CASCADE,
    IssueId             int NULL CONSTRAINT fk_AssetReturnDetails_IssueId FOREIGN KEY REFERENCES tbl_AssetsIssueDetails (IssueDetId),
    ParticularId        int NULL CONSTRAINT fk_AssetReturnDetails_ParticularId FOREIGN KEY REFERENCES tbl_Assetsmaster (TranId),
    CategoryId          int NULL,
    PurposeId           int NULL,
    QTY                 int NULL,
    StatusId            int NULL
);
GO
CREATE TABLE tbl_AssetReturnDocAtt
(
    TranId              int NOT NULL CONSTRAINT fk_AssetReturnDocAtt_TranId FOREIGN KEY REFERENCES tbl_AssetReturn (TranId) ON DELETE CASCADE,

    DocumentTypeId      int NULL,
    Name                nvarchar(254) NULL,
    docDescription      nvarchar(254) NULL,
    Extension           nvarchar(50) NOT NULL,
    Document            varbinary(max) NULL,
    DocPath             nvarchar(400) NULL
);
GO


----------------------Assert Damage

CREATE TABLE tbl_Assetdamage (
    TranId              int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    ReturnNo            int NULL,
    VoucherDate         date NULL,
    BranchId            int NULL,
    Remark              nvarchar(254) NULL,
    CreateBy            int NOT NULL CONSTRAINT fk_Assetdamage_CreateBy FOREIGN KEY REFERENCES TBL_USER (UserId),
    ModifyBy            int NULL CONSTRAINT fk_Assetdamage_ModifyBy FOREIGN KEY REFERENCES TBL_USER (UserId),
    UpdateLogDateTime   datetime NULL,
    LogDateTime         datetime NOT NULL DEFAULT getdate(),
    OutLocation         nvarchar(100) NULL,
    AutoVoucherNo       int NULL,
    ManualVoucherNO     nvarchar(50) NULL,
    AutoManualNo        nvarchar(50) NULL,
    IsOutsideRequired   bit NOT NULL DEFAULT(0),
    VoucherId           int NULL CONSTRAINT fk_Assetdamage_VoucherId FOREIGN KEY REFERENCES tbl_Voucher (VoucherId),
    CostClassId         int NULL CONSTRAINT fk_Assetdamage_CostClass FOREIGN KEY REFERENCES tbl_CostClass (CostClassId),
    VendorId            int NULL CONSTRAINT fk_Assetdamage_VendorId FOREIGN KEY REFERENCES tbl_Ledger (LedgerId),
    Attributes          nvarchar(max) NULL,
    UDFKeyVal           nvarchar(max) NULL
);

GO

CREATE TABLE tbl_AssetdamageDetails (
    DamageDetId         int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    TranId              int NULL CONSTRAINT fk_AssetdamageDetails_TranId FOREIGN KEY REFERENCES tbl_Assetdamage (TranId) ON DELETE CASCADE,
    ParticularId        int NULL CONSTRAINT fk_AssetdamageDetails_ParticularId FOREIGN KEY REFERENCES tbl_Assetsmaster(TranId),
    Qty                 float NULL,
    StatusId            int NULL
);

GO

CREATE TABLE tbl_AssetDamageDocAtt (
    TranId              int NOT NULL CONSTRAINT fk_AssetDamageDocAtt_TranId FOREIGN KEY REFERENCES tbl_Assetdamage (TranId) ON DELETE CASCADE,
    DocumentTypeId      int NULL,
    Name                nvarchar(254) NULL,
    docDescription      nvarchar(254) NULL,
    Extension           nvarchar(50) NOT NULL,
    Document            varbinary(max) NULL,
    DocPath             nvarchar(400) NULL
);

GO

-------------------RepairedInward


Create Table tbl_RepairedInward(
TranId            int not null identity(1,1) primary key,
AutoVoucherNo     int,
ManualVoucherNO   nvarchar(50),
AutoManualNo      nvarchar(50),
Attributes        nvarchar(max),
RepairedNo        int null,
RefNo             int null,    
VoucherId         int not null CONSTRAINT fk_RepairedInward_VoucherId FOREIGN KEY REFERENCES TBL_Voucher(VoucherId),
CostClassId       int not null CONSTRAINT fk_RepairedInward_CostClass FOREIGN KEY REFERENCES TBL_COSTCLASS(CostClassId),
BranchId          int not null constraint fk_RepairedInward_BranchId foreign key references tbl_Branch(BranchId),
VoucherDate       Date null,
OutsideLocation   nvarchar(200) null,
VendorId          int null CONSTRAINT fk_RepairedInward_VendorId FOREIGN KEY (VendorId) REFERENCES tbl_Ledger(LedgerId), 
UDFKeyVal         nvarchar(max),
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
DamageDetId     int null constraint fk_RepairedInwardDetails_DamageDetId foreign key references tbl_AssetdamageDetails(DamageDetId),
QTY              int null,
StatusId         int null,
RequiredInDate   Date null,
Amount          float null
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



-----------------Asset Inward

Create procedure usp_AddAssetInward
(
@InwardNo		            int=null,
@InVoiceNo		           nvarchar(508)=null,
@VoucherDate		          datetime=null,
@VendorId		            int=null,
@BranchId		            int=null,
@DocUrl		              nvarchar(508)=null,
@Remarks		             nvarchar(508)=null,
@FYearId                   int=null,
@UserId		               int , 
@EntityId		             int=null ,
@TranId		             int=null output ,
@ResponseMSG		          nvarchar(254)='Invalid' output ,
@IsSuccess		             bit=0 output, 
@ErrorNumber		           int=0 output,
@AutoVoucherNo		       int=null,
@ManualVoucherNo		     nvarchar(100)=null,
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

declare @TranName varchar(40) = 'AssetInward'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 
		EXEC [sp_GetAutoVoucherNo] @UserId,@VoucherId,@CostClassId,@VoucherDate,72,@AutoVoucherNo out,@AutoManualNo out;

	 insert into dbo.tbl_AssetInward(InwardNo,InVoiceNo,VoucherDate,VendorId,BranchId,DocUrl,Remarks,FYearId,CreateBy,VoucherId,CostClassId,AutoVoucherNo,AutoManualNo)
	     values(@InwardNo,@InVoiceNo,@VoucherDate,@VendorId,@BranchId,@DocUrl,@Remarks,@FYearId,@UserId,@VoucherId,@CostClassId,@AutoVoucherNo,@AutoManualNo)

	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetInward Save Successfully';
	  set @TranId=(select IDENT_CURRENT('tbl_AssetInward'));
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetInward Data ';  
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

Create procedure usp_AddAssetInwardDetailsDetails
(
@TranId		            int=null,
@ParticularId		        int=null,
@WarrantyDate		        datetime=null,
@Qty		                 float(8)=null,
@QtyRate		             float(8)=null,
@QtyDisAmt		           float(8)=null,
@PRate		               float(8)=null,
@DisAmt		              float(8)=null,
@Amt		                 float(8)=null,
@Status		              int=null,
@USno		              int=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetInwardDetails(TranId,ParticularId,WarrantyDate,Qty,QtyRate,QtyDisAmt,PRate,DisAmt,Amt,Status,USno)
	     values(@TranId,@ParticularId,@WarrantyDate,@Qty,@QtyRate,@QtyDisAmt,@PRate,@DisAmt,@Amt,@Status,@USno)
END;   

GO

Create procedure usp_AssetInwardDocAtt
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
 
insert into dbo.tbl_AssetInwardDocAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   
 
GO

Create procedure usp_UpdateAssetInward
(
@InwardNo		            int=null,
@InVoiceNo		           nvarchar(508)=null,
@VoucherDate		          datetime=null,
@VendorId		            int=null,
@BranchId		            int=null,
@DocUrl		              nvarchar(508)=null,
@Remarks		             nvarchar(508)=null,
@FYearId                   int=null,
@UserId		               int , 
@EntityId		             int=null ,
@TranId		             int ,
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

declare @TranName varchar(40) = 'AssetInward'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetInwardDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_AssetInward set VoucherId=@VoucherId,CostClassId=@CostClassId, InwardNo=@InwardNo,InVoiceNo=@InVoiceNo,VoucherDate=@VoucherDate,VendorId=@VendorId,BranchId=@BranchId,DocUrl=@DocUrl,Remarks=@Remarks,FYearId=@FYearId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetInward Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetInward Data ' ;  
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

 Create procedure usp_DelAssetInwardById
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

declare @TranName varchar(40) = 'AssetInward'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetInward(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetInward Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetInward was already in used. ' ;  
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


Create procedure usp_GetAllAssetInward
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.AutoManualNo,TR.InVoiceNo,TR.VoucherDate,TR.VendorId,TR.BranchId,CC.Name AS FiscalYear,TR.Remarks, ND.BS_Date as VoucherMitti, 
 B.Name as BranchName, L.Name as Vendor,TR.VoucherId,TR.CostClassId, U.Name AS CreatBy 
 FROM  dbo.tbl_AssetInward(nolock) TR   
 LEFT join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
 left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId
  left join tbl_Ledger(nolock) L on L.LedgerId = TR.VendorId
  LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
  LEFT JOIN dbo.tbl_CostClass(NOLOCK)CC ON CC.CostClassId = TR.CostClassId;  

END;   


GO

Create procedure usp_GetAssetInwardById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.InwardNo,TR.InVoiceNo,TR.VoucherDate,TR.VendorId,TR.BranchId,TR.DocUrl,TR.Remarks,TR.FYearId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_AssetInward(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.WarrantyDate,CTR.Qty,CTR.QtyRate,CTR.QtyDisAmt,CTR.PRate,CTR.DisAmt,CTR.Amt,CTR.Status from dbo.tbl_AssetInwardDetails(nolock) CTR  where CTR.TranId=@TranId ; 
 select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetInwardDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 
END;   
   

GO

-----------------Asset Transfer

Create PROCEDURE usp_GetAllParticularByBranch
(
    @UserId        INT, 
    @EntityId      INT = NULL,
    @FromBranchId  INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    EXEC sp_set_session_context @key = N'UserId', @value = @UserId;

    ;WITH CTE AS
    (
        SELECT  AI.TranId,AI.VendorId,  AI.BranchId,  AID.ParticularId,  AID.PRate,   AM.Name AS ParticularName,AM.Code,  AM.SerialNum,
            ROW_NUMBER() OVER (PARTITION BY AM.SerialNum ORDER BY AM.SerialNum) AS rn
        FROM tbl_AssetInward (NOLOCK) AS AI
        LEFT JOIN tbl_AssetInwardDetails (NOLOCK) AS AID
            ON AI.TranId = AID.TranId
        LEFT JOIN tbl_Assetsmaster (NOLOCK) AS AM
            ON AM.TranId = AID.ParticularId
        WHERE AI.BranchId = @FromBranchId
    )
    SELECT
        TranId,VendorId,BranchId,ParticularId,PRate,ParticularName,Code,SerialNum
    FROM CTE
    WHERE rn = 1;
END;

GO

Create procedure [dbo].[usp_AddAssetTransfer]
(
@TransferNo		          int=null,
@VoucherDate		        date=null,
@FromBranchId		        int,
@ToBranchId		          int,
@Remarks		             nvarchar(508)=null,
@FYearId                 int=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int,
@CostClassId		         int,
@Attributes		          nvarchar(100),
@UDFKeyVal		           nvarchar(100),
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

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'AssetTransfer'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 
		EXEC sp_GetAutoVoucherNo @UserId,@VoucherId,@CostClassId,@VoucherDate,73,@AutoVoucherNo out,@AutoManualNo out;
	 insert into dbo.tbl_AssetTransfer(TransferNo,VoucherDate,FromBranchId,ToBranchId,Remarks,FYearId,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal,CreateBy)
	     values(@TransferNo,@VoucherDate,@FromBranchId,@ToBranchId,@Remarks,@FYearId,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal,@UserId)
	 commit transaction @TranName; 
	 	 Set @TranId = (select IDENT_CURRENT('tbl_AssetTransfer'));
	 SET @ResponseMSG='AssetTransfer Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetTransfer Data ';  
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


Create procedure usp_AddAssetTransferDetailsDetails
(
@TranId		              int=null,
@ParticularId		        int=null,
@Qty		                 float(8)=null,
@Rate		                float(8)=null,
@Amount		              float(8)=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetTransferDetails(TranId,ParticularId,Qty,Rate,Amount)
	     values(@TranId,@ParticularId,@Qty,@Rate,@Amount)
END;   

GO

Create procedure usp_AssetTransferDocAtt
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
 
insert into dbo.tbl_AssetTransferDocAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   
 
GO


Create procedure [dbo].[usp_GetAssetTransferById]
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.TransferNo,TR.VoucherDate,TR.FromBranchId,TR.ToBranchId,TR.Remarks,TR.FYearId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_AssetTransfer(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.Qty,CTR.Rate,CTR.Amount from dbo.tbl_AssetTransferDetails(nolock) CTR  where CTR.TranId=@TranId ; 
  select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetTransferDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 

END;   

Go

Create procedure [dbo].[usp_UpdateAssetTransfer]
(
@TransferNo		          int=null,
@VoucherDate		        date=null,
@FromBranchId		        int,
@ToBranchId		          int,
@Remarks		             nvarchar(508)=null,
@FYearId                 int=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int,
@CostClassId		         int,
@Attributes		          nvarchar(100),
@UDFKeyVal		           nvarchar(100),
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

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'AssetTransfer'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetTransferDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_AssetTransfer set TransferNo=@TransferNo,VoucherDate=@VoucherDate,
	 FromBranchId=@FromBranchId,ToBranchId=@ToBranchId,Remarks=@Remarks,FYearId=@FYearId,
	 VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal,ModifyBy=@UserId,
	 UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetTransfer Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetTransfer Data ' ;  
	 end  
	 else  
	 begin 
		     exec usp_ErrorLog @UserId; 
		     set @ErrorNumber=(select IDENT_CURRENT('tbl_SQLErrorLog')); 
		     SET @ResponseMSG=ERROR_MESSAGE()    
	 end 
 END CATCH   

 END;   

Go

Create procedure usp_GetAllAssetTransfer
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.AutoManualNo,TR.VoucherDate,TR.FromBranchId,TR.ToBranchId,TR.Remarks,ND.BS_Date  as TransferMitti,B.Name as ToBranchName, BF.Name as FromBranchName,
 U.Name AS CreateBy,C.Name AS FiscalYear 
 FROM dbo.tbl_AssetTransfer(nolock) TR
 LEFT JOIN dbo.tbl_NepaliDate(NOLOCK)ND ON ND.AD_Date = CONVERT(DATE,TR.VoucherDate,101)
 left join tbl_Branch(nolock) B on B.BranchId = TR.ToBranchId
 left join tbl_Branch(nolock) BF on BF.BranchId = TR.FromBranchId
 LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
 LEFT JOIN dbo.tbl_CostClass(NOLOCK)C ON C.CostClassId = TR.CostClassId; 

END;   

GO


Create procedure usp_DelAssetTransferById
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

declare @TranName varchar(40) = 'AssetTransfer'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetTransfer(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetTransfer Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetTransfer was already in used. ' ;  
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

------------------------Asset Request

Create procedure usp_AddAssetRequest
(
@AssetReqNo		          int=null,
@RequestById		         int=null,
@DepartmentId		        int=null,
@HODId		               int=null,
@VoucherDate		             date=null,
@EUserId		          int=null,
@BranchId		            int=null,
@BarCode		             nvarchar(400)=null,
@Remarks                    nvarchar(254)=null,
@FYearId           int=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int=null,
@CostClassId		         int=null,
@Attributes		          nvarchar(max)=null,
@UDFKeyVal		           nvarchar(max)=null,
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

declare @TranName varchar(40) = 'AssetRequest'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		EXEC sp_GetAutoVoucherNo @UserId,@VoucherId,@CostClassId,@VoucherDate,74,@AutoVoucherNo out,@AutoManualNo out;
	 insert into dbo.tbl_AssetRequest(AssetReqNo,RequestById,DepartmentId,HODId,VoucherDate,UserId,BranchId,BarCode,Remarks,FYearId,VoucherId,CostClassId,CreateBy,AutoVoucherNo,AutoManualNo)
	     values(@AssetReqNo,@RequestById,@DepartmentId,@HODId,@VoucherDate,@EUserId,@BranchId,@BarCode,@Remarks,@FYearId,@VoucherId,@CostClassId,@UserId,@AutoVoucherNo,@AutoManualNo)
	 commit transaction @TranName; 
	 set @TranId=(select IDENT_CURRENT('tbl_AssetRequest'));
	 SET @ResponseMSG='AssetRequest Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetRequest Data ';  
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

Create procedure usp_UpdateAssetRequest
(
@AssetReqNo		          int=null,
@RequestById		         int=null,
@DepartmentId		        int=null,
@HODId		               int=null,
@VoucherDate		             date=null,
@EUserId		          int=null,
@BranchId		            int=null,
@BarCode		             nvarchar(400)=null,
@Remarks                  nvarchar(254) = null,
@FYearId                 int=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int=null,
@CostClassId		         int=null,
@Attributes		          nvarchar(max)=null,
@UDFKeyVal		           nvarchar(max)=null,
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

IF EXISTS ( SELECT 1 FROM tbl_AssetsIssueDetails (NOLOCK)ARD 
INNER JOIN tbl_AssetsReqDetails(NOLOCK)AID  ON ARD.ReqDetailsId = AID.RequestDetId WHERE AID.TranId = @TranId)
BEGIN
	SET @IsSuccess = 0;
	SET @ResponseMSG = 'Cannot update the asset request because it has already been issued.';
	RETURN;
END;

declare @TranName varchar(40) = 'AssetRequest'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetsReqDetails(nolock) CTR  where CTR.TranId=@TranId ;
	 update top (1) dbo.tbl_AssetRequest set AssetReqNo=@AssetReqNo,RequestById=@RequestById,DepartmentId=@DepartmentId,HODId=@HODId,VoucherDate=@VoucherDate,UserId=@EUserId,BranchId=@BranchId,BarCode=@BarCode,Remarks=@Remarks,ModifyBy=@UserId,VoucherId=@VoucherId,CostClassId=@CostClassId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Asset Request Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate Asset Request Data ' ;  
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

Create procedure usp_GetAllAssetRequest
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.AutoManualNo,TR.RequestById,TR.DepartmentId,TR.HODId,TR.VoucherDate,TR.UserId,
 TR.BranchId,TR.BarCode,
 CASE TR.RequestById WHEN 1 THEN 'Self' ELSE 'Department' END AS RequestByName,ND.BS_Date as RequestMitti,
 CASE 
WHEN TR.RequestById = 1 THEN E.Name WHEN TR.RequestById = 2 THEN V.Name ELSE ''
END AS StaffName,B.Name as BranchName,TR.VoucherId,TR.CostClassId,U.Name AS CreateBy
FROM dbo.tbl_AssetRequest(nolock) TR 
 left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
 left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId 
 left join V_Employee(nolock)E on E.UserId = TR.UserId
 left join tbl_HeadOfDepartment(nolock) H on H.TranId = TR.HODId
 left join V_Employee(nolock) V on V.EmployeeId = H.EmployeeId
 LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
END;


GO

Create procedure usp_GetAssetRequestById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.AssetReqNo,TR.RequestById,TR.DepartmentId,TR.HODId,TR.VoucherDate,TR.UserId,TR.BranchId,TR.BarCode,TR.Remarks,TR.FYearId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_AssetRequest(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.CategoryId,CTR.PurposeId,CTR.QTY,CTR.ReqFrom,CTR.ReqTO from dbo.tbl_AssetsReqDetails(nolock) CTR  where CTR.TranId=@TranId ;
 select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetRequestDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 

END;   
  

GO

Create procedure [dbo].[usp_AddAssetsReqDetailsDetails]
(
@TranId		              int,
@ParticularId		        int=null,
@CategoryId		          int=null,
@PurposeId		           int=null,
@QTY		                 int=null,
@ReqFrom		             date=null,
@ReqTO		               date=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetsReqDetails(TranId,ParticularId,CategoryId,PurposeId,QTY,ReqFrom,ReqTO)
	     values(@TranId,@ParticularId,@CategoryId,@PurposeId,@QTY,@ReqFrom,@ReqTO)
END;   

GO

 Create procedure usp_AssetRequestDocAtt
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

 insert into dbo.tbl_AssetRequestDocAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   

GO


Create PROCEDURE usp_GetPendingAssetsRequest
(
@UserId			INT,
@RequestNo		nvarchar(100)=NULL,
@RequestBy		INT=NULL,
@BranchId		INT=NULL,
@DepartmentId	INT=NULL,
@RequestUserId	INT=NULL 
)
AS
BEGIN
  SET NOCOUNT ON ;
  EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
 
  SELECT AID.RequestDetId as TranId,AID.ParticularId,rtrim(rtrim(AM.Name+' - '+isnull(AM.Code,''))+' - '+isnull(AM.SerialNum,'')) AS Particular,AID.CategoryId,
  CASE WHEN AID.CategoryId = 1 THEN  'Internal Use' WHEN AID.CategoryId = 2 THEN 'External Activities' ELSE 'Events & Training' END AS Category,
  AID.PurposeId,
  CASE 
	WHEN AID.PurposeId = 1 THEN 'Department Work' 
	WHEN AID.PurposeId = 2 THEN 'Administrative Tasks' 
	WHEN AID.PurposeId = 3 THEN 'Personal Use (Authorized)' 
	WHEN AID.PurposeId = 4 THEN 'Official Tour' 
	WHEN AID.PurposeId = 5 THEN 'Field Visit' 
	WHEN AID.PurposeId = 6 THEN 'Guest Use' 
	WHEN AID.PurposeId = 7 THEN 'Training / Workshop' 
	ELSE 'Event / Seminar / Conference' END AS Purpose,  
  (AID.QTY - ISNULL(ISD.IssuedQty, 0)) AS RemainingQty,AID.ReqFrom,ND.BS_Date AS ReqFromBS,AID.ReqTO,ND1.BS_Date AS ReqToBS, 
  AI.VoucherDate AS EntryDate,ND2.BS_Date AS EntryDateBS, DATEDIFF(DAY, AI.VoucherDate, GETDATE()) AS ReqDays,AI.AutoManualNo as VoucherNo,E.Name AS RequestBy,
  AI.AutoVoucherNo,AI.RequestById,AI.UserId,AI.DepartmentId,AI.HODId
  FROM dbo.tbl_AssetRequest(NOLOCK)AI
  LEFT JOIN dbo.tbl_AssetsReqDetails(NOLOCK)AID ON AID.TranId = AI.TranId
  LEFT JOIN dbo.tbl_NepaliDate(NOLOCK)ND ON ND.AD_Date = CONVERT(DATE,AID.ReqFrom,101)
  LEFT JOIN dbo.tbl_NepaliDate(NOLOCK)ND1 ON ND1.AD_Date = CONVERT(DATE,AID.ReqTO,101)
  LEFT JOIN dbo.tbl_NepaliDate(NOLOCK)ND2 ON ND2.AD_Date = CONVERT(DATE,AI.VoucherDate,101)
  LEFT JOIN dbo.tbl_Assetsmaster(NOLOCK)AM ON AM.TranId = AID.ParticularId
  LEFT JOIN dbo.V_User(NOLOCK)E ON E.UserId = AI.CreateBy
  LEFT JOIN ( SELECT ReqDetailsId, SUM(QTY) AS IssuedQty FROM dbo.tbl_AssetsIssueDetails (NOLOCK) GROUP BY ReqDetailsId ) ISD ON ISD.ReqDetailsId = AID.RequestDetId
  WHERE (@RequestNo IS NULL OR AI.AutoManualNo=@RequestNo) AND (@RequestBy IS NULL OR AI.RequestById=@RequestBy)
  AND (@BranchId IS NULL OR AI.BranchId=@BranchId) AND (@DepartmentId IS NULL OR AI.DepartmentId=@DepartmentId)
  AND (@RequestUserId IS NULL OR AI.UserId = @RequestUserId OR AI.HODId = @RequestUserId) 
  AND (SELECT ISNULL(SUM(AD.QTY), 0) FROM dbo.tbl_AssetsIssueDetails (NOLOCK)AD WHERE AD.ReqDetailsId = AID.RequestDetId ) < AID.QTY

 
END
  
GO

Create procedure [dbo].[usp_GetHodListDepartmentWise]
(
@UserId int,
@EntityId int=null,
@DepartmentId INT = NULL
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;

declare @Qry nvarchar(max)='';
declare @Where nvarchar(200)=' where  1=1 ';

if isnull(@DepartmentId,0)>0
	set @Where=@Where+' and TR.DepartmentId='+cast(@DepartmentId as varchar);

set @Qry='select TR.EmployeeId,E.Name,E.EmployeeCode,TR.TranId as HODId from tbl_HeadOfDepartment(nolock) TR
left Join V_Employee(nolock) E on E.EmployeeId = TR.EmployeeId'; 
execute(@Qry+@Where);
END;

GO



-------------------Asset Issue

Create procedure usp_AddAssetIssue
(
@IssueNo		             int=null,
@IssueById		           int=null,
@DepartmentId		        int=null,
@HODId		               int=null,
@VoucherDate		           date=null,
@EUserId		          int=null,
@BranchId		            int=null,
@BarCode		             nvarchar(400)=null,
@Remarks		             nvarchar(500)=null,
@IsReturnable		        bit,
@AssetReqNo                NVARCHAR(100)=null,
@FYearId                  int = null,
@AutoVoucherNo            int=null,
@ManualVoucherNO   NVARCHAR(50)=null,
@AutoManualNo      NVARCHAR(50)=null,
@VoucherId         INT=null,
@CostClassId       INT=null,
@Attributes        NVARCHAR(MAX)=null,
@UDFKeyVal         NVARCHAR(MAX)=null,
@UserId		               int =null, 
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

declare @TranName varchar(40) = 'AssetIssue'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 
		EXEC [sp_GetAutoVoucherNo] @UserId,@VoucherId,@CostClassId,@VoucherDate,75,@AutoVoucherNo out,@AutoManualNo out;
	 insert into dbo.tbl_AssetIssue(IssueNo,IssueById,DepartmentId,HODId,VoucherDate,UserId,BranchId,BarCode,Remarks,IsReturnable,AssetReqNo,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal,CreateBy)
	     values(@IssueNo,@IssueById,@DepartmentId,@HODId,@VoucherDate,@EUserId,@BranchId,@BarCode,@Remarks,@IsReturnable,@AssetReqNo,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal,@UserId)
	 commit transaction @TranName; 
	 set @TranId=(select IDENT_CURRENT('tbl_AssetIssue'));
	 SET @ResponseMSG='Assets Issue Saved Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate Assets Issue Data ';  
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

Create procedure usp_UpdateAssetIssue
(
@IssueNo		             int=null,
@IssueById		           int=null,
@DepartmentId		        int=null,
@HODId		               int=null,
@VoucherDate				DATE=null,
@EUserId		          int=null,
@BranchId		            int=null,
@BarCode		             nvarchar(400)=null,
@Remarks		             nvarchar(500)=null,
@IsReturnable		        bit,
@UserId		               int ,
@AssetReqNo                NVARCHAR(100)=null,
@FYearId                   int=null,
@AutoVoucherNo            int=null,
@ManualVoucherNO   NVARCHAR(50)=null,
@AutoManualNo      NVARCHAR(50)=null,
@VoucherId         INT=null,
@CostClassId       INT=null,
@Attributes        NVARCHAR(MAX)=null,
@UDFKeyVal         NVARCHAR(MAX)=null,
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

IF EXISTS ( SELECT 1 FROM tbl_AssetReturnDetails (NOLOCK)ARD 
INNER JOIN tbl_AssetsIssueDetails(NOLOCK)AID  ON ARD.IssueId = AID.IssueDetId WHERE AID.TranId = @TranId)
BEGIN
	SET @IsSuccess = 0;
	SET @ResponseMSG = 'Cannot update the asset issue because it has already been returned.';
	RETURN;
END;

declare @TranName varchar(40) = 'AssetIssue'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetsIssueDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_AssetIssue set IssueNo=@IssueNo,IssueById=@IssueById,DepartmentId=@DepartmentId, HODId=@HODId,VoucherDate=@VoucherDate,UserId=@EUserId,BranchId=@BranchId,BarCode=@BarCode,Remarks=@Remarks,
	 IsReturnable=@IsReturnable,AssetReqNo=@AssetReqNo,VoucherId=@VoucherId,CostClassId=@CostClassId,
	 Attributes=@Attributes,UDFKeyVal=@UDFKeyVal,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Assets Issue Updated Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate Assets Issue Data ' ;  
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

Create procedure usp_GetAllAssetIssue
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 
 select TR.TranId,TR.AutoManualNo,TR.IssueById,TR.DepartmentId,TR.HODId,TR.VoucherDate,TR.UserId,TR.BranchId,TR.BarCode,TR.Remarks,
 TR.IsReturnable, CASE TR.IssueById WHEN 1 THEN 'Self' ELSE 'Department'  END AS IssueByName,ND.BS_Date as VoucherDateMitti,
 CASE WHEN TR.IssueById = 1 THEN E.Name WHEN TR.IssueById = 2  THEN V.Name ELSE '' END AS StaffName,
 B.Name as BranchName, 
 CASE WHEN TR.IssueById = 1 THEN E.EmployeeCode WHEN TR.IssueById = 2 THEN V.EmployeeCode ELSE '' END AS EmployeeCode,U.Name AS CreateBy,CC.Name AS FiscalYear
 FROM dbo.tbl_AssetIssue(nolock) TR  
 left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
 left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId 
 left join V_Employee(nolock)E on E.UserId = TR.UserId
 left join tbl_HeadOfDepartment(nolock) H on H.TranId = TR.HODId
 left join V_Employee(nolock) V on V.EmployeeId = H.EmployeeId
 LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
 LEFT JOIN dbo.tbl_CostClass(NOLOCK)CC ON CC.CostClassId = TR.CostClassId
END;   

GO

Create procedure usp_GetAssetIssueById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.IssueNo,TR.IssueById,TR.DepartmentId,TR.HODId,TR.VoucherDate,TR.UserId,TR.BranchId,TR.BarCode,TR.Remarks,TR.IsReturnable,TR.AssetReqNo,TR.AutoVoucherNo,
 TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_AssetIssue(nolock) TR  where TR.TranId=@TranId ; 

 select CTR.TranId,CTR.ParticularId,CTR.CategoryId,CTR.PurposeId,CTR.QTY,CTR.ReqFrom,CTR.ReqTO,CTR.IssueDetId,CTR.ReqDetailsId,CTR.IssueRemakes,
 AM.Name AS Particular, CASE WHEN CTR.CategoryId = 1 THEN  'Internal Use' WHEN CTR.CategoryId = 2 THEN 'External Activities' ELSE 'Events & Training' END AS Category,
 CASE 
 WHEN CTR.PurposeId = 1 THEN 'Department Work' 
 WHEN CTR.PurposeId = 2 THEN 'Administrative Tasks' 
 WHEN CTR.PurposeId = 3 THEN 'Personal Use (Authorized)' 
 WHEN CTR.PurposeId = 4 THEN 'Official Tour' 
 WHEN CTR.PurposeId = 5 THEN 'Field Visit' 
 WHEN CTR.PurposeId = 6 THEN 'Guest Use' 
 WHEN CTR.PurposeId = 7 THEN 'Training / Workshop' 
 ELSE 'Event / Seminar / Conference' END AS Purpose
 FROM dbo.tbl_AssetsIssueDetails(nolock) CTR 
 LEFT JOIN dbo.tbl_Assetsmaster(NOLOCK)AM ON AM.TranId = CTR.ParticularId
 WHERE CTR.TranId=@TranId ; 

select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetIssueDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 

END;

GO

Create procedure [dbo].[usp_AddAssetsIssueDetailsDetails]
(
@TranId		              int,
@ParticularId		        int=null,
@CategoryId		          int=null,
@PurposeId		           int=null,
@QTY		                 int=null,
@ReqFrom		             date=null,
@ReqTO		               date=null,
@UserId		               int ,
@ReqDetailsId			INT,
@IssueRemakes			NVARCHAR(254)=null
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetsIssueDetails(IssueRemakes,ReqDetailsId,TranId,ParticularId,CategoryId,PurposeId,QTY,ReqFrom,ReqTO)
	     values(@IssueRemakes,@ReqDetailsId,@TranId,@ParticularId,@CategoryId,@PurposeId,@QTY,@ReqFrom,@ReqTO)
END;   

GO

Create procedure usp_AssetIssueDocAtt
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

 insert into dbo.tbl_AssetIssueDocAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   

GO

 Create procedure usp_DelAssetIssueById
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

declare @TranName varchar(40) = 'AssetIssue'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetIssue(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetIssue Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetIssue was already in used. ' ;  
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


Create PROCEDURE usp_GetPendingAssetsIssue
(
@UserId			INT,
@IssueNo		nvarchar(100)=NULL,
@IssueBy		INT=NULL,
@BranchId		INT=NULL,
@DepartmentId	INT=NULL,
@IssueUserId	INT=NULL 
)
AS
BEGIN
  SET NOCOUNT ON ;
  EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
 
  SELECT AID.IssueDetId as TranId,AID.ParticularId,rtrim(rtrim(AM.Name+' - '+isnull(AM.Code,''))+' - '+isnull(AM.SerialNum,'')) AS Particular,AID.CategoryId,
  CASE WHEN AID.CategoryId = 1 THEN  'Internal Use' WHEN AID.CategoryId = 2 THEN 'External Activities' ELSE 'Events & Training' END AS Category,
  AID.PurposeId,
  CASE 
	WHEN AID.PurposeId = 1 THEN 'Department Work' 
	WHEN AID.PurposeId = 2 THEN 'Administrative Tasks' 
	WHEN AID.PurposeId = 3 THEN 'Personal Use (Authorized)' 
	WHEN AID.PurposeId = 4 THEN 'Official Tour' 
	WHEN AID.PurposeId = 5 THEN 'Field Visit' 
	WHEN AID.PurposeId = 6 THEN 'Guest Use' 
	WHEN AID.PurposeId = 7 THEN 'Training / Workshop' 
	ELSE 'Event / Seminar / Conference' END AS Purpose,  
  (AID.QTY - ISNULL(ISD.ReturnQty, 0)) AS RemainingQty,AI.VoucherDate AS EntryDate,ND2.BS_Date AS EntryDateBS,
  DATEDIFF(DAY, AI.VoucherDate, GETDATE()) AS IssueDays,AI.AutoManualNo as VoucherNo,E.Name AS IssueBy,AI.AutoVoucherNo,
  AI.IssueById,AI.UserId,AI.DepartmentId,AI.HODId
  FROM dbo.tbl_AssetIssue(NOLOCK)AI
  LEFT JOIN dbo.tbl_AssetsIssueDetails(NOLOCK)AID ON AID.TranId = AI.TranId
  LEFT JOIN dbo.tbl_NepaliDate(NOLOCK)ND2 ON ND2.AD_Date = CONVERT(DATE,AI.VoucherDate,101)
  LEFT JOIN dbo.tbl_Assetsmaster(NOLOCK)AM ON AM.TranId = AID.ParticularId
  LEFT JOIN dbo.V_User(NOLOCK)E ON E.UserId = AI.CreateBy
  LEFT JOIN (SELECT IssueId, SUM(QTY) AS ReturnQty FROM dbo.tbl_AssetReturnDetails(NOLOCK) GROUP BY IssueId )ISD ON ISD.IssueId = AID.IssueDetId
  WHERE AI.IsReturnable= 1 AND (@IssueNo IS NULL OR AI.AutoManualNo=@IssueNo) AND (@IssueBy IS NULL OR AI.IssueById=@IssueBy)
  AND (@BranchId IS NULL OR AI.BranchId=@BranchId) AND (@DepartmentId IS NULL OR AI.DepartmentId=@DepartmentId)
  AND (@IssueUserId IS NULL OR AI.UserId = @IssueUserId OR AI.HODId = @IssueUserId) 
  AND (SELECT ISNULL(SUM(AD.QTY), 0) FROM dbo.tbl_AssetReturnDetails (NOLOCK)AD WHERE AD.IssueId = AID.IssueDetId) < AID.QTY
 
END

GO

-------------------Asset Return

Create procedure usp_AddAssetReturn
(
@ReturnNo		            int=null,
@ReturnById		          int=null,
@DepartmentId		        int=null,
@HODId		               int=null,
@VoucherDate		          date=null,
@EUserId		          int=null,
@BranchId		            int=null,
@BarCode		             nvarchar(400)=null,
@Remarks		             nvarchar(500)=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int,
@CostClassId		         int,
@Attributes		          nvarchar(100)=null,
@UDFKeyVal		           nvarchar(100)=null,
@IssueNo		             nvarchar(100)=null,
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

declare @TranName varchar(40) = 'AssetReturn'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 
		EXEC [sp_GetAutoVoucherNo] @UserId,@VoucherId,@CostClassId,@VoucherDate,76,@AutoVoucherNo out,@AutoManualNo out;
	 insert into dbo.tbl_AssetReturn(ReturnNo,ReturnById,DepartmentId,HODId,VoucherDate,UserId,BranchId,BarCode,Remarks,IssueNo,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal,CreateBy)
	     values(@ReturnNo,@ReturnById,@DepartmentId,@HODId,@VoucherDate,@EUserId,@BranchId,@BarCode,@Remarks,@IssueNo,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal,@UserId)
	 commit transaction @TranName; 
	 	 set @TranId=(select IDENT_CURRENT('tbl_AssetReturn'));
	 SET @ResponseMSG='AssetReturn Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetReturn Data ';  
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

 Create procedure [dbo].[usp_UpdateAssetReturn]
(
@ReturnNo		            int=null,
@ReturnById		          int=null,
@DepartmentId		        int=null,
@HODId		               int=null,
@VoucherDate		          date=null,
@EUserId		          int=null,
@BranchId		            int=null,
@BarCode		             nvarchar(400)=null,
@Remarks		             nvarchar(500)=null,
@IssueNo		             nvarchar(100)=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int,
@CostClassId		         int,
@Attributes		          nvarchar(100)=null,
@UDFKeyVal		           nvarchar(100)=null,
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

declare @TranName varchar(40) = 'AssetReturn'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetReturnDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_AssetReturn set ReturnNo=@ReturnNo,ReturnById=@ReturnById,DepartmentId=@DepartmentId,IssueNo=@IssueNo,HODId=@HODId,VoucherDate=@VoucherDate,UserId=@UserId,BranchId=@BranchId,BarCode=@BarCode,Remarks=@Remarks,VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetReturn Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetReturn Data ' ;  
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

Create procedure usp_AddAssetReturnDetailsDetails
(
@TranId		              int,
@ParticularId		        int=null,
@CategoryId		          int=null,
@PurposeId		           int=null,
@QTY		                 int=null,
@StatusId		            int=null,
@UserId		               INT,
@IssueId				INT
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetReturnDetails(IssueId,TranId,ParticularId,CategoryId,PurposeId,QTY,StatusId)
	     values(@IssueId,@TranId,@ParticularId,@CategoryId,@PurposeId,@QTY,@StatusId)
END;   

GO

 Create procedure usp_AssetReturnDocAtt
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
 
insert into dbo.tbl_AssetReturnDocAtt(TranId,DocumentTypeId,Name,docDescription,Extension,Document,DocPath)
	     values(@TranId,@DocumentTypeId,@Name,@docDescription,@Extension,@Document,@DocPath)
END;   
 
GO

Create procedure usp_GetAssetReturnById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.ReturnNo,TR.ReturnById,TR.DepartmentId,TR.IssueNo,TR.HODId,TR.VoucherDate,TR.UserId,TR.BranchId,TR.BarCode,TR.Remarks,
 TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_AssetReturn(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.CategoryId,CTR.PurposeId,CTR.QTY,CTR.StatusId, 
 AM.Name AS Particular, CASE WHEN CTR.CategoryId = 1 THEN  'Internal Use' WHEN CTR.CategoryId = 2 THEN 'External Activities' ELSE 'Events & Training' END AS Category,
 CASE 
 WHEN CTR.PurposeId = 1 THEN 'Department Work' 
 WHEN CTR.PurposeId = 2 THEN 'Administrative Tasks' 
 WHEN CTR.PurposeId = 3 THEN 'Personal Use (Authorized)' 
 WHEN CTR.PurposeId = 4 THEN 'Official Tour' 
 WHEN CTR.PurposeId = 5 THEN 'Field Visit' 
 WHEN CTR.PurposeId = 6 THEN 'Guest Use' 
 WHEN CTR.PurposeId = 7 THEN 'Training / Workshop' 
 ELSE 'Event / Seminar / Conference' END AS Purpose,CTR.IssueId
 FROM dbo.tbl_AssetReturnDetails(nolock) CTR 
 LEFT JOIN dbo.tbl_Assetsmaster(NOLOCK)AM ON AM.TranId = CTR.ParticularId
 WHERE CTR.TranId=@TranId ; 
 select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetReturnDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 
END; 

GO

 Create procedure usp_DelAssetReturnById
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

declare @TranName varchar(40) = 'AssetReturn'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetReturn(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetReturn Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetReturn was already in used. ' ;  
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

Create PROCEDURE usp_GetAllAssetReturn
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

  select TR.TranId,TR.AutoManualNo,TR.ReturnById,TR.DepartmentId,TR.HODId,TR.VoucherDate,TR.UserId,TR.BranchId,TR.BarCode,TR.Remarks,
  CASE TR.ReturnById WHEN 1 THEN 'Self' WHEN 2 THEN 'Department' ELSE '' END AS ReturnByName,
  ND.BS_Date as ReturnMitti, 
  CASE WHEN TR.ReturnById = 1 THEN  E.Name WHEN TR.ReturnById = 2  THEN V.Name ELSE '' END AS StaffName,
  B.Name as BranchName,U.Name AS CreateBy,CC.Name AS FiscalYear,
 CASE WHEN TR.ReturnById = 1 THEN E.EmployeeCode WHEN TR.ReturnById = 2 THEN V.EmployeeCode ELSE '' END AS EmployeeCode
 from dbo.tbl_AssetReturn(nolock) TR  
  left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
 left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId 
 left join V_Employee(nolock)E on E.UserId = TR.UserId
 left join tbl_HeadOfDepartment(nolock) H on H.TranId = TR.HODId
 left join V_Employee(nolock) V on V.EmployeeId = H.EmployeeId
 LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
 LEFT JOIN dbo.tbl_CostClass(NOLOCK)CC ON CC.CostClassId = TR.CostClassId

END; 

GO
----------------------Assert Damage

Create procedure [dbo].[usp_AddAssetdamage]
(
@ReturnNo		            int=null,
@VoucherDate		          date=null,
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
	 
		EXEC sp_GetAutoVoucherNo @UserId,@VoucherId,@CostClassId,@VoucherDate,77,@AutoVoucherNo out,@AutoManualNo out;
	 insert into dbo.tbl_Assetdamage(ReturnNo,VoucherDate,BranchId,Remark,OutLocation,IsOutsideRequired,VendorId,CreateBy,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal)
	     values(@ReturnNo,@VoucherDate,@BranchId,@Remark,@OutLocation,@IsOutsideRequired,@VendorId,@UserId,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal)
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

Go


Create procedure usp_UpdateAssetdamage
(
@ReturnNo		            int=null,
@VoucherDate		          date=null,
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

IF EXISTS ( SELECT 1 FROM dbo.tbl_RepairedInwardDetails (NOLOCK)ARD 
INNER JOIN tbl_AssetdamageDetails(NOLOCK)AID  ON ARD.DamageDetId = AID.DamageDetId WHERE AID.TranId = @TranId)

declare @TranName varchar(40) = 'Assetdamage'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetdamageDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_Assetdamage set VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal, ReturnNo=@ReturnNo,VoucherDate=@VoucherDate,BranchId=@BranchId,Remark=@Remark,OutLocation=@OutLocation,IsOutsideRequired=@IsOutsideRequired,VendorId=@VendorId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
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

Go


 Create procedure usp_GetAllAssetdamage
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.AutoManualNo,TR.VoucherDate,TR.BranchId,TR.Remark, ND.BS_Date as DamageMitti, B.Name as BranchName,L.Name as PartyName,L.Code as PartyCode,
 U.Name AS CreateBy,CC.Name AS FiscalYear
 FROM dbo.tbl_Assetdamage(nolock) TR
  left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
  left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId 
  left join tbl_Ledger(nolock) L on L.LedgerId = TR.vendorId
  left JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
 LEFT JOIN dbo.tbl_CostClass(NOLOCK)CC ON CC.CostClassId = TR.CostClassId; 
END;   

GO

Create procedure usp_GetAssetdamageById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.ReturnNo,TR.VoucherDate,TR.BranchId,TR.Remark,TR.OutLocation,TR.IsOutsideRequired,TR.VendorId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_Assetdamage(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.Qty,CTR.StatusId from dbo.tbl_AssetdamageDetails(nolock) CTR  where CTR.TranId=@TranId ; 
   select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_AssetDamageDocAtt(nolock) CTR  where CTR.TranId=@TranId ; 

END;   

 GO

Create procedure usp_DelAssetdamageById
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

declare @TranName varchar(40) = 'Assetdamage'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_Assetdamage(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Assetdamage Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. Assetdamage was already in used. ' ;  
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

 Create procedure usp_AddAssetdamageDetailsDetails
(
@TranId		              int=null,
@ParticularId		        int=null,
@Qty		                 float(8)=null,
@StatusId		            int=null,
@UserId		               int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetdamageDetails(TranId,ParticularId,Qty,StatusId)
	     values(@TranId,@ParticularId,@Qty,@StatusId)
END;   

GO

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


CREATE PROCEDURE usp_GetPendingDamageDetails
(
@UserId			INT,
@VendorId		INT
)
AS
BEGIN
SET NOCOUNT ON;
EXEC sp_set_session_context @key = N'UserId', @value = @UserId;

	SELECT AD.TranId,AD.AutoVoucherNo AS ReturnNo,AD.IsOutsideRequired,AD.VendorId,AD.OutLocation,AD.VoucherDate AS EntryDate,ND.BS_Date AS EntryMitti,DATEDIFF(DAY, AD.VoucherDate, GETDATE()) AS DamageDays,
	DD.DamageDetId,DD.ParticularId,rtrim(rtrim(AM.Name+' - '+isnull(AM.Code,''))+' - '+isnull(AM.SerialNum,'')) AS Particular,
	(DD.Qty - ISNULL(ISD.DamageQty, 0)) AS RemainingQty ,DD.StatusId,
	CASE WHEN DD.StatusId = 1 THEN  'Requires Out Side Repair' WHEN DD.StatusId = 2 THEN 'Damaged' ELSE 'Lost' END AS Status,U.UserName AS CreateBy,AD.Remark,
	AD.AutoManualNo AS VoucherNo	
	FROM dbo.tbl_Assetdamage(NOLOCK)AD
	LEFT JOIN dbo.tbl_NepaliDate(NOLOCK)ND ON ND.AD_Date = CONVERT(DATE,AD.VoucherDate,101)
	LEFT JOIN dbo.tbl_AssetdamageDetails(NOLOCK)DD ON DD.TranId= AD.TranId 
	LEFT JOIN dbo.tbl_Assetsmaster(NOLOCK)AM ON AM.TranId = DD.ParticularId
	LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = AD.CreateBy
	LEFT JOIN (SELECT DamageDetId, SUM(QTY) AS DamageQty FROM dbo.tbl_RepairedInwardDetails(NOLOCK) GROUP BY DamageDetId )ISD ON ISD.DamageDetId = DD.DamageDetId
	WHERE AD.IsOutsideRequired= 1 and AD.VendorId = @VendorId AND DD.StatusId = 1
	AND (SELECT ISNULL(SUM(AD.QTY), 0) FROM dbo.tbl_RepairedInwardDetails(NOLOCK)AD WHERE AD.DamageDetId = DD.DamageDetId) < DD.QTY
END;

GO
 
-------------------RepairedInward

Create procedure usp_AddRepairedInward
(
@RepairedNo		          int=null,
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
	 
		EXEC sp_GetAutoVoucherNo @UserId,@VoucherId,@CostClassId,@VoucherDate,78,@AutoVoucherNo out,@AutoManualNo out;
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

Create procedure usp_UpdateRepairedInward
(
@RepairedNo		          int=null,
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
	 update top (1) dbo.tbl_RepairedInward set RepairedNo=@RepairedNo,RefNo=@RefNo,BranchId=@BranchId,VoucherDate=@VoucherDate,
	 OutsideLocation=@OutsideLocation,VendorId=@VendorId,VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal,
	 Remark=@Remark,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
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

Create procedure usp_AddRepairedInwardDetailsDetails
(
@TranId		              int,
@ParticularId		        int=null,
@QTY		                 int=null,
@StatusId		            int=null,
@RequiredInDate		      date=null,
@Amount		             float=null,
@UserId		               INT,
@DamageDetId				INT 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_RepairedInwardDetails(DamageDetId,TranId,ParticularId,QTY,StatusId,RequiredInDate,Amount)
	     values(@DamageDetId,@TranId,@ParticularId,@QTY,@StatusId,@RequiredInDate,@Amount)
END;   

GO


Create procedure usp_AddRepairedInwardAttDetails
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

Create procedure usp_GetRepairedInwardById
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
 select CTR.TranId,CTR.ParticularId,CTR.QTY,CTR.StatusId,CTR.RequiredInDate,CTR.Amount,CTR.DamageDetId,
 AM.Name AS Particular
 FROM dbo.tbl_RepairedInwardDetails(nolock) CTR
 LEFT JOIN dbo.tbl_Assetsmaster(NOLOCK)AM ON AM.TranId= CTR.ParticularId WHERE CTR.TranId=@TranId ; 
 select CTR.DocumentTypeId,CTR.Name,CTR.docDescription,CTR.Extension,CTR.DocPath from dbo.tbl_RepairedInwardAtt(nolock) CTR  where CTR.TranId=@TranId ; 
END;   

GO

Create procedure usp_GetAllRepairedInward
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.RepairedNo,TR.RefNo,TR.BranchId,TR.VoucherDate,TR.OutsideLocation,TR.VendorId,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,
TR.Attributes,TR.UDFKeyVal,TR.Remark,L.Name as LedgerName,L.Code as LedgerCode,ND.BS_Date as VoucherMitti,B.Name as BranchName,U.Name AS CreateBy,
Cc.Name AS FiscalYear
from dbo.tbl_RepairedInward(nolock) TR   
left join tbl_Ledger(nolock) L on L.LedgerId = TR.VendorId
 left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
 left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId
 LEFT JOIN dbo.V_User(NOLOCK)U ON U.UserId = TR.CreateBy
 LEFT JOIN dbo.tbl_CostClass(NOLOCK)CC ON CC.CostClassId = TR.CostClassId; 

END;   

GO

Create procedure usp_DelRepairedInwardById
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


Create PROCEDURE [dbo].[usp_GetAssetClosingStock]
(
    @UserId     INT,
    @EntityId   INT = NULL,
    @TranId     INT = NULL,
    @BranchId int=null,
    @VoucherDate date=null    
)
AS
BEGIN
    SET NOCOUNT ON;
    EXEC sp_set_session_context @key = N'UserId', @value = @UserId;
    DECLARE @Today DATE = CONVERT(DATE, GETDATE());
    
     IF OBJECT_ID(N'tempdb..#tmpUserWiseBranch') IS NOT NULL
    BEGIN
	    DROP TABLE #tmpUserWiseBranch
    END;


    create table #tmpUserWiseBranch(BranchId int);
    if @BranchId>0
	    insert into #tmpUserWiseBranch values(@BranchId);
    else
       insert into #tmpUserWiseBranch select * from dbo.fn_GetUserSecurityBranch(@UserId);

        if @VoucherDate is null
          set @VoucherDate=@Today;

        select Sum(Qty) AS ClosingStock from
        (
        select AD.Qty from  #tmpUserWiseBranch tmpB inner join dbo.tbl_AssetOpening(nolock) A on A.BranchId=tmpB.BranchId  
        inner join dbo.tbl_AssetOpeningDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId

        union ALL
        
        select AD.Qty from  #tmpUserWiseBranch tmpB inner join tbl_AssetInward(nolock) A on A.BranchId=tmpB.BranchId  
        inner join tbl_AssetInwardDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId
        union ALL
        

        select AD.Qty from  #tmpUserWiseBranch tmpB inner join dbo.tbl_AssetTransfer(nolock) A on A.ToBranchId=tmpB.BranchId  
        inner join dbo.tbl_AssetTransferDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId
        union ALL

        select -AD.Qty from  #tmpUserWiseBranch tmpB inner join dbo.tbl_AssetTransfer(nolock) A on A.FromBranchId=tmpB.BranchId  
        inner join dbo.tbl_AssetTransferDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId

        union ALL


        select -AD.Qty from  #tmpUserWiseBranch tmpB inner join tbl_AssetIssue(nolock) A on A.BranchId=tmpB.BranchId  
        inner join tbl_AssetsIssueDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId
         union ALL
         
        select AD.Qty from  #tmpUserWiseBranch tmpB inner join tbl_AssetReturn(nolock) A on A.BranchId=tmpB.BranchId  
        inner join tbl_AssetReturnDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId
        union all
        select -AD.Qty from  #tmpUserWiseBranch tmpB inner join tbl_Assetdamage(nolock) A on A.BranchId=tmpB.BranchId  
        inner join tbl_AssetdamageDetails(nolock) AD on AD.TranId=A.TranId
        where AD.ParticularId=@TranId

        union ALL
        
        select AD.Qty from  #tmpUserWiseBranch tmpB inner join dbo.tbl_RepairedInward(nolock) A on A.BranchId=tmpB.BranchId  
        inner join tbl_RepairedInwardDetails(nolock) AD on AD.TranId=A.TranId
        WHERE AD.StatusId=2 and AD.ParticularId=@TranId
         ) st  


    
 IF OBJECT_ID(N'tempdb..#tmpUserWiseBranch') IS NOT NULL
BEGIN
	DROP TABLE #tmpUserWiseBranch
END;

end

GO

