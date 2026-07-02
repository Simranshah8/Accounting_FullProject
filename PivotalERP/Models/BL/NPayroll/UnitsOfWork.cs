using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.NPayroll
{

	public class UnitsOfWork
	{

		DA.NPayroll.UnitsOfWorkDB db = null;

		int _UserId = 0;

		public UnitsOfWork(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.NPayroll.UnitsOfWorkDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BE.NPayroll.UnitsOfWork beData)
		{
			bool isModify = beData.UnitsOfWorkId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BE.NPayroll.UnitsOfWorkCollections GetAllUnitsOfWork(int EntityId)
		{
			return db.getAllUnitsOfWork(_UserId, EntityId);
		}
		public Dynamic.BE.NPayroll.UnitsOfWork GetUnitsOfWorkById(int EntityId, int UnitsOfWorkId)
		{
			return db.getUnitsOfWorkById(_UserId, EntityId, UnitsOfWorkId);
		}
		public ResponeValues DeleteById(int EntityId, int UnitsOfWorkId)
		{
			return db.DeleteById(_UserId, EntityId, UnitsOfWorkId);
		}
		public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.UnitsOfWork beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.UnitsOfWorkId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.UnitsOfWorkId != 0)
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

