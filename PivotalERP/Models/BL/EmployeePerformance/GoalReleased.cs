using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL
{
    public class GoalReleased
    {
        DA.GoalReleasedDB db = null;

        int _UserId = 0;

        public GoalReleased(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.GoalReleasedDB(hostName, dbName);
        }
        public BE.GoalReleasedCollections GetEmployeeGoalRelease(int CostClassId, int GoalSetupId,int ForId)
        {
            return db.getEmployeeGoalRelease(_UserId, CostClassId, GoalSetupId, ForId);
        }
        public ResponeValues SaveGoalRelease(List<BE.GoalReleased> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            return db.SaveGoalRelease(_UserId, dataColl);
        }
        public ResponeValues SubmitAssigneGoal(int UsersId, int GoalReleasedId)
        {
            return db.SubmitAssigneGoal(_UserId, UsersId, GoalReleasedId);
        }
        public BE.GoalReleasedCollections GetAllSupervisors()
        {
            return db.GetAllSupervisors(_UserId);
        }
        public BE.GoalReleasedCollections GetEmpGoalSetupBySupId(int SupUserId, int CostClassId, int? GoalSetupId)
        {
            return db.GetEmpGoalSetupBySupId(_UserId, SupUserId, CostClassId, GoalSetupId);
        }

    }
}
