using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class SalarySheet
    {
        DA.NPayroll.SalarySheetDB db = null;
        int _UserId = 0;
        public SalarySheet(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.SalarySheetDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.SalarySheetCollections dataColl, Dynamic.BE.NPayroll.AttendanceTypeCollections AttendanceTypeColl)
        {
            ResponeValues resVal = new ResponeValues();

            foreach (var beData in dataColl)
            {
                if (beData.YearId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Year to save SalarySheet ";
                    return resVal;
                }

                if (beData.MonthId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Month to save SalarySheet ";
                    return resVal;
                }              

            }

            resVal = db.UpdateSalarySheet(_UserId, dataColl, AttendanceTypeColl);

            return resVal;
        }

        public Dynamic.BE.NPayroll.SalarySheetDetail GetAllSalarySheet(int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int? YearId, int? MonthId, int? CompanyRelationshipId)
        {
            return db.getAllSalarySheet(_UserId, EntityId, BranchId, DepartmentId, CategoryId, YearId, MonthId, CompanyRelationshipId);
        }

        public ResponeValues DeleteSalarySheet(int EntityId, int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            return db.DeleteSalarySheet(_UserId, EntityId, BranchId, DepartmentId, CategoryId, YearId, MonthId);
        }

        public ResponeValues DeleteById(int EntityId, int EmployeeId, int YearId, int MonthId)
        {
            return db.DeleteById(_UserId, EntityId, EmployeeId, YearId, MonthId);
        }
        //public AcademicLib.RE.Payroll.SalarySheetCollections getSalarySheet(int YearId, int MonthId, string CompanyIdColl, string BranchIdColl, string DepartmentIdColl, string CategoryIdColl,
        //    int EmployeeId, string EmployeeIdColl)
        //{
        //    return db.getSalarySheet(_UserId, YearId, MonthId, CompanyIdColl, BranchIdColl, DepartmentIdColl, CategoryIdColl, EmployeeId, EmployeeIdColl);
        //}
        public ResponeValue SaveJV(int YearId, int MonthId)
        {
            ResponeValue resVal = new ResponeValue();
            resVal = db.SaveJV(_UserId, YearId, MonthId);
            return resVal;
        }
        public RE.HR.SalarySheetCollections getSalarySheet(int YearId, int MonthId, string CompanyIdColl, string BranchIdColl, string DepartmentIdColl, string CategoryIdColl, int EmployeeId, string EmployeeIdColl, string EmpGroupIdColl)
        {
            return db.getSalarySheet(_UserId, YearId, MonthId, CompanyIdColl, BranchIdColl, DepartmentIdColl, CategoryIdColl, EmployeeId, EmployeeIdColl, EmpGroupIdColl);
        }
        public (Dynamic.RE.HR.LedgerSJVCollections, Dynamic.RE.HR.PayHeadSJVCollections) GetSalaryJV( int YearId, int MonthId)
        {
            return db.GetSalaryJV(_UserId,YearId, MonthId);
        }
    }
}