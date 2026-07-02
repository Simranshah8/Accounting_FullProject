using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{
	public class SpecimenType : ResponeValues
	{
		public int SpecimenTypeId { get; set; }
		public string Name { get; set; } = "";
		public int? CategoryId { get; set; }
		public string ContainerHint { get; set; } = "";
		public string Category { get; set; } = "";
		public string ProcessingInstructions { get; set; } = "";
		public bool IsActive { get; set; }
		public int? id
		{
			get
			{
				return this.SpecimenTypeId;
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
	public class SpecimenTypeCollections : System.Collections.Generic.List<SpecimenType>
	{
		public SpecimenTypeCollections() 
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

