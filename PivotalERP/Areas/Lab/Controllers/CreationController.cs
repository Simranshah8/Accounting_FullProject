using Dynamic.BusinessEntity.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.Lab.Controllers
{
	public class CreationController : PivotalERP.Controllers.BaseController
	{	
		// GET: Lab/Creation
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_LabTests)]
		public ActionResult LabTests()
		{
			return View();
		}

		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_Answerset)]
		public ActionResult Lookups()
		{
			return View();
		}
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_Packages)]
		public ActionResult Packages()
		{
			return View();
		}
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_RefRules)]
		public ActionResult RefRules()
		{
			return View();
		}

		#region "Specimen"
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_SpecimenTypes)]
		public ActionResult Specimens()
		{
			return View();
		}
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_Containers)]
		public ActionResult Containers()
		{
			return View();
		}
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_Units)]
		public ActionResult Units()
		{
			return View();
		}
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_Methods)]
		public ActionResult Methods()
		{
			return View();
		}
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Lab_Components)]
		public ActionResult Components()
		{
			return View();
		}

		public ActionResult LabCategory()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveSpecimenType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.SpecimenType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (beData.SpecimenTypeId==null)
						beData.SpecimenTypeId = 0;

					//Added from here
					bool isModify = false;
					if (beData.SpecimenTypeId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_SpecimenTypes, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.SpecimenType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_SpecimenTypes, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.SpecimenType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.SpecimenTypeId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_SpecimenTypes;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Name : "New " + auditLog.EntityId.ToString()) + beData.Name;
						auditLog.AutoManualNo = IsNullStr(beData.Name);
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
		public JsonNetResult GetAllSpecimenType()
		{
			var dataColl = new Dynamic.BL.Lab.SpecimenType(User.UserId, User.HostName, User.DBName).GetAllSpecimenType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult GetSpecimenTypeById(int SpecimenTypeId)
		{
			var dataColl = new Dynamic.BL.Lab.SpecimenType(User.UserId, User.HostName, User.DBName).GetSpecimenTypeById(0, SpecimenTypeId);
			return new JsonNetResult()
			{
				Data = dataColl,
				TotalCount = 0,
				IsSuccess = dataColl.IsSuccess,
				ResponseMSG = dataColl.ResponseMSG
			};
		}

		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_SpecimenTypes)]
		public JsonNetResult DelSpecimenType(int SpecimenTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.SpecimenType(User.UserId, User.HostName, User.DBName).DeleteById(0, SpecimenTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}

		#endregion

		#region "Containers"	
		[HttpPost]
		public JsonNetResult Savelab_ContainerType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.lab_ContainerType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					//if (!beData.ContainerTypeId.HasValue)
					//	beData.ContainerTypeId = 0;
					if (beData.ContainerTypeId == null)
						beData.ContainerTypeId = 0;

					//Added from here
					bool isModify = false;
					if (beData.ContainerTypeId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_Containers, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.lab_ContainerType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Ledger, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.lab_ContainerType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.ContainerTypeId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_Containers;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.ContainerName : "New " + auditLog.EntityId.ToString()) + beData.ContainerName;
						auditLog.AutoManualNo = IsNullStr(beData.ContainerName);
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
		public JsonNetResult GetAlllab_ContainerType()
		{
			var dataColl = new Dynamic.BL.lab_ContainerType(User.UserId, User.HostName, User.DBName).GetAlllab_ContainerType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult Getlab_ContainerTypeById(int ContainerTypeId)
		{
			var dataColl = new Dynamic.BL.lab_ContainerType(User.UserId, User.HostName, User.DBName).Getlab_ContainerTypeById(0, ContainerTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_Containers)]
		public JsonNetResult Dellab_ContainerType(int ContainerTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.lab_ContainerType(User.UserId, User.HostName, User.DBName).DeleteById(0, ContainerTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}

		#endregion

		#region "lab_Unit"
		
		[HttpPost]

		public JsonNetResult Savelab_Unit()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.lab_Unit>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (beData.UnitId == null)
						beData.UnitId = 0;

					//New code added
					bool isModify = false;
					if (beData.UnitId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_Units, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.lab_Unit(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_Units, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.lab_Unit(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						Dynamic.BusinessEntity.Global.AuditLog auditLog = new AuditLog();
						auditLog.TranId = (isModify ? beData.UnitId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_Units;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Symbol : "New " + auditLog.EntityId.ToString()) + beData.Symbol;
						auditLog.AutoManualNo = IsNullStr(beData.Symbol);
						SaveAuditLog(auditLog);
					}
					//Ends				

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
		public JsonNetResult GetAlllab_Unit()
		{
			var dataColl = new Dynamic.BL.lab_Unit(User.UserId, User.HostName, User.DBName).GetAlllab_Unit(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult Getlab_UnitById(int UnitId)
		{
			var dataColl = new Dynamic.BL.lab_Unit(User.UserId, User.HostName, User.DBName).Getlab_UnitById(0, UnitId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_Units)]
		public JsonNetResult Dellab_Unit(int UnitId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.lab_Unit(User.UserId, User.HostName, User.DBName).DeleteById(0, UnitId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Method"
			
		[HttpPost]
		public JsonNetResult GetAutoCode()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.lab_Method(User.UserId, User.HostName, User.DBName).GetAutoCode(User.UserId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult Savelab_Method()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.lab_Method>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (beData.MethodId == null)
						beData.MethodId = 0;

					//Added from here
					bool isModify = false;
					if (beData.MethodId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_Methods, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.lab_Method(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_Methods, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.lab_Method(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.MethodId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_Methods;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Name : "New " + auditLog.EntityId.ToString()) + beData.Name;
						auditLog.AutoManualNo = IsNullStr(beData.Name);
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
		public JsonNetResult GetAlllab_Method()
		{
			var dataColl = new Dynamic.BL.lab_Method(User.UserId, User.HostName, User.DBName).GetAlllab_Method(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]

		public JsonNetResult Getlab_MethodById(int MethodId)
		{
			var dataColl = new Dynamic.BL.lab_Method(User.UserId, User.HostName, User.DBName).Getlab_MethodById(0, MethodId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_Methods)]
		public JsonNetResult Dellab_Method(int MethodId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.lab_Method(User.UserId, User.HostName, User.DBName).DeleteById(0, MethodId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "Components"			

		[HttpPost]
		public JsonNetResult SaveLabComponents()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.Components>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (beData.ComponentId == null)
						beData.ComponentId = 0;

					//Added from here
					bool isModify = false;
					if (beData.ComponentId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_Components, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.Components(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_Components, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.Components(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.ComponentId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_Components;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Name : "New " + auditLog.EntityId.ToString()) + beData.Name;
						auditLog.AutoManualNo = IsNullStr(beData.Name);
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
		public JsonNetResult GetAllLabComponents()
		{
			var dataColl = new Dynamic.BL.Lab.Components(User.UserId, User.HostName, User.DBName).GetAllLabComponents(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult GetLabComponentsById(int ComponentId)
		{
			var dataColl = new Dynamic.BL.Lab.Components(User.UserId, User.HostName, User.DBName).GetLabComponentsById(0, ComponentId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_Components)]
		public JsonNetResult DelLabComponents(int ComponentId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.Components(User.UserId, User.HostName, User.DBName).DeleteById(0, ComponentId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}


		public JsonNetResult GetAutoComponentCode()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.Components(User.UserId, User.HostName, User.DBName).GetAutoComponentCode(User.UserId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		#region "RefRules"

		
		[HttpPost]
		public JsonNetResult SavelabReferenceRule()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.ReferenceRule>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					//if (!beData.RefRuleId.HasValue)
					if (beData.RefRuleId == null)
						beData.RefRuleId = 0;

					//Added from here
					bool isModify = false;
					if (beData.RefRuleId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_RefRules, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.ReferenceRule(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_RefRules, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.ReferenceRule(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.RefRuleId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_RefRules;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.TestName : "New " + auditLog.EntityId.ToString()) + beData.TestName;
						auditLog.AutoManualNo = IsNullStr(beData.TestName);
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
		public JsonNetResult GetAllLabReferenceRule()
		{
			var dataColl = new Dynamic.BL.Lab.ReferenceRule(User.UserId, User.HostName, User.DBName).GetAllLabReferenceRule(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		public JsonNetResult GetLabReferenceRuleById(int RefRuleId)
		{
			var dataColl = new Dynamic.BL.Lab.ReferenceRule(User.UserId, User.HostName, User.DBName).GetLabReferenceRuleById(0, RefRuleId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_RefRules)]
		public JsonNetResult DelLabReferenceRule(int RefRuleId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.ReferenceRule(User.UserId, User.HostName, User.DBName).DeleteById(0, RefRuleId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}

		#endregion



		#region "lab_AnswerSetValue"
		[HttpPost]
		public JsonNetResult SaveLabAnswerSetValue()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.AnswerSetValue>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					//if (!beData.LookupId.HasValue)
					if (beData.LookupId == null)
						beData.LookupId = 0;
					//Added from here
					bool isModify = false;
					if (beData.LookupId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_Answerset, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.AnswerSetValue(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_Answerset, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.AnswerSetValue(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.LookupId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_Answerset;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Name : "New " + auditLog.EntityId.ToString()) + beData.Name;
						auditLog.AutoManualNo = IsNullStr(beData.Name);
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
		public JsonNetResult GetAllLabAnswerSetValue()
		{
			var dataColl = new Dynamic.BL.Lab.AnswerSetValue(User.UserId, User.HostName, User.DBName).GetAlllab_AnswerSetValue(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetLabAnswerSetValueById(int LookupId)
		{
			var dataColl = new Dynamic.BL.Lab.AnswerSetValue(User.UserId, User.HostName, User.DBName).Getlab_AnswerSetValueById(0, LookupId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_Answerset)]
		public JsonNetResult DelLabAnswerSetValue(int LookupId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.AnswerSetValue(User.UserId, User.HostName, User.DBName).DeleteById(0, LookupId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "lab_Test"
		[HttpPost]
		public JsonNetResult SavelabTest()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.labTest>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					//if (!beData.LabTestId.HasValue)
					if (beData.LabTestId == null)
						beData.LabTestId = 0;

					//Added from here
					bool isModify = false;
					if (beData.LabTestId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_LabTests, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_LabTests, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.LabTestId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_LabTests;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.TestName : "New " + auditLog.EntityId.ToString()) + beData.TestName;
						auditLog.AutoManualNo = IsNullStr(beData.TestName);
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
		public JsonNetResult GetAllLabTest()
		{
			var dataColl = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).GetAlllab_Test(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetLabTestById(int LabTestId)
		{
			var dataColl = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).Getlab_TestById(0, LabTestId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_LabTests)]
		public JsonNetResult DelLabTest(int LabTestId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).DeleteById(0, LabTestId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAutoTestCode()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).GetAutoTestCode(User.UserId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}

		//[HttpPost]
		//public JsonNetResult GetTestComponent(int TestId)
		//{
		//	var dataColl = new Dynamic.BL.Lab.labTest(User.UserId, User.HostName, User.DBName).getTestComponent(0, TestId);
		//	return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		//}

		#endregion

		#region "lab_Package"
		[HttpPost]
		public JsonNetResult SaveLabPackage()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.LabPackage>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					//if (!beData.PackageId.HasValue)
					if (beData.PackageId == null)
						beData.PackageId = 0;

					//Added from here
					bool isModify = false;
					if (beData.PackageId > 0)
					{
						isModify = true;
						var allowAction = checkSecurityEntity(Actions.Modify, (int)FormsEntity.Lab_Packages, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.LabPackage(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						var allowAction = checkSecurityEntity(Actions.Save, (int)FormsEntity.Lab_Packages, false, 0);
						if (allowAction)
						{
							resVal = new Dynamic.BL.Lab.LabPackage(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
						auditLog.TranId = (isModify ? beData.PackageId : resVal.RId);
						auditLog.EntityId = Dynamic.BusinessEntity.Global.FormsEntity.Lab_Packages;
						auditLog.Action = (isModify ? Actions.Modify : Actions.Save);
						auditLog.LogText = (isModify ? "Manual " + auditLog.EntityId.ToString() + " Modify " + beData.Name : "New " + auditLog.EntityId.ToString()) + beData.Name;
						auditLog.AutoManualNo = IsNullStr(beData.Name);
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
		public JsonNetResult GetAllLabPackage()
		{
			var dataColl = new Dynamic.BL.Lab.LabPackage(User.UserId, User.HostName, User.DBName).GetAlllab_Package(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetLabPackageById(int PackageId)
		{
			var dataColl = new Dynamic.BL.Lab.LabPackage(User.UserId, User.HostName, User.DBName).Getlab_PackageById(0, PackageId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		[PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.Lab_Packages)]
		public JsonNetResult DelLabPackage(int PackageId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.LabPackage(User.UserId, User.HostName, User.DBName).DeleteById(0, PackageId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		[HttpGet]
		public JsonNetResult GetAllDepartment()
		{
			Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections dataColl = new Dynamic.BusinessEntity.Account.CostCenterDepartmentCollections();
			try
			{
				dataColl = new Dynamic.DataAccess.Account.CostCenterDepartmentDB(User.HostName, User.DBName).getAllCostCenterDepartment(User.UserId);
				return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
			}
			catch (Exception ee)
			{
				dataColl.IsSuccess = false;
				dataColl.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}


		#region "LabCategory"
		[HttpPost]
		public JsonNetResult SaveLabCategory()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.LabCategory>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.TestGroupId.HasValue)
						beData.TestGroupId = 0;

					resVal = new Dynamic.BL.LabCategory(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllLabCategory()
		{
			var dataColl = new Dynamic.BL.LabCategory(User.UserId, User.HostName, User.DBName).GetAllLabCategory(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetLabCategoryById(int LabCategoryId)
		{
			var dataColl = new Dynamic.BL.LabCategory(User.UserId, User.HostName, User.DBName).GetLabCategoryById(0, LabCategoryId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelLabCategory(int LabCategoryId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.LabCategory(User.UserId, User.HostName, User.DBName).DeleteById(0, LabCategoryId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}



		[HttpPost]

		public JsonNetResult GetAutoLabCategoryCode()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.LabCategory(User.UserId, User.HostName, User.DBName).GetAutoLabCategoryCode(User.UserId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion
		public ActionResult LabTechnician()
		{
			return View();
		}

		#region "LabTechnician"

		string photoLocation = "/Attachments/Lab";
		[HttpPost]
		public JsonNetResult SaveLabTechnician()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.LabTechnician>(Request["jsonData"]);
				if (beData != null)
				{
					if (Request.Files.Count > 0)
					{
						var filesColl = Request.Files;
						var Sign = filesColl["Sign"];

						if (Sign != null)
						{
							var Signphoto = GetAttachmentDocuments(photoLocation, Sign, true);
							beData.Photo = Signphoto.Data;
							beData.Signature = Signphoto.DocPath;
						}


					}
					beData.CUserId = User.UserId;
					if (!beData.LabTechnicianId.HasValue)
						beData.LabTechnicianId = 0;

					resVal = new Dynamic.BL.Lab.LabTechnician(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllLabTechnician()
		{
			var dataColl = new Dynamic.BL.Lab.LabTechnician(User.UserId, User.HostName, User.DBName).GetAllLabTechnician(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetLabTechnicianById(int LabTechnicianId)
		{
			var dataColl = new Dynamic.BL.Lab.LabTechnician(User.UserId, User.HostName, User.DBName).GetLabTechnicianById(0, LabTechnicianId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelLabTechnician(int LabTechnicianId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.LabTechnician(User.UserId, User.HostName, User.DBName).DeleteById(0, LabTechnicianId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion


		#region "EntityNumberingSystem"
		public ActionResult EntityNumberingSystem()
		{
			return View();
		}

		[HttpPost]
		public JsonNetResult SaveEntityNumberingSystem()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.Lab.EntityNumberingSystem>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.TranId.HasValue)
						beData.TranId = 0;

					resVal = new Dynamic.BL.Lab.EntityNumberingSystem(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllEntityNumberingSystem()
		{
			var dataColl = new Dynamic.BL.Lab.EntityNumberingSystem(User.UserId, User.HostName, User.DBName).GetAllEntityNumberingSystem(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetEntityNumberingSystemById(int TranId)
		{
			var dataColl = new Dynamic.BL.Lab.EntityNumberingSystem(User.UserId, User.HostName, User.DBName).GetEntityNumberingSystemById(0, TranId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelEntityNumberingSystem(int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.Lab.EntityNumberingSystem(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
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
		public JsonNetResult GetAllLabDepartment()
		{
			var dataColl = new Dynamic.BL.Lab.Department(User.UserId, User.HostName, User.DBName).GetAllLabDepartment(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}

	}
}