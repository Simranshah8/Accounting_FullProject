using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class HMSVoucher
	{

		DA.Hospital.HMSVoucherDB db = null;

		int _UserId = 0;

		public HMSVoucher(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.HMSVoucherDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.HMSVoucher beData)
		{
			bool isModify = beData.VoucherId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.HMSVoucherCollections GetAllHMSVoucher(int EntityId)
		{
			return db.getAllHMSVoucher(_UserId, EntityId);
		}
		public BE.Hospital.HMSVoucher GetHMSVoucherById(int EntityId, int VoucherId)
		{
			return db.getHMSVoucherById(_UserId, EntityId, VoucherId);
		}
		public ResponeValues DeleteById(int EntityId, int VoucherId)
		{
			return db.DeleteById(_UserId, EntityId, VoucherId);
		}
		public ResponeValues IsValidData(ref BE.Hospital.HMSVoucher beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.VoucherId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.VoucherId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
				else if (string.IsNullOrEmpty(beData.VoucherName))
				{
					resVal.ResponseMSG = "Please ! Enter VoucherName ";
				}
				else if (beData.VoucherType == 0 || beData.VoucherType.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select VoucherType ";
				}
				else if (beData.NumberingMethod == 0 || beData.NumberingMethod.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select NumberingMethod ";
				}
				else if (beData.StartNumber == 0 || beData.StartNumber.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select StartNumber ";
				}
				else if (beData.NumericalPartWidth == 0 || beData.NumericalPartWidth.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select NumericalPartWidth ";
				}
				else if (beData.NoOfCopies == 0 || beData.NoOfCopies.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select NoOfCopies ";
				}
				else if (beData.NoOfTemplates == 0 || beData.NoOfTemplates.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select NoOfTemplates ";
				}
				else if (beData.TaxRate == 0 || beData.TaxRate.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Tax Rate ";
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

