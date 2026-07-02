using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement.Report
{
    public class RequestStatusDB
    {
        DataAccessLayer1 dal = null;
        public RequestStatusDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.RequestStatusCollections GetAllRequestStatus(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo,string ReqStatus)
        {
            RE.AssetManagement.Report.RequestStatusCollections dataColl = new RE.AssetManagement.Report.RequestStatusCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@ReqStatus", ReqStatus);
            cmd.CommandText = "usp_GetAssetRequestStatus";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.RequestStatus beData = new RE.AssetManagement.Report.RequestStatus();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VoucherDateAD = Convert.ToDateTime(reader[1]);
                    if (!(reader[2] is DBNull)) beData.VoucherMitti = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.RequestBy = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.ParticularId = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.Particular = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.category = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Purpose = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.RequestQty = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.IssueQty = reader.GetInt32(10);
                    if (!(reader[11] is DBNull)) beData.IssueNo = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.AssetReqNo = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.ReqStatus = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.RequestByName = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.DepartmentName = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.AssetAlias = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.AssetsCode = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.SerialNum = reader.GetString(18);
                    if (!(reader[19] is DBNull)) beData.PendingQty = reader.GetInt32(19);
                    if (!(reader[20] is DBNull)) beData.EmployeeCode = reader.GetString(20);


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