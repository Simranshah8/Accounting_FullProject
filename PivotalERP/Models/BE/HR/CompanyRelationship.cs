using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.HR
{

	public class CompanyRelationship : ResponeValues
	{

		public int? TranId { get; set; }
		public string Name { get; set; } = "";
		public string DisplayName { get; set; } = "";
		public string FullAddress { get; set; } = "";
		public string State { get; set; } = "";
		public string Country { get; set; } = "";
		public string ZipCode { get; set; } = "";
		public string RegNo { get; set; } = "";
		public string PanVatNo { get; set; } = "";
		public string Phone { get; set; } = "";
		public string Fax { get; set; } = "";
		public string Email { get; set; } = "";
		public string Website { get; set; } = "";
		public string RelationshipType { get; set; } = "";
		public byte[] LogoB { get; set; }
		public string LogoPath { get; set; } = "";

		public string ApiURL { get; set; } = "";	
		public string UserName { get; set; } = "";	
		public string Password { get; set; } = "";	

    }
	public class CompanyRelationshipCollections : System.Collections.Generic.List<CompanyRelationship>
	{
		public CompanyRelationshipCollections()
		{
			ResponseMSG = "";
		}

		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

