using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.NPayroll
{
    internal class TaxRuleDB
    {
        DataAccessLayer1 dal = null;
        public TaxRuleDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }

        public ResponeValues Update(int UserId, List<Dynamic.BE.NPayroll.TaxRule> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            try
            {
                var fst = dataColl.First();
                cmd.Parameters.AddWithValue("@TaxType", fst.TaxType);
                cmd.Parameters.AddWithValue("@TaxFor", fst.TaxFor);
                cmd.CommandText = "usp_DelTaxRuleforSet";
                cmd.ExecuteNonQuery();
                foreach (var beData in dataColl)
                {
                    if(beData.PayHeadingId.HasValue && beData.PayHeadingId > 0)
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@TaxType", beData.TaxType);
                        cmd.Parameters.AddWithValue("@TaxFor", beData.TaxFor);
                        cmd.Parameters.AddWithValue("@CalculationFor", beData.CalculationFor);
                        cmd.Parameters.AddWithValue("@MinValue", beData.MinValue);
                        cmd.Parameters.AddWithValue("@MaxValue", beData.MaxValue);
                        cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                        cmd.Parameters.AddWithValue("@DisplayValue", beData.DisplayValue);
                        cmd.Parameters.AddWithValue("@PayHeadingId", beData.PayHeadingId);
                        cmd.Parameters.AddWithValue("@UserId", UserId);
                        cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
                        cmd.Parameters.AddWithValue("@TaxRuleId", beData.TaxRuleId);
                        cmd.CommandText = "usp_SaveTaxRule";
                        cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
                        cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
                        cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
                        cmd.Parameters[11].Direction = System.Data.ParameterDirection.Output;
                        cmd.Parameters[12].Direction = System.Data.ParameterDirection.Output;
                        cmd.Parameters[13].Direction = System.Data.ParameterDirection.Output;
                        cmd.ExecuteNonQuery();
                    }                  
                }
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Tax Rule Saved";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }

            return resVal;

        }

        public Dynamic.BE.NPayroll.TaxRuleCollections getAllTaxRule(int UserId, int EntityId, int? TaxFor)
        {
            Dynamic.BE.NPayroll.TaxRuleCollections dataColl = new Dynamic.BE.NPayroll.TaxRuleCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@TaxFor", TaxFor);
            cmd.CommandText = "usp_GetAllTaxRule";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BE.NPayroll.TaxRule beData = new Dynamic.BE.NPayroll.TaxRule();
                    beData.TaxRuleId = reader.GetInt32(0);
                    if (!(reader[0] is DBNull)) beData.TaxRuleId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.TaxType = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) beData.TaxFor = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.CalculationFor = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.MinValue = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.MaxValue = Convert.ToDouble(reader[5]);
                    if (!(reader[6] is DBNull)) beData.Rate = Convert.ToDouble(reader[6]);
                    if (!(reader[7] is DBNull)) beData.DisplayValue = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.PayHeadingId = reader.GetInt32(8);

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