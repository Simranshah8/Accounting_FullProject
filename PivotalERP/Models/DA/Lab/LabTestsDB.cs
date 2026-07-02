using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Lab
{
    internal class labTestDB
    {

        DataAccessLayer1 dal = null;
        public labTestDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(BE.Lab.labTest beData, bool isModify)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TestName", beData.TestName);
            cmd.Parameters.AddWithValue("@TestCode", beData.TestCode);
            cmd.Parameters.AddWithValue("@Alias", beData.Alias);
            cmd.Parameters.AddWithValue("@ReportPrintName", beData.ReportPrintName);
            cmd.Parameters.AddWithValue("@LabCategoryId", beData.LabCategoryId);
            cmd.Parameters.AddWithValue("@OrderPriorityId", beData.OrderPriorityId);
            cmd.Parameters.AddWithValue("@DefaultSpecimen", beData.DefaultSpecimen);
            cmd.Parameters.AddWithValue("@DefaultMethodId", beData.DefaultMethodId);
            cmd.Parameters.AddWithValue("@DefaultContainerId", beData.DefaultContainerId);
            cmd.Parameters.AddWithValue("@TAT", beData.TAT);
            cmd.Parameters.AddWithValue("@Charge", beData.Charge);
            cmd.Parameters.AddWithValue("@DisplaySequence", beData.DisplaySequence);
            cmd.Parameters.AddWithValue("@LONIC", beData.LONIC);
            cmd.Parameters.AddWithValue("@ReportTemplateId", beData.ReportTemplateId);
            cmd.Parameters.AddWithValue("@IsProfileTest", beData.IsProfileTest);
            cmd.Parameters.AddWithValue("@ProfileMemberTestId", beData.ProfileMemberTestId);
            cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
            cmd.Parameters.AddWithValue("@IsOutSources", beData.IsOutSources);
            cmd.Parameters.AddWithValue("@Interpretation", beData.Interpretation);
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
            cmd.Parameters.AddWithValue("@LabTestId", beData.LabTestId);
            if (isModify)
            {
                cmd.CommandText = "usp_Updatelab_Test";
            }
            else
            {
                cmd.Parameters[21].Direction = System.Data.ParameterDirection.Output;
                cmd.CommandText = "usp_Addlab_Test";
            }
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[22].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[23].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[24].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
            cmd.Parameters.AddWithValue("@ApplyTax", beData.ApplyTax);
            cmd.Parameters.AddWithValue("@IncludeTax", beData.IncludeTax);
            cmd.Parameters.AddWithValue("@CanChangeRate", beData.CanChangeRate);
            cmd.Parameters.AddWithValue("@DiscountUpToPer", beData.DiscountUpToPer);
            cmd.Parameters.AddWithValue("@AllowDiscount", beData.AllowDiscount);
            cmd.Parameters.AddWithValue("@SSFCharge", beData.SSFCharge);
            cmd.Parameters.AddWithValue("@SSFPer", beData.SSFPer);
            cmd.Parameters.AddWithValue("@CostCenterId", beData.CostCenterId);
            cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
            cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
            cmd.Parameters.AddWithValue("@ForGender", beData.ForGender);
            cmd.Parameters.AddWithValue("@IsIncentiveApplicable", beData.IsIncentiveApplicable);
            cmd.Parameters.AddWithValue("@IsPathology", beData.IsPathology);
            cmd.Parameters.AddWithValue("@IsRadiology", beData.IsRadiology);
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[21].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[21].Value);

                if (!(cmd.Parameters[22].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[22].Value);

                if (!(cmd.Parameters[23].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[23].Value);

                if (!(cmd.Parameters[24].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[24].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

                if (resVal.IsSuccess)
                {
                    SaveLabComponentsDetails(beData.CUserId, resVal.RId, beData.LabComponentsColl);
                }
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

        private void SaveLabComponentsDetails(int UserId, int LabTestId, BE.Lab.LabComponentsCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0)
                return;
            foreach (BE.Lab.LabComponents beData in beDataColl)
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@LabTestId", LabTestId);
                cmd.Parameters.AddWithValue("@Name", beData.Name);
                cmd.Parameters.AddWithValue("@Code", beData.Code);
                cmd.Parameters.AddWithValue("@UnitId", beData.UnitId);
                cmd.Parameters.AddWithValue("@TypeId", beData.TypeId);
                cmd.Parameters.AddWithValue("@DisplaySequence", beData.DisplaySequence);
                cmd.Parameters.AddWithValue("@ComponentGroup", beData.ComponentGroup);
                cmd.Parameters.AddWithValue("@AnswerSetId", beData.AnswerSetId);
                cmd.Parameters.AddWithValue("@MethodId", beData.MethodId);
                cmd.Parameters.AddWithValue("@Remarks", beData.Remarks);
                cmd.Parameters.AddWithValue("@Formula", beData.Formula);
                cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.Parameters.AddWithValue("@DefValue", beData.DefValue);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_AddLabComponentsDetails";
                if (beData.DisplaySequence.HasValue)
                {
                    SaveLabComponetReferenceRuleDetails(UserId, LabTestId, beData.DisplaySequence, beData.ReferenceRangeColl);
                }
                cmd.ExecuteNonQuery();
            }
        }

        private void SaveLabComponetReferenceRuleDetails(int UserId, int LabTestId,int? ComponetDisplaySequence, BE.Lab.LabComponetReferenceRuleCollections beDataColl)
        {
            if (beDataColl == null || beDataColl.Count == 0)
                return;

            foreach (BE.Lab.LabComponetReferenceRule beData in beDataColl)
            {
                System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
                cmd.Parameters.AddWithValue("@LabTestId", LabTestId);
                cmd.Parameters.AddWithValue("@ComponetDisplaySequence", ComponetDisplaySequence);
                cmd.Parameters.AddWithValue("@Gender", beData.Gender);
                cmd.Parameters.AddWithValue("@GenderDescription", beData.GenderDescription);
                cmd.Parameters.AddWithValue("@AgeMin", beData.AgeMin);
                cmd.Parameters.AddWithValue("@AgeMax", beData.AgeMax);
                cmd.Parameters.AddWithValue("@NormalLow", beData.NormalLow);
                cmd.Parameters.AddWithValue("@NormalHigh", beData.NormalHigh);
                cmd.Parameters.AddWithValue("@CriticalLow", beData.CriticalLow);
                cmd.Parameters.AddWithValue("@CriticalHigh", beData.CriticalHigh);
                cmd.Parameters.AddWithValue("@TextualReference", beData.TextualReference);
                cmd.Parameters.AddWithValue("@ReferenceRangeDescription", beData.ReferenceRangeDescription);
                cmd.Parameters.AddWithValue("@UserId", UserId);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandText = "usp_AddLabComponetReferenceRuleDetails";
                cmd.ExecuteNonQuery();
            }
        }
        public ResponeValues DeleteById(int UserId, int EntityId, int LabTestId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.AddWithValue("@LabTestId", LabTestId);
            cmd.CommandText = "usp_Dellab_TestById";
            cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
            cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
            cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
            cmd.Parameters[3].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[4].Direction = System.Data.ParameterDirection.Output;
            cmd.Parameters[5].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();

                if (!(cmd.Parameters[3].Value is DBNull))
                    resVal.ResponseMSG = Convert.ToString(cmd.Parameters[3].Value);

                if (!(cmd.Parameters[4].Value is DBNull))
                    resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[4].Value);

                if (!(cmd.Parameters[5].Value is DBNull))
                    resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[5].Value);

                if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
                    resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

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
        public BE.Lab.labTestCollections getAlllab_Test(int UserId, int EntityId)
        {
            BE.Lab.labTestCollections dataColl = new BE.Lab.labTestCollections();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_GetAlllab_Test";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Lab.labTest beData = new BE.Lab.labTest();
                    if (!(reader[0] is DBNull)) beData.LabTestId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.TestName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.TestCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.ReportPrintName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.LabCategoryId = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.OrderPriorityId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.DefaultSpecimen = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.DefaultMethodId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.DefaultContainerId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.TAT = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Charge = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.DisplaySequence = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.LONIC = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.ReportTemplateId = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.IsProfileTest = Convert.ToBoolean(reader[15]);
                    if (!(reader[16] is DBNull)) beData.ProfileMemberTestId = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[17]);
                    if (!(reader[18] is DBNull)) beData.IsOutSources = Convert.ToBoolean(reader[18]);
                    if (!(reader[19] is DBNull)) beData.Interpretation = reader.GetString(19);

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
        public BE.Lab.labTest getlab_TestById(int UserId, int EntityId, int LabTestId)
        {
            BE.Lab.labTest beData = new BE.Lab.labTest();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@LabTestId", LabTestId);
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.CommandText = "usp_Getlab_TestById";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    beData = new BE.Lab.labTest();
                    if (!(reader[0] is DBNull)) beData.LabTestId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) beData.TestName = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.TestCode = reader.GetString(2);
                    if (!(reader[3] is DBNull)) beData.Alias = reader.GetString(3);
                    if (!(reader[4] is DBNull)) beData.ReportPrintName = reader.GetString(4);
                    if (!(reader[5] is DBNull)) beData.LabCategoryId = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.OrderPriorityId = reader.GetInt32(6);
                    if (!(reader[7] is DBNull)) beData.DefaultSpecimen = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.DefaultMethodId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) beData.DefaultContainerId = reader.GetInt32(9);
                    if (!(reader[10] is DBNull)) beData.TAT = reader.GetString(10);
                    if (!(reader[11] is DBNull)) beData.Charge = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.DisplaySequence = reader.GetInt32(12);
                    if (!(reader[13] is DBNull)) beData.LONIC = reader.GetString(13);
                    if (!(reader[14] is DBNull)) beData.ReportTemplateId = reader.GetInt32(14);
                    if (!(reader[15] is DBNull)) beData.IsProfileTest = Convert.ToBoolean(reader[15]);
                    if (!(reader[16] is DBNull)) beData.ProfileMemberTestId = reader.GetString(16);
                    if (!(reader[17] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[17]);
                    if (!(reader[18] is DBNull)) beData.IsOutSources = Convert.ToBoolean(reader[18]);
                    if (!(reader[19] is DBNull)) beData.Interpretation = reader.GetString(19);
                    if (!(reader[20] is DBNull)) beData.DepartmentId = reader.GetInt32(20);
                    if (!(reader[21] is DBNull)) beData.ApplyTax = Convert.ToBoolean(reader[21]);
                    if (!(reader[22] is DBNull)) beData.IncludeTax = Convert.ToBoolean(reader[22]);
                    if (!(reader[23] is DBNull)) beData.CanChangeRate = Convert.ToBoolean(reader[23]);
                    if (!(reader[24] is DBNull)) beData.DiscountUpToPer = Convert.ToDouble(reader[24]);
                    if (!(reader[25] is DBNull)) beData.AllowDiscount = Convert.ToBoolean(reader[25]);
                    if (!(reader[26] is DBNull)) beData.SSFCharge = Convert.ToDouble(reader[26]);
                    if (!(reader[27] is DBNull)) beData.SSFPer = Convert.ToDouble(reader[27]);
                    if (!(reader[28] is DBNull)) beData.CostCenterId = reader.GetInt32(28);
                    if (!(reader[29] is DBNull)) beData.ProductId = reader.GetInt32(29);
                    if (!(reader[30] is DBNull)) beData.LedgerId = reader.GetInt32(30);
                    if (!(reader[31] is DBNull)) beData.ForGender = reader.GetInt32(31);
                    if (!(reader[32] is DBNull)) beData.IsIncentiveApplicable = Convert.ToBoolean(reader[32]);
                    if (!(reader[33] is DBNull)) beData.IsPathology = Convert.ToBoolean(reader[33]);
                    if (!(reader[34] is DBNull)) beData.IsRadiology = Convert.ToBoolean(reader[34]);

                }
                reader.NextResult();
                beData.LabComponentsColl = new BE.Lab.LabComponentsCollections();
                while (reader.Read())
                {
                    BE.Lab.LabComponents det1 = new BE.Lab.LabComponents();
                    if (!(reader[0] is DBNull)) det1.LabTestId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det1.Name = reader.GetString(1);
                    if (!(reader[2] is DBNull)) det1.Code = reader.GetString(2);
                    if (!(reader[3] is DBNull)) det1.UnitId = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) det1.TypeId = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) det1.DisplaySequence = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) det1.ComponentGroup = reader.GetString(6);
                    if (!(reader[7] is DBNull)) det1.AnswerSetId = reader.GetInt32(7);
                    if (!(reader[8] is DBNull)) det1.MethodId = reader.GetInt32(8);
                    if (!(reader[9] is DBNull)) det1.Remarks = reader.GetString(9);
                    if (!(reader[10] is DBNull)) det1.Formula = reader.GetString(10);
                    if (!(reader[11] is DBNull)) det1.IsActive = Convert.ToBoolean(reader[11]);

                    if (!(reader[12] is DBNull)) det1.DefValue = reader.GetInt32(12);
                    beData.LabComponentsColl.Add(det1);
                }
                reader.NextResult();
                while (reader.Read())
                {
                    BE.Lab.LabComponetReferenceRule det2 = new BE.Lab.LabComponetReferenceRule();
                    if (!(reader[0] is DBNull)) det2.LabTestId = reader.GetInt32(0);
                    if (!(reader[1] is DBNull)) det2.ComponetDisplaySequence = reader.GetInt32(1);
                    if (!(reader[2] is DBNull)) det2.Gender = reader.GetString(2);
                    if (!(reader[3] is DBNull)) det2.GenderDescription = reader.GetString(3);
                    if (!(reader[4] is DBNull)) det2.AgeMin = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) det2.AgeMax = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) det2.NormalLow = reader.GetString(6);
                    if (!(reader[7] is DBNull)) det2.NormalHigh = reader.GetString(7);
                    if (!(reader[8] is DBNull)) det2.CriticalLow = reader.GetString(8);
                    if (!(reader[9] is DBNull)) det2.CriticalHigh = reader.GetString(9);
                    if (!(reader[10] is DBNull)) det2.TextualReference = reader.GetString(10);
                    if (!(reader[11] is DBNull)) det2.ReferenceRangeDescription = reader.GetString(11);
                    beData.LabComponentsColl.Find(p1 => p1.LabTestId == det2.LabTestId && p1.DisplaySequence == det2.ComponetDisplaySequence).ReferenceRangeColl.Add(det2);
                }
                reader.Close();
                beData.IsSuccess = true;
                beData.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                beData.IsSuccess = false;
                beData.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return beData;
        }

        public ResponeValues GetAutoTestCode(int UserId, int EntityId)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@EntityId", EntityId);
            cmd.Parameters.Add("@TestCode", System.Data.SqlDbType.Int);
            cmd.CommandText = "usp_GetAutolabTestCode";
            cmd.Parameters[2].Direction = System.Data.ParameterDirection.Output;
            try
            {
                cmd.ExecuteNonQuery();
                if (!(cmd.Parameters[2].Value is DBNull))
                    resVal.RId = Convert.ToInt32(cmd.Parameters[2].Value);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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

    }

}

