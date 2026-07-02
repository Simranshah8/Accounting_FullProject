using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Account
{
	public class Circle : ResponeValues 
	{ 
		public int? CircleID { get; set; } 
		public string CircleName { get; set; } ="" ; 
		public string Description { get; set; } ="" ; 
		}

	public class CircleCollections : System.Collections.Generic.List<Circle>
	{
		public CircleCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

