using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Account
{

	public class Cluster  
	{ 

		DA.Account.ClusterDB db = null;

		int _UserId = 0;

		public Cluster(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Account.ClusterDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Account.Cluster beData)
		{
			bool isModify = beData.ClusterID > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Account.ClusterCollections GetAllCluster(int EntityId)
		{
			return db.getAllCluster(_UserId, EntityId);
		}
		public BE.Account.Cluster GetClusterById(int EntityId, int ClusterID)
		{
			return db.getClusterById(_UserId, EntityId, ClusterID);
		}
		public ResponeValues DeleteById(int EntityId, int ClusterID)
		{
			return db.DeleteById(_UserId, EntityId, ClusterID);
		}
		public ResponeValues IsValidData(ref BE.Account.Cluster beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (IsModify && beData.ClusterID == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
			}
			else if (!IsModify && beData.ClusterID != 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}
			else if (string.IsNullOrEmpty(beData.ClusterName))
			{
				resVal.ResponseMSG = "Please ! Enter ClusterName ";
			}
			else if (beData.CircleID==0)
			{
				resVal.ResponseMSG = "Please ! Select CircleID ";
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

