//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Dynamic.DataAccess.Global;

//namespace Dynamic.DataAccess.Finance
//{
//    internal class LoanVehicleDB
//    {
//        DataAccessLayer1 dal = null;
//        public LoanVehicleDB(string hostName, string dbName)
//        {
//            dal = new DataAccessLayer1(hostName, dbName);
//        }
//        public Dynamic.BusinessEntity.Finance.LoanVehicleCollections GetAllLoanVehicle(int UserId, int EntityId)
//        {
//            Dynamic.BusinessEntity.Finance.LoanVehicleCollections dataColl = new Dynamic.BusinessEntity.Finance.LoanVehicleCollections();

//            dal.OpenConnection();
//            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
//            cmd.CommandType = System.Data.CommandType.StoredProcedure;
//            cmd.Parameters.AddWithValue("@UserId", UserId);
//            cmd.Parameters.AddWithValue("@EntityId", EntityId);
//            cmd.CommandText = "usp_GetAllLoanVehicle";
//            try
//            {
//                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
//                while (reader.Read())
//                {
//                    Dynamic.BusinessEntity.Finance.LoanVehicle beData = new Dynamic.BusinessEntity.Finance.LoanVehicle();
//                    beData.LedgerId = reader.GetInt32(0);
//                    if (!(reader[1] is DBNull)) beData.PartyName = reader.GetString(1);
//                    if (!(reader[2] is DBNull)) beData.EngineNo = reader.GetString(2);
//                    if (!(reader[3] is DBNull)) beData.ChechisNo = reader.GetString(3);
//                    if (!(reader[4] is DBNull)) beData.SalesPrice = Convert.ToDouble(reader[4]);
//                    if (!(reader[5] is DBNull)) beData.MfgYear = reader.GetInt32(5);
//                    if (!(reader[6] is DBNull)) beData.RegdNo = reader.GetString(6);
//                    if (!(reader[7] is DBNull)) beData.TranId = reader.GetInt32(7);
//                    dataColl.Add(beData);
//                }
//                reader.Close();
//                dataColl.IsSuccess = true;
//                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

//            }
//            catch (Exception ee)
//            {
//                dataColl.IsSuccess = false;
//                dataColl.ResponseMSG = ee.Message;
//            }
//            finally
//            {
//                dal.CloseConnection();
//            }
//            return dataColl;
//        }

//        public Dynamic.BusinessEntity.Finance.LoanVehicle GetLoanVehicleById(int TranId, int UserId)
//        {
//            Dynamic.BusinessEntity.Finance.LoanVehicle beData = new Dynamic.BusinessEntity.Finance.LoanVehicle();
//            dal.OpenConnection();
//            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
//            cmd.CommandType = System.Data.CommandType.StoredProcedure;
//            cmd.Parameters.AddWithValue("@TranId", TranId);
//            cmd.Parameters.AddWithValue("@UserId", UserId);
//            cmd.CommandText = "usp_GetLoanVehicleById";
//            try{
//                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
//                if (reader.Read())
//                {
//                    beData = new Dynamic.BusinessEntity.Finance.LoanVehicle();
//                    beData.TranId = reader.GetInt32(0);
//                    if (!(reader[1] is DBNull)) beData.LedgerId = reader.GetInt32(1);
//                    if (!(reader[2] is DBNull)) beData.RegdNo = reader.GetString(2);
//                    if (!(reader[3] is DBNull)) beData.EngineNo = reader.GetString(3);
//                    if (!(reader[4] is DBNull)) beData.ChechisNo = reader.GetString(4);
//                    if (!(reader[5] is DBNull)) beData.Model = reader.GetString(5);
//                    if (!(reader[6] is DBNull)) beData.Color = reader.GetString(6);
//                    if (!(reader[7] is DBNull)) beData.Type = reader.GetString(7);
//                    if (!(reader[8] is DBNull)) beData.KeyNo = reader.GetString(8);
//                    if (!(reader[9] is DBNull)) beData.CodeNo = reader.GetString(9);
//                    if (!(reader[10] is DBNull)) beData.MfgYear = reader.GetInt32(10);
//                    if (!(reader[11] is DBNull)) beData.BookingDate = Convert.ToDateTime(reader[11]);
//                    if (!(reader[12] is DBNull)) beData.BookingMemoNo = reader.GetString(12);
//                    if (!(reader[13] is DBNull)) beData.SalesBillNo = reader.GetString(13);
//                    if (!(reader[14] is DBNull)) beData.SalesDate = Convert.ToDateTime(reader[14]);
//                    if (!(reader[15] is DBNull)) beData.SalesPrice = Convert.ToDouble(reader[15]);
//                    if (!(reader[16] is DBNull)) beData.DiscountAmt = Convert.ToDouble(reader[16]);
//                    if (!(reader[17] is DBNull)) beData.AgentId = reader.GetInt32(17);
//                    if (!(reader[18] is DBNull)) beData.CommissionAmt = Convert.ToDouble(reader[18]);
//                    if (!(reader[19] is DBNull)) beData.FinanceMode = reader.GetString(19);
//                    if (!(reader[20] is DBNull)) beData.InsuranceName = reader.GetString(20);
//                    if (!(reader[21] is DBNull)) beData.InsuraceValidUpto = Convert.ToDateTime(reader[21]);
//                    if (!(reader[22] is DBNull)) beData.BlueBookValidUpto = Convert.ToDateTime(reader[22]);
//                    if (!(reader[23] is DBNull)) beData.RoutePermitValidUpto = Convert.ToDateTime(reader[23]);
//                    if (!(reader[24] is DBNull)) beData.CheckupValidUpto = Convert.ToDateTime(reader[24]);
//                    if (!(reader[25] is DBNull)) beData.Zone = reader.GetString(25);
//                    if (!(reader[26] is DBNull)) beData.District = reader.GetString(26);
//                    if (!(reader[27] is DBNull)) beData.RecoveryName = reader.GetString(27);
//                    if (!(reader[28] is DBNull)) beData.CitizenshipNo = reader.GetString(28);
//                    if (!(reader[29] is DBNull)) beData.FatherName = reader.GetString(29);
//                    if (!(reader[30] is DBNull)) beData.MotherName = reader.GetString(30);
//                    if (!(reader[31] is DBNull)) beData.GFatherName = reader.GetString(31);
//                    if (!(reader[32] is DBNull)) beData.GMotherName = reader.GetString(32);
//                    if (!(reader[33] is DBNull)) beData.Notes = reader.GetString(33);
//                    if (!(reader[34] is DBNull)) beData.Culty = Convert.ToBoolean(reader[34]);
//                }
//                reader.Close();
//                beData.IsSuccess = true;
//                beData.ResponseMSG = GLOBALMSG.SUCCESS;
//            }
//            catch (Exception ee)
//            {
//                beData.IsSuccess = false;
//                beData.ResponseMSG = ee.Message;
//            }
//            finally
//            {
//                dal.CloseConnection();
//            }
//            return beData;
//        }

//        public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
//        {
//            ResponeValues resVal = new ResponeValues();

//            dal.OpenConnection();
//            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
//            cmd.CommandType = System.Data.CommandType.StoredProcedure;
//            cmd.Parameters.AddWithValue("@UserId", UserId);
//            cmd.Parameters.AddWithValue("@EntityId", EntityId);
//            cmd.Parameters.AddWithValue("@TranId", TranId);
//            cmd.CommandText = "usp_DelLoanVehicleById";
//            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
//            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
//            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
//            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
//            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
//            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
//            try
//            {
//                cmd.ExecuteNonQuery();

//                if (!(cmd.Parameters[3].Value is DBNull))
//                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

//                if (!(cmd.Parameters[4].Value is DBNull))
//                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

//                if (!(cmd.Parameters[5].Value is DBNull))
//                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

//                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
//                    resVal.ResponseMSG = resVal.ResponseMSG + " (" + resVal.ErrorNumber.ToString() + ")";

//            }
//            catch (System.Data.SqlClient.SqlException ee)
//            {
//                resVal.IsSuccess = false;
//                resVal.ResponseMSG = ee.Message;
//            }
//            catch (Exception ee)
//            {
//                resVal.IsSuccess = false;
//                resVal.ResponseMSG = ee.Message;
//            }
//            finally
//            {
//                dal.CloseConnection();
//            }
//            return resVal;
//        }

//    }
//}
