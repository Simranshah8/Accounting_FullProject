using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.NPayroll
{
    public class ArrearSalarySheet
    {
        DA.NPayroll.ArrearSalarySheetDB db = null;
        int _UserId = 0;
        public ArrearSalarySheet(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.NPayroll.ArrearSalarySheetDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.ArrearSalarySheetCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();

            foreach (var beData in dataColl)
            {
                if (beData.YearId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Year to save ArrearSalary Detail ";
                    return resVal;
                }

                if (beData.MonthId == 0)
                {
                    resVal.ResponseMSG = "Please ! Select Month to save ArrearSalary Detail ";
                    return resVal;
                }

               
            }

            resVal = db.UpdateArrearSalarySheet(_UserId, dataColl);

            return resVal;
        }
        public ResponeValues SaveUpdate(Dynamic.BE.NPayroll.ArrearSalarySheetCollections dataColl, Dynamic.BE.NPayroll.AttendanceTypeCollections AttendanceTypeColl)
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

            resVal = db.UpdateArrearSalarySheet(_UserId, dataColl, AttendanceTypeColl);

            return resVal;
        }

        public Dynamic.BE.NPayroll.ArrearSalaryDetail GetAllArrearSalarySheet(int EntityId, int? BranchId, int? DepartmentId,int? CategoryId, int? YearId, int? MonthId)
        {
            return db.getAllArrearSalarySheet(_UserId, EntityId, BranchId, DepartmentId, CategoryId, YearId, MonthId);
        }              

        public ResponeValues DeleteArrearSalarySheet(int EntityId, int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            return db.DeleteArrearSalarySheet(_UserId, EntityId, BranchId, DepartmentId, CategoryId, YearId, MonthId);
        }

        public ResponeValues DeleteById(int EntityId, int EmployeeId, int YearId, int MonthId)
        {
            return db.DeleteById(_UserId, EntityId, EmployeeId, YearId, MonthId);
        }
    }
}