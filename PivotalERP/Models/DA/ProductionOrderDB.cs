using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Inventory
{
    internal class ProductionOrderDB
    {
        DataAccessLayer1 dal = null;
        public ProductionOrderDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public Dynamic.ReportEntity.Inventory.ProductionOrderCollections getAllProductionOrder(int UserId, DateTime? DateFrom, DateTime? DateTo, string BranchIdColl)
        {
            Dynamic.ReportEntity.Inventory.ProductionOrderCollections dataColl = new Dynamic.ReportEntity.Inventory.ProductionOrderCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.Parameters.AddWithValue("@BranchIdColl", BranchIdColl);
            cmd.CommandText = "usp_GetProductionOrderDetails";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.ReportEntity.Inventory.ProductionOrder beData = new Dynamic.ReportEntity.Inventory.ProductionOrder();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.VoucherId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.CostClassId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.VoucherNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.VoucherDate = reader.GetDateTime(4);
                    if (!(reader[5] is DBNull)) beData.VoucherMiti = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.ProductName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.ProductAlias = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.ProductCode = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Quantity = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.FQty = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.PQty = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.Unit = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.GodownName = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.GodownCode = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.Narration = reader.GetString(15);
                    if (!(reader[16] is DBNull)) beData.RefNo = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.StartDate = reader.GetDateTime(17);
                    if (!(reader[18] is DBNull)) beData.PostDateTime = reader.GetDateTime(18);
                    if (!(reader[19] is DBNull)) beData.VoucherName = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.BranchName = reader.GetString(20);
                    if (!(reader[21] is DBNull)) beData.BranchCode = reader.GetString(21);
                    if (!(reader[22] is DBNull)) beData.CostClass = reader.GetString(22);
                    if (!(reader[23] is DBNull)) beData.UserName = reader.GetString(23);
                    if (!(reader[24] is DBNull)) beData.Attributes = reader.GetString(24);
                    if (!(reader[25] is DBNull)) beData.UDFKeyVal = reader.GetString(25);
                    if (!(reader[26] is DBNull)) beData.DueDate = reader.GetDateTime(26);
                    if (!(reader[27] is DBNull)) beData.RowType = reader.GetString(27);
                    if (!(reader[28] is DBNull)) beData.ProductName1= reader.GetString(28);
                    if (!(reader[29] is DBNull)) beData.ProductCode1 = reader.GetString(29);
                    if (!(reader[30] is DBNull)) beData.BaseRatio = Convert.ToDouble(reader[30]);                  
                    if (!(reader[31] is DBNull)) beData.PlanQty = Convert.ToDouble(reader[31]);
                    if (!(reader[32] is DBNull)) beData.AvailableQty = Convert.ToDouble(reader[32]);
                    if (!(reader[33] is DBNull)) beData.RequiredQty = Convert.ToDouble(reader[33]);
                    if (!(reader[34] is DBNull)) beData.ActualQty = Convert.ToDouble(reader[34]);
                    if (!(reader[35] is DBNull)) beData.Rate = Convert.ToDouble(reader[35]);
                    if (!(reader[36] is DBNull)) beData.Amount = Convert.ToDouble(reader[36]);
                    if (!(reader[37] is DBNull)) beData.BalQty = Convert.ToDouble(reader[37]);
                    if (!(reader[38] is DBNull)) beData.Unit = reader.GetString(38);
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
