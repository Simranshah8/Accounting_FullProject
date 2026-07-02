using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.HR
{

	public class ManualAttendance : ResponeValues
	{

		public int? TranId { get; set; }
		public int? UserId { get; set; }
		public int? DeviceId { get; set; }
		public DateTime? ForDate { get; set; }
		public int? InOutModeId { get; set; }
		public DateTime? InTime { get; set; }
		public DateTime? OutTime { get; set; }
		public string Remarks { get; set; } = "";
		public string ForDateBS { get; set; } = "";
		public double? Lat { get; set; }
		public double? Lng { get; set; }
		public string NerestLocation { get; set; } = "";
		public string PhotoPath { get; set; } = "";
		public byte[] PhotoPathB { get; set; }
		public DateTime? PunchDateTime { get; set; }
		public int? AttendanceType { get; set; }
		public int? ApprovedStatus { get; set; }
		public int? ApprovedBy { get; set; }
		public DateTime? ApprovedDateTime { get; set; }
		public bool IsUserDefine { get; set; }
		public string AttendanceUId { get; set; } = "";
	}
	public class ManualAttendanceCollections : System.Collections.Generic.List<ManualAttendance>
	{
		public ManualAttendanceCollections()
		{
			ResponseMSG = "";
		}
		public int? TranId { get; set; }
		public string PhotoPath { get; set; } = "";
		public byte[] PhotoPathB { get; set; }
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

