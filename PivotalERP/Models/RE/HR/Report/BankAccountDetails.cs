using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR.Report
{
    public class BankAccountDetails
    {
		public int? EmployeeId { get; set; }
		public string EmployeeCode { get; set; } = "";
		public long? EnrollNo { get; set; }
		public string EmployeeName { get; set; } = "";
		public string Gender { get; set; } = "";
		public string MaritalStatus { get; set; } = "";
		public string Branch { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string LevelName { get; set; } = "";
		public string ServiceType { get; set; } = "";
		public string EmployeeGroup { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string PersnalContactNo { get; set; } = "";
		public string PermanentAddress { get; set; } = "";
		public string BankName { get; set; } = "";
		public string AccountNo { get; set; } = "";
        public bool ForPayRoll { get; set; }
		public string AccountName { get; set; } = "";
		public string BankBranch { get; set; } = "";
		public string Company { get; set; } = "";	
    }

	public class BankAccountDetailsCollections : System.Collections.Generic.List<BankAccountDetails>
	{
		public BankAccountDetailsCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}