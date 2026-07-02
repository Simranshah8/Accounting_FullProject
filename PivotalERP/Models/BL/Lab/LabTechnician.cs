using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class LabTechnician : Dynamic.BusinessLogic.Global.Common
	{

		DA.Lab.LabTechnicianDB db = null;

		int _UserId = 0;

		public LabTechnician(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.LabTechnicianDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.LabTechnician beData)
		{
			bool isModify = beData.LabTechnicianId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.LabTechnicianCollections GetAllLabTechnician(int EntityId)
		{
			return db.GetAllLabTechnician(_UserId, EntityId);
		}
		public BE.Lab.LabTechnician GetLabTechnicianById(int EntityId, int LabTechnicianId)
		{
			return db.GetLabTechnicianById(_UserId, EntityId, LabTechnicianId);
		}
		public ResponeValues DeleteById(int EntityId, int LabTechnicianId)
		{
			return db.DeleteById(_UserId, EntityId, LabTechnicianId);
		}
		public ResponeValues IsValidData(ref BE.Lab.LabTechnician beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.LabTechnicianId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.LabTechnicianId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else
				{
                    if (!string.IsNullOrEmpty(beData.MobileNo))
                    {
						var valideNo = IsValidContactNo(beData.MobileNo);
                        if (!valideNo.IsSuccess)
                        {
							resVal.IsSuccess = false;
							resVal.ResponseMSG = "Invalid mobile number. Please! Enter a valid contact number.";
							return resVal;
                        }
                    }
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

