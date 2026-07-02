using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class lab_Unit : ResponeValues
	{
		public int UnitId { get; set; }
		public string Symbol { get; set; } = "";
		public string Description { get; set; } = "";
		public string Category { get; set; } = "";
		public bool isActive { get; set; }
	}

	public class lab_UnitCollections : System.Collections.Generic.List<lab_Unit>
	{
		public lab_UnitCollections() //constructor
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

