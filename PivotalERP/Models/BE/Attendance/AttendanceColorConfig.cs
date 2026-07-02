using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Attendance
{
	public class AttendanceColorConfig : ResponeValues 
	{
		public int? TranId { get; set; }
		public string Present { get; set; } = "";
		public string PColor { get; set; } = "";
		public string PCellColor { get; set; } = "";
		public int PresentB { get; set; }
		public string Absent { get; set; } = "";
		public string AColor { get; set; } = "";
		public string ACellColor { get; set; } = "";
		public int AbsentB { get; set; }
		public string Leave { get; set; } = "";
		public string LColor { get; set; } = "";
		public string LCellColor { get; set; } = "";
		public int LeaveB { get; set; }
		public string Weekend { get; set; } = "";
		public string WColor { get; set; } = "";
		public string WCellColor { get; set; } = "";
		public int WeekendB { get; set; }
		public string Holiday { get; set; } = "";
		public string HColor { get; set; } = "";
		public string HCellColor { get; set; } = "";
		public int HolidayB { get; set; }
	}
	public class AttendanceColorConfigCollections : System.Collections.Generic.List<AttendanceColorConfig>
	{
		public AttendanceColorConfigCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

