using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class labTest
	{
		DA.Lab.labTestDB db = null;

		int _UserId = 0;

		public labTest(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.labTestDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.labTest beData)
		{
			bool isModify = beData.LabTestId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.labTestCollections GetAlllab_Test(int EntityId)
		{
			return db.getAlllab_Test(_UserId, EntityId);
		}
		public BE.Lab.labTest Getlab_TestById(int EntityId, int LabTestId)
		{
			return db.getlab_TestById(_UserId, EntityId, LabTestId);
		}
		public ResponeValues DeleteById(int EntityId, int LabTestId)
		{
			return db.DeleteById(_UserId, EntityId, LabTestId);
		}
		public ResponeValues GetAutoTestCode(int EntityId)
		{
			return db.GetAutoTestCode(_UserId, EntityId);
		}
		public ResponeValues IsValidData(ref BE.Lab.labTest beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.LabTestId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.LabTestId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.TestName))
				{
					resVal.ResponseMSG = "Please ! Enter TestName ";
				}
				else if (string.IsNullOrEmpty(beData.TestCode))
				{
					resVal.ResponseMSG = "Please ! Enter TestCode ";
				}
				else if (beData.DepartmentId == 0 || beData.DepartmentId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Enter Department ";
				}
				else if (beData.LabCategoryId == 0 || beData.LabCategoryId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Enter Group Name ";
				}
				else
				{
					if (beData.LabComponentsColl != null && beData.LabComponentsColl.Count > 0)
					{
						foreach (var be in beData.LabComponentsColl)
						{
							if (be.DisplaySequence == 0 || be.DisplaySequence.HasValue == false)
							{
								resVal.ResponseMSG = "Please !  Enter Display Sequence Value ";
								return resVal;
							}
						}

						bool isDuplicate = beData.LabComponentsColl.GroupBy(x => x.DisplaySequence).Any(g => g.Count() > 1);
						if (isDuplicate)
						{
							resVal.IsSuccess = false;
							resVal.ResponseMSG = "DisplaySequence already exists.";
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

