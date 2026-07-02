using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Dynamic.RE.Dashboard
{
	public class HRMDashboard : ResponeValues
	{
		//Gender Ratio Summary
		public int? TotalEmployees { get; set; }
		public int? Male { get; set; }
		public int? Female { get; set; }
		public double? MaleRatio { get; set; }
		public double? FemaleRatio { get; set; }

		//Attendance Summary
		public int? Present { get; set; }
		public int? Absent { get; set; }
		public double? AbsentPercentage { get; set; }
		public double? PresentPercentage { get; set; }

		// New Employees
		public int? TotalNewEmp { get; set; }
		public string MonthNames { get; set; } = "";

		//Attendance Appeal
		public int? ApprovedAtt { get; set; }
		public int? PendingAtt { get; set; }
		public int? RejectedAtt { get; set; }
		public int? TotalAppealedAtt { get; set; }
		public double? AttApprovalRate { get; set; }
		public double? ApprovedAttPer { get; set; }
		public double? PendingAttper { get; set; }
		public double? RejectedAttPer { get; set; }

		//Leave Status
		public int? LeaveApproved { get; set; }
		public int? LeavePending { get; set; }
		public int? LeaveRejected { get; set; }

		//Holidays
		public int? TotalHolodays { get; set; }
		public int? RemainingHolidays { get; set; }
		public int? HolidayTaken { get; set; }
		public int? AvailableHolidays { get; set; }

		//TOTAL ADVANCE / RECEIVE
		public double? TotalAdvanceAmt { get; set; }
		public double? TotalReceivedAmt { get; set; }
		public double? TotalAmount { get; set; }

		//UPCOMING BIRTHDAY
		public int? TotalEmployeeBirthdays { get; set; }
		public int? MonthId { get; set; }
		public string NepaliMonth { get; set; } = "";

		public HRMDashboard()
        {
			
			SalaryDistributionColl = new SalaryDistributionCollection(); //Salary Distribution
			BranchWiseEmpAttColl = new BranchWiseEmpAttCollection(); //BRANCH WISE EMPLOYEE & ATTENDANCE
			DepartmentWiseEmpColl = new DepartmentWiseEmpCollection(); //DEPARTMENT WISE EMPLOYEE
			EmpListGenderCardColl = new EmpListGenderCardCollection(); //Workforce List 
			EmpAttendanceColl = new EmpAttendanceCollection(); //EmpAttendance List  
			NewEmployeeDetColl = new NewEmployeeDetCollection(); //New Employee List  
			HolidaysColl = new HolidaysCollection(); //Holidays List   
			AdvanceReceiveColl = new AdvanceReceiveCollection(); //Total Advance/Receive List  
			SalaryDistributionListColl = new SalaryDistributionListCollection(); //Salary Distribution List
			BranchWiseEmpAttendanceColl = new BranchWiseEmpAttendanceCollection(); //Branch Wise Employee Attendance List
			DepartmentWiseEmplpyeeColl = new DepartmentWiseEmplpyeeCollection(); //Department Wise Employee Attendance List
			EmployeeBirthdayListColl = new EmployeeBirthdayListCollection(); //Upcoming Birthday Employee List
		}
        public SalaryDistributionCollection SalaryDistributionColl { get; set; } //Salary Distribution
		public BranchWiseEmpAttCollection BranchWiseEmpAttColl { get; set; } //BRANCH WISE EMPLOYEE & ATTENDANCE
        public DepartmentWiseEmpCollection DepartmentWiseEmpColl { get; set; } //DEPARTMENT WISE EMPLOYEE
        public EmpListGenderCardCollection EmpListGenderCardColl { get; set; } //Workforce List 
        public EmpAttendanceCollection EmpAttendanceColl { get; set; } //EmpAttendance List 
        public NewEmployeeDetCollection NewEmployeeDetColl { get; set; } //New Employee List 
        public AttendanceApealCollection AttendanceApealColl { get; set; } //Attendance Appeal List 
        public LeaveStatusCollection LeaveStatusColl { get; set; } //Leave Status List 
        public HolidaysCollection HolidaysColl { get; set; } //Holidays List 
        public AdvanceReceiveCollection AdvanceReceiveColl { get; set; } //Total Advance/Receive List
        public SalaryDistributionListCollection SalaryDistributionListColl { get; set; } //Salary Distribution List
        public BranchWiseEmpAttendanceCollection BranchWiseEmpAttendanceColl { get; set; } //Branch Wise Employee Attendance List
        public DepartmentWiseEmplpyeeCollection DepartmentWiseEmplpyeeColl { get; set; } //Departmet Wise Employee Attendance List
        public EmployeeBirthdayListCollection EmployeeBirthdayListColl { get; set; } //Upcoming Birthday Employee List
	}
	public class HRMDashboardCollections : System.Collections.Generic.List<HRMDashboard>
	{
		public HRMDashboardCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Salary Distribution
	public class SalaryDistribution
	{
        public double? SalaryDistrPer { get; set; }
        public string MonthsName { get; set; } = "";

    }
    public class SalaryDistributionCollection : List<SalaryDistribution>
    {
        public SalaryDistributionCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

	//BRANCH WISE EMPLOYEE & ATTENDANCE
	public class BranchWiseEmpAtt
	{
        public int? BTotalEmployees { get; set; }
        public int? BTotalPresent { get; set; }
        public int? BTotalAbsent { get; set; }
        public string BranchName { get; set; } = "";

    }
    public class BranchWiseEmpAttCollection : List<BranchWiseEmpAtt>
    {
        public BranchWiseEmpAttCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

	//DEPARTMENT WISE EMPLOYEE
	public class DepartmentWiseEmp
	{
        public int? TotalEmployees { get; set; }
        public int? PresentEmp { get; set; }
        public int? AbsentEmp { get; set; }
        public string DepartmentName { get; set; } = "";

    }
    public class DepartmentWiseEmpCollection : List<DepartmentWiseEmp>
    {
        public DepartmentWiseEmpCollection()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

	//Workforce List 
	public class EmpListGenderCard
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string PanId { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string CITAcNo { get; set; } = "";
		public string SSFNo { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public string CompanyContactNo { get; set; } = "";
		public string JoiningMitti { get; set; } = "";
		public string AccountNo { get; set; } = "";

	}
	public class EmpListGenderCardCollection : List<EmpListGenderCard>
	{
		public EmpListGenderCardCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Attendance List 
	public class EmpAttendance
	{
		public int? UserId { get; set; }
		public int? EmployeeId { get; set; }
		public int? TranId { get; set; }
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public string AttStatus { get; set; } = "";
		public DateTime InTime { get; set; }
		public DateTime OutTime { get; set; }
		public DateTime AttendanceDate { get; set; }
		public string AttendanceMitti { get; set; } = "";
		public string InOutTypes { get; set; } = "";
		public string AttRemarks { get; set; } = "";

	}
	public class EmpAttendanceCollection : List<EmpAttendance>
	{
		public EmpAttendanceCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//New Emplopyee List 
	public class NewEmployeeDet
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public string JoiningMitti { get; set; } = "";
		public string Department { get; set; } = "";

	}
	public class NewEmployeeDetCollection : List<NewEmployeeDet>
	{
		public NewEmployeeDetCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Attendance Appeal List 
	public class AttendanceApeal
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public string Reason { get; set; } = "";
		public string ApprovedStatus { get; set; } = "";
		public int? ApprovedType { get; set; }
		public string AppealMitti { get; set; } = "";
		public DateTime InTime { get; set; } 
		public DateTime OutTime { get; set; } 

	}
	public class AttendanceApealCollection : List<AttendanceApeal>
	{
		public AttendanceApealCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Leave Status List 
	public class LeaveStatus
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string LeaveFromMitti { get; set; } = "";
		public string LeaveToMitti { get; set; } = "";
		public string Reasons { get; set; } = "";
		public double? TotalDays { get; set; }
		public int? ApprovedType { get; set; }
		public string ApprovedStatus { get; set; } = "";
		public string LeaveType { get; set; } = "";

	}
	public class LeaveStatusCollection : List<LeaveStatus>
	{
		public LeaveStatusCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Holidays List 
	public class Holidays
	{
		public string HolidayName { get; set; } = "";
		public string HolidayMitti { get; set; } = "";
		public double? TotalDays { get; set; }
		public string HolidayType { get; set; } = "";
		public string HolidayStatus { get; set; } = "";

	}
	public class HolidaysCollection : List<Holidays>
	{
		public HolidaysCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Total Advance/Receive List 
	public class AdvanceReceive
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public double? TotalAdvanceAmt { get; set; }
		public double? TotalReceiveAmt { get; set; }
		public double? RemainingAmt { get; set; }
	}
	public class AdvanceReceiveCollection : List<AdvanceReceive>
	{
		public AdvanceReceiveCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	
	//Salary Distribution List
	public class SalaryDistributionList
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string PayHeading { get; set; } = "";
		public int? YearName { get; set; }
		public string NepaliMonth { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public double? BasicSalary { get; set; }
		public double? Allowance { get; set; }
		public double? DeductedAmt { get; set; }
		public double? NetPayableAmt { get; set; }
		public double? Earning { get; set; }
		public double? PayHeadingAmounts { get; set; }
	}
	public class SalaryDistributionListCollection : List<SalaryDistributionList>
	{
		public SalaryDistributionListCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	
	//Branch Wise Employee and Attendance List
	public class BranchWiseEmpAttendance
	{
		public string BranchName { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Department { get; set; } = "";
		public string AttStatus { get; set; } = "";
		public string AttendanceMitti { get; set; } = "";
		public DateTime InTime { get; set; }
		public DateTime OutTime { get; set; }
	}
	public class BranchWiseEmpAttendanceCollection : List<BranchWiseEmpAttendance>
	{
		public BranchWiseEmpAttendanceCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	//Department Wise Employee Attendance List
	public class DepartmentWiseEmplpyee
	{
		public string DepartmentName { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Department { get; set; } = "";
		public string AttStatus { get; set; } = "";
		public string AttendanceMitti { get; set; } = "";
		public DateTime InTime { get; set; }
		public DateTime OutTime { get; set; }
	}
	public class DepartmentWiseEmplpyeeCollection : List<DepartmentWiseEmplpyee>
	{
		public DepartmentWiseEmplpyeeCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	
	//Upcoming Birthday Employee List
	public class EmployeeBirthdayList
	{
		public string EmployeeCode { get; set; } = "";
		public string EmployeeName { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Department { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string CompanyName { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public string DOBMitti { get; set; } = "";
		public int? Age { get; set; }
		
	}
	public class EmployeeBirthdayListCollection : List<EmployeeBirthdayList>
	{
		public EmployeeBirthdayListCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}