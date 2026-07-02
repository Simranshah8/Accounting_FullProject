using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{
	public class SampleCollect : ResponeValues
	{
		
		public string VoucherMitti { get; set; } = "";
		public int? BillingNumber { get; set; }
		public int? PatientId { get; set; }
		public string PatientName { get; set; } = "";
		public int? Age { get; set; }
		public string Gender { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string Department { get; set; } = "";
		public string DoctorName { get; set; } = "";
		public string PatientAddress { get; set; } = "";
		public DateTime? VoucherDate { get; set; }
		public bool? IsPendingComplete { get; set; }
		public bool? IsCollected { get; set; }


    }
	public class SampleCollection : System.Collections.Generic.List<SampleCollect>
	{
		public SampleCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class BillingDetails : ResponeValues
    {
		public int? BillingNo { get; set; }
		public int? TestNameId { get; set; }
		public string TestName { get; set; } = "";
		public int? DoctorId { get; set; }
		public string DoctorName { get; set; } = "";
		public string OrderPriority { get; set; } = "";
        public bool IsOutSources { get; set; }
        public int? DepartmentId { get; set; }
		public string Department { get; set; } = "";

		public int? TranId { get; set; }
		public int? BillingId { get; set; }
		public DateTime? CollectionDate { get; set; }
		public string CollectionMitti { get; set; } = "";
		public DateTime? CollectionTime { get; set; }
		public int? SpecimenId { get; set; }
		public string Specimen { get; set; } = "";
		public string SampleCollectedAt { get; set; } = "";
		public DateTime? RequestDate { get; set; }
		public string RequestMitti { get; set; } = "";
		public string BarCodeNumber { get; set; } = "";
		public int? AutoNumber { get; set; }
		public BillingDetails()
        {
			SpecimenTypeColl = new List<SpecimenTypeByTest>();
		}
        public List<SpecimenTypeByTest> SpecimenTypeColl { get; set; }
    }
	public class BillingDetailsCollection : List<BillingDetails>
    {
        public BillingDetailsCollection()
        {
			ResponseMSG = "";
			SpecimenTypeColl = new List<SpecimenTypeByTest>();
		}
		public List<SpecimenTypeByTest> SpecimenTypeColl { get; set; }
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}

    public class SpecimenTypeByTest
	{
        public int? BillingNo { get; set; }
        public int? TestNameId { get; set; }
        public int? DefaultSpecimenId { get; set; }
		public string DefaultSpecimen { get; set; } = "";
		public int? id
		{
			get
			{
				return this.DefaultSpecimenId;
			}
		}
		public string text
		{
			get
			{
				return this.DefaultSpecimen;
			}
		}
	}
}

