using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Account
{

	public class Cluster : ResponeValues 
	{ 

		public int? ClusterID { get; set; } 
		public string ClusterName { get; set; } ="" ; 
		public int CircleID { get; set; } 
		public string Description { get; set; } ="" ;
		public string CircleName { get; set; } ="" ; 
		}

	public class ClusterCollections : System.Collections.Generic.List<Cluster>
	{
		public ClusterCollections()
		{
			ResponseMSG = "";
		}
		public string ResponseMSG { get; set; }
		public bool IsSuccess { get; set; }
	}

}

