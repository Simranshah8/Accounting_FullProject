using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Lab
{

	public class LabPackage : ResponeValues
	{

		public int PackageId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public int? OrganizationId { get; set; }
		public int? CategoryId { get; set; }
		public int? PricingId { get; set; }
		public double? Discount { get; set; }
		public int? FdAmount { get; set; }
		public bool IsProfileTest { get; set; }
		public LabPackage()
		{
			LabPackageItemsColl = new LabPackageItemsCollections();
		}
		public LabPackageItemsCollections LabPackageItemsColl { get; set; }
	}
	public class LabPackageCollections : System.Collections.Generic.List<LabPackage>
	{
		public LabPackageCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class LabPackageItems
	{

		public int? PackageId { get; set; }
		public int TestProfileId { get; set; }
		public string TestName { get; set; } = "";
		public string Code { get; set; } = "";
		public int Qty { get; set; }
		public int UnitPrice { get; set; }
		public int LineTotal { get; set; }
		public double? Discount { get; set; }
	}

	public class LabPackageItemsCollections : System.Collections.Generic.List<LabPackageItems>
	{

		public string ResponseMSG { get; set; } = "";

		public bool IsSuccess { get; set; }

	}

}


