using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class PayHeading
    {
        DA.NPayroll.PayHeadingDB db = null;
        int _UserId = 0;
        public PayHeading(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.PayHeadingDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(Dynamic.BE.NPayroll.PayHeading beData)
        {
            bool isModify = beData.PayHeadingId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public Dynamic.BE.NPayroll.PayHeadingCollections GetAllPayHeading(int EntityId)
        {
            return db.getAllPayHeading(_UserId, EntityId);
        }

        public Dynamic.BE.NPayroll.BranchForPayHeadingCollections GetBranchForPayHeading(int EntityId)
        {
            return db.getBranchForPayHeading(_UserId, EntityId);
        }
        public Dynamic.BE.NPayroll.CategoryForPayHeadingCollections GetCategoryForPayHeading(int EntityId)
        {
            return db.getCategoryForPayHeading(_UserId, EntityId);
        }
        public Dynamic.BE.NPayroll.PayHeading GetPayHeadingById(int EntityId, int PayHeadingId)
        {
            return db.getPayHeadingById(_UserId, EntityId, PayHeadingId);
        }
        public ResponeValues DeleteById(int EntityId, int PayHeadingId)
        {
            return db.DeleteById(_UserId, EntityId, PayHeadingId);
        }
        public Dynamic.BE.NPayroll.PayHeadingCollections getAllPayHeadingForTran()
        {
            return db.getAllPayHeadingForTran(_UserId);
        }
            public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.PayHeading beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.PayHeadingId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.PayHeadingId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = "Please ! Enter PayHeading Name";
                }
                else if(!beData.LedgerId.HasValue || beData.LedgerId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Ledger";
                }
                else
                {
                    if (beData.CalculationType == 1)
                    {
                        if(!beData.AttendanceTypeId.HasValue || beData.AttendanceTypeId == 0)
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = "Please ! Select Attendance Type";
                            return resVal;
                        }
                    }else
                    {
                        beData.AttendanceTypeId = null;
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