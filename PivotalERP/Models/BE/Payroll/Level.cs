using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{

	public class Level : ResponeValues
	{

		public int? LevelId { get; set; }
		public string Name { get; set; } = "";
		public int? OrderNo { get; set; }
		public string Code { get; set; } = "";
		public string Description { get; set; } = "";
		public int? LedgerId { get; set; }
		public Level()
		{
			LevelWisePayHeadLedgerColl = new LevelWisePayHeadLedgerCollection();

		}
		public LevelWisePayHeadLedgerCollection LevelWisePayHeadLedgerColl { get; set; }
	}
	public class LevelCollections : System.Collections.Generic.List<Level>
	{
		public LevelCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class LevelWisePayHeadLedger
	{
		public int? LevelId { get; set; }
		public int? PayHeadingId { get; set; }
		public int? LedgerId { get; set; }
	}
	public class LevelWisePayHeadLedgerCollection : List<LevelWisePayHeadLedger>
	{
		public LevelWisePayHeadLedgerCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

