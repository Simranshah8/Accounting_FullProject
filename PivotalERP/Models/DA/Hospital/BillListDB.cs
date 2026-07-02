using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Hospital
{

    internal class BilllistDB
    {
        DataAccessLayer1 dal = null;
        public BilllistDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public BE.Hospital.DoctorAutoCompleteCollections getDoctorList(int UserId)
        {
            BE.Hospital.DoctorAutoCompleteCollections dataColl = new BE.Hospital.DoctorAutoCompleteCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);     
            cmd.CommandText = "usp_GetDoctorList";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Hospital.DoctorAutoComplete beData = new BE.Hospital.DoctorAutoComplete();
                    if (!(reader[0] is DBNull)) beData.DoctorId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.Department = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Designation = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.ContactNo = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.EmailId = reader.GetString(5);                   

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

        public BE.Hospital.BilllistCollections getAllBilllist(int UserId,DateTime DateFrom, DateTime DateTo)
        {
            BE.Hospital.BilllistCollections dataColl = new BE.Hospital.BilllistCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@DateFrom", DateFrom);
            cmd.Parameters.AddWithValue("@DateTo", DateTo);
            cmd.CommandText = "USP_GetAllBillingForCommission";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Hospital.Billlist beData = new BE.Hospital.Billlist();
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


        public BE.Hospital.BillDetailCollections getBillDetailbyId(int UserId, int TranId, string TranType)
        {
            BE.Hospital.BillDetailCollections dataColl = new BE.Hospital.BillDetailCollections();
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
                    BE.Hospital.BillDetail beData = new BE.Hospital.BillDetail();
                    if (!(reader[0] is DBNull)) beData.VoucherDate = reader.GetDateTime(0);
                    if (!(reader[1] is DBNull)) beData.BillNo = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.BillDate = reader.GetDateTime(2);                    
                    if (!(reader[3] is DBNull)) beData.Time = reader.GetDateTime(3);
                    if (!(reader[4] is DBNull)) beData.Doctor = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.OtherDoctor = reader.GetString(5);
                    if (!(reader[6] is DBNull)) beData.TestName = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Department = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Amount = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is DBNull)) beData.Qty = Convert.ToDouble(reader[9]);
                    if (!(reader[10] is DBNull)) beData.DisPer = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.DisAmt = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.GrandTotal = Convert.ToDouble(reader[12]);
                    if (!(reader[13] is DBNull)) beData.TranId = reader.GetInt32(13);
                    if (!(reader[14] is DBNull)) beData.VoucherMiti = reader.GetString(14);
                    if (!(reader[15] is DBNull)) beData.BillingId = reader.GetInt32(15);
                    dataColl.Add(beData);
                }
                reader.NextResult();
                dataColl.BreakItemColl = new BE.Hospital.BreakItemCollections();
                while (reader.Read())
                {
                    BE.Hospital.BreakItem det = new BE.Hospital.BreakItem();
                    if (!(reader[0] is DBNull)) det.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det.BillingId = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det.DoctorId = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) det.Amount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is DBNull)) det.RatePer = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) det.Rate = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) det.Total = Convert.ToDouble(reader[6]);
                    dataColl.Find(p1 => p1.BillingId == det.BillingId).BreakItemColl.Add(det);
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

        public ResponeValue UpdateCommission(int UserId, string TranType,int TranId, BE.Hospital.BreakItemCollections commissionColl)
        {

            ResponeValue resVal = new ResponeValue();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@TranId", TranId);

            if (TranType == "Billing")
                cmd.CommandText = "delete BM from tbl_BillingCommission BM inner join tbl_BillingDetails(nolock) BD on BD.BillingId=BM.BillingId where BM.CommissionTypeId=1 and BD.TranId=@TranId";
            else
                cmd.CommandText = "delete BM from tbl_DischargeCommission BM inner join tbl_DischargeDetails(nolock) BD on BD.DischargeId=BM.BillingId where BM.CommissionTypeId=1 and BD.TranId=@TranId";

            cmd.ExecuteNonQuery();
             
            try
            {
                foreach(var beData in commissionColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@BillingId", beData.BillingId);
                    cmd.Parameters.AddWithValue("@CommissionTypeId", 1);
                    cmd.Parameters.AddWithValue("@CommRatePer", beData.RatePer);
                    cmd.Parameters.AddWithValue("@CommRateAmt", beData.Rate);
                    cmd.Parameters.AddWithValue("@CommissionAmount", beData.Total);
                    cmd.Parameters.AddWithValue("@DoctorId", beData.DoctorId);
                    cmd.Parameters.AddWithValue("@UserId", UserId);

                    if (TranType == "Billing")
                        cmd.CommandText = "insert into tbl_BillingCommission(BillingId,CommissionTypeId,CommRatePer,CommRateAmt,CommissionAmount,DoctorId,USERId) values(@BillingId,@CommissionTypeId,@CommRatePer,@CommRateAmt,@CommissionAmount,@DoctorId,@UserId)";
                    else
                        cmd.CommandText = "insert into tbl_DischargeCommission(BillingId,CommissionTypeId,CommRatePer,CommRateAmt,CommissionAmount,DoctorId,USERId) values(@BillingId,@CommissionTypeId,@CommRatePer,@CommRateAmt,@CommissionAmount,@DoctorId,@UserId)";

                     
                    cmd.ExecuteNonQuery();
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Fraction Updated Done";
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }

    }
}

