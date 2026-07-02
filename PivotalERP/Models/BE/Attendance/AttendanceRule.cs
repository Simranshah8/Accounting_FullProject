using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Attendance
{

	public class AttendanceRule : ResponeValues 
	{ 

		public int? TranId { get; set; } 
		public int? PermittedLateArrival { get; set; } 
		public int? PermittedEarlyDeparture { get; set; } 
		public int? HalfDayLessThanHr { get; set; } 
		public int? AbsentiLessThanHr { get; set; } 
		public int? LateArrival { get; set; } 
		public int? LateArrivalCut { get; set; } 
		public int? EarlyDeparture { get; set; } 
		public int? EarlyDepartureCut { get; set; } 
		public bool LateIncoming { get; set; } 
		public int? NoOfLateInAMonth { get; set; } 
		public int? CutDays { get; set; } 
		public int? IgnoreOTDLessthan { get; set; } 
		}
	public class AttendanceRuleCollections : System.Collections.Generic.List<AttendanceRule>
	{
		public AttendanceRuleCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

