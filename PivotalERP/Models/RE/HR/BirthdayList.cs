using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.HR
{
	public class BirthdayList
	{
		public int? EmployeeId { get; set; }
		public int? UserId { get; set; }
		public int? EnrollNumber { get; set; }
		public string EmployeeCode { get; set; } = "";
		public string Name { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string FatherName { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public string FullAddress { get; set; } = "";
		public int? AgeYear { get; set; }
		public int? AgeMonth { get; set; } 
		public int? AgeDay { get; set; }
		public string PhotoPath { get; set; } = "";
		public DateTime? DOB { get; set; }
		public string AgeDet { get; set; } = "";
		public string DOB_BS { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string Company { get; set; } = "";
	}

	public class BirthdayListCollections : System.Collections.Generic.List<BirthdayList>
	{
		public BirthdayListCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}