using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class BedMapping : ResponeValues 
	{ 

		public int? TranId { get; set; } 
		public int? BuildingTypeId { get; set; } 
		public int? FloorId { get; set; } 
		public int? WardId { get; set; } 
		public int? RoomId { get; set; }
		public string BuildingType { get; set; } = "";
		public string Floor { get; set; } = "";
		public string Ward { get; set; } = "";
		public string Room { get; set; } = "";
		public int? NoOfBed { get; set; } 
		public int? StartNo { get; set; } 
		public int? EndNo { get; set; } 
		}

	public class BedMappingCollections : List<BedMapping>
	{
		public BedMappingCollections()
		{
			ResponseMSG = "";
		}
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}
}

