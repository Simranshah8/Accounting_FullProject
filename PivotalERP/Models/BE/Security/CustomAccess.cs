using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Security
{

	public class CustomAccess : ResponeValues
	{

		public int? TranId { get; set; }
		public int? ModuleId { get; set; }
		public int? EntityIds { get; set; }
		public int? AutoNumber { get; set; }
		public string AccessName { get; set; } = "";
		public string UserId { get; set; } = "";
		public string GroupId { get; set; } = "";
		public string ModuleName { get; set; } = "";
		public string EntityName { get; set; } = "";

		public int NoOfaAllowedUsers { get; set; }
		public int NoOfAllowedGroup { get; set; }
		public int TotalAccessName { get; set; }

		public int? EntityType { get; set; }



		public CustomAccess()
		{
			CustomAccessColl = new CustomAccessCollections();
		}

		public CustomAccessCollections CustomAccessColl { get; set; }

	}

	public class CustomAccessCollections : System.Collections.Generic.List<CustomAccess>
	{
		public CustomAccessCollections() //constructor
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}
