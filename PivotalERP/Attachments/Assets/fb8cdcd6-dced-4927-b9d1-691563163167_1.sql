

create table tbl_AssetGroup
(
AssetGroupId				int not null identity(1,1) primary key,
GroupName					nvarchar(254) not null,
GroupCode					nvarchar(254) not null,
GroupParentId               int not null,
CreateBy                    int not null constraint fk_AssetGroup_CreateBy foreign key references tbl_User(UserId),
ModifyBy                    int null constraint fk_AssetGroup_ModifyBy foreign key references tbl_User(UserId),
UpdateLogDateTime           datetime,
LogDateTime                 datetime not null default current_timestamp
)

 Go 

create table tbl_AssetType
(
AssetTypeId				int not null identity(1,1) primary key,
TypeName				nvarchar(254) not null,
TypeCode				nvarchar(254) not null,
TypeParentId            int not null,
CreateBy                int not null constraint fk_AssetType_CreateBy foreign key references tbl_User(UserId),
ModifyBy                int null constraint fk_AssetType_ModifyBy foreign key references tbl_User(UserId),
UpdateLogDateTime       datetime,
LogDateTime             datetime not null default current_timestamp
)

 Go 

CREATE TABLE tbl_AssetTypeDetails
(
    AssetTypeId        int NOT null constraint fk_AssetTypeDetails_AssetTypeId foreign key references tbl_AssetType(AssetTypeId) on delete cascade,
	TextColumn         nvarchar(254) NULL,
	RefColumn          nvarchar(254) NULL,
	RefTable           nvarchar(254) NULL,
	CanAlter           bit NULL,
	CanEditable        bit NULL,
	ProductId          int NULL,
	LedgerId           int NULL,
	ColWidth           int NULL,
	Source             nvarchar(254) NULL,
	Formula            nvarchar(254) NULL,
	Name               nvarchar(254) NULL,
	FieldAfter         int NULL,
	IsMandatory        bit NULL,
	DropDownList       nvarchar(254) NULL,
	DefaultValue       nvarchar(254) NULL,
	FieldType          int NULL,
	Label              nvarchar(254) NULL,
	SNo                int NULL,
	OnDeleteCascade    bit NULL,
	ShowInSearch       bit NULL
)

 GO 

create table tbl_AssetModel
(
AssetModelId			int not null identity(1,1) primary key,
ModelName				nvarchar(254) not null,
ModelCode				nvarchar(254) not null,
ModelParentId           int not null,
CreateBy                int not null constraint fk_AssetModel_CreateBy foreign key references tbl_User(UserId),
ModifyBy                int null constraint fk_AssetModel_ModifyBy foreign key references tbl_User(UserId),
UpdateLogDateTime       datetime,
LogDateTime             datetime not null default current_timestamp
)

 Go 

CREATE TABLE tbl_Assetsmaster
(
    TranId              INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name                NVARCHAR(100) NOT NULL,
    Alias               NVARCHAR(100) NULL,
    Code                NVARCHAR(30) NULL,
    Photo               NVARCHAR(400) NULL,
    AssetGroupId        INT NULL  CONSTRAINT fk_Assetsmaster_AssetGroupId  FOREIGN KEY REFERENCES tbl_AssetGroup(AssetGroupId),
    AssetTypeId         INT NULL    CONSTRAINT fk_Assetsmaster_AssetTypeId  FOREIGN KEY REFERENCES tbl_AssetType(AssetTypeId),
    ModelId             INT NULL   CONSTRAINT fk_Assetsmaster_ModelId  FOREIGN KEY REFERENCES tbl_AssetModel(AssetModelId),
    RackId              INT NULL,
    RAMId               INT NULL,
    ROMId               INT NULL,
    BranchId            INT NULL  CONSTRAINT fk_Assetsmaster_BranchId   FOREIGN KEY REFERENCES tbl_Branch(BranchId),
    PurchaseRate        FLOAT NULL,
    DepreciationRate    FLOAT NULL,
    StatusId            INT NULL,
    Notes               NTEXT NULL,
    SerialNum           NVARCHAR(100) NULL,
    CreateBy            INT NOT NULL   CONSTRAINT fk_Assetsmaster_CreateBy   FOREIGN KEY REFERENCES TBL_USER(UserId),
    ModifyBy            INT NULL  CONSTRAINT fk_Assetsmaster_ModifyBy  FOREIGN KEY REFERENCES TBL_USER(UserId),
    UpdateLogDateTime   DATETIME,
    LogDateTime         DATETIME NOT NULL  DEFAULT (GETDATE()),
    ProductId           INT NULL  CONSTRAINT fk_Assetsmaster_ProductId  FOREIGN KEY REFERENCES tbl_Product(ProductId),
	UnitId  			INT NULL CONSTRAINT fk_Assetsmaster_UnitId foreign key references TBL_UNIT(UnitId)
);

 GO 

CREATE TABLE tbl_AssetOpening
(
    TranId          INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    OpeningNo       INT NULL,
    BranchId        INT NULL   CONSTRAINT fk_AssetOpening_BranchId REFERENCES tbl_Branch(BranchId),
    FYearId         INT NULL  CONSTRAINT fk_AssetOpening_FYearId    REFERENCES tbl_CostClass(CostClassId),
    VoucherDate     DATE NULL,
    Remarks         NVARCHAR(254) NULL,
    CreateBy        INT NOT NULL  CONSTRAINT fk_AssetOpening_CreateBy  REFERENCES TBL_USER(UserId),
    ModifyBy        INT NULL     CONSTRAINT fk_AssetOpening_ModifyBy   REFERENCES TBL_USER(UserId),
    UpdateLogDateTime DATETIME NULL,
    LogDateTime     DATETIME NOT NULL DEFAULT GETDATE(),
    AutoVoucherNo   INT NULL,
    ManualVoucherNO NVARCHAR(50) NULL,
    AutoManualNo    NVARCHAR(50) NULL,
    VoucherId       INT NULL     CONSTRAINT fk_AssetOpening_VoucherId     REFERENCES tbl_Voucher(VoucherId),
    CostClassId     INT NULL     CONSTRAINT fk_tbl_AssetOpening_CostClass   REFERENCES tbl_CostClass(CostClassId),
    Attributes      NVARCHAR(MAX) NULL,
    UDFKeyVal       NVARCHAR(MAX) NULL
);

 GO 

CREATE TABLE tbl_AssetOpeningDetails
(
TranId         INT NULL   CONSTRAINT fk_AssetOpeningDetails_TranId   REFERENCES tbl_AssetOpening(TranId)  ON DELETE CASCADE,
ParticularId   INT NULL     CONSTRAINT fk_AssetOpeningDetails_ParticularId   REFERENCES tbl_Assetsmaster(TranId),
Qty            FLOAT NULL,
Rate           FLOAT NULL,
Amt            FLOAT NULL
);

 GO 

create procedure usp_AddAssetGroup
(
@GroupName		           nvarchar(508),
@GroupCode		           nvarchar(508),
@GroupParentId			   int=0,
@UserId		               int , 
@EntityId		           int=null ,
@AssetGroupId		       int=null output ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetGroup'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 insert into dbo.tbl_AssetGroup(GroupName,GroupCode,GroupParentId,CreateBy)
	     values(@GroupName,@GroupCode,@GroupParentId,@UserId)
	 commit transaction @TranName; 
	 Set @AssetGroupId = (select IDENT_CURRENT('tbl_AssetGroup'));
	 SET @ResponseMSG='AssetGroup Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetGroup Data ';  
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

 Create procedure usp_UpdateAssetGroup
(
@GroupName		           nvarchar(508),
@GroupCode		           nvarchar(508),
@GroupParentId			   int=0,
@UserId		               int , 
@EntityId		           int=null ,
@AssetGroupId		       int ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetGroup'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 update top (1) dbo.tbl_AssetGroup set GroupName=@GroupName,GroupCode=@GroupCode,GroupParentId=@GroupParentId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where AssetGroupId=@AssetGroupId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetGroup Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetGroup Data ' ;  
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

Create procedure usp_GetAllAssetGroup
(
@UserId		               int , 
@EntityId		           int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.AssetGroupId,TR.GroupName,TR.GroupCode,TD.GroupName as GroupParentName from dbo.tbl_AssetGroup(nolock) TR left join dbo.tbl_AssetGroup(nolock) TD on TR.GroupParentId=TD.AssetGroupId; 
END;   

GO

Create procedure usp_GetAssetGroupById
(
@AssetGroupId		      int , 
@UserId		              int , 
@EntityId		          int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.AssetGroupId,TR.GroupName,TR.GroupCode, TR.GroupParentId from dbo.tbl_AssetGroup(nolock) TR  where TR.AssetGroupId=@AssetGroupId ; 
END;   

 GO 

CREATE procedure usp_DelAssetGroupById
(
@AssetGroupId		       int , 
@UserId		               int , 
@EntityId		           int=null ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetGroup'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetGroup(nolock) TR  where TR.AssetGroupId=@AssetGroupId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetGroup Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetGroup was already in used. ' ;  
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

CREATE procedure usp_AddAssetType
(
@TypeName		            nvarchar(508),
@TypeCode		            nvarchar(508),
@TypeParentId		        int=0,
@UserId		                int , 
@EntityId		            int=null ,
@AssetTypeId		        int=null output ,
@ResponseMSG		        nvarchar(254)='Invalid' output ,
@IsSuccess		            bit=0 output, 
@ErrorNumber		        int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'AssetType'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 insert into dbo.tbl_AssetType(TypeName,TypeCode,TypeParentId,CreateBy)
	     values(@TypeName,@TypeCode,@TypeParentId,@UserId)
	 commit transaction @TranName; 
	 	 set @AssetTypeId=(select IDENT_CURRENT('tbl_AssetType'));
	 SET @ResponseMSG='AssetType Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetType Data ';  
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

CREATE procedure usp_AddAssetTypeDetailsDetails
(
@AssetTypeId		      int,
@TextColumn		          nvarchar(508)=null,
@RefColumn		          nvarchar(508)=null,
@RefTable		          nvarchar(508)=null,
@CanAlter		          bit=null,
@CanEditable		      bit=null,
@ProductId		          int=null,
@LedgerId		          int=null,
@ColWidth		          int=null,
@Source		              nvarchar(508)=null,
@Formula		          nvarchar(508)=null,
@Name		              nvarchar(508)=null,
@FieldAfter		          int=null,
@IsMandatory		      bit=null,
@DropDownList		      nvarchar(508)=null,
@DefaultValue		      nvarchar(508)=null,
@FieldType		          int=null,
@Label		              nvarchar(508)=null,
@SNo		              int=null,
@OnDeleteCascade		  bit=null,
@ShowInSearch		      bit=null,
@UserId		              int 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

 insert into dbo.tbl_AssetTypeDetails(AssetTypeId,TextColumn,RefColumn,RefTable,CanAlter,CanEditable,ProductId,LedgerId,ColWidth,Source,Formula,Name,FieldAfter,IsMandatory,DropDownList,DefaultValue,FieldType,Label,SNo,OnDeleteCascade,ShowInSearch)
	     values(@AssetTypeId,@TextColumn,@RefColumn,@RefTable,@CanAlter,@CanEditable,@ProductId,@LedgerId,@ColWidth,@Source,@Formula,@Name,@FieldAfter,@IsMandatory,@DropDownList,@DefaultValue,@FieldType,@Label,@SNo,@OnDeleteCascade,@ShowInSearch)
END;   

 GO 

CREATE procedure usp_UpdateAssetType
(
@TypeName		            nvarchar(508),
@TypeCode		            nvarchar(508),
@TypeParentId		        int,
@UserId		                int , 
@EntityId		            int=null ,
@AssetTypeId		        int ,
@ResponseMSG		        nvarchar(254)='Invalid' output ,
@IsSuccess		            bit=0 output, 
@ErrorNumber		        int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @BranchId int;
select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId; 

declare @TranName varchar(40) = 'AssetType'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetTypeDetails(nolock) CTR  where CTR.AssetTypeId=@AssetTypeId ; 
	 update top (1) dbo.tbl_AssetType set TypeName=@TypeName,TypeCode=@TypeCode,TypeParentId=@TypeParentId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where AssetTypeId=@AssetTypeId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetType Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetType Data ' ;  
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

 CREATE procedure usp_GetAllAssetType
(
@UserId		               int , 
@EntityId		           int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

  select TR.AssetTypeId,TR.TypeName,TR.TypeCode,TR.TypeName as TypeParentName from dbo.tbl_AssetType(nolock) TR 
 left join tbl_AssetType(nolock)AT on AT.TypeParentId = TR.TypeParentId;  
END;   

 GO 

CREATE procedure usp_GetAssetTypeById
(
@AssetTypeId		       int , 
@UserId		               int , 
@EntityId		           int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.AssetTypeId,TR.TypeName,TR.TypeCode,TR.TypeParentId from dbo.tbl_AssetType(nolock) TR  where TR.AssetTypeId=@AssetTypeId ; 
 select CTR.AssetTypeId,CTR.TextColumn,CTR.RefColumn,CTR.RefTable,CTR.CanAlter,CTR.CanEditable,CTR.ProductId,CTR.LedgerId,CTR.ColWidth,CTR.Source,CTR.Formula,CTR.Name,CTR.FieldAfter,CTR.IsMandatory,CTR.DropDownList,CTR.DefaultValue,CTR.FieldType,CTR.Label,CTR.SNo,CTR.OnDeleteCascade,CTR.ShowInSearch from dbo.tbl_AssetTypeDetails(nolock) CTR  where CTR.AssetTypeId=@AssetTypeId ; 
END;   

 GO 

CREATE procedure usp_DelAssetTypeById
(
@AssetTypeId		       int , 
@UserId		               int , 
@EntityId		           int=null ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetType'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetType(nolock) TR  where TR.AssetTypeId=@AssetTypeId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetType Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetType was already in used. ' ;  
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

Create procedure usp_AddAssetModel
(
@ModelName		           nvarchar(508),
@ModelCode		           nvarchar(508),
@ModelParentId			   int=0,
@UserId		               int , 
@EntityId		           int=null ,
@AssetModelId		       int=null output ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetModel'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 insert into dbo.tbl_AssetModel(ModelName,ModelCode,ModelParentId,CreateBy)
	     values(@ModelName,@ModelCode,@ModelParentId,@UserId)
	 commit transaction @TranName;
	 Set @AssetModelId = (select IDENT_CURRENT('tbl_AssetModel'));
	 SET @ResponseMSG='AssetModel Save Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetModel Data ';  
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

Create procedure usp_UpdateAssetModel
(
@ModelName		           nvarchar(508),
@ModelCode		           nvarchar(508),
@ModelParentId			   int=0,
@UserId		               int , 
@EntityId		           int=null ,
@AssetModelId		       int ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 
declare @TranName varchar(40) = 'AssetModel'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 update top (1) dbo.tbl_AssetModel set ModelName=@ModelName,ModelCode=@ModelCode,ModelParentId=@ModelParentId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where AssetModelId=@AssetModelId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetModel Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetModel Data ' ;  
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

CREATE procedure usp_GetAllAssetModel
(
@UserId		               int , 
@EntityId		           int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.AssetModelId,TR.ModelName,TR.ModelCode, TD.ModelName as ModelParentName from dbo.tbl_AssetModel(nolock) TR left join dbo.tbl_AssetModel(nolock) TD on TR.ModelParentId = TD.AssetModelId; 
END;   

 GO 

CREATE procedure usp_GetAssetModelById
(
@AssetModelId		       int , 
@UserId		               int , 
@EntityId		           int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.AssetModelId,TR.ModelName,TR.ModelCode, TR.ModelParentId from dbo.tbl_AssetModel(nolock) TR  where TR.AssetModelId=@AssetModelId ; 
END;   

 GO 

CREATE procedure usp_DelAssetModelById
(
@AssetModelId		       int , 
@UserId		               int , 
@EntityId		           int=null ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetModel'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetModel(nolock) TR  where TR.AssetModelId=@AssetModelId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetModel Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetModel was already in used. ' ;  
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

CREATE procedure usp_AddAssetsmaster
(
@Name                       nvarchar(200),
@Alias                     nvarchar(200)=null,
@Code                       nvarchar(60)=null,
@Photo                     nvarchar(800)=null,
@AssetGroupId               int=null,
@AssetTypeId                 int=null,
@ModelId                     int=null,
@RackId                   int=null,
@SerialNum                 nvarchar(100)=null,
@RAMId                     int=null,
@ROMId                     int=null,
@BranchId                   int=null,
@PurchaseRate               float(8)=null,
@DepreciationRate           float(8)=null,
@StatusId                   int=null,
@Notes                    ntext =null,
@ProductId                     int=null,
@UnitId                  int=null,
@UserId                    int ,
@EntityId                    int=null ,
@TranId                    int=null output ,
@ResponseMSG                  nvarchar(254)='Invalid' output ,
@IsSuccess                   bit=0 output,
@ErrorNumber                   int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
 
if isnull(@BranchId,0)=0
     select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId;
 
declare @TranName varchar(40) = 'Assetsmaster';
 BEGIN TRY
 if exists(select * from dbo.tbl_Assetsmaster(nolock) T where      (@Code IS NOT NULL AND T.Code = @Code) OR    (@SerialNum IS NOT NULL AND T.SerialNum = @SerialNum))
	begin
		set @IsSuccess=0;
		set @ResponseMSG='Either Asset Code or Serial Number is Duplicate';
		return;
	end
     begin transaction @TranName;
     insert into dbo.tbl_Assetsmaster(Name,Alias,Code,Photo,AssetGroupId,AssetTypeId,ModelId,RackId,SerialNum,RAMId,ROMId,BranchId,PurchaseRate,DepreciationRate,StatusId,ProductId,Notes,UnitId,CreateBy)
         values(@Name,@Alias,@Code,@Photo,@AssetGroupId,@AssetTypeId,@ModelId,@RackId,@SerialNum,@RAMId,@ROMId,@BranchId,@PurchaseRate,@DepreciationRate,@StatusId,@ProductId,@Notes,@UnitId,@UserId)
     commit transaction @TranName;
     SET @ResponseMSG='Assetsmaster Save Successfully';  
     set @IsSuccess=1;  
 END TRY  
 BEGIN CATCH  
     rollback transaction @TranName;    
     if ERROR_NUMBER() in (2601,2627)
     begin  
             set @ResponseMSG='Either Asset Code or Serial Number is Duplicate ';  
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

 CREATE procedure usp_UpdateAssetsmaster
(
@Name                       nvarchar(200),
@Alias                     nvarchar(200)=null,
@Code                       nvarchar(60)=null,
@Photo                     nvarchar(800)=null,
@AssetGroupId               int=null,
@AssetTypeId                 int=null,
@ModelId                     int=null,
@RackId                   int=null,
@SerialNum                nvarchar(100)=null,
@RAMId                     int=null,
@ROMId                     int=null,
@BranchId                   int=null,
@PurchaseRate               float(8)=null,
@DepreciationRate           float(8)=null,
@StatusId                   int=null,
@ProductId                     int=null,
@Notes                    ntext =null,
@UnitId                  int=null,
@UserId                    int ,
@EntityId                    int=null ,
@TranId                    int ,
@ResponseMSG                  nvarchar(254)='Invalid' output ,
@IsSuccess                   bit=0 output,
@ErrorNumber                   int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
if isnull(@BranchId,0)=0
     select top 1 @BranchId=U.BranchId from tbl_User(nolock) U where U.UserId=@UserId;
declare @TranName varchar(40) = 'Assetsmaster';
BEGIN TRY
IF EXISTS (
    SELECT 1
    FROM dbo.tbl_Assetsmaster T WITH (NOLOCK)
    WHERE T.TranId <> @TranId
      AND (
            (@Code IS NOT NULL AND T.Code = @Code)
         OR (@SerialNum IS NOT NULL AND T.SerialNum = @SerialNum)
          )
)
BEGIN
    SET @IsSuccess = 0;
    SET @ResponseMSG = 'Either Asset Code or Serial Number is Duplicate';
    RETURN;
END
     begin transaction @TranName;
     update top (1) dbo.tbl_Assetsmaster set Name=@Name,Alias=@Alias,Code=@Code,Photo=@Photo,AssetGroupId=@AssetGroupId,AssetTypeId=@AssetTypeId,ModelId=@ModelId,RackId=@RackId,SerialNum=@SerialNum,RAMId=@RAMId,ROMId=@ROMId,BranchId=@BranchId,PurchaseRate=@PurchaseRate,DepreciationRate=@DepreciationRate,StatusId=@StatusId,Notes=@Notes,ProductId=@ProductId,UnitId=@UnitId,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ;
     commit transaction @TranName;
     SET @ResponseMSG='Assetsmaster Update Successfully';  
     set @IsSuccess=1;  
END TRY  
BEGIN CATCH  
     rollback transaction @TranName;    
     if ERROR_NUMBER() in (2601,2627)
     begin  
             set @ResponseMSG='Either Asset Code or Serial Number is Duplicate' ;  
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

CREATE procedure usp_GetAllAssetsmaster
(
@UserId                    int ,
@EntityId                  int=null
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
 select TR.TranId,TR.Name,TR.Alias,TR.Code,TR.Photo,TR.AssetGroupId,TR.AssetTypeId,TR.ModelId,TR.RackId,TR.SerialNum,TR.RAMId,TR.ROMId,TR.BranchId,TR.PurchaseRate,
 TR.DepreciationRate,TR.StatusId,B.Name as BranchName,
 CASE TR.RAMId
            WHEN 1 THEN '4GB'
            WHEN 2 THEN '8GB'
            WHEN 3 THEN '12GB'
            WHEN 4 THEN '16GB'
            WHEN 5 THEN '32GB'
            WHEN 6 THEN '64GB'
            WHEN 7 THEN 'N/A'
            ELSE ''
        END AS RAMName,
            CASE TR.RoMId
            WHEN 1 THEN '64GB'
            WHEN 2 THEN '128GB'
            WHEN 3 THEN '256GB'
            WHEN 4 THEN '512GB'
            WHEN 5 THEN '1TB SSD'
            WHEN 6 THEN '2TB SSD'
            WHEN 7 THEN '500 GB HHD'
            WHEN 8 THEN '1TB  HHD'
            WHEN 9 THEN 'N/A'
            ELSE ''
        END AS RoMName,
         CASE TR.StatusId
            WHEN 1 THEN 'Active'
            WHEN 2 THEN 'De-Active'
            ELSE ''
        END AS StatusName,R.Name AS RackName,
       G.GroupName AS AssetGroupName,T.TypeName AS AssetTypeName,M.ModelName AS ModelName
 from dbo.tbl_Assetsmaster(nolock) TR
 left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId
 left join tbl_AssetGroup(nolock) G on G.AssetGroupId= TR.AssetGroupId
 left join tbl_AssetType(nolock) T on T.AssetTypeId= TR.AssetTypeId
 left join tbl_AssetModel(nolock) M on M.AssetModelId= TR.ModelId
 left join tbl_Rack(nolock) R on R.RackId = TR.RackId
END;  
 
 GO 

CREATE procedure usp_GetAssetsmasterById
(
@TranId                    int ,
@UserId                    int ,
@EntityId                    int=null
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;

 select top (1) TR.TranId,TR.Name,TR.Alias,TR.Code,TR.Photo,TR.AssetGroupId,TR.AssetTypeId,TR.ModelId,TR.RackId,TR.SerialNum,TR.RAMId,TR.ROMId,TR.BranchId,TR.PurchaseRate,
 TR.DepreciationRate,TR.StatusId,TR.Notes,TR.ProductId, TR.UnitId from dbo.tbl_Assetsmaster(nolock) TR  where TR.TranId=@TranId;

END;  

 Go


 Create procedure usp_GetAllAssetsProduct
(
@UserId		               int , 
@EntityId		           int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 
select TR.ProductId,TR.Name,TR.Code from dbo.tbl_Product(nolock) TR 
Left Join TBL_PRODUCTTYPE(nolock) PT  on PT.ProductTypeId=TR.ProductTypeId 
END;

 Go 

Create procedure usp_DelAssetsmasterById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		           int=null ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'Assetsmaster'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_Assetsmaster(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='Assetsmaster Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. Assetsmaster was already in used. ' ;  
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

create procedure [dbo].[usp_GetAssetOpeningByBranch]
(
@UserId		               int , 
@EntityId		             int=null ,
@BranchId              int=null,
@TranId                int=null
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId;
select   CTR.QTY,CTR.Rate, CTR.Amt from dbo.tbl_AssetOpeningDetails(nolock) CTR 
 left join tbl_AssetOpening(nolock) AO on AO.TranId=CTR.TranId  where AO.BranchId=@BranchId  and CTR.ParticularId=@TranId
END; 

GO

 Create procedure [dbo].[usp_AddAssetOpening]
(
@OpeningNo		           int=null,
@BranchId		            int=null,
@FYearId		             int=null,
@voucherDate		         date=null,
@Remarks		             nvarchar(508)=null,
@AutoVoucherNo		       int=null,
@ManualVoucherNO		     nvarchar(100)=null,
@AutoManualNo		        nvarchar(100)=null,
@VoucherId		           int=null,
@CostClassId		         int=null,
@Attributes		          nvarchar(Max)=null,
@UDFKeyVal		           nvarchar(Max)=null,
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

declare @TranName varchar(40) = 'AssetOpening'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	     IF EXISTS (       SELECT 1    FROM dbo.tbl_AssetOpening   WHERE BranchId = @BranchId )
		  BEGIN
            UPDATE dbo.tbl_AssetOpening  SET   OpeningNo=@OpeningNo, FYearId=@FYearId, VoucherDate=@voucherDate, Remarks=@Remarks, AutoVoucherNo = @AutoVoucherNo,
                ManualVoucherNO = @ManualVoucherNO, AutoManualNo=@AutoManualNo, VoucherId=@VoucherId, CostClassId = @CostClassId,
                Attributes = @Attributes, UDFKeyVal = @UDFKeyVal,  ModifyBy        = @UserId,  UpdateLogDateTime=getdate()
				 WHERE BranchId = @BranchId;
            SELECT 
                @TranId = TranId FROM dbo.tbl_AssetOpening WHERE BranchId = @BranchId;
            SET @ResponseMSG = 'AssetOpening Saved Successfully';
        END
	 else 
	 insert into dbo.tbl_AssetOpening(OpeningNo,BranchId,FYearId,voucherDate,Remarks,AutoVoucherNo,ManualVoucherNO,AutoManualNo,VoucherId,CostClassId,Attributes,UDFKeyVal,CreateBy)
	     values(@OpeningNo,@BranchId,@FYearId,@voucherDate,@Remarks,@AutoVoucherNo,@ManualVoucherNO,@AutoManualNo,@VoucherId,@CostClassId,@Attributes,@UDFKeyVal,@UserId)
	 commit transaction @TranName;
	 	 Set @TranId = (select IDENT_CURRENT('tbl_AssetOpening'));
	 SET @ResponseMSG='AssetOpening Saved Successfully';   
	 set @IsSuccess=1;
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetOpening Data ';  
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

 
create PROCEDURE [dbo].[usp_AddAssetOpeningDetailsDetails]
(
    @TranId           INT = NULL,
    @ParticularId     INT = NULL,
    @Qty              FLOAT(8) = NULL,
    @Rate             FLOAT(8) = NULL,
    @Amt              FLOAT(8) = NULL,
    @UserId           INT
)
AS
BEGIN
    SET NOCOUNT ON;

    EXEC sp_set_session_context @key = N'UserId', @value = @UserId;

    DECLARE @BranchId INT;
    SELECT TOP 1  @BranchId = O.BranchId FROM dbo.tbl_AssetOpening O (NOLOCK) WHERE O.TranId = @TranId;

    IF EXISTS ( SELECT 1
        FROM dbo.tbl_AssetOpeningDetails(nolock) D INNER JOIN dbo.tbl_AssetOpening(nolock) O
            ON D.TranId = O.TranId
        WHERE  D.ParticularId = @ParticularId  AND O.BranchId = @BranchId
    )
    BEGIN
        UPDATE D  SET
            D.Qty  = @Qty,  D.Rate = @Rate,  D.Amt  = @Amt
        FROM dbo.tbl_AssetOpeningDetails D  INNER JOIN dbo.tbl_AssetOpening O
            ON D.TranId = O.TranId
        WHERE   D.ParticularId = @ParticularId AND O.BranchId = @BranchId;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.tbl_AssetOpeningDetails
        (
            TranId,  ParticularId,  Qty, Rate, Amt
        )
        VALUES
        (
            @TranId,   @ParticularId,  @Qty,   @Rate,  @Amt
        );
    END
END;

GO


Create procedure [dbo].[usp_UpdateAssetOpening]
(
@OpeningNo		           int=null,
@BranchId		            int=null,
@FYearId		             int=null,
@voucherDate		         date=null,
@Remarks		             nvarchar(508)=null,
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

declare @TranName varchar(40) = 'AssetOpening'; 
 BEGIN TRY 
	 begin transaction @TranName; 
	 delete CTR  from dbo.tbl_AssetOpeningDetails(nolock) CTR  where CTR.TranId=@TranId ; 
	 update top (1) dbo.tbl_AssetOpening set OpeningNo=@OpeningNo,BranchId=@BranchId,FYearId=@FYearId,voucherDate=@voucherDate,Remarks=@Remarks,AutoVoucherNo=@AutoVoucherNo,ManualVoucherNO=@ManualVoucherNO,AutoManualNo=@AutoManualNo,VoucherId=@VoucherId,CostClassId=@CostClassId,Attributes=@Attributes,UDFKeyVal=@UDFKeyVal,ModifyBy=@UserId,UpdateLogDateTime=getdate() where TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetOpening Update Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() in (2601,2627) 
	 begin  
		     set @ResponseMSG='Duplicate AssetOpening Data ' ;  
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

Create procedure [dbo].[usp_GetAllAssetOpening]
(
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select TR.TranId,TR.OpeningNo,TR.BranchId,TR.FYearId,TR.VoucherDate,TR.Remarks,ND.BS_Date as OpeningMiti,B.Name as BranchName from dbo.tbl_AssetOpening(nolock) TR 
  left join tbl_NepaliDate(nolock) ND on ND.AD_Date=CONVERT(date,TR.VoucherDate,101) 
       left join tbl_Branch(nolock) B on B.BranchId = TR.BranchId; 
END;

GO

Create procedure [dbo].[usp_GetAssetOpeningById]
(
@TranId		               int , 
@UserId		               int , 
@EntityId		             int=null 
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

 select top (1) TR.TranId,TR.OpeningNo,TR.BranchId,TR.FYearId,TR.VoucherDate,TR.Remarks,TR.AutoVoucherNo,TR.ManualVoucherNO,TR.AutoManualNo,TR.VoucherId,TR.CostClassId,TR.Attributes,TR.UDFKeyVal from dbo.tbl_AssetOpening(nolock) TR  where TR.TranId=@TranId ; 
 select CTR.TranId,CTR.ParticularId,CTR.Qty,CTR.Rate,CTR.Amt from dbo.tbl_AssetOpeningDetails(nolock) CTR  where CTR.TranId=@TranId ; 
END;   


 GO 

Create procedure usp_DelAssetOpeningById
(
@TranId		               int , 
@UserId		               int , 
@EntityId		           int=null ,
@ResponseMSG		       nvarchar(254)='Invalid' output ,
@IsSuccess		           bit=0 output, 
@ErrorNumber		       int=0 output
)
AS
BEGIN
SET NOCOUNT ON ;
EXEC sp_set_session_context @key=N'UserId', @value=@UserId; 

declare @TranName varchar(40) = 'AssetOpening'; 
 BEGIN TRY 
	 begin transaction @TranName; 
		 delete TR from dbo.tbl_AssetOpening(nolock) TR  where TR.TranId=@TranId ; 
	 commit transaction @TranName; 
	 SET @ResponseMSG='AssetOpening Deleted Successfully';   
	 set @IsSuccess=1;   
 END TRY  
 BEGIN CATCH  
	 rollback transaction @TranName;    
	 if ERROR_NUMBER() = 547 
	 begin  
		     set @ResponseMSG='Can not delete. AssetOpening was already in used. ' ;  
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