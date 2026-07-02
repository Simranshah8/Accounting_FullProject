using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class PendingReport : ResponeValues
	{

		public int? TranId { get; set; }
		public int? TestGroupId { get; set; }
		public int? TestNameId { get; set; }
		public int? PatientId { get; set; }
		public int? BillingId { get; set; }
		public int? UnitId { get; set; }
		public int? MethodId { get; set; }
		public string Remarks { get; set; } = "";
		public string NormalLow { get; set; } = "";
		public string NormalHigh { get; set; } = "";
		public int? BarCodeNumber { get; set; }
		public int? DisplaySequence { get; set; }
		public bool isCompleted { get; set; }
		public string Value { get; set; } = "";
		public string Notes { get; set; } = "";
		public int? DoctorId { get; set; }
		public DateTime? ReportingDate { get; set; }
		public string TestName { get; set; } = "";
		public string TestGroupName { get; set; } = "";
		public string CollectionMitti { get; set; } = "";
		public string UnitName { get; set; } = "";
		public string MethodName { get; set; } = "";
		public string Component { get; set; } = "";

		public string DoctorSignature { get; set; } = "";
		public int? TypeId { get; set; }
		public int? AnswerSetId { get; set; }

		public string PatientName { get; set; } = "";
		public int? Age { get; set; }

		public string Gender { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string PatientAddress { get; set; } = "";
		public string Department { get; set; } = "";
		public string TestNameIds { get; set; } = "";
		public int? AutoNumber { get; set; }

		public string CollectionDate { get; set; } = "";

		public bool? IsPendingComplete { get; set; }

		public string DoctorName { get; set; } = "";

		public string BarCode { get; set; } = "";

		public bool? IsVerified { get; set; }

		public string VerificationRemarks { get; set; } = "";

		public string DoctorDesignation { get; set; } = "";
		public int? DoctorId2 { get; set; }
		public string DoctorName2 { get; set; } = "";
		public string DoctorSignature2 { get; set; } = "";
		public string DoctorDesignation2 { get; set; } = "";
		public int? DoctorId3 { get; set; }
		public string DoctorName3 { get; set; } = "";
		public string DoctorSignature3 { get; set; } = "";
		public string DoctorDesignation3 { get; set; } = "";
		//added
		public string Description { get; set; } = "";
		public string ComponentGroup { get; set; } = "";




	}

	public class PendingReportCollection : System.Collections.Generic.List<PendingReport>
	{
		public PendingReportCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

