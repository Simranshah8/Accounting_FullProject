using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace PivotalERP.DA
{

    internal class BilllistDB
    {
        DataAccessLayer1 dal = null;
        public BilllistDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public BE.BilllistCollections getAllBilllist(DateTime DateFrom, DateTime DateTo)
        {
            BE.BilllistCollections dataColl = new BE.BilllistCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
          
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "USP_GetAllBillingForCommission";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Billlist beData = new BE.Billlist();
                    if (!(reader[0] is DBNull)) beData.PatientId = reader.GetString(0);
                    if (!(reader[1] is DBNull)) beData.IPNo = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Name = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.BillNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.BillDate = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.Time = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.DOCName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Amount = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is DBNull)) beData.DiscountAmt = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.SubTotal = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.Tax = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.NetAmount = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.User = reader.GetString(12);
                    if (!(reader[13] is DBNull)) beData.TranId = reader.GetInt32(13);
                    if (!(reader[14] is DBNull)) beData.TranType = reader.GetString(14);

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


        public BE.BillDetailCollections getBillDetailbyId(int UserId, int TranId, string TranType)
        {
            BE.BillDetailCollections dataColl = new BE.BillDetailCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.Parameters.AddWithValue("@TranType", TranType);
            cmd.CommandText = "usp_GetBillingById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.BillDetail beData = new BE.BillDetail();
                    if (!(reader[0] is DBNull)) beData.VoucherDate = reader.GetDateTime(0);
                    if (!(reader[1] is DBNull)) beData.BillNo = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.BillDate = reader.GetDateTime(2);
                    if (!(reader[3] is DBNull)) beData.BillNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.BillDate = reader.GetDateTime(4);
                    if (!(reader[5] is DBNull)) beData.Time = reader.GetDateTime(5);
                    if (!(reader[6] is DBNull)) beData.Doctor = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.OtherDoctor = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.TestName = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Department = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.Amount = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.Qty = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.DisPer = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.DisAmt = Convert.ToDouble(reader[13]);
                    if (!(reader[14] is DBNull)) beData.GrandTotal = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is DBNull)) beData.TranId = reader.GetInt32(15);
                    dataColl.Add(beData);
                }
                reader.NextResult();
                dataColl.BreakItemColl = new PivotalERP.BE.BreakItemCollections();
                while (reader.Read())
                {
                    PivotalERP.BE.BreakItem det = new PivotalERP.BE.BreakItem();
                    if (!(reader[0] is DBNull)) det.Name = reader.GetString(0);
                    if (!(reader[1] is DBNull)) det.Description = reader.GetString(1);
                    if (!(reader[2] is DBNull)) det.DiscountAmt = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is DBNull)) det.Total = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) det.RatePer = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) det.Rate = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) det.TranId = reader.GetInt32(0);

                    dataColl.Find(p1 => p1.TranId == det.TranId).BreakItemColl.Add(det);
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

