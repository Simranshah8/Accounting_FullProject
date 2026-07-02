using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Diagnosis : ResponeValues
	{

		public int? DiagnosisId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
		public int? id
		{
			get
			{
				return this.DiagnosisId;
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

	public class DiagnosisCollections : System.Collections.Generic.List<Diagnosis>
	{
		public DiagnosisCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}


