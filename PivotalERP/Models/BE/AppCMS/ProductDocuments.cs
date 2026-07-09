
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
using Dynamic.BusinessEntity.Common;


namespace Dynamic.BE.AppCMS
{

	public class ProductDocuments : ResponeValues
	{
		public int? ProductId { get; set; }
		public string EcommerceDescription { get; set; } = "";
		public string IngredientsDescription { get; set; } = "";
		public string UsageDescription { get; set; } = "";
		public string ProductName { get; set; } = "";
		public string CategoryName { get; set; } = "";

		public ProductDocuments()
		{
			DocumentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
		}
		public Dynamic.BusinessEntity.GeneralDocumentCollections DocumentColl { get; set; }

	}
	public class ProductDocumentsCollections : System.Collections.Generic.List<ProductDocuments>
	{
		public ProductDocumentsCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	
}

