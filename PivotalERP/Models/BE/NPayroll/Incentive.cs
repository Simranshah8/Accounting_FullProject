using Dynamic.BusinessEntity.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.NPayroll
{
    public class Incentive : ResponeValues
    {
        public Incentive()
        {
            EmployeeDetailsColl = new List<EmployeeDetails>();
        }
        public int? IncentiveId { get; set; }
        public DateTime IncDate { get; set; }
        public int? BrandId { get; set; }
        public int? IncentiveTypeId { get; set; }
        public string Remarks { get; set; }
        public string IncentiveType { get; set; }
        public string Brand { get; set; }
        public double Amount { get; set; }
        public bool IsActive  { get; set; }
        public List<EmployeeDetails> EmployeeDetailsColl { get; set; }
    }
    public class IncentiveCollections : System.Collections.Generic.List<Incentive>
    {
        public IncentiveCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
    public class EmployeeDetails
    {
        public int? IncentiveId { get; set; }
        public int? EmployeeId { get; set; }
        public double? Amount { get; set; }
    }
}