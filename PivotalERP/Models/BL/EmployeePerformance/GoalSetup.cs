using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL
{

    public class GoalSetup
    {

        DA.GoalSetupDB db = null;

        int _UserId = 0;

        public GoalSetup(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.GoalSetupDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.GoalSetup beData)
        {
            bool isModify = beData.GoalSetupId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.GoalSetupCollections GetAllGoalSetup(int EntityId)
        {
            return db.getAllGoalSetup(_UserId, EntityId);
        }
        public BE.GoalSetup GetGoalSetupById(int EntityId, int GoalSetupId)
        {
            return db.getGoalSetupById(_UserId, EntityId, GoalSetupId);
        }
        public ResponeValues DeleteById(int EntityId, int GoalSetupId)
        {
            return db.DeleteById(_UserId, EntityId, GoalSetupId);
        }
        public ResponeValues IsValidData(ref BE.GoalSetup beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.GoalSetupId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.GoalSetupId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (beData.CostClassId == 0 || beData.CostClassId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select CostClass ";
                }
                else if (beData.GoalTypeId == 0 || beData.GoalTypeId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select GoalType ";
                }
                //else if (beData.GoalPeriodId==0 || beData.GoalPeriodId.HasValue==false)
                //{
                //	resVal.ResponseMSG = "Please ! Select GoalPeriod ";
                //}
                else if (beData.FromDate.Year < 1901)
                {
                    resVal.ResponseMSG = "Please ! Enter From Date ";
                }
                else if (beData.ToDate.Year < 1901)
                {
                    resVal.ResponseMSG = "Please ! Enter To Date ";
                }

                else if (string.IsNullOrEmpty(beData.Description))
                {
                    resVal.ResponseMSG = "Please ! Enter Description ";
                }
                else
                {
                    if (beData.IsMeasurement)
                    {
                        if (beData.TargetValue == 0 || beData.TargetValue.HasValue == false)
                        {
                            resVal.ResponseMSG = "Please ! Enter Target Value ";
                            return resVal;
                        }
                        else if (string.IsNullOrEmpty(beData.GoalMeasurement))
                        {
                            resVal.ResponseMSG = "Please ! Enter Goal Measurement ";
                            return resVal;
                        }
                        if (beData.WeightedId == 0 || beData.WeightedId.HasValue == false)
                        {
                            resVal.ResponseMSG = "Please ! Select Weighted ";
                            return resVal;
                        }
                        else if (beData.GoalTargetTypeId == 0 || beData.GoalTargetTypeId.HasValue == false)
                        {
                            resVal.ResponseMSG = "Please ! Select Target Type ";
                            return resVal;
                        }

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

