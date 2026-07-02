using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;
namespace Dynamic.DA.Task
{
	internal class AssignTaskDB
	{
		DataAccessLayer1 dal = null;
		public AssignTaskDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Task.AssignTask beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AssignTo", beData.AssignTo);
			cmd.Parameters.AddWithValue("@TaskTypeId", beData.TaskTypeId);
			cmd.Parameters.AddWithValue("@CustomerId", beData.CustomerId);
			cmd.Parameters.AddWithValue("@Priority", beData.Priority);
			cmd.Parameters.AddWithValue("@Heading", beData.Heading);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@attachFile", beData.attachFile);
			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateAssignTask";
			}
			else
			{
				cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddAssignTask";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;

			cmd.Parameters.AddWithValue("@ProductNameId", beData.ProductNameId);
			cmd.Parameters.AddWithValue("@EstMinutes", beData.EstMinutes);
			cmd.Parameters.AddWithValue("@Deadline", beData.Deadline);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[9].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[9].Value);

				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[10].Value);

				if (!(cmd.Parameters[11].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[11].Value);

				if (!(cmd.Parameters[12].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[12].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

			}
			catch (System.Data.SqlClient.SqlException ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			finally
			{
				dal.CloseConnection();
			}
			return resVal;
		}

        public ResponeValues SaveTicketApproved(BE.Task.TicketApproved beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", beData.TicketId);
            cmd.Parameters.AddWithValue("@ApprovedRemarks", beData.ApprovedRemarks);
            cmd.Parameters.AddWithValue("@ApprovedBy", beData.CUserId);
            cmd.Parameters.AddWithValue("@CompanyCode", beData.CompanyCode);
            cmd.Parameters.AddWithValue("@UrlName", beData.UrlName);
            cmd.CommandText = "usp_AddTaskApproved";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;

            try
            {
                cmd.ExecuteNonQuery();


                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }

        public ResponeValues SaveTicketStatus(BE.Task.TicketStatus beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", beData.TicketId);
            cmd.Parameters.AddWithValue("@StatusId", beData.StatusId);
            cmd.Parameters.AddWithValue("@StatusRemarks", beData.StatusRemarks);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.CommandText = "usp_AddTaskStatus";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@attachFile", beData.attachFile);
            try
            {
                cmd.ExecuteNonQuery();


                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }


        public ResponeValues SaveTicketComment(BE.Task.TicketComment beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", beData.TicketId);
            cmd.Parameters.AddWithValue("@Comment", beData.Comment);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.CommandText = "usp_AddTaskComment";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@attachFile", beData.attachFile);
            try
            {
                cmd.ExecuteNonQuery();


                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[6].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }

        public ResponeValues SaveTicketAssign(BE.Task.TicketAssign beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TranId", beData.TicketId);
            cmd.Parameters.AddWithValue("@AssignToId", beData.AssignToId);
            cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.CommandText = "usp_AddTaskAssign";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[6].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[5].Value);

                if (!(cmd.Parameters[6].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[6].Value);

                if (!(cmd.Parameters[7].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[7].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }

        public Dynamic.BE.Task.TicketCommentCollections getTicketCommentsById(int UserId, int TicketId)
        {
            Dynamic.BE.Task.TicketCommentCollections dataColl = new Dynamic.BE.Task.TicketCommentCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@TranId", TicketId);
            cmd.CommandText = "usp_GetTaskComments";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Task.TicketComment beData = new Dynamic.BE.Task.TicketComment();
                    beData.TicketId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Comment = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.LogDateTime = reader.GetDateTime(3);
                    if (!(reader[4] is DBNull)) beData.LogMiti = reader.GetString(4);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }

        public Dynamic.BE.Task.DayTaskCollections getDayTask(int UserId, int EmployeeId, int ForUserId, int YearId, int MonthId, int DayId)
        {
            Dynamic.BE.Task.DayTaskCollections dataColl = new BE.Task.DayTaskCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EmployeeId", EmployeeId);
            cmd.Parameters.AddWithValue("@ForUserId", ForUserId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.Parameters.AddWithValue("@DayId", DayId);
            cmd.CommandText = "usp_GetEmpTaskDetailsforDay";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Task.DayTask beData = new BE.Task.DayTask();
                    if (!(reader[0] is DBNull)) beData.Heading = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Description = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Remarks = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.LogDateTime = reader.GetDateTime(3);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }


        public Dynamic.BE.Task.TicketHisCollections getTicketHisById(int UserId, int TicketId)
        {
            Dynamic.BE.Task.TicketHisCollections dataColl = new BE.Task.TicketHisCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@TranId", TicketId);
            cmd.CommandText = "usp_GetTaskHisotryById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.Task.TicketHis beData = new Dynamic.BE.Task.TicketHis();
                    if (!(reader[0] is DBNull)) beData.Status = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.Remarks = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.User = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.LogDateTime = reader.GetDateTime(3);
                    if (!(reader[4] is DBNull)) beData.LogMiti = reader.GetString(4);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }
        public BE.Task.TicketCommentCollections getAllAttachment(int UserId, int TranId)
        {
            BE.Task.TicketCommentCollections dataColl = new BE.Task.TicketCommentCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);

            cmd.Parameters.AddWithValue("@TranId", TranId);

            cmd.CommandText = "[usp_GetAllTaskAttachment]";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Task.TicketComment beData = new BE.Task.TicketComment();
                    beData.TicketId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Comment = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.attachFile = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.CUserName = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.LogDateTime = reader.GetDateTime(4);
                    if (!(reader[5] is DBNull)) beData.LogMiti = reader.GetString(5);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;

        }
        public RE.Task.AssignTaskCollections getAllTask(ref int TotalRows, int UserId, bool FilterDate = false, DateTime? DateFrom = null, DateTime? DateTo = null, int? StatusId = null, int? CustomerId = null, int? AssignToId = null, int? RequirementTypeId = null, int? PriorityId = null, string CompanyCode = "", string UrlName = "", int? ApprovedId = null, int? ProductNameId = null, int PageNumber = 1, int RowsOfPage = 100, int FilterDateAs = 0)
        {
            RE.Task.AssignTaskCollections dataColl = new RE.Task.AssignTaskCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@FilterDate", FilterDate);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@StatusId", StatusId);
            cmd.Parameters.AddWithValue("@CustomerId", CustomerId);
            cmd.Parameters.AddWithValue("@AssignToId", AssignToId);
            cmd.Parameters.AddWithValue("@RequirementTypeId", RequirementTypeId);
            cmd.Parameters.AddWithValue("@PriorityId", PriorityId);
            cmd.Parameters.AddWithValue("@CompanyCode", CompanyCode);
            cmd.Parameters.AddWithValue("@UrlName", UrlName);
            cmd.Parameters.AddWithValue("@ApprovedId", ApprovedId);
            cmd.Parameters.AddWithValue("@ProductNameId", ProductNameId);
            cmd.CommandText = "usp_GetAllGenerateTask";
            cmd.Parameters.AddWithValue("@PageNumber", PageNumber);
            cmd.Parameters.AddWithValue("@RowsOfPage", RowsOfPage);
            cmd.Parameters.Add("@TotalRows", System.Data.SqlDbType.Int);
            cmd.Parameters[15].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@FilterDateAs", FilterDateAs);
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.Task.AssignTask beData = new RE.Task.AssignTask();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.CustomerId = reader.GetInt32(1);
                    //if (!(reader[2] is DBNull)) beData.CustomerCode = reader.GetString(2);
                    //if (!(reader[3] is DBNull)) beData.CustomerName = reader.GetString(3);
                    //if (!(reader[4] is DBNull)) beData.UrlName = reader.GetString(4);
                    if (!(reader[2] is DBNull)) beData.TaskType = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Heading = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.PriorityAs = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Description = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.Attchfile = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.AssignTo = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.LogDateTime = reader.GetDateTime(8);
                    if (!(reader[9] is DBNull)) beData.LogMiti = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.UserName = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.StatusRemarks = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.LastComment = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.TaskStatus = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.OpenDateTime = reader.GetDateTime(14);
                    if (!(reader[15] is DBNull)) beData.CloseDateTime = reader.GetDateTime(15);
                    if (!(reader[16] is DBNull)) beData.OpenMiti = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.ClosedMiti = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.StatusHDiff = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.PendingHDiff = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.ApprovedRemarks = reader.GetString(20);
                    if (!(reader[21] is DBNull)) beData.ApprovedAt = reader.GetDateTime(21);
                    if (!(reader[22] is DBNull)) beData.ApprovedMiti = reader.GetString(22);
                    if (!(reader[23] is DBNull)) beData.ApprovedBy = reader.GetString(23);
                    //if (!(reader[27] is DBNull)) beData.ProductId = reader.GetInt32(27);
                    //if (!(reader[24] is DBNull)) beData.ProductName = reader.GetString(24);
                    if (!(reader[24] is DBNull)) beData.StartMitiTime = reader.GetString(24);
                    if (!(reader[25] is DBNull)) beData.EndMitiTime = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.EstimatedTime = reader.GetString(26);
                    if (!(reader[27] is DBNull)) beData.TotalTimeTaken = reader.GetString(27);
                    dataColl.Add(beData);
                }
                reader.Close();

                TotalRows = Convert.ToInt32(cmd.Parameters[15].Value);
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;

        }


        public RE.Task.MonthlyTaskSummaryCollections getMonthlyTask(int UserId, int YearId, int MonthId)
        {
            RE.Task.MonthlyTaskSummaryCollections dataColl = new RE.Task.MonthlyTaskSummaryCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@YearId", YearId);
            cmd.Parameters.AddWithValue("@MonthId", MonthId);
            cmd.CommandText = "usp_GetMonthlyTaskSummary";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.Task.MonthlyTaskSummary beData = new RE.Task.MonthlyTaskSummary();
                    beData.YearId = YearId;
                    beData.MonthId = MonthId;
                    if (!(reader[0] is DBNull)) beData.EmployeeId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.UserId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Designation = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Department = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Code = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.TotalDays = Convert.ToInt32(reader[6]);
                    if (!(reader[7] is DBNull)) beData.TotalWeekEnd = Convert.ToInt32(reader[7]);
                    if (!(reader[8] is DBNull)) beData.Day1 = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Day2 = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Day3 = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Day4 = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.Day5 = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.Day6 = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.Day7 = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.Day8 = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.Day9 = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.Day10 = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.Day11 = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.Day12 = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.Day13 = reader.GetString(20);
                    if (!(reader[21] is DBNull)) beData.Day14 = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.Day15 = reader.GetString(22);
                    if (!(reader[23] is DBNull)) beData.Day16 = reader.GetString(23);
                    if (!(reader[24] is DBNull)) beData.Day17 = reader.GetString(24);
                    if (!(reader[25] is DBNull)) beData.Day18 = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.Day19 = reader.GetString(26);
                    if (!(reader[27] is DBNull)) beData.Day20 = reader.GetString(27);
                    if (!(reader[28] is DBNull)) beData.Day21 = reader.GetString(28);
                    if (!(reader[29] is DBNull)) beData.Day22 = reader.GetString(29);
                    if (!(reader[30] is DBNull)) beData.Day23 = reader.GetString(30);
                    if (!(reader[31] is DBNull)) beData.Day24 = reader.GetString(31);
                    if (!(reader[32] is DBNull)) beData.Day25 = reader.GetString(32);
                    if (!(reader[33] is DBNull)) beData.Day26 = reader.GetString(33);
                    if (!(reader[34] is DBNull)) beData.Day27 = reader.GetString(34);
                    if (!(reader[35] is DBNull)) beData.Day28 = reader.GetString(35);
                    if (!(reader[36] is DBNull)) beData.Day29 = reader.GetString(36);
                    if (!(reader[37] is DBNull)) beData.Day30 = reader.GetString(37);
                    if (!(reader[38] is DBNull)) beData.Day31 = reader.GetString(38);
                    if (!(reader[39] is DBNull)) beData.Day32 = reader.GetString(39);
                    if (!(reader[40] is DBNull)) beData.Open = Convert.ToInt32(reader[40]);
                    if (!(reader[41] is DBNull)) beData.InProgress = Convert.ToInt32(reader[41]);
                    if (!(reader[42] is DBNull)) beData.OnHold = Convert.ToInt32(reader[42]);
                    if (!(reader[43] is DBNull)) beData.Closed = Convert.ToInt32(reader[43]);
                    if (!(reader[44] is DBNull)) beData.Approved = Convert.ToInt32(reader[44]);
                    if (!(reader[45] is DBNull)) beData.TotalTask = Convert.ToInt32(reader[45]);

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return dataColl;

        }
    }
}

