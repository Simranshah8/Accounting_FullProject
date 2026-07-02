using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class DischargeSlip : ResponeValues
	{

		public int? TranId { get; set; }
		public int? DischargeSlipNo { get; set; } 
		public int? PatientId { get; set; }
		public int? InPatientId { get; set; }
		public DateTime? DichargeSlipDate { get; set; }
		public string PatientName { get; set; } = "";
		public string AgeSex { get; set; } = "";
		public string Department { get; set; } = "";
		public string Address { get; set; } = "";
		public string Ward { get; set; } = "";
		public string BedNo { get; set; }
		public string GuardianName { get; set; } = "";
		public string Relation { get; set; } = "";
		public string PhoneNo { get; set; } = "";
		public DateTime? DateAdmission { get; set; }
		public string FinalDiagnosis { get; set; } = "";
		public string DischargeStatus { get; set; } = "";
		public string History { get; set; } = "";
		public string ExaminationAdmission { get; set; } = "";
		public string CourseInHospital { get; set; } = "";
		public string ConditionTimeDischarge { get; set; } = "";
		public DateTime? NextFollowupDate { get; set; }
		public DateTime? NextFollowupTime { get; set; }
		public string Advice { get; set; } = "";
		public string Recommendation { get; set; } = "";
		public string Medications { get; set; } = "";
		public string PreparedBy { get; set; } = "";
		public string CheckedBy { get; set; } = "";
		public string ApprovedBy { get; set; } = "";

		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
		public DischargeSlip()
		{
			InvestigationDetailsColl = new InvestigationDetailsCollections();
			MedicationDetailsColl = new MedicationDetailsCollections();
		}
		public InvestigationDetailsCollections InvestigationDetailsColl { get; set; }
		public MedicationDetailsCollections MedicationDetailsColl { get; set; }
	}
	public class InvestigationDetails
	{

		public int TranId { get; set; }
		public string Test { get; set; } = "";
		public string Result { get; set; } = "";
		public string Remarks { get; set; } = "";
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
	}

	public class InvestigationDetailsCollections : System.Collections.Generic.List<InvestigationDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class MedicationDetails
	{

		public int TranId { get; set; }
		public int? ProductId { get; set; }
		public string Remarks { get; set; } = "";
		public string Code { get; set; }
		public string Name { get; set; }
		public string Attributes { get; set; } = "";
		public string UDFKeyVal { get; set; } = "";
	}

	public class MedicationDetailsCollections : System.Collections.Generic.List<MedicationDetails>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}



	public class PatientDetails : ResponeValues
	{

		public int PatientId { get; set; }
		public string PatientName { get; set; } = "";
		public string AgeSex { get; set; } = "";
		public string Department { get; set; } = "";
		public string Address { get; set; } = "";
		public string Ward { get; set; } = "";
		public int BedNo { get; set; } 
		public string GuardianName { get; set; } = "";
		public string Relation { get; set; } = "";
		public string PhoneNo { get; set; } = "";
		public DateTime? DateAdmission { get; set; } 

	}


	public class DischargeSlipDetailsPrint : ResponeValues
	{

		public int? TranId { get; set; }
		public int? DischargeSlipNo { get; set; } 
		public int? PatientId { get; set; }
		public DateTime? DichargeSlipDate { get; set; }
		public string FinalDiagnosis { get; set; } = "";
		public string DischargeStatus { get; set; } = "";
		public string History { get; set; } = "";
		public string ExaminationAdmission { get; set; } = "";
		public string CourseInHospital { get; set; } = "";
		public string ConditionTimeDischarge { get; set; } = "";
		public DateTime? NextFollowupDate { get; set; }
		public DateTime? NextFollowupTime { get; set; }
		public string Advice { get; set; } = "";
		public string Recommendation { get; set; } = "";
		public string Medications { get; set; } = "";
		public string PreparedBy { get; set; } = "";
		public string CheckedBy { get; set; } = "";
		public string ApprovedBy { get; set; } = "";
		public string Test { get; set; } = "";
		public string Result { get; set; } = "";
		public string Remarks { get; set; } = "";
		public int? ProductId { get; set; }
		public string MRemarks { get; set; } = "";
		public string DichargeSlipDateBS { get; set; } = "";
		public string NextFollowupDateBS { get; set; } = "";

		public string PatientName { get; set; }
		public string AgeSex { get; set; }
		public string Department { get; set; }
		public string Address { get; set; }
		public string Ward { get; set; }
		public string BedNo { get; set; }
		public string GuardianName { get; set; }
		public string Relation { get; set; }
		public string PhoneNo { get; set; }
		public string DateAdmission { get; set; }
		public DateTime InDateTime { get; set; }

		public DischargeSlipDetailsPrint()
        {
			InvestigationDetailsColl = new InvestigationDetailsPrintCollections();
			MedicationDetailsColl = new MedicationDetailsPrintCollections();
		}
		public InvestigationDetailsPrintCollections InvestigationDetailsColl { get; set; }
		public MedicationDetailsPrintCollections MedicationDetailsColl { get; set; }



	}



	public class InvestigationDetailsPrint
	{

		public int TranId { get; set; }
		public string Test { get; set; } = "";
		public string Result { get; set; } = "";
		public string Remarks { get; set; } = "";
	}

	public class InvestigationDetailsPrintCollections : System.Collections.Generic.List<InvestigationDetailsPrint>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}


	public class MedicationDetailsPrint
	{

		public int TranId { get; set; }
		public int ProductId { get; set; }
		public string MRemarks { get; set; } = "";
		public string Code { get; set; }
		public string Name { get; set; }
	}

	public class MedicationDetailsPrintCollections : System.Collections.Generic.List<MedicationDetailsPrint>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}



	public class DischargeSlipCollections : System.Collections.Generic.List<DischargeSlip>
	{
		public DischargeSlipCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }

	}
}