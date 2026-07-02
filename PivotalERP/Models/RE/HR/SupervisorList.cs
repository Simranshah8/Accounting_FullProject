using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR
{
	public class SupervisorList
	{
		public int? EmployeeId { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? DesignationId { get; set; }
		public int? CompanyRelationId { get; set; }
		public string EmployeeCode { get; set; } = "";
		public string Name { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string LevelCode1 { get; set; } = "";
		public string LevelName1 { get; set; } = "";
		public string LevelBranch1 { get; set; } = "";
		public string LevelStatus1 { get; set; } = "";
		public string LevelCode2 { get; set; } = "";
		public string LevelName2 { get; set; } = "";
		public string LevelBranch2 { get; set; } = "";
		public string LevelStatus2 { get; set; } = "";
		public string LevelCode3 { get; set; } = "";
		public string LevelName3 { get; set; } = "";
		public string LevelBranch3 { get; set; } = "";
		public string LevelStatus3 { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string Company { get; set; } = "";
		public string EmployeeStatus { get; set; } = "";

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