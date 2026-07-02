using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AppCMS
{
	public class HeroSection : ResponeValues
	{

		public int? TranId { get; set; }
		public string Badge { get; set; } = "";
		public string Title { get; set; } = "";
		public string Photo { get; set; } = "";
		public string Description { get; set; } = "";
		public byte[] PhotoB { get; set; }
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
				return this.Badge;
			}
		}

	}
	public class HeroSectionCollections : System.Collections.Generic.List<HeroSection>
	{
		public HeroSectionCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}