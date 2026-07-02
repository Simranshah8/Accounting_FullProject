using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.BE.NPayroll
{
    public class EmployeeForSalarySheet : ResponeValues
    {
        public int? EmployeeId { get; set; }
        public int? PayHeadingId { get; set; }
        public string EmployeeCode { get; set; }
        public long EnrollNo { get; set; }
        public int? SNo { get; set; }
        public string EmployeeName { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string PayHeading { get; set; }
        public double? Amount { get; set; }
        public int? YearId { get; set; }
        public int? MonthId { get; set; }
        public double? Value { get; set; }
        public double? Rate { get; set; }
        public int? AttendanceTypeId { get; set; }

        public bool IsAllow { get; set; }
        public int? BranchId { get; set; }
        public int? CategoryId { get; set; }
        public int TaxRuleAs { get; set; } = 1;
        public bool Resident { get; set; } = true;
        public string Gender { get; set; } = "";
        public int GenderId
        {
            get
            {
                switch (Gender.Trim().ToLower())
                {
                    case "male": return 1;
                    case "female": return 2;
                    case "other": return 3;
                    default: return 1;
                }
            }
        }
        public int MaritalStatus { get; set; }
        public double Earning { get; set; }
        public double Deducation { get; set; }
        public double Tax { get; set; }
        public double Netpayable { get; set; }
        public int TotalDays { get; set; }
        public bool IsEditable { get; set; }
        public int? LevelId { get; set; }
        public string LevelName { get; set; }
        public int PendingMonths { get; set; }
        public double PAmount { get; set; }
        public double SDRate { get; set; }
        public int? TotalMonth { get; set; }
        public int? TotalWeekEnd { get; set; }
        public int? TotalHoliday { get; set; }


    }

    public class SalarySheetDetail
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
        public EmployeeForSalarySheetCollections PayColl { get; set; } =    new EmployeeForSalarySheetCollections();
        public EmployeeForSalarySheetCollections AttColl { get; set; } = new EmployeeForSalarySheetCollections();
    }

    public class EmployeeForSalarySheetCollections : System.Collections.Generic.List<EmployeeForSalarySheet>
    {
        public EmployeeForSalarySheetCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class SalarySheet
    {
        public int EmployeeId { get; set; }
        public int PayHeadingId { get; set; }
        public double? Amount { get; set; }
        public int? YearId { get; set; }
        public int? MonthId { get; set; }
        public double Rate { get; set; }

        public double Earning { get; set; }
        public double Deducation { get; set; }
        public double Tax { get; set; }
        public double Netpayable { get; set; }
        public double? CalValue { get; set; }

    }

    public class SalarySheetCollections : System.Collections.Generic.List<SalarySheet>
    {
        public SalarySheetCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}