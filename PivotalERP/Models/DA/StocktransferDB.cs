using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Inventory
{
    internal class StockTransferDB
    {
        DataAccessLayer1 dal = null;
        public StockTransferDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
      
        public Dynamic.ReportEntity.Inventory.StockTransferCollections getAllStockTransfer(int UserId, int EntityId,DateTime? dateFrom, DateTime? dateTo,int GodownId)
        {
            Dynamic.ReportEntity.Inventory.StockTransferCollections dataColl = new Dynamic.ReportEntity.Inventory.StockTransferCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@dateFrom", dateFrom);
            cmd.Parameters.AddWithValue("@dateTo", dateTo);
            cmd.Parameters.AddWithValue("@GodownId", GodownId);
            cmd.CommandText = "usp_GetStockTransfor";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.Inventory.StockTransfer beData = new Dynamic.ReportEntity.Inventory.StockTransfer();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.CostClassId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.VoucherNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.AutoVoucherNo = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.VoucherName = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.CostClassName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.RefNo = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Narration = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.VoucherDate = reader.GetDateTime(9);
                    if (!(reader[10] is DBNull)) beData.VoucherMiti = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.HaveDocument = reader.GetString(11);
                    if (!(reader[12] is DBNull)) beData.UserName = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.SourceGodown = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.TargetGodown = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.Branch = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.ProductName = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.Unit = reader.GetString(17);
                    if (!(reader[18] is DBNull)) beData.ActualQty = Convert.ToDouble(reader[18]);
                    if (!(reader[19] is DBNull)) beData.BilledQty = Convert.ToDouble(reader[19]);
                    if (!(reader[20] is DBNull)) beData.Rate = Convert.ToDouble(reader[20]);
                    if (!(reader[21] is DBNull)) beData.Amount = Convert.ToDouble(reader[21]);
                    if (!(reader[22] is DBNull)) beData.DiscountPer = Convert.ToDouble(reader[22]);
                    if (!(reader[23] is DBNull)) beData.DiscountAmt = Convert.ToDouble(reader[23]);
                    if (!(reader[24] is DBNull)) beData.RegdNo = reader.GetString(24);
                    if (!(reader[25] is DBNull)) beData.ChassisNo = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.EngineNo = reader.GetString(26);
                    if (!(reader[27] is DBNull)) beData.Model = reader.GetString(27);
                    if (!(reader[28] is DBNull)) beData.Type = reader.GetString(28);
                    if (!(reader[29] is DBNull)) beData.Color = reader.GetString(29);
                    if (!(reader[30] is DBNull)) beData.KeyNo = reader.GetString(30);
                    if (!(reader[31] is DBNull)) beData.CodeNo = reader.GetString(31);
                    if (!(reader[32] is DBNull)) beData.MFGYear = reader.GetString(32);
                    if (!(reader[33] is DBNull)) beData.Batch = reader.GetString(33);
                    if (!(reader[34] is DBNull)) beData.MFGDate = reader.GetDateTime(34);
                    if (!(reader[35] is DBNull)) beData.EXPDate = reader.GetDateTime(35);
                    if (!(reader[36] is DBNull)) beData.Remarks = reader.GetString(36);
                    if (!(reader[37] is DBNull)) beData.LotNo = reader.GetString(37);

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
