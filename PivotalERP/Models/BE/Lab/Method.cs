using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class lab_Method : ResponeValues
	{

		public int MethodId { get; set; }
		public string Code { get; set; } = "";
		public string Name { get; set; } = "";
		public string Category { get; set; } = "";
		public string Notes { get; set; } = "";
		public bool isActive { get; set; }
	}
	public class lab_MethodCollections : System.Collections.Generic.List<lab_Method>
	{
		public lab_MethodCollections() //constructor
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

