using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Dynamic.DataAccess.Finance
{
    public class LoanVehicleDetailsDB
    {
        Global.DataAccessLayer1 dal=null;
        public LoanVehicleDetailsDB() { dal = new Global.DataAccessLayer1(); }
        public LoanVehicleDetailsDB(string hostName, string dbName)
        {
            dal = new Global.DataAccessLayer1(hostName,dbName);
        }
        /// <summary>
        /// Create log table for Loan Vehicle Details and 
        /// </summary>
        /// <param name="beData"></param>
        /// <param name="isModify"></param>
        /// <returns></returns>
        public ResponeValues SaveUpdate(Dynamic.BusinessEntity.Finance.LoanVehicleDetails beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@AgentId", beData.AgentId);

            if(beData.BlueBookValidUpto.HasValue)
                cmd.Parameters.AddWithValue("@BlueBookValidUpto", beData.BlueBookValidUpto.Value);
            else
                cmd.Parameters.AddWithValue("@BlueBookValidUpto", DBNull.Value);

            if(beData.BookingDate.HasValue)
                cmd.Parameters.AddWithValue("@BookingDate", beData.BookingDate.Value);
            else
                cmd.Parameters.AddWithValue("@BookingDate", DBNull.Value);

            cmd.Parameters.AddWithValue("@BookingMemoNo", beData.BookingMemoNo);
            cmd.Parameters.AddWithValue("@ChechisNo", beData.ChechisNo);

            if(beData.CheckupValidUpto.HasValue)
                cmd.Parameters.AddWithValue("@CheckupValidUpto", beData.CheckupValidUpto.Value);
            else
                cmd.Parameters.AddWithValue("@CheckupValidUpto", DBNull.Value);
            cmd.Parameters.AddWithValue("@CitizenshipNo", beData.CitizenshipNo);
            cmd.Parameters.AddWithValue("@CodeNo", beData.CodeNo);
            cmd.Parameters.AddWithValue("@Color", beData.Color);
            cmd.Parameters.AddWithValue("@CommissionAmt", beData.CommissionAmt);
            cmd.Parameters.AddWithValue("@Culty", beData.Culty);
            cmd.Parameters.AddWithValue("@DiscountAmt", beData.DiscountAmt);
            cmd.Parameters.AddWithValue("@District", beData.District);
            cmd.Parameters.AddWithValue("@EngineNo", beData.EngineNo);
            cmd.Parameters.AddWithValue("@FatherName", beData.FatherName);
            cmd.Parameters.AddWithValue("@FinanceMode", beData.FinanceMode);
            cmd.Parameters.AddWithValue("@GFatherName", beData.GFatherName);
            cmd.Parameters.AddWithValue("@GMotherName", beData.GMotherName);

            if(beData.InsuraceValidUpto.HasValue)
                cmd.Parameters.AddWithValue("@InsuraceValidUpto", beData.InsuraceValidUpto.Value);
            else
                cmd.Parameters.AddWithValue("@InsuraceValidUpto", DBNull.Value);

            cmd.Parameters.AddWithValue("@InsuranceName", beData.InsuranceName);
            cmd.Parameters.AddWithValue("@KeyNo", beData.KeyNo);
            cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
            cmd.Parameters.AddWithValue("@MFGYear", beData.MFGYear);
            cmd.Parameters.AddWithValue("@Model", beData.Model);
            cmd.Parameters.AddWithValue("@MotherName", beData.MotherName);
            cmd.Parameters.AddWithValue("@Notes", beData.Notes);
            cmd.Parameters.AddWithValue("@RecoveryName", beData.RecoveryName);
            cmd.Parameters.AddWithValue("@RegdNo", beData.RegdNo);

            if(beData.RoutePermitValidUpto.HasValue)
                cmd.Parameters.AddWithValue("@RoutePermitValidUpto", beData.RoutePermitValidUpto.Value);
            else
                cmd.Parameters.AddWithValue("@RoutePermitValidUpto", DBNull.Value);

            cmd.Parameters.AddWithValue("@SalesBillNo", beData.SalesBillNo);

            if(beData.SalesDate.HasValue)
                cmd.Parameters.AddWithValue("@SalesDate", beData.SalesDate.Value);
            else
                cmd.Parameters.AddWithValue("@SalesDate", DBNull.Value);

            cmd.Parameters.AddWithValue("@SalesPrice", beData.SalesPrice);
            cmd.Parameters.AddWithValue("@Type", beData.Type);
            //cmd.Parameters.AddWithValue("@Zone", beData.Zone);

            //Added By Suresh
            cmd.Parameters.AddWithValue("@Province", beData.Province);
            cmd.Parameters.AddWithValue("@VoucherId", beData.VoucherId);
            cmd.Parameters.AddWithValue("@CostClassId", beData.CostClassId);
            cmd.Parameters.AddWithValue("@TranId", beData.TranId);
            //LedgerId,RegdNo,EngineNo,ChechisNo,Model,Color,[Type],KeyNo,CodeNo,MFGYear,BookingDate,BookingMemoNo,SalesBillNo,SalesDate,SalesPrice,DiscountAmt,AgentId,CommissionAmt,FinanceMode,InsuranceName,InsuraceValidUpto,BlueBookValidUpto,RoutePermitValidUpto,CheckupValidUpto,Zone,District,RecoveryName,CitizenshipNo,FatherName,MotherName,GFatherName,GMotherName,Notes,Culty


            if (isModify)
            {
                cmd.CommandText = "insert into tbl_LoanVehicleDetails_Log(TranId,LedgerId,RegdNo,EngineNo,ChechisNo,Model,Color,[Type],KeyNo,CodeNo,MFGYear,BookingDate,BookingMemoNo,SalesBillNo,SalesDate,SalesPrice,DiscountAmt,AgentId,CommissionAmt,FinanceMode,InsuranceName,InsuraceValidUpto,BlueBookValidUpto,RoutePermitValidUpto,CheckupValidUpto,District,RecoveryName,CitizenshipNo,FatherName,MotherName,GFatherName,GMotherName,Notes,Culty,Province,VoucherId,CostClassId) " +
                    "select TranId,LedgerId,RegdNo,EngineNo,ChechisNo,Model,Color,[Type],KeyNo,CodeNo,MFGYear,BookingDate,BookingMemoNo,SalesBillNo,SalesDate,SalesPrice,DiscountAmt,AgentId,CommissionAmt,FinanceMode,InsuranceName,InsuraceValidUpto,BlueBookValidUpto,RoutePermitValidUpto,CheckupValidUpto,District,RecoveryName,CitizenshipNo,FatherName,MotherName,GFatherName,GMotherName,Notes,Culty,Province,VoucherId,CostClassId  from tbl_LoanVehicleDetails where TranId = @TranId";
                cmd.ExecuteNonQuery();
                cmd.CommandText = "update tbl_LoanVehicleDetails set RegdNo=@RegdNo,EngineNo=@EngineNo,ChechisNo=@ChechisNo,Model=@Model,Color=@Color,[Type]=@Type,KeyNo=@KeyNo,CodeNo=@CodeNo,MFGYear=@MFGYear,BookingDate=@BookingDate,BookingMemoNo=@BookingMemoNo,SalesBillNo=@SalesBillNo,SalesDate=@SalesDate,SalesPrice=@SalesPrice,DiscountAmt=@DiscountAmt,AgentId=@AgentId,CommissionAmt=@CommissionAmt,FinanceMode=@FinanceMode,InsuranceName=@InsuranceName,InsuraceValidUpto=@InsuraceValidUpto,BlueBookValidUpto=@BlueBookValidUpto,RoutePermitValidUpto=@RoutePermitValidUpto,CheckupValidUpto=@CheckupValidUpto,District=@District,RecoveryName=@RecoveryName,CitizenshipNo=@CitizenshipNo,FatherName=@FatherName,MotherName=@MotherName,GFatherName=@GFatherName,GMotherName=@GMotherName,Notes=@Notes,Culty=@Culty,Province=@Province,VoucherId=@VoucherId,CostClassId=@CostClassId  where TranId=@TranId";
            }
            else
                cmd.CommandText = "insert into tbl_LoanVehicleDetails(LedgerId,RegdNo,EngineNo,ChechisNo,Model,Color,[Type],KeyNo,CodeNo,MFGYear,BookingDate,BookingMemoNo,SalesBillNo,SalesDate,SalesPrice,DiscountAmt,AgentId,CommissionAmt,FinanceMode,InsuranceName,InsuraceValidUpto,BlueBookValidUpto,RoutePermitValidUpto,CheckupValidUpto,District,RecoveryName,CitizenshipNo,FatherName,MotherName,GFatherName,GMotherName,Notes,Culty,Province,VoucherId,CostClassId) values(@LedgerId,@RegdNo,@EngineNo,@ChechisNo,@Model,@Color,@Type,@KeyNo,@CodeNo,@MFGYear,@BookingDate,@BookingMemoNo,@SalesBillNo,@SalesDate,@SalesPrice,@DiscountAmt,@AgentId,@CommissionAmt,@FinanceMode,@InsuranceName,@InsuraceValidUpto,@BlueBookValidUpto,@RoutePermitValidUpto,@CheckupValidUpto,@District,@RecoveryName,@CitizenshipNo,@FatherName,@MotherName,@GFatherName,@GMotherName,@Notes,@Culty,@Province,@VoucherId,@CostClassId)";

            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
               // return beData.LedgerId;

                resVal.RId = beData.LedgerId;
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
        public ResponeValues Delete(Int32 TranId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.Parameters.AddWithValue("@LedgerId", TranId);

            cmd.CommandText = "delete from tbl_LoanVehicleDetails where LedgerId=@LedgerId; ";

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
        public Dynamic.BusinessEntity.Finance.LoanVehicleDetails getLoanVehicleDetails(int TranId)
        {
            dal.OpenConnection();

            try
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@TranId", TranId);
                cmd.CommandText = @"select LedgerId,RegdNo,EngineNo,ChechisNo,Model,Color,[Type],KeyNo,CodeNo,MFGYear,BookingDate,BookingMemoNo,SalesBillNo,SalesDate,SalesPrice,DiscountAmt,
                                    AgentId,CommissionAmt,FinanceMode,InsuranceName,InsuraceValidUpto,BlueBookValidUpto,RoutePermitValidUpto,CheckupValidUpto,Zone,District,
                                    RecoveryName,CitizenshipNo,FatherName,MotherName,GFatherName,GMotherName,Notes,Culty,Province,VoucherId,CostClassId,TranId from tbl_LoanVehicleDetails where TranId=@TranId";
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader(System.Data.CommandBehavior.SingleRow);
                if (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanVehicleDetails beData = new BusinessEntity.Finance.LoanVehicleDetails();
                    if (!(reader[0] is System.DBNull)) beData.LedgerId = reader.GetInt32(0);
                    if (!(reader[1] is System.DBNull)) beData.RegdNo = reader.GetString(1);
                    if (!(reader[2] is System.DBNull)) beData.EngineNo = reader.GetString(2);
                    if (!(reader[3] is System.DBNull)) beData.ChechisNo = reader.GetString(3);
                    if (!(reader[4] is System.DBNull)) beData.Model = reader.GetString(4);
                    if (!(reader[5] is System.DBNull)) beData.Color = reader.GetString(5);
                    if (!(reader[6] is System.DBNull)) beData.Type = reader.GetString(6);
                    if (!(reader[7] is System.DBNull)) beData.KeyNo = reader.GetString(7);
                    if (!(reader[8] is System.DBNull)) beData.CodeNo = reader.GetString(8);
                    if (!(reader[9] is System.DBNull)) beData.MFGYear = reader.GetInt32(9);
                    if (!(reader[10] is System.DBNull)) beData.BookingDate = reader.GetDateTime(10);
                    if (!(reader[11] is System.DBNull)) beData.BookingMemoNo = reader.GetString(11);
                    if (!(reader[12] is System.DBNull)) beData.SalesBillNo = reader.GetString(12);
                    if (!(reader[13] is System.DBNull)) beData.SalesDate = reader.GetDateTime(13);
                    if (!(reader[14] is System.DBNull)) beData.SalesPrice = Convert.ToDouble(reader[14]);
                    if (!(reader[15] is System.DBNull)) beData.DiscountAmt = Convert.ToDouble(reader[15]);
                    if (!(reader[16] is System.DBNull)) beData.AgentId = reader.GetInt32(16);
                    if (!(reader[17] is System.DBNull)) beData.CommissionAmt =Convert.ToDouble(reader[17]);
                    if (!(reader[18] is System.DBNull)) beData.FinanceMode = reader.GetString(18);
                    if (!(reader[19] is System.DBNull)) beData.InsuranceName = reader.GetString(19);
                    if (!(reader[20] is System.DBNull)) beData.InsuraceValidUpto = reader.GetDateTime(20);
                    if (!(reader[21] is System.DBNull)) beData.BlueBookValidUpto = reader.GetDateTime(21);
                    if (!(reader[22] is System.DBNull)) beData.RoutePermitValidUpto = reader.GetDateTime(22);
                    if (!(reader[23] is System.DBNull)) beData.CheckupValidUpto = reader.GetDateTime(23);
                    if (!(reader[24] is System.DBNull)) beData.Zone = reader.GetString(24);
                    if (!(reader[25] is System.DBNull)) beData.District = reader.GetString(25);
                    if (!(reader[26] is System.DBNull)) beData.RecoveryName = reader.GetString(26);
                    if (!(reader[27] is System.DBNull)) beData.CitizenshipNo = reader.GetString(27);
                    if (!(reader[28] is System.DBNull)) beData.FatherName = reader.GetString(28);
                    if (!(reader[29] is System.DBNull)) beData.MotherName = reader.GetString(29);
                    if (!(reader[30] is System.DBNull)) beData.GFatherName = reader.GetString(30);
                    if (!(reader[31] is System.DBNull)) beData.GMotherName = reader.GetString(31);
                    if (!(reader[32] is System.DBNull)) beData.Notes = reader.GetString(32);
                    if (!(reader[33] is System.DBNull)) beData.Culty = reader.GetBoolean(33);

                    //Added by Suresh
                    if (!(reader[34] is System.DBNull)) beData.Province = reader.GetString(34);
                    if (!(reader[35] is System.DBNull)) beData.VoucherId = reader.GetInt32(35);
                    if (!(reader[36] is System.DBNull)) beData.CostClassId = reader.GetInt32(36);
                    if (!(reader[37] is System.DBNull)) beData.TranId = reader.GetInt32(37);
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

        //Added By Suresh Starts
        public Dynamic.BusinessEntity.Finance.LoanVehicleDetailsCollections GetAllLoanVehicle(int UserId, int EntityId)
        {
            Dynamic.BusinessEntity.Finance.LoanVehicleDetailsCollections dataColl = new Dynamic.BusinessEntity.Finance.LoanVehicleDetailsCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAllLoanVehicleDetails";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Dynamic.BusinessEntity.Finance.LoanVehicleDetails beData = new Dynamic.BusinessEntity.Finance.LoanVehicleDetails();
                    beData.TranId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.PartyName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.EngineNo = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.ChechisNo = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.SalesPrice = Convert.ToDouble(reader[4]);
                    if (!(reader[5] is DBNull)) beData.MFGYear = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.RegdNo = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.Model = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.Color = reader.GetString(8);
                    if (!(reader[9] is DBNull)) beData.Type = reader.GetString(9);
                    if (!(reader[10] is DBNull)) beData.CodeNo = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.LedgerId = reader.GetInt32(11);
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
