using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.Attendance
{
    public class Holiday : ResponeValues
    {
        public Holiday()
        {
            Name = "";
        }
        public int? HolidayId { get; set; }

        public string DateFromBS { get; set; }
        public string DateToBS { get; set; }

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public List<int> CompanyId { get; set; }
        public List<int> BranchId { get; set; }
        public List<int> DepartmentId { get; set; }
        public List<int> DesignationId { get; set; }
        public List<int> ServiceTypeId { get; set; }
        public List<int> EmployeeId { get; set; }
        public List<int> GenderId { get; set; }

        //for display

        public string BranchName { get; set; }
        public string DepartmentName { get; set; }
        public string DesignationName { get; set; }
        public string ServiceTypeName { get; set; }
        public string EmpName { get; set; }
        public string EmpCode { get; set; }
        public long EmpEnrollNumber { get; set; }
        public string UserName { get; set; }

    }
    public class HolidayCollections : System.Collections.Generic.List<Holiday>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}