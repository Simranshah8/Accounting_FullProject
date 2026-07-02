using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Service
{

	public class TransactionComment
	{

		DA.Service.TransactionCommentDB db = null;

		int _UserId = 0;

		public TransactionComment(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Service.TransactionCommentDB(hostName, dbName);
		}

		public BE.Service.TransactionCommentCollections GetTranCommentsbyId(int? VoucherId,int TranId)
		{
			return db.getTranCommentsById(_UserId, VoucherId, TranId);
		}
		public ResponeValues SaveTransactionComment(BE.Service.TransactionComment beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TranId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Transaction Comment";
			}
			else if (beData.VoucherId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Transaction Comment";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}

			else if (string.IsNullOrEmpty(beData.Comment))
			{
				resVal.ResponseMSG = "Please ! Enter Comment";
			}

			else
			{
				resVal = db.SaveTransactionComment(beData);
			}

			return resVal;

		}
	}

}

