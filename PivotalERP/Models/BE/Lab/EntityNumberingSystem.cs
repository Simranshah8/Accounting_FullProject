using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class EntityNumberingSystem : ResponeValues
	{

		public int? TranId { get; set; }
		public int? EntityNo { get; set; }
		public string SettingName { get; set; } = "";
		public string Prefix { get; set; } = "";
		public string Suffix { get; set; } = "";
		public int? CurrentNumbering { get; set; }
	}

	public class EntityNumberingSystemCollections : System.Collections.Generic.List<EntityNumberingSystem>
	{
		public EntityNumberingSystemCollections() //constructor
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

