using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BL.Hospital
{
    public class OPDTicketType
    {
        DA.Hospital.OPDTicketTypeDB db = null;

        int _UserId = 0;
        public OPDTicketType(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Hospital.OPDTicketTypeDB(hostName, dbName);
        }

        public ResponeValues SaveFormData(BE.Hospital.OPDTicketType beData)
        {
            bool isModify = beData.OpDTicketTypeId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }

        public BE.Hospital.OPDTicketTypeCollection GetAllODPTicketTypes(int EntityId)
        {
            return db.getAllOPDTicketType(_UserId, EntityId);
        }
        public BE.Hospital.OPDTicketType GetOPDTicketTypeById(int EntityId, int OpDTicketTypeId)
        {
            return db.getOPDTicketTypeById(_UserId, EntityId, OpDTicketTypeId);
        }

        public ResponeValues DeleteById(int EntityId, int OpDTicketTypeId)
        {
            return db.DeleteById(_UserId, EntityId, OpDTicketTypeId);
        }
        public ResponeValues IsValidData(ref BE.Hospital.OPDTicketType beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.OpDTicketTypeId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.OpDTicketTypeId != 0)
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
                else if (string.IsNullOrEmpty(beData.Alias))
                {
                    resVal.ResponseMSG = "Please ! Enter Alias ";
                }
                else if (string.IsNullOrEmpty(beData.Description))
                {
                    resVal.ResponseMSG = "Please ! Enter Description ";
                }
                else if (beData.ForTran == 0)
                {
                    resVal.ResponseMSG = "Please ! Enter For Tran ";
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