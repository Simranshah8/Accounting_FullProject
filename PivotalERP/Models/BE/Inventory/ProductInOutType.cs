using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BusinessEntity.Inventory
{
    public class ProductInOutType : Account.MasterClass, LogDataForCreate
    {
        public ProductInOutType()
        { 
        }
        public int SNo { get; set; }
        public int InOutTypeId { get; set; }
        public int AutoNumber { get; set; }
        

        public int id
        {
            get
            {
                return InOutTypeId;
            }
        }
         
    }

    public class ProductInOutTypeCollections : System.Collections.Generic.List<ProductInOutType>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
     
}
