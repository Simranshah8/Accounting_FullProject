using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Account
{

    public class Price : ResponeValues
    {

        public int? PriceId { get; set; }
        public string Name { get; set; } = "";
        public double? Factor { get; set; }
        public int? DefaultBasePriceList { get; set; }
        public int? RoundingMethod { get; set; }
        public bool Active { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string ValidFromMiti { get; set; } = "";
        public string ValidToMiti { get; set; } = "";
        public string ForDebtorTypeIdColl { get; set; } = "";
        public string ForLedgerGroupIdColl { get; set; } = "";
        public string ForAreaIdColl { get; set; } = "";
        public string ForProvinceColl { get; set; } = "";
        public string ForDistrictColl { get; set; } = "";
    }
    public class PriceCollections : List<Price>
    {
        public PriceCollections()
        {
            ResponseMSG = "";

        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

}

