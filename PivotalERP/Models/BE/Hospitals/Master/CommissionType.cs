using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class CommissionType : ResponeValues
	{

		public int? CommissionTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public int? SNO { get; set; }
		public int? id
		{
			get
			{
				return this.CommissionTypeId;
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
	public class CommissionTypeCollections : System.Collections.Generic.List<CommissionType>
	{
		public CommissionTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

