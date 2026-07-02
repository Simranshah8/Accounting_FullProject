using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class AllowExpenseCategory
    {
        DA.NPayroll.AllowExpenseCategoryDB db = null;
        int _UserId = 0;
        public AllowExpenseCategory(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.AllowExpenseCategoryDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.AllowExpenseCategoryCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            resVal = db.UpdateAllowExpenseCategory(_UserId, dataColl);

            return resVal;
        }

        public Dynamic.BE.NPayroll.EmployeeForAllowExpenseCategoryCollections GetAllAllowExpenseCategory(int EntityId, int? BranchId, int? DepartmentId, int? CategoryId)
        {
            return db.getAllAllowExpenseCategory(_UserId, EntityId, BranchId, DepartmentId, CategoryId);
        }


    }
}