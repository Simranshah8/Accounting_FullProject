using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class AdmissionType : ResponeValues
	{

		public int? AdmissionTypeId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";

		public int? id
		{
			get
			{
				return this.AdmissionTypeId;
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

	public class AdmissionTypeCollections : System.Collections.Generic.List<AdmissionType>
	{
		public AdmissionTypeCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}

