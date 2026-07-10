using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BusinessLogic.Inventory
{
    public class ProductInOutType : ISaveModifyDelete<Dynamic.BusinessEntity.Inventory.ProductInOutType>, IDataLoading<Dynamic.BusinessEntity.Inventory.ProductInOutType>, IGetDataByRow<Dynamic.BusinessEntity.Inventory.ProductInOutType>
    {
        Dynamic.DataAccess.Inventory.ProductInOutTypeDB db = new DataAccess.Inventory.ProductInOutTypeDB();
        public ProductInOutType() { db = new DataAccess.Inventory.ProductInOutTypeDB(); }
        public ProductInOutType(string hostName, string dbName) { db = new DataAccess.Inventory.ProductInOutTypeDB(hostName, dbName); }
        public ResponeValues SaveFormData(Dynamic.BusinessEntity.Inventory.ProductInOutType beData)
        {
            ResponeValues isValid = IsValidData(beData, false);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, false);
            else
                return isValid;
        }
        public ResponeValues ModifyFormData(Dynamic.BusinessEntity.Inventory.ProductInOutType beData)
        {
            ResponeValues isValid = IsValidData(beData, true);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, true);
            else
                return isValid;
        }
        public ResponeValues DeleteFormData(Dynamic.BusinessEntity.Inventory.ProductInOutType beData)
        {
            return db.Delete(beData.InOutTypeId);
        }
        public ResponeValues DeleteById(int ProductInOutTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            if (ProductInOutTypeId < 2)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = "Can't delete default data";
                return resVal;
            }
            return db.Delete(ProductInOutTypeId);
        }
        public Dynamic.BusinessEntity.Inventory.ProductInOutType getProductInOutTypeById(int UserId, int ProductInOutTypeId)
        {
            return db.getProductInOutTypeById(UserId, ProductInOutTypeId);
        }
        public System.Collections.Generic.IEnumerable<Dynamic.BusinessEntity.Inventory.ProductInOutType> getAll(int UserId)
        {
            return db.getAllProductInOutType(UserId);
        }
        public Dynamic.BusinessEntity.Inventory.ProductInOutTypeCollections getAllAsList(int UserId)
        {
            Dynamic.BusinessEntity.Inventory.ProductInOutTypeCollections dataColl = new BusinessEntity.Inventory.ProductInOutTypeCollections();
            try
            {
                if (UserId == 0)
                {
                    dataColl.IsSuccess = false;
                    dataColl.ResponseMSG = "Invalid User";
                }
                else
                {
                    dataColl = db.getAllProductInOutType(UserId);
                }
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }

            return dataColl;
        }
        public Dynamic.BusinessEntity.Inventory.ProductInOutType getDataByRowNumber(long rowNum)
        {
            return db.getProductInOutTypeByRowNumber(rowNum);
        }
        public Dynamic.BusinessEntity.Inventory.ProductInOutType getDataOfLastRow(ref long count)
        {
            return db.getLastRowData(ref count);
        }
        public int getAutoNumber()
        {
            return db.getAutoNumber();
        }
       
        public ResponeValues IsValidData(Dynamic.BusinessEntity.Inventory.ProductInOutType beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.InOutTypeId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.InOutTypeId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = GLOBALMSG.BLANK_DATA + " Name Of ProductInOutType";
                }
                else
                {
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
