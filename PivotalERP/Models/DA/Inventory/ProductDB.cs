using Dynamic.ReportEngine.RDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace Dynamic.DataAccess.Inventory
{
    public class ProductDB : Dynamic.DataAccess.Common.CommonDB
    {
        Global.DataAccessLayer1 dal=null;
        public ProductDB() { dal = new Global.DataAccessLayer1(); }
        public ProductDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName,dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Inventory.Product beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();


            BusinessEntity.Security.UserWiseEntityQuery entityWiseFields = new BusinessEntity.Security.UserWiseEntityQuery();

            if (isModify)
            {
                entityWiseFields = new DataAccess.Global.GlobalDB().getEntityWiseFields(dal, beData.CUserId, ENTITYPROPERTIES.PRODUCT);
                if (!entityWiseFields.IsSuccess)
                {
                    throw new Exception(entityWiseFields.ResponseMSG);
                }
            }
            cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);

            if (!isModify)
                beData.AutoNumber = getSNo();

            if (!isModify)
            {
                var autoCode = generateCode(beData.CUserId, beData.Name, beData.ProductGroupId);
                if (autoCode.IsSuccess)
                {
                    if (autoCode.ErrorNumber == 1)
                    {
                        beData.Code = autoCode.ResponseId;
                        beData.GroupAutoNumber = autoCode.RId;
                    }
                    else
                        beData.GroupAutoNumber = autoCode.RId;
                }
            }

            if (string.IsNullOrEmpty(beData.Code))
                beData.Code = beData.AutoNumber.ToString();

            cmd.Parameters.AddWithValue("@GroupAutoNumber", beData.GroupAutoNumber); 
            cmd.Parameters.AddWithValue("@AutoNumber", getSNo());
            cmd.Parameters.AddWithValue("@Name", IsNull(beData.Name));
            cmd.Parameters.AddWithValue("@Alias", IsNull(beData.Alias));
            cmd.Parameters.AddWithValue("@Code", IsNull(beData.Code.ToUpper()));
            cmd.Parameters.AddWithValue("@ActiveAlternativeUnit", beData.ActiveAlternativeUnit);
            cmd.Parameters.AddWithValue("@BaseUnitId", beData.BaseUnitId);
            cmd.Parameters.AddWithValue("@CostingMethod", beData.CostingMethod);
            cmd.Parameters.AddWithValue("@Description", IsNull(beData.Description));
            cmd.Parameters.AddWithValue("@IgnoreNegativeBalance", beData.IgnoreNegativeBalance);
            cmd.Parameters.AddWithValue("@MaintainBatchWise", beData.MaintainBatchWise);
            cmd.Parameters.AddWithValue("@MarketValuationMethod", beData.MarketValuationMethod);
            cmd.Parameters.AddWithValue("@OpeningAmount", beData.OpeningAmount);
            cmd.Parameters.AddWithValue("@OpeningQty", beData.OpeningQty);
            cmd.Parameters.AddWithValue("@OpeningRate", beData.OpeningRate);
            cmd.Parameters.AddWithValue("@PartNo", IsNull(beData.PartNo));
            cmd.Parameters.AddWithValue("@PartNoAlias", IsNull(beData.PartNoAlias));
            cmd.Parameters.AddWithValue("@ProductCategoriesId", beData.ProductCategoriesId);
            cmd.Parameters.AddWithValue("@ProductCompanyId", beData.ProductCompanyId);
            cmd.Parameters.AddWithValue("@ProductGroupId", beData.ProductGroupId);            
            cmd.Parameters.AddWithValue("@ProductTypeId", beData.ProductTypeId);
            cmd.Parameters.AddWithValue("@Remarks", IsNull(beData.Remarks));
            cmd.Parameters.AddWithValue("@SetGodownWiseOpening", beData.SetGodownWiseOpening);
            cmd.Parameters.AddWithValue("@SetStandardRate", beData.SetStandardRate);
            cmd.Parameters.AddWithValue("@TreatAllPurchaseAsConsumed", beData.TreatAllPurchaseAsConsumed);
            cmd.Parameters.AddWithValue("@TreatAllSalesAsNewManufacture", beData.TreatAllSalesAsNewManufacture);
            cmd.Parameters.AddWithValue("@TreatllRejectionInwardAsScraped", beData.TreatllRejectionInwardAsScraped);
            cmd.Parameters.AddWithValue("@UseExpDate", beData.UseExpDate);
            cmd.Parameters.AddWithValue("@UseMfgDate", beData.UseMfgDate);
            cmd.Parameters.AddWithValue("@VatRate", beData.VatRate);
            cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
            cmd.Parameters.AddWithValue("@CanEditRate", beData.CanEditRate);
            cmd.Parameters.AddWithValue("@IsFixedProduct", beData.IsFixedProduct);
            cmd.Parameters.AddWithValue("@OpeningForBranchId", beData.OpeningForBranchId);
            cmd.Parameters.AddWithValue("@EXDutyRate", beData.EXDutyRate);
            //cmd.Parameters.AddWithValue("@BDId", beData.BDId);

            if (beData.BranchId.HasValue)
                cmd.Parameters.AddWithValue("@BDId", beData.BranchId.Value);
            else
                cmd.Parameters.AddWithValue("@BDId", beData.BDId);

            if(beData.BDId>0)
                cmd.Parameters.AddWithValue("@BranchId", beData.BDId);
            else if (beData.BranchId.HasValue && beData.BranchId>0) 
                cmd.Parameters.AddWithValue("@BranchId", beData.BranchId.Value);
            else
                cmd.Parameters.AddWithValue("@BranchId", DBNull.Value);


            cmd.Parameters.AddWithValue("@IncludingVat", beData.IncludingVat);
            cmd.Parameters.AddWithValue("@WarrantyMonth", beData.WarrantyMonth);

            if(beData.PurchaseLedgerId==0)
                cmd.Parameters.AddWithValue("@PurchaseLedgerId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@PurchaseLedgerId", beData.PurchaseLedgerId);

            if (beData.SalesLedgerId == 0)
                cmd.Parameters.AddWithValue("@SalesLedgerId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@SalesLedgerId", beData.SalesLedgerId);

            if (beData.ProductDivisionId == 0)
                cmd.Parameters.AddWithValue("@ProductDivisionId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@ProductDivisionId", beData.ProductDivisionId);


            if (beData.ProductBrandId == 0)
                cmd.Parameters.AddWithValue("@ProductBrandId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@ProductBrandId", beData.ProductBrandId);

            if (beData.ProductColorId == 0)
                cmd.Parameters.AddWithValue("@ProductColorId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@ProductColorId", beData.ProductColorId);

            if (beData.ProductShapeId == 0)
                cmd.Parameters.AddWithValue("@ProductShapeId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@ProductShapeId", beData.ProductShapeId);

            if (beData.ProductFlavourId == 0)
                cmd.Parameters.AddWithValue("@ProductFlavourId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@ProductFlavourId", beData.ProductFlavourId);

            cmd.Parameters.AddWithValue("@PurchaseCCRate", beData.PurchaseCCRate);
            cmd.Parameters.AddWithValue("@SalesCCRate", beData.SalesCCRate);

            if(beData.ExDutyUnitId==0)
                cmd.Parameters.AddWithValue("@ExDutyUnitId", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@ExDutyUnitId", beData.ExDutyUnitId);

            cmd.Parameters.AddWithValue("@SNo", beData.SNo);
            cmd.Parameters.AddWithValue("@TSCRate", beData.TSCRate);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);

            if (string.IsNullOrEmpty(beData.PhotoPath))
                beData.PhotoPath = "";

            cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);
            cmd.Parameters.AddWithValue("@IsTaxable", beData.IsTaxable);

            if (string.IsNullOrEmpty(beData.TermCondition))
                beData.TermCondition = "";

            cmd.Parameters.AddWithValue("@TermCondition", IsNull(beData.TermCondition));
            cmd.Parameters.AddWithValue("@CanEditRatePurchase", beData.CanEditRatePurchase);

            cmd.Parameters.AddWithValue("@RateOf", beData.RateOf);
            cmd.Parameters.AddWithValue("@LossRate", beData.LossRate);

            cmd.Parameters.AddWithValue("@DealerCommissionRate", beData.DealerCommissionRate);
            cmd.Parameters.AddWithValue("@SankuchanLoss", beData.SankuchanLoss);
            cmd.Parameters.AddWithValue("@ActivitiesLoss", beData.ActivitiesLoss);


            if(beData.SankuchanCostCenterId.HasValue && beData.SankuchanCostCenterId>0)
                cmd.Parameters.AddWithValue("@SankuchanCostCenterId", beData.SankuchanCostCenterId);
            else
                cmd.Parameters.AddWithValue("@SankuchanCostCenterId", DBNull.Value);


            if(beData.ActivitiesCostCenterId.HasValue && beData.ActivitiesCostCenterId>0)
                cmd.Parameters.AddWithValue("@ActivitiesCostCenterId", beData.ActivitiesCostCenterId);
            else
                cmd.Parameters.AddWithValue("@ActivitiesCostCenterId", DBNull.Value);


            if (beData.PurchaseUnitId.HasValue && beData.PurchaseUnitId > 0)
                cmd.Parameters.AddWithValue("@PurchaseUnitId", beData.PurchaseUnitId);
            else
                cmd.Parameters.AddWithValue("@PurchaseUnitId", DBNull.Value);

            if (beData.SalesUnitId.HasValue && beData.SalesUnitId > 0)
                cmd.Parameters.AddWithValue("@SalesUnitId", beData.SalesUnitId);
            else
                cmd.Parameters.AddWithValue("@SalesUnitId", DBNull.Value);

            cmd.Parameters.AddWithValue("@ExciseOn", beData.ExciseOn);

            if (beData.DiscountOn.HasValue && beData.DiscountOn > 0)
                cmd.Parameters.AddWithValue("@DiscountOn", beData.DiscountOn);
            else
                cmd.Parameters.AddWithValue("@DiscountOn", DBNull.Value);

            cmd.Parameters.AddWithValue("@PurchaseRateFormula", beData.PurchaseRateFormula);
            cmd.Parameters.AddWithValue("@SalesRateFormula", beData.SalesRateFormula);

            cmd.Parameters.AddWithValue("@PurchaseCostUnitId",IsDBNull(beData.PurchaseCostUnitId));
            cmd.Parameters.AddWithValue("@SalesCostUnitId", IsDBNull(beData.SalesCostUnitId));

            cmd.Parameters.AddWithValue("@AllowSalesPoint", IsDBNull(beData.AllowSalesPoint));
            cmd.Parameters.AddWithValue("@SalesPointPerQty", IsDBNull(beData.SalesPointPerQty));

            cmd.Parameters.AddWithValue("@HSCode", IsDBNull(beData.HSCode));

            cmd.Parameters.AddWithValue("@ActiveMultipleBatch", IsDBNull(beData.ActiveMultipleBatch));
            cmd.Parameters.AddWithValue("@ProfitMarginRate", IsDBNull(beData.ProfitMarginRate));
            //AllowSalesPoint,SalesPointPerQty
            //PurchaseCostUnitId,SalesCostUnitId

            //PurchaseRateFormula,SalesRateFormula
            int UserId = beData.CUserId;
            //PurchaseUnitId,SalesUnitId
            //SankuchanLoss,ActivitiesLoss,SankuchanCostCenterId,ActivitiesCostCenterId

            //RateOf,LossRate
            //PhotoPath,IsTaxable
            //PurchaseCCRate,SalesCCRate
            //ProductBrandId,ProductColorId,ProductShapeId,ProductFlavourId

            cmd.Parameters.AddWithValue("@WeightConv", IsDBNull(beData.WeightConv));
            cmd.Parameters.AddWithValue("@WeightUnitId", IsDBNull(beData.WeightUnitId));
            cmd.Parameters.AddWithValue("@VolumConv", IsDBNull(beData.VolumConv));
            cmd.Parameters.AddWithValue("@VolumUnitId", IsDBNull(beData.VolumUnitId));
            //WeightConv,WeightUnitId,VolumConv,VolumUnitId
            cmd.Parameters.AddWithValue("@IncomeLedgerId", IsDBNull(beData.IncomeLedgerId));
            cmd.Parameters.AddWithValue("@ExpensesLedgerId", IsDBNull(beData.ExpensesLedgerId));
            cmd.Parameters.AddWithValue("@ValidateFixedProduct", IsDBNull(beData.ValidateFixedProduct));
            cmd.Parameters.AddWithValue("@AllowManualInputFixedProduct", IsDBNull(beData.AllowManualInputFixedProduct));
            cmd.Parameters.AddWithValue("@ActiveSerialNo", IsDBNull(beData.ActiveSerialNo));

            cmd.Parameters.AddWithValue("@BR_PurchaseLedgerId", IsDBNull(beData.BR_PurchaseLedgerId));
            cmd.Parameters.AddWithValue("@BR_SalesLedgerId", IsDBNull(beData.BR_SalesLedgerId));
            cmd.Parameters.AddWithValue("@Pur_MinRate", ZeroDBNull(beData.Pur_MinRate));
            cmd.Parameters.AddWithValue("@Pur_MaxRate", ZeroDBNull(beData.Pur_MaxRate));
            cmd.Parameters.AddWithValue("@Sal_MinRate", ZeroDBNull(beData.Sal_MinRate));
            cmd.Parameters.AddWithValue("@Sal_MaxRate", ZeroDBNull(beData.Sal_MaxRate));
            //IncomeLedgerId,ExpensesLedgerId,ValidateFixedProduct,AllowManualInputFixedProduct

            cmd.Parameters.AddWithValue("@Attributes", IsDBNull(beData.Attributes));
            cmd.Parameters.AddWithValue("@UDFKeyVal", IsDBNull(beData.UDFKeyVal));

            cmd.Parameters.AddWithValue("@PurchaseReturnLedgerId", IsDBNull(beData.PurchaseReturnLedgerId));
            cmd.Parameters.AddWithValue("@SalesReturnLedgerId", IsDBNull(beData.SalesReturnLedgerId));
            //PurchaseReturnLedgerId,SalesReturnLedgerId

            //Title,SubTitle,EcommerceDescription,
            cmd.Parameters.AddWithValue("@Title", IsDBNull(beData.Title));
            cmd.Parameters.AddWithValue("@SubTitle", IsDBNull(beData.SubTitle));
            cmd.Parameters.AddWithValue("@EcommerceDescription", IsDBNull(beData.EcommerceDescription));

            cmd.Parameters.AddWithValue("@SubGroup1", IsDBNull(beData.SubGroup1));
            cmd.Parameters.AddWithValue("@SubGroup2", IsDBNull(beData.SubGroup2));
            cmd.Parameters.AddWithValue("@SubGroup3", IsDBNull(beData.SubGroup3));
            cmd.Parameters.AddWithValue("@SubGroup4", IsDBNull(beData.SubGroup4));
            cmd.Parameters.AddWithValue("@SubGroup5", IsDBNull(beData.SubGroup5));
            cmd.Parameters.AddWithValue("@DebtorTypeId", IsDBNull(beData.DebtorTypeId));
            //Added by Simran
            cmd.Parameters.AddWithValue("@VideoLink", IsDBNull(beData.VideoLink));
            cmd.Parameters.AddWithValue("@HerbsId", IsDBNull(beData.HerbsId));
            //End

            //SubGroup1,SubGroup2,SubGroup3,SubGroup4,SubGroup5,

            if (isModify)
            {
                //if (beData.MaintainBatchWise == true)
                //{
                //    cmd.CommandText = @"if exists(select 1 from tbl_CurrentStock(nolock) C where C.ProductId=@ProductId and ( C.InQty<>0 or C.OutQty<>0) and len(C.Batch)=0) 
	               //                     select 1 as EX
                //                    else
	               //                     select 0 as EX";
                //    int ieEX = Convert.ToInt32(cmd.ExecuteScalar());
                //    if (ieEX == 1)
                //    {
                //        resVal.IsSuccess = false;
                //        resVal.ResponseMSG = "Batch cannot be enabled as transactions already exist without batch information.";
                //        dal.RollbackTransaction();
                //        return resVal;
                //    }
                //}
                //else
                //{
                //    cmd.CommandText = @"if exists(select 1 from tbl_CurrentStock(nolock) C where C.ProductId=@ProductId and ( C.InQty<>0 or C.OutQty<>0) and len(C.Batch)>0) 
	               //                     select 1 as EX
                //                    else
	               //                     select 0 as EX";
                //    int ieEX = Convert.ToInt32(cmd.ExecuteScalar());
                //    if (ieEX == 1)
                //    {
                //        resVal.IsSuccess = false;
                //        resVal.ResponseMSG = "Batch cannot be disabled as transactions already exist with batch information.";
                //        dal.RollbackTransaction();
                //        return resVal;
                //    }
                //}
                

                if (entityWiseFields.IsSuccess)
                {
                    if (!entityWiseFields.IsEnabled)
                    {
                        cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + ";delete PSSR from tbl_ProductSlabSellingRate PSSR where PSSR.ProductId=@ProductId;  delete PWR from tbl_ProductWiseRack PWR inner join TBL_GODOWN(nolock) G on G.GodownId=PWR.GodownId where PWR.ProductId=@ProductId and G.BDId=@BranchId;   delete from tbl_ProductWiseUDF where ProductId=@ProductId;  delete T1 from tbl_ProductWisePreferedSupplier(nolock) T1 where ProductId=@ProductId ; delete T2 from tbl_ProductCategoryDetails(nolock) T2 where ProductId=@ProductId; delete T3 from tbl_BranchWiseBaseUnit(nolock) T3 where ProductId=@ProductId; delete T4 from tbl_ProductCode(nolock) T4 where ProductId=@ProductId;delete T5 from tbl_UDFProduct(nolock) T5 where TranId=@ProductId; delete T6 from tbl_ProductAlternetUnit(nolock) T6 where ProductId=@ProductId ;  delete T7 from tbl_ProductCostRate(nolock) T7 where ProductId=@ProductId and T7.ItemAllocationId is null ; delete T8 from tbl_ProductSellingRate(nolock) T8 where ProductId=@ProductId and T8.ItemAllocationId is null  ; delete T9 from tbl_ProductOpeningDetails(nolock) T9 where ProductId=@ProductId ; delete T10 from tbl_ProductTradeRate(nolock) T10 where ProductId=@ProductId ; delete T11 from tbl_ProductMRPRate(nolock) T11 where ProductId=@ProductId ;";
                        cmd.ExecuteNonQuery();

                        cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + "; update top(1) tbl_Product set HerbsId=@HerbsId,VideoLink=@VideoLink, DebtorTypeId=@DebtorTypeId, SubGroup1=@SubGroup1,SubGroup2=@SubGroup2,SubGroup3=@SubGroup3,SubGroup4=@SubGroup4,SubGroup5=@SubGroup5, Title=@Title,SubTitle=@SubTitle,EcommerceDescription=@EcommerceDescription,  PurchaseReturnLedgerId=@PurchaseReturnLedgerId,SalesReturnLedgerId=@SalesReturnLedgerId, Attributes=@Attributes,UDFKeyVal=@UDFKeyVal, BR_PurchaseLedgerId=@BR_PurchaseLedgerId,BR_SalesLedgerId=@BR_SalesLedgerId,Pur_MinRate=@Pur_MinRate,Pur_MaxRate=@Pur_MaxRate,Sal_MinRate=@Sal_MinRate,Sal_MaxRate=@Sal_MaxRate, ActiveSerialNo=@ActiveSerialNo, IncomeLedgerId=@IncomeLedgerId,ExpensesLedgerId=@ExpensesLedgerId,ValidateFixedProduct=@ValidateFixedProduct,AllowManualInputFixedProduct=@AllowManualInputFixedProduct, WeightConv=@WeightConv,WeightUnitId=@WeightUnitId,VolumConv=@VolumConv,VolumUnitId=@VolumUnitId, ActiveMultipleBatch=@ActiveMultipleBatch, ProfitMarginRate=@ProfitMarginRate, HSCode=@HSCode, AllowSalesPoint=@AllowSalesPoint,SalesPointPerQty=@SalesPointPerQty, PurchaseCostUnitId=@PurchaseCostUnitId,SalesCostUnitId=@SalesCostUnitId,PurchaseRateFormula=@PurchaseRateFormula,SalesRateFormula=@SalesRateFormula, DiscountOn=@DiscountOn, ExciseOn=@ExciseOn, IsActive=@IsActive, PurchaseUnitId=@PurchaseUnitId,SalesUnitId=@SalesUnitId, DealerCommissionRate=@DealerCommissionRate, SankuchanLoss=@SankuchanLoss,ActivitiesLoss=@ActivitiesLoss,SankuchanCostCenterId=@SankuchanCostCenterId,ActivitiesCostCenterId=@ActivitiesCostCenterId, RateOf=@RateOf,LossRate=@LossRate,CanEditRatePurchase=@CanEditRatePurchase, TermCondition=@TermCondition, PhotoPath=@PhotoPath,IsTaxable=@IsTaxable,ModifyBy=@UserId, TSCRate=@TSCRate,SNo=@SNo,ExDutyUnitId=@ExDutyUnitId,PurchaseCCRate=@PurchaseCCRate,SalesCCRate=@SalesCCRate,ProductBrandId=@ProductBrandId,ProductColorId=@ProductColorId,ProductShapeId=@ProductShapeId,ProductFlavourId=@ProductFlavourId,ProductDivisionId=@ProductDivisionId,PurchaseLedgerId=@PurchaseLedgerId,SalesLedgerId=@SalesLedgerId, WarrantyMonth=@WarrantyMonth,IncludingVat=@IncludingVat,OpeningForBranchId=@OpeningForBranchId,IsFixedProduct=@IsFixedProduct, CanEditRate=@CanEditRate,Name=@Name,Alias=@Alias,Code=@Code,Description=@Description,ProductGroupId=@ProductGroupId,ProductCategoriesId=@ProductCategoriesId,ProductTypeId=@ProductTypeId,ProductCompanyId=@ProductCompanyId,BaseUnitId=@BaseUnitId,ActiveAlternativeUnit=@ActiveAlternativeUnit,PartNo=@PartNo,PartNoAlias=@PartNoAlias,Remarks=@Remarks,CostingMethod=@CostingMethod,MarketValuationMethod=@MarketValuationMethod,VatRate=@VatRate,EXDutyRate=@EXDutyRate,IgnoreNegativeBalance=@IgnoreNegativeBalance,SetStandardRate=@SetStandardRate,SetGodownWiseOpening=@SetGodownWiseOpening,MaintainBatchWise=@MaintainBatchWise,UseMfgDate=@UseMfgDate,UseExpDate=@UseExpDate,OpeningQty=@OpeningQty,OpeningRate=@OpeningRate,OpeningAmount=@OpeningAmount,TreatAllSalesAsNewManufacture=@TreatAllSalesAsNewManufacture,TreatAllPurchaseAsConsumed=@TreatAllPurchaseAsConsumed,TreatllRejectionInwardAsScraped=@TreatllRejectionInwardAsScraped where ProductId=@ProductId ";
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(entityWiseFields.Query))
                        {
                            throw new Exception("Entity Wise Fields(Properties) not allow");
                        }
                        cmd.CommandText = entityWiseFields.Query;

                    }
                }
            }
            else
            {
                cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + "; insert into tbl_Product(HerbsId,VideoLink,DebtorTypeId,SubGroup1,SubGroup2,SubGroup3,SubGroup4,SubGroup5,Title,SubTitle,EcommerceDescription,PurchaseReturnLedgerId,SalesReturnLedgerId,Attributes,UDFKeyVal,BR_PurchaseLedgerId,BR_SalesLedgerId,Pur_MinRate,Pur_MaxRate,Sal_MinRate,Sal_MaxRate,ActiveSerialNo,IncomeLedgerId,ExpensesLedgerId,ValidateFixedProduct,AllowManualInputFixedProduct,WeightConv,WeightUnitId,VolumConv,VolumUnitId,ProfitMarginRate,ActiveMultipleBatch,HSCode,GroupAutoNumber,AllowSalesPoint,SalesPointPerQty,PurchaseCostUnitId,SalesCostUnitId,PurchaseRateFormula,SalesRateFormula,DiscountOn,ExciseOn,PurchaseUnitId,SalesUnitId,DealerCommissionRate,SankuchanLoss,ActivitiesLoss,SankuchanCostCenterId,ActivitiesCostCenterId,RateOf,LossRate,CanEditRatePurchase,TermCondition,PhotoPath,IsTaxable,TSCRate,SNo,ExDutyUnitId,PurchaseCCRate,SalesCCRate,ProductBrandId,ProductColorId,ProductShapeId,ProductFlavourId,ProductDivisionId,PurchaseLedgerId,SalesLedgerId,WarrantyMonth,IncludingVat,BDId,OpeningForBranchId,IsFixedProduct,CanEditRate,AutoNumber,Name,Alias,Code,Description,ProductGroupId,ProductCategoriesId,ProductTypeId,ProductCompanyId,BaseUnitId,ActiveAlternativeUnit,PartNo,PartNoAlias,Remarks,CostingMethod,MarketValuationMethod,VatRate,EXDutyRate,IgnoreNegativeBalance,SetStandardRate,SetGodownWiseOpening,MaintainBatchWise,UseMfgDate,UseExpDate,OpeningQty,OpeningRate,OpeningAmount,TreatAllSalesAsNewManufacture,TreatAllPurchaseAsConsumed,TreatllRejectionInwardAsScraped,CreateBy) values(@HerbsId,@VideoLink,@DebtorTypeId,@SubGroup1,@SubGroup2,@SubGroup3,@SubGroup4,@SubGroup5,@Title,@SubTitle,@EcommerceDescription,@PurchaseReturnLedgerId,@SalesReturnLedgerId,@Attributes,@UDFKeyVal,@BR_PurchaseLedgerId,@BR_SalesLedgerId,@Pur_MinRate,@Pur_MaxRate,@Sal_MinRate,@Sal_MaxRate,@ActiveSerialNo,@IncomeLedgerId,@ExpensesLedgerId,@ValidateFixedProduct,@AllowManualInputFixedProduct,@WeightConv,@WeightUnitId,@VolumConv,@VolumUnitId,@ProfitMarginRate,@ActiveMultipleBatch,@HSCode,@GroupAutoNumber,@AllowSalesPoint,@SalesPointPerQty,@PurchaseCostUnitId,@SalesCostUnitId,@PurchaseRateFormula,@SalesRateFormula,@DiscountOn,@ExciseOn,@PurchaseUnitId,@SalesUnitId,@DealerCommissionRate,@SankuchanLoss,@ActivitiesLoss,@SankuchanCostCenterId,@ActivitiesCostCenterId,@RateOf,@LossRate,@CanEditRatePurchase,@TermCondition,@PhotoPath,@IsTaxable,@TSCRate,@SNo,@ExDutyUnitId,@PurchaseCCRate,@SalesCCRate,@ProductBrandId,@ProductColorId,@ProductShapeId,@ProductFlavourId,@ProductDivisionId,@PurchaseLedgerId,@SalesLedgerId,@WarrantyMonth,@IncludingVat,@BDId,@OpeningForBranchId,@IsFixedProduct,@CanEditRate,@AutoNumber,@Name,@Alias,@Code,@Description,@ProductGroupId,@ProductCategoriesId,@ProductTypeId,@ProductCompanyId,@BaseUnitId,@ActiveAlternativeUnit,@PartNo,@PartNoAlias,@Remarks,@CostingMethod,@MarketValuationMethod,@VatRate,@EXDutyRate,@IgnoreNegativeBalance,@SetStandardRate,@SetGodownWiseOpening,@MaintainBatchWise,@UseMfgDate,@UseExpDate,@OpeningQty,@OpeningRate,@OpeningAmount,@TreatAllSalesAsNewManufacture,@TreatAllPurchaseAsConsumed,@TreatllRejectionInwardAsScraped,@UserId) ";
                cmd.CommandText = cmd.CommandText + " ; SELECT Scope_Identity(); ";
            }
                

            try
            {
                if (isModify)
                {
                    cmd.ExecuteNonQuery();
                }
                else
                {
                    var lastId = cmd.ExecuteScalar();
                    if (lastId != null && !(lastId is DBNull) && Convert.ToInt32(lastId) > 0)
                    {
                        beData.ProductId = Convert.ToInt32(lastId);
                    }
                    else
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Unable To Store Data";
                        return resVal;
                    }
                }

                if ((beData.BarCodeColl == null || beData.BarCodeColl.Count == 0) && !string.IsNullOrEmpty(beData.Code))
                {
                    beData.BarCodeColl = new List<string>();
                    beData.BarCodeColl.Add(beData.Code);
                }


                if (isModify)
                {
                    if (entityWiseFields.IsSuccess && !entityWiseFields.IsEnabled)
                    {
                        SaveBranchWiseBaseUnit(beData.ProductId, beData.BranchWiseBaseUnitColl);
                        SaveProductBarCode(beData.ProductId, beData.BarCodeColl);
                        SaveAlternetUnit(beData.ProductId, beData.AlterNetUnitColl);
                        SaveCostRate(beData.ProductId, beData.BaseUnitId, beData.CostRateColl);
                        SaveSellingRate(beData.ProductId, beData.BaseUnitId, beData.SellingRateColl);
                        SaveSlabSellingRate(beData.ProductId, beData.BaseUnitId, beData.SlabSellingRateColl);   
                        SaveTradeRate(beData.ProductId, beData.BaseUnitId, beData.TradeRateColl);
                        SaveMRPRate(beData.ProductId, beData.BaseUnitId, beData.MRPRateColl);
                        SaveGodownWiseOpening(beData.ProductId, beData.OpeningColl);
                        SaveUDF(beData.ProductId, beData.UserDefineFieldsColl);
                        SaveDocument(beData.ProductId, beData.ImageColl);
                        SavePreferedSupplier(beData.ProductId, beData.PreferedSupplierIdColl);
                        if (beData.ProductCategoriesIdColl != null && beData.ProductCategoriesIdColl.Count > 0)
                            SaveProductCategories(beData.ProductId, beData.ProductCategoriesIdColl);

                        SaveUDF(beData.ProductId, beData.UDFColl);

                        SaveProductWiseRack(beData.ProductId, beData.DefaultRackColl);

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                        cmd.CommandText = "usp_UpdateProductRate";
                        cmd.ExecuteNonQuery();
                    }

                    dal.CommitTransaction();
                   // return beData.ProductId;
                }
                else
                {
                   //beData.ProductId = dal.GetInsertId(cmd,"tbl_Product");

                    if(beData.BranchWiseBaseUnitColl!=null)
                        SaveBranchWiseBaseUnit(beData.ProductId, beData.BranchWiseBaseUnitColl);

                    if(beData.BarCodeColl!=null)
                        SaveProductBarCode(beData.ProductId, beData.BarCodeColl);

                    if(beData.AlterNetUnitColl!=null)
                        SaveAlternetUnit(beData.ProductId, beData.AlterNetUnitColl);

                    if(beData.CostRateColl!=null)
                        SaveCostRate(beData.ProductId,beData.BaseUnitId, beData.CostRateColl);

                    if (beData.SellingRateColl != null)
                        SaveSellingRate(beData.ProductId,beData.BaseUnitId, beData.SellingRateColl);

                    SaveSlabSellingRate(beData.ProductId, beData.BaseUnitId, beData.SlabSellingRateColl);

                    if (beData.TradeRateColl != null)
                        SaveTradeRate(beData.ProductId, beData.BaseUnitId, beData.TradeRateColl);

                    if (beData.MRPRateColl != null)
                        SaveMRPRate(beData.ProductId, beData.BaseUnitId, beData.MRPRateColl);

                    if (beData.OpeningColl != null)
                        SaveGodownWiseOpening(beData.ProductId, beData.OpeningColl);

                    if (beData.UserDefineFieldsColl != null)
                        SaveUDF(beData.ProductId, beData.UserDefineFieldsColl);

                    if (beData.ImageColl != null)
                        SaveDocument(beData.ProductId, beData.ImageColl);

                    if (beData.PreferedSupplierIdColl != null)
                        SavePreferedSupplier(beData.ProductId, beData.PreferedSupplierIdColl);

                    if (beData.UDFColl != null)
                        SaveUDF(beData.ProductId, beData.UDFColl);

                    if (beData.ProductCategoriesIdColl != null && beData.ProductCategoriesIdColl.Count > 0)
                        SaveProductCategories(beData.ProductId, beData.ProductCategoriesIdColl);

                    if (beData.DefaultRackColl != null)
                        SaveProductWiseRack(beData.ProductId, beData.DefaultRackColl);

                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.CommandText = "usp_UpdateProductRate";
                    cmd.ExecuteNonQuery();

                    dal.CommitTransaction();
                    //return beData.ProductId;
                }

                resVal.RId = beData.ProductId;
                resVal.IsSuccess = true;
                resVal.ResponseMSG = (isModify ? GLOBALMSG.UPDATE_SUCCESS : GLOBALMSG.SAVE_SUCCESS);
            }
            catch (System.Data.SqlClient.SqlException ee)
            {

                dal.RollbackTransaction();

                resVal.IsSuccess = false;
                switch (ee.Number)
                {
                    case 547:
                        resVal.ResponseMSG = GetForeignKeyError(ee.Message, dal.Connection);
                        break;
                    case 2627:
                        resVal.ResponseMSG = GetDuplicateError(ee.Message);
                        break;
                    default:
                        resVal.ResponseMSG = ee.Message;
                        break;
                }
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }
        public ResponeValues UpdateBDIdZero(int UserId, int ProductId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=1 ; update top(1) tbl_Product set BdId=0 where ProductId=@ProductId";
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Updated Done.";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }
        private void SaveUDF(int ProductId, List<Dynamic.BusinessEntity.Account.VoucherProductUDF> beDataColl)
        {
            if (beDataColl != null)
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                foreach (var beData in beDataColl)
                {
                    if (!string.IsNullOrEmpty(beData.Label))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ProductId", ProductId);
                        cmd.Parameters.AddWithValue("@SNo", beData.SNo);
                        cmd.Parameters.AddWithValue("@Label", beData.Label);
                        cmd.Parameters.AddWithValue("@FieldType", beData.FieldType);
                        cmd.Parameters.AddWithValue("@DefaultValue",IsNull(beData.DefaultValue));
                        cmd.Parameters.AddWithValue("@DropDownList", IsNull(beData.DropDownList));
                        cmd.Parameters.AddWithValue("@IsMandatory", beData.IsMandatory);
                        cmd.Parameters.AddWithValue("@CanEditable", beData.CanEditable);
                        cmd.Parameters.AddWithValue("@FieldAfter", beData.FieldAfter);

                        if (beData.RefLedgerId.HasValue)
                            cmd.Parameters.AddWithValue("@RefLedgerId", beData.RefLedgerId.Value);
                        else
                            cmd.Parameters.AddWithValue("@RefLedgerId", DBNull.Value);

                        cmd.Parameters.AddWithValue("@Name", IsNull(beData.Name));
                        cmd.Parameters.AddWithValue("@Formula", IsNull(beData.Formula));
                        cmd.Parameters.AddWithValue("@Source", IsNull(beData.Source));
                        cmd.Parameters.AddWithValue("@ColWidth", beData.ColWidth);


                        //Name,Formula,Source

                        cmd.CommandText = "insert into tbl_ProductWiseUDF(CanEditable,ColWidth,Name,Formula,Source,FieldAfter,ProductId,SNo,Label,FieldType,DefaultValue,DropDownList,IsMandatory,RefLedgerId) values(@CanEditable,@ColWidth,@Name,@Formula,@Source,@FieldAfter,@ProductId,@SNo,@Label,@FieldType,@DefaultValue,@DropDownList,@IsMandatory,@RefLedgerId) ";
                        cmd.ExecuteNonQuery();
                    }

                }
            }
        }
        public int UpdateRateOnly(Dynamic.BusinessEntity.Inventory.Product beData)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
            
            try
            {
               // cmd.CommandText = " delete from tbl_ProductCostRate where ProductId=@ProductId; delete from tbl_ProductSellingRate where ProductId=@ProductId ;  ";
                //cmd.ExecuteNonQuery();
                SaveCostRate(beData.ProductId, beData.BaseUnitId, beData.CostRateColl);
                SaveSellingRate(beData.ProductId, beData.BaseUnitId, beData.SellingRateColl);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                cmd.CommandText = "usp_UpdateProductRate";
                cmd.ExecuteNonQuery();

                dal.CommitTransaction();
                return beData.ProductId;

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        private void SaveDocument(int ProductId, Dynamic.BusinessEntity.GeneralDocumentCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0 || ProductId == 0)
                return;

            foreach (Dynamic.BusinessEntity.GeneralDocument beData in beDataColl)
            {
                if (beData.Data != null && !string.IsNullOrEmpty(beData.Name) && !string.IsNullOrEmpty(beData.Extension))
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@Document", beData.Data);
                    cmd.Parameters.AddWithValue("@Extension", beData.Extension);
                    cmd.Parameters.AddWithValue("@Name", beData.Name);


                    cmd.CommandText = "insert into tbl_ProductImage(ProductId,Document,Extension,Name) values(@ProductId,@Document,@Extension,@Name) ";
                    cmd.ExecuteNonQuery();
                }
            }

        }

        private void SavePreferedSupplier(int TranId, System.Collections.Generic.List<int> beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0)
                return;

            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (int LedgerId in beDataColl)
            {
                if (LedgerId>0)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", TranId);
                    cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
                    cmd.CommandText = "insert into tbl_ProductWisePreferedSupplier(ProductId,LedgerId)  values(@ProductId,@LedgerId)";
                    cmd.ExecuteNonQuery();
                }
            }

        }

        private void SaveProductBarCode(int TranId, System.Collections.Generic.List<string> beDataColl)
        {
            //System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            //foreach (string beData in beDataColl)
            //{
            //    if (!string.IsNullOrEmpty(beData))
            //    {
            //        cmd.Parameters.Clear();
            //        cmd.Parameters.AddWithValue("@ProductId", TranId);
            //        cmd.Parameters.AddWithValue("@BarCode", beData);
            //        cmd.CommandText = "insert into tbl_ProductCode(ProductId,BarCode)  values(@ProductId,@BarCode)";
            //        cmd.ExecuteNonQuery();
            //    }                
            //}

        }
        private void SaveProductCategories(int TranId, System.Collections.Generic.List<int> beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (int beData in beDataColl)
            {
                if (beData>0)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", TranId);
                    cmd.Parameters.AddWithValue("@ProductCategoriesId", beData);
                    cmd.CommandText = "insert into tbl_ProductCategoryDetails(ProductId,ProductCategoriesId)  values(@ProductId,@ProductCategoriesId)";
                    cmd.ExecuteNonQuery();
                }
            }

        }
        public void SaveProductShortDetails(System.Collections.Generic.List<Dynamic.BusinessEntity.Inventory.Product> dataColl)
        {
            dal.OpenConnection();            
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (var beData in dataColl)
            {
                try
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.Parameters.AddWithValue("@AutoNumber", getSNo());
                    cmd.Parameters.AddWithValue("@Name", beData.Name);
                    cmd.Parameters.AddWithValue("@Alias", beData.Alias);
                    cmd.Parameters.AddWithValue("@Code", beData.Code);
                    cmd.Parameters.AddWithValue("@HSCode", IsDBNull(beData.HSCode));
                    cmd.Parameters.AddWithValue("@ActiveAlternativeUnit", beData.ActiveAlternativeUnit);
                    cmd.Parameters.AddWithValue("@BaseUnitId", beData.BaseUnitId);
                    cmd.Parameters.AddWithValue("@CostingMethod", beData.CostingMethod);
                    cmd.Parameters.AddWithValue("@Description", beData.Description);
                    cmd.Parameters.AddWithValue("@IgnoreNegativeBalance", beData.IgnoreNegativeBalance);
                    cmd.Parameters.AddWithValue("@MaintainBatchWise", beData.MaintainBatchWise);
                    cmd.Parameters.AddWithValue("@MarketValuationMethod", beData.MarketValuationMethod);
                    cmd.Parameters.AddWithValue("@OpeningAmount", beData.OpeningAmount);
                    cmd.Parameters.AddWithValue("@OpeningQty", beData.OpeningQty);
                    cmd.Parameters.AddWithValue("@OpeningRate", beData.OpeningRate);
                    cmd.Parameters.AddWithValue("@PartNo", beData.PartNo);
                    cmd.Parameters.AddWithValue("@PartNoAlias", beData.PartNoAlias);
                    cmd.Parameters.AddWithValue("@ProductCategoriesId", beData.ProductCategoriesId);
                    cmd.Parameters.AddWithValue("@ProductCompanyId", beData.ProductCompanyId);
                    cmd.Parameters.AddWithValue("@ProductGroupId", beData.ProductGroupId);
                    cmd.Parameters.AddWithValue("@ProductTypeId", beData.ProductTypeId);
                    cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                    cmd.Parameters.AddWithValue("@SetGodownWiseOpening", beData.SetGodownWiseOpening);
                    cmd.Parameters.AddWithValue("@SetStandardRate", beData.SetStandardRate);
                    cmd.Parameters.AddWithValue("@TreatAllPurchaseAsConsumed", beData.TreatAllPurchaseAsConsumed);
                    cmd.Parameters.AddWithValue("@TreatAllSalesAsNewManufacture", beData.TreatAllSalesAsNewManufacture);
                    cmd.Parameters.AddWithValue("@TreatllRejectionInwardAsScraped", beData.TreatllRejectionInwardAsScraped);
                    cmd.Parameters.AddWithValue("@UseExpDate", beData.UseExpDate);
                    cmd.Parameters.AddWithValue("@UseMfgDate", beData.UseMfgDate);
                    cmd.Parameters.AddWithValue("@VatRate", beData.VatRate);
                    cmd.Parameters.AddWithValue("@EXDutyRate", beData.EXDutyRate);
                    cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
                    cmd.Parameters.AddWithValue("@CanEditRate", beData.CanEditRate);
                    cmd.Parameters.AddWithValue("@IsFixedProduct", beData.IsFixedProduct);
                    cmd.Parameters.AddWithValue("@OpeningForBranchId", beData.OpeningForBranchId);
                    cmd.CommandText = "insert into tbl_Product(HSCode,OpeningForBranchId,IsFixedProduct,CanEditRate,AutoNumber,Name,Alias,Code,Description,ProductGroupId,ProductCategoriesId,ProductTypeId,ProductCompanyId,BaseUnitId,ActiveAlternativeUnit,PartNo,PartNoAlias,Remarks,CostingMethod,MarketValuationMethod,VatRate,EXDutyRate,IgnoreNegativeBalance,SetStandardRate,SetGodownWiseOpening,MaintainBatchWise,UseMfgDate,UseExpDate,OpeningQty,OpeningRate,OpeningAmount,TreatAllSalesAsNewManufacture,TreatAllPurchaseAsConsumed,TreatllRejectionInwardAsScraped) values(@HSCode,@OpeningForBranchId,@IsFixedProduct,@CanEditRate,@AutoNumber,@Name,@Alias,@Code,@Description,@ProductGroupId,@ProductCategoriesId,@ProductTypeId,@ProductCompanyId,@BaseUnitId,@ActiveAlternativeUnit,@PartNo,@PartNoAlias,@Remarks,@CostingMethod,@MarketValuationMethod,@VatRate,@EXDutyRate,@IgnoreNegativeBalance,@SetStandardRate,@SetGodownWiseOpening,@MaintainBatchWise,@UseMfgDate,@UseExpDate,@OpeningQty,@OpeningRate,@OpeningAmount,@TreatAllSalesAsNewManufacture,@TreatAllPurchaseAsConsumed,@TreatllRejectionInwardAsScraped) ";
                    cmd.ExecuteNonQuery();
                }
                catch (Exception ee)
                {                    
                }                
            }            
            dal.CloseConnection();
        }
        private void SaveUDF(int TranId, UserDefineFieldCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (UserDefineField beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@UDFId", beData.UDFId);
                cmd.Parameters.AddWithValue("@Value", Global.GlobalDB.IsNullOrEmptyStr(beData.Value));
                cmd.Parameters.AddWithValue("@AlterNetValue", Global.GlobalDB.IsNullOrEmptyStr(beData.AlterNetValue));
                //TranId,UDFId,Value,AlterNetValue
                cmd.CommandText = "insert into tbl_UDFProduct(TranId,UDFId,Value,AlterNetValue)  values(@TranId,@UDFId,@Value,@AlterNetValue)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SaveBranchWiseBaseUnit(int ProductId, Dynamic.BusinessEntity.Inventory.StockItemOpeningDetailsCollections beDataColl)
        {
            foreach (Dynamic.BusinessEntity.Inventory.StockItemOpeningDetails beData in beDataColl)
            {
                if (beData.GodownId != 0 && beData.UnitId!=0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@BranchId", beData.GodownId);
                    cmd.Parameters.AddWithValue("@BaseUnitId", beData.UnitId);

                    cmd.CommandText = "insert into tbl_BranchWiseBaseUnit(ProductId,BranchId,BaseUnitId) values(@ProductId,@BranchId,@BaseUnitId)";
                    cmd.ExecuteNonQuery();
                }
            }

        }
        private void SaveAlternetUnit(int ProductId, Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections beDataColl)
        {
            int sno = 1;
            foreach (Dynamic.BusinessEntity.Inventory.StockItemAlternetUnit beData in beDataColl)
            {
                if (beData.BaseUnitValue != 0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@AlterNetUnitId", beData.AlterNetUnitId);
                    cmd.Parameters.AddWithValue("@BaseUnitValue", beData.BaseUnitValue);
                    cmd.Parameters.AddWithValue("@AlterNetUnitValue", beData.AlterNetUnitValue);
                    cmd.Parameters.AddWithValue("@GrossValue", beData.GrossValue);
                    cmd.Parameters.AddWithValue("@RSNO", sno);
                    cmd.CommandText = "insert into tbl_ProductAlternetUnit(RSNO,ProductId,AlterNetUnitId,BaseUnitValue,AlterNetUnitValue,GrossValue) values(@RSNO,@ProductId,@AlterNetUnitId,@BaseUnitValue,@AlterNetUnitValue,@GrossValue)";
                    cmd.ExecuteNonQuery();
                    sno++;
                }
            }

        }
        public void SaveBranchWiseAlternetUnit(int BranchId, Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections beDataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();

            System.Collections.Generic.List<int> deletedProduct = new List<int>();
            var query = from p in beDataColl
                        group p by p.StockItemId into g
                        select g.Key;

            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (var v in query)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@ProductId", v);
                cmd.Parameters.AddWithValue("@BranchId", BranchId);
                cmd.CommandText = "delete from tbl_ProductAlternetUnitForBranch where ProductId=@ProductId and BranchId=@BranchId";
                cmd.ExecuteNonQuery();
            }

            foreach (Dynamic.BusinessEntity.Inventory.StockItemAlternetUnit beData in beDataColl)
            {
                if (beData.BaseUnitValue != 0)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@BranchId", BranchId);
                    cmd.Parameters.AddWithValue("@ProductId", beData.StockItemId);
                    cmd.Parameters.AddWithValue("@AlterNetUnitId", beData.AlterNetUnitId);
                    cmd.Parameters.AddWithValue("@BaseUnitValue", beData.BaseUnitValue);
                    cmd.Parameters.AddWithValue("@AlterNetUnitValue", beData.AlterNetUnitValue);
                    cmd.Parameters.AddWithValue("@GrossValue", beData.GrossValue);
                    cmd.CommandText = "insert into tbl_ProductAlternetUnitForBranch(BranchId,ProductId,AlterNetUnitId,BaseUnitValue,AlterNetUnitValue,GrossValue) values(@BranchId,@ProductId,@AlterNetUnitId,@BaseUnitValue,@AlterNetUnitValue,@GrossValue)";
                    cmd.ExecuteNonQuery();
                }
            }

            dal.CommitTransaction();
            dal.CloseConnection();

        }
        public Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections getBranchWiseProductAlternetUnit(int BranchId, int ProductGroupId)
        {
            dal.OpenConnection();
            Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections dataColl = new BusinessEntity.Inventory.StockItemAlternetUnitCollections();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.AddWithValue("@BranchId", BranchId);
                cmd.Parameters.AddWithValue("@ProductGroupId", ProductGroupId);
                cmd.CommandText = @"select PB.ProductId,PB.AlternetUnitId,PB.BaseUnitValue,PB.AlternetUnitValue,PB.GrossValue from tbl_ProductAlternetUnitForBranch PB
                                     inner join tbl_Product P on P.ProductId=PB.ProductId
                                    where PB.BranchId=@BranchId and P.ProductGroupId=@ProductGroupId order by PB.TranId";
                cmd.CommandType = System.Data.CommandType.Text;
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemAlternetUnit beData = new BusinessEntity.Inventory.StockItemAlternetUnit();
                    beData.StockItemId = reader.GetInt32(0);
                    beData.AlterNetUnitId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.BaseUnitValue = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.AlterNetUnitValue = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.GrossValue = Convert.ToDouble(reader[4]);
                    dataColl.Add(beData);

                }
                reader.Close();

                return dataColl;
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                throw ee;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        private void SaveCostRate(int ProductId,int UnitId, Dynamic.BusinessEntity.Inventory.StockItemRatesCollections beDataColl)
        {
            foreach (Dynamic.BusinessEntity.Inventory.StockItemRates beData in beDataColl)
            {
                if (beData.ApplicableFrom.Year > 2000 && beData.Rate!=0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@UnitId", UnitId);
                    cmd.Parameters.AddWithValue("@Rate2", beData.Rate2);
                    cmd.Parameters.AddWithValue("@Rate3", beData.Rate3);
                    cmd.Parameters.AddWithValue("@Rate4", beData.Rate4);
                    cmd.Parameters.AddWithValue("@Rate5", beData.Rate5);
                    cmd.Parameters.AddWithValue("@RateOf", beData.RateOf);

                    cmd.CommandText = "insert into tbl_ProductCostRate(ProductId,ApplicableFrom,Rate,UnitId,Rate2,Rate3,Rate4,Rate5,RateOf) values(@ProductId,@ApplicableFrom,@Rate,@UnitId,@Rate2,@Rate3,@Rate4,@Rate5,@RateOf) ";
                    cmd.ExecuteNonQuery();
                }
            }

        }
        private void SaveSellingRate(int ProductId, int UnitId, Dynamic.BusinessEntity.Inventory.StockItemRatesCollections beDataColl)
        {
            foreach (Dynamic.BusinessEntity.Inventory.StockItemRates beData in beDataColl)
            {
                if (beData.ApplicableFrom.Year > 2000 && beData.Rate != 0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@UnitId", UnitId);
                    cmd.Parameters.AddWithValue("@Rate2", beData.Rate2);
                    cmd.Parameters.AddWithValue("@Rate3", beData.Rate3);
                    cmd.Parameters.AddWithValue("@Rate4", beData.Rate4);
                    cmd.Parameters.AddWithValue("@Rate5", beData.Rate5);
                    cmd.Parameters.AddWithValue("@RateOf", beData.RateOf);

                    cmd.CommandText = "insert into tbl_ProductSellingRate(ProductId,ApplicableFrom,Rate,UnitId,Rate2,Rate3,Rate4,Rate5,RateOf) values(@ProductId,@ApplicableFrom,@Rate,@UnitId,@Rate2,@Rate3,@Rate4,@Rate5,@RateOf) ";
                    cmd.ExecuteNonQuery();
                }
            }

        }

        private void SaveSlabSellingRate(int ProductId, int UnitId, Dynamic.BusinessEntity.Inventory.SlabRateCollections beDataColl)
        {
            if(beDataColl == null || beDataColl.Count == 0 || ProductId <= 0)
                return; 

            int sno = 1;    
            foreach (Dynamic.BusinessEntity.Inventory.SlabRate beData in beDataColl)
            {
                if (beData.FromQty>0 && beData.ToQty>0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@SNo", sno);                   
                    cmd.Parameters.AddWithValue("@FromQty", beData.FromQty);
                    cmd.Parameters.AddWithValue("@ToQty", beData.ToQty);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@Amount", beData.Amount);

                    //ProductId,SNo,FromQty,ToQty,Rate,Amount
                    cmd.CommandText = "insert into tbl_ProductSlabSellingRate(ProductId,SNo,FromQty,ToQty,Rate,Amount) values(@ProductId,@SNo,@FromQty,@ToQty,@Rate,@Amount) ";
                    cmd.ExecuteNonQuery();
                    sno++;
                }
            }

        }
        private void SaveTradeRate(int ProductId, int UnitId, Dynamic.BusinessEntity.Inventory.StockItemRatesCollections beDataColl)
        {
            foreach (Dynamic.BusinessEntity.Inventory.StockItemRates beData in beDataColl)
            {
                if (beData.ApplicableFrom.Year > 2000 && beData.Rate != 0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@UnitId", UnitId);
                    cmd.Parameters.AddWithValue("@Rate2", beData.Rate2);
                    cmd.Parameters.AddWithValue("@Rate3", beData.Rate3);
                    cmd.Parameters.AddWithValue("@Rate4", beData.Rate4);
                    cmd.Parameters.AddWithValue("@Rate5", beData.Rate5);
                    cmd.Parameters.AddWithValue("@RateOf", beData.RateOf);
                    cmd.CommandText = "insert into tbl_ProductTradeRate(ProductId,ApplicableFrom,Rate,UnitId,Rate2,Rate3,Rate4,Rate5,RateOf) values(@ProductId,@ApplicableFrom,@Rate,@UnitId,@Rate2,@Rate3,@Rate4,@Rate5,@RateOf) ";
                    cmd.ExecuteNonQuery();
                }
            }

        }

        private void SaveProductWiseRack(int ProductId, List<Dynamic.BusinessEntity.Inventory.ProductWiseRack> beDataColl)
        {
            int sno = 1;
            foreach (Dynamic.BusinessEntity.Inventory.ProductWiseRack beData in beDataColl)
            {
                if (beData.GodownId>0 && beData.RackId>0 && ProductId>0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@GodownId", beData.GodownId);
                    cmd.Parameters.AddWithValue("@RackId", beData.RackId);
                    cmd.Parameters.AddWithValue("@SNo", sno);
                    //ProductId,GodownId,RackId
                    cmd.CommandText = "insert into tbl_ProductWiseRack(ProductId,GodownId,RackId,SNo) values(@ProductId,@GodownId,@RackId,@SNo) ";
                    cmd.ExecuteNonQuery();
                    sno++;
                }
            }

        }
        private void SaveMRPRate(int ProductId, int UnitId, Dynamic.BusinessEntity.Inventory.StockItemRatesCollections beDataColl)
        {
            foreach (Dynamic.BusinessEntity.Inventory.StockItemRates beData in beDataColl)
            {
                if (beData.ApplicableFrom.Year > 2000 && beData.Rate != 0)
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@UnitId", UnitId);
                    cmd.Parameters.AddWithValue("@Rate2", beData.Rate2);
                    cmd.Parameters.AddWithValue("@Rate3", beData.Rate3);
                    cmd.Parameters.AddWithValue("@Rate4", beData.Rate4);
                    cmd.Parameters.AddWithValue("@Rate5", beData.Rate5);
                    cmd.Parameters.AddWithValue("@RateOf", beData.RateOf);

                    cmd.CommandText = "insert into tbl_ProductMRPRate(ProductId,ApplicableFrom,Rate,UnitId,Rate2,Rate3,Rate4,Rate5,RateOf) values(@ProductId,@ApplicableFrom,@Rate,@UnitId,@Rate2,@Rate3,@Rate4,@Rate5,@RateOf) ";
                    cmd.ExecuteNonQuery();
                }
            }

        }
        private void SaveGodownWiseOpening(int ProductId, Dynamic.BusinessEntity.Inventory.StockItemOpeningDetailsCollections beDataColl)
        {
            int sno = 1;
            foreach (Dynamic.BusinessEntity.Inventory.StockItemOpeningDetails beData in beDataColl)
            {
                if(beData.GodownId>0 && (beData.Quantity>0 ||  beData.Amount>0))
                {
                    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                    cmd.Parameters.AddWithValue("@GodownId", beData.GodownId);
                    cmd.Parameters.AddWithValue("@Quantity", beData.Quantity);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.Parameters.AddWithValue("@StockItemId", beData.StockItemId);
                    cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);

                    cmd.Parameters.AddWithValue("@RegdNo", beData.RegdNo);
                    cmd.Parameters.AddWithValue("@EngineNo", beData.EngineNo);
                    cmd.Parameters.AddWithValue("@ChassisNo", beData.ChassisNo);
                    cmd.Parameters.AddWithValue("@Model", beData.Model);
                    cmd.Parameters.AddWithValue("@CodeNo", beData.CodeNo);
                    cmd.Parameters.AddWithValue("@Color", beData.Color);
                    cmd.Parameters.AddWithValue("@KeyNo", beData.KeyNo);
                    cmd.Parameters.AddWithValue("@MFGYear", beData.MFGYear);
                    cmd.Parameters.AddWithValue("@Type", beData.Type);

                    cmd.Parameters.AddWithValue("@Batch", beData.Batch);

                    if (beData.MFGDate.HasValue)
                        cmd.Parameters.AddWithValue("@MFGDate", beData.MFGDate);
                    else
                        cmd.Parameters.AddWithValue("@MFGDate", DBNull.Value);

                    if (beData.EXPDate.HasValue)
                        cmd.Parameters.AddWithValue("@EXPDate", beData.EXPDate);
                    else
                        cmd.Parameters.AddWithValue("@EXPDate", DBNull.Value);

                    cmd.Parameters.AddWithValue("@RackId", ZeroDBNull(beData.RackId));

                    cmd.Parameters.AddWithValue("@LNo", sno);

                    //EXPDate,MFGDate,Batch
                    //RegdNo,EngineNo,ChassisNo,Mode,CodeNo,Color,KeyNo,MFGYear,Type
                    cmd.CommandText = "insert into tbl_ProductOpeningDetails(LNo,RackId,ProductId,GodownId,Quantity,UnitId,Rate,Amount,RegdNo,EngineNo,ChassisNo,Model,CodeNo,Color,KeyNo,MFGYear,Type,EXPDate,MFGDate,Batch) values(@LNo,@RackId,@ProductId,@GodownId,@Quantity,@UnitId,@Rate,@Amount,@RegdNo,@EngineNo,@ChassisNo,@Model,@CodeNo,@Color,@KeyNo,@MFGYear,@Type,@EXPDate,@MFGDate,@Batch)";
                    cmd.ExecuteNonQuery();
                    sno++;
                }
                
            }

        }

        public ResponeValues UpdateSalesPrice(int UserId,List<Dynamic.BusinessEntity.Inventory.SalesPrice> DataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                cmd.Parameters.Add("@IsValid", System.Data.SqlDbType.Bit);
                cmd.Parameters[0].Direction = System.Data.ParameterDirection.Output;
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@UserId", UserId);
                System.Data.DataTable tableAllocation = new System.Data.DataTable();                
                tableAllocation.Columns.Add("RateTypeId", typeof(int));
                tableAllocation.Columns.Add("ProductId", typeof(int));
                tableAllocation.Columns.Add("ApplicableFrom", typeof(DateTime));
                tableAllocation.Columns.Add("FromQty", typeof(double));
                tableAllocation.Columns.Add("LessThanQty", typeof(double));
                tableAllocation.Columns.Add("Rate", typeof(double));
                tableAllocation.Columns.Add("DisPer", typeof(double));
                tableAllocation.Columns.Add("DisAmt", typeof(double));

                foreach (var v in DataColl)
                {
                    var row = tableAllocation.NewRow();                    
                    row["RateTypeId"] = v.RateTypeId;
                    row["ProductId"] = v.ProductId;
                    row["ApplicableFrom"] = v.ApplicableFrom;
                    row["FromQty"] = v.FromQty;
                    row["LessThanQty"] = v.LessThanQty;
                    row["Rate"] = v.Rate;
                    row["DisPer"] = v.DisPer;
                    row["DisAmt"] = v.DisAmt;
                    tableAllocation.Rows.Add(row);
                }

                System.Data.SqlClient.SqlParameter sqlParam = cmd.Parameters.AddWithValue("@SalesPriceColl", tableAllocation);
                sqlParam.SqlDbType = System.Data.SqlDbType.Structured;
                cmd.CommandText = "usp_AddUpdateSalesPrice";
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[0].Value is DBNull)) resVal.ResponseMSG = Convert.ToString(cmd.Parameters[0].Value);
                if (!(cmd.Parameters[1].Value is DBNull)) resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[1].Value);
                  
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }
        public Dynamic.BusinessEntity.Inventory.SalesPriceCollections getSalesPriceList(int UserId,int RateTypeId, int GroupId,int? BrandId)
        {
            Dynamic.BusinessEntity.Inventory.SalesPriceCollections dataColl = new BusinessEntity.Inventory.SalesPriceCollections();
            dal.OpenConnection();
            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@RateTypeId", RateTypeId);
                cmd.Parameters.AddWithValue("@ProductGroupId", GroupId);
                cmd.Parameters.AddWithValue("@ProductBrandId", BrandId);
                cmd.CommandText = "usp_GetProductForSalesPrice";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.SalesPrice beData = new BusinessEntity.Inventory.SalesPrice();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Code = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Group = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.UOM = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.IsTaxable = reader.GetBoolean(5);
                    if (!(reader[6] is System.DBNull)) beData.Brand = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.ApplicableFrom = reader.GetDateTime(7);
                    if (!(reader[8] is System.DBNull)) beData.FromQty = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.LessThanQty = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is System.DBNull)) beData.Rate = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.DisPer = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.DisAmt = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.RateTypeId = Convert.ToInt32(reader[13]);
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;

        }
        public ResponeValue ImportGodownWiseOpening(Dynamic.BusinessEntity.Inventory.ProductCollections beDataColl)
        {
            ResponeValue resVal = new ResponeValue();
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                foreach (var v in beDataColl)
                {
                    if (v.ProductId == 0)
                        continue;

                    System.Data.SqlClient.SqlCommand cmd1 = dal.GetCommand();
                    cmd1.Parameters.AddWithValue("@ProductId", v.ProductId);
                    cmd1.Parameters.AddWithValue("@OpeningAmount", v.OpeningAmount);
                    cmd1.Parameters.AddWithValue("@OpeningRate", v.OpeningRate);
                    cmd1.Parameters.AddWithValue("@OpeningQty", v.OpeningQty);
                    cmd1.CommandText = "delete from tbl_ProductOpeningDetails where ProductId=@ProductId";
                    cmd1.ExecuteNonQuery();
                    cmd1.CommandText = "update tbl_Product set OpeningAmount=@OpeningAmount,OpeningRate=@OpeningRate,OpeningQty=@OpeningQty where ProductId=@ProductId";
                    cmd1.ExecuteNonQuery();

                    int sno = 1;
                    foreach (Dynamic.BusinessEntity.Inventory.StockItemOpeningDetails beData in v.OpeningColl)
                    {
                        if (beData.GodownId == 0)
                            continue;

                        System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                        cmd.Parameters.AddWithValue("@ProductId", v.ProductId);
                        cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                        cmd.Parameters.AddWithValue("@GodownId", beData.GodownId);
                        cmd.Parameters.AddWithValue("@Quantity", beData.Quantity);
                        cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                        cmd.Parameters.AddWithValue("@StockItemId", beData.StockItemId);
                        cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);

                        cmd.Parameters.AddWithValue("@RegdNo", IsNull(beData.RegdNo));
                        cmd.Parameters.AddWithValue("@EngineNo", IsNull(beData.EngineNo));
                        cmd.Parameters.AddWithValue("@ChassisNo", IsNull(beData.ChassisNo));
                        cmd.Parameters.AddWithValue("@Model", IsNull(beData.Model));
                        cmd.Parameters.AddWithValue("@CodeNo", IsNull(beData.CodeNo));
                        cmd.Parameters.AddWithValue("@Color", IsNull(beData.Color));
                        cmd.Parameters.AddWithValue("@KeyNo", IsNull(beData.KeyNo));
                        cmd.Parameters.AddWithValue("@MFGYear", beData.MFGYear);
                        cmd.Parameters.AddWithValue("@Type", IsNull(beData.Type));

                        cmd.Parameters.AddWithValue("@Batch",IsNull(beData.Batch));

                        if (beData.MFGDate.HasValue)
                            cmd.Parameters.AddWithValue("@MFGDate", beData.MFGDate);
                        else
                            cmd.Parameters.AddWithValue("@MFGDate", DBNull.Value);

                        if (beData.EXPDate.HasValue)
                            cmd.Parameters.AddWithValue("@EXPDate", beData.EXPDate);
                        else
                            cmd.Parameters.AddWithValue("@EXPDate", DBNull.Value);


                        cmd.Parameters.AddWithValue("@LNo", sno);

                        //EXPDate,MFGDate,Batch
                        //RegdNo,EngineNo,ChassisNo,Mode,CodeNo,Color,KeyNo,MFGYear,Type
                        cmd.CommandText = "insert into tbl_ProductOpeningDetails(LNo,ProductId,GodownId,Quantity,UnitId,Rate,Amount,RegdNo,EngineNo,ChassisNo,Model,CodeNo,Color,KeyNo,MFGYear,Type,EXPDate,MFGDate,Batch) values(@LNo,@ProductId,@GodownId,@Quantity,@UnitId,@Rate,@Amount,@RegdNo,@EngineNo,@ChassisNo,@Model,@CodeNo,@Color,@KeyNo,@MFGYear,@Type,@EXPDate,@MFGDate,@Batch)";
                        cmd.ExecuteNonQuery();
                        sno++;  
                    }
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Opening Updated Done";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
            
        }
        public void UpdateProductRemarks(Dynamic.BusinessEntity.Inventory.ProductCollections beDataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                System.Data.SqlClient.SqlCommand cmd1 = dal.GetCommand();
                foreach (var v in beDataColl)
                {
                    cmd1.Parameters.Clear();
                    cmd1.Parameters.AddWithValue("@ProductId", v.ProductId);
                    cmd1.Parameters.AddWithValue("@Remarks", v.Remarks);
                    
                    cmd1.CommandText = "update tbl_Product set Remarks=@Remarks  where ProductId=@ProductId";
                    cmd1.ExecuteNonQuery();            
                }
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }


        }
        public void UpdateProductCode(Dynamic.BusinessEntity.Inventory.ProductCollections beDataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                System.Data.SqlClient.SqlCommand cmd1 = dal.GetCommand();
                foreach (var v in beDataColl)
                {
                    cmd1.Parameters.Clear();
                    cmd1.Parameters.AddWithValue("@ProductId", v.ProductId);

                    cmd1.Parameters.AddWithValue("@Code", v.Code);

                    cmd1.CommandText = "update tbl_Product set Code=@Code  where ProductId=@ProductId";
                    cmd1.ExecuteNonQuery();
                }
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }


        }
        public void UpdateProductGroups(Dynamic.BusinessEntity.Inventory.ProductCollections beDataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                System.Data.SqlClient.SqlCommand cmd1 = dal.GetCommand();
                foreach (var v in beDataColl)
                {
                    cmd1.Parameters.Clear();
                    cmd1.Parameters.AddWithValue("@ProductId", v.ProductId);
                    cmd1.Parameters.AddWithValue("@ProductGroupId", v.ProductGroupId);
                    cmd1.Parameters.AddWithValue("@ProductCategoriesId", v.ProductCategoriesId);
                    cmd1.Parameters.AddWithValue("@ProductTypeId", v.ProductTypeId);
                    cmd1.Parameters.AddWithValue("@ProductCompanyId", v.ProductCompanyId);

                    if(v.ProductDivisionId==0)
                        cmd1.Parameters.AddWithValue("@ProductDivisionId", DBNull.Value);
                    else
                        cmd1.Parameters.AddWithValue("@ProductDivisionId", v.ProductDivisionId);

                    cmd1.Parameters.AddWithValue("@Code", v.Code);
                    cmd1.Parameters.AddWithValue("@Description", v.Description);
                    cmd1.CommandText = "update tbl_Product set Description=@Description,Code=@Code,ProductGroupId=@ProductGroupId,ProductCategoriesId=@ProductCategoriesId,ProductTypeId=@ProductTypeId,ProductCompanyId=@ProductCompanyId,ProductDivisionId=@ProductDivisionId  where ProductId=@ProductId";
                    cmd1.ExecuteNonQuery();
                }
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }


        }
        public ResponeValues Delete(Int32 ProductId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@ProductId", ProductId);

            cmd.CommandText = "delete from tbl_Product where ProductId=@ProductId ";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

            }
            catch (System.Data.SqlClient.SqlException sqlEX)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                switch (sqlEX.Number)
                {
                    case 547:
                        string tableName = GetTableNameFromError(sqlEX.Message);
                        resVal.ResponseMSG = $"Error: This record is in use and cannot be deleted because it is referenced in the '{tableName}'.";
                        break;
                    default:
                        resVal.ResponseMSG = sqlEX.Message;
                        break;
                }

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();

                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        public ResponeValues Delete(string ProductId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_Product where ProductId in (" + ProductId + ")";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

            }
            catch (System.Data.SqlClient.SqlException sqlEX)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                switch (sqlEX.Number)
                {
                    case 547:
                        string tableName = GetTableNameFromError(sqlEX.Message);
                        resVal.ResponseMSG = $"Error: This record is in use and cannot be deleted because it is referenced in the '{tableName}'.";
                        break;
                    default:
                        resVal.ResponseMSG = sqlEX.Message;
                        break;
                }

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();

                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }

        public ResponeValues Delete(System.Collections.Generic.List<Dynamic.BusinessEntity.Global.DeleteMaster> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            string errorMSG = "";
            try
            {
                foreach (var v in dataColl)
                {
                    if (!string.IsNullOrEmpty(v.Code))
                    {
                        try
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@Code", v.Code);
                            cmd.CommandText = "delete top(1) from tbl_Product where Code=@Code";
                            cmd.ExecuteNonQuery();
                        }
                        catch (Exception eee)
                        {
                            errorMSG = errorMSG + " " + eee.Message + "(" + v.Code + ")";
                        }
                    }

                }

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS + " " + errorMSG;

            }
            catch (Exception ee)
            {

                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        private int getSNo()
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "select isnull(max(AutoNumber),0)+1 from tbl_Product ";

            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ee)
            {
                throw ee;
            }

        }

        public int getAutoNumber()
        {
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "select isnull(max(AutoNumber),0)+1 from tbl_Product ";

            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public int getAutoNumberForCode(string firstLetter)
        {
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "select count(*) from tbl_Product where Name like '" + firstLetter + "%' ";

            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar()) + 1;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        private ResponeValues generateCode(int UserId, string Name, int ProductGroupId)
        {
            ResponeValues resVal = new ResponeValues();            
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@Name", Name);
            cmd.Parameters.AddWithValue("@GroupId", ProductGroupId);
            cmd.Parameters.Add("@Code", System.Data.SqlDbType.NVarChar, 100);
            cmd.Parameters.Add("@AutoNumber", System.Data.SqlDbType.Int);
            cmd.Parameters.Add("@NumberingMethod", System.Data.SqlDbType.Int);
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.CommandText = "usp_GenerateProductCode";

            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[3].Value is DBNull))
                {
                    resVal.ResponseId = cmd.Parameters[3].Value.ToString();
                    resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Unable To Generate Code";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            
            return resVal;
        }

        public ResponeValues getProductCode(int UserId, string Name, int? ProductGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@Name", Name);
            cmd.Parameters.AddWithValue("@GroupId", ProductGroupId);
            cmd.Parameters.Add("@Code", System.Data.SqlDbType.NVarChar, 100);
            cmd.Parameters.Add("@AutoNumber", System.Data.SqlDbType.Int);
            cmd.Parameters.Add("@NumberingMethod", System.Data.SqlDbType.Int);
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.CommandText = "usp_GenerateProductCode";

            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[3].Value is DBNull))
                {
                    resVal.ResponseId = cmd.Parameters[3].Value.ToString();
                    resVal.RId = Convert.ToInt32(cmd.Parameters[4].Value);
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Unable To Generate Code";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }
        public void getProductPhoto(ref Dynamic.BusinessEntity.Inventory.Product beData)
        {

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.SamplePhoto from tbl_Product(nolock) P where P.ProductId=" + beData.ProductId.ToString());
                if (reader.Read())
                {
                    if (!(reader[0] is System.DBNull)) beData.SamplePhoto = (byte[])reader[0];
                }
                reader.Close();

            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Inventory.ProductCollections getAllProductShortDetailsWithCurrentBalance(int UserId,bool isSales=false,int? ProductGroupId=null)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();

            dal.OpenConnection();

            try
            {

                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.ProductId,P.Name,P.Alias,P.BaseUnitId,P.PartNo,P.VatRate,P.IgnoreNegativeBalance,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.CanEditRate,P.Code,P.IsFixedProduct,U.Name,P.AutoNumber,P.[Description],P.Remarks,EXDutyRate from tbl_Product P left join tbl_Unit U on U.UnitId=P.BaseUnitId where P.IsActive=1 ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@IsSales", isSales);
                cmd.Parameters.AddWithValue("@ProductGroupId", ProductGroupId);
                cmd.CommandText = "sp_GetAllProductGodownWiseClosing";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Alias = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.PartNo = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(6);
                    if (!(reader[7] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(7);
                    if (!(reader[8] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(8);
                    if (!(reader[9] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(9);
                    if (!(reader[10] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(10);
                    if (!(reader[11] is System.DBNull)) beData.Code = reader.GetString(11);
                    if (!(reader[12] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(12);
                    if (!(reader[13] is System.DBNull)) beData.BaseUnitName = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.AutoNumber = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.Description = reader.GetString(15);
                    if (!(reader[16] is System.DBNull)) beData.Remarks = reader.GetString(16);
                    if (!(reader[17] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.CostingMethod = (Dynamic.BusinessEntity.Inventory.CostingMethods)reader.GetInt32(18);
                    if (!(reader[19] is System.DBNull)) beData.IncludingVat = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.WarrantyMonth = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.PurchaseLedgerId = reader.GetInt32(21);
                    if (!(reader[22] is System.DBNull)) beData.SalesLedgerId = reader.GetInt32(22);
                    if (!(reader[23] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(23);

                    if (!(reader[24] is System.DBNull)) beData.BaseUnitName = reader.GetString(24);
                    if (!(reader[25] is System.DBNull)) beData.GodownName = reader.GetString(25);
                    if (!(reader[26] is System.DBNull)) beData.BalanceQty = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.Unit2 = reader.GetString(27);
                    if (!(reader[28] is System.DBNull)) beData.Unit3 = reader.GetString(28);
                    if (!(reader[29] is System.DBNull)) beData.Unit4 = reader.GetString(29);
                    if (!(reader[30] is System.DBNull)) beData.AlternetQty1 = Convert.ToDouble(reader[30]);
                    if (!(reader[31] is System.DBNull)) beData.AlternetQty2 = Convert.ToDouble(reader[31]);
                    if (!(reader[32] is System.DBNull)) beData.AlternetQty3 = Convert.ToDouble(reader[32]);
                    if (!(reader[33] is System.DBNull)) beData.SalesRate = Convert.ToDouble(reader[33]);
                    if (!(reader[34] is System.DBNull)) beData.ProductGroupName = reader.GetString(34);

                    beData.OpeningQty = beData.BalanceQty;
                    beData.OpeningRate = beData.SalesRate;
                    // beData.BarCodeColl.Add(beData.Code);
                    dataColl.Add(beData);
                }
                reader.Close();

                //cmd.CommandType = System.Data.CommandType.Text;
                //cmd.CommandText = "select ProductId,BarCode from tbl_productCode";
                //reader = cmd.ExecuteReader();
                //while (reader.Read())
                //{
                //    int pid = reader.GetInt32(0);
                //    string code = reader.GetString(1);
                //    dataColl.Find(p1 => p1.ProductId == pid).BarCodeColl.Add(code);
                //}
                //reader.Close();

                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
                 
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
               
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BusinessEntity.Inventory.ProductCollections getAllProduct(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();          

            dal.OpenConnection();

            try
            {

                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.ProductId,P.AutoNumber,P.Name,P.Alias,P.Code,P.[Description],P.ProductGroupId,P.ProductCategoriesId,P.ProductTypeId,P.ProductCompanyId,P.BaseUnitId,P.ActiveAlternativeUnit,P.PartNo,P.PartNoAlias,P.Remarks,P.CostingMethod,P.MarketValuationMethod,P.VatRate,P.IgnoreNegativeBalance,P.SetStandardRate,P.SetGodownWiseOpening,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.OpeningQty,P.OpeningRate,P.OpeningAmount,P.TreatAllSalesAsNewManufacture,P.TreatAllPurchaseAsConsumed,P.TreatllRejectionInwardAsScraped,PG.Name as ProductGroupName,P.IsActive,P.CanEditRate,P.IsFixedProduct,U.Name,OpeningForBranchId,EXDutyRate from tbl_Product P inner join TBL_PRODUCTGROUP PG on PG.ProductGroupId=P.ProductGroupId left join tbl_Unit U on U.UnitId=P.BaseUnitId  ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId",UserId);
                cmd.CommandText = "sp_GetAllProduct";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int sno = 1;
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    beData.SNo = sno;
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2).Trim();
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3).Trim();
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4).Trim();
                    if (!(reader[5] is System.DBNull)) beData.Description = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ProductCategoriesId= reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.ProductTypeId = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.ProductCompanyId = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.ActiveAlternativeUnit = reader.GetBoolean(11);
                    if (!(reader[12] is System.DBNull)) beData.PartNo = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.PartNoAlias = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.Remarks = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.CostingMethod =(Dynamic.BusinessEntity.Inventory.CostingMethods) reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.MarketValuationMethod =(Dynamic.BusinessEntity.Inventory.MarketValuationMethods) reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(18);
                    if (!(reader[19] is System.DBNull)) beData.SetStandardRate = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.SetGodownWiseOpening = reader.GetBoolean(20);
                    if (!(reader[21] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(21);
                    if (!(reader[22] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(22);
                    if (!(reader[23] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(23);
                    if (!(reader[24] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.OpeningRate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.OpeningAmount = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.TreatAllSalesAsNewManufacture = reader.GetBoolean(27);
                    if (!(reader[28] is System.DBNull)) beData.TreatAllPurchaseAsConsumed = reader.GetBoolean(28);
                    if (!(reader[29] is System.DBNull)) beData.TreatllRejectionInwardAsScraped = reader.GetBoolean(29);
                    if (!(reader[30] is System.DBNull)) beData.ProductGroupName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.IsActive = reader.GetBoolean(31);
                    if (!(reader[32] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(32);
                    if (!(reader[33] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(33);
                    if (!(reader[34] is System.DBNull)) beData.BaseUnitName = reader.GetString(34);
                    if (!(reader[35] is System.DBNull)) beData.OpeningForBranchId = reader.GetInt32(35);
                    if (!(reader[36] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[36]);
                    if (!(reader[37] is System.DBNull)) beData.IncludingVat = reader.GetBoolean(37);
                    if (!(reader[38] is System.DBNull)) beData.WarrantyMonth = Convert.ToDouble(reader[38]);
                    if (!(reader[39] is System.DBNull)) beData.PurchaseLedgerId = reader.GetInt32(39);
                    if (!(reader[40] is System.DBNull)) beData.SalesLedgerId = reader.GetInt32(40);
                    if (!(reader[41] is System.DBNull)) beData.TSCRate = Convert.ToDouble(reader[41]);
                    //Added by Simran
                    if (!(reader[42] is System.DBNull)) beData.VideoLink = reader.GetString(42).Trim();
                    if (!(reader[43] is System.DBNull)) beData.HerbsId = reader.GetInt32(43);
                    //End
                    try
                    {
                        if (!(reader[42] is System.DBNull)) beData.PurchaseUnitId = Convert.ToInt32(reader[42]);
                        if (!(reader[43] is System.DBNull)) beData.SalesUnitId = Convert.ToInt32(reader[43]);
                    }
                    catch { }

                    if (!beData.PurchaseUnitId.HasValue)
                        beData.PurchaseUnitId = beData.BaseUnitId;

                    if (!beData.SalesUnitId.HasValue)
                        beData.SalesUnitId = beData.BaseUnitId;

                    // beData.BarCodeColl.Add(beData.Code);
                    dataColl.Add(beData);
                    sno++;
                }
                reader.Close();
              
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BusinessEntity.Inventory.ProductCollections getAllProductList(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();

            dal.OpenConnection();

            try
            {

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetAllProductList";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int sno = 1;
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    beData.SNo = sno;
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2).Trim();
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3).Trim();
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4).Trim();
                    if (!(reader[5] is System.DBNull)) beData.ProductGroupName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.ProductCategoriesName = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.ProductTypeName = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) beData.BaseUnitName = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) beData.PartNo = reader.GetString(9);
                    if (!(reader[10] is System.DBNull)) beData.Remarks = reader.GetString(10);
                      
                    dataColl.Add(beData);
                    sno++;
                }
                reader.Close();

                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections getAllAlternetUnit(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections dataColl = new BusinessEntity.Inventory.StockItemAlternetUnitCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetAllAlternetUnit";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                int sno = 1;
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemAlternetUnit beData = new BusinessEntity.Inventory.StockItemAlternetUnit();                    
                    if (!(reader[0] is System.DBNull)) beData.StockItemId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AlterNetUnitId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.AlterNetUnitName = reader.GetString(2).Trim();
                    if (!(reader[3] is System.DBNull)) beData.BaseUnitValue = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.AlterNetUnitValue = Convert.ToDouble(reader[4]);

                    dataColl.Add(beData);
                    sno++;
                }
                reader.Close();
                 
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BusinessEntity.Inventory.Product getProductBy(string colName,string Value)
        {
            Dynamic.BusinessEntity.Inventory.Product beData = null;

            dal.OpenConnection();

            try
            {

                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.ProductId,P.AutoNumber,P.Name,P.Alias,P.Code,P.[Description],P.ProductGroupId,P.ProductCategoriesId,P.ProductTypeId,P.ProductCompanyId,P.BaseUnitId,P.ActiveAlternativeUnit,P.PartNo,P.PartNoAlias,P.Remarks,P.CostingMethod,P.MarketValuationMethod,P.VatRate,P.IgnoreNegativeBalance,P.SetStandardRate,P.SetGodownWiseOpening,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.OpeningQty,P.OpeningRate,P.OpeningAmount,P.TreatAllSalesAsNewManufacture,P.TreatAllPurchaseAsConsumed,P.TreatllRejectionInwardAsScraped,PG.Name as ProductGroupName,P.IsActive,P.CanEditRate,P.IsFixedProduct,U.Name,OpeningForBranchId,EXDutyRate from tbl_Product P inner join TBL_PRODUCTGROUP PG on PG.ProductGroupId=P.ProductGroupId left join tbl_Unit U on U.UnitId=P.BaseUnitId  ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.AddWithValue("@ColName",colName);
                cmd.Parameters.AddWithValue("@Value", Value);
                cmd.CommandText = "sp_GetProductBy";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Description = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ProductCategoriesId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.ProductTypeId = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.ProductCompanyId = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.ActiveAlternativeUnit = reader.GetBoolean(11);
                    if (!(reader[12] is System.DBNull)) beData.PartNo = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.PartNoAlias = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.Remarks = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.CostingMethod = (Dynamic.BusinessEntity.Inventory.CostingMethods)reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.MarketValuationMethod = (Dynamic.BusinessEntity.Inventory.MarketValuationMethods)reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(18);
                    if (!(reader[19] is System.DBNull)) beData.SetStandardRate = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.SetGodownWiseOpening = reader.GetBoolean(20);
                    if (!(reader[21] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(21);
                    if (!(reader[22] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(22);
                    if (!(reader[23] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(23);
                    if (!(reader[24] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.OpeningRate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.OpeningAmount = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.TreatAllSalesAsNewManufacture = reader.GetBoolean(27);
                    if (!(reader[28] is System.DBNull)) beData.TreatAllPurchaseAsConsumed = reader.GetBoolean(28);
                    if (!(reader[29] is System.DBNull)) beData.TreatllRejectionInwardAsScraped = reader.GetBoolean(29);
                    if (!(reader[30] is System.DBNull)) beData.ProductGroupName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.IsActive = reader.GetBoolean(31);
                    if (!(reader[32] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(32);
                    if (!(reader[33] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(33);
                    if (!(reader[34] is System.DBNull)) beData.BaseUnitName = reader.GetString(34);
                    if (!(reader[35] is System.DBNull)) beData.OpeningForBranchId = reader.GetInt32(35);
                    if (!(reader[36] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[36]);
                    if (!(reader[37] is System.DBNull)) beData.IncludingVat = reader.GetBoolean(37);
                    if (!(reader[38] is System.DBNull)) beData.WarrantyMonth = Convert.ToDouble(reader[38]);
                    if (!(reader[39] is System.DBNull)) beData.PurchaseLedgerId = reader.GetInt32(39);
                    if (!(reader[40] is System.DBNull)) beData.SalesLedgerId = reader.GetInt32(40);
                    try
                    {
                        if (!(reader[41] is System.DBNull)) beData.ProductDivisionId = reader.GetInt32(41);
                        if (!(reader[42] is System.DBNull)) beData.TSCRate = Convert.ToDouble(reader[42]);
                    }
                    catch { }
                    // beData.BarCodeColl.Add(beData.Code);
                    
                }
                reader.Close();

                //cmd.CommandType = System.Data.CommandType.Text;                
                //cmd.CommandText = "select ProductId,BarCode from tbl_productCode";
                //reader = cmd.ExecuteReader();
                //while (reader.Read())
                //{
                //    int pid = reader.GetInt32(0);
                //    string code = reader.GetString(1);
                //    dataColl.Find(p1 => p1.ProductId == pid).BarCodeColl.Add(code);
                //}
                //reader.Close();
                return beData;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Inventory.ProductCollections getAllProductShortDetails(int UserId,int? ProductGroupId=null)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();

            dal.OpenConnection();

            try
            {

                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.ProductId,P.Name,P.Alias,P.BaseUnitId,P.PartNo,P.VatRate,P.IgnoreNegativeBalance,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.CanEditRate,P.Code,P.IsFixedProduct,U.Name,P.AutoNumber,P.[Description],P.Remarks,EXDutyRate from tbl_Product P left join tbl_Unit U on U.UnitId=P.BaseUnitId where P.IsActive=1 ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductGroupId", ProductGroupId);
                cmd.CommandText = "sp_GetAllProductShortDetails";
                
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);                    
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1).Trim();
                    if (!(reader[2] is System.DBNull)) beData.Alias = reader.GetString(2).Trim();                    
                    if (!(reader[3] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.PartNo = reader.GetString(4).Trim();
                    if (!(reader[5] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(6);
                    if (!(reader[7] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(7);
                    if (!(reader[8] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(8);
                    if (!(reader[9] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(9);
                    if (!(reader[10] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(10);
                    if (!(reader[11] is System.DBNull)) beData.Code = reader.GetString(11).Trim();
                    if (!(reader[12] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(12);
                    if (!(reader[13] is System.DBNull)) beData.BaseUnitName = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.AutoNumber = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.Description = reader.GetString(15);
                    if (!(reader[16] is System.DBNull)) beData.Remarks = reader.GetString(16);
                    if (!(reader[17] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.CostingMethod =(Dynamic.BusinessEntity.Inventory.CostingMethods)reader.GetInt32(18);
                    if (!(reader[19] is System.DBNull)) beData.IncludingVat = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.WarrantyMonth = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.PurchaseLedgerId = reader.GetInt32(21);
                    if (!(reader[22] is System.DBNull)) beData.SalesLedgerId = reader.GetInt32(22);
                    if (!(reader[23] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(23);
                    if (!(reader[24] is System.DBNull)) beData.ProductGroupName = reader.GetString(24);
                    if (!(reader[25] is System.DBNull)) beData.PurchaseCCRate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.SalesCCRate = Convert.ToDouble(reader[26]);
                    try
                    {
                        if (!(reader[27] is System.DBNull)) beData.ExDutyUnitId = Convert.ToInt32(reader[27]);
                        if (!(reader[28] is System.DBNull)) beData.ProductTypeId = Convert.ToInt32(reader[28]);
                        if (!(reader[29] is System.DBNull)) beData.TSCRate = Convert.ToDouble(reader[29]);
                    }
                    catch { }

                   
                   // beData.BarCodeColl.Add(beData.Code);
                    dataColl.Add(beData);
                }
                reader.Close();

                //cmd.CommandType = System.Data.CommandType.Text;
                //cmd.CommandText = "select ProductId,BarCode from tbl_productCode";
                //reader = cmd.ExecuteReader();
                //while (reader.Read())
                //{
                //    int pid = reader.GetInt32(0);
                //    string code = reader.GetString(1);
                //    dataColl.Find(p1 => p1.ProductId == pid).BarCodeColl.Add(code);
                //}
                //reader.Close();

                return dataColl;
            }
            catch (Exception ee)
            {
                Global.GlobalDB.ShowErrorMessage(ee.Message + " :- On sp_GetAllProductShortDetails");
                return dataColl;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Inventory.ProductCollections getAllFixedProductShortDetails(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();

            dal.OpenConnection();

            try
            {

                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.ProductId,P.Name,P.Alias,P.BaseUnitId,P.PartNo,P.VatRate,P.IgnoreNegativeBalance,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.CanEditRate,P.Code,P.IsFixedProduct,EXDutyRate from tbl_Product P where P.IsActive=1 and P.IsFixedProduct=1 ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "sp_GetAllFixedProductShortDetails";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Alias = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.PartNo = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(6);
                    if (!(reader[7] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(7);
                    if (!(reader[8] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(8);
                    if (!(reader[9] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(9);
                    if (!(reader[10] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(10);
                    if (!(reader[11] is System.DBNull)) beData.Code = reader.GetString(11);
                    if (!(reader[12] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(12);
                    if (!(reader[13] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is System.DBNull)) beData.WarrantyMonth = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.PurchaseLedgerId = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.SalesLedgerId = reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(17);                    
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
                
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }
        public Dynamic.BusinessEntity.Inventory.FixedProductRateListCollections getFixedProductRateList(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.FixedProductRateListCollections dataColl = new BusinessEntity.Inventory.FixedProductRateListCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetEngineNoForSalesRate";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.FixedProductRateList beData = new BusinessEntity.Inventory.FixedProductRateList();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.GroupName = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.EngineNo = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.ChassisNo = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Model = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.Rate = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is System.DBNull)) beData.ApplicableFrom = reader.GetDateTime(7);
                    if (!(reader[8] is System.DBNull)) beData.Qty = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.Color = reader.GetString(9);
                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Inventory.StockItemRatesCollections getFixedProductRate(int UserId, int ProductId, string EngineNo)
        {
            Dynamic.BusinessEntity.Inventory.StockItemRatesCollections dataColl = new BusinessEntity.Inventory.StockItemRatesCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.Parameters.AddWithValue("@EngineNo", EngineNo);
                cmd.CommandText = "usp_GetFixedProductSalesRate";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemRates beData = new BusinessEntity.Inventory.StockItemRates();
                    if (!(reader[0] is System.DBNull)) beData.ApplicableFrom = reader.GetDateTime(0);
                    if (!(reader[1] is System.DBNull)) beData.Rate = Convert.ToDouble(reader[1]);
                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public ResponeValues SaveFixedProductRate(int UserId, List<Dynamic.BusinessEntity.Inventory.FixedProductBalRate> dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;               
                foreach (var beData in dataColl)
                {
                    if (beData.ProductId > 0)
                    {
                        if(!string.IsNullOrEmpty(beData.EngineNo) || !string.IsNullOrEmpty(beData.Model))
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@UserId", UserId);
                            cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                            cmd.Parameters.AddWithValue("@EngineNo", beData.EngineNo);
                            cmd.Parameters.AddWithValue("@ChassisNo", "");
                            cmd.Parameters.AddWithValue("@Model", beData.Model);
                            cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                            cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                            cmd.CommandText = "insert into tbl_FixedProductSellingRate(UserId,ProductId,EngineNo,ChassisNo,Model,ApplicableFrom,Rate) values(@UserId,@ProductId,@EngineNo,@ChassisNo,@Model,@ApplicableFrom,@Rate);";
                            cmd.ExecuteNonQuery();
                        }
                      
                    }
                  
                }
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SAVE_SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;

        }
        public ResponeValues SaveFixedProductRate(int UserId,int ProductId,string EngineNo,string ChassisNo,string Model, Dynamic.BusinessEntity.Inventory.StockItemRatesCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.Parameters.AddWithValue("@EngineNo", EngineNo);
                //cmd.CommandText = "delete from tbl_FixedProductSellingRate where ProductId=@ProductId and EngineNo=@EngineNo";
                cmd.CommandText = "delete from tbl_FixedProductSellingRate where  EngineNo=@EngineNo";
                cmd.ExecuteNonQuery();
                
                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", ProductId);
                    cmd.Parameters.AddWithValue("@EngineNo", EngineNo);
                    cmd.Parameters.AddWithValue("@ChassisNo", ChassisNo);
                    cmd.Parameters.AddWithValue("@Model", Model);
                    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                    cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                    cmd.CommandText = "insert into tbl_FixedProductSellingRate(ProductId,EngineNo,ChassisNo,Model,ApplicableFrom,Rate) values(@ProductId,@EngineNo,@ChassisNo,@Model,@ApplicableFrom,@Rate);";
                    cmd.ExecuteNonQuery();
                }
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SAVE_SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;

        }
        public System.Collections.Generic.List<int> getAllFixedProductIds()
        {
            System.Collections.Generic.List<int> dataColl = new List<int>();

            dal.OpenConnection();

            try
            {

                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.ProductId from tbl_Product P where P.IsActive=1 and P.IsFixedProduct=1 ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.CommandText = "sp_GetAllFixedProductId";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    dataColl.Add(reader.GetInt32(0));
                }
                reader.Close();
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Inventory.Product getProductShortDetailsByProductId(int ProductId)
        {
            Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();

            dal.OpenConnection();

            try
            {

                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select P.Alias,P.PartNo,P.Remarks,isnull(U.Name,0) as BaseUnit from tbl_Product P left join TBL_UNIT U on U.UnitId=P.BaseUnitId where P.ProductId="+ProductId.ToString());
                if (reader.Read())
                {                                        
                    if (!(reader[0] is System.DBNull)) beData.Alias = reader.GetString(0);
                    if (!(reader[1] is System.DBNull)) beData.PartNo = reader.GetString(1);                    
                    if (!(reader[2] is System.DBNull)) beData.Remarks = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.BaseUnitName = reader.GetString(3);                    
                }
                reader.Close();
                return beData;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public void getProductDetailsByproductId(ref Dynamic.BusinessEntity.Inventory.Product beData)
        {

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select AU.ProductId,AU.AlterNetUnitId,AU.BaseUnitValue,AU.AlterNetUnitValue,U.Name as UnitName,GrossValue from tbl_ProductAlternetUnit(nolock) AU inner join TBL_UNIT(nolock) U on U.UnitId=AU.AlterNetUnitId where AU.ProductId =" + beData.ProductId.ToString()+" order by AU.RSNO ");
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemAlternetUnit beData1 = new BusinessEntity.Inventory.StockItemAlternetUnit();
                    beData1.StockItemId = beData.ProductId;
                    if (!(reader[1] is System.DBNull)) beData1.AlterNetUnitId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData1.BaseUnitValue = Convert.ToDouble(reader[2]); 
                    if (!(reader[3] is System.DBNull)) beData1.AlterNetUnitValue = Convert.ToDouble(reader[3]); 
                    if (!(reader[4] is System.DBNull)) beData1.AlterNetUnitName = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData1.GrossValue = Convert.ToDouble(reader[5]); 

                    beData.AlterNetUnitColl.Add(beData1);
                    
                }
                reader.Close();

                reader = dal.ExecuteDataReaderText("select CR.ApplicableFrom,CR.Rate,CR.UnitId,U.Name as UnitName,CR.Rate2,CR.Rate3,CR.Rate4,CR.Rate5,CR.RateOf from tbl_ProductCostRate(nolock) CR inner join TBL_UNIT(nolock) U on U.UnitId=CR.UnitId where CR.ItemAllocationId is null and CR.ProductId =" + beData.ProductId.ToString());
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemRates rate = new BusinessEntity.Inventory.StockItemRates();
                    if (!(reader[0] is System.DBNull)) rate.ApplicableFrom = reader.GetDateTime(0);
                    if (!(reader[1] is System.DBNull)) rate.Rate = Convert.ToDouble(reader[1]); 
                    if (!(reader[2] is System.DBNull)) rate.UnitId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) rate.UnitName = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) rate.Rate2 = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) rate.Rate3 = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) rate.Rate4 = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is System.DBNull)) rate.Rate5 = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) rate.RateOf = Convert.ToDouble(reader[8]);
                    beData.CostRateColl.Add(rate);
                }
                reader.Close();


                reader = dal.ExecuteDataReaderText("select CR.ApplicableFrom,CR.Rate,CR.UnitId,U.Name as UnitName,CR.Rate2,CR.Rate3,CR.Rate4,CR.Rate5,CR.RateOf from tbl_ProductSellingRate(nolock) CR inner join TBL_UNIT(nolock) U on U.UnitId=CR.UnitId where CR.ItemAllocationId is null and CR.ProductId =" + beData.ProductId.ToString());
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemRates rate = new BusinessEntity.Inventory.StockItemRates();
                    if (!(reader[0] is System.DBNull)) rate.ApplicableFrom = reader.GetDateTime(0);
                    if (!(reader[1] is System.DBNull)) rate.Rate = Convert.ToDouble(reader[1]); ;
                    if (!(reader[2] is System.DBNull)) rate.UnitId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) rate.UnitName = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) rate.Rate2 = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) rate.Rate3 = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) rate.Rate4 = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is System.DBNull)) rate.Rate5 = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) rate.RateOf = Convert.ToDouble(reader[8]);
                    beData.SellingRateColl.Add(rate);
                }
                reader.Close();

                beData.SlabSellingRateColl=new BusinessEntity.Inventory.SlabRateCollections();  
                reader = dal.ExecuteDataReaderText("select CR.ProductId,CR.SNo,CR.FromQty,CR.ToQty,CR.Rate,CR.Amount from tbl_ProductSlabSellingRate(nolock) CR where CR.ProductId=" + beData.ProductId.ToString()+" order by CR.SNo ");
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.SlabRate rate = new BusinessEntity.Inventory.SlabRate();
                    if (!(reader[0] is System.DBNull)) rate.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) rate.SNo = Convert.ToInt32(reader[1]); 
                    if (!(reader[2] is System.DBNull)) rate.FromQty = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) rate.ToQty = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) rate.Rate = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) rate.Amount = Convert.ToDouble(reader[5]);
                    
                    beData.SlabSellingRateColl.Add(rate);
                }
                reader.Close();

                reader = dal.ExecuteDataReaderText("select CR.ApplicableFrom,CR.Rate,CR.UnitId,U.Name as UnitName,CR.Rate2,CR.Rate3,CR.Rate4,CR.Rate5,CR.RateOf from tbl_ProductTradeRate(nolock) CR inner join TBL_UNIT(nolock) U on U.UnitId=CR.UnitId where CR.ProductId =" + beData.ProductId.ToString());
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemRates rate = new BusinessEntity.Inventory.StockItemRates();
                    if (!(reader[0] is System.DBNull)) rate.ApplicableFrom = reader.GetDateTime(0);
                    if (!(reader[1] is System.DBNull)) rate.Rate = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) rate.UnitId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) rate.UnitName = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) rate.Rate2 = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) rate.Rate3 = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) rate.Rate4 = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is System.DBNull)) rate.Rate5 = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) rate.RateOf = Convert.ToDouble(reader[8]);
                    beData.TradeRateColl.Add(rate);
                }
                reader.Close();

                reader = dal.ExecuteDataReaderText("select CR.ApplicableFrom,CR.Rate,CR.UnitId,U.Name as UnitName,CR.Rate2,CR.Rate3,CR.Rate4,CR.Rate5,CR.RateOf from tbl_ProductMRPRate(nolock) CR inner join TBL_UNIT(nolock) U on U.UnitId=CR.UnitId where CR.ProductId =" + beData.ProductId.ToString());
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemRates rate = new BusinessEntity.Inventory.StockItemRates();
                    if (!(reader[0] is System.DBNull)) rate.ApplicableFrom = reader.GetDateTime(0);
                    if (!(reader[1] is System.DBNull)) rate.Rate = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) rate.UnitId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) rate.UnitName = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) rate.Rate2 = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) rate.Rate3 = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) rate.Rate4 = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is System.DBNull)) rate.Rate5 = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) rate.RateOf = Convert.ToDouble(reader[8]);
                    beData.MRPRateColl.Add(rate);
                }
                reader.Close();


                reader = dal.ExecuteDataReaderText("select OD.GodownId,OD.Quantity,OD.UnitId,OD.Rate,OD.Amount,G.Name as GodownName,U.Name as UnitName,OD.RegdNo,OD.EngineNo,OD.ChassisNo,OD.Model,OD.CodeNo,OD.Color,OD.KeyNo,OD.MFGYear,OD.Type,EXPDate,MFGDate,Batch,OD.RackId from  tbl_ProductOpeningDetails(nolock) OD inner join TBL_GODOWN(nolock) G on G.GodownId=OD.GodownId inner join TBL_UNIT(nolock) U on U.UnitId=OD.UnitId where OD.ProductId  =" + beData.ProductId.ToString()+" order by OD.LNo ");
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemOpeningDetails open = new BusinessEntity.Inventory.StockItemOpeningDetails();                    
                    if (!(reader[0] is System.DBNull)) open.GodownId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) open.Quantity = Convert.ToDouble(reader[1]); ;
                    if (!(reader[2] is System.DBNull)) open.UnitId= reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) open.Rate = Convert.ToDouble(reader[3]); ;
                    if (!(reader[4] is System.DBNull)) open.Amount = Convert.ToDouble(reader[4]); ;
                    if (!(reader[5] is System.DBNull)) open.GodownName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) open.UnitName = reader.GetString(6);

                    //RegdNo,EngineNo,ChassisNo,Mode,CodeNo,Color,KeyNo,MFGYear,Type
                    if (!(reader[7] is System.DBNull)) open.RegdNo = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) open.EngineNo = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) open.ChassisNo = reader.GetString(9);
                    if (!(reader[10] is System.DBNull)) open.Model = reader.GetString(10);
                    if (!(reader[11] is System.DBNull)) open.CodeNo = reader.GetString(11);
                    if (!(reader[12] is System.DBNull)) open.Color = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) open.KeyNo = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) open.MFGYear = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) open.Type = reader.GetString(15);

                    if (!(reader[16] is System.DBNull)) open.EXPDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) open.MFGDate = reader.GetDateTime(17);
                    if (!(reader[18] is System.DBNull)) open.Batch = reader.GetString(18);
                    if (!(reader[19] is System.DBNull)) open.RackId = reader.GetInt32(19);

                    beData.OpeningColl.Add(open);
                }
                reader.Close();

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                cmd.CommandText = "select TranId,UDFId,Value,AlterNetValue from tbl_UDFProduct(nolock)  CD where CD.TranId=@ProductId ";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    UserDefineField ledData = new UserDefineField();
                    if (!(reader[0] is System.DBNull)) ledData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) ledData.UDFId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) ledData.Value = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) ledData.AlterNetValue = reader.GetString(3);
                    beData.UserDefineFieldsColl.Add(ledData);
                }
                reader.Close();

                cmd.CommandText = "select BarCode from tbl_ProductCode(nolock)  CD where CD.ProductId=@ProductId ";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    if (!(reader[0] is System.DBNull))
                    {
                        string code = reader.GetString(0);

                        if(!beData.BarCodeColl.Contains(code))
                            beData.BarCodeColl.Add(code);                    
                    }
                        
                }
                reader.Close();

                cmd.CommandText = "select top(1) ProductDivisionId,ProductBrandId,ProductColorId,ProductShapeId,ProductFlavourId,PurchaseCCRate,SalesCCRate,ExDutyUnitId,CD.BaseUnitId,CD.SNo,CD.ExDutyRate,CD.PurchaseLedgerId,CD.SalesLedgerId,CD.PhotoPath,CD.IsTaxable,WarrantyMonth,TSCRate,CD.IncludingVat,CD.TermCondition,CD.CanEditRatePurchase,CD.PurchaseUnitId,CD.SalesUnitId,CD.ExciseOn,CD.DiscountOn,CD.PurchaseRateFormula,CD.SalesRateFormula,PurchaseCostUnitId,SalesCostUnitId,AllowSalesPoint,SalesPointPerQty,CD.HSCode,CD.ActiveMultipleBatch,CD.ProfitMarginRate,CD.WeightConv,CD.WeightUnitId,CD.VolumConv,CD.VolumUnitId,CD.BR_PurchaseLedgerId,CD.BR_SalesLedgerId,CD.Pur_MinRate,CD.Pur_MaxRate,CD.Sal_MinRate,CD.Sal_MaxRate,CD.Attributes,CD.UDFKeyVal,CD.PurchaseReturnLedgerId,CD.SalesReturnLedgerId,CD.Title,CD.SubTitle,CD.EcommerceDescription,CD.SubGroup1,CD.SubGroup2,CD.SubGroup3,CD.SubGroup4,CD.SubGroup5,CD.DebtorTypeId from tbl_Product(nolock)  CD where CD.ProductId=@ProductId ";
                reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    if (!(reader[0] is System.DBNull)) beData.ProductDivisionId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.ProductBrandId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.ProductColorId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.ProductShapeId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.ProductFlavourId = reader.GetInt32(4);
                    if (!(reader[5] is System.DBNull)) beData.PurchaseCCRate = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is System.DBNull)) beData.SalesCCRate = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is System.DBNull)) beData.ExDutyUnitId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.SNo = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.PurchaseLedgerId = reader.GetInt32(11);
                    if (!(reader[12] is System.DBNull)) beData.SalesLedgerId = reader.GetInt32(12);
                    if (!(reader[13] is System.DBNull)) beData.PhotoPath = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.IsTaxable = reader.GetBoolean(14);
                    if (!(reader[15] is System.DBNull)) beData.WarrantyMonth = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.TSCRate = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is System.DBNull)) beData.IncludingVat = Convert.ToBoolean(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.TermCondition = reader.GetString(18);
                    if (!(reader[19] is System.DBNull)) beData.CanEditRatePurchase = Convert.ToBoolean(reader[19]);
                    if (!(reader[20] is System.DBNull)) beData.PurchaseUnitId = Convert.ToInt32(reader[20]);
                    if (!(reader[21] is System.DBNull)) beData.SalesUnitId = Convert.ToInt32(reader[21]);
                    if (!(reader[22] is System.DBNull)) beData.ExciseOn = Convert.ToInt32(reader[22]);
                    if (!(reader[23] is System.DBNull)) beData.DiscountOn = Convert.ToInt32(reader[23]);
                    if (!(reader[24] is System.DBNull)) beData.PurchaseRateFormula = Convert.ToString(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.SalesRateFormula = Convert.ToString(reader[25]);

                    if (!(reader[26] is System.DBNull)) beData.PurchaseCostUnitId = Convert.ToInt32(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.SalesCostUnitId = Convert.ToInt32(reader[27]);
                    if (!(reader[28] is System.DBNull)) beData.AllowSalesPoint = Convert.ToBoolean(reader[28]);
                    if (!(reader[29] is System.DBNull)) beData.SalesPointPerQty = Convert.ToDouble(reader[29]);
                    if (!(reader[30] is System.DBNull)) beData.HSCode = Convert.ToString(reader[30]);
                    if (!(reader[31] is System.DBNull)) beData.ActiveMultipleBatch = Convert.ToBoolean(reader[31]);
                    if (!(reader[32] is System.DBNull)) beData.ProfitMarginRate = Convert.ToDouble(reader[32]);

                    if (!(reader[33] is System.DBNull)) beData.WeightConv = Convert.ToDouble(reader[33]);
                    if (!(reader[34] is System.DBNull)) beData.WeightUnitId = Convert.ToInt32(reader[34]);
                    if (!(reader[35] is System.DBNull)) beData.VolumConv = Convert.ToDouble(reader[35]);
                    if (!(reader[36] is System.DBNull)) beData.VolumUnitId = Convert.ToInt32(reader[36]);

                    if (!(reader[37] is System.DBNull)) beData.BR_PurchaseLedgerId = Convert.ToInt32(reader[37]);
                    if (!(reader[38] is System.DBNull)) beData.BR_SalesLedgerId = Convert.ToInt32(reader[38]);
                    if (!(reader[39] is System.DBNull)) beData.Pur_MinRate = Convert.ToDouble(reader[39]);
                    if (!(reader[40] is System.DBNull)) beData.Pur_MaxRate = Convert.ToDouble(reader[40]);
                    if (!(reader[41] is System.DBNull)) beData.Sal_MinRate = Convert.ToDouble(reader[41]);
                    if (!(reader[42] is System.DBNull)) beData.Sal_MaxRate = Convert.ToDouble(reader[42]);
                    if (!(reader["Attributes"] is System.DBNull)) beData.Attributes = Convert.ToString(reader["Attributes"]);
                    if (!(reader["UDFKeyVal"] is System.DBNull)) beData.UDFKeyVal = Convert.ToString(reader["UDFKeyVal"]);
                    if (!(reader["PurchaseReturnLedgerId"] is System.DBNull)) beData.PurchaseReturnLedgerId = Convert.ToInt32(reader["PurchaseReturnLedgerId"]);
                    if (!(reader["SalesReturnLedgerId"] is System.DBNull)) beData.SalesReturnLedgerId = Convert.ToInt32(reader["SalesReturnLedgerId"]);

                    if (!(reader["Title"] is System.DBNull)) beData.Title = Convert.ToString(reader["Title"]);
                    if (!(reader["SubTitle"] is System.DBNull)) beData.SubTitle = Convert.ToString(reader["SubTitle"]);
                    if (!(reader["EcommerceDescription"] is System.DBNull)) beData.EcommerceDescription = Convert.ToString(reader["EcommerceDescription"]);
                    if (!(reader["SubGroup1"] is System.DBNull)) beData.SubGroup1 = Convert.ToInt32(reader["SubGroup1"]);
                    if (!(reader["SubGroup2"] is System.DBNull)) beData.SubGroup2 = Convert.ToInt32(reader["SubGroup2"]);
                    if (!(reader["SubGroup3"] is System.DBNull)) beData.SubGroup3 = Convert.ToInt32(reader["SubGroup3"]);
                    if (!(reader["SubGroup4"] is System.DBNull)) beData.SubGroup4 = Convert.ToInt32(reader["SubGroup4"]);
                    if (!(reader["SubGroup5"] is System.DBNull)) beData.SubGroup5 = Convert.ToInt32(reader["SubGroup5"]);
                    if (!(reader["DebtorTypeId"] is System.DBNull)) beData.DebtorTypeId = Convert.ToInt32(reader["DebtorTypeId"]);
                    //AllowSalesPoint,SalesPointPerQty

                    if (beData.SubGroup5.HasValue)
                        beData.ProductGroupId = beData.SubGroup5.Value;

                }
                reader.Close();



                cmd.CommandText = @"select BB.BranchId,BB.BaseUnitId,B.Name as BranchName,U.Name as Unit from tbl_BranchWiseBaseUnit(nolock) BB
                                    inner join tbl_Branch(nolock) B on B.BranchId=BB.BranchId
                                    inner join tbl_Unit(nolock) U on U.UnitId=BB.BaseUnitId where BB.ProductId=@ProductId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemOpeningDetails bData = new BusinessEntity.Inventory.StockItemOpeningDetails();
                    bData.GodownId = reader.GetInt32(0);
                    bData.UnitId = reader.GetInt32(1);
                    bData.GodownName = reader.GetString(2);
                    bData.UnitName = reader.GetString(3);
                    beData.BranchWiseBaseUnitColl.Add(bData);
                }
                reader.Close();

                cmd.CommandText = "select ProductCategoriesId from tbl_ProductCategoryDetails(nolock)  CD where CD.ProductId=@ProductId ";
                reader = cmd.ExecuteReader();
                beData.ProductCategoriesIdColl = new List<int>();
                while (reader.Read())
                {
                    if (!(reader[0] is System.DBNull))
                    {
                        beData.ProductCategoriesIdColl.Add(reader.GetInt32(0));
                    }
                }
                reader.Close();

                cmd.CommandText = "select ProductId,Document,Extension,Name from tbl_ProductImage(nolock)  CD where CD.ProductId=@ProductId ";
                reader = cmd.ExecuteReader();
                beData.ImageColl = new BusinessEntity.GeneralDocumentCollections();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.GeneralDocument ledData = new BusinessEntity.GeneralDocument();
                    if (!(reader[0] is System.DBNull)) ledData.Id = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) ledData.Data = (byte[])reader[1];
                    if (!(reader[2] is System.DBNull)) ledData.Extension = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) ledData.Name = reader.GetString(3);
                    beData.ImageColl.Add(ledData);
                }
                reader.Close();


                cmd.CommandText = "select LedgerId from tbl_ProductWisePreferedSupplier(nolock)  CD where CD.ProductId=@ProductId ";
                reader = cmd.ExecuteReader();
                beData.PreferedSupplierIdColl = new List<int>();
                while (reader.Read())
                {
                    if (!(reader[0] is System.DBNull))
                    {
                        beData.PreferedSupplierIdColl.Add(reader.GetInt32(0));
                    }
                }
                reader.Close();

                try
                {
                    beData.UDFColl = new List<BusinessEntity.Account.VoucherProductUDF>();
                    cmd.CommandText = "select SNo,Label,FieldType,DefaultValue,DropDownList,IsMandatory,RefLedgerId,FieldAfter,Name,Formula,Source, ColWidth ,CanEditable  from tbl_ProductWiseUDF(nolock)  U where U.ProductId=@ProductId ";
                    reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        Dynamic.BusinessEntity.Account.VoucherProductUDF beData1 = new BusinessEntity.Account.VoucherProductUDF();
                        if (!(reader[0] is System.DBNull)) beData1.SNo = reader.GetInt32(0);
                        if (!(reader[1] is System.DBNull)) beData1.Label = reader.GetString(1);
                        if (!(reader[2] is System.DBNull)) beData1.FieldType = (Dynamic.BusinessEntity.Setup.DATATYPES)reader.GetInt32(2);
                        if (!(reader[3] is System.DBNull)) beData1.DefaultValue = reader.GetString(3);
                        if (!(reader[4] is System.DBNull)) beData1.DropDownList = reader.GetString(4);
                        if (!(reader[5] is System.DBNull)) beData1.IsMandatory = reader.GetBoolean(5);
                        if (!(reader[6] is System.DBNull)) beData1.RefLedgerId = reader.GetInt32(6);
                        if (!(reader[7] is System.DBNull)) beData1.FieldAfter = reader.GetInt32(7);
                        if (!(reader[8] is System.DBNull)) beData1.Name = reader.GetString(8);
                        if (!(reader[9] is System.DBNull)) beData1.Formula = reader.GetString(9);
                        if (!(reader[10] is System.DBNull)) beData1.Source = reader.GetString(10);
                        if (!(reader[11] is System.DBNull)) beData1.ColWidth = reader.GetInt32(11);
                        if (!(reader[12] is System.DBNull)) beData1.CanEditable = reader.GetBoolean(12);

                        if (beData1.ColWidth == 0)
                            beData1.ColWidth = 3;

                        if (beData1.SNo > 0 && !string.IsNullOrEmpty(beData1.Label))
                            beData.UDFColl.Add(beData1);

                    }
                    reader.Close();

                }
                catch { }

                cmd.CommandText = "select P.GodownId,P.RackId from tbl_ProductWiseRack(nolock) P where P.ProductId=@ProductId order by P.SNo";
                reader = cmd.ExecuteReader();
                beData.DefaultRackColl = new List<BusinessEntity.Inventory.ProductWiseRack>();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.ProductWiseRack ledData = new BusinessEntity.Inventory.ProductWiseRack();
                    if (!(reader[0] is System.DBNull)) ledData.GodownId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) ledData.RackId = reader.GetInt32(1);
                    beData.DefaultRackColl.Add(ledData);
                }
                reader.Close();



            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public void getProductOpeningDetailsOnly(ref Dynamic.BusinessEntity.Inventory.Product beData)
        {
            dal.OpenConnection();

            try
            {

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                cmd.CommandText = "select OpeningQty,OpeningRate,OpeningAmount,PurchaseCCRate,SalesCCRate from tbl_Product P where P.ProductId=@ProductId";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    if (!(reader[0] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[0]); 
                    if (!(reader[1] is System.DBNull)) beData.OpeningRate = Convert.ToDouble(reader[1]); 
                    if (!(reader[2] is System.DBNull)) beData.OpeningAmount = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.PurchaseCCRate = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.SalesCCRate = Convert.ToDouble(reader[4]); 
                }
                reader.Close();

                cmd.CommandText = "select OD.GodownId,OD.Quantity,OD.UnitId,OD.Rate,OD.Amount,G.Name as GodownName,U.Name as UnitName,OD.RegdNo,OD.EngineNo,OD.ChassisNo,OD.Model,OD.CodeNo,OD.Color,OD.KeyNo,OD.MFGYear,OD.Type,EXPDate,MFGDate,Batch from  tbl_ProductOpeningDetails OD inner join TBL_GODOWN G on G.GodownId=OD.GodownId inner join TBL_UNIT U on U.UnitId=OD.UnitId where OD.ProductId=@ProductId order by OD.LNo ";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.StockItemOpeningDetails open = new BusinessEntity.Inventory.StockItemOpeningDetails();
                    if (!(reader[0] is System.DBNull)) open.GodownId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) open.Quantity = Convert.ToDouble(reader[1]); ;
                    if (!(reader[2] is System.DBNull)) open.UnitId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) open.Rate = Convert.ToDouble(reader[3]); ;
                    if (!(reader[4] is System.DBNull)) open.Amount = Convert.ToDouble(reader[4]); ;
                    if (!(reader[5] is System.DBNull)) open.GodownName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) open.UnitName = reader.GetString(6);

                    //RegdNo,EngineNo,ChassisNo,Mode,CodeNo,Color,KeyNo,MFGYear,Type
                    if (!(reader[7] is System.DBNull)) open.RegdNo = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) open.EngineNo = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) open.ChassisNo = reader.GetString(9);
                    if (!(reader[10] is System.DBNull)) open.Model = reader.GetString(10);
                    if (!(reader[11] is System.DBNull)) open.CodeNo = reader.GetString(11);
                    if (!(reader[12] is System.DBNull)) open.Color = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) open.KeyNo = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) open.MFGYear = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) open.Type = reader.GetString(15);

                    if (!(reader[16] is System.DBNull)) open.EXPDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) open.MFGDate = reader.GetDateTime(17);
                    if (!(reader[18] is System.DBNull)) open.Batch = reader.GetString(18);

                    beData.OpeningColl.Add(open);
                }
                reader.Close();

                cmd.CommandText = "select TranId,UDFId,Value,AlterNetValue from tbl_UDFProduct  CD where CD.TranId=@ProductId ";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    UserDefineField ledData = new UserDefineField();
                    if (!(reader[0] is System.DBNull)) ledData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) ledData.UDFId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) ledData.Value = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) ledData.AlterNetValue = reader.GetString(3);
                    beData.UserDefineFieldsColl.Add(ledData);
                }
                reader.Close();

            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }
        public Dynamic.BusinessEntity.Inventory.Product getProductByRowNumber(long rowNum)
        {
            dal.OpenConnection();

            try
            {
//                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText(@"
//                with Product as
//                (
//                  select P.ProductId,P.AutoNumber,P.Name,P.Alias,P.Code,P.[Description],P.ProductGroupId,P.ProductCategoriesId,P.ProductTypeId,P.ProductCompanyId,P.BaseUnitId,P.ActiveAlternativeUnit,P.PartNo,P.PartNoAlias,P.Remarks,P.CostingMethod,P.MarketValuationMethod,P.VatRate,P.IgnoreNegativeBalance,P.SetStandardRate,P.SetGodownWiseOpening,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.OpeningQty,P.OpeningRate,P.OpeningAmount,P.TreatAllSalesAsNewManufacture,P.TreatAllPurchaseAsConsumed,P.TreatllRejectionInwardAsScraped,PG.Name as ProductGroupName,P.IsActive,P.CanEditRate,P.IsFixedProduct,EXDutyRate,ROW_NUMBER() over (order by P.ProductId) as RowNumber from tbl_Product P inner join TBL_PRODUCTGROUP PG on PG.ProductGroupId=P.ProductGroupId
//                )select P.ProductId,P.AutoNumber,P.Name,P.Alias,P.Code,P.[Description],P.ProductGroupId,P.ProductCategoriesId,P.ProductTypeId,P.ProductCompanyId,P.BaseUnitId,P.ActiveAlternativeUnit,P.PartNo,P.PartNoAlias,P.Remarks,P.CostingMethod,P.MarketValuationMethod,P.VatRate,P.IgnoreNegativeBalance,P.SetStandardRate,P.SetGodownWiseOpening,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.OpeningQty,P.OpeningRate,P.OpeningAmount,P.TreatAllSalesAsNewManufacture,P.TreatAllPurchaseAsConsumed,P.TreatllRejectionInwardAsScraped,ProductGroupName,P.IsActive,P.CanEditRate,P.IsFixedProduct,EXDutyRate from Product P where P.RowNumber=" + rowNum.ToString());

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.AddWithValue("@RowNumber", rowNum);
                cmd.CommandText = "sp_GetProductRowWise";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Description = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ProductCategoriesId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.ProductTypeId = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.ProductCompanyId = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.ActiveAlternativeUnit = reader.GetBoolean(11);
                    if (!(reader[12] is System.DBNull)) beData.PartNo = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.PartNoAlias = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.Remarks = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.CostingMethod = (Dynamic.BusinessEntity.Inventory.CostingMethods)reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.MarketValuationMethod = (Dynamic.BusinessEntity.Inventory.MarketValuationMethods)reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(18);
                    if (!(reader[19] is System.DBNull)) beData.SetStandardRate = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.SetGodownWiseOpening = reader.GetBoolean(20);
                    if (!(reader[21] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(21);
                    if (!(reader[22] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(22);
                    if (!(reader[23] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(23);
                    if (!(reader[24] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.OpeningRate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.OpeningAmount = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.TreatAllSalesAsNewManufacture = reader.GetBoolean(27);
                    if (!(reader[28] is System.DBNull)) beData.TreatAllPurchaseAsConsumed = reader.GetBoolean(28);
                    if (!(reader[29] is System.DBNull)) beData.TreatllRejectionInwardAsScraped = reader.GetBoolean(29);
                    if (!(reader[30] is System.DBNull)) beData.ProductGroupName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.IsActive = reader.GetBoolean(31);
                    if (!(reader[32] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(32);
                    if (!(reader[33] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(33);
                    if (!(reader[34] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[34]);
                    reader.Close();
                    return beData;
                }

                return null;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public Dynamic.BusinessEntity.Inventory.Product getLastRowData(ref long count)
        {
            dal.OpenConnection();

            try
            {
                //System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select top 1 P.ProductId,P.AutoNumber,P.Name,P.Alias,P.Code,P.[Description],P.ProductGroupId,P.ProductCategoriesId,P.ProductTypeId,P.ProductCompanyId,P.BaseUnitId,P.ActiveAlternativeUnit,P.PartNo,P.PartNoAlias,P.Remarks,P.CostingMethod,P.MarketValuationMethod,P.VatRate,P.IgnoreNegativeBalance,P.SetStandardRate,P.SetGodownWiseOpening,P.MaintainBatchWise,P.UseMfgDate,P.UseExpDate,P.OpeningQty,P.OpeningRate,P.OpeningAmount,P.TreatAllSalesAsNewManufacture,P.TreatAllPurchaseAsConsumed,P.TreatllRejectionInwardAsScraped,PG.Name as ProductGroupName,P.IsActive,P.CanEditRate,P.IsFixedProduct,EXDutyRate from tbl_Product P inner join TBL_PRODUCTGROUP PG on PG.ProductGroupId=P.ProductGroupId order by P.ProductId desc ");
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", Dynamic.BusinessEntity.Global.GlobalObject.CurrentUser.UserId);
                cmd.Parameters.Add("@RowNumber", System.Data.SqlDbType.Int);
                cmd.Parameters[1].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "sp_GetProductLastRow";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Description = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ProductCategoriesId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.ProductTypeId = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.ProductCompanyId = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.ActiveAlternativeUnit = reader.GetBoolean(11);
                    if (!(reader[12] is System.DBNull)) beData.PartNo = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.PartNoAlias = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.Remarks = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.CostingMethod = (Dynamic.BusinessEntity.Inventory.CostingMethods)reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.MarketValuationMethod = (Dynamic.BusinessEntity.Inventory.MarketValuationMethods)reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(18);
                    if (!(reader[19] is System.DBNull)) beData.SetStandardRate = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.SetGodownWiseOpening = reader.GetBoolean(20);
                    if (!(reader[21] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(21);
                    if (!(reader[22] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(22);
                    if (!(reader[23] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(23);
                    if (!(reader[24] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.OpeningRate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.OpeningAmount = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.TreatAllSalesAsNewManufacture = reader.GetBoolean(27);
                    if (!(reader[28] is System.DBNull)) beData.TreatAllPurchaseAsConsumed = reader.GetBoolean(28);
                    if (!(reader[29] is System.DBNull)) beData.TreatllRejectionInwardAsScraped = reader.GetBoolean(29);
                    if (!(reader[30] is System.DBNull)) beData.ProductGroupName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.IsActive = reader.GetBoolean(31);
                    if (!(reader[32] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(32);
                    if (!(reader[33] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(33);
                    if (!(reader[34] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[34]);
                    reader.Close();
                    //count = dal.GetTotalRows("tbl_Product");
                    count = Convert.ToInt32(cmd.Parameters[1].Value);
                    return beData;
                }

                return null;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public void UpdateAllProductStatus(Dynamic.BusinessEntity.Inventory.ProductCollections dataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                foreach (Dynamic.BusinessEntity.Inventory.Product beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
                    cmd.CommandText = "update tbl_Product set IsActive=@IsActive where ProductId=@ProductId";
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public ResponeValues DelPartyWiseProductRate(int UserId, int LedgerId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
                cmd.CommandText = "insert into tbl_PartyWiseProductRate_Log(LedgerId,ProductId,ApplicableFrom,PurchaseRate,SellRate,CreateBY,LogDateTime) select LedgerId,ProductId,ApplicableFrom,PurchaseRate,SellRate,CreateBY,LogDateTime from tbl_PartyWiseProductRate PP where PP.LedgerId=@LedgerId";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "delete from tbl_PartyWiseProductRate where LedgerId=@LedgerId";
                cmd.ExecuteNonQuery();

                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues SavePartyWiseProductRate(int UserId, Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                var query = from dc in dataColl
                            group dc by dc.LedgerId into g
                            select new
                            {
                                LedgerId = g.Key,
                            };

                foreach(var q in query)
                {                    
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@LedgerId", q.LedgerId);                    
                    cmd.CommandText = "insert into tbl_PartyWiseProductRate_Log(LedgerId,ProductId,ApplicableFrom,PurchaseRate,SellRate,CreateBY,LogDateTime) select LedgerId,ProductId,ApplicableFrom,PurchaseRate,SellRate,CreateBY,LogDateTime from tbl_PartyWiseProductRate PP where PP.LedgerId=@LedgerId";
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = "delete from tbl_PartyWiseProductRate where LedgerId=@LedgerId";
                    cmd.ExecuteNonQuery();

                }

                foreach (Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData in dataColl)
                {
                    if (beData.ProductId > 0)
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                        cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
                        cmd.Parameters.AddWithValue("@PurchaseRate", beData.PurchaseRate);
                        cmd.Parameters.AddWithValue("@SellRate", beData.SellRate);
                        cmd.Parameters.AddWithValue("@CreateBY", UserId);

                        if (beData.ApplicableFrom.HasValue)
                            cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom.Value);
                        else
                            cmd.Parameters.AddWithValue("@ApplicableFrom", DateTime.Today);

                        cmd.CommandText = "insert into tbl_PartyWiseProductRate(CreateBY,LedgerId,ProductId,PurchaseRate,SellRate,ApplicableFrom) values(@CreateBY,@LedgerId,@ProductId,@PurchaseRate,@SellRate,@ApplicableFrom); ";
                        cmd.ExecuteNonQuery();
                    }
                  
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }
        public ResponeValues SaveBranchWiseProductRateList(Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl,DateTime applicableFrom)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            { 

                foreach (Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
                    cmd.Parameters.AddWithValue("@BaseUnitId", beData.BaseUnitId);
                    cmd.Parameters.AddWithValue("@Rate", beData.SellRate);
                    cmd.Parameters.AddWithValue("@ApplicableFrom", applicableFrom);
                    cmd.CommandText = "insert into tbl_BranchWiseSellingRate(ProductId,BranchId,BaseUnitId,Rate,ApplicableFrom,Rate2,Rate3,Rate4,Rate5) values(@ProductId,@BranchId,@BaseUnitId,@Rate,@ApplicableFrom,0,0,0,0)";
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Branch Wise Sales Rate Updated"; 
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues SaveApiProductList(Dynamic.BusinessEntity.Inventory.ProductCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            { 
                System.Data.DataTable dt = new System.Data.DataTable();
                dt.TableName = "tmpApi_Product";
                dt.Columns.Add(new System.Data.DataColumn("Code", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("Name", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("Alias", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("PartNo", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("ProductCategoriesName", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("IsActive", typeof(bool)));
                dt.Columns.Add(new System.Data.DataColumn("ProductTypeName", typeof(string)));
                dt.Columns.Add(new System.Data.DataColumn("BaseUnit", typeof(string)));

                foreach (var dc in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();
                    dr["Code"] = IsNull(dc.Code);
                    dr["Name"] = IsNull(dc.Name);
                    dr["Alias"] = IsNull(dc.Alias);
                    dr["PartNo"] = IsNull(dc.PartNo);
                    dr["ProductCategoriesName"] = IsNull(dc.ProductCategoriesName);
                    dr["IsActive"] = dc.IsActive;
                    dr["ProductTypeName"] = IsNull(dc.ProductTypeName);
                    dr["BaseUnit"] = IsNull(dc.BaseUnitName);
                    dt.Rows.Add(dr);
                }
                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tmpApi_Product";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);
                 
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Import";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues SaveBranchWiseProductRateList(Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {

                //foreach (Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData in dataColl)
                //{
                //    cmd.Parameters.Clear();
                //    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                //    cmd.Parameters.AddWithValue("@BranchId", beData.BranchId);
                //    cmd.Parameters.AddWithValue("@BaseUnitId", beData.BaseUnitId);
                //    cmd.Parameters.AddWithValue("@Rate", beData.SellRate);
                //    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                //    cmd.CommandText = "insert into tbl_BranchWiseSellingRate(ProductId,BranchId,BaseUnitId,Rate,ApplicableFrom,Rate2,Rate3,Rate4,Rate5) values(@ProductId,@BranchId,@BaseUnitId,@Rate,@ApplicableFrom,0,0,0,0)";
                //    cmd.ExecuteNonQuery();
                //}
                 
                System.Data.DataTable dt = new System.Data.DataTable();
                dt.TableName = "tbl_BranchWiseSellingRate";
                dt.Columns.Add(new System.Data.DataColumn("ProductId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("BranchId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("BaseUnitId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("Rate", typeof(double)));
                dt.Columns.Add(new System.Data.DataColumn("ApplicableFrom", typeof(DateTime))); 
                foreach (var dc in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();
                    dr["ProductId"] = dc.ProductId;
                    dr["BranchId"] = dc.BranchId;
                    dr["BaseUnitId"] = dc.BaseUnitId;
                    dr["Rate"] = dc.SellRate;
                    dr["ApplicableFrom"] = dc.ApplicableFrom; 
                    dt.Rows.Add(dr);
                }
                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tbl_BranchWiseSellingRate";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);


                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Branch Wise Sales Rate Updated";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }
        public ResponeValues SaveProductSalesRateList(Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                //foreach (Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData in dataColl)
                //{
                //    cmd.Parameters.Clear();
                //    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId); 
                //    cmd.Parameters.AddWithValue("@UnitId", beData.BaseUnitId);
                //    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                //    cmd.Parameters.AddWithValue("@Rate", beData.SellRate);
                //    cmd.CommandText = "insert into tbl_ProductSellingRate(ProductId,UnitId,ApplicableFrom,Rate) values(@ProductId,@UnitId,@ApplicableFrom,@Rate)";
                //    cmd.ExecuteNonQuery();
                //}

                System.Data.DataTable dt = new System.Data.DataTable();
                dt.TableName = "tbl_ProductSellingRate";
                dt.Columns.Add(new System.Data.DataColumn("ProductId", typeof(int))); 
                dt.Columns.Add(new System.Data.DataColumn("UnitId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("Rate", typeof(double)));
                dt.Columns.Add(new System.Data.DataColumn("ApplicableFrom", typeof(DateTime)));
                foreach (var dc in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();
                    dr["ProductId"] = dc.ProductId;              
                    dr["UnitId"] = dc.BaseUnitId;
                    dr["Rate"] = dc.SellRate;

                    if(dc.ApplicableFrom.HasValue)
                        dr["ApplicableFrom"] = dc.ApplicableFrom;
                    else
                        dr["ApplicableFrom"] = DateTime.Now;

                    dt.Rows.Add(dr);
                }
                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tbl_ProductSellingRate";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Clear();
                cmd.CommandText = "usp_UpdateProductRate";
                cmd.ExecuteNonQuery();


                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Sales Rate Updated";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues SaveProductPurchaseRateList(Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                //foreach (Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData in dataColl)
                //{
                //    cmd.Parameters.Clear();
                //    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId); 
                //    cmd.Parameters.AddWithValue("@UnitId", beData.BaseUnitId);
                //    cmd.Parameters.AddWithValue("@ApplicableFrom", beData.ApplicableFrom);
                //    cmd.Parameters.AddWithValue("@Rate", beData.SellRate);
                //    cmd.CommandText = "insert into tbl_ProductSellingRate(ProductId,UnitId,ApplicableFrom,Rate) values(@ProductId,@UnitId,@ApplicableFrom,@Rate)";
                //    cmd.ExecuteNonQuery();
                //}

                System.Data.DataTable dt = new System.Data.DataTable();
                dt.TableName = "tbl_ProductCostRate";
                dt.Columns.Add(new System.Data.DataColumn("ProductId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("UnitId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("Rate", typeof(double)));
                dt.Columns.Add(new System.Data.DataColumn("ApplicableFrom", typeof(DateTime)));
                foreach (var dc in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();
                    dr["ProductId"] = dc.ProductId;
                    dr["UnitId"] = dc.BaseUnitId;
                    dr["Rate"] = dc.SellRate;
                    dr["ApplicableFrom"] = dc.ApplicableFrom;
                    dt.Rows.Add(dr);
                }
                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tbl_ProductCostRate";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Clear();
                cmd.CommandText = "usp_UpdateProductRate";
                cmd.ExecuteNonQuery();

                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Purchase Rate Updated";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }


        public ResponeValues SaveProductMRPRateList(Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                
                System.Data.DataTable dt = new System.Data.DataTable();
                dt.TableName = "tbl_ProductMRPRate";
                dt.Columns.Add(new System.Data.DataColumn("ProductId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("UnitId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("Rate", typeof(double)));
                dt.Columns.Add(new System.Data.DataColumn("ApplicableFrom", typeof(DateTime)));
                foreach (var dc in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();
                    dr["ProductId"] = dc.ProductId;
                    dr["UnitId"] = dc.BaseUnitId;
                    dr["Rate"] = dc.SellRate;

                    if (dc.ApplicableFrom.HasValue)
                        dr["ApplicableFrom"] = dc.ApplicableFrom;
                    else
                        dr["ApplicableFrom"] = DateTime.Now;

                    dt.Rows.Add(dr);
                }
                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tbl_ProductMRPRate";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Clear();
                cmd.CommandText = "usp_UpdateProductRate";
                cmd.ExecuteNonQuery();


                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product MRP Updated";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues SaveProductTradeRateList(Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {

                System.Data.DataTable dt = new System.Data.DataTable();
                dt.TableName = "tbl_ProductTradeRate";
                dt.Columns.Add(new System.Data.DataColumn("ProductId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("UnitId", typeof(int)));
                dt.Columns.Add(new System.Data.DataColumn("Rate", typeof(double)));
                dt.Columns.Add(new System.Data.DataColumn("ApplicableFrom", typeof(DateTime)));
                foreach (var dc in dataColl)
                {
                    System.Data.DataRow dr = dt.NewRow();
                    dr["ProductId"] = dc.ProductId;
                    dr["UnitId"] = dc.BaseUnitId;
                    dr["Rate"] = dc.SellRate;

                    if (dc.ApplicableFrom.HasValue)
                        dr["ApplicableFrom"] = dc.ApplicableFrom;
                    else
                        dr["ApplicableFrom"] = DateTime.Now;

                    dt.Rows.Add(dr);
                }
                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tbl_ProductTradeRate";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Clear();
                cmd.CommandText = "usp_UpdateProductRate";
                cmd.ExecuteNonQuery();


                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Trade Rate Updated";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections getBranchWiseProductRateList(int BranchId,int ProductGroupId, DateTime applicableFrom)
        {
            dal.OpenConnection();
            Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl = new BusinessEntity.Inventory.PartyWiseProductRateCollections();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.AddWithValue("@BranchId", BranchId);
                cmd.Parameters.AddWithValue("@ProductGroupId", ProductGroupId);
                cmd.Parameters.AddWithValue("@ApplicableFrom", applicableFrom);
                cmd.CommandText = "sp_GetBranchWiseProductRateList";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                System.Data.SqlClient.SqlDataReader reader= cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData=new BusinessEntity.Inventory.PartyWiseProductRate();
                    beData.ProductId = reader.GetInt32(0);                    
                    if (!(reader[1] is System.DBNull)) beData.SellRate = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.BaseUnitId = Convert.ToInt32(reader[2]);
                    dataColl.Add(beData);
                    
                }
                reader.Close();

                return dataColl;
            }
            catch (System.Data.SqlClient.SqlException ee)
            {            
                throw ee;
            }
            catch (Exception ee)
            {             
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        //public void DeletePartyWiseProductRate(int LedgerId)
        //{
        //    dal.OpenConnection();
        //    dal.BeginTransaction();
        //    System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

        //    try
        //    {
        //        cmd.CommandText = "delete from tbl_PartyWiseProductRate where LedgerId=" + LedgerId.ToString();
        //        cmd.ExecuteNonQuery();                
        //        dal.CommitTransaction();
        //    }
        //    catch (System.Data.SqlClient.SqlException ee)
        //    {
        //        dal.RollbackTransaction();
        //        throw ee;
        //    }
        //    catch (Exception ee)
        //    {
        //        dal.RollbackTransaction();
        //        throw ee;
        //    }
        //    finally
        //    {
        //        dal.CloseConnection();
        //    }
        //}
        public Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections getPartyWiseProductRate(int UserId,int LedgerId)
        {
            Dynamic.BusinessEntity.Inventory.PartyWiseProductRateCollections dataColl = new BusinessEntity.Inventory.PartyWiseProductRateCollections();

            dal.OpenConnection();

            try
            {

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.CommandText = @"
;with tblProductRate
as
(
select row_number() over(partition by PP.ProductId order by PP.ApplicableFrom desc,PP.LogDateTime desc) as SNo, PP.ProductId,PP.PurchaseRate,PP.SellRate,PP.ApplicableFrom from tbl_PartyWiseProductRate(nolock) PP where LedgerId=" + LedgerId.ToString() + @"
)
select ProductId,PurchaseRate,SellRate,ApplicableFrom from tblProductRate where SNO=1";


                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();// dal.ExecuteDataReaderText("select ProductId,PurchaseRate,SellRate from tbl_PartyWiseProductRate where LedgerId=" + LedgerId.ToString());
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.PartyWiseProductRate beData = new BusinessEntity.Inventory.PartyWiseProductRate();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.PurchaseRate = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.SellRate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.ApplicableFrom = Convert.ToDateTime(reader[3]);
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
                return dataColl;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }

        }

        public void UpdateProductGroupDetails(Dynamic.BusinessEntity.Inventory.ProductCollections dataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                foreach (Dynamic.BusinessEntity.Inventory.Product beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.Parameters.AddWithValue("@ProductGroupId", beData.ProductGroupId);
                    cmd.Parameters.AddWithValue("@ProductCategoriesId", beData.ProductCategoriesId);
                    cmd.Parameters.AddWithValue("@ProductTypeId", beData.ProductTypeId);
                    cmd.Parameters.AddWithValue("@Code", beData.Code);

                    if(beData.ProductDivisionId==0)
                        cmd.Parameters.AddWithValue("@ProductDivisionId", DBNull.Value);
                    else
                        cmd.Parameters.AddWithValue("@ProductDivisionId", beData.ProductDivisionId);

                    //ProductGroupId,ProductCategoriesId,ProductTypeId                    
                    cmd.CommandText = "update tbl_Product set ProductDivisionId=@ProductDivisionId,Code=@Code,ProductGroupId=@ProductGroupId,ProductCategoriesId=@ProductCategoriesId,ProductTypeId=@ProductTypeId   where ProductId=@ProductId";
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public void UpdateOpening(Dynamic.BusinessEntity.Inventory.ProductCollections dataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
           
            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                foreach (Dynamic.BusinessEntity.Inventory.Product beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.Parameters.AddWithValue("@OpeningAmount", beData.OpeningAmount);
                    cmd.Parameters.AddWithValue("@OpeningQty", beData.OpeningQty);
                    cmd.Parameters.AddWithValue("@OpeningRate", beData.OpeningRate);

                    cmd.CommandText = "  delete from tbl_ProductOpeningDetails where ProductId=@ProductId ; ";
                    cmd.ExecuteNonQuery();

                    cmd.CommandText = "update tbl_Product set OpeningAmount=@OpeningAmount,OpeningQty=@OpeningQty,OpeningRate=@OpeningRate where ProductId=@ProductId";
                    cmd.ExecuteNonQuery();

                    SaveGodownWiseOpening(beData.ProductId, beData.OpeningColl);
                }
                dal.CommitTransaction();

               
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
        public void UpdateBarCode(Dynamic.BusinessEntity.Inventory.ProductCollections dataColl)
        {
            dal.OpenConnection();
            dal.BeginTransaction();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                foreach (Dynamic.BusinessEntity.Inventory.Product beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                    cmd.Parameters.AddWithValue("@BarCode", beData.Code);
                    
                    cmd.CommandText = "insert into tbl_ProductCode(ProductId,BarCode) values(@ProductId,@BarCode);";
                    cmd.ExecuteNonQuery();
                    
                }
                dal.CommitTransaction();


            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }

        public bool DeletePartyWiseProductRate(string PPTranId)
        {
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_PartyWiseProductRate where PPTranId in (" + PPTranId + ")";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();

                return true;

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                return false;
            }
            finally
            {
                dal.CloseConnection();
            }

        }

        public APIEnitity.Inventory.ProductCollections getAutoCompleteProductList(int UserId, string searchBy, string searchValue)
        {
            APIEnitity.Inventory.ProductCollections dataColl = new APIEnitity.Inventory.ProductCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@searchBy", searchBy);
                cmd.Parameters.AddWithValue("@searchValue", searchValue);
                cmd.CommandText = "sp_GetAutoCompleteProductListForAPI";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    APIEnitity.Inventory.Product beData = new APIEnitity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.ProductGroup = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.UnitId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.Unit = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) beData.PartNo = reader.GetString(8);
                    
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.ResponseMSG = ee.Message;
                dataColl.IsSuccess = false;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;
        }

        public ReportEntity.Inventory.ProductForAbbreviatedCollections getProductListForAbbreviatedInvoice(int UserId,int TypeOfProduct)
        {
            ReportEntity.Inventory.ProductForAbbreviatedCollections dataColl = new ReportEntity.Inventory.ProductForAbbreviatedCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId); 
                cmd.Parameters.AddWithValue("@TypeOfProduct", TypeOfProduct);
                cmd.CommandText = "usp_GetProductForAbbreviatedInvoice";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    ReportEntity.Inventory.ProductForAbbreviated beData = new ReportEntity.Inventory.ProductForAbbreviated();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);                    
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Alias = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Code = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Description = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.GroupName = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.UnitId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.UnitName = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) beData.SalesRate = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) beData.SalesLedgerId = Convert.ToInt32(reader[9]);
                    if (!(reader[10] is System.DBNull)) beData.QtyNoOfDecimalPlaces = Convert.ToInt32(reader[10]);
                    if (!(reader[11] is System.DBNull)) beData.RateNoOfDecimalPlaces = Convert.ToInt32(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.AmountNoOfDecimalPlaces = Convert.ToInt32(reader[12]);
                    if (!(reader[13] is System.DBNull)) beData.PurchaseLedgerId = Convert.ToInt32(reader[13]);
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.ResponseMSG = ee.Message;
                dataColl.IsSuccess = false;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;
        }
        public Dynamic.BusinessEntity.Inventory.Product getProductById(int UserId, int ProductId)
        {
            Dynamic.BusinessEntity.Inventory.Product beData = new BusinessEntity.Inventory.Product();
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.CommandText = "sp_GetProductById";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    beData = new BusinessEntity.Inventory.Product();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Code = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Description = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.ProductGroupId = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ProductCategoriesId = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.ProductTypeId = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.ProductCompanyId = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.BaseUnitId = reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.ActiveAlternativeUnit = reader.GetBoolean(11);
                    if (!(reader[12] is System.DBNull)) beData.PartNo = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.PartNoAlias = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.Remarks = reader.GetString(14);
                    if (!(reader[15] is System.DBNull)) beData.CostingMethod = (Dynamic.BusinessEntity.Inventory.CostingMethods)reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.MarketValuationMethod = (Dynamic.BusinessEntity.Inventory.MarketValuationMethods)reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.VatRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.IgnoreNegativeBalance = reader.GetBoolean(18);
                    if (!(reader[19] is System.DBNull)) beData.SetStandardRate = reader.GetBoolean(19);
                    if (!(reader[20] is System.DBNull)) beData.SetGodownWiseOpening = reader.GetBoolean(20);
                    if (!(reader[21] is System.DBNull)) beData.MaintainBatchWise = reader.GetBoolean(21);
                    if (!(reader[22] is System.DBNull)) beData.UseMfgDate = reader.GetBoolean(22);
                    if (!(reader[23] is System.DBNull)) beData.UseExpDate = reader.GetBoolean(23);
                    if (!(reader[24] is System.DBNull)) beData.OpeningQty = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is System.DBNull)) beData.OpeningRate = Convert.ToDouble(reader[25]);
                    if (!(reader[26] is System.DBNull)) beData.OpeningAmount = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is System.DBNull)) beData.TreatAllSalesAsNewManufacture = reader.GetBoolean(27);
                    if (!(reader[28] is System.DBNull)) beData.TreatAllPurchaseAsConsumed = reader.GetBoolean(28);
                    if (!(reader[29] is System.DBNull)) beData.TreatllRejectionInwardAsScraped = reader.GetBoolean(29);
                    if (!(reader[30] is System.DBNull)) beData.ProductGroupName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.IsActive = reader.GetBoolean(31);
                    if (!(reader[32] is System.DBNull)) beData.CanEditRate = reader.GetBoolean(32);
                    if (!(reader[33] is System.DBNull)) beData.IsFixedProduct = reader.GetBoolean(33);
                    if (!(reader[34] is System.DBNull)) beData.EXDutyRate = Convert.ToDouble(reader[34]);
                    if (!(reader[35] is System.DBNull)) beData.PhotoPath = reader.GetString(35);
                    if (!(reader[36] is System.DBNull)) beData.IsTaxable = reader.GetBoolean(36);
                    if (!(reader[37] is System.DBNull)) beData.CanEditRatePurchase = reader.GetBoolean(37);
                    if (!(reader[38] is System.DBNull)) beData.RateOf = Convert.ToDouble(reader[38]);
                    if (!(reader[39] is System.DBNull)) beData.LossRate = Convert.ToDouble(reader[39]);
                    if (!(reader[40] is System.DBNull)) beData.DealerCommissionRate = Convert.ToDouble(reader[40]);
                    if (!(reader[41] is System.DBNull)) beData.SankuchanLoss = Convert.ToDouble(reader[41]);
                    if (!(reader[42] is System.DBNull)) beData.ActivitiesLoss = Convert.ToDouble(reader[42]);
                    if (!(reader[43] is System.DBNull)) beData.SankuchanCostCenterId = Convert.ToInt32(reader[43]);
                    if (!(reader[44] is System.DBNull)) beData.ActivitiesCostCenterId = Convert.ToInt32(reader[44]);

                    if (!(reader[45] is System.DBNull)) beData.IncomeLedgerId = Convert.ToInt32(reader[45]);
                    if (!(reader[46] is System.DBNull)) beData.ExpensesLedgerId = Convert.ToInt32(reader[46]);
                    if (!(reader[47] is System.DBNull)) beData.ValidateFixedProduct = Convert.ToBoolean(reader[47]);
                    if (!(reader[48] is System.DBNull)) beData.AllowManualInputFixedProduct = Convert.ToBoolean(reader[48]);
                    if (!(reader[49] is System.DBNull)) beData.ActiveSerialNo = Convert.ToBoolean(reader[49]);
                    //Added by Simran
                    if (!(reader[50] is System.DBNull)) beData.VideoLink = reader.GetString(50);
                    if (!(reader[52] is System.DBNull)) beData.HerbsId = reader.GetInt32(51);
                    //End

                    beData.IsSuccess = true;
                    beData.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    beData.IsSuccess = false;
                    beData.ResponseMSG = "No Data Found";
                }

                reader.Close();
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return beData;
        }

        public ResponeValues getIdByCode(int UserId, string code)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@Code", code);
                cmd.CommandText = "select top 1 P.ProductId from tbl_Product(nolock) P where P.Code=@Code";
                var obj = cmd.ExecuteScalar();
                if (!(obj is DBNull))
                {
                    resVal.RId = Convert.ToInt32(obj);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Product Not Found";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues getIdByName(int UserId, string code)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@Code", code);
                cmd.CommandText = "select top 1 P.ProductId from tbl_Product(nolock) P where P.Name=@Code";
                var obj = cmd.ExecuteScalar();
                if (!(obj is DBNull))
                {
                    resVal.RId = Convert.ToInt32(obj);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Product Not Found";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }


        public Dynamic.BusinessEntity.Account.LedgerCollections getPreferedSuppliers(int UserId, int ProductId)
        {
            Dynamic.BusinessEntity.Account.LedgerCollections dataColl = new BusinessEntity.Account.LedgerCollections();
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.CommandText = "usp_GetProductWiseSupplier";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Account.Ledger beData = new BusinessEntity.Account.Ledger();
                    if (!(reader[0] is System.DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Alias = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Code = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Address = reader.GetString(4);

                    dataColl.Add(beData);
                }
               
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public ResponeValues UpdateAPISalesPrice(int UserId, System.Data.DataTable dt)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {                
                cmd.CommandText = "truncate table tbl_APISalesPrice";
                cmd.ExecuteNonQuery();

                System.Data.SqlClient.SqlBulkCopy objbulk = new System.Data.SqlClient.SqlBulkCopy(dal.Connection, System.Data.SqlClient.SqlBulkCopyOptions.Default, dal.Transaction);
                objbulk.DestinationTableName = "tbl_APISalesPrice";
                foreach (System.Data.DataColumn c in dt.Columns)
                {
                    objbulk.ColumnMappings.Add(c.ToString(), c.ToString());
                }
                objbulk.WriteToServer(dt);


                dal.CommitTransaction();

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_UpdateAPISalesPrice";
                cmd.ExecuteNonQuery();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS+"("+dt.Rows.Count.ToString()+")";

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues UpdateProduct_Query(int UserId, List<Dynamic.BusinessEntity.Inventory.UpdateProductQuery> dataColl, string query)
        {

            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();

                    cmd.Parameters.AddWithValue("@Name", IsDBNull(beData.Name));
                    cmd.Parameters.AddWithValue("@Alias", IsDBNull(beData.Alias));
                    cmd.Parameters.AddWithValue("@Code", IsDBNull(beData.Code));
                    cmd.Parameters.AddWithValue("@HSCode", IsDBNull(beData.HSCode));

                    cmd.Parameters.AddWithValue("@Description", IsDBNull(beData.Description));
                    cmd.Parameters.AddWithValue("@PartNo", IsDBNull(beData.PartNo));
                    cmd.Parameters.AddWithValue("@PartNoAlias", IsDBNull(beData.PartAlias));
                    cmd.Parameters.AddWithValue("@PartRemarks", IsDBNull(beData.PartRemarks));
                    //cmd.Parameters.AddWithValue("@CanEditRate", IsDBNull(beData.CanEditRate));
                    cmd.Parameters.AddWithValue("@IgnoreNegative", IsDBNull(beData.IgnoreNegative));
                    cmd.Parameters.AddWithValue("@IsTaxable", IsDBNull(beData.IsTaxable));
                    cmd.Parameters.AddWithValue("@VatRate", IsDBNull(beData.VatRate));
                    cmd.Parameters.AddWithValue("@IsActive", IsDBNull(beData.IsActive));
                    cmd.Parameters.AddWithValue("@CanEditRate", IsDBNull(beData.CanEditRateSales));
                    cmd.Parameters.AddWithValue("@CanEditRatePurchase", IsDBNull(beData.CanEditRatePurchase));
                    cmd.Parameters.AddWithValue("@IsFixedProduct", IsDBNull(beData.IsFixedProduct));
                    cmd.Parameters.AddWithValue("@UseExpDate", IsDBNull(beData.UseExpDate));
                    cmd.Parameters.AddWithValue("@UseMfgDate", IsDBNull(beData.UseMfgDate));
                    cmd.Parameters.AddWithValue("@MaintainBatchWise", IsDBNull(beData.MaintainBatchWise));

                    cmd.Parameters.AddWithValue("@ProductGroupId", IsDBNull(beData.GroupId));
                    cmd.Parameters.AddWithValue("@ProductCategoriesId", IsDBNull(beData.ProductCategory));
                    cmd.Parameters.AddWithValue("@ProductTypeId", IsDBNull(beData.ProductType));
                    

                    cmd.Parameters.AddWithValue("@BaseUnitId", IsDBNull(beData.BaseUnit));
                    cmd.Parameters.AddWithValue("@PurchaseUnitId", IsDBNull(beData.PurchaseUnit));
                    cmd.Parameters.AddWithValue("@SalesUnitId", IsDBNull(beData.SalesUnit));
                    cmd.Parameters.AddWithValue("@ProfitMarginRate", IsDBNull(beData.ProfitMarginRate));

                    cmd.Parameters.AddWithValue("@Pur_MinRate", ZeroDBNull(beData.Pur_MinRate));
                    cmd.Parameters.AddWithValue("@Pur_MaxRate", ZeroDBNull(beData.Pur_MaxRate));
                    cmd.Parameters.AddWithValue("@Sal_MinRate", ZeroDBNull(beData.Sal_MinRate));
                    cmd.Parameters.AddWithValue("@Sal_MaxRate", ZeroDBNull(beData.Sal_MaxRate));

                    if(!string.IsNullOrEmpty(beData.ProductCompany))
                    cmd.Parameters.AddWithValue("@ProductCompanyId", IsDBNull(beData.ProductCompany));

                    if (!string.IsNullOrEmpty(beData.Shape))
                        cmd.Parameters.AddWithValue("@ProductShapeId", beData.Shape);
                    else
                        cmd.Parameters.AddWithValue("@ProductShapeId", DBNull.Value);

                    if (!string.IsNullOrEmpty(beData.Flavour))
                        cmd.Parameters.AddWithValue("@ProductFlavourId", beData.Flavour);
                    else
                        cmd.Parameters.AddWithValue("@ProductFlavourId", DBNull.Value);

                    if (!string.IsNullOrEmpty(beData.ProductDivision))
                        cmd.Parameters.AddWithValue("@ProductDivisionId", beData.ProductDivision);
                    else
                        cmd.Parameters.AddWithValue("@ProductDivisionId", DBNull.Value);


                    if (!string.IsNullOrEmpty(beData.WeightUnit))
                        cmd.Parameters.AddWithValue("@WeightUnitId", beData.WeightUnit);
                    else
                        cmd.Parameters.AddWithValue("@WeightUnitId", DBNull.Value);

                    if (!string.IsNullOrEmpty(beData.VolumUnit))
                        cmd.Parameters.AddWithValue("@VolumUnitId", beData.VolumUnit);
                    else
                        cmd.Parameters.AddWithValue("@VolumUnitId", DBNull.Value);


                    if (!string.IsNullOrEmpty(beData.IncomeLedger))
                        cmd.Parameters.AddWithValue("@IncomeLedgerId", beData.IncomeLedger);
                    else
                        cmd.Parameters.AddWithValue("@IncomeLedgerId", DBNull.Value);


                    if (!string.IsNullOrEmpty(beData.ExpensesLedger))
                        cmd.Parameters.AddWithValue("@ExpensesLedgerId", beData.ExpensesLedger);
                    else
                        cmd.Parameters.AddWithValue("@ExpensesLedgerId", DBNull.Value);

                    cmd.Parameters.AddWithValue("@WeightConv", IsDBNull(beData.WeightConv));
                    cmd.Parameters.AddWithValue("@VolumConv", IsDBNull(beData.VolumConv));

                    if (!string.IsNullOrEmpty(beData.DebtorType))
                        cmd.Parameters.AddWithValue("@DebtorTypeId", beData.DebtorType);
                    else
                        cmd.Parameters.AddWithValue("@DebtorTypeId", DBNull.Value);


                    if (!string.IsNullOrEmpty(beData.Color))
                        cmd.Parameters.AddWithValue("@ProductColorId", beData.Color);
                    else
                        cmd.Parameters.AddWithValue("@ProductColorId", DBNull.Value);
                    //select P.WeightConv,P.WeightUnitId,P.VolumConv,P.VolumUnitId,P.IncomeLedgerId,P.ExpensesLedgerId from tbl_Product P

                    if (!string.IsNullOrEmpty(beData.PurchaseLedgerName))
                        cmd.Parameters.AddWithValue("@PurchaseLedgerId", beData.PurchaseLedgerName);
                    else
                        cmd.Parameters.AddWithValue("@PurchaseLedgerId", DBNull.Value);

                    if (!string.IsNullOrEmpty(beData.SalesLedgerName))
                        cmd.Parameters.AddWithValue("@SalesLedgerId", beData.SalesLedgerName);
                    else
                        cmd.Parameters.AddWithValue("@SalesLedgerId", DBNull.Value);


                    cmd.Parameters.AddWithValue("@SNo",ZeroTo( beData.SNo));

                    int colLen = query.Split('@').Length - 2;
                    if (colLen > 1)
                    {
                        cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + " ; " + (string.IsNullOrEmpty(beData.Query) ? query : beData.Query);
                        cmd.ExecuteNonQuery();
                    }

                    if (beData.UserDefineFieldsColl != null && beData.ProductId>0)
                    {
                        foreach(var udf in beData.UserDefineFieldsColl)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@TranId", beData.ProductId);
                            cmd.Parameters.AddWithValue("@UDFId", udf.UDFId);
                            cmd.Parameters.AddWithValue("@Value", IsDBNull(udf.Value));
                            cmd.Parameters.AddWithValue("@AlterNetValue", IsDBNull(udf.AlterNetValue));
                            cmd.CommandText = @"if exists(select 1 from tbl_UDFProduct(nolock) P where P.TranId=@TranId and P.UDFId=@UDFId)
                                        begin
	                                        update top(1) tbl_UDFProduct set Value=@Value ,AlterNetValue=@AlterNetValue where TranId=@TranId and UDFId=@UDFId;
                                        end
                                        else
                                        begin
	                                        insert into tbl_UDFProduct(TranId,UDFId,Value,AlterNetValue) values(@TranId,@UDFId,@Value,@AlterNetValue)
                                        end";
                            cmd.ExecuteNonQuery();
                        }
                    }

                    if(beData.AlterNetUnitColl!=null && beData.AlterNetUnitColl.Count > 0)
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
                        cmd.CommandText = "delete from tbl_ProductAlternetUnit where ProductId=@ProductId";
                        cmd.ExecuteNonQuery();
                        SaveAlternetUnit(beData.ProductId, beData.AlterNetUnitColl);
                    }
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Details Update Success";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValues UpdatePhoto_Query(int UserId, List<Dynamic.BusinessEntity.Inventory.ImportProductPhoto> dataColl, string query)
        {

            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                foreach (var beData in dataColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@Code", beData.Code);
                    cmd.Parameters.AddWithValue("@PartNo", beData.PartNo);
                    cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);
                    cmd.Parameters.AddWithValue("@Name", beData.Name);
                    cmd.CommandText = "EXEC sp_set_session_context @key=N'UserId', @value=" + UserId.ToString() + " ; " + query;
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Photo Update Success";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValue ProductRatingView(int UserId,int ProductId, int Rating,string Remarks)
        {
            ResponeValue resVal = new ResponeValue();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.Parameters.AddWithValue("@Rating", Rating);
                cmd.Parameters.AddWithValue("@Remarks", Remarks);                
                cmd.CommandText = "insert into tbl_ProductReview(ProductId,Rating,Remarks,UserId) values(@ProductId,@Rating,@Remarks,@UserId);";
                cmd.ExecuteNonQuery();
                cmd.CommandText = @";with tmpPR
                                    as
                                    (
	                                    select avg(Rating) as Rating,@ProductId as ProductId from tbl_ProductReview where ProductId=@ProductId
                                    )
                                    update P set P.ReviewRating=PR.Rating from tbl_Product  P inner join tmpPR PR on PR.ProductId=P.ProductId";
                cmd.ExecuteNonQuery();  

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Rating Submitted Successfully";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {                
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
             
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public ResponeValue ProductQA(int UserId, int? ProductId, string Question, string QueName)
        {
            ResponeValue resVal = new ResponeValue();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            try
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", IsDBNull(ProductId));
                cmd.Parameters.AddWithValue("@Question", Question);
                cmd.Parameters.AddWithValue("@QueName", QueName);
                cmd.CommandText = "insert into tbl_ProductReviewQA(QueName,ProductId,Question,UserId) values(@QueName,@ProductId,@Question,@UserId);";
                cmd.ExecuteNonQuery();             

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Product Question Submitted Successfully";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {

                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;
        }

        public Dynamic.BusinessEntity.Inventory.SlabRateCollections getAllSlabProductRateList(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.SlabRateCollections dataColl = new BusinessEntity.Inventory.SlabRateCollections();

            dal.OpenConnection();

            try
            {

                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "select P.ProductId,P.SNo,P.FromQty,P.ToQty,P.Rate,P.Amount from tbl_ProductSlabSellingRate P order by P.ProductId,P.SNo";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();                
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.SlabRate beData = new BusinessEntity.Inventory.SlabRate();                    
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.SNo = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.FromQty = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) beData.ToQty = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.Rate = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.Amount = Convert.ToDouble(reader[5]);
                    dataColl.Add(beData);
                }
                reader.Close();

                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BusinessEntity.Inventory.ProductReviewCollections GetProductReview(int UserId,int? ProductId)
        {
            Dynamic.BusinessEntity.Inventory.ProductReviewCollections dataColl = new BusinessEntity.Inventory.ProductReviewCollections();
            dal.OpenConnection();
            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@ProductId", ProductId);
                cmd.CommandText = "usp_GetProductReview";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.ProductReview beData = new BusinessEntity.Inventory.ProductReview();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.Rating = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.ProductName = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.Remarks = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.RatedBy = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.ReviewDate = Convert.ToDateTime(reader[5]);
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BusinessEntity.Inventory.ProductReviewQACollections GetProductReviewQA(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductReviewQACollections dataColl = new BusinessEntity.Inventory.ProductReviewQACollections();
            dal.OpenConnection();
            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandText = "usp_GetProductReviewQA";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Inventory.ProductReviewQA beData = new BusinessEntity.Inventory.ProductReviewQA();
                    if (!(reader[0] is System.DBNull)) beData.ProductId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.ProductName = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.Question = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.QuestionBy = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.QuestionDate = Convert.ToDateTime(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.Answer = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.AnswerBy = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.AnswerDate = Convert.ToDateTime(reader[7]);
                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

    }


}
