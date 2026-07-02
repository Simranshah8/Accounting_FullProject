using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
namespace PivotalERP.Areas.Lab.Controllers
{
    public class TransactionController : PivotalERP.Controllers.BaseController
	{
		string photoLocation = "/Attachments/Lab";
		// GET: Lab/Report
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_TemplateTypes)]
		public ActionResult LabReportTemplate()
        {
            return View();
        }
		public ActionResult AddResult()
		{
			return View();
		}
		public ActionResult PendingReports()
		{
			return View();
		}

		public ActionResult SampleCollection()
		{
			return View();
		}

		#region "LabReportTemplate"
		[HttpPost]
		public JsonNetResult SaveLabReportTemplate()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.LabReportTemplate>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					//if (!beData.TranId.HasValue)
					if (beData.TranId == null)
						beData.TranId = 0;

					//Added from here
					bool isModify = false;
					if (beData.TranId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_TemplateTypes, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_TemplateTypes, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
						}
						else
						{
							resVal.IsSuccess = false;
							resVal.ResponseMSG = "Access denied";
							return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
						}
					}

					if (resVal.IsSuccess)
					{
						Dynamic.BusinessEntity.Global.AuditLog auditLog = new Dynamic.BusinessEntity.Global.AuditLog();
						auditLog.TranId = (isModify ? beData.TranId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_TemplateTypes;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.TemplateName : "New " + auditLog.EntityId.ToString()) + beData.TemplateName;
						auditLog.AutoManualNo = IsNullStr(beData.TemplateName);
						SaveAuditLog(auditLog);
					}
					//ends		
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
		public JsonNetResult GetLabReportTemplateById()
		{
			var dataColl = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).GetLabReportTemplateById(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_TemplateTypes)]
		public JsonNetResult DelLabReportTemplate(int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllLabReportTemplate()
		{
			var dataColl = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).GetAllLabReportTemplate(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		#endregion

		#region "HeaderFooterConfig"
		[HttpPost]
		public JsonNetResult SaveHeaderFooterConfig()
		{

			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.HeaderFooterConfig>(Request["jsonData"]);
				if (beData != null)
				{
					if (Request.Files.Count > 0)
					{
						var filesColl = Request.Files;
						var Sign1 = filesColl["Sign1"];
						var Sign2 = filesColl["Sign2"];

						if (Sign1 != null)
						{
							var Sign1photo = GetAttachmentDocuments(photoLocation, Sign1, true);
							beData.Photo = Sign1photo.Data;
							beData.Signature1 = Sign1photo.DocPath;
						}

						if (Sign2 != null)
						{
							var Sign2photo = GetAttachmentDocuments(photoLocation, Sign2, true);
							beData.Photo = Sign2photo.Data;
							beData.Signature2 = Sign2photo.DocPath;
						}
					}

					beData.CUserId = User.UserId;

					if (!beData.TranId.HasValue)
						beData.TranId = 0;

					resVal = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).SaveConfigFormData(beData);
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
		public JsonNetResult GetAllHeaderFooterConfig()
		{
			var dataColl = new Dynamic.BL.Lab.LabReportTemplate(User.UserId, User.HostName, User.DBName).GetHeaderFooterConfig(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		#endregion



		#region "Sample Collection"

		[HttpPost]
		public JsonNetResult GetAllSampleCollection(DateTime? FromDate, DateTime? ToDate)
		{
			var dataColl = new Dynamic.BL.Lab.SampleCollect(User.UserId, User.HostName, User.DBName).GetAllSampleCollection(0, FromDate, ToDate);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult GetBillingDetails(int BillingId,bool IsSampleCollected)
		{
			var dataColl = new Dynamic.BL.Lab.SampleCollect(User.UserId, User.HostName, User.DBName).GetBillingDetails(BillingId, IsSampleCollected);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GenerateSampleBarCode(int EntityId)
		{
			var dataColl = new Dynamic.BL.Lab.SampleCollect(User.UserId, User.HostName, User.DBName).GenerateSampleBarCode(EntityId);
			return new JsonNetResult() { Data = dataColl, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}


		[HttpPost]
		public JsonNetResult SaveSampleCollection()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<List<Dynamic.BE.Lab.BillingDetails>>(Request["jsonData"]);
				if (beData != null)
				{
					resVal = new Dynamic.BL.Lab.SampleCollect(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
		#endregion

		[HttpPost]
		public JsonNetResult GenerateBarCodeImg(string code)
		{

			var dataColl = Dynamic.ReportEngine.RDL.VBFunctions.GenerateBarCode(code);
			string base64 = Convert.ToBase64String(dataColl);
			string base64Image = $"data:image/png;base64,{base64}";

			return new JsonNetResult() { Data = base64Image, TotalCount = 0, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
		}



		#region "Add Result"

		[HttpPost]
		public JsonNetResult GetAllAddResult(DateTime? FromDate, DateTime? ToDate, string GroupIdColl = "")
		{
			var dataColl = new Dynamic.BL.Lab.AddResult(User.UserId, User.HostName, User.DBName).GetAllAddResult(0, FromDate, ToDate, GroupIdColl);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult GetAddResult(int BarCodeNumber, int Age, string Gender)
		{
			var dataColl = new Dynamic.BL.Lab.AddResult(User.UserId, User.HostName, User.DBName).GetAddResult(BarCodeNumber, Age, Gender);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult SaveAddResult()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<List<Dynamic.BE.Lab.AddResult>>(Request["jsonData"]);
				if (beData != null)
				{
					resVal = new Dynamic.BL.Lab.AddResult(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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

		#endregion
	
		#region "Pending Report"

		[HttpPost]
		public JsonNetResult GetPendingReportById(int BarCodeNumber)
		{
			var dataColl = new Dynamic.BL.Lab.PendingReport(User.UserId, User.HostName, User.DBName).GetPendingReportById(BarCodeNumber);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}


		[HttpPost]
		public JsonNetResult GetAllPendingReport( int Status, DateTime? FromDate, DateTime? ToDate, string GroupIdColl = "")
		{
			var dataColl = new Dynamic.BL.Lab.PendingReport(User.UserId, User.HostName, User.DBName).GetAllPendingReport(0, Status, FromDate, ToDate, GroupIdColl);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}


		[HttpPost]
		public JsonNetResult VerifyPendingReport()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<List<Dynamic.BE.Lab.PendingReport>>(Request["jsonData"]);
				if (beData != null)
				{
					resVal = new Dynamic.BL.Lab.PendingReport(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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

		#endregion

	}
}