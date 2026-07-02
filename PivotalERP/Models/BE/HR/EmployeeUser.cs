using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CrmLib.BE.HR
{
    public class EmployeeUser
    {
        public EmployeeUser()
        {
            EmployeeCode = "";
            Name = "";
            Department = "";
            Designation = "";
            ContactNo = "";
            Address = "";
            UserName = "";
            Pwd = "";
        }
        public int SNo { get; set; }

        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Pwd { get; set; }

        public string CodeName
        {
            get
            {
                return EmployeeCode + " " + Name;
            }
        }

        public int? DepartmentId { get; set; }
        public string Gender { get; set; }
        public string EmailId { get; set; }
    }
    public class EmployeeUserCollections : System.Collections.Generic.List<EmployeeUser>
    {
        public EmployeeUserCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}