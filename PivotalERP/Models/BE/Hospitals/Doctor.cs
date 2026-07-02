using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Doctor : ResponeValues
	{

		public int? DoctorId { get; set; }
		public int? AutoNumber { get; set; }
		public string DoctorCode { get; set; } = "";
		public DateTime EntryDate { get; set; }
		public string FullName { get; set; } = "";
		public string FirstName { get; set; } = "";
		public string MiddleName { get; set; } = "";
		public string LastName { get; set; } = "";
		public string NameNP { get; set; } = "";
		public int? Gender { get; set; }
		public string Ethinicity { get; set; } = "";
		public string BloodGroup { get; set; } = "";
		public string Religion { get; set; } = "";
		public DateTime? DateOfBirthAD { get; set; }
		public string DOB_BS { get; set; } = "";
        public string MaritalStatus { get; set; } = "";
		public string Nationality { get; set; } = "";
		public string CitizenshipNo { get; set; } = "";
		public string PanId { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string Contact { get; set; } = "";
		public string FatherName { get; set; } = "";
		public string FatherNameNP { get; set; } = "";
		public string MotherName { get; set; } = "";
		public string MotherNameNP { get; set; } = "";
		public string GrandFather { get; set; } = "";
		public string GrandFatherNP { get; set; } = "";
		public byte[] Photo { get; set; }
		public byte[] PhotoB { get; set; }
		public string PhotoPath { get; set; }
		public string Address { get; set; } = "";
		public string AddressNP { get; set; } = "";
		public string Zone { get; set; } = "";
		public string District { get; set; } = "";
		public string Country { get; set; } = "";
		public string TmpAddress { get; set; } = "";
		public string TmpAddressNP { get; set; } = "";
		public string TmpZone { get; set; } = "";
		public string TmpDistrict { get; set; } = "";
		public string TmpCountry { get; set; } = "";
		public string Designation { get; set; } = "";
		public DateTime? JoinDate { get; set; }
		public int? DepartmentId { get; set; }
		public string PreeOfficeName { get; set; } = "";
		public string PreeOfficePost { get; set; } = "";
		public string PreeOfficeContact { get; set; } = "";
		public string PreeOfficeAddress { get; set; } = "";
		public string PreeOfficeRemarks { get; set; } = "";
		public string Grade { get; set; } = "";
		public string EnrollNumber { get; set; } = "";
		public int? MachineNumber { get; set; }
		public int? DOBNY { get; set; }
		public int? DOBNM { get; set; }
		public int? DOBND { get; set; }
		public string ProvinceState { get; set; } = "";
		public string TmpProvinceState { get; set; } = "";
		public string GenderName { get; set; } = "";
		public string Department { get; set; } = "";
		public bool IsSameAsCurrentAddress { get; set; }
		public string DoctorSignature { get; set; } = "";
		public string NMCNo { get; set; } = "";
		public string NNCNo { get; set; } = "";
		public string NHPNo { get; set; } = "";
		public bool? IsIncentiveApplicable { get; set; }
		public bool? IsAppointmentApplicable { get; set; }
		public bool? IsActive { get; set; }
	}
	public class DoctorCollections : System.Collections.Generic.List<Doctor>
	{
		public DoctorCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

