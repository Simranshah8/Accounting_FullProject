using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Attendance
{
	public class AttendanceInOutMode : ResponeValues
	{
		public int? TranId { get; set; }
		public string Name { get; set; } = "";
		public string NameNP { get; set; } = "";
		public int? SNO { get; set; }
		public int? PerDay { get; set; }
		public int? Duration { get; set; }
	}
	public class AttendanceInOutModeCollections : System.Collections.Generic.List<AttendanceInOutMode>
	{
		public AttendanceInOutModeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}