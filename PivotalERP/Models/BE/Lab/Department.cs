using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.BE.Lab
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string Name { get; set; } = "";
        public string Alias { get; set; } = "";
        public string Description { get; set; } = "";
        public bool IsActive { get; set; }
        public int? id
        {
            get
            {
                return this.DepartmentId;
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
    public class DepartmentCollections : System.Collections.Generic.List<Department>
    {
        public DepartmentCollections()
        {
            ResponseMSG = "";
        }
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}