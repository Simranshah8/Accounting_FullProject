using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class ExpenseRateSetup
    {
        DA.NPayroll.ExpenseRateSetupDB db = null;
        int _UserId = 0;
        public ExpenseRateSetup(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.ExpenseRateSetupDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.ExpenseRateSetupCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            resVal = db.UpdateExpenseRateSetup(_UserId, dataColl);

            return resVal;
        }
        public Dynamic.BE.NPayroll.EmployeeForExpenseRateSetupCollections GetAllExpenseRateSetup(int EntityId, int? BranchId, int? DepartmentId, int? CategoryId)
        {
            return db.getAllExpenseRateSetup(_UserId, EntityId, BranchId, DepartmentId, CategoryId);
        }
    }
}