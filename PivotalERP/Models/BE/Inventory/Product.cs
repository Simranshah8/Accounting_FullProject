using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using Dynamic.BusinessEntity.Common;
namespace Dynamic.BusinessEntity.Inventory
{
    public enum CostingMethods
    {
        At_Zero_Cost=1,
        Avg_Cost=2,
        FIFO=3,
        Last_Purchase_Cost=4,
        LIFO=5,
        Monthly_Avg_Cost=6,
        Std_Cost=7,
        InOut_Amount=8
    }
    public enum MarketValuationMethods
    {
        At_Zero_Price=1,
        Avg_Price=2,
        Last_Sales_Price=3,
        Std_Price=4
    }
    public class Product : Account.MasterClass, LogDataForCreate
    {
        public Product()
        {
            Alias = "";
            Code = "";
            Description = "";
            PartNo = "";
            PartNoAlias = "";
            Remarks = "";
            CostingMethod = CostingMethods.Avg_Cost;
            MarketValuationMethod = MarketValuationMethods.Avg_Price;
            IgnoreNegativeBalance = false;
            IsActive = true;
            MaintainBatchWise = false;
            UseExpDate = false;
            UseMfgDate = false;
            CanEditRate = true;
            CanEditRatePurchase = true;
            OpeningForBranchId = 1;
            BarCodeColl = new List<string>();
            ProductGroupName = "";
            BaseUnitName = "";
            ProductTypeId = 1;
            ProductCompanyId = 1;
            ProductCategoriesId = 1;
            BaseUnitId = 1;
            ProductGroupId = 1;
            PhotoPath = "";
            IsTaxable = true;
            PreferedSupplierIdColl = new List<int>();
        }
        public int ProductId { get; set; }
        public int AutoNumber { get; set; }

        [EP("Description", "Description")]
        public string Description { get; set; }

        [EP("ProductGroupId", "Group",true)]
        public int ProductGroupId { get; set; }
        public string ProductGroupName { get; set; }

        [EP("ProductCategoriesId", "Category")]
        public int ProductCategoriesId { get; set; }
        public string ProductCategoriesName { get; set; }

        [EP("ProductTypeId", "Product Type")]
        public int ProductTypeId { get; set; }
        public string ProductTypeName { get; set; }

        [EP("ProductCompanyId", "Product Company")]
        public int ProductCompanyId { get; set; }
        public string ProductCompanyName { get; set; }

        [EP("BaseUnitId", "Base Unit")]
        public int BaseUnitId { get; set; }
        public string BaseUnitName { get; set; }

        [EP("ActiveAlternativeUnit", "Set Alternate Unit")]
        public bool ActiveAlternativeUnit { get; set; }

        [EP("PartNo", "Part No.")]
        public string PartNo { get; set; }

        [EP("PartNoAlias", "Part No. Alias")]
        public string PartNoAlias { get; set; }

        [EP("Remarks", "Remarks")]
        public string Remarks { get; set; }

        [EP("CostingMethod", "Costing Method")]
        public CostingMethods CostingMethod { get; set; }

        [EP("MarketValuationMethod", "Market Valuation Method")]
        public MarketValuationMethods MarketValuationMethod { get; set; }

        [EP("VatRate", "Vat Rate %")]
        public double VatRate { get; set; } = 13;

        [EP("IgnoreNegativeBalance", "Ignore Negative Balance")]
        public bool IgnoreNegativeBalance { get; set; } = false;

        [EP("SetStandardRate", "Set Standard Rate")]
        public bool SetStandardRate { get; set; }

        [EP("SetGodownWiseOpening", "Set Opening")]
        public bool SetGodownWiseOpening { get; set; }

        [EP("MaintainBatchWise", "Maintain Batch")]
        public bool MaintainBatchWise { get; set; }

        [EP("UseMfgDate", "Use MFG Date")]
        public bool UseMfgDate { get; set; }

        [EP("UseExpDate", "Use EXP Date")]
        public bool UseExpDate { get; set; }

        [EP("OpeningQty", "Opening Qty.")]
        public double OpeningQty { get; set; }

        [EP("OpeningRate", "Opening Rate")]
        public double OpeningRate { get; set; }

        [EP("OpeningAmount", "Opening Amt.")]
        public double OpeningAmount { get; set; }

        [EP("TreatAllSalesAsNewManufacture", "Treat all sales as new manufacture")]
        public bool TreatAllSalesAsNewManufacture { get; set; }

        [EP("TreatAllPurchaseAsConsumed", "Treat all Purchase as Consumed")]
        public bool TreatAllPurchaseAsConsumed { get; set; }

        [EP("TreatllRejectionInwardAsScraped", "Treat all rejection Inward as scrap")]
        public bool TreatllRejectionInwardAsScraped { get; set; }

        [EP("IsActive", "Is Active")]
        public bool IsActive { get; set; }

        [EP("CanEditRate", "Can Edit Sales Rate")]
        public bool CanEditRate { get; set; }

        [EP("CanEditRatePurchase", "Can Edit Purchase Rate")]
        public bool CanEditRatePurchase { get; set; }

        [EP("IsFixedProduct", "Is Fixed Product")]
        public bool IsFixedProduct { get; set; }

        [EP("IncludingVat", "Included Vat")]
        public bool IncludingVat { get; set; }

        [EP("WarrantyMonth", "Warranty Month")]
        public double WarrantyMonth { get; set; }

        [EP("TermCondition", "Term Condition For Invoice")]
        public string TermCondition { get; set; }

        StockItemAlternetUnitCollections _AlterNetUnitColl = new StockItemAlternetUnitCollections();

        [EP("AlterNetUnitColl", "Set Alternate Unit")]
        public StockItemAlternetUnitCollections AlterNetUnitColl
        {
            get
            {
                return _AlterNetUnitColl;
            }
            set
            {
                _AlterNetUnitColl = value;
            }
        }

        StockItemOpeningDetailsCollections _OpeningColl = new StockItemOpeningDetailsCollections();

        [EP("OpeningColl", "Set Opening")]
        public StockItemOpeningDetailsCollections OpeningColl
        {
            get
            {
                return _OpeningColl;
            }
            set
            {
                _OpeningColl = value;
            }
        }

        StockItemRatesCollections _CostRateColl = new StockItemRatesCollections();
        [EP("CostRateColl", "Cost Rate")]
        public StockItemRatesCollections CostRateColl
        {
            get
            {
                return _CostRateColl;
            }
            set
            {
                _CostRateColl = value;
            }
        }

        StockItemRatesCollections _SellingRateColl = new StockItemRatesCollections();
        [EP("SellingRateColl", "Selling Rate")]
        public StockItemRatesCollections SellingRateColl
        {
            get
            {
                return _SellingRateColl;
            }
            set
            {
                _SellingRateColl = value;
            }
        }

        
        [EP("SlabSellingRateColl", "Slab Selling Rate")]
        public SlabRateCollections SlabSellingRateColl
        {
            get;set;
        }

        StockItemRatesCollections _TradeRateColl = new StockItemRatesCollections();

        [EP("TradeRateColl", "Trade Rate")]
        public StockItemRatesCollections TradeRateColl
        {
            get
            {
                return _TradeRateColl;
            }
            set
            {
                _TradeRateColl = value;
            }
        }

        StockItemRatesCollections _MRPRateColl = new StockItemRatesCollections();

        [EP("MRPRateColl", "MRP")]
        public StockItemRatesCollections MRPRateColl
        {
            get
            {
                return _MRPRateColl;
            }
            set
            {
                _MRPRateColl = value;
            }
        }
        public enum VoucherNames
        {
            Others,
            Purchase,
            Sales,
            PartsDemand,
            StockJournal,
            StockTransfor
        }

        public VoucherNames VoucherName = VoucherNames.Others;

        public string DispalyValue
        {
            get
            {

                Dynamic.BusinessEntity.Setup.AppearancesOfProduct app = Setup.AppearancesOfProduct.NameOnly;
                
                if(Dynamic.BusinessEntity.Global.GlobalObject.InventoryConfig!=null)
                   app= Dynamic.BusinessEntity.Global.GlobalObject.InventoryConfig.Appearances;

                //if (VoucherName != VoucherNames.Others)
                //{
                //    if (Dynamic.BusinessEntity.Global.GlobalObject.VoucherWiseProductAppearance != null)
                //    {
                //        switch (VoucherName)
                //        {
                //            case VoucherNames.PartsDemand:
                //                app = Dynamic.BusinessEntity.Global.GlobalObject.VoucherWiseProductAppearance.PartsDemand;
                //                break;
                //            case VoucherNames.Purchase:
                //                app = Dynamic.BusinessEntity.Global.GlobalObject.VoucherWiseProductAppearance.Purchase;
                //                break;
                //            case VoucherNames.Sales:
                //                app = Dynamic.BusinessEntity.Global.GlobalObject.VoucherWiseProductAppearance.Sales;
                //                break;
                //            case VoucherNames.StockJournal:
                //                app = Dynamic.BusinessEntity.Global.GlobalObject.VoucherWiseProductAppearance.StockJournal;
                //                break;
                //            case VoucherNames.StockTransfor:
                //                app = Dynamic.BusinessEntity.Global.GlobalObject.VoucherWiseProductAppearance.StockTransfor;
                //                break;
                //        }
                //    }
                //}

                switch (app)
                {
                    case Setup.AppearancesOfProduct.AliasCode:
                        return (Alias + "     " + Code).Trim();
                    case Setup.AppearancesOfProduct.AliasName:
                        return (Alias + "     " + Name).Trim();
                    case Setup.AppearancesOfProduct.AliasOnly:
                        return Alias;
                    case Setup.AppearancesOfProduct.CodeAlias:
                        return (Code + "     " + Alias).Trim();
                    case Setup.AppearancesOfProduct.CodeAndName:
                        return (Code + "     " + Name).Trim();
                    case Setup.AppearancesOfProduct.CodeOnly:
                        return Code;
                    case Setup.AppearancesOfProduct.NameAlias:
                        return (Name + "     " + Alias).Trim();
                    case Setup.AppearancesOfProduct.NameAndCode:
                        return (Name + "     " + Code).Trim();
                    case Setup.AppearancesOfProduct.NameOnly:
                        return Name;
                    case Setup.AppearancesOfProduct.PartNoAndName:
                        return (PartNo + "     " + Name).Trim();
                    case Setup.AppearancesOfProduct.PartNoOnly:
                        return PartNo;
                    case Setup.AppearancesOfProduct.CodeNameDescription:
                        return (Code + "     " + Name + "     " + Description).Trim();
                    case Setup.AppearancesOfProduct.NameCodeDescription:
                        return (Name + "     " + Code + "     " + Description).Trim();
                    case Setup.AppearancesOfProduct.NameDescription:
                        return (Name + "     " + Description).Trim();
                    case Setup.AppearancesOfProduct.CodeNameAlias:
                        return (Code + "     " + Name + "     " + Alias).Trim();
                    case Setup.AppearancesOfProduct.NameAliasCode:
                        return (Name + "     " + Alias + "     " + Code).Trim();
                    case Setup.AppearancesOfProduct.NameCodeAlias:
                        return (Name + "     " + Code + "     " + Alias).Trim();
                    case Setup.AppearancesOfProduct.NameCodeRemarks:
                        return (Name + "     " + Code + "     " + Remarks).Trim();                        
                    case Setup.AppearancesOfProduct.NameRemarks:
                        return (Name + "     " + Remarks).Trim();                        
                    case Setup.AppearancesOfProduct.RemarksCodeName:
                        return (Remarks + "     " + Code + "     " + Name).Trim();
                    case Setup.AppearancesOfProduct.CodeNameRemarks:
                        return (Code + "     " + Name + "     " + Remarks).Trim();
                    default:
                        return Name;
                }                
            }

            
        }

        private UserDefineFieldCollections _UserDefineFieldsColl = new UserDefineFieldCollections();
        public UserDefineFieldCollections UserDefineFieldsColl
        {
            get
            {
                if (_UserDefineFieldsColl == null)
                    return new UserDefineFieldCollections();
                else
                    return _UserDefineFieldsColl;
            }
            set
            {
                _UserDefineFieldsColl = value;
            }
        }

        public int OpeningForBranchId { get; set; }

        [EP("EXDutyRate", "Excise Duty Rate")]
        public double EXDutyRate { get; set; }

        public System.Collections.Generic.List<string> BarCodeColl { get; set; }

        [EP("PurchaseLedgerId", "Purchase Ledger")]
        public int PurchaseLedgerId { get; set; }

        [EP("SalesLedgerId", "Sales Ledger")]
        public int SalesLedgerId { get; set; }

        [Dynamic.BusinessEntity.Common.EP("HSCode", "H.S.Code")]
        public string HSCode { get; set; } = "";

        public string GodownName { get; set; }
        public string Unit2 { get; set; }
        public string Unit3 { get; set; }
        public string Unit4 { get; set; }
        public double AlternetQty1 { get; set; }
        public double AlternetQty2 { get; set; }
        public double AlternetQty3 { get; set; }


        private Dynamic.BusinessEntity.Inventory.StockItemOpeningDetailsCollections _BranchWiseBaseUnitColl = new Dynamic.BusinessEntity.Inventory.StockItemOpeningDetailsCollections();
        public Dynamic.BusinessEntity.Inventory.StockItemOpeningDetailsCollections BranchWiseBaseUnitColl
        {
            get
            {
                return _BranchWiseBaseUnitColl;
            }
            set
            {
                _BranchWiseBaseUnitColl = value;
            }
        }


        [EP("ProductDivisionId", "Division")]
        public int ProductDivisionId { get; set; }


        public byte[] SamplePhoto { get; set; }

        [EP("ProductBrandId", "Brand")]
        public int ProductBrandId { get; set; }

        [EP("ProductColorId", "Color")]
        public int ProductColorId { get; set; }

        [EP("ProductShapeId", "Shape")]
        public int ProductShapeId  { get; set; }

        [EP("ProductFlavourId", "Flavour")]
        public int ProductFlavourId { get; set; }

        [EP("PurchaseCCRate", "Purchase C.C. Rate")]
        public double PurchaseCCRate { get; set; }

        [EP("SalesCCRate", "Sales C.C. Rate")]
        public double SalesCCRate { get; set; }

        public string ProductDivision { get; set; }
        public string ProductBrand { get; set; }
        public string ProductColor { get; set; }
        public string ProductShape { get; set; }
        public string ProductFlavour { get; set; }

        [EP("ExDutyUnitId", "Excise Unit")]
        public int ExDutyUnitId { get; set; }
        public string ExDutyUnitName { get; set; }
        public List<int> ProductCategoriesIdColl { get; set; }
        public string PurchaseLedger { get; set; }
        public string SalesLedger { get; set; }

        [EP("SNo", "S.No.")]
        public int SNo { get; set; }

        [EP("TSCRate", "T.S.C. Rate")]
        public double TSCRate { get; set; }

        private Dynamic.BusinessEntity.GeneralDocumentCollections _DocumentColl = new GeneralDocumentCollections();
        public GeneralDocumentCollections ImageColl
        {
            get
            {
                return _DocumentColl;
            }
            set
            {
                _DocumentColl = value;
            }
        }

        public double BalanceQty { get; set; }

        public double PurchaseRate { get; set; }
        public double SalesRate { get; set; }
        public int ProductSNo { get; set; }

        public int id
        {
            get
            {
                return ProductId;
            }
        }

        public string PhotoPath { get; set; }

        [EP("IsTaxable", "Is Taxable")]
        public bool IsTaxable { get; set; }

        [EP("RateOf", "Rate Of Unit")]
        public double RateOf { get; set; }

        [EP("LossRate", "Loss Rate %")]
        public double LossRate { get; set; }

        [EP("DealerCommissionRate", "Dealer Commission Rate")]
        public double DealerCommissionRate { get; set; }

        [EP("SankuchanLoss", "Sankuchan Loss")]
        public double SankuchanLoss { get; set; }

        [EP("ActivitiesLoss", "Activities Loss")]
        public double ActivitiesLoss { get; set; }

        [EP("SankuchanCostCenterId", "Sankuchan CostCenter")]
        public int? SankuchanCostCenterId { get; set; }

        [EP("ActivitiesCostCenterId", "Activities CostCenter")]
        public int? ActivitiesCostCenterId { get; set; }

        [EP("PurchaseUnitId", "Purchase UOM")]
        public int? PurchaseUnitId { get; set; }

        [EP("SalesUnitId", "Sales UOM ")]
        public int? SalesUnitId { get; set; }       
        
        public double TradeRate { get; set; }
        public double MRPRate { get; set; }

        [EP("ExciseOn", "Excise On")]
        public int ExciseOn { get; set; } //1=Qty,2=Amount
        public List<int> PreferedSupplierIdColl { get; set; }

        [EP("DiscountOn", "Discount On")]
        public int? DiscountOn { get; set; }

        [EP("PurchaseRateFormula", "Purchase Rate Formula")]
        public string PurchaseRateFormula { get; set; } = "";

        [EP("SalesRateFormula", "Sales Rate Formula")]
        public string SalesRateFormula { get; set; } = "";

        [EP("PurchaseCostUnitId", "Purchase Costing UOM ")]
        public int? PurchaseCostUnitId { get; set; }

        [EP("SalesCostUnitId", "Sales Cost UOM")]
        public int? SalesCostUnitId { get; set; }

        [EP("AllowSalesPoint", "Allow Salespoint")]
        public bool AllowSalesPoint { get; set; }

        [EP("SalesPointPerQty", "Sales Point Per Qty.")]
        public double? SalesPointPerQty { get; set; }
        public int GroupAutoNumber { get; set; }

        [EP("ProfitMarginRate", "Profit Margin %")]
        public double? ProfitMarginRate { get; set; }
        public bool ActiveMultipleBatch { get; set; }
        public List<Dynamic.BusinessEntity.Account.VoucherProductUDF> UDFColl { get; set; }


        public double? WeightConv { get; set; }
        public int? WeightUnitId { get; set; }
        public double? VolumConv { get; set; }
        public int? VolumUnitId { get; set; }

        [EP("IncomeLedgerId", "Income Ledger")]
        public int? IncomeLedgerId { get; set; }

        [EP("ExpensesLedgerId", "Expenses Ledger")]   
        public int? ExpensesLedgerId { get; set; }
        public bool ValidateFixedProduct { get; set; } = true;
        public bool AllowManualInputFixedProduct { get; set; } = false;

        [EP("ActiveSerialNo", "Active Serial No.")]
        public bool ActiveSerialNo { get; set; }

        [EP("BR_PurchaseLedgerId", "Branch Purchase Ledger")]
        public int? BR_PurchaseLedgerId { get; set; }

        [EP("BR_SalesLedgerId", "Branch Sales Ledger")]
        public int? BR_SalesLedgerId { get; set; }
        public double? Pur_MinRate { get; set; }
        public double? Pur_MaxRate { get; set; }
        public double? Sal_MinRate { get; set; }
        public double? Sal_MaxRate { get; set; }

        public List<ProductWiseRack> DefaultRackColl = new List<ProductWiseRack>();

        [EP("AditionalDetails_Panel", "Aditional Details")]
        public bool AditionalDetails_Panel { get; set; } = true;

        [EP("ProductCosting_Panel", "Product Costing")]
        public bool ProductCosting_Panel { get; set; } = true;

        [EP("For_Automobiles_Panel", "For Automobiles")]
        public bool For_Automobiles_Panel { get; set; } = true;

        [EP("For_Petrol_Pump_Panel", "For Petrol Pump")]
        public bool For_Petrol_Pump_Panel { get; set; } = true;

        [EP("Term_Condition_Panel", "Term Condition For Invoice")]
        public bool Term_Condition_Panel { get; set; } = true;

        [EP("Prefered_Supplier_Panel", "Prefered Supplier")]
        public bool Prefered_Supplier_Panel { get; set; } = true;

        [EP("Default_Rack_Panel", "Default Rack")]
        public bool Default_Rack_Panel { get; set; } = true;

        [EP("Product_Wise_UDF_Panel", "Product Wise UDF")]
        public bool Product_Wise_UDF_Panel { get; set; } = true;

        [EP("PurchaseReturnLedgerId", "Purchase Return Ledger")]
        public int? PurchaseReturnLedgerId { get; set; }

        [EP("SalesReturnLedgerId", "Sales Return Ledger")]
        public int? SalesReturnLedgerId { get; set; }

        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string EcommerceDescription { get; set; }

        public int? SubGroup1 { get; set;  }
        public int? SubGroup2 { get; set; }
        public int? SubGroup3 { get; set; }
        public int? SubGroup4 { get; set; }
        public int? SubGroup5 { get; set; }

        [EP("DebtorTypeId", "Debtor Type")]
        public int? DebtorTypeId { get; set;  }


        public string ALUnit1 { get; set; }
        public string ALUnit2 { get; set; }
        public string ALUnit3 { get; set; }
        public string UDF1_Key { get; set; }
        public string UDF1_Value { get; set; }
        public string UDF2_Key { get; set; }
        public string UDF2_Value { get; set; }
        public string UDF3_Key { get; set; }
        public string UDF3_Value { get; set; }
        public string UDF4_Key { get; set; }
        public string UDF4_Value { get; set; }
        public string UDF5_Key { get; set; }
        public string UDF5_Value { get; set; }
        public string UDF6_Key { get; set; }
        public string UDF6_Value { get; set; }
        public string UDF7_Key { get; set; }
        public string UDF7_Value { get; set; }
        public string UDF8_Key { get; set; }
        public string UDF8_Value { get; set; }
        public string UDF9_Key { get; set; }
        public string UDF9_Value { get; set; }
        public string UDF10_Key { get; set; }
        public string UDF10_Value { get; set; }

        public string WeightUnit { get; set;  }
        public string VolumUnit { get; set; }
        public string VideoLink { get; set; }   //Added by Simran
        public int? HerbsId { get; set; }   //Added by Simran
        public int? WellnessGoalId { get; set; }   //Added by Simran

        public Dictionary<string, object> LastRateList { get; set; } = new Dictionary<string, object>();


    }

    public class ProductWiseRack
    {
        public int GodownId { get; set; }
        public int RackId { get; set; }
    }
    public class ProductCollections : System.Collections.Generic.List<Product> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }


    public class StockItemAlternetUnit
    {
        public int StockItemId { get; set; }

        public int BaseUnitId { get; set; }
        public string BaseUnitName { get; set; }

        public string AlterNetUnitName { get; set; }
        public int AlterNetUnitId { get; set; }
        public double BaseUnitValue { get; set; }
        public double AlterNetUnitValue { get; set; }
        public double GrossValue { get; set; }

        public int BranchId { get; set; }

        

    }
    public class StockItemAlternetUnitCollections : System.Collections.Generic.List<StockItemAlternetUnit> { }

    public class StockItemOpeningDetails
    {
        public StockItemOpeningDetails()
        {
            GodownName = "";
            UnitName = "";
            RegdNo = "";
            ChassisNo = "";
            EngineNo = "";
            Model = "";
            Type = "";
            Color = "";
            KeyNo = "";
            CodeNo = "";
            Batch = "";
            
        }
        public int StockItemId { get; set; }

        public string GodownName { get; set; }
        public int GodownId { get; set; }

        public double Quantity { get; set; }

        public string UnitName { get; set; }
        public int UnitId { get; set; }

        public double Rate { get; set; }
        public double Amount { get; set; }

        public string RegdNo { get; set; }
        public string ChassisNo { get; set; }
        public string EngineNo { get; set; }
        public string Model { get; set; }
        public string Type { get; set; }
        public string Color { get; set; }
        public string KeyNo { get; set; }
        public string CodeNo { get; set; }
        public int MFGYear { get; set; }

        public string Batch { get; set; }
        public DateTime? MFGDate { get; set; }
        public DateTime? EXPDate { get; set; }
        public int? RackId { get; set; }
    }
    public class StockItemOpeningDetailsCollections : System.Collections.Generic.List<StockItemOpeningDetails> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class StockItemRates 
    {
        public int StockItemId { get; set; }
        public string StockItemName { get; set; }

        public DateTime ApplicableFrom { get; set; }
        public double Rate { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }

        public double Rate2 { get; set; }
        public double Rate3 { get; set; }
        public double Rate4 { get; set; }
        public double Rate5 { get; set; }
        public double RateOf { get; set; }

    }
    public class StockItemRatesCollections : System.Collections.Generic.List<StockItemRates> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class SlabRate
    {
        public int ProductId { get; set; }
        public int SNo { get; set; }        
        public double FromQty { get; set; }
        public double ToQty { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }  

    }

    public class SlabRateCollections : System.Collections.Generic.List<SlabRate>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class PrintProductBarCode
    {
        public int ProductId { get; set; }
        public int AutoNumber { get; set; }
    }

    public class ImportProduct
    {
        public ImportProduct()
        {
            Name = "";
            Alias = "";
            Code = "";
            Description = "";
            BaseUnit = "";
            GroupName = "";
            PartAlias = "";
            PartNo = "";
            PartRemarks = "";
            Godown = "";
            BatchNo = "";
        }

        [Column("P.Name")]
        public string Name { get; set; }

        [Column("P.Alias")]
        public string Alias  { get; set; }

        [Column("P.Code")]
        public string Code  { get; set; }

        [Column("P.HSCode")]
        public string HSCode { get; set; }

        [Column("P.Description")]
        public string Description  { get; set; }

        [Column("P.ProductGroupId")]
        public string GroupName  { get; set; }

        [Column("P.BaseUnitId")]
        public string BaseUnit  { get; set; }

        [Column("P.PurchaseUnitId")]
        public string PurchaseUnit { get; set; }

        [Column("P.SalesUnitId")]
        public string SalesUnit { get; set; }


        [Column("P.PartNo")]
        public string PartNo  { get; set; }

        [Column("P.PartNoAlias")]
        public string PartAlias  { get; set; }

        [Column("P.Remarks")]
        public string PartRemarks  { get; set; }
        public string Godown  { get; set; }
        public DateTime MFGDate  { get; set; }
        public DateTime EXPDate  { get; set; }
        public string BatchNo  { get; set; }
        public double OpeningQty  { get; set; }
        public double Rate  { get; set; }
        public double Amount { get; set; }
        public double CostingRate { get; set; }
        public double SellingRate { get; set; }

        [Column("P.ProductGroupId")]
        public int GroupId { get; set; }

        [Column("P.BaseUnitId")]
        public int UnitId { get; set; }
        public double MRate { get; set; }
         

        [Column("P.ProductCategoriesId")]
        public string ProductCategory { get; set; }

        [Column("P.ProductTypeId")]
        public string ProductType { get; set; }

        [Column("P.ProductDivisionId")]
        public string ProductDivision { get; set; }

        [Column("P.ProductCompanyId")]
        public string ProductCompany { get; set; }

        //[Column("P.PurchaseLedgerId")]
        //public int PurchaseLedgerId { get; set; }

        //[Column("P.SalesLedgerId")]
        //public int SalesLedgeId { get; set; }

        [Column("P.PurchaseLedgerId")]
        public string PurchaseLedgerName { get; set; } = "";

        [Column("P.SalesLedgerId")]
        public string SalesLedgerName { get; set; } = "";

        [Column("P.PurchaseLedgerId")]
        public string PurchaseLedgerCode { get; set; } = "";

        [Column("P.SalesLedgerId")]
        public string SalesLedgerCode { get; set; } = "";

        [Column("P.ProductBrandId")]
        public string Brand { get; set; }

        [Column("P.ProductColorId")]
        public string Color { get; set; }

        [Column("P.ProductFlavourId")]
        public string Flavour { get; set; }

        
        [Column("P.ProductShapeId")]
        public string Shape { get; set; }

        public string AlterNetUnit { get; set; }
        public double BaseUnitValue { get; set; }
        public double AlternetUnitValue { get; set; }

        public string AlterNetUnit2 { get; set; }
        public double BaseUnitValue2 { get; set; }
        public double AlternetUnitValue2 { get; set; }

        [Column("P.CanEditRate")]
        public bool CanEditRate { get; set; }

        [Column("P.IgnoreNegativeBalance")]
        public bool IgnoreNegative { get; set; }

        public string ForBranch { get; set; }


        public string UDF1 { get; set; }
        public string UDF2 { get; set; }
        public string UDF3 { get; set; }
        public string UDF4 { get; set; }
        public string UDF5 { get; set; }

        public string UDF6 { get; set; }
        public string UDF7 { get; set; }
        public string UDF8 { get; set; }
        public string UDF9 { get; set; }
        public string UDF10 { get; set; }

        [Column("P.IsTaxable")]
        public bool IsTaxable { get; set; }

        [Column("P.VatRate")]
        public double VatRate { get; set; }

        [Column("P.IsActive")]
        public bool IsActive { get; set; }

        [Column("P.CanEditRate")]
        public bool CanEditRateSales { get; set; }

        [Column("P.CanEditRatePurchase")]
        public bool CanEditRatePurchase { get; set; }

        [Column("P.IsFixedProduct")]
        public bool IsFixedProduct { get; set; }

        [Column("P.UseExpDate")]
        public bool UseExpDate { get; set; }

        [Column("P.UseMfgDate")]
        public bool UseMfgDate { get; set; }

        [Column("P.MaintainBatchWise")]
        public bool MaintainBatchWise { get; set; }

        private UserDefineFieldCollections _UserDefineFieldsColl = new UserDefineFieldCollections();
        public UserDefineFieldCollections UserDefineFieldsColl
        {
            get
            {
                if (_UserDefineFieldsColl == null)
                    return new UserDefineFieldCollections();
                else
                    return _UserDefineFieldsColl;
            }
            set
            {
                _UserDefineFieldsColl = value;
            }
        }

        public int ProductId { get; set; }

        [Column("P.ProfitMarginRate")]
        public double ProfitMarginRate { get; set; }

        [Column("P.Pur_MinRate")]
        public double? Pur_MinRate { get; set; }

        [Column("P.Pur_MaxRate")]
        public double? Pur_MaxRate { get; set; }

        [Column("P.Sal_MinRate")]
        public double? Sal_MinRate { get; set; }

        [Column("P.Sal_MaxRate")]
        public double? Sal_MaxRate { get; set; }

        [Column("P.SNo")]
        public int? SNo { get; set; }

        //select P.WeightConv,P.WeightUnitId,P.VolumConv,P.VolumUnitId,P.IncomeLedgerId,P.ExpensesLedgerId from tbl_Product P

        [Column("P.WeightConv")]
        public double? WeightConv { get; set; }

        [Column("P.WeightUnitId")]
        public string WeightUnit { get; set; }

        [Column("P.VolumConv")]
        public double? VolumConv { get; set; }

        [Column("P.VolumUnitId")]
        public string VolumUnit { get; set; }

        [Column("P.IncomeLedgerId")]
        public string IncomeLedger { get; set; }

        [Column("P.ExpensesLedgerId")]
        public string ExpensesLedger { get; set; }


        [Column("P.DebtorTypeId")]
        public string DebtorType { get; set; }


        public string GroupCode { get; set; }

        private StockItemAlternetUnitCollections _AlterNetUnitColl = new StockItemAlternetUnitCollections();
        public StockItemAlternetUnitCollections AlterNetUnitColl
        {
            get
            {
                return _AlterNetUnitColl;
            }
            set
            {
                _AlterNetUnitColl = value;
            }
        }

    }
    public class ImportProductCollections : System.Collections.Generic.List<ImportProduct> { }

    public class BatchWiseClosingStock
    {
        public string Batch { get; set; }
        public DateTime? MFGDate { get; set; }
        public DateTime? EXPDate { get; set; }
        public double Qty { get; set; }
        public double PurchaseRate { get; set; }
        public double SalesRate { get; set; }
        public double MRP { get; set; }
        public double TradeRate { get; set; }
        public int GodownId { get; set; }
    }
    public class BatchWiseClosingStockCollections : System.Collections.Generic.List<BatchWiseClosingStock> { }

    public class ImportProductOpening
    {
        public ImportProductOpening()
        {
            Name = "";
            Alias = "";
            Code = "";        
           // BaseUnit = "";            
            Godown = "";
            BatchNo = "";
            //PartNo = "";
            //Remarks = "";
        }
        public string Name { get; set; }
        public string Alias { get; set; }
        public string Code { get; set; }
        //public string BaseUnit { get; set; }
        public string  Unit { get; set; }
        public string Godown { get; set; }
        public DateTime? MFGDate { get; set; }
        public DateTime? EXPDate { get; set; }
        public string BatchNo { get; set; }
        public double OpeningQty { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }
        //public int GroupId { get; set; }
        //public int UnitId { get; set; }
        //public string PartNo { get; set; }
        //public string Remarks { get; set; }
        
    }
    public class ImportProductOpeningCollections : System.Collections.Generic.List<ImportProductOpening> { }

    public class UpdateProductRateList
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Alias { get; set; }
        public double SellingRate1 { get; set; }
        public double SellingRate2 { get; set; }
        public double SellingRate3 { get; set; }
        public double CostingRate { get; set; }
    }
    public class UpdateProductRateListCollections : System.Collections.Generic.List<UpdateProductRateList> { }

    public class FixedProductRateList
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string GroupName { get; set; }
        public string EngineNo { get; set; }
        public string ChassisNo { get; set; }
        public string Model { get; set; }
        public string Color { get; set; }
        public DateTime? ApplicableFrom { get; set; }
        public double Rate { get; set; }
        public double Qty { get; set; }
        public Dynamic.BusinessEntity.Inventory.StockItemRatesCollections CostRateColl { get; set; }
        public Dynamic.BusinessEntity.Inventory.StockItemRatesCollections SalesRateColl { get; set; }
        public Dynamic.BusinessEntity.Inventory.StockItemRatesCollections TradeRateColl { get; set; }
        public Dynamic.BusinessEntity.Inventory.StockItemRatesCollections MRPRateColl { get; set; }

    }
    public class FixedProductRateListCollections : System.Collections.Generic.List<FixedProductRateList> { }

    public class UpdateProductQuery : ImportProduct
    { 
        public string Query { get; set; }
        public string Table
        {
            get
            {
                return "update top(1) P set " + Query + "  from tbl_Product(nolock) P where P.Code=@Code  ";
            }
        }
    }


    public class ImportSalesRate
    {
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string Unit { get; set; }
        public double Rate { get; set; }
        public string BranchName { get; set; }
        public string BranchCode { get; set; }
        public DateTime? ApplicableFrom { get; set; }
        public double MRP { get; set; }
        public double Trade { get; set; }
        public double Rate1 { get; set; }
        public double Rate2 { get; set; }
        public double Rate3 { get; set; }
        public double Rate4 { get; set; }
        public double Rate5 { get; set; }

    }
     
    public class ImportProductPhoto
    {
        
        [Column("P.Code")]
        public string Code { get; set; } = "";

        [Column("P.Name")]
        public string Name { get; set; } = "";

        [Column("P.PartNo")]
        public string PartNo { get; set; } = "";

        [Column("P.PhotoPath")]
        public string PhotoPath { get; set; } = "";
        public int PhotoUploadedBy { get; set; }

    }

    public class ProductReview
    {
        public int? ProductId { get; set; }
        public int? Rating { get; set; }
        public string Remarks { get; set; } = "";
        public string RatedBy { get; set; } = "";
        public string ProductName { get; set; } = "";
        public DateTime? ReviewDate { get; set; }
    }
    public class ProductReviewCollections : List<ProductReview>
    {
        public string ResponseMSG { get; set; } = "";
        public bool IsSuccess { get; set; }
    }
    public class ProductReviewQA
    {
        public int? TranId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; } = "";
        public string Question { get; set; } = "";
        public string QuestionBy { get; set; } = "";
        public DateTime? QuestionDate { get; set; }
        public string Answer { get; set; } = "";
        public string AnswerBy { get; set; } = "";
        public DateTime? AnswerDate { get; set; }
    }
    public class ProductReviewQACollections : List<ProductReviewQA>
    {
        public string ResponseMSG { get; set; } = "";
        public bool IsSuccess { get; set; }
    }
}
