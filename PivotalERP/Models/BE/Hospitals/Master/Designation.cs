using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Designation : ResponeValues
	{

		public int? DesignationId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
		public int? id
		{
			get
			{
				return this.DesignationId;
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

	public class DesignationCollections : System.Collections.Generic.List<Designation>
	{
		public DesignationCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}
