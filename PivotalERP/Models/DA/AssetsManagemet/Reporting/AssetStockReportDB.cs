using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.AssetManagement.Report
{
    public class AssetStockReportDB
    {
        DataAccessLayer1 dal = null;
        public AssetStockReportDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public RE.AssetManagement.Report.AssetStockReportCollections GetAllAssetStockReport(int UserId, int EntityId, DateTime? DateFrom, DateTime? DateTo,int? AssetGroupId, int? BranchId)
        {
            RE.AssetManagement.Report.AssetStockReportCollections dataColl = new RE.AssetManagement.Report.AssetStockReportCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@AssetGroupId", AssetGroupId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);
            cmd.CommandText = "usp_GetAssetStockReport";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    RE.AssetManagement.Report.AssetStockReport beData = new RE.AssetManagement.Report.AssetStockReport();
                    if (!(reader[0] is DBNull)) beData.InwardId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Particular = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.AssetCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.TypeName = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.AssetAlias = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.GroupName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ModelName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.RAMName = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.ROMName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.SerialNum = reader.GetString(9);

                    if (!(reader[10] is DBNull)) beData.OpeningQTY = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.OpeningRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.OpeningAmt = Convert.ToDouble(reader[12]);

                    if (!(reader[13] is DBNull)) beData.InWardQty = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is DBNull)) beData.InwardRate = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is DBNull)) beData.InWardAmt = Convert.ToDouble(reader[15]);

                    if (!(reader[16] is DBNull)) beData.OutWardQty = Convert.ToDouble(reader[16]);
                    if (!(reader[17] is DBNull)) beData.OutWardRate = Convert.ToDouble(reader[17]);
                    if (!(reader[18] is DBNull)) beData.OutWardAmt = Convert.ToDouble(reader[18]);

                    if (!(reader[19] is DBNull)) beData.BalanceQty = Convert.ToDouble(reader[19]);
                    if (!(reader[20] is DBNull)) beData.BalanceRate = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is DBNull)) beData.BalanceAmt = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) beData.BranchName = reader.GetString(22);


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