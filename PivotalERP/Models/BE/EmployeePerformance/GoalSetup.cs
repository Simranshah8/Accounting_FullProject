using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

    public class GoalSetup : ResponeValues
    {

        public int? GoalSetupId { get; set; }
        public int? ParentSetupId { get; set; }
        public int? CostClassId { get; set; }
        public int? GoalTypeId { get; set; }
        public string Description { get; set; } = "";
        public bool IsMeasurement { get; set; }
        public double? TargetValue { get; set; }
        public string GoalMeasurement { get; set; } = "";
        public int? WeightedId { get; set; }
        public int? GoalTargetTypeId { get; set; }
        public bool IsActive { get; set; }
        public string GoalType { get; set; } = "";
        public string Weighted { get; set; } = "";
        public string GoalTargetType { get; set; } = "";
        public string CostClass { get; set; } = "";
        public int? id
        {
            get
            {
                return this.GoalSetupId;
            }
        }
        public string text
        {
            get
            {
                return this.Description;
            }
        }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string FromDateBS { get; set; } = "";
        public string ToDateBS { get; set; } = "";
    }

    public class GoalSetupCollections : System.Collections.Generic.List<GoalSetup>
    {
        public GoalSetupCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}

