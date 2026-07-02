using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.RE.HR.Report
{
	public class SupervisorList
	{
		public int? EmployeeId { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? DesignationId { get; set; }
		public int? CompanyRelationshipId { get; set; }
		public string EmployeeCode { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string EmpName { get; set; } = "";
		public string HODName { get; set; } = "";
		public string DepartmentName { get; set; } = "";
		public string DesignationName { get; set; } = "";
		public string S_FirstLevel { get; set; } = "";
		public string S_SecondLevel { get; set; } = "";
		public string S_ThirdLevel { get; set; } = "";
		public string CompanyName { get; set; } = "";
		
	}

	public class SupervisorListCollections : System.Collections.Generic.List<SupervisorList>
	{
		public SupervisorListCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}