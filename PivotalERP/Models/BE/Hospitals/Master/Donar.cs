using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Donar : ResponeValues
	{

		public int? DonarId { get; set; }
		public int? AutoNumber { get; set; }
		public string Name { get; set; } = "";
		public string Address { get; set; } = "";
		public string Notes { get; set; } = "";
		public string PhoneNo { get; set; } = "";
		public string MobileNo { get; set; } = "";
		public string FaxNo { get; set; } = "";
		public string EmailId { get; set; } = "";
		public string Pan { get; set; } = "";
		public double DiscountPer { get; set; }
		public bool IsCredit { get; set; }
		public int? LedgerId { get; set; }
		public bool CanChangeCashCredit { get; set; }
		public bool CanChangeDisPer { get; set; }
		public int? id
		{
			get
			{
				return this.DonarId;
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
	public class DonarCollections : System.Collections.Generic.List<Donar>
	{
		public DonarCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

