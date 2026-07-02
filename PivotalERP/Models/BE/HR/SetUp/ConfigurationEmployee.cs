using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamic.BE.HR.Setup
{
    public class ConfigurationEmployee : ResponeValues
    {
        public int EmpCodeNumberingMethod { get; set; }
        public string CodePrefix { get; set; } = "";
        public string CodeSuffix { get; set; } = "";

        public int StartNo { get; set; }
        public int NumericalPartWidth { get; set; }
        public bool AllowReGenerateUserPwd { get; set; }
        public int LeftEmployeeConfig { get; set; }
        public int RetirementAge { get; set; }

        public int? BranchId { get; set; }
    }
    public class ConfiguurationEmployeeCollections : List<ConfigurationEmployee> { }
}
