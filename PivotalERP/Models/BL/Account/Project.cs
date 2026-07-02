using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BusinessLogic.Account
{

	public class Project : Dynamic.BusinessLogic.Global.Common
	{

		Dynamic.DataAccess.Account.ProjectDB db = null;

		int _UserId = 0;

		public Project(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new Dynamic.DataAccess.Account.ProjectDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(Dynamic.BusinessEntity.Account.Project beData)
		{
			bool isModify = beData.ProjectId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public Dynamic.BusinessEntity.Account.ProjectCollections GetAllProject(int EntityId)
		{
			return db.getAllProject(_UserId, EntityId);
		}
		public Dynamic.BusinessEntity.Account.Project GetProjectById(int EntityId, int ProjectId)
		{
			return db.getProjectById(_UserId, EntityId, ProjectId);
		}
		public ResponeValues DeleteById(int EntityId, int ProjectId)
		{
			return db.DeleteById(_UserId, EntityId, ProjectId);
		}
		public ResponeValues IsValidData(ref Dynamic.BusinessEntity.Account.Project beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.ProjectId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.ProjectId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.Name))
				{
					resVal.ResponseMSG = "Please ! Enter Project Name ";
				}
				else if (string.IsNullOrEmpty(beData.ProjectHead))
				{
					resVal.ResponseMSG = "Please ! Enter Project Head";
				}
				else
				{
					if (!string.IsNullOrEmpty(beData.ContactNo))
					{
						var validNum = IsValidContactNo(beData.ContactNo);
						if (!validNum.IsSuccess)
							return validNum;
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

