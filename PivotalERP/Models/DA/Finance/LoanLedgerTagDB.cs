using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.DataAccess.Finance
{
    public class LoanLedgerTagDB
    {
        Global.DataAccessLayer1 dal=null;
        public LoanLedgerTagDB() { dal = new Global.DataAccessLayer1(); }
        public LoanLedgerTagDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName,dbName);
        }

        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Finance.LoanLedgerTag beData)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();

            cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
            cmd.Parameters.AddWithValue("@FinanceLedgerId", beData.FinanceLedgerId);
            cmd.Parameters.AddWithValue("@InterestLedgerId", beData.InterestLedgerId);
            cmd.Parameters.AddWithValue("@PenaltyLedgerId", beData.PenaltyLedgerId);
            cmd.Parameters.AddWithValue("@PrincipalLedgerId", beData.PrincipalLedgerId);
            cmd.Parameters.AddWithValue("@RebateLedgerId", beData.RebateLedgerId);
            cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);


            //CostClassId,FinanceLedgerId,InterestLedgerId,PenaltyLedgerId,PrincipalLedgerId,RebateLedgerId,VoucherId

            try
            {
                cmd.CommandText = "delete from tbl_LoanLedgerTag";
                cmd.ExecuteNonQuery();

                cmd.CommandText = "insert into tbl_LoanLedgerTag(CostClassId,FinanceLedgerId,InterestLedgerId,PenaltyLedgerId,PrincipalLedgerId,RebateLedgerId,VoucherId) values(@CostClassId,@FinanceLedgerId,@InterestLedgerId,@PenaltyLedgerId,@PrincipalLedgerId,@RebateLedgerId,@VoucherId)";
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
                resVal.RId = 0;
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SAVE_SUCCESS;

            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
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
        public Dynamic.BusinessEntity.Finance.LoanLedgerTag getLoanLedgerTag()
        {
            dal.OpenConnection();

            //StoreListBoxState,StoreScreenCapture

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select CostClassId,FinanceLedgerId,InterestLedgerId,PenaltyLedgerId,PrincipalLedgerId,RebateLedgerId,VoucherId from tbl_LoanLedgerTag");
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanLedgerTag beData = new BusinessEntity.Finance.LoanLedgerTag();
                    if (!(reader[0] is System.DBNull)) beData.CostClassId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.FinanceLedgerId = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.InterestLedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.PenaltyLedgerId = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.PrincipalLedgerId = reader.GetInt32(4);
                    if (!(reader[5] is System.DBNull)) beData.RebateLedgerId = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.VoucherId = reader.GetInt32(6);
                   
                    reader.Close();
                    return beData;
                }

                return null;
            }
            catch (Exception ee)
            {
                throw ee;
            }
            finally
            {
                dal.CloseConnection();
            }
        }
    }
}
