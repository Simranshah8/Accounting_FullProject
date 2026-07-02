using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Payroll
{
    public class SalarySheet
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int EmpId { get; set; }
        public string EmpCode { get; set; }
        public string PanId { get; set; }
        public string PAddress { get; set; }
        public string OfficeContactNo { get; set; }
        public string Name { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Grade { get; set; }
        public string Designation { get; set; }
        public string BankName { get; set; }
        public string AccountName { get; set; }
        public string AccountNo { get; set; }
        public string BranchName { get; set; }
        public DateTime? VoucherDate { get; set; }
        public double TotalDays { get; set; }
        public double TotalEarning { get; set; }
        public double TotalDeduction { get; set; }
        public double NetPayable { get; set; }
        public int SNo { get; set; }
        public string PayHeadingName { get; set; }
        public string PayHeadingCode { get; set; }
        public double AttendanceRate { get; set; }
        public double AttendanceValue { get; set; }
        public double Rate { get; set; }
        public double Amount { get; set; }
        public bool IsEarning { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyPanVatNo { get; set; }
        public string CompanyRegdNo { get; set; }
        public string CompanyEmail { get; set; }
        public string LogoPath { get; set; }
        public int Attendance { get; set; }
        public string AttendanceDetails { get; set; }
        public double TotalPayable { get; set; }
        public int RowNo { get; set; }
        public int DepartmentSNo { get; set; }
        public int DesignationSNo { get; set; }
        public int DepartmentWiseSNo { get; set; }
        public int DesignationWiseSNo { get; set; }
        public int? PayHeadType { get; set; }
        public string EmployeeGroup { get; set; } = "";
    }
    public class SalarySheetCollections : System.Collections.Generic.List<SalarySheet>
    {

    }
}
