using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.GateMaster
{
	public class Vehicle : ResponeValues
	{

		public int? VehicleId { get; set; }
		public int? BranchId { get; set; }
		public string VehicleType { get; set; } = "";
		public string TransporterName { get; set; } = "";
		public string RFIDTag { get; set; } = "";
		public string InsuranceNo { get; set; } = "";
		public string PollutionNo { get; set; } = "";
		public string EngineNo { get; set; } = "";
		public string VinNo { get; set; } = "";
		public string RegNo { get; set; } = "";
		public bool IsBlackListed { get; set; }
		public bool IsActive { get; set; }
		public string BranchName { get; set; } = "";
	}
	public class VehicleCollections : List<Vehicle>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}
}

