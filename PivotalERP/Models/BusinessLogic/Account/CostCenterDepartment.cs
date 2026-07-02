using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessLogic.Account
{
    public class CostCenterDepartment: ISaveModifyDelete<Dynamic.BusinessEntity.Account.CostCenterDepartment>, IDataLoading<Dynamic.BusinessEntity.Account.CostCenterDepartment>, IGetDataByRow<Dynamic.BusinessEntity.Account.CostCenterDepartment>, ICanDelete<Dynamic.BusinessEntity.Account.CostCenterDepartment>
    {
        Dynamic.DataAccess.Account.CostCenterDepartmentDB db = null;
        public CostCenterDepartment() { db = new DataAccess.Account.CostCenterDepartmentDB(); }
        public CostCenterDepartment(string hostName, string dbName) { db =new DataAccess.Account.CostCenterDepartmentDB(hostName, dbName); }

       public ResponeValues SaveFormData(Dynamic.BusinessEntity.Account.CostCenterDepartment beData)
        {
            ResponeValues isValid = IsValidData(beData, false);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, false);
            else
                return isValid;
        }
        public ResponeValues ModifyFormData(Dynamic.BusinessEntity.Account.CostCenterDepartment beData)
        {
            ResponeValues isValid = IsValidData(beData, true);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, true);
            else
                return isValid;
        }
        public ResponeValues DeleteFormData(Dynamic.BusinessEntity.Account.CostCenterDepartment beData)
        {
            return db.Delete(beData.CostCenterDepartmentId);
        }
        public ResponeValues DeleteById(int UserId,int CostCenterDepartmentId)
        {
            return db.DeleteById( CostCenterDepartmentId);
        }
            public System.Collections.Generic.IEnumerable<Dynamic.BusinessEntity.Account.CostCenterDepartment> getAll(int UserId)
        {
            return db.getAllCostCenterDepartment(UserId);
        }
        public Dynamic.BusinessEntity.Account.CostCenterDepartment getCostCenterDepartmentById(int UserId, int CostCenterDepartmentId)
        {
            return db.getCostCenterDepartmentById(UserId, CostCenterDepartmentId);
        }
            public Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections getAllAsList(int UserId)
        {
            Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections dataColl = new BusinessEntity.Account.CostCenterDepartmentCollections();
            try
            {
                if (UserId == 0)
                {
                    dataColl.IsSuccess = false;
                    dataColl.ResponseMSG = "Invalid User";
                }
                else
                {
                    dataColl = db.getAllCostCenterDepartment(UserId);
                }
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }

            return dataColl;
        }  
        public Dynamic.BusinessEntity.Account.CostCenterDepartment getDataByRowNumber(long rowNum)
        {
            return db.getCostCenterDepartmentByRowNumber(rowNum);
        }
        public Dynamic.BusinessEntity.Account.CostCenterDepartment getDataOfLastRow(ref long count)
        {
            return db.getLastRowData(ref count);
        }
        public bool CanDelete(Dynamic.BusinessEntity.Account.CostCenterDepartment beData)
        {
            return true;
        }
        public ResponeValues IsValidData(Dynamic.BusinessEntity.Account.CostCenterDepartment beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.CostCenterDepartmentId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.CostCenterDepartmentId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = GLOBALMSG.VALID_DATA + " Name";
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
