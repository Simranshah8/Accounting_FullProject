using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class LabTechnician : ResponeValues
	{

		public int? LabTechnicianId { get; set; }
		public string Name { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string Address { get; set; } = "";
		public string CitizenshipNo { get; set; } = "";
		public string NMCNo { get; set; } = "";
		public string Designation { get; set; } = "";
		public string Signature { get; set; } = "";
		public byte[] Photo { get; set; }

	}
	public class LabTechnicianCollections : System.Collections.Generic.List<LabTechnician>
	{
		public LabTechnicianCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

