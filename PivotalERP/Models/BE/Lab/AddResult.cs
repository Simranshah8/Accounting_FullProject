using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{
	public class AddResult : ResponeValues
	{

		public string VoucherMitti { get; set; } = "";
		public int? BillingId { get; set; }

		public string CollectionDate { get; set; } = "";
		public int? PatientId { get; set; }
		public string PatientName { get; set; } = "";
		public int? Age { get; set; }
		public string Gender { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string TestName { get; set; } = "";
		public string Department { get; set; } = "";
		public string TestGroupName { get; set; } = "";
		public string OrderPriorityName { get; set; } = "";
		public string BarCodeNumber { get; set; } = "";
		
		public int? DisplaySequence { get; set; }

		public int? ReportTemplateId { get; set; }
		public int? TypeId { get; set; }

		public int? AnswerSetId { get; set; }


		public string TemplateName { get; set; } = "";

		public DateTime? ReportingDate { get; set; }
		public string Notes { get; set; } = "";

		public int? DoctorId { get; set; }


		public bool? isCompleted { get; set; }
		public string Value { get; set; } = "";
		public string Code { get; set; } = "";
		public string ValueType { get; set; } = "";
		public string AnswerSet { get; set; } = "";
		public string MethodName { get; set; } = "";
		public string Remarks { get; set; } = "";
		public string Formula { get; set; } = "";

		public int? DefValue { get; set; }

		public int? UnitId { get; set; }

		public bool? IsPendingComplete { get; set; }

		public int? MethodId { get; set; } 
		public bool? IsActive { get; set; }
		public int? BillingNumber { get; set; }

		public int? TestGroupId { get; set; }
		public int? TestNameId { get; set; }
		public string DoctorName { get; set; } = "";
		public string PatientAddress { get; set; } = "";
		public DateTime? VoucherDate { get; set; }

		//for getting the single add result value

		public string Component { get; set; } = "";
		public string UnitName { get; set; } = "";


		public string Unit { get; set; } = "";
		public string NormalLow { get; set; } = "";

		public string NormalHigh { get; set; } = "";
		public string TestNameIds { get; set; } = "";
		public int? AutoNumber { get; set; }

		public int? DoctorId2 { get; set; }

		public int? DoctorId3 { get; set; }

		public bool? IsVerified { get; set; }

		//added by yubaraj
		public string Description { get; set; } = "";
		public string ComponentGroup { get; set; } = "";
	

	}
	public class AddResultCollection : System.Collections.Generic.List<AddResult>
	{
		public AddResultCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	

}

