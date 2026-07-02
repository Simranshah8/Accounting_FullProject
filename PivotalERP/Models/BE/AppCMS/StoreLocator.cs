using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.AppCMS
{
    public class StoreLocator:ResponeValues
    {
		public int? StoreId { get; set; }
		public string StoreName { get; set; } = "";
		public string CountryName { get; set; } = "";
		public string CityName { get; set; } = "";
		public string Location { get; set; } = "";
		public string Address { get; set; } = "";
		public string PhoneNo { get; set; } = "";
		public string Photo { get; set; } = "";
		public DateTime? OpeningTime { get; set; }
		public DateTime? ClosingTime { get; set; }
		public byte[] PhotoB { get; set; }
		public int? id
		{
			get
			{
				return this.StoreId;
			}
		}
		public string text
		{
			get
			{
				return this.StoreName;
			}
		}

	}
	public class StoreLocatorCollections : System.Collections.Generic.List<StoreLocator>
	{
		public StoreLocatorCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}