using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Attendance
{

	public class LeaveBalanceSummary : ResponeValues
	{

		public int? EmployeeId { get; set; }
		public int? UserId { get; set; }
		public int? LeaveTypeId { get; set; }
		public string EmployeeCode { get; set; } = "";
		public string Name { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string Department { get; set; } = "";
		public string Category { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public string PersonalContact { get; set; } = "";
		public string LeaveName { get; set; } = "";
		public string LeaveCode { get; set; } = "";
		public double OpeningQty { get; set; }
		public double QuotaQty { get; set; }
		public double leaveQty { get; set; }
		public double BalanceLeave { get; set; }
		public string ForEmpOrSalesman { get; set; } = "";
	}
	public class LeaveBalanceSummaryCollections : System.Collections.Generic.List<LeaveBalanceSummary>
	{
		public LeaveBalanceSummaryCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

