using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class GoalTargetType : ResponeValues
	{

		public int? GoalTargetTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Description { get; set; } = "";
		public bool IsActive { get; set; }
        public int? id
        {
            get
            {
                return this.GoalTargetTypeId;
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

	public class GoalTargetTypeCollections : System.Collections.Generic.List<GoalTargetType>
	{
		public GoalTargetTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

