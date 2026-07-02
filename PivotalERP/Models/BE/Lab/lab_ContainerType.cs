using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class lab_ContainerType : ResponeValues
	{

		public int ContainerTypeId { get; set; }
		public string ContainerName { get; set; } = "";
		public string Color { get; set; } = "";
		public string Additive { get; set; } = "";
		public double? VolumeMl { get; set; }
		public string DefaultSpecimen { get; set; } = "";
		public bool IsActive { get; set; }
	}
	public class lab_ContainerTypeCollections : System.Collections.Generic.List<lab_ContainerType>
	{
		public lab_ContainerTypeCollections() //constructor
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

