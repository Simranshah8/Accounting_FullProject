using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.RE.Attendance
{
    public class EmpMonthlyAttendanceLog 
    {
        public int SNo { get; set; }
        public int EmployeeId { get; set; }
        public long EnrollNumber { get; set; }
        public string Name { get; set; }
        public string Branch { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string Category { get; set; }
        public string Company { get; set; }
        public string Day1 { get; set; }
        public string Day2 { get; set; }
        public string Day3 { get; set; }
        public string Day4 { get; set; }
        public string Day5 { get; set; }
        public string Day6 { get; set; }
        public string Day7 { get; set; }
        public string Day8 { get; set; }
        public string Day9 { get; set; }
        public string Day10 { get; set; }
        public string Day11 { get; set; }
        public string Day12 { get; set; }
        public string Day13 { get; set; }
        public string Day14 { get; set; }
        public string Day15 { get; set; }
        public string Day16 { get; set; }
        public string Day17 { get; set; }
        public string Day18 { get; set; }
        public string Day19 { get; set; }
        public string Day20 { get; set; }
        public string Day21 { get; set; }
        public string Day22 { get; set; }
        public string Day23 { get; set; }
        public string Day24 { get; set; }
        public string Day25 { get; set; }
        public string Day26 { get; set; }
        public string Day27 { get; set; }
        public string Day28 { get; set; }
        public string Day29 { get; set; }
        public string Day30 { get; set; }
        public string Day31 { get; set; }
        public string Day32 { get; set; }
        public int TotalDays { get; set; }
        public int TotalWeekend { get; set; }
        public int TotalPresent { get; set; }
        public int TotalLeave { get; set; }
        public int TotalHoliday { get; set; }
        public string EmpCode { get; set; }
        public int WeekendPresent { get; set; }
        public int HolidayPresent { get; set; }
        public int LeavePresent { get; set; }

        public string Day1_Color { get; set; }
        public string Day2_Color { get; set; }
        public string Day3_Color { get; set; }
        public string Day4_Color { get; set; }
        public string Day5_Color { get; set; }
        public string Day6_Color { get; set; }
        public string Day7_Color { get; set; }
        public string Day8_Color { get; set; }
        public string Day9_Color { get; set; }
        public string Day10_Color { get; set; }
        public string Day11_Color { get; set; }
        public string Day12_Color { get; set; }
        public string Day13_Color { get; set; }
        public string Day14_Color { get; set; }
        public string Day15_Color { get; set; }
        public string Day16_Color { get; set; }
        public string Day17_Color { get; set; }
        public string Day18_Color { get; set; }
        public string Day19_Color { get; set; }
        public string Day20_Color { get; set; }
        public string Day21_Color { get; set; }
        public string Day22_Color { get; set; }
        public string Day23_Color { get; set; }
        public string Day24_Color { get; set; }
        public string Day25_Color { get; set; }
        public string Day26_Color { get; set; }
        public string Day27_Color { get; set; }
        public string Day28_Color { get; set; }
        public string Day29_Color { get; set; }
        public string Day30_Color { get; set; }
        public string Day31_Color { get; set; }
        public string Day32_Color { get; set; }

        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

        public double WorkingDuration { get; set; }
        public double OTDuration { get; set; }
        public double SinglePunchDeduction { get; set; }
        public double EarlyInMinutes { get; set; }
        public double LateInMinutes { get; set; }
        public double EarlyOutMinutes { get; set; }
        public double DelayOutMinutes { get; set; }
        public double SinglePunchCount { get; set; }
        public double EarlyInCount { get; set; }
        public double LateInCount { get; set; }
        public double EarlyOutCount { get; set; }
        public double DelayOutCount { get; set; }
        public string BranchName { get; set; }
        public string BranchAddress { get; set; }
        public int TotalAbsent { get; set; }
        public string WorkingShift { get; set; }
        public string GroupName { get; set; }
        public string LevelName { get; set; }
        public string ServiceType { get; set; }
        public int? NY { get; set; }
        public int? NM { get; set; }
        public string MonthName { get; set; }
        public double TotalPayableDays { get; set; }
        public string OTHour { get; set; }
        public double? LeaveOT { get; set; }
    }
    public class EmpMonthlyAttendanceLogCollections : System.Collections.Generic.List<EmpMonthlyAttendanceLog> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
