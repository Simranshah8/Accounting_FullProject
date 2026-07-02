using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BL.Payroll
{
    public class ArrearSalaryDetail
    {
        DA.Payroll.ArrearSalaryDetailDB db = null;
        int _UserId = 0;
        public ArrearSalaryDetail(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Payroll.ArrearSalaryDetailDB(hostName, dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BE.Payroll.ArrearSalaryDetailCollections dataColl)
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

            resVal = db.UpdateArrearSalaryDetail(_UserId, dataColl);

            return resVal;
        }

        public Dynamic.BE.Payroll.EmployeeForArrearSalaryDetailCollections GetAllArrearSalaryDetail(int EntityId, int? BranchId, int? DepartmentId, int? CategoryId, int YearId, int MonthId)
        {
            return db.getAllArrearSalaryDetail(_UserId, EntityId, BranchId, DepartmentId, CategoryId, YearId, MonthId);
        }

        public ResponeValues DeleteArrearSalaryDetail(int EntityId, int BranchId, int DepartmentId, int CategoryId, int YearId, int MonthId)
        {
            return db.DeleteArrearSalaryDetail(_UserId, EntityId, BranchId, DepartmentId, CategoryId, YearId, MonthId);
        }

        public ResponeValues DeleteById(int EntityId, int EmployeeId, int YearId, int MonthId)
        {
            return db.DeleteById(_UserId, EntityId, EmployeeId, YearId, MonthId);
        }
    }
}