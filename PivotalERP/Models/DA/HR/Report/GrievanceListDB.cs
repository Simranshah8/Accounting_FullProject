using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR.Report
{
    public class GrievanceListDB
    {
        DataAccessLayer1 dal = null;
        public GrievanceListDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.HR.Report.GrievanceListCollections GetGrievanceList(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo , int? DepartmentId, int? ForUserId, int? GrievanceTypeId, int? StatusId)
        {
            RE.HR.Report.GrievanceListCollections dataColl = new RE.HR.Report.GrievanceListCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@DepartmentId", DepartmentId);
            cmd.Parameters.AddWithValue("@ForUserId", ForUserId);
            cmd.Parameters.AddWithValue("@GrievanceTypeId", GrievanceTypeId);
            cmd.Parameters.AddWithValue("@StatusId", StatusId);
            cmd.CommandText = "usp_GetAllGrievanceDetails";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.HR.Report.GrievanceList beData = new RE.HR.Report.GrievanceList();
                    if (!(reader[0] is DBNull)) beData.SubmittedMiti = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.GrievanceType = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.EmpCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.EmpName = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Designation = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Department = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ContactNo = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Email = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.EnrollNo = reader.GetInt64(8);
                    if (!(reader[9] is DBNull)) beData.Branch = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Description = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Doc = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.Status = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.ActionTaken = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.ActionTakenBy = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.AssignedTo = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.ActionTakenAt = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.Notes = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.Remarks = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.ClosureDate = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.TranId = reader.GetInt32(20);
                    if (!(reader[21] is DBNull)) beData.CompanyName = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.StatusId = reader.GetInt32(22);
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