using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.NPayroll
{

	public class UnitsOfWork : ResponeValues
	{

		public int? UnitsOfWorkId { get; set; }
		public string Name { get; set; } = "";
		public string Alias { get; set; } = "";
		public string Description { get; set; } = "";
	}
    public class UnitsOfWorkCollections : System.Collections.Generic.List<UnitsOfWork>
    {
        public UnitsOfWorkCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}

