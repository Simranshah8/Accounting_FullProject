using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE
{
    public class GoalReleased
    {
        public int? GoalSetupReleaseId { get; set; }
        public int? CostClassId { get; set; }
        public int? GoalSetupId { get; set; }
        public int? ForId { get; set; }
        public int? UserId { get; set; }
        public bool? Status { get; set; }
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; } = "";
        public string EmployeeCode { get; set; } = "";
        public string Department { get; set; } = "";
        public string BranchName { get; set; } = "";
        public string CompanyRelationship { get; set; } = "";
        public string ContactNo { get; set; } = "";
        public string Address { get; set; } = "";

        public string SupervisorName
        {
            get
            {
                return this.EmployeeName + '(' + this.EmployeeCode +')';
            }
        }
        public GoalReleased()
        {
            GoalSetupColl = new GoalSetupCollections();
        }
        public GoalSetupCollections GoalSetupColl { get; set; }
    }
    public class GoalReleasedCollections : System.Collections.Generic.List<GoalReleased>
    {
        public GoalReleasedCollections()
        {
            ResponseMSG = "";
            GoalSetupColl = new GoalSetupCollections();
            EmployeeList = new List<GoalReleased>();
        }

        public GoalSetupCollections GoalSetupColl { get; set; }
        public List<GoalReleased> EmployeeList { get; set; }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
