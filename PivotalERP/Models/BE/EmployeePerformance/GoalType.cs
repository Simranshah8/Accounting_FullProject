using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class GoalType : ResponeValues
	{

		public int? GoalTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Description { get; set; } = "";
		public bool IsActive { get; set; }
        public int? id
        {
            get
            {
                return this.GoalTypeId;
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
	public class GoalTypeCollections : List<GoalType>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}
}

