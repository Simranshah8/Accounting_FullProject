using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{

	public class TravelType : ResponeValues
	{

		public int? TravelTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Description { get; set; } = "";
		public int? OrderNo { get; set; }
	}
	public class TravelTypeCollections : System.Collections.Generic.List<TravelType>
	{
		public TravelTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

