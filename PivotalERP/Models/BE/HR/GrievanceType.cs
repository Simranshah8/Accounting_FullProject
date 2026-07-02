using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.HR
{

	public class GrievanceType : ResponeValues
	{

		public int? TranId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
		public string Description { get; set; } = "";
		public int? OrderNo { get; set; }
		public bool IsActive { get; set; }
		public int? id
		{
			get
			{
				return this.TranId;
			}
		}
		public string text
		{
			get
			{
				return this.Name;
			}
		}
		public GrievanceType()
		{
			VoucherUDFCol = new List<Dynamic.BusinessEntity.Account.VoucherUDF>();
		}
		public List<Dynamic.BusinessEntity.Account.VoucherUDF> VoucherUDFCol { get; set; }
	}

	public class GrievanceTypeCollections : System.Collections.Generic.List<GrievanceType>
	{
		public GrievanceTypeCollections()
		{
			VoucherUDFCol = new List<Dynamic.BusinessEntity.Account.VoucherUDF>();
		}
		public List<Dynamic.BusinessEntity.Account.VoucherUDF> VoucherUDFCol { get; set; }
		public bool IsSuccess { get; set; }
		public string ResponseMSG { get; set; } = "";
	}

}

