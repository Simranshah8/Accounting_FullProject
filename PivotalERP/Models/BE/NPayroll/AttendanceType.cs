using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.NPayroll
{

	public class AttendanceType : ResponeValues
	{

		public int? AttendanceTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public int Types { get; set; }
		public int PeriodType { get; set; }
		public string Description { get; set; } = "";
		public double CalculationValue { get; set; }
		public int? PayHeadingId { get; set; }
		public int? SNO { get; set; }
		public int? BranchId { get; set; }
		public string Code { get; set; } = "";
		public bool IsActive { get; set; }
		public int UnitsOfWorkId { get; set; }
		public bool CanEditable { get; set; }
		public string AttendanceTypeName { get; set; } = "";
		public string UnitsOfWork { get; set; } = "";
		public string Period { get; set; } = "";
		public string PayHeading { get; set; } = "";
		public int? EmployeeId { get; set; }
		public int? YearId { get; set; }
		public int? MonthId { get; set; }
		public double? Rate { get; set; }
		public double? Value { get; set; }
		public bool ActiveTotalInput { get; set; }

		public bool ShowInSalarySheet { get; set; }

		public AttendanceType()
		{
			AttendanceTypeDetailsColl = new AttendanceTypeDetailsCollections();
		}
		public AttendanceTypeDetailsCollections AttendanceTypeDetailsColl { get; set; } = new AttendanceTypeDetailsCollections();
		public bool IsMonthly { get; set; }
	}
	public class AttendanceTypeDetails
	{

		public int AttendanceTypeId { get; set; }
		public int? EmployeeGroupId { get; set; }
		public int? EmployeeCategoryId { get; set; }
		public double CalculationValue { get; set; }
		public int? BranchId { get; set; }
		public int? DepartmentId { get; set; }
		public int? EmployeeLevelId { get; set; }
	}

	public class AttendanceTypeDetailsCollections : System.Collections.Generic.List<AttendanceTypeDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}
	public class AttendanceTypeCollections : System.Collections.Generic.List<AttendanceType>
	{
		public AttendanceTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}



