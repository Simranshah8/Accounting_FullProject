
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;
namespace Dynamic.DA.AssetManagement.Report
{
    public class AssetWiseReportDB
    {
        DataAccessLayer1 dal = null;
        public AssetWiseReportDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.AssetWiseReportCollections GetAllAssetWiseReport(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo, int? TranId, int? BranchId)
        {
            RE.AssetManagement.Report.AssetWiseReportCollections dataColl = new RE.AssetManagement.Report.AssetWiseReportCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);

            cmd.CommandText = "usp_GetAllAssetWiseReport";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.AssetWiseReport beData = new RE.AssetManagement.Report.AssetWiseReport();
                    if (!(reader[0] is DBNull)) beData.VoucherDateAD = Convert.ToDateTime(reader[0]);
                    if (!(reader[1] is DBNull)) beData.VoucherDateBS = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.VoucherNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.VoucherName = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.Name = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Branch = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.InQty = Convert.ToDouble(reader[6]); 
                    if (!(reader[7] is DBNull)) beData.OutQty = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.OpeningQty = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.BalanceQty = Convert.ToDouble(reader[9]);
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