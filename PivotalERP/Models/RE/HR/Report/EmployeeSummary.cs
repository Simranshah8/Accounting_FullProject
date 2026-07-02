using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.RE.HR.Report
{

	public class EmployeeSummary : ResponeValues
	{

		public int? EmployeeId { get; set; }
		public string PhotoPath { get; set; } = "";
		public int? AutoNumber { get; set; }
		public string EmployeeCode { get; set; } = "";
		public long? EnrollNo { get; set; }
		public string EmployeeName { get; set; } = "";
		public string Gender { get; set; } = "";
		public DateTime? DOB_AD { get; set; }
		public string DOB_BS { get; set; } = "";
		public string Nationality { get; set; } = "";
		public string MaritalStatus { get; set; } = "";
		public string Branch { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string LevelName { get; set; } = "";
		public string ServiceType { get; set; } = "";
		public string EmployeeGroup { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string PersnalContactNo { get; set; } = "";
		public string EmergencyContactNo { get; set; } = "";
		public string PermanentAddress { get; set; } = "";
		public string TemporaryAddress { get; set; } = "";
		public DateTime? DateofJoining { get; set; }
		public string DateofJoiningMiti { get; set; } = "";
		public DateTime? DateofRetirement { get; set; }
		public string DateofRetirementMiti { get; set; } = "";
		public string FatherName { get; set; } = "";
		public string MotherName { get; set; } = "";
		public string CardNo { get; set; } = "";
		public int? UserId { get; set; } 
		public string UserName { get; set; } = "";
		public string CitizenshipNo { get; set; } = "";
		public string BloodGroup { get; set; } = "";
		public string PanId { get; set; } = "";
		public string ServicePeriod { get; set; } = "";
		public DateTime? PermanentDate { get; set; } 
		public string PermanentDateMiti { get; set; } = "";
		//Add Fields
		public string PFAccountNo { get; set; } = "";
		public string AccessionNo { get; set; } = "";
		public string SSFNo { get; set; } = "";
		public string CitCode { get; set; } = "";
		public string CITAcNo { get; set; } = "";
		public string GratIdNum { get; set; } = "";
		public string GratAccNum { get; set; } = "";
		public string Company { get; set; } = "";
		public DateTime? ConfirmationDate { get; set; }
		public string ConfirmationMiti { get; set; } = "";

	}

	public class EmployeeSummaryCollections : System.Collections.Generic.List<EmployeeSummary>
	{
		public EmployeeSummaryCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}

