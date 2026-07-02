using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.GateMaster
{

	public class GateMaster : ResponeValues
	{

		public int? GateId { get; set; }
		public int? BranchId { get; set; }
		public string Code { get; set; } = "";
		public string Name { get; set; } = "";
		public string GateType { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string VoucherName { get; set; } = "";
		public bool IsActive { get; set; }
		public int? VoucherId { get; set; }
	}

	public class GateMasterCollections : System.Collections.Generic.List<GateMaster>
	{
		public GateMasterCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

