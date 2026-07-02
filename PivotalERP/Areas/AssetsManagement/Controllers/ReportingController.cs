using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.AssetsManagement.Controllers
{
    public class ReportingController : PivotalERP.Controllers.BaseController
    {
        // GET: AssetsManagement/Reporting
        #region "VendorWiseAsset"
        public ActionResult VendorWiseAsset()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllVendorWiseAsset(DateTime? DateFrom, DateTime? DateTo)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.VendorWiseAsset(User.UserId, User.HostName, User.DBName).GetAllVendorWiseAsset(0, DateFrom, DateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion
        #region "AssetIssueStatus"
        public ActionResult AssetIssueStatus()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllAssetIssueStatus(DateTime? DateFrom, DateTime? DateTo,string IssueStatus)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.AssetIssueStatus(User.UserId, User.HostName, User.DBName).GetAllAssetIssueStatus(0, DateFrom, DateTo, IssueStatus);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "RequestStatus"
        public ActionResult RequestStatus()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllRequestStatus(DateTime? DateFrom, DateTime? DateTo,string ReqStatus)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.RequestStatus(User.UserId, User.HostName, User.DBName).GetAllRequestStatus(0, DateFrom, DateTo, ReqStatus);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion


        #region "AssetStockReport"
        public ActionResult AssetStockReport()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllAssetStockReport(DateTime? DateFrom, DateTime? DateTo,int? AssetGroupId, int? BranchId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.AssetStockReport(User.UserId, User.HostName, User.DBName).GetAllAssetStockReport(0, DateFrom, DateTo, AssetGroupId, BranchId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "AssetsUseDetails"
        public ActionResult AssetsUseDetails()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetAllAssetsUseDetails(DateTime? DateFrom, DateTime? DateTo, int? TranId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.AssetsUseDetails(User.UserId, User.HostName, User.DBName).GetAllAssetsUseDetails(0, DateFrom, DateTo, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "AssetWise"
        public ActionResult AssetWise()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAllAssetWiseReport(DateTime? DateFrom, DateTime? DateTo, int? TranId, int? BranchId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.AssetWiseReport(User.UserId, User.HostName, User.DBName).GetAllAssetWiseReport(0, DateFrom, DateTo, TranId, BranchId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion


        #region "EmployeeWiseAssetsDetails"
        public ActionResult EmployeeWiseAssetsDetails()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult GetEmployeeWiseAssetsDet(int? UsersId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Report.EmployeeWiseAssetsDetails(User.UserId, User.HostName, User.DBName).GetEmployeeWiseAssetsDet(0, UsersId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion


        #region "GetPendingAssetsRquest"

        [HttpPost]
        public JsonNetResult GetPendingAssetsRequest(string RequestNo, int? RequestBy, int? BranchId, int? DepartmentId, int? RequestUserId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetRequest(User.UserId, User.HostName, User.DBName).GetPendingAssetsRquest(RequestNo, RequestBy, BranchId, DepartmentId, RequestUserId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "GetPendingAssetsIssue"

        [HttpPost]
        public JsonNetResult GetPendingAssetsIssue(string IssueNo, int? IssueBy, int? BranchId, int? DepartmentId, int? IssueUserId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetIssue(User.UserId, User.HostName, User.DBName).GetPendingAssetsIssue(IssueNo, IssueBy, BranchId, DepartmentId, IssueUserId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "GetPendingDamageDetails"

        [HttpPost]
        public JsonNetResult GetPendingDamageDetails(int? VendorId)
        {
            var dataColl = new Dynamic.BL.AssetManagement.Assetdamage(User.UserId, User.HostName, User.DBName).GetPendingDamageDetails(VendorId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "Asset Opening List"
        public ActionResult AssetsOpeningList()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAssetsOpeningList(DateTime? DateFrom, DateTime? DateTo)
        {
            var dataColl = new Dynamic.BL.AssetManagement.AssetOpening(User.UserId, User.HostName, User.DBName).GetAssetsOpeningList(0, DateFrom, DateTo);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

    }
}