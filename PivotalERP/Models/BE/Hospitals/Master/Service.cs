using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Service : ResponeValues
	{

		public int? ServiceId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public int? id
		{
			get
			{
				return this.ServiceId;
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

	public class ServiceCollections : System.Collections.Generic.List<Service>
	{
		public ServiceCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}