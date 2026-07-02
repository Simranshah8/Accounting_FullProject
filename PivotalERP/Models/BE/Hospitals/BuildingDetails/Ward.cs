using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Hospital
{

	public class Ward : ResponeValues 
	{ 

		public int? WardId { get; set; } 
		public string Name { get; set; } ="" ; 
		public string Alias { get; set; } ="" ; 
		public string Description { get; set; } ="" ;
        public int? id
        {
            get
            {
                return this.WardId;
            }
        }

        public string text
        {
            get
            {
                return this.Name;
            }
        }
    }
    public class WardCollections : List<Ward>
    {
        public WardCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }

}

