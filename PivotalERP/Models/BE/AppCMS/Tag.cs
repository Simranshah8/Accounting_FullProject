using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.AppCMS
{

	public class TagSection : ResponeValues
	{

		public int? TagId { get; set; }
		public string Badge { get; set; } = "";
		public string Title { get; set; } = "";
		public string Photo { get; set; } = "";
		public int? ProductId { get; set; }
		public byte[] PhotoB { get; set; }
		public string ProductName { get; set; } = "";
		public string ProductAlias { get; set; } = "";
		public string ProductCategory { get; set; } = "";
		public string PhotoPath { get; set; } = "";
		public double? PurchaseRate { get; set; } 
		public double? MRP { get; set; } 
		public double? SalesRate { get; set; }
		public string VideoLink { get; set; } = "";

		public int? id
		{
			get
			{
				return this.TagId;
			}
		}
		public string text
		{
			get
			{
				return this.Badge;
			}
		}
	}
	public class TagSectionCollections : System.Collections.Generic.List<TagSection>
	{
		public TagSectionCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}
