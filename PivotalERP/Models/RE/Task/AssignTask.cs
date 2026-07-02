using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dynamic.RE.Task
{
    public class AssignTask 
    {
        public int? TranId { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public string UrlName { get; set; }
        public string TaskType { get; set; }
        public string Heading { get; set; }
        public string PriorityAs { get; set; }
        public string Description { get; set; }
        public string Attchfile { get; set; }
        public string AssignTo { get; set; }
        public DateTime? LogDateTime { get; set; }
        public string LogMiti { get; set; }
        public string UserName { get; set; }
        public string StatusRemarks { get; set; }
        public string LastComment { get; set; }
        public string TaskStatus { get; set; }
        public DateTime? OpenDateTime { get; set; }
        public DateTime? CloseDateTime { get; set; }
        public string OpenMiti { get; set; }
        public string ClosedMiti { get; set; }
        public string StatusHDiff { get; set; }
        public string PendingHDiff { get; set; }
        public string ApprovedRemarks { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public string ApprovedMiti { get; set; }
        public string ApprovedBy { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public string StartMitiTime { get; set; }
        public string EndMitiTime { get; set; }
        public string EstimatedTime { get; set; }
        public string TotalTimeTaken { get; set; }
    }

    public class AssignTaskCollections : System.Collections.Generic.List<AssignTask>
    {
        public bool IsSuccess { get; set; }
        public string ResponseMSG { get; set; }
    }
}