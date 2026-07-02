using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class Components : ResponeValues
	{

		public int ComponentId { get; set; }
		public int TestId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int TypeId { get; set; }
		public int UnitId { get; set; }
		public int? Decimal { get; set; }
		public bool IsCalculated { get; set; }
		public string Formula { get; set; } = "";
		public int AnswerSetId { get; set; }
		public int SortOrder { get; set; }
		public string ComponentGroup { get; set; } = "";
		public bool IsActive { get; set; }
		public string Test { get; set; } = "";
		public string Type { get; set; } = "";
		public string Unit { get; set; } = "";
		public string AnswerSet { get; set; } = "";
		public string Symbol { get; set; } = "";
		public string TestName { get; set; } = "";

	}
	public class ComponentsCollections : System.Collections.Generic.List<Components>
	{
		public ComponentsCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

