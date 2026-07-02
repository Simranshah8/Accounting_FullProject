using Dynamic.BusinessEntity.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.AssetsManagement.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
	{
        // GET: AssetsManagement/Transaction
        public ActionResult AssetsInformation()
        {
            return View();
        }

		[HttpPost]
		public JsonNetResult GetAssetsByEmp(int? UsersId, bool IsEmpNeed, int? BranchId)
		{
			var dataColl = new Dynamic.BL.AssetsManagemet.AssetsMaintenance(User.UserId, User.HostName, User.DBName).GetAssetsByEmp(UsersId, IsEmpNeed, BranchId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

        #region "Assets Maintenance"

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsMaintenance, false)]
        public JsonNetResult SaveAssetsMaintenance()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetsManagemet.AssetsMaintenance>(Request["jsonData"]);
                if (beData != null)
                {
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    else if (beData.TranId > 0)
                        isModify = true;

                    var tranBL = new Dynamic.BL.AssetsManagemet.AssetsMaintenance(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsMaintenance, false, beData.TranId.Value);
                        if (allowAction)
                        {
                            resVal = tranBL.SaveFormData(beData);
                        }
                        else
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = "Access denied";
                            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                        }
                    }
                    else
                    {
                        resVal = tranBL.SaveFormData(beData);
                    }
                    if (resVal.IsSuccess)
                    {
                        Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
                        auditLog.TranId = (isModify ? beData.TranId.Value : resVal.RId);
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsMaintenance;
                        auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
                        auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() : "New " + auditLog.EntityId.ToString());
                        auditLog.AutoManualNo = IsNullStr(resVal.ResponseId);
                        SaveAuditLog(auditLog);
                    }

                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

		[HttpPost]
		public JsonNetResult GetAllAssetsMaintenance()
		{
			var dataColl = new Dynamic.BL.AssetsManagemet.AssetsMaintenance(User.UserId, User.HostName, User.DBName).GetAllAssetsMaintenance(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetAssetsMaintenanceById(int TranId)
		{
			var dataColl = new Dynamic.BL.AssetsManagemet.AssetsMaintenance(User.UserId, User.HostName, User.DBName).GetAssetsMaintenanceById(0, TranId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelAssetsMaintenance(int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.AssetsManagemet.AssetsMaintenance(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


	}
}