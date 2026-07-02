using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.BE
{
	public class Billlist : ResponeValues
	{
		public int? TranId { get; set; }
		public string PatientId { get; set; } 
		public string IPNo { get; set; } 
		public string Name { get; set; } = "";
		public string BillNo { get; set; }
		public DateTime VoucherDate { get; set; }
		public string BillDate { get; set; } = " ";
		public string Time { get; set; } = "";
		public double Amount { get; set; } 
		public string DOCName { get; set; } = "";
		public double Total { get; set; } 
		public double DiscountAmt { get; set; } 
		public double SubTotal { get; set; } 
		public double Tax { get; set; }
        public double NetAmount { get; set; }
        public string User { get; set; } = "";
		public string TranType { get; set; } = "";
		public Billlist()
		{
			BillDetailColl = new BillDetailCollections();
			BreakItemColl = new BreakItemCollections();
		}
		public BillDetailCollections BillDetailColl { get; set; }
		public BreakItemCollections BreakItemColl { get; set; }
	}

	public class BilllistCollections : System.Collections.Generic.List<Billlist>
	{
		public BilllistCollections()
		{
			ResponseMSG = "";
		
		}
	
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


	public class BillDetail
	{
		public BillDetail()
		{
			BillDetailColl = new BillDetailCollections();
			BreakItemColl = new BreakItemCollections();
		}
		public BillDetailCollections BillDetailColl { get; set; }
		public BreakItemCollections BreakItemColl { get; set; }
		public DateTime VoucherDate { get; set; }
		public string BillNo { get; set; }
		public DateTime BillDate { get; set; }
		public DateTime Time { get; set; }
		public string Doctor { get; set; }
		public string OtherDoctor { get; set; }
		public string TestName { get; set; }
		public string Department { get; set; }
		public double Amount { get; set; }
		public double Qty { get; set; }
		public double DisPer { get; set; }
		public double DisAmt { get; set; }
		public double GrandTotal { get; set; }
		public int TranId { get; set; }
	}
	public class BillDetailCollections : System.Collections.Generic.List<BillDetail>
	{
		public BillDetailCollections()
		{
			ResponseMSG = "";
			
			BreakItemColl = new BreakItemCollections();

		}
		
		public BreakItemCollections BreakItemColl { get; set; }
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
	public class BreakItem
	{	
		public string Name { get; set; }
		public string Description { get; set; }
		public double Amount { get; set; }
		public double DiscountAmt { get; set; }
		public double Total { get; set; }
		public double RatePer { get; set; }
		public double Rate { get; set; }
		public int TranId { get; set; }
	}

	public class BreakItemCollections : System.Collections.Generic.List<BreakItem>
	{
		public BreakItemCollections()
		{
			ResponseMSG = "";

		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}
}