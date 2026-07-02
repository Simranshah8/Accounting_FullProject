using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.Task
{
    public class MonthlyTaskSummary 
    {
        public int YearId { get; set; }
        public int MonthId { get; set; }
        public int EmployeeId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Designation { get; set; }
        public string Department { get; set; }
        public string Code { get; set; }
        public int TotalDays { get; set; }
        public int TotalWeekEnd { get; set; }
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

        public int TotalTask { get; set; }
        public int Open { get; set; }
        public int InProgress { get; set; }
        public int OnHold { get; set; }
        public int Closed { get; set; }
        public int Approved { get; set; }

    }
    public class MonthlyTaskSummaryCollections : System.Collections.Generic.List<MonthlyTaskSummary>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}