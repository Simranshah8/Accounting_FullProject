using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class GoalPeriod : ResponeValues
	{

		public int? GoalPeriodId { get; set; }
		public string Name { get; set; } = "";
		public DateTime? FromDate { get; set; }
		public DateTime? ToDate { get; set; }
		public string Days { get; set; } = "";
		public bool IsActive { get; set; }
		public string FromDateBS { get; set; } = "";
		public string ToDateBS { get; set; } = "";
        public int? id
        {
            get
            {
                return this.GoalPeriodId;
            }
        }
        public string text
        {
            get
            {
                return this.Name;
            }
        }
    }

	public class GoalPeriodCollections : System.Collections.Generic.List<GoalPeriod>
	{
		public GoalPeriodCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

