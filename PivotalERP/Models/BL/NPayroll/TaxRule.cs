using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class TaxRule
    {
        DA.NPayroll.TaxRuleDB db = null;
        int _UserId = 0;
        public TaxRule(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.TaxRuleDB(hostName, dbName);
        }

        public ResponeValues Update(List<Dynamic.BE.NPayroll.TaxRule> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            resVal = db.Update(_UserId, dataColl);

            return resVal;
        }
        //public ResponeValues SaveFormData(Dynamic.BE.NPayroll.TaxRule beData)
        //{
        //    bool isModify = beData.TranId > 0;
        //    ResponeValues isValid = IsValidData(ref beData, isModify);
        //    if (isValid.IsSuccess)
        //        return db.SaveUpdate(beData, isModify);
        //    else
        //        return isValid;
        //}
        public Dynamic.BE.NPayroll.TaxRuleCollections GetAllTaxRule(int EntityId, int? TaxFor)
        {
            return db.getAllTaxRule(_UserId, EntityId, TaxFor);
        }

        //public Dynamic.BE.NPayroll.TaxRule GetTaxRuleById(int EntityId, int TranId)
        //{
        //    return db.getTaxRuleById(_UserId, EntityId, TranId);
        //}
        //public ResponeValues DeleteById(int EntityId, int TranId)
        //{
        //    return db.DeleteById(_UserId, EntityId, TranId);
        //}
        public ResponeValues IsValidData(ref Dynamic.BE.NPayroll.TaxRule beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.TaxRuleId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.TaxRuleId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                //else if (beData.MinValue == 0 || beData.MinValue.HasValue == false)
                //{
                //    resVal.ResponseMSG = "Please ! Enter MinValue ";
                //}
                //else if (beData.MinValue == 0 || beData.MinValue.HasValue == false)
                //{
                //    resVal.ResponseMSG = "Please ! Enter Max Value ";
                //}
                //else if (beData.MaxValue == 0 || beData.MaxValue.HasValue == false)
                //{
                //    resVal.ResponseMSG = "Please ! Enter MinValue ";
                //}
                //else if (beData.Rate == 0 || beData.Rate.HasValue == false)
                //{
                //    resVal.ResponseMSG = "Please ! Enter Rate ";
                //}
                //else if (beData.PayHeadingId == 0 || beData.PayHeadingId.HasValue == false)
                //{
                //    resVal.ResponseMSG = "Please ! Select Pay Heading ";
                //}
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