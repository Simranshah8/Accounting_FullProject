using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class ReferenceRule : ResponeValues
	{

		public int RefRuleId { get; set; }
		public bool ModeId { get; set; }
		public int? TestNameId { get; set; }
		public int? TestComponentId { get; set; }
		public int? ComponentGlobalId { get; set; }
		public bool IsActive { get; set; }
		public int? GenderId { get; set; }
		public int? MinAge { get; set; }
		public int? MaxAge { get; set; }
		public string NormalHigh { get; set; } = "";
		public string NormalLow { get; set; } = "";
		public string TestName { get; set; } = "";
		public string ComponentName { get; set; } = "";
		public string GlobalComponentName { get; set; } = "";
		public string GenderName { get; set; } = "";
		public ReferenceRule()
		{
			RefRuleLookUpsColl = new RefRuleLookUpsCollections();
		}
		public RefRuleLookUpsCollections RefRuleLookUpsColl { get; set; }

	}
	public class ReferenceRuleCollections : System.Collections.Generic.List<ReferenceRule>
	{
		public ReferenceRuleCollections() 
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class RefRuleLookUps : ResponeValues
	{

		public int? RefRuleId { get; set; }
		public int? GenderId { get; set; }
		public int? MinAge { get; set; }
		public int? MaxAge { get; set; }
		public string NormalLow { get; set; } = "";
		public string NormalHigh { get; set; } = "";
		public string CriticalLow { get; set; } = "";
		public string CriticalHigh { get; set; } = "";
		public string TextualRef { get; set; } = "";
	}

	public class RefRuleLookUpsCollections : System.Collections.Generic.List<RefRuleLookUps>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}


