using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PivotalERP.BE
{
    public class JobCardDetail : ResponeValues
    {
        public int? TranId { get; set; }
        public string PartyName { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public string RegdNo { get; set; }
        public double RunningKM { get; set; }
        public string Remarks { get; set; }
        public int JobNo { get; set; }
        public DateTime NextServiceDate { get; set; }
        public int VinNo { get; set; }
    }
    public class JobCardDetailCollections : System.Collections.Generic.List<JobCardDetail>
    {
        public JobCardDetailCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class JobCardRemarks : ResponeValues
    {
        public int? TranId { get; set; }
        public string UserName { get; set; }
        public string Remarks { get; set; }
        public DateTime LogDateTime { get; set; }
        public string LogMiti { get; set; }


    }
    public class JobCardRemarksCollections : System.Collections.Generic.List<JobCardRemarks>
    {
        public JobCardRemarksCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}