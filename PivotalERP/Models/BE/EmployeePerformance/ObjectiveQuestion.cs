using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class ObjectiveQuestion : ResponeValues
	{

		public int? ObjectiveQuestionId { get; set; }
		public string Name { get; set; } = "";
		public string Description { get; set; } = "";
		public bool IsActive { get; set; }
        public int? id
        {
            get
            {
                return this.ObjectiveQuestionId;
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

	public class ObjectiveQuestionCollections : List<ObjectiveQuestion>
	{
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; }
	}

}

