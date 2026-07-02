using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.GateMaster.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
		// GET: GateMaster/Creation
		string photoLocation = "/Attachments/GateMaster";

		public ActionResult GateMaster()
		{
			return View();
		}
		 
		#region "GateMaster"
		[HttpPost]
		/*[PermissionsAttribute(Actions.Save, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult SaveGateMaster()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.GateMaster.GateMaster>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.GateId.HasValue)
						beData.GateId = 0;

					resVal = new Dynamic.BL.GateMaster.GateMaster(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllGateMaster()
		{
			var dataColl = new Dynamic.BL.GateMaster.GateMaster(User.UserId, User.HostName, User.DBName).GetAllGateMaster(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		/*[HttpPost]*/
		public JsonNetResult GetGateMasterById(int GateId)
		{
			var dataColl = new Dynamic.BL.GateMaster.GateMaster(User.UserId, User.HostName, User.DBName).GetGateMasterById(0, GateId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		/*[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult DelGateMaster(int GateId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.GateMaster.GateMaster(User.UserId, User.HostName, User.DBName).DeleteById(0, GateId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion
		public ActionResult VehicleMaster()
        {
            return View();
        }
    
		#region "Vehicle"
		[HttpPost]
		public JsonNetResult SaveVehicle()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.GateMaster.Vehicle>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.VehicleId.HasValue)
						beData.VehicleId = 0;

					resVal = new Dynamic.BL.GateMaster.Vehicle(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

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
		public JsonNetResult GetAllVehicle()
		{
			var dataColl = new Dynamic.BL.GateMaster.Vehicle(User.UserId, User.HostName, User.DBName).GetAllVehicle(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetVehicleById(int VehicleId)
		{
			var dataColl = new Dynamic.BL.GateMaster.Vehicle(User.UserId, User.HostName, User.DBName).GetVehicleById(0, VehicleId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult DelVehicle(int VehicleId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.GateMaster.Vehicle(User.UserId, User.HostName, User.DBName).DeleteById(0, VehicleId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		public ActionResult GateEntry()
		{
			return View();
		}

		#region "GateEntry"
		[HttpPost]
		public JsonNetResult SaveTransactionGateEntry()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.GateMaster.GateEntry>(Request["jsonData"]);
				if (beData != null)
				{
					if (Request.Files.Count > 0)
					{
						var filesColl = Request.Files;
						var empPhoto = filesColl["photo"];
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
						if (empPhoto != null)
						{
							var photoDoc = GetAttachmentDocuments(photoLocation, empPhoto, true);
							beData.PhotoB = photoDoc.Data;
							beData.PhotoPath = photoDoc.DocPath;
						}
					}
					//bool isModify = false;
					beData.CUserId = User.UserId;
					if (!beData.TranId.HasValue)
						beData.TranId = 0;

					resVal = new Dynamic.BL.GateMaster.GateEntry(User.UserId, User.HostName, User.DBName).SaveFormData(beData);
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
		public JsonNetResult GetAllTransactionGateEntry(string PassType, int PageNumber = 0, int RowsOfPage = 10, string SearchBy = "")
		{
			int TotalRows = 0;
			var dataColl = new Dynamic.BL.GateMaster.GateEntry(User.UserId, User.HostName, User.DBName).GetAllTransactionGateEntry(0, PassType, ref TotalRows, PageNumber, RowsOfPage, SearchBy);
			//return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
			return new JsonNetResult() { Data = dataColl, TotalCount = TotalRows, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetTransactionGateEntryById(int TranId)
		{
			var dataColl = new Dynamic.BL.GateMaster.GateEntry(User.UserId, User.HostName, User.DBName).GetTransactionGateEntryById(0, TranId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		
		[HttpPost]
		public JsonNetResult DelTransactionGateEntry(int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.GateMaster.GateEntry(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetVehiclesForOutWard(String PassType)
		{
			var dataColl = new Dynamic.BL.GateMaster.GateEntry(User.UserId, User.HostName, User.DBName).GetVehiclesForOutWard(0, PassType);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
		#endregion

		public ActionResult ReOrderStockLevel()
		{
			return View();
		}

		#region "Re-OrderStockLevel"
		[HttpPost]
        public JsonResult GetGodownData(int GodownId)
        {
            var dataColl = new Dynamic.BL.GateMaster.ReOrderStockLevel(User.UserId, User.HostName, User.DBName).getReOrderStockLevelByGodownId(0, GodownId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult SaveReOrderStockLevel()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.GateMaster.ReOrderStockLevelCollections>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.BL.GateMaster.ReOrderStockLevel(User.UserId, User.HostName, User.DBName).SaveFormData(User.UserId, beData);
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