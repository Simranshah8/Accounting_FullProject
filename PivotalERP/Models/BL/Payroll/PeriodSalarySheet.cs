using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Payroll
{
    public class PeriodSalarySheet
    {
        DA.Payroll.PeriodSalarySheetDB db = null;
        int _UserId = 0;
        public PeriodSalarySheet(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Payroll.PeriodSalarySheetDB(hostName, dbName);
        }

        /// <summary>
        /// Add para branch, department,Category,CompanyRelationshipId
        /// </summary>
        /// <param name="EntityId"></param>
        /// <param name="FromYearId"></param>
        /// <param name="FromMonthId"></param>
        /// <param name="ToYearId"></param>
        /// <param name="ToMonthId"></param>
        /// <param name="ForEmployee"></param>
        /// <param name="BranchId"></param>
        /// <param name="DepartmentId"></param>
        /// <param name="CategoryId"></param>
        /// <param name="CompanyRelationshipId"></param>
        /// <returns></returns>
        public BE.Payroll.PeriodSalarySheetCollections GetAllPeriodSalarySheet(int EntityId, int FromYearId, int FromMonthId, int ToYearId, int ToMonthId, int? ForEmployee=null, int? BranchId = null, int? DepartmentId = null, int? CategoryId = null, int? CompanyRelationshipId = null)
        {
            return db.getAllPeriodSalarySheet(_UserId, EntityId, FromYearId, FromMonthId, ToYearId, ToMonthId, ForEmployee, BranchId, DepartmentId, CategoryId, CompanyRelationshipId);
        }

       
    }
}