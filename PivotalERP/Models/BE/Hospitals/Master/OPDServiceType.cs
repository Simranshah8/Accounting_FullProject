using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class OPDServiceType : ResponeValues
	{

		public int? OPDServiceTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public int? ForTran { get; set; }
		public int? id
		{
			get
			{
				return this.OPDServiceTypeId;
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
	public class OPDServiceTypeCollections : System.Collections.Generic.List<OPDServiceType>
	{
		public OPDServiceTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

