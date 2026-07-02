using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Lab
{

	public class LabPackage
	{

		DA.Lab.LabPackageDB db = null;

		int _UserId = 0;

		public LabPackage(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Lab.LabPackageDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Lab.LabPackage beData)
		{
			bool isModify = beData.PackageId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Lab.LabPackageCollections GetAlllab_Package(int EntityId)
		{
			return db.getAlllab_Package(_UserId, EntityId);
		}
		public BE.Lab.LabPackage Getlab_PackageById(int EntityId, int PackageId)
		{
			return db.getlab_PackageById(_UserId, EntityId, PackageId);
		}
		public ResponeValues DeleteById(int EntityId, int PackageId)
		{
			return db.DeleteById(_UserId, EntityId, PackageId);
		}
		public ResponeValues IsValidData(ref BE.Lab.LabPackage beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.PackageId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.PackageId != 0)
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
				else if (string.IsNullOrEmpty(beData.Code))
				{
					resVal.ResponseMSG = "Please ! Enter Code ";
				}
				else if (beData.OrganizationId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Organization ";
				}
				else if (beData.CategoryId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Category ";
				}
				else if (beData.PricingId == 0)
				{
					resVal.ResponseMSG = "Please ! Select Pricing ";
				}
				else if (beData.FdAmount == 0)
				{
					resVal.ResponseMSG = "Please ! Select FdAmount ";
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

