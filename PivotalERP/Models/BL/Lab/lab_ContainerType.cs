using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class lab_ContainerType
	{

		DA.lab_ContainerTypeDB db = null;

		int _UserId = 0;

		public lab_ContainerType(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.lab_ContainerTypeDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.lab_ContainerType beData)
		{
			bool isModify = beData.ContainerTypeId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.lab_ContainerTypeCollections GetAlllab_ContainerType(int EntityId)
		{
			return db.getAlllab_ContainerType(_UserId, EntityId);
		}
		public BE.lab_ContainerType Getlab_ContainerTypeById(int EntityId, int ContainerTypeId)
		{
			return db.getlab_ContainerTypeById(_UserId, EntityId, ContainerTypeId);
		}
		public ResponeValues DeleteById(int EntityId, int ContainerTypeId)
		{
			return db.DeleteById(_UserId, EntityId, ContainerTypeId);
		}
		public ResponeValues IsValidData(ref BE.lab_ContainerType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ContainerTypeId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ContainerTypeId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.ContainerName))
				{
					resVal.ResponseMSG = "Please ! Enter ContainerName ";
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

