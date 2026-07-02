using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Ethinicity : ResponeValues
	{

		public int? EthinicityId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public int? id
		{
			get
			{
				return this.EthinicityId;
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
	public class EthinicityCollections : System.Collections.Generic.List<Ethinicity>
	{
		public EthinicityCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

