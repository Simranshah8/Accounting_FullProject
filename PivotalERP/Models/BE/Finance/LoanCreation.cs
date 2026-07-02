using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.BusinessEntity.Finance
{
    public class LoanCreation : ResponeValues
    {
        public LoanCreation()
        {
            RefBy = "";
            Notes = "";
            LedgerName = "";
            CanModify = true;
        }

        public DateTime EntryDate { get; set; }
        public int TranId { get; set; }
        public int AutoNumber { get; set; }
        public int LedgerId { get; set; }
        public string LedgerName { get; set; }        
        public double LoanAmount { get; set; }
        public LoanTypes LoanType { get; set; }
        public int Period { get; set; }
        public PeriodTypes PeriodType { get; set; }
        public double InterestRate { get; set; }

        public int NY { get; set; }
        public int NM { get; set; }
        public int ND { get; set; }

        public int CreateBy { get; set; }
        public int ModifyBy { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime CreationDate { get; set; }

        public string RefBy { get; set; }
        public string Notes { get; set; }
        public int? FinanaceJournalTranId { get; set; }

        private UserDefineFieldCollections _UserDefineFieldsColl = new UserDefineFieldCollections();
        public UserDefineFieldCollections UserDefineFieldsColl
        {
            get
            {
                if (_UserDefineFieldsColl == null)
                    return new UserDefineFieldCollections();
                else
                    return _UserDefineFieldsColl;
            }
            set
            {
                _UserDefineFieldsColl = value;
            }
        }

        private RebatePenaltyDetailsCollections _RebateColl = new RebatePenaltyDetailsCollections();
        public RebatePenaltyDetailsCollections RebateColl
        {
            get
            {
                return _RebateColl;
            }
            set
            {
                _RebateColl = value;
            }
        }

        private RebatePenaltyDetailsCollections _PenaltyColl = new RebatePenaltyDetailsCollections();
        public RebatePenaltyDetailsCollections PenaltyColl
        {
            get
            {
                return _PenaltyColl;
            }
            set
            {
                _PenaltyColl = value;
            }
        }

        private EMIDetailsCollections _EMIColl = new EMIDetailsCollections();
        public EMIDetailsCollections EMIColl
        {
            get
            {
                return _EMIColl;
            }
            set
            {
                _EMIColl = value;
            }
        }

        private Dynamic.BusinessEntity.GeneralDocumentCollections _DocumentColl = new GeneralDocumentCollections();
        public GeneralDocumentCollections DocumentColl
        {
            get
            {
                return _DocumentColl;
            }
            set
            {
                _DocumentColl = value;
            }
        }

        public bool CanModify { get; set; }
        public int ReScheduleId { get; set; }
        //Added by Suresh
        public int VehicleId { get; set; }
        public int VoucherId { get; set; }
        public int CostClassId { get; set; }
        public string LoanTypeName { get; set; } = "";
        public string EngineNo { get; set; } = "";
        public string ChechisNo { get; set; } = "";
        public DateTime VoucherDate { get; set; }
    }
    public class LoanCreationCollections : System.Collections.Generic.List<LoanCreation> 
    {

        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }

    //public enum LoanTypes
    //{
    //    Diminishing=1,
    //    Flat=2
    //}
    //public enum PeriodTypes
    //{
    //    Daily=1,
    //    Weekly=2,
    //    Monthly=3,
    //    Quaterly=4,
    //    HalyYearly=5,
    //    Yearly=6
    //}

    public class RebatePenaltyDetails
    {
        public int? TranId { get; set; }
        public int FromDays { get; set; }
        public int ToDays { get; set; }
        public double Amount { get; set; }
        public double Rate { get; set; }
        public string Remarks { get; set; }
    }
    public class RebatePenaltyDetailsCollections : System.Collections.Generic.List<RebatePenaltyDetails> { }

    public class EMIDetails
    {
        public int PaymentNo { get; set; }
        public DateTime EMIDate { get; set; }
        public string EMIDateStr { get; set; }
        public int ENY { get; set; }
        public int ENM { get; set; }
        public int END { get; set; }
        public double BegingBalance { get; set; }        
        public double SchedulePayment { get; set; }
        public double TotalPayment { get; set; }
        public double Principal { get; set; }
        public double Interest { get; set; }
        public double EndingBalance { get; set; }
        public bool IsDebit { get; set; }
        public int TranId { get; set; }
     
    }
    public class EMIDetailsCollections : System.Collections.Generic.List<EMIDetails> { }
}
