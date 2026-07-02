using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Payroll
{

	public class Category : ResponeValues
	{

		public int? CategoryId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrderNo { get; set; }
		public int? LedgerId { get; set; }
        public Category()
        {
			CategoryWisePayHeadLedgerColl = new CategoryWisePayHeadLedgerCollection();

		}
		public CategoryWisePayHeadLedgerCollection CategoryWisePayHeadLedgerColl { get; set; }
	}

	public class CategoryCollections : System.Collections.Generic.List<Category>
	{
		public CategoryCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class CategoryWisePayHeadLedger
    {
        public int? CategoryId { get; set; }
        public int? PayHeadingId { get; set; }
        public int? LedgerId { get; set; }
    }
	public class CategoryWisePayHeadLedgerCollection : List<CategoryWisePayHeadLedger>
    {
		public CategoryWisePayHeadLedgerCollection()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}