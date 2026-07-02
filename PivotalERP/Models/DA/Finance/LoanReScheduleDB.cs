
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.DataAccess.Finance
{
    public class LoanReScheduleDB
    {
        Global.DataAccessLayer1 dal=null;
        public LoanReScheduleDB() { dal = new Global.DataAccessLayer1(); }
        public LoanReScheduleDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName,dbName);
        }      
        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Finance.LoanCreation beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@CreateBy", beData.CreateBy);
            cmd.Parameters.AddWithValue("@LoanTranId", beData.TranId);
            cmd.Parameters.AddWithValue("@InterestRate", beData.InterestRate);
            cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
            cmd.Parameters.AddWithValue("@LoanAmount", beData.LoanAmount);
            cmd.Parameters.AddWithValue("@LoanType", beData.LoanType);
            cmd.Parameters.AddWithValue("@ModifyBy", beData.ModifyBy);
            cmd.Parameters.AddWithValue("@ND", beData.ND);
            cmd.Parameters.AddWithValue("@NM", beData.NM);
            cmd.Parameters.AddWithValue("@Notes", beData.Notes);
            cmd.Parameters.AddWithValue("@NY", beData.NY);
            cmd.Parameters.AddWithValue("@Period", beData.Period);
            cmd.Parameters.AddWithValue("@PeriodType", beData.PeriodType);
            cmd.Parameters.AddWithValue("@RefBy", beData.RefBy);
            cmd.Parameters.AddWithValue("@StartDate", beData.StartDate);
            cmd.Parameters.AddWithValue("@EntryDate", beData.EntryDate);
            cmd.Parameters.AddWithValue("@TranId", beData.ReScheduleId);

            //TranId,LoanTranId,LedgerId,EntryDate,LoanAmount,StartDate,NY,NM,ND,Period,PeriodType,InterestRate,RefBy,Notes,CreateBy,ModifyBy

            if (isModify)
            {
                cmd.CommandText = "delete from tbl_Rebate where TranId=@LoanTranId; delete from tbl_Penalty where TranId=@LoanTranId; delete from tbl_EMIDetails where JournalTranId=0 and ReScheduleTranId=@TranId";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "update tbl_LoanReSchedule set InterestRate=@InterestRate,LedgerId=@LedgerId,LoanAmount=@LoanAmount,LoanType=@LoanType,ModifyBy=@ModifyBy,ND=@ND,NM=@NM,Notes=@Notes,NY=@NY,Period=@Period,PeriodType=@PeriodType,RefBy=@RefBy,StartDate=@StartDate where TranId=@TranId ";
            }
            else
            {
                cmd.CommandText = "delete from tbl_Rebate where TranId=@LoanTranId; delete from tbl_Penalty where TranId=@LoanTranId; delete from tbl_EMIDetails where JournalTranId=0 and TranId=@LoanTranId; ";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "insert into tbl_LoanReSchedule(EntryDate,LoanTranId,CreateBy,InterestRate,LedgerId,LoanAmount,LoanType,ND,NM,Notes,NY,Period,PeriodType,RefBy,StartDate) values(@EntryDate,@LoanTranId,@CreateBy,@InterestRate,@LedgerId,@LoanAmount,@LoanType,@ND,@NM,@Notes,@NY,@Period,@PeriodType,@RefBy,@StartDate)";
            }

            try
            {
                cmd.ExecuteNonQuery();


                if (isModify)
                {                    
                    SaveEMI(beData.TranId,beData.ReScheduleId, beData.EMIColl);
                    SaveRebate(beData.TranId, beData.RebateColl);
                    SavePenalty(beData.TranId, beData.PenaltyColl);
                    dal.CommitTransaction();
                   // return beData.ReScheduleId;
                }
                else
                {
                    beData.ReScheduleId = dal.GetInsertId(cmd,"tbl_LoanReSchedule");                    
                    SaveEMI(beData.TranId,beData.ReScheduleId,beData.EMIColl);
                    SaveRebate(beData.TranId, beData.RebateColl);
                    SavePenalty(beData.TranId, beData.PenaltyColl);
                    dal.CommitTransaction();
                   // return beData.ReScheduleId;
                }

                resVal.RId = beData.ReScheduleId;
                resVal.IsSuccess = true;
                resVal.ResponseMSG = (isModify ? GLOBALMSG.UPDATE_SUCCESS : GLOBALMSG.SAVE_SUCCESS);

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
        private void SaveRebate(int TranId, Dynamic.BusinessEntity.Finance.RebatePenaltyDetailsCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (Dynamic.BusinessEntity.Finance.RebatePenaltyDetails beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@FromDays", beData.FromDays);
                cmd.Parameters.AddWithValue("@ToDays", beData.ToDays);
                cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                //TranId,FromDays,ToDays,Rate,Amount
                cmd.CommandText = "insert into tbl_Rebate(TranId,FromDays,ToDays,Rate,Amount) values(@TranId,@FromDays,@ToDays,@Rate,@Amount)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SavePenalty(int TranId, Dynamic.BusinessEntity.Finance.RebatePenaltyDetailsCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (Dynamic.BusinessEntity.Finance.RebatePenaltyDetails beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@FromDays", beData.FromDays);
                cmd.Parameters.AddWithValue("@ToDays", beData.ToDays);
                cmd.Parameters.AddWithValue("@Rate", beData.Rate);
                cmd.Parameters.AddWithValue("@Amount", beData.Amount);
                //TranId,FromDays,ToDays,Rate,Amount
                cmd.CommandText = "insert into tbl_Penalty(TranId,FromDays,ToDays,Rate,Amount) values(@TranId,@FromDays,@ToDays,@Rate,@Amount)";
                cmd.ExecuteNonQuery();
            }

        }
        private void SaveEMI(int TranId,int rescheduleTranId, Dynamic.BusinessEntity.Finance.EMIDetailsCollections beDataColl)
        {
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            foreach (Dynamic.BusinessEntity.Finance.EMIDetails beData in beDataColl)
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.Parameters.AddWithValue("@ReScheduleTranId", rescheduleTranId);
                cmd.Parameters.AddWithValue("@PaymentNo", beData.PaymentNo);
                cmd.Parameters.AddWithValue("@BegingBalance", beData.BegingBalance);
                cmd.Parameters.AddWithValue("@EMIDate", beData.EMIDate);
                cmd.Parameters.AddWithValue("@ND", beData.END);
                cmd.Parameters.AddWithValue("@EndingBalance", beData.EndingBalance);
                cmd.Parameters.AddWithValue("@NM", beData.ENM);
                cmd.Parameters.AddWithValue("@NY", beData.ENY);
                cmd.Parameters.AddWithValue("@Interest", beData.Interest);
                cmd.Parameters.AddWithValue("@Principal", beData.Principal);
                cmd.Parameters.AddWithValue("@SchedulePayment", beData.SchedulePayment);

                //TranId,PaymentNo,BegingBalance,EMIDate,ND,EndingBalance,NM,NY,Interest,Principal,SchedulePayment
                cmd.CommandText = "insert into tbl_EMIDetails(ReScheduleTranId,TranId,PaymentNo,BeginingBalance,EMIDate,ND,EndingBalance,NM,NY,Interest,Principal,SchedulePayment) values(@ReScheduleTranId,@TranId,@PaymentNo,@BegingBalance,@EMIDate,@ND,@EndingBalance,@NM,@NY,@Interest,@Principal,@SchedulePayment)";
                cmd.ExecuteNonQuery();
            }

        }    
        public ResponeValues Delete(Int32 TranId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@TranId", TranId);

            cmd.CommandText = "delete from tbl_LoanReSchedule where TranId=@TranId; ";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

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
        public ResponeValues Delete(string CostCenterId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandText = "delete from tbl_LoanReSchedule where TranId in (" + CostCenterId + ")";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.DELETE_SUCCESS;

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
        public bool CanModifyOrDeleteLoanCreation(int TranId)
        {
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@TranId", TranId);
            cmd.CommandText = "select count(*) from tbl_EMIDetails E where E.ReScheduleTranId=@TranId and (E.JournalTranId>0 or RebatePenaltyTranId>0)";

            try
            {
                int count = Convert.ToInt32(cmd.ExecuteScalar());
                if (count == 0)
                    return true;
                else
                    return false;
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
        public void getRebatePenaltyDetails(ref Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", beData.TranId);

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount from tbl_Rebate where TranId=@TranId";

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    beData.RebateColl.Add(reb);
                }
                reader.Close();

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount from tbl_Penalty where TranId=@TranId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    beData.PenaltyColl.Add(reb);
                }
                reader.Close();

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
        public void getLoanDetailsByTranId(BaseDate baseDate,ref Dynamic.BusinessEntity.Finance.LoanCreation beData)
        {

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", beData.TranId);

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount from tbl_Rebate where TranId=@TranId";

                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    beData.RebateColl.Add(reb);
                }
                reader.Close();

                cmd.CommandText = "select FromDays,ToDays,Rate,Amount from tbl_Penalty where TranId=@TranId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.RebatePenaltyDetails reb = new BusinessEntity.Finance.RebatePenaltyDetails();
                    if (!(reader[0] is System.DBNull)) reb.FromDays = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.ToDays = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) reb.Rate = Convert.ToDouble(reader[2]);
                    if (!(reader[3] is System.DBNull)) reb.Amount = Convert.ToDouble(reader[3]);
                    beData.PenaltyColl.Add(reb);
                }
                reader.Close();                

                cmd.CommandText = "select PaymentNo,BeginingBalance,EMIDate,ND,EndingBalance,NM,NY,Interest,Principal,SchedulePayment from tbl_EMIDetails where TranId=@TranId";
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.EMIDetails reb = new BusinessEntity.Finance.EMIDetails();
                    if (!(reader[0] is System.DBNull)) reb.PaymentNo = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) reb.BegingBalance = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) reb.EMIDate = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) reb.END = reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) reb.EndingBalance = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) reb.ENM = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) reb.ENY = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) reb.Interest = Convert.ToDouble(reader[7]);
                    if (!(reader[8] is System.DBNull)) reb.Principal = Convert.ToDouble(reader[8]);
                    if (!(reader[9] is System.DBNull)) reb.SchedulePayment = Convert.ToDouble(reader[9]);

                    if (baseDate == BaseDate.NepaliDate)
                        reb.EMIDateStr = Dynamic.DataAccess.Global.GlobalDB.GetDateStr(reb.ENY, reb.ENM, reb.END);
                    else
                        reb.EMIDateStr = Dynamic.DataAccess.Global.GlobalDB.GetDateStr(reb.EMIDate);

                    beData.EMIColl.Add(reb);
                }
                reader.Close();
                
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
        public Dynamic.BusinessEntity.Finance.LoanCreationCollections getAllLoanCreation()
        {
            Dynamic.BusinessEntity.Finance.LoanCreationCollections dataColl = new BusinessEntity.Finance.LoanCreationCollections();

            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText(" select LC.TranId,0 as [AutoNumber],LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,Led.Name as LedgerName,(case when (select count(*) from tbl_EMIDetails ED where ED.TranId=LC.TranId and JournalTranId>0)>0 then 0 else 1 end) as CanModify from tbl_LoanReSchedule LC inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId ");
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.StartDate = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.CreateBy = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.ModifyBy = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.CreationDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) beData.LedgerName = reader.GetString(17);

                    dataColl.Add(beData);
                }
                reader.Close();
                return dataColl;
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
        public Dynamic.BusinessEntity.Finance.LoanCreation getCostCenterByRowNumber(long rowNum)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText(@"
                with CostCenter as
                (
                 select LC.TranId,LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,Led.Name as LedgerName,ROW_NUMBER() over (order by LC.TranId) as RowNumber from tbl_LoanReSchedule LC inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId 
                )select LC.TranId,0 as [AutoNumber],LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,LedgerName,(case when (select count(*) from tbl_EMIDetails ED where ED.TranId=LC.TranId and JournalTranId>0)>0 then 0 else 1 end) as CanModify from CostCenter LC where LC.RowNumber=" + rowNum.ToString());

                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.StartDate = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.CreateBy = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.ModifyBy = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.CreationDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) beData.LedgerName = reader.GetString(17);
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
        public Dynamic.BusinessEntity.Finance.LoanCreation getLastRowData(ref long count)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlDataReader reader = dal.ExecuteDataReaderText("select top 1 LC.TranId,0 as [AutoNumber],LC.LedgerId,LC.LoanAmount,LC.StartDate,LC.NY,LC.NM,LC.ND,LC.Period,LC.PeriodType,LC.LoanType,LC.InterestRate,LC.RefBy,LC.Notes,LC.CreateBy,LC.ModifyBy,CreationDate,Led.Name as LedgerName,(case when (select count(*) from tbl_EMIDetails ED where ED.TranId=LC.TranId and JournalTranId>0)>0 then 0 else 1 end) as CanModify from tbl_LoanReSchedule LC inner join tbl_Ledger Led on Led.LedgerId=LC.LedgerId  order by LC.TranId desc ");
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanCreation beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.AutoNumber = reader.GetInt32(1);
                    if (!(reader[2] is System.DBNull)) beData.LedgerId = reader.GetInt32(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[3]);
                    if (!(reader[4] is System.DBNull)) beData.StartDate = reader.GetDateTime(4);
                    if (!(reader[5] is System.DBNull)) beData.NY = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.NM = reader.GetInt32(6);
                    if (!(reader[7] is System.DBNull)) beData.ND = reader.GetInt32(7);
                    if (!(reader[8] is System.DBNull)) beData.Period = reader.GetInt32(8);
                    if (!(reader[9] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(10);
                    if (!(reader[11] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is System.DBNull)) beData.RefBy = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.Notes = reader.GetString(13);
                    if (!(reader[14] is System.DBNull)) beData.CreateBy = reader.GetInt32(14);
                    if (!(reader[15] is System.DBNull)) beData.ModifyBy = reader.GetInt32(15);
                    if (!(reader[16] is System.DBNull)) beData.CreationDate = reader.GetDateTime(16);
                    if (!(reader[17] is System.DBNull)) beData.LedgerName = reader.GetString(17);
                    if (!(reader[18] is System.DBNull)) beData.CanModify = reader.GetBoolean(18);
                    reader.Close();

                    count = dal.GetTotalRows("tbl_LoanReSchedule");
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
        public Dynamic.BusinessEntity.Finance.LoanCreation getLoanDetailsForReGenerate(int LedgerId)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@LedgerId", LedgerId);
                cmd.CommandText = "select top 1 LC.TranId,ED.BeginingBalance,ED.EMIDate,LC.LoanType,LC.InterestRate,(select count(*) from tbl_EMIDetails E where E.TranId=LC.TranId and E.JournalTranId=0) as Period,LC.PeriodType from tbl_LoanCreation LC inner join tbl_EMIDetails ED on ED.TranId=LC.TranId where LC.LedgerId=@LedgerId and ED.JournalTranId=0 order by ED.EMIId";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                Dynamic.BusinessEntity.Finance.LoanCreation beData = null;
                if (reader.Read())
                {
                    beData = new BusinessEntity.Finance.LoanCreation();
                    if (!(reader[0] is System.DBNull)) beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.LoanAmount = Convert.ToDouble(reader[1]);
                    if (!(reader[2] is System.DBNull)) beData.StartDate = reader.GetDateTime(2);
                    if (!(reader[3] is System.DBNull)) beData.LoanType = (Dynamic.BusinessEntity.Finance.LoanTypes)reader.GetInt32(3);
                    if (!(reader[4] is System.DBNull)) beData.InterestRate = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is System.DBNull)) beData.Period = reader.GetInt32(5);
                    if (!(reader[6] is System.DBNull)) beData.PeriodType = (Dynamic.BusinessEntity.Finance.PeriodTypes)reader.GetInt32(6);
                }
                reader.Close();

                return beData;
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
        public System.Collections.Generic.List<int> GetAllLoanPartyId()
        {
            dal.OpenConnection();

            try
            {
                System.Collections.Generic.List<int> dataCOll = new List<int>();
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.CommandText = "select LC.LedgerId from tbl_LoanCreation LC left join tbl_ENdLoan EL on LC.TranId=EL.TranId where EL.TranId is null";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    dataCOll.Add(reader.GetInt32(0));
                }
                reader.Close();

                return dataCOll;
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
