using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.BE.Service
{

	public class TransactionComment : ResponeValues
	{

		public int? TranId { get; set; }	
		
		public int? VoucherId { get; set; }
		public string Comment { get; set; } = "";
		public string UserName { get; set; } = "";
		public string LogMiti { get; set; } = "";
        public DateTime? LogDateTime { get; set; }
		public string Documentpath { get; set; } = "";
	}
	public class TransactionCommentCollections : System.Collections.Generic.List<TransactionComment>
	{
		public TransactionCommentCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}

