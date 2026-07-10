using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AppCMS
{
	public class Herbs : ResponeValues
	{
		public int? HerbsId { get; set; }
		public string Name { get; set; } = "";
		public string ScientificName { get; set; } = "";
		public string Badge { get; set; } = "";
		public string HsubTitle { get; set; } = "";
		public string SEOTitle { get; set; } = "";
		public string SEODescription { get; set; } = "";
		public string Description { get; set; } = "";
		public string AboutPara { get; set; } = "";
		public string Banner { get; set; } = "";
		public string Photo { get; set; } = "";
		public string Tag { get; set; } = "";
		public byte[] PhotoB { get; set; }
		public byte[] BannerB { get; set; }

		public int? id
		{
			get
			{
				return this.HerbsId;
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
	public class HerbsCollections : System.Collections.Generic.List<Herbs>
	{
		public HerbsCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

	public class HerbsDetails : ResponeValue
	{
		public int? HerbsId { get; set; }
		public string Name { get; set; } = "";
		public string ScientificName { get; set; } = "";
		public string Badge { get; set; } = "";
		public string HsubTitle { get; set; } = "";
		public string SEOTitle { get; set; } = "";
		public string SEODescription { get; set; } = "";
		public string Description { get; set; } = "";
		public string AboutPara { get; set; } = "";
		public string Banner { get; set; } = "";
		public string Photo { get; set; } = "";
		public string Tag { get; set; } = "";
        public HerbsDetails()
        {
			ProductDetails = new List<ProductDet>();
			WelnessGoalsDetails = new List<WelnessGoalsDet>();
		}
        public List<ProductDet> ProductDetails { get; set; }
        public List<WelnessGoalsDet> WelnessGoalsDetails { get; set; }
    }
	public class ProductDet
    {
        public int? ProductId { get; set; }
		public string ProductName { get; set; } = "";
        public string Alias { get; set; } = "";
        public string PhotoPath { get; set; } = "";
        public string ProductCategories { get; set; } = "";
        public double SalesRate { get; set; }
	}
	public class WelnessGoalsDet
	{
        public int? WelnessId { get; set; }
		public string WelnessGoals { get; set; } = "";
        public string Description { get; set; } = "";
        public string WG_Image { get; set; } = "";
        public string WG_Banner { get; set; } = "";
	}
}