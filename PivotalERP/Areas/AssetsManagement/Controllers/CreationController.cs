using Dynamic.BusinessEntity.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.AssetsManagement
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: AssetsManagement/Creation

        string photoLocation = "/Attachments/Assets";

        #region "Master CRUD"

        #region "AssetGroup"
        public ActionResult AssetGroup()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveAssetGroup()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.AssetGroupId.HasValue)
                        beData.AssetGroupId = 0;

                    resVal = new Dynamic.BL.AssetManagement.AssetGroup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAssetGroup()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetGroup(User.UserId, User.HostName, User.DBName).GetAllAssetGroup(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAssetGroupById(int AssetGroupId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetGroup(User.UserId, User.HostName, User.DBName).GetAssetGroupById(0, AssetGroupId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetGroup(int AssetGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetGroup(User.UserId, User.HostName, User.DBName).DeleteById(0, AssetGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "AssetType"

        public ActionResult AssetType()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveAssetType()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.AssetTypeId.HasValue)
                        beData.AssetTypeId = 0;
                    resVal = new Dynamic.BL.AssetManagement.AssetType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAssetType()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetType(User.UserId, User.HostName, User.DBName).GetAllAssetType(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAssetTypeById(int AssetTypeId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetType(User.UserId, User.HostName, User.DBName).GetAssetTypeById(0, AssetTypeId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetType(int AssetTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetType(User.UserId, User.HostName, User.DBName).DeleteById(0, AssetTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "AssetModel"
        public ActionResult AssetModel()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveAssetModel()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetModel>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.AssetModelId.HasValue)
                        beData.AssetModelId = 0;

                    resVal = new Dynamic.BL.AssetManagement.AssetModel(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllAssetModel()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetModel(User.UserId, User.HostName, User.DBName).GetAllAssetModel(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAssetModelById(int AssetModelId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetModel(User.UserId, User.HostName, User.DBName).GetAssetModelById(0, AssetModelId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetModel(int AssetModelId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetModel(User.UserId, User.HostName, User.DBName).DeleteById(0, AssetModelId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Assetsmaster"
        public ActionResult AssetsMaster()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveAssetsmaster()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.Assetsmaster>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var empPhoto = filesColl["photo"];
                        if (empPhoto != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, empPhoto, true);
                            beData.PhotoB = photoDoc.Data;
                            beData.Photo = photoDoc.DocPath;
                        }
                    }
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    resVal = new Dynamic.BL.AssetManagement.Assetsmaster(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
        public JsonNetResult GetAllAssetsmaster()
        {
            var dataColl = new Dynamic.BL.AssetManagement.Assetsmaster(User.UserId, User.HostName, User.DBName).GetAllAssetsmaster(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAssetsmasterById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Assetsmaster(User.UserId, User.HostName, User.DBName).GetAssetsmasterById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetsmaster(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.Assetsmaster(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAllAssetsProduct()
        {
            var dataColl = new Dynamic.BL.AssetManagement.Assetsmaster(User.UserId, User.HostName, User.DBName).GetAllAssetsProduct(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetAutoAssetsMasterCode()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.Assetsmaster(User.UserId, User.HostName, User.DBName).GetAutoAssetsMasterCode(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Assets Opening"
        public ActionResult AssetOpening()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult SaveAssetOpening()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetOpening>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AssetManagement.AssetOpening(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllAssetOpening()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetOpening(User.UserId, User.HostName, User.DBName).GetAllAssetOpening(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetOpeningById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetOpening(User.UserId, User.HostName, User.DBName).GetAssetOpeningById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetOpening(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetOpening(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAssetOpeningByBranch(int TranId, int BranchId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetOpening(User.UserId, User.HostName, User.DBName).GetAssetOpeningByBranch(0, TranId, BranchId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "AssetCategory"
        public ActionResult AssetCategory()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveAssetCategory()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetCategory>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.AssetCategoryId.HasValue)
                        beData.AssetCategoryId = 0;

                    resVal = new Dynamic.BL.AssetManagement.AssetCategory(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllAssetCategory()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetCategory(User.UserId, User.HostName, User.DBName).GetAllAssetCategory(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetCategoryById(int AssetCategoryId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetCategory(User.UserId, User.HostName, User.DBName).GetAssetCategoryById(0, AssetCategoryId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetCategory(int AssetCategoryId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetCategory(User.UserId, User.HostName, User.DBName).DeleteById(0, AssetCategoryId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "AssetCodeMethod"
        public ActionResult AssetCodeMethod()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveAssetCodeMethod()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetCodeMethod>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AssetManagement.AssetCodeMethod(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
        public JsonNetResult GetAllAssetCodeMethod()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetCodeMethod(User.UserId, User.HostName, User.DBName).GetAllAssetCodeMethod(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetCodeMethodById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetCodeMethod(User.UserId, User.HostName, User.DBName).GetAssetCodeMethodById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult DelAssetCodeMethod(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetCodeMethod(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion


        #endregion

        #region "Transaction CRUD"

        #region "AssetsInward"

        public ActionResult AssetsInward()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsInward, false)]
        public JsonNetResult SaveAssetInward()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetInward>(Request["jsonData"]);
                if (beData != null)
                {

                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }

                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    else if (beData.TranId > 0)
                        isModify = true;

                    var tranBL = new Dynamic.BL.AssetManagement.AssetInward(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsInward, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsInward;
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
        public JsonNetResult GetAllAssetInward()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetInward(User.UserId, User.HostName, User.DBName).GetAllAssetInward(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetInwardById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetInward(User.UserId, User.HostName, User.DBName).GetAssetInwardById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetInward(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetInward(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetAutoInWardNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetInward(User.UserId, User.HostName, User.DBName).GetAutoInWardNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult getAssetClosingStock(int? TranId, int? BranchId, DateTime? VoucherDate)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetInward(User.UserId, User.HostName, User.DBName).getAssetClosingStock(0, TranId, BranchId, VoucherDate);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "AssetTransfer"
        public ActionResult AssetTransfer()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsTransfer, false)]
        public JsonNetResult SaveAssetTransfer()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetTransfer>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    var tranBL = new Dynamic.BL.AssetManagement.AssetTransfer(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsTransfer, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsTransfer;
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
        public JsonNetResult GetAllAssetTransfer()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetTransfer(User.UserId, User.HostName, User.DBName).GetAllAssetTransfer(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetTransferById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetTransfer(User.UserId, User.HostName, User.DBName).GetAssetTransferById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetTransfer(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetTransfer(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAutoTransferNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetTransfer(User.UserId, User.HostName, User.DBName).GetAutoTransferNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult getParticularByBranch(int FromBranchId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetTransfer(User.UserId, User.HostName, User.DBName).getParticularByBranch(0, FromBranchId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "AssetRequest"
        public ActionResult AssetRequest()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsRequest, false)]
        public JsonNetResult SaveAssetRequest()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetRequest>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    var tranBL = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsRequest, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsRequest;
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
        public JsonNetResult GetAllAssetRequest()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName).GetAllAssetRequest(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetRequestById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName).GetAssetRequestById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetRequest(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetHodListDepartmentWise(int? DepartmentId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName).GetHodListDepartmentWise(0, DepartmentId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAutoNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName).GetAutoNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        #endregion

        #region "AssetIssue"
        public ActionResult AssetIssue()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsIssue, false)]
        public JsonNetResult SaveAssetIssue()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetIssue>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    var tranBL = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsIssue, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsIssue;
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
        public JsonNetResult GetAllAssetIssue()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName).GetAllAssetIssue(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetIssueById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName).GetAssetIssueById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetIssue(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAutoIssueNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName).GetAutoIssueNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAssetReqDetails(int AssetReqNo)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName).GetAssetReqDetails(0, AssetReqNo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "AssetReturn"

        public ActionResult AssetsReturn()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsReturn, false)]

        public JsonNetResult SaveAssetReturn()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.AssetReturn>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    var tranBL = new Dynamic.BL.AssetManagement.AssetReturn(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsReturn, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsReturn;
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
        public JsonNetResult GetAllAssetReturn()
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetReturn(User.UserId, User.HostName, User.DBName).GetAllAssetReturn(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetReturnById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetReturn(User.UserId, User.HostName, User.DBName).GetAssetReturnById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetReturn(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetReturn(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAutoReturnNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.AssetReturn(User.UserId, User.HostName, User.DBName).GetAutoReturnNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetAssetIssueByIssueNo(int IssueNo)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetReturn(User.UserId, User.HostName, User.DBName).GetAssetIssueByIssueNo(0, IssueNo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "AssetsDamage"

        public ActionResult AssetsDamage()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsDemage, false)]
        public JsonNetResult SaveAssetdamage()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = DeserializeObject<Dynamic.BE.AssetManagement.Assetdamage>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    var tranBL = new Dynamic.BL.AssetManagement.Assetdamage(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsDemage, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsDemage;
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
        public JsonNetResult GetAllAssetdamage()
        {
            var dataColl = new Dynamic.BL.AssetManagement.Assetdamage(User.UserId, User.HostName, User.DBName).GetAllAssetdamage(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssetdamageById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Assetdamage(User.UserId, User.HostName, User.DBName).GetAssetdamageById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssetdamage(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.Assetdamage(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAutoDamageNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.Assetdamage(User.UserId, User.HostName, User.DBName).GetAutoDamageNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "RepairedInward"
        public ActionResult RepairedInward()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.AssetsRepairedInward, false)]
        public JsonNetResult SaveRepairedInward()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssetManagement.RepairedInward>(Request["jsonData"]);
                if (beData != null)
                {
                    if (Request.Files.Count > 0)
                    {
                        var allFiles = Request.Files;
                        int find = 0;
                        foreach (var doc in beData.DocumentColl)
                        {
                            HttpPostedFileBase file = allFiles["file" + find];
                            if (file != null)
                            {
                                var newDoc = GetAttachmentDocuments(photoLocation, file);
                                if (newDoc != null)
                                {
                                    doc.Name = newDoc.Name;
                                    doc.Extension = newDoc.Extension;
                                    doc.DocPath = newDoc.DocPath;
                                    doc.DocFullPath = newDoc.DocFullPath;
                                    doc.ParaName = newDoc.ParaName;
                                }
                            }
                            find++;
                        }
                    }
                    bool isModify = false;
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;
                    var tranBL = new Dynamic.BL.AssetManagement.RepairedInward(User.UserId, User.HostName, User.DBName);
                    if (beData.TranId > 0)
                    {
                        isModify = true;

                        var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.AssetsRepairedInward, false, beData.TranId.Value);
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
                        auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.AssetsRepairedInward;
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
        public JsonNetResult GetAllRepairedInward()
        {
            var dataColl = new Dynamic.BL.AssetManagement.RepairedInward(User.UserId, User.HostName, User.DBName).GetAllRepairedInward(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetRepairedInwardById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.RepairedInward(User.UserId, User.HostName, User.DBName).GetRepairedInwardById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelRepairedInward(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.RepairedInward(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAutoRepairedNo()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssetManagement.RepairedInward(User.UserId, User.HostName, User.DBName).GetAutoRepairedNo(User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion
        
        #endregion




    }
}
