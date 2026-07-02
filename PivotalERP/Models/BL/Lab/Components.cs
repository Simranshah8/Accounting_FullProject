using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class Components
	{

		DA.Lab.ComponentsDB db = null;

		int _UserId = 0;

		public Components(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.ComponentsDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.Components beData)
		{
			bool isModify = beData.ComponentId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.ComponentsCollections GetAllLabComponents(int EntityId)
		{
			return db.getAllLabComponents(_UserId, EntityId);
		}
		public BE.Lab.Components GetLabComponentsById(int EntityId, int ComponentId)
		{
			return db.getLabComponentsById(_UserId, EntityId, ComponentId);
		}
		public ResponeValues DeleteById(int EntityId, int ComponentId)
		{
			return db.DeleteById(_UserId, EntityId, ComponentId);
		}

		public ResponeValues GetAutoComponentCode(int EntityId)
		{
			return db.GetAutoComponentCode(_UserId, EntityId);
		}
		public ResponeValues IsValidData(ref BE.Lab.Components beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ComponentId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ComponentId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.TestId == 0 /*|| beData.TestId.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select Test ";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Name ";
				}
				else if (string.IsNullOrEmpty(beData.Code))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
				}
				else if (beData.TypeId == 0 /*|| beData.TypeId.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select Type ";
				}
				else if (beData.UnitId == 0 /*|| beData.UnitId.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select Unit ";
				}
				else if (beData.Decimal == 0 /*|| beData.Decimal.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select Decimal ";
				}
				else if (beData.AnswerSetId == 0 /*|| beData.AnswerSetId.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select AnswerSet ";
				}
				else if (beData.SortOrder == 0 /*|| beData.SortOrder.HasValue == false*/)
				{
					resVal.ResponseMSG = "Please ! Select SortOrder ";
				}
				else if (string.IsNullOrEmpty(beData.ComponentGroup))
				{
					resVal.ResponseMSG = "Please ! Enter ComponentGroup ";
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

