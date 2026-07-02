using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.HR
{

	public class HeadOfDepartment : ResponeValues
	{

		public int? TranId { get; set; }
		public int? CompanyId { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? ServiceTypeId { get; set; }
		public int? EmployeeId { get; set; }
		public int? CoEmployeeId { get; set; }
		public DateTime? StartDate { get; set; }
		public string Note { get; set; } = "";
		public string Company { get; set; } = "";
		public string Branch { get; set; } = "";
		public string Department { get; set; } = "";
		public string ServiceType { get; set; } = "";
		public string Employee { get; set; } = "";
		public string CoEmployee { get; set; } = "";
		public string StartDateMiti { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string CoEmployeeCode { get; set; } = "";
        public int? UserId { get; set; }
        public int? CoUserId { get; set; }
		public string BranchIds { get; set; } = "";
		public string CompanyRelationshipIds { get; set; } = "";
		public int? ProductId { get; set; } //Added by Simran
		public string ProductName { get; set; } = ""; //Added by Simran
	}
	public class HeadOfDepartmentCollections : System.Collections.Generic.List<HeadOfDepartment>
	{
		public HeadOfDepartmentCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

