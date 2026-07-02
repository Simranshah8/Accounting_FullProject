using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.BE.NPayroll
{
	public class SalaryAddDeduct : ResponeValues
	{
		public int? TranId { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? DesignationId { get; set; }
		public int? ServiceTypeId { get; set; }
		public int? EmployeeId { get; set; }
		public int? Gender { get; set; }
		public string Title { get; set; } = "";
		public int? TypeId { get; set; }
		public double Amount { get; set; }
		public int? YearId { get; set; }
		public int? MonthId { get; set; }
		public int PayHeadingId { get; set; }
		public DateTime? ForDate { get; set; }
		public string Remarks { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string ServiceType { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string AddDeductType { get; set; } = "";
		public string PayHeading { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string ForMiti { get; set; } = "";
	}

	public class SalaryAddDeductCollections : System.Collections.Generic.List<SalaryAddDeduct>
	{
		public SalaryAddDeductCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

