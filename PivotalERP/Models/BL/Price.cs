using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Account
{

    public class Price
    {

        Dynamic.DA.Account.PriceDB db = null;

        int _UserId = 0;

        public Price(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new Dynamic.DA.Account.PriceDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(Dynamic.BE.Account.Price beData)
        {
            bool isModify = beData.PriceId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public Dynamic.BE.Account.PriceCollections GetAllPrice(int EntityId)
        {
            return db.getAllPrice(_UserId, EntityId);
        }
        public Dynamic.BE.Account.Price GetPriceById(int EntityId, int PriceId)
        {
            return db.getPriceById(_UserId, EntityId, PriceId);
        }
        public ResponeValues DeleteById(int EntityId, int PriceId)
        {
            return db.DeleteById(_UserId, EntityId, PriceId);
        }
        public ResponeValues IsValidData(ref Dynamic.BE.Account.Price beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.PriceId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.PriceId != 0)
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
                else if (beData.DefaultBasePriceList == 0 || beData.DefaultBasePriceList.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Default Base Price List ";
                }
                else if (beData.RoundingMethod == 0 || beData.RoundingMethod.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Rounding Method ";
                }
                else if (beData.Active == null)
                {
                    resVal.ResponseMSG = "Please ! Enter active ";
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

