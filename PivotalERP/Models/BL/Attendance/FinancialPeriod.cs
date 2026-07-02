using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Attendance
{
    public class FinancialPeriod
    {
        DA.Attendance.FinancialPeriodDB db = null;
        int _UserId = 0;
        public FinancialPeriod(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.FinancialPeriodDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.FinancialPeriod beData)
        {
            bool isModify = beData.PeriodId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.FinancialPeriodCollections GetAllFinancialPeriod(int EntityId)
        {
            return db.GetAllLeave(_UserId);
        }
        public BE.Attendance.FinancialPeriod GetFinancialPeriodById(int EntityId, int PeriodId)
        {
            return db.getLeaveById(PeriodId, _UserId);
        }
        public ResponeValues DeleteById(int EntityId, int PeriodId)
        {
            return db.DeleteById(_UserId, EntityId, PeriodId);
        }

        public ResponeValues IsValidData(ref BE.Attendance.FinancialPeriod beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.PeriodId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.PeriodId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
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
