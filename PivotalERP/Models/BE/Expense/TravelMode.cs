using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Expense
{

	public class TravelMode : ResponeValues 
	{ 

		public int? TravelModeId { get; set; } 
		public string Name { get; set; } ="" ; 
		public int? Code { get; set; } 
		}
	public class TravelModeCollections : List<TravelMode>
    {

		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}
}

