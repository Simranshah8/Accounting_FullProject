using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL
{
    public class AssignedGoal
    {
        DA.AssignedGoalDB db = null;
        int _UserId = 0; public AssignedGoal(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.AssignedGoalDB(hostName, dbName);
        }
        public BE.AssignedGoalCollections GetEmployeeAssignedGoal(int CostClassId, int ForId)
        {
            return db.GetEmployeeAssignedGoal(_UserId, CostClassId, ForId);
        }
        public BE.AssignedGoalCollections GetAssignedGoalSubmited()
        {
            return db.GetAssignedGoalSubmited(_UserId);
        }

        public ResponeValues SaveRatingPoint(List<BE.RatingPoint> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
         
            return db.SaveRatingPoint(_UserId, dataColl);
        }

        public ResponeValues SaveFormData(BE.AssignedGoal beData)
        {
            bool isModify = beData.TranId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.AssignedGoal GetAssignedGoalById(int EntityId, int TranId)
        {
            return db.getAssignedGoalById(_UserId, EntityId, TranId);
        }
        public ResponeValues DeleteById(int EntityId, int TranId)
        {
            return db.DeleteById(_UserId, EntityId, TranId);
        }
        public ResponeValues IsValidData(ref BE.AssignedGoal beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.TranId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.TranId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (beData.GoalReleaseId == 0 || beData.GoalReleaseId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select GoalRelease ";
                }
                else if (beData.UserId == 0 || beData.UserId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select User ";
                }
                else if (beData.ForId == 0 || beData.ForId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select For ";
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
