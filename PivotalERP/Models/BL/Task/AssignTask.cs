using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Task
{

	public class AssignTask
	{

		DA.Task.AssignTaskDB db = null;

		int _UserId = 0;

		public AssignTask(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Task.AssignTaskDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Task.AssignTask beData)
		{
			bool isModify = beData.TranId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
        public BE.Task.TicketCommentCollections getAllAttachment(int TranId)
        {
            return db.getAllAttachment(_UserId, TranId);
        }
        public ResponeValues SaveApproved(BE.Task.TicketApproved beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TicketId == 0)
			{
				resVal.ResponseMSG = "Please ! Select Valid Task ";
			}

			else if (string.IsNullOrEmpty(beData.ApprovedRemarks))
			{
				resVal.ResponseMSG = "Please ! Enter Remarks";
			}

			else
			{
				resVal = db.SaveTicketApproved(beData);
			}

			return resVal;
		}
		public ResponeValues SaveStatus(BE.Task.TicketStatus beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TicketId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Ticket status";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}

			else if (beData.StatusId == 0)
			{
				resVal.ResponseMSG = "Please ! Select Status ";
			}
			else if (string.IsNullOrEmpty(beData.StatusRemarks))
			{
				resVal.ResponseMSG = "Please ! Enter Remarks";
			}

			else
			{
				resVal = db.SaveTicketStatus(beData);
			}

			return resVal;

		}
		public BE.Task.TicketCommentCollections GetCommentsById(int TicketId)
		{
			return db.getTicketCommentsById(_UserId, TicketId);
		}

		public BE.Task.TicketHisCollections GettHisById(int TicketId)
		{
			return db.getTicketHisById(_UserId, TicketId);
		}
		public ResponeValues SaveCloseFeedback(BE.Task.TicketApproved beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TicketId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Ticket Close Feedback";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}
			else
			{
				resVal = db.SaveTicketApproved(beData);
			}

			return resVal;

		}
		public ResponeValues SaveComment(BE.Task.TicketComment beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TicketId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Ticket Comment";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}

			else if (string.IsNullOrEmpty(beData.Comment))
			{
				resVal.ResponseMSG = "Please ! Enter Comment";
			}

			else
			{
				resVal = db.SaveTicketComment(beData);
			}

			return resVal;

		}



		public ResponeValues SaveAssign(BE.Task.TicketAssign beData)
		{
			ResponeValues resVal = new ResponeValues();

			if (beData == null)
			{
				resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
			}
			else if (beData.TicketId == 0)
			{
				resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " Ticket Assign";
			}
			else if (beData.CUserId == 0)
			{
				resVal.ResponseMSG = "Invalid User for CRUD";
			}
			else if (beData.AssignToId == 0)
			{
				resVal.ResponseMSG = "Please ! Select AssignTo ";
			}
			else if (string.IsNullOrEmpty(beData.Remarks))
			{
				resVal.ResponseMSG = "Please ! Enter Remarks";
			}

			else
			{
				resVal = db.SaveTicketAssign(beData);
			}

			return resVal;

		}

		public RE.Task.AssignTaskCollections getAllTask(ref int TotalRows, bool FilterDate = false, DateTime? DateFrom = null, DateTime? DateTo = null, int? StatusId = null, int? CustomerId = null, int? AssignToId = null, int? RequirementTypeId = null, int? PriorityId = null, string CompanyCode = "", string UrlName = "", int? ApprovedId = null, int? ProductNameId = null, int PageNumber = 1, int RowsOfPage = 100, int FilterDateAs = 0)
		{
			return db.getAllTask(ref TotalRows, _UserId, FilterDate, DateFrom, DateTo, StatusId, CustomerId, AssignToId, RequirementTypeId, PriorityId, CompanyCode, UrlName, ApprovedId, ProductNameId, PageNumber, RowsOfPage, FilterDateAs);
		}

		public RE.Task.MonthlyTaskSummaryCollections getMonthlyTask(int YearId, int MonthId)
		{
			return db.getMonthlyTask(_UserId, YearId, MonthId);
		}
		public Dynamic.BE.Task.DayTaskCollections getDayTask(int EmployeeId, int ForUserId, int YearId, int MonthId, int DayId)
		{
			return db.getDayTask(_UserId, EmployeeId, ForUserId, YearId, MonthId, DayId);
		}
		public ResponeValues IsValidData(ref BE.Task.AssignTask beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.TranId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.TranId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}

				else if (beData.TaskTypeId == 0)
				{
					resVal.ResponseMSG = "Please ! Select TaskType ";
				}
				else if (string.IsNullOrEmpty(beData.Heading))
				{
					resVal.ResponseMSG = "Please ! Enter Heading";
				}
				else if (string.IsNullOrEmpty(beData.Description))
				{
					resVal.ResponseMSG = "Please ! Enter Task Details";
				}
				else
				{
					if (beData.ProductNameId == 0)
						beData.ProductNameId = null;

					if (beData.CustomerId == 0)
						beData.CustomerId = null;

					if (beData.TaskTypeId == 9)
					{
						beData.AssignTo = 0;
						beData.Priority = null;
					}
					else if (beData.AssignTo == 0)
					{
						resVal.ResponseMSG = "Please ! Select AssignTo ";
						return resVal;
					}

					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}
	}

}

