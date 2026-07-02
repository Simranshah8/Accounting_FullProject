using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class JobWorkOrder : ResponeValues
	{

		public int? TranId { get; set; }
		public int? JobCardId { get; set; }
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
		public string Remarks { get; set; } = "";
	}

	public class JobWorksOrder : ResponeValues
	{

		public int? TranId { get; set; }
		public int? VoucherId { get; set; }
		public int? CostClassId { get; set; }
		public int? AutoVoucherNo { get; set; }
		public string ManualVoucherNo { get; set; } = "";
		public string AutoManualNo { get; set; } = "";
		public int? BranchId { get; set; }
		public int? PartyLedgerId { get; set; }
		public string PartyName { get; set; } = "";
		public string Address { get; set; } = "";
		public string ContactNo { get; set; } = "";
		public int? JobCardId { get; set; }
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
		public string Remarks { get; set; } = "";
		public DateTime? VoucherDate { get; set; }
		public string VoucherName { get; set; } = "";
		public string FiscalYear { get; set; } = "";
		public string BranchName { get; set; } = "";
		public string FromMiti { get; set; } = "";
		public string ToMiti { get; set; } = "";


		public JobWorksOrder()
		{
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();

		}
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

	}
	public class JobWorksOrderCollections : System.Collections.Generic.List<JobWorksOrder>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; } = "";
	}

}

