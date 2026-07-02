using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Hospital.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // GET: Hospital/Creation
		string photoLocation = "/Attachments/Hospital";

		[HttpGet]
		public JsonNetResult GetAllCostCenter()
		{
			var dataColl = new Dynamic.BusinessLogic.Account.CostCenter( User.HostName, User.DBName).getAllAsList(User.UserId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpGet]
		public JsonNetResult GetAllCostClass()
		{
			var dataColl = new Dynamic.BusinessLogic.Account.CostClass(User.HostName, User.DBName).getAllAsList(User.UserId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpGet]
		public JsonNetResult GetAllAccountingVoucherTypes()
		{
			var dataColl = new Dynamic.BusinessLogic.Account.VoucherMode(User.HostName, User.DBName).getAllAsList(User.UserId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		#region "OPDTicketType"
		public ActionResult OPDTicketType()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveOPDTicketType()
		{

			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.OPDTicketType>(Request["jsonData"]);
				if (beData != null)
				{
					bool isModify = false;
					beData.CUserId = User.UserId;
					if (beData.OpDTicketTypeId > 0)
						isModify = true;
					resVal = new Dynamic.BL.Hospital.OPDTicketType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
				}
				else
				{
					resVal.ResponseMSG = "Blank data Can't be Accept";
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
		public JsonNetResult GetAllOPDTicketType()
		{
			var dataColl = new Dynamic.BL.Hospital.OPDTicketType(User.UserId, User.HostName, User.DBName).GetAllODPTicketTypes(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult GetOPDTicketTypeById(int OpDTicketTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.OPDTicketType(User.UserId, User.HostName, User.DBName).GetOPDTicketTypeById(0, OpDTicketTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}


		[HttpPost]
		public JsonNetResult DelOPDTicketType(int OpDTicketTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.OPDTicketType(User.UserId, User.HostName, User.DBName).DeleteById(0, OpDTicketTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "OPDServiceType"
		public ActionResult OPDServiceType()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveOPDServiceType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.OPDServiceType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.OPDServiceTypeId.HasValue)
						beData.OPDServiceTypeId = 0;

					resVal = new Dynamic.BL.Hospital.OPDServiceType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllOPDServiceType()
		{
			var dataColl = new Dynamic.BL.Hospital.OPDServiceType(User.UserId, User.HostName, User.DBName).GetAllOPDServiceType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetOPDServiceTypeById(int OPDServiceTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.OPDServiceType(User.UserId, User.HostName, User.DBName).GetOPDServiceTypeById(0, OPDServiceTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelOPDServiceType(int OPDServiceTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.OPDServiceType(User.UserId, User.HostName, User.DBName).DeleteById(0, OPDServiceTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "Department"

		public ActionResult Department()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveDepartment()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Department>(Request["jsonData"]);
				if (beData != null)
				{
					if (Request.Files.Count > 0)
					{
						var filesColl = Request.Files;
						var DoctorSignature = filesColl["DoctorSignature"];
						if (DoctorSignature != null)
						{
							var SignImg = GetAttachmentDocuments(photoLocation, DoctorSignature, true);
							beData.Photo = SignImg.Data;
							beData.DoctorSign = SignImg.DocPath;
						}
					}
					beData.CUserId = User.UserId;
					if (!beData.DepartmentId.HasValue)
						beData.DepartmentId = 0;

					resVal = new Dynamic.BL.Hospital.Department(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDepartment()
		{
			var dataColl = new Dynamic.BL.Hospital.Department(User.UserId, User.HostName, User.DBName).GetAllDepartment(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetDepartmentById(int DepartmentId)
		{
			var dataColl = new Dynamic.BL.Hospital.Department(User.UserId, User.HostName, User.DBName).GetDepartmentById(0, DepartmentId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDepartment(int DepartmentId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Department(User.UserId, User.HostName, User.DBName).DeleteById(0, DepartmentId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}

		#endregion


		#region "AdmissionType"
		public ActionResult AdmitionType()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveAdmissionType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.AdmissionType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.AdmissionTypeId.HasValue)
						beData.AdmissionTypeId = 0;

					resVal = new Dynamic.BL.Hospital.AdmissionType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllAdmissionType()
		{
			var dataColl = new Dynamic.BL.Hospital.AdmissionType(User.UserId, User.HostName, User.DBName).GetAllAdmissionType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetAdmissionTypeById(int AdmissionTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.AdmissionType(User.UserId, User.HostName, User.DBName).GetAdmissionTypeById(0, AdmissionTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelAdmissionType(int AdmissionTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.AdmissionType(User.UserId, User.HostName, User.DBName).DeleteById(0, AdmissionTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "DischargeType"
		public ActionResult DischargeType()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveDischargeType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.DischargeType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DischargeTypeId.HasValue)
						beData.DischargeTypeId = 0;

					resVal = new Dynamic.BL.Hospital.DischargeType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDischargeType()
		{
			var dataColl = new Dynamic.BL.Hospital.DischargeType(User.UserId, User.HostName, User.DBName).GetAllDischargeType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetDischargeTypeById(int DischargeTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.DischargeType(User.UserId, User.HostName, User.DBName).GetDischargeTypeById(0, DischargeTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDischargeType(int DischargeTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.DischargeType(User.UserId, User.HostName, User.DBName).DeleteById(0, DischargeTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "DiscountType"
		public ActionResult DiscountType()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveDiscountType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.DiscountType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DiscountTypeId.HasValue)
						beData.DiscountTypeId = 0;

					resVal = new Dynamic.BL.Hospital.DiscountType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDiscountType()
		{
			var dataColl = new Dynamic.BL.Hospital.DiscountType(User.UserId, User.HostName, User.DBName).GetAllDiscountType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetDiscountTypeById(int DiscountTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.DiscountType(User.UserId, User.HostName, User.DBName).GetDiscountTypeById(0, DiscountTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDiscountType(int DiscountTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.DiscountType(User.UserId, User.HostName, User.DBName).DeleteById(0, DiscountTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "BillingType"
		public ActionResult BillingType()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveBillingType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.BillingType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.BillingTypeId.HasValue)
						beData.BillingTypeId = 0;

					resVal = new Dynamic.BL.Hospital.BillingType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllBillingType()
		{
			var dataColl = new Dynamic.BL.Hospital.BillingType(User.UserId, User.HostName, User.DBName).GetAllBillingType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetBillingTypeById(int BillingTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.BillingType(User.UserId, User.HostName, User.DBName).GetBillingTypeById(0, BillingTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelBillingType(int BillingTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.BillingType(User.UserId, User.HostName, User.DBName).DeleteById(0, BillingTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "DepositType"
		public ActionResult DepositType()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveDepositeType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.DepositeType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DepositeTypeId.HasValue)
						beData.DepositeTypeId = 0;

					resVal = new Dynamic.BL.Hospital.DepositeType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDepositeType()
		{
			var dataColl = new Dynamic.BL.Hospital.DepositeType(User.UserId, User.HostName, User.DBName).GetAllDepositeType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetDepositeTypeById(int DepositeTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.DepositeType(User.UserId, User.HostName, User.DBName).GetDepositeTypeById(0, DepositeTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDepositeType(int DepositeTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.DepositeType(User.UserId, User.HostName, User.DBName).DeleteById(0, DepositeTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Diagnosis"
		public ActionResult Diagnosis()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveDiagnosis()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Diagnosis>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DiagnosisId.HasValue)
						beData.DiagnosisId = 0;

					resVal = new Dynamic.BL.Hospital.Diagnosis(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDiagnosis()
		{
			var dataColl = new Dynamic.BL.Hospital.Diagnosis(User.UserId, User.HostName, User.DBName).GetAllDiagnosis(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetDiagnosisById(int DiagnosisId)
		{
			var dataColl = new Dynamic.BL.Hospital.Diagnosis(User.UserId, User.HostName, User.DBName).GetDiagnosisById(0, DiagnosisId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDiagnosis(int DiagnosisId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Diagnosis(User.UserId, User.HostName, User.DBName).DeleteById(0, DiagnosisId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Vital"
		public ActionResult Vital()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveVital()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Vital>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.VitalId.HasValue)
						beData.VitalId = 0;

					resVal = new Dynamic.BL.Hospital.Vital(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllVital()
		{
			var dataColl = new Dynamic.BL.Hospital.Vital(User.UserId, User.HostName, User.DBName).GetAllVital(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetVitalById(int VitalId)
		{
			var dataColl = new Dynamic.BL.Hospital.Vital(User.UserId, User.HostName, User.DBName).GetVitalById(0, VitalId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelVital(int VitalId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Vital(User.UserId, User.HostName, User.DBName).DeleteById(0, VitalId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Service"
		public ActionResult Service()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveService()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Service>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.ServiceId.HasValue)
						beData.ServiceId = 0;

					resVal = new Dynamic.BL.Hospital.Service(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllService()
		{
			var dataColl = new Dynamic.BL.Hospital.Service(User.UserId, User.HostName, User.DBName).GetAllService(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetServiceById(int ServiceId)
		{
			var dataColl = new Dynamic.BL.Hospital.Service(User.UserId, User.HostName, User.DBName).GetServiceById(0, ServiceId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelService(int ServiceId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Service(User.UserId, User.HostName, User.DBName).DeleteById(0, ServiceId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Designation"
		public ActionResult Designation()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveDesignation()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Designation>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DesignationId.HasValue)
						beData.DesignationId = 0;

					resVal = new Dynamic.BL.Hospital.Designation(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDesignation()
		{
			var dataColl = new Dynamic.BL.Hospital.Designation(User.UserId, User.HostName, User.DBName).GetAllDesignation(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetDesignationById(int DesignationId)
		{
			var dataColl = new Dynamic.BL.Hospital.Designation(User.UserId, User.HostName, User.DBName).GetDesignationById(0, DesignationId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDesignation(int DesignationId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Designation(User.UserId, User.HostName, User.DBName).DeleteById(0, DesignationId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Ethinicity"
		public ActionResult Ethinicity()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveEthinicity()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Ethinicity>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.EthinicityId.HasValue)
						beData.EthinicityId = 0;

					resVal = new Dynamic.BL.Hospital.Ethinicity(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllEthinicity()
		{
			var dataColl = new Dynamic.BL.Hospital.Ethinicity(User.UserId, User.HostName, User.DBName).GetAllEthinicity(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetEthinicityById(int EthinicityId)
		{
			var dataColl = new Dynamic.BL.Hospital.Ethinicity(User.UserId, User.HostName, User.DBName).GetEthinicityById(0, EthinicityId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelEthinicity(int EthinicityId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Ethinicity(User.UserId, User.HostName, User.DBName).DeleteById(0, EthinicityId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Donar"
		public ActionResult Donar()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveDonar()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Donar>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DonarId.HasValue)
						beData.DonarId = 0;

					resVal = new Dynamic.BL.Hospital.Donar(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDonar()
		{
			var dataColl = new Dynamic.BL.Hospital.Donar(User.UserId, User.HostName, User.DBName).GetAllDonar(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetDonarById(int DonarId)
		{
			var dataColl = new Dynamic.BL.Hospital.Donar(User.UserId, User.HostName, User.DBName).GetDonarById(0, DonarId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDonar(int DonarId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Donar(User.UserId, User.HostName, User.DBName).DeleteById(0, DonarId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Disability"
		public ActionResult Disability()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveDisability()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Disability>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.DisabilityId.HasValue)
						beData.DisabilityId = 0;

					resVal = new Dynamic.BL.Hospital.Disability(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDisability()
		{
			var dataColl = new Dynamic.BL.Hospital.Disability(User.UserId, User.HostName, User.DBName).GetAllDisability(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetDisabilityById(int DisabilityId)
		{
			var dataColl = new Dynamic.BL.Hospital.Disability(User.UserId, User.HostName, User.DBName).GetDisabilityById(0, DisabilityId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDisability(int DisabilityId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Disability(User.UserId, User.HostName, User.DBName).DeleteById(0, DisabilityId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "Doctor"
		public ActionResult Doctor()
        {
            return View();
        }


		[HttpPost]
		public JsonNetResult AutoNumberForDoctor()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Doctor(User.UserId, User.HostName, User.DBName).AutoNumberForDoctor(0);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}


		[HttpPost]
		public JsonNetResult SaveDoctor()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Doctor>(Request["jsonData"]);
				if (beData != null)
				{
					if (Request.Files.Count > 0)
					{
						var filesColl = Request.Files;
						var DoctorImg = filesColl["DoctorImg"];
						var DoctorSign = filesColl["DoctorSign"];
						if (DoctorImg != null)
						{
							var Image = GetAttachmentDocuments(photoLocation, DoctorImg, true);
							beData.PhotoB = Image.Data;
							beData.PhotoPath = Image.DocPath;
						}
						if (DoctorSign != null)
						{
							var Image = GetAttachmentDocuments(photoLocation, DoctorSign, true);
							beData.PhotoB = Image.Data;
							beData.DoctorSignature = Image.DocPath;
						}
					}

					beData.CUserId = User.UserId;
					if (!beData.DoctorId.HasValue)
						beData.DoctorId = 0;

					resVal = new Dynamic.BL.Hospital.Doctor(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllDoctor()
		{
			var dataColl = new Dynamic.BL.Hospital.Doctor(User.UserId, User.HostName, User.DBName).GetAllDoctor(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetDoctorById(int DoctorId)
		{
			var dataColl = new Dynamic.BL.Hospital.Doctor(User.UserId, User.HostName, User.DBName).GetDoctorById(0, DoctorId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelDoctor(int DoctorId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Doctor(User.UserId, User.HostName, User.DBName).DeleteById(0, DoctorId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
        #endregion

        #region "Building Details"

        #region "BuildingType"
        public ActionResult BuildingType()
		{
			return View();
		}
		
		[HttpPost]
		public JsonNetResult SaveBuildingType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.BuildingType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.BuildingTypeId.HasValue)
						beData.BuildingTypeId = 0;

					resVal = new Dynamic.BL.Hospital.BuildingType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllBuildingType()
		{
			var dataColl = new Dynamic.BL.Hospital.BuildingType(User.UserId, User.HostName, User.DBName).GetAllBuildingType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetBuildingTypeById(int BuildingTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.BuildingType(User.UserId, User.HostName, User.DBName).GetBuildingTypeById(0, BuildingTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelBuildingType(int BuildingTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.BuildingType(User.UserId, User.HostName, User.DBName).DeleteById(0, BuildingTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "Floor"
		public ActionResult Floor()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveFloor()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Floor>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.FloorId.HasValue)
						beData.FloorId = 0;

					resVal = new Dynamic.BL.Hospital.Floor(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllFloor()
		{
			var dataColl = new Dynamic.BL.Hospital.Floor(User.UserId, User.HostName, User.DBName).GetAllFloor(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetFloorById(int FloorId)
		{
			var dataColl = new Dynamic.BL.Hospital.Floor(User.UserId, User.HostName, User.DBName).GetFloorById(0, FloorId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelFloor(int FloorId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Floor(User.UserId, User.HostName, User.DBName).DeleteById(0, FloorId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Room"
		public ActionResult Room()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveRoom()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Room>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.RoomId.HasValue)
						beData.RoomId = 0;

					resVal = new Dynamic.BL.Hospital.Room(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllRoom()
		{
			var dataColl = new Dynamic.BL.Hospital.Room(User.UserId, User.HostName, User.DBName).GetAllRoom(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetRoomById(int RoomId)
		{
			var dataColl = new Dynamic.BL.Hospital.Room(User.UserId, User.HostName, User.DBName).GetRoomById(0, RoomId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelRoom(int RoomId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Room(User.UserId, User.HostName, User.DBName).DeleteById(0, RoomId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Ward"
		public ActionResult Ward()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveWard()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Ward>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.WardId.HasValue)
						beData.WardId = 0;

					resVal = new Dynamic.BL.Hospital.Ward(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllWard()
		{
			var dataColl = new Dynamic.BL.Hospital.Ward(User.UserId, User.HostName, User.DBName).GetAllWard(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetWardById(int WardId)
		{
			var dataColl = new Dynamic.BL.Hospital.Ward(User.UserId, User.HostName, User.DBName).GetWardById(0, WardId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelWard(int WardId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Ward(User.UserId, User.HostName, User.DBName).DeleteById(0, WardId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Bed"
		public ActionResult Bed()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveBed()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.Bed>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.BedId.HasValue)
						beData.BedId = 0;

					resVal = new Dynamic.BL.Hospital.Bed(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllBed()
		{
			var dataColl = new Dynamic.BL.Hospital.Bed(User.UserId, User.HostName, User.DBName).GetAllBed(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetBedById(int BedId)
		{
			var dataColl = new Dynamic.BL.Hospital.Bed(User.UserId, User.HostName, User.DBName).GetBedById(0, BedId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelBed(int BedId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.Bed(User.UserId, User.HostName, User.DBName).DeleteById(0, BedId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "BedMapping"
		public ActionResult BedMapping()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveBedMapping()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.BedMapping>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.TranId.HasValue)
						beData.TranId = 0;

					resVal = new Dynamic.BL.Hospital.BedMapping(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllBedMapping()
		{
			var dataColl = new Dynamic.BL.Hospital.BedMapping(User.UserId, User.HostName, User.DBName).GetAllBedMapping(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetBedMappingById(int TranId)
		{
			var dataColl = new Dynamic.BL.Hospital.BedMapping(User.UserId, User.HostName, User.DBName).GetBedMappingById(0, TranId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelBedMapping(int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.BedMapping(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
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


		#region "CommissionType"
		public ActionResult CommissionType()
		{
			return View();
		}
		[HttpPost]
		public JsonNetResult SaveCommissionType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.CommissionType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.CommissionTypeId.HasValue)
						beData.CommissionTypeId = 0;

					resVal = new Dynamic.BL.Hospital.CommissionType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllCommissionType()
		{
			var dataColl = new Dynamic.BL.Hospital.CommissionType(User.UserId, User.HostName, User.DBName).GetAllCommissionType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetCommissionTypeById(int CommissionTypeId)
		{
			var dataColl = new Dynamic.BL.Hospital.CommissionType(User.UserId, User.HostName, User.DBName).GetCommissionTypeById(0, CommissionTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelCommissionType(int CommissionTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.CommissionType(User.UserId, User.HostName, User.DBName).DeleteById(0, CommissionTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}


		#endregion


		#region "HMSVoucher"
		public ActionResult HMSVoucher()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveHMSVoucher()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Hospital.HMSVoucher>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.VoucherId.HasValue)
						beData.VoucherId = 0;

					resVal = new Dynamic.BL.Hospital.HMSVoucher(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllHMSVoucher()
		{
			var dataColl = new Dynamic.BL.Hospital.HMSVoucher(User.UserId, User.HostName, User.DBName).GetAllHMSVoucher(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetHMSVoucherById(int VoucherId)
		{
			var dataColl = new Dynamic.BL.Hospital.HMSVoucher(User.UserId, User.HostName, User.DBName).GetHMSVoucherById(0, VoucherId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelHMSVoucher(int VoucherId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Hospital.HMSVoucher(User.UserId, User.HostName, User.DBName).DeleteById(0, VoucherId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "DiscountCommissionMapping"
		public ActionResult DiscountCommisionMapping()
		{
			return View();
		}


		[HttpPost]
		public JsonNetResult GetAllDiscountCommissionMapping()
		{
			var dataColl = new Dynamic.BL.Hospital.DiscountCommissionMapping(User.UserId, User.HostName, User.DBName).GetAllDiscountCommissionMapping(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult SaveDiscountMapping()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<List<Dynamic.BE.Hospital.DiscountCommissionMapping>>(Request["jsonData"]);
				if (beData != null)
				{
					resVal = new Dynamic.BL.Hospital.DiscountCommissionMapping(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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