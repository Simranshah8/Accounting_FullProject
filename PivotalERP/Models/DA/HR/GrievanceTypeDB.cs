using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.HR
{

	internal class GrievanceTypeDB
	{
		DataAccessLayer1 dal = null;
		public GrievanceTypeDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);

		}
		public ResponeValues SaveUpdate(BE.HR.GrievanceType beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@Name", beData.Name);
			cmd.Parameters.AddWithValue("@Code", beData.Code);
			cmd.Parameters.AddWithValue("@Description", beData.Description);
			cmd.Parameters.AddWithValue("@OrderNo", beData.OrderNo);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@TranId", beData.TranId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateGrievanceType";
			}
			else
			{
				cmd.Parameters[7].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddGrievanceType";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[8].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[9].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[10].Direction = System.Data.ParameterDirection.Output;
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[7].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[7].Value);

				if (!(cmd.Parameters[8].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[8].Value);

				if (!(cmd.Parameters[9].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[9].Value);

				if (!(cmd.Parameters[10].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[10].Value);

				if (!resVal.IsSuccess && resVal.ErrorNumber > 0)
					resVal.ResponseMSG = resVal.ResponseMSG + "(" + resVal.ErrorNumber.ToString() + ")";

				if (resVal.RId > 0 && resVal.IsSuccess)
				{
					SaveVoucherUDFDetails(beData.CUserId, resVal.RId, beData.VoucherUDFCol);
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

		public ResponeValues DeleteById(int UserId, int EntityId, int TranId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.CommandText = "usp_DelGrievanceTypeById";
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
		public BE.HR.GrievanceTypeCollections getAllGrievanceType(int UserId, int EntityId)
		{
			BE.HR.GrievanceTypeCollections dataColl = new BE.HR.GrievanceTypeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllGrievanceType";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.HR.GrievanceType beData = new BE.HR.GrievanceType();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.OrderNo = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[5]);
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


		private void SaveVoucherUDFDetails(int UserId, int TranId, List<Dynamic.BusinessEntity.Account.VoucherUDF> beDataColl)
		{
			if (beDataColl == null || beDataColl.Count == 0 || TranId == 0)
				return;

			foreach (Dynamic.BusinessEntity.Account.VoucherUDF beData in beDataColl)
			{
				System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
				cmd.Parameters.AddWithValue("@TranId", TranId);
				cmd.Parameters.AddWithValue("@TextColumn", beData.TextColumn);
				cmd.Parameters.AddWithValue("@RefColumn", beData.RefColumn);
				cmd.Parameters.AddWithValue("@RefTable", beData.RefTable);
				cmd.Parameters.AddWithValue("@CanAlter", beData.CanAlter);
				cmd.Parameters.AddWithValue("@CanEditable", beData.CanEditable);
				cmd.Parameters.AddWithValue("@ProductId", beData.ProductId);
				cmd.Parameters.AddWithValue("@LedgerId", beData.LedgerId);
				cmd.Parameters.AddWithValue("@ColWidth", beData.ColWidth);
				cmd.Parameters.AddWithValue("@Source", beData.Source);
				cmd.Parameters.AddWithValue("@Formula", beData.Formula);
				cmd.Parameters.AddWithValue("@Name", beData.Name);
				cmd.Parameters.AddWithValue("@FieldAfter", beData.FieldAfter);
				cmd.Parameters.AddWithValue("@IsMandatory", beData.IsMandatory);
				cmd.Parameters.AddWithValue("@DropDownList", beData.DropDownList);
				cmd.Parameters.AddWithValue("@DefaultValue", beData.DefaultValue);
				cmd.Parameters.AddWithValue("@FieldType", beData.FieldType);
				cmd.Parameters.AddWithValue("@Label", beData.Label);
				cmd.Parameters.AddWithValue("@SNo", beData.SNo);
				cmd.Parameters.AddWithValue("@OnDeleteCascade", beData.OnDeleteCascade);
				cmd.Parameters.AddWithValue("@ShowInSearch", beData.ShowInSearch);
				cmd.Parameters.AddWithValue("@UserId", UserId);

				cmd.CommandType = System.Data.CommandType.StoredProcedure;
				cmd.CommandText = "usp_AddGrievanceTypeDetailsDetails";
				cmd.ExecuteNonQuery();
			}

		}

		public BE.HR.GrievanceType getGrievanceTypeById(int UserId, int EntityId, int TranId)
		{
			BE.HR.GrievanceType beData = new BE.HR.GrievanceType();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@TranId", TranId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetGrievanceTypeById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.HR.GrievanceType();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.OrderNo = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[5]);
				}
				reader.NextResult();
				beData.VoucherUDFCol = new List<Dynamic.BusinessEntity.Account.VoucherUDF>();
				while (reader.Read())
				{
					Dynamic.BusinessEntity.Account.VoucherUDF det1 = new Dynamic.BusinessEntity.Account.VoucherUDF();
					if (!(reader[0] is DBNull)) det1.FieldId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) det1.TextColumn = reader.GetString(1);
					if (!(reader[2] is DBNull)) det1.RefColumn = reader.GetString(2);
					if (!(reader[3] is DBNull)) det1.RefTable = reader.GetString(3);
					if (!(reader[4] is DBNull)) det1.CanAlter = Convert.ToBoolean(reader[4]);
					if (!(reader[5] is DBNull)) det1.CanEditable = Convert.ToBoolean(reader[5]);
					if (!(reader[6] is DBNull)) det1.ProductId = reader.GetInt32(6);
					if (!(reader[7] is DBNull)) det1.LedgerId = reader.GetInt32(7);
					if (!(reader[8] is DBNull)) det1.ColWidth = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) det1.Source = reader.GetString(9);
					if (!(reader[10] is DBNull)) det1.Formula = reader.GetString(10);
					if (!(reader[11] is DBNull)) det1.Name = reader.GetString(11);
					if (!(reader[12] is DBNull)) det1.FieldAfter = reader.GetInt32(12);
					if (!(reader[13] is DBNull)) det1.IsMandatory = Convert.ToBoolean(reader[13]);
					if (!(reader[14] is DBNull)) det1.DropDownList = reader.GetString(14);
					if (!(reader[15] is DBNull)) det1.DefaultValue = reader.GetString(15);
					if (!(reader[16] is DBNull)) det1.FieldType = (Dynamic.BusinessEntity.Setup.DATATYPES)reader.GetInt32(16);
					if (!(reader[17] is DBNull)) det1.Label = reader.GetString(17);
					if (!(reader[18] is DBNull)) det1.SNo = reader.GetInt32(18);
					if (!(reader[19] is DBNull)) det1.OnDeleteCascade = Convert.ToBoolean(reader[19]);
					if (!(reader[20] is DBNull)) det1.ShowInSearch = Convert.ToBoolean(reader[20]);
					beData.VoucherUDFCol.Add(det1);
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

		public BE.HR.GrievanceTypeCollections GetActiveGrievanceType(int UserId, int EntityId)
		{
			BE.HR.GrievanceTypeCollections dataColl = new BE.HR.GrievanceTypeCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllGrievanceType";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.HR.GrievanceType beData = new BE.HR.GrievanceType();
					if (!(reader[0] is DBNull)) beData.TranId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.Name = reader.GetString(1);
					if (!(reader[2] is DBNull)) beData.Code = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.Description = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.OrderNo = reader.GetInt32(4);
					if (!(reader[5] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[5]);
					if (beData.IsActive == true)
					{
						dataColl.Add(beData);
					}
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

