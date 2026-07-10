using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AppCMS
{
	public class WelnessGoals : ResponeValues
	{

		public int? WelnessId { get; set; }
		public string Name { get; set; } = "";
		public string Banner { get; set; } = "";
		public string Image { get; set; } = "";
		public byte[] ImageB { get; set; }
		public string Description { get; set; } = "";
		public string Badge { get; set; } = "";
		public int? HerbId { get; set; }
		public int? id
		{
			get
			{
				return this.WelnessId;
			}
		}
		public string text
		{
			get
			{
				return this.Name;
			}
		}
	}

	public class WelnessGoalsCollections : System.Collections.Generic.List<WelnessGoals>
	{
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}