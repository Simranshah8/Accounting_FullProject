using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE
{
    public class AssignedGoal : ResponeValues
    {
        public int? TranId { get; set; }
        public int? ForId { get; set; }
        public int? GoalReleaseId { get; set; }
        public int? EmployeeId { get; set; }
        public int? UserId { get; set; }
        public string EmployeeName { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
        public string Department { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string CompanyRelationship { get; set; } = "";
        public int? GoalSetupReleaseId { get; set; }
        public int? GoalSetupId { get; set; }
        public int? GoalTypeId { get; set; }
        public string GoalType { get; set; } = "";
        public string Description { get; set; } = "";
        public double? TargetValue { get; set; }
        public string GoalMeasurement { get; set; } = "";
        public int? WeightedId { get; set; }
        public int? GoalTargetTypeId { get; set; }
        public string GoalTargetType { get; set; } = "";
        public string FromDateBS { get; set; } = "";
        public string ToDateBS { get; set; } = "";
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? CostClassId { get; set; }
        public double? TargetAchievement { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsMeasurement { get; set; }
        public string AchievedDescription { get; set; } = "";
        public bool? IsSubmit { get; set; }
        public int? TotalTargetAchievement { get; set; }
        public AssignedGoal()
        {
            KPIColl = new KPIAssignedGoalCollections();
            GoalSetupAssignedGoalColl = new GoalSetupAssignedGoalCollections();
        }
        public KPIAssignedGoalCollections KPIColl { get; set; }
        public GoalSetupAssignedGoalCollections GoalSetupAssignedGoalColl { get; set; }
        public int? SupUserId { get; set; }
        public int? FeedBackTypeId { get; set; }
        public double? Rating { get; set; }
        public double? HRRating { get; set; }
        public string SuperVisorName { get; set; } = "";
        public string Remarks { get; set; } = "";
        public string FeedbackType { get; set; } = "";
    }
    public class AssignedGoalCollections : List<AssignedGoal>
    {
        public AssignedGoalCollections()
        {
            ResponseMSG = "";
            KPIColl = new KPIAssignedGoalCollections();
            GoalSetupAssignedGoalColl = new GoalSetupAssignedGoalCollections();
        }
        public KPIAssignedGoalCollections KPIColl { get; set; }
        public GoalSetupAssignedGoalCollections GoalSetupAssignedGoalColl { get; set; }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";

    }
    public class KPIAssignedGoal : ResponeValues
    {
        public int? TranId { get; set; }
        public int? UserId { get; set; }
        public int? GoalReleaseId { get; set; }
        public int? ForId { get; set; }
        public double? TargetAchievement { get; set; }
        public string AchievedDescription { get; set; } = "";
    }
    public class KPIAssignedGoalCollections : List<KPIAssignedGoal>
    {
        public KPIAssignedGoalCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";

    }
    public class GoalSetupAssignedGoal : ResponeValues
    {
        public int? ParentSetupId { get; set; }
        public int? UserId { get; set; }
        public int? GoalSetupId { get; set; }
        public string Description { get; set; } = "";
        public double? TargetValue { get; set; }
    }
    public class GoalSetupAssignedGoalCollections : List<GoalSetupAssignedGoal>
    {
        public GoalSetupAssignedGoalCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; } = "";

    }


    public class RatingPoint : ResponeValues
    {
        public int? TranId { get; set; }
        public int? UserId { get; set; }
        public int? SupervisorId { get; set; }
        public int? HRId { get; set; }
        public int? FeedBackTypeId { get; set; }
        public double? Rating { get; set; }
        public double? HRRating { get; set; }
        public string Remarks { get; set; } = "";
        public bool? IsHR { get; set; }
    }
}
