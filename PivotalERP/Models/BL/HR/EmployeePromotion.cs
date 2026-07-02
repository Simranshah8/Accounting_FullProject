using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

	public class EmployeePromotion
	{

		DA.EmployeePromotionDB db = null;

		int _UserId = 0;

		public EmployeePromotion(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.EmployeePromotionDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.EmployeePromotion beData)
		{
			bool isModify = beData.PromotionId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.EmployeePromotionCollections GetAllEmployeePromotion(int EntityId)
		{
			return db.getAllEmployeePromotion(_UserId, EntityId);
		}
		public BE.EmployeePromotion GetEmployeePromotionById(int EntityId, int PromotionId)
		{
			return db.getEmployeePromotionById(_UserId, EntityId, PromotionId);
		}
		public ResponeValues DeleteById(int EntityId, int PromotionId)
		{
			return db.DeleteById(_UserId, EntityId, PromotionId);
		}
		public RE.EmpPromotionTransferCollections GetEmpPromotionTransfer(int IsEmpPT)
        {
			return db.GetEmpPromotionTransfer(_UserId, IsEmpPT);
		}
		public ResponeValues IsValidData(ref BE.EmployeePromotion beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.PromotionId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.PromotionId != 0)
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
				else if (!beData.PromotionDate.HasValue || beData.PromotionDate.Value.Year < 1900)
				{
					resVal.ResponseMSG = "Promotion date is compulsory. Please enter the promotion date to continue.";
				}
				else if (beData.NewBranchId == null &&	beData.NewDepartmentId == null && beData.NewLevelId == null && beData.NewServiceTypeId == null && beData.NewDesignationId == null)
				{
					resVal.IsSuccess = false;
					resVal.ResponseMSG = "You must select at least one new field to save this form.";
				}

				//else if (!beData.EffectiveDate.HasValue || beData.EffectiveDate.Value.Year < 1900)
				//{
				//	resVal.ResponseMSG = "Please ! Enter Effective Date";
				//}

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

