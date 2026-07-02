using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class DiscountCommissionMapping
	{

		DA.Hospital.DiscountCommissionMappingDB db = null;

		int _UserId = 0;

		public DiscountCommissionMapping(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DiscountCommissionMappingDB(hostName, dbName);
		}
	
		public BE.Hospital.DiscountCommissionMappingCollections GetAllDiscountCommissionMapping(int EntityId)
		{
			return db.getAllDiscountCommissionMapping(_UserId, EntityId);
		}

		public ResponeValues SaveFormData(List<BE.Hospital.DiscountCommissionMapping> dataColl)
		{
			ResponeValues resVal = new ResponeValues();
			
			//foreach (var item in dataColl)
			//{
			//	if (!item.CommissionTypeId.HasValue || item.CommissionTypeId == 0)
			//	{
			//		resVal.IsSuccess = false;
			//		resVal.ResponseMSG =
			//			$"Commission type is missing for DiscountType : {item.DiscountType}";
			//		return resVal;
			//	}
			//}
			return db.SaveUpdate(_UserId, dataColl);
		}
	}

}

