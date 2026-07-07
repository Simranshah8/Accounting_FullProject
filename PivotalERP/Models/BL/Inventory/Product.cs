using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessLogic.Inventory
{
    public class Product : ISaveModifyDelete<Dynamic.BusinessEntity.Inventory.Product>, IDataLoading<Dynamic.BusinessEntity.Inventory.Product>, IGetDataByRow<Dynamic.BusinessEntity.Inventory.Product>
    {
        private const Dynamic.BusinessEntity.Global.FormsEntity EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Product;
        string _hostName = "", _dbName = "";
        Dynamic.DataAccess.Inventory.ProductDB db = new DataAccess.Inventory.ProductDB();
        Dynamic.DataAccess.Global.GlobalDB globalDB = new DataAccess.Global.GlobalDB();
        public Product() { db = new DataAccess.Inventory.ProductDB(); }
        public Product(string hostName, string dbName) {
            _hostName = hostName;
            _dbName = dbName;
            db = new DataAccess.Inventory.ProductDB(hostName, dbName);
            globalDB = new DataAccess.Global.GlobalDB(hostName, dbName);
        }
       public ResponeValues SaveFormData(Dynamic.BusinessEntity.Inventory.Product beData)
        {
            ResponeValues isValid = IsValidData(ref beData, false);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, false);
            else
                return isValid;
        }
        public ResponeValues ModifyFormData(Dynamic.BusinessEntity.Inventory.Product beData)
        {
            ResponeValues isValid = IsValidData(ref beData, true);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, true);
            else
                return isValid;
        }
        public ResponeValues DeleteFormData(Dynamic.BusinessEntity.Inventory.Product beData)
        {
            return db.Delete(beData.ProductId);
        }
        public ResponeValue ImportGodownWiseOpening(Dynamic.BusinessEntity.Inventory.ProductCollections beDataColl)
        {
            return db.ImportGodownWiseOpening(beDataColl);
        }
            public ResponeValues DeleteById(int ProductId)
        {
            return db.Delete(ProductId);
        }
        public Dynamic.BusinessEntity.Inventory.Product getProductById(int UserId, int ProductId)
        {
            return db.getProductById(UserId, ProductId);
        }
        public System.Collections.Generic.IEnumerable<Dynamic.BusinessEntity.Inventory.Product> getAll(int UserId)
        {
            return db.getAllProduct(UserId);
        }
        public ResponeValues getProductCode(int UserId, string Name, int? ProductGroupId)
        {
            return db.getProductCode(UserId, Name, ProductGroupId);
        }
        public Dynamic.BusinessEntity.Inventory.StockItemAlternetUnitCollections getAllAlternetUnit(int UserId)
        {
            return db.getAllAlternetUnit(UserId);
        }
        public ResponeValue ProductRatingView(int UserId, int ProductId, int Rating, string Remarks)
        {
            return db.ProductRatingView(UserId, ProductId, Rating, Remarks);
        }
        public ResponeValue ProductQA(int UserId, int? ProductId, string Question, string QueName = "")
        {
            return db.ProductQA(UserId, ProductId, Question, QueName);
        }
        public Dynamic.BusinessEntity.Inventory.SlabRateCollections getAllSlabProductRateList(int UserId)
        {
            return db.getAllSlabProductRateList(UserId);
        }
        public Dynamic.BusinessEntity.Inventory.ProductCollections getAllAsList(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();
            try
            {
                if (UserId == 0)
                {
                    dataColl.IsSuccess = false;
                    dataColl.ResponseMSG = "Invalid User";
                }
                else
                {
                    dataColl = db.getAllProduct(UserId);
                }
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }

            return dataColl;
        }

        public ResponeValues UpdatePhoto_Query(int UserId, List<Dynamic.BusinessEntity.Inventory.ImportProductPhoto> dataColl, string query)
        {
            return db.UpdatePhoto_Query(UserId, dataColl, query);
        }
            public Dynamic.BusinessEntity.Inventory.ProductCollections getAllList(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductCollections dataColl = new BusinessEntity.Inventory.ProductCollections();
            try
            {
                if (UserId == 0)
                {
                    dataColl.IsSuccess = false;
                    dataColl.ResponseMSG = "Invalid User";
                }
                else
                {
                    dataColl = db.getAllProductList(UserId);
                }
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }

            return dataColl;
        }
        public Dynamic.BusinessEntity.Inventory.Product getDataByRowNumber(long rowNum)
        {
            return db.getProductByRowNumber(rowNum);
        }
        public Dynamic.BusinessEntity.Inventory.Product getDataOfLastRow(ref long count)
        {
            return db.getLastRowData(ref count);
        }
        public int getAutoNumber()
        {
            return db.getAutoNumber();
        }
        public void getProductDetailsByproductId(ref Dynamic.BusinessEntity.Inventory.Product beData)
        {
            db.getProductDetailsByproductId(ref beData);
        }
        public int getAutoNumberForCode(string firstLetter)
        {
            return db.getAutoNumberForCode(firstLetter);
        }
        public Dynamic.BusinessEntity.Inventory.Product getProductBy(string colName, string Value)
        {
            return db.getProductBy(colName, Value);
        }

        public Dynamic.BusinessEntity.Inventory.ProductReviewCollections GetProductReview(int UserId,int? ProductId)
        {
            return db.GetProductReview(UserId, ProductId);
        }
        public Dynamic.BusinessEntity.Inventory.ProductReviewQACollections GetProductReviewQA(int UserId)
        {
            return db.GetProductReviewQA(UserId);
        }

        public ResponeValues IsValidData(ref Dynamic.BusinessEntity.Inventory.Product beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.ProductId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.ProductId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = GLOBALMSG.BLANK_DATA + " Name Of Product";
                }
                else if(!beData.IsTaxable && beData.VatRate > 0)
                {
                    resVal.ResponseMSG = "Non Taxable Product Not Allow Vat Rate";
                }
                else if(beData.IsTaxable && beData.VatRate == 0)
                {
                    resVal.ResponseMSG = " Taxable Product Not Allow Vat Rate Zero";
                }
                else
                {
                    beData.OpeningRate = 0;
                    beData.OpeningQty = 0;
                    beData.OpeningAmount = 0;

                    if (string.IsNullOrEmpty(beData.Code))
                        beData.Code = "";

                    if (beData.PurchaseUnitId.HasValue && beData.PurchaseUnitId.Value == 0)
                        beData.PurchaseUnitId = null;

                    if (beData.SalesUnitId.HasValue && beData.SalesUnitId.Value == 0)
                        beData.SalesUnitId = null;

                    if (beData.OpeningForBranchId==0)
                        beData.OpeningForBranchId = 1;

                    if(beData.ProductTypeId==0)
                        beData.ProductTypeId = 1;

                    if(beData.ProductCompanyId==0)
                        beData.ProductCompanyId = 1;

                    if(beData.ProductCategoriesId==0)
                        beData.ProductCategoriesId = 1;

                    if(beData.BaseUnitId==0)
                        beData.BaseUnitId = 1;

                    if(beData.ProductGroupId==0)
                        beData.ProductGroupId = 1;

                    if (!beData.AllowSalesPoint)
                        beData.SalesPointPerQty = null;

                    Dynamic.BusinessEntity.Inventory.StockItemOpeningDetailsCollections _OpeningColl = beData.OpeningColl;
                    beData.OpeningColl = new BusinessEntity.Inventory.StockItemOpeningDetailsCollections();

                    if (_OpeningColl != null && _OpeningColl.Count > 0)
                    {
                        foreach (var v in _OpeningColl)
                        {
                            if (v.GodownId == 0 && (v.Amount!=0 || v.Quantity!=0))
                            {
                                resVal.IsSuccess = false;
                                resVal.ResponseMSG = "Please ! Select Valid Godown Name In Opening";
                                return resVal;
                            }

                            var qtyRate =Math.Round(v.Quantity * v.Rate,3);
                            var diff = qtyRate - v.Amount;
                            if (Math.Abs(diff) > 0.3)
                            {
                                    resVal.IsSuccess = false;
                                    resVal.ResponseMSG = $"Amount Does Not Match With Quantity({v.Quantity.ToString("N")}) X Rate({v.Rate.ToString("N")}) = Amount({v.Amount.ToString("N")})";
                                    return resVal;
                            }
                            //if (Math.Round(v.Quantity * v.Rate, 3) != Math.Round(v.Amount, 3))
                            //{
                            //    resVal.IsSuccess = false;
                            //    resVal.ResponseMSG = "Amount Does Not Match With Quantity X Rate = Amount";
                            //    return resVal;
                            //}

                            if (v.Amount < 0)
                            {
                                resVal.IsSuccess = false;
                                resVal.ResponseMSG = "Please ! Enter Positive Amount";
                                return resVal;
                            }

                            if (v.Quantity < 0)
                            {
                                resVal.IsSuccess = false;
                                resVal.ResponseMSG = "Please ! Enter Positive Quantity";
                                return resVal;
                            }

                            beData.OpeningColl.Add(v);
                        }

                        beData.OpeningQty = beData.OpeningColl.Sum(p1 => p1.Quantity);
                        beData.OpeningAmount = beData.OpeningColl.Sum(p1 => p1.Amount);
                        if (beData.OpeningQty != 0 && beData.OpeningAmount != 0)
                        {
                            beData.OpeningRate = beData.OpeningAmount / beData.OpeningQty;
                        }
                    }

                    if (beData.ExciseOn == 0)
                        beData.ExciseOn = 2;

                    if (beData.SalesPointPerQty == 0)
                        beData.SalesPointPerQty = null;


                    if (beData.AlterNetUnitColl != null)
                    {
                        List<int> dupAUIdColl = new List<int>();
                        int row = 1;
                        foreach(var au in beData.AlterNetUnitColl)
                        {
                            if (dupAUIdColl.Contains(au.AlterNetUnitId))
                            {
                                resVal.IsSuccess = false;
                                resVal.ResponseMSG = "Duplicate alternet unit at row "+row.ToString();
                                return resVal;
                            }
                            else
                            {
                                dupAUIdColl.Add(au.AlterNetUnitId);
                            }

                            if (au.AlterNetUnitId == beData.BaseUnitId)
                            {
                                resVal.IsSuccess = false;
                                resVal.ResponseMSG = "Alternet Unit cant set as base unit at row "+row.ToString();
                                return resVal;
                            }
                            row++;
                        }
                    }

                    var action = (IsModify ? BusinessEntity.Global.Actions.Modify : BusinessEntity.Global.Actions.Save);
                    //var jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(beData);
                    string jsonData = new Global.UDFClass().SerializedObject(beData, "DocumentColl,OpeningColl,ImageColl,BranchWiseBaseUnitColl,");
                    ResponeValues validResponse = globalDB.IsValidMasteData(beData.CUserId, BusinessEntity.Global.FormsEntity.Product,action, jsonData);
                    if (!validResponse.IsSuccess)
                        return validResponse;


                    if (!string.IsNullOrEmpty(_hostName) && !string.IsNullOrEmpty(_dbName))
                    {
                        var entityBl = new Dynamic.BusinessLogic.Security.EntityProperties(beData.CUserId, _hostName, _dbName);
                        var isValidEntity = entityBl.IsValidEntity((int)EntityId, beData);
                        if (!isValidEntity.IsSuccess)
                            return isValidEntity;
                    }

                    beData.SubGroup5 = beData.ProductGroupId;
                    if (beData.SubGroup4.HasValue)
                        beData.ProductGroupId = beData.SubGroup4.Value;
                    else if (beData.SubGroup3.HasValue)
                        beData.ProductGroupId = beData.SubGroup3.Value;
                    else if (beData.SubGroup2.HasValue)
                        beData.ProductGroupId = beData.SubGroup2.Value;
                    else if (beData.SubGroup1.HasValue)
                        beData.ProductGroupId = beData.SubGroup1.Value;

                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Valid";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }
    }
}
