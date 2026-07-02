using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Payroll
{
    public class PaySlip
    {
        DA.Payroll.PaySlipDB db = null;
        int _UserId = 0;
        public PaySlip(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Payroll.PaySlipDB(hostName, dbName);
        }


        public BE.Payroll.ReportTemplateCollections GetAllReportTemplateSlip(int EntityId)
        {
            return db.getAllReportTemplateSlip(_UserId, EntityId);
        }

        public ResponeValues IsValidData(ref BE.Payroll.PaySlip beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
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