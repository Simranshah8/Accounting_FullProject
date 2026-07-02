using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{

	public class LedgerChannel : ResponeValues
	{

		public int? ChannelId { get; set; }
		public string Name { get; set; } = "";
		public string Code { get; set; } = "";
	}
    public class LedgerChannelCollections : System.Collections.Generic.List<LedgerChannel>
    {
        public LedgerChannelCollections() //constructor
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}

