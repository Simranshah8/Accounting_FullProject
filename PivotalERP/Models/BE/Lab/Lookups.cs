using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class AnswerSetValue : ResponeValues
	{

		public int LookupId { get; set; }
		public string Name { get; set; } = "";
		public string Purpose { get; set; } = "";
		public bool IsActive { get; set; }
		public AnswerSetValue()
		{
			LookUpsColl = new LookUpsCollections();
		}
		public LookUpsCollections LookUpsColl { get; set; }
	}
	public class AnswerSetValueCollections : System.Collections.Generic.List<AnswerSetValue>
	{
		public AnswerSetValueCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class LookUps
	{
		public int? LookupId { get; set; }
		public string ValuesName { get; set; } = "";
		public string ValuesLabel { get; set; } = "";
		public int? SortOrder { get; set; }
		public bool IsNormal { get; set; }
	}

	public class LookUpsCollections : System.Collections.Generic.List<LookUps>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}


