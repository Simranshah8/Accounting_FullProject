using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.RE
{
	public class HRDashboard : ResponeValues
	{
     	public int? TotalEmployee { get; set; }
		public int? NewJoins { get; set; }
		public int? ExpiringContract { get; set; }
		public int? Branches { get; set; }
		public int? Departments { get; set; }
		public HRDashboard()
		{
			GenderRatioColl = new GenderRatioCollection();
			MaritalStatusSumColl = new MaritalStatusSumCollection();
			StatusDistributionColl = new StatusDistributionCollection();
			LeaveDetailsColl = new LeaveDetailsCollection();
			TransfersColl = new TransfersCollection();
			RetirementColl = new RetirementCollection();
			EmployeesonLeaveColl = new EmployeesonLeaveCollection();
			EmployeesLeaveColl = new EmployeesLeaveCollection();
			AttendanceReportColl = new AttendanceReportCollection();
			DepartmentWiseAttColl = new DepartmentWiseAttCollection();
			EmployeesListColl = new EmployeesListCollection();
			
		}
		public GenderRatioCollection GenderRatioColl { get; set; }
		public MaritalStatusSumCollection MaritalStatusSumColl { get; set; }
		public StatusDistributionCollection StatusDistributionColl { get; set; }
		public LeaveDetailsCollection LeaveDetailsColl { get; set; }
		public TransfersCollection TransfersColl { get; set; }
		public RetirementCollection RetirementColl { get; set; }
		public EmployeesonLeaveCollection EmployeesonLeaveColl { get; set; }
		public EmployeesLeaveCollection EmployeesLeaveColl { get; set; }
		public AttendanceReportCollection AttendanceReportColl { get; set; }
		public DepartmentWiseAttCollection DepartmentWiseAttColl { get; set; }
		public EmployeesListCollection EmployeesListColl { get; set; }
	
	}

	public class HRDashboardCollections : System.Collections.Generic.List<HRDashboard>
	{
		public HRDashboardCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Gender Ratio
	public class GenderRatio
	{
		public string Gender { get; set; } = "";
		public int? TotalEmployees { get; set; }
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";

	}
	public class GenderRatioCollection : List<GenderRatio>
	{
		public GenderRatioCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	
	//Marital Status
	public class MaritalStatusSum
	{
		public int MaritalStatusId { get; set; }
		public string MaritalStatusName { get; set; } = "";
		public double? TotalEmployees { get; set; }
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string MaritalStatus { get; set; } = "";
		public string EmployeeCode { get; set; } = "";

	}
	public class MaritalStatusSumCollection : List<MaritalStatusSum>
	{
		public MaritalStatusSumCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


	//Status Distribution
	public class StatusDistribution
	{
		public int DepartmentId { get; set; }
		public string Department { get; set; } = "";
		public double? TotalEmployees { get; set; }
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
	}
	public class StatusDistributionCollection : List<StatusDistribution>
	{
		public StatusDistributionCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Leave Details
	public class LeaveDetails
	{
		public int? LeaveRequest { get; set; }
		public int NotApproved { get; set; }
		public int Approved { get; set; }
		public int Cancelled { get; set; }
		public int Rejected { get; set; }
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public int LeaveRequestId { get; set; }
		public string LeaveType { get; set; } = "";
		public int ApprovedType { get; set; }
		public string ApprovedStatus { get; set; } = "";
	}
	public class LeaveDetailsCollection : List<LeaveDetails>
	{
		public LeaveDetailsCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Transfers
	public class Transfers
	{
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Branch { get; set; } = "";
		
	}
	public class TransfersCollection : List<Transfers>
	{
		public TransfersCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Retirement
	public class Retirement
	{
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Branch { get; set; } = "";
		
	}
	public class RetirementCollection : List<Retirement>
	{
		public RetirementCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Employees on Leave
	public class EmployeesonLeave
	{
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string Designation { get; set; } = "";
		public string DurationDisplay { get; set; } = "";
		public string Remarks { get; set; } = "";
		public int LeaveRequestId { get; set; }
		public string LeaveType { get; set; } = "";
		public DateTime EmpLeaveDate { get; set; }
		
	}
	public class EmployeesonLeaveCollection : List<EmployeesonLeave>
	{
		public EmployeesonLeaveCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Employees Leave
	public class EmployeesLeave
	{
		public int present { get; set; }
		public int Leave { get; set; }
			
	}
	public class EmployeesLeaveCollection : List<EmployeesLeave>
	{
		public EmployeesLeaveCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Attendance Report
	public class AttendanceReport
	{
		public int TranId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string PhotoPath { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public DateTime AttendanceDate { get; set; }
		public string AttendanceMitti { get; set; } = "";
		public DateTime InTime { get; set; } 
		public DateTime OutTime { get; set; }
		public string Status { get; set; } = "";
		public string WorkingHours { get; set; }
		public DateTime AttDate { get; set; }


	}
	public class AttendanceReportCollection : List<AttendanceReport>
	{
		public AttendanceReportCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Department Wise Attendance
	public class DepartmentWiseAtt
	{
		public int? DepartmentId { get; set; }
		public string Department { get; set; } = "";
		public int TotalEmployees { get; set; } 
		
			
	}
	public class DepartmentWiseAttCollection : List<DepartmentWiseAtt>
	{
		public DepartmentWiseAttCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//EmployeesList
	public class EmployeesList
	{
		public int? EmployeeId { get; set; }
		public string EmployeeName { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public DateTime DateofJoining { get; set; } 
		public string JoiningMitti { get; set; } = "";
		public string EmployeeType { get; set; } = "";
			
	}
	public class EmployeesListCollection : List<EmployeesList>
	{
		public EmployeesListCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}