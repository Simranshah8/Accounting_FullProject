using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{
	public class Department : ResponeValues
	{
		public int? DepartmentId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public double OutPatientCharge { get; set; }
		public bool CanChangeOPDCharge { get; set; }
		public double InPatientCharge { get; set; }
		public bool CanChageInCharge { get; set; }
		public double DepositeAmount { get; set; }
		public bool CanChangeDepositeAmount { get; set; }
		public bool IsActive { get; set; }
		public bool ApplyTax { get; set; }
		public bool IncludeTax { get; set; }
		public string RoomNo { get; set; } = "";
		public int? LedgerId { get; set; }
		public string LabDoctor { get; set; } = "";
		public int? ParentId { get; set; }
		public bool ForInPatient { get; set; }
		public string DoctorSign { get; set; } = "";
		public byte[] Photo { get; set; }
		public string DoctorNotes { get; set; } = "";
		public string DoctorDesignation { get; set; } = "";
		public string DoctorLicNo { get; set; } = "";
		public bool ForOutPatient { get; set; }
		public bool ActiveAccount { get; set; }
		public int? BranchId { get; set; }
		public int? CostCenterId { get; set; }
		public bool IsEffectAccount { get; set; }
		public bool? IsAppointmentApplicable { get; set; }
		public int? id
		{
			get
			{
				return this.DepartmentId;
			}
		}
		public string text
		{
			get
			{
				return this.Name;
			}
		}
		public Department()
		{
			DepartmentDetailsColl = new DepartmentDetailsCollections();
			DepartmentDoctorRateColl = new DepartmentDoctorRateCollections();
		}
		public DepartmentDetailsCollections DepartmentDetailsColl { get; set; }
		public DepartmentDoctorRateCollections DepartmentDoctorRateColl { get; set; }
	}
	public class DepartmentCollections : System.Collections.Generic.List<Department>
	{
		public DepartmentCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class DepartmentDetails
	{
		public int DepartmentId { get; set; }
		public int ? OPDTicketTypeId { get; set; }
		public double? OutPatientCharge { get; set; }
		public double? InPatientCharge { get; set; }
		public double? DepositeAmount { get; set; }
		public int? ValidDays { get; set; }
		public double? ReOutPatientCharge { get; set; }
	}

	public class DepartmentDetailsCollections : System.Collections.Generic.List<DepartmentDetails>
	{
		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

	public class DepartmentDoctorRate
	{

		public int? DoctorId { get; set; }
		public int DepartmentId { get; set; }
		public int? OPDTicketTypeId { get; set; }
		public double? OutPatientCharge { get; set; }
		public double ? InPatientCharge { get; set; }
		public double ? DepositeAmount { get; set; }
		public int? ValidDays { get; set; }
		public double? ReOutPatientCharge { get; set; }
	}

	public class DepartmentDoctorRateCollections : System.Collections.Generic.List<DepartmentDoctorRate>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}

