using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.HR
{
	public class GrievanceForm : ResponeValues
	{

		public int? TranId { get; set; }
		public int? UserId { get; set; }
		public int? GrievanceTypeId { get; set; }
		public int? StatusId { get; set; }
		public DateTime? IncidentDate { get; set; }
		public string LocationOfInc { get; set; } = "";
		public string Suggestion { get; set; } = "";
		public bool? Declaration { get; set; }
		public string Description { get; set; } = "";
		public string Attachment { get; set; } = "";
		public byte[] AttachmentB { get; set; }

		public string ActionTaken { get; set; } = "";
		public string Notes { get; set; } = "";
		public string Remarks { get; set; } = "";

		public DateTime? ActionTakenAt { get; set; }
		public DateTime? ClosureDate { get; set; }


		public int? ActionTakenById { get; set; }
		public int? AssignedToId { get; set; }

		public string EmployeeName { get; set; } = "";
		public string EmployeeCode { get; set; } = "";
		public string GrievanceTypeName { get; set; } = "";
		public string SubmissionMiti { get; set; } = "";
		public string AssignTo { get; set; } = "";
		public string IncidentMiti { get; set; } = "";
		public string ActionTakenMiti { get; set; } = "";

		public int? EmployeeOrSalesman { get; set; }

		public string Employeename { get; set; } = "";
		public string Department { get; set; } = "";
		public string Designation { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public long? EnrollNumber { get; set; }

	}
	public class GrievanceFormCollections : List<GrievanceForm>
	{
		public GrievanceFormCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; } = "";
		public bool IsSuccess { get; set; }

	}
}

