using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class HMSVoucher : ResponeValues
	{
		public int? VoucherId { get; set; }
		public string VoucherName { get; set; } = "";
		public int? VoucherType { get; set; }
		public int? NumberingMethod { get; set; }
		public int? StartNumber { get; set; }
		public int? NumericalPartWidth { get; set; }
		public bool PrefilZero { get; set; }
		public bool UseCommonNarration { get; set; }
		public bool PrintVoucherAfterSaving { get; set; }
		public bool PrintVoucherAfterModify { get; set; }
		public bool AllowAutoPrintOnDefaultPrinter { get; set; }
		public int? NoOfCopies { get; set; }
		public bool AllowDiscount { get; set; }
		public bool AllowDiscountEachRow { get; set; }
		public bool CanEntryDateChange { get; set; }
		public double? TaxRate { get; set; }
		public bool SendSMSAfterSave { get; set; }
		public bool Doctorcompulsory { get; set; }
		public int? NoOfTemplates { get; set; }
		public string Prefix { get; set; } = "";
		public string Suffix { get; set; } = "";
		public bool AllowSchame { get; set; }
		public bool AllowSchameEachRow { get; set; }
		public bool ValidateTender { get; set; }
		public int? CashLedgerId { get; set; }
		public int? CreditLedgerId { get; set; }
		public int? GHTLedgerId { get; set; }
		public int? VoucherTypeId { get; set; }
		public int? CostClassId { get; set; }
		public bool AllowDoctorSelectionEachRow { get; set; }
		public bool IsCashBilling { get; set; }
		public int? DonorLedgerId { get; set; }
		public bool CommissionOtherDoctor { get; set; }
		public bool AllowMemoBilling { get; set; }

		public string NumberingMethodValue { get; set; } = "";

		public int? id
		{
			get
			{
				return this.VoucherId;
			}
		}
		public string text
		{
			get
			{
				return this.VoucherName;
			}
		}
	}

	public class HMSVoucherCollections : System.Collections.Generic.List<HMSVoucher>
	{
		public HMSVoucherCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}


}
