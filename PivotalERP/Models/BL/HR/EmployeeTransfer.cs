using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class EmployeeTransfer
	{

		DA.EmployeeTransferDB db = null;

		int _UserId = 0;

		public EmployeeTransfer(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.EmployeeTransferDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.EmployeeTransfer beData)
		{
			bool isModify = beData.TransferId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.EmployeeTransferCollections GetAllEmployeeTransfer(int EntityId)
		{
			return db.getAllEmployeeTransfer(_UserId, EntityId);
		}
		public BE.EmployeeTransfer GetEmployeeTransferById(int EntityId, int TransferId)
		{
			return db.getEmployeeTransferById(_UserId, EntityId, TransferId);
		}
		public ResponeValues DeleteById(int EntityId, int TransferId)
		{
			return db.DeleteById(_UserId, EntityId, TransferId);
		}
		public ResponeValues IsValidData(ref BE.EmployeeTransfer beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TransferId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TransferId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (beData.EmployeeId == 0 || beData.EmployeeId.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Employee ";
				}
				else if (!beData.TransferDate.HasValue || beData.TransferDate.Value.Year < 1900)
				{
					resVal.ResponseMSG = "Promotion date is compulsory. Please enter the Transfer date to continue.";
				}
				else if (beData.NewBranchId == null && beData.NewDepartmentId == null  && beData.NewDesignationId == null && beData.NewCompanyId == null && beData.NewCategoryId == null)
				{
					resVal.IsSuccess = false;
					resVal.ResponseMSG = "You must select at least one new field to save this form.";
				}

				else if (beData.VerifiedById == 0 || beData.VerifiedById.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Verified By ";
				}
				else if (string.IsNullOrEmpty(beData.VerifiedRemarks))
				{
					resVal.ResponseMSG = "Please ! Enter Verified Remarks";
				}
				else if (beData.DocumentColl == null || beData.DocumentColl.Count == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Please! Attach Required Document.";
                    return resVal;
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

