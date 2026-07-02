using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.AssetsManagemet
{
    public class AssetsMaintenance
    {
        DA.AssetsManagemet.AssetsMaintenanceDB db = null;

        int _UserId = 0;
        private string hostName = "", dbName = "";
        public AssetsMaintenance(int UserId, string hostName, string dbName)
        {
            this.hostName = hostName;
            this.dbName = dbName;
            this._UserId = UserId;
            db = new DA.AssetsManagemet.AssetsMaintenanceDB(hostName, dbName);
        }
        public BE.AssetsManagemet.AssetsByEmpCollections GetAssetsByEmp(int? UsersId, bool IsEmpNeed, int? BranchId)
        {
            return db.GetAssetsByEmp(_UserId, UsersId, IsEmpNeed, BranchId);
        }
        public ResponeValues SaveFormData(BE.AssetsManagemet.AssetsMaintenance beData)
        {
            bool isModify = beData.TranId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.AssetsManagemet.AssetsMaintenanceCollections GetAllAssetsMaintenance(int EntityId)
        {
            return db.getAllAssetsMaintenance(_UserId, EntityId);
        }
        public BE.AssetsManagemet.AssetsMaintenance GetAssetsMaintenanceById(int EntityId, int TranId)
        {
            return db.getAssetsMaintenanceById(_UserId, EntityId, TranId);
        }
        public ResponeValues DeleteById(int EntityId, int TranId)
        {
            return db.DeleteById(_UserId, EntityId, TranId);
        }
        public ResponeValues IsValidData(ref BE.AssetsManagemet.AssetsMaintenance beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.TranId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.TranId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (beData.CostClassId == 0 || beData.CostClassId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select CostClass ";
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