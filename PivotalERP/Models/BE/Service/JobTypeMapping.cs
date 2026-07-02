using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{

	public class JobTypeMapping : ResponeValues
	{

		public int? JobTypeMappingId { get; set; }
		public int VehicleTypeId { get; set; }
		public int VehicleModelId { get; set; }
		public string Description { get; set; } = "";
		public string VehicleTypeName { get; set; } = "";
		public string VehicleModelName { get; set; } = "";
		public JobTypeMapping()
		{
			JobTypeMappingDetColl = new JobTypeMappingDetCollections();
		}
		public JobTypeMappingDetCollections JobTypeMappingDetColl { get; set; }
	}

	public class JobTypeMappingCollections : System.Collections.Generic.List<JobTypeMapping>
	{
		public JobTypeMappingCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class JobTypeMappingDet
	{

		public int JobTypeMappingId { get; set; }
		public int JobTypeId { get; set; }
		public double? KmUpto { get; set; }
		public double? HourUpto { get; set; }
		public double? DayUpto { get; set; }
	}

	public class JobTypeMappingDetCollections : System.Collections.Generic.List<JobTypeMappingDet>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}



