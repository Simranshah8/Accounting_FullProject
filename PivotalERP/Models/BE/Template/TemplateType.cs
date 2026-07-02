using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BE
{
    public class TemplateType : ResponeValues
    {

        public int? TemplateTypeId { get; set; }
        public string Name { get; set; } = "";
        public int OrderNo { get; set; }

        public int? id
        {
            get
            {
                return this.TemplateTypeId;
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
    public class TemplateTypeCollections : List<TemplateType>
    {
        public TemplateTypeCollections()
        {
            ResponseMSG = "";
        }
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}

