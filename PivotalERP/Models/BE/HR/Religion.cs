using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE.Master
{
    public class Religion : ResponeValues
    {
        public int? ReligionId { get; set; }
        public string Name { get; set; } = "";
        public int? OrderNo { get; set; }
        public int? id
        {
            get
            {
                return this.ReligionId;
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
    public class ReligionCollections : List<Religion>
    {

        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }

}

