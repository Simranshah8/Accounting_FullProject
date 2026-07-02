
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement.Report
{
    public class AssetIssueStatusDB
    {
        DataAccessLayer1 dal = null;
        public AssetIssueStatusDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.AssetIssueStatusCollections GetAllAssetIssueStatus(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo,string IssueStatus)
        {
            RE.AssetManagement.Report.AssetIssueStatusCollections dataColl = new RE.AssetManagement.Report.AssetIssueStatusCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@IssueStatus", IssueStatus);
            cmd.CommandText = "usp_GetAssetIssueStatus";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.AssetIssueStatus beData = new RE.AssetManagement.Report.AssetIssueStatus();
                    if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VoucherDateAD = Convert.ToDateTime(reader[1]);
                    if (!(reader[2] is DBNull)) beData.VoucherMitti = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.RequestBy = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.BranchName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.IssueNo = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ReturnNo = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ParticularId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) beData.ParticularName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.category = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Purpose = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.IssueQty = reader.GetInt32(11);
                    if (!(reader[12] is DBNull)) beData.ReturnQty = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.IssueStatus = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.UserName = reader.GetString(14);
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