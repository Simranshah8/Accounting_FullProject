using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Vital : ResponeValues
	{

		public int? VitalId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public int? id
		{
			get
			{
				return this.VitalId;
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

	public class VitalCollections : System.Collections.Generic.List<Vital>
	{
		public VitalCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}