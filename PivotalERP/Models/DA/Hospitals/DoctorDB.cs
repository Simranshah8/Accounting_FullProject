using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.DA.Hospital
{

	internal class DoctorDB
	{
		DataAccessLayer1 dal = null;
		public DoctorDB(string hostName, string dbName)
		{
			dal = new DataAccessLayer1(hostName, dbName);
		}
		public ResponeValues SaveUpdate(BE.Hospital.Doctor beData, bool isModify)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@AutoNumber", beData.AutoNumber);
			cmd.Parameters.AddWithValue("@DoctorCode", beData.DoctorCode);
			cmd.Parameters.AddWithValue("@EntryDate", beData.EntryDate);
			cmd.Parameters.AddWithValue("@FirstName", beData.FirstName);
			cmd.Parameters.AddWithValue("@MiddleName", beData.MiddleName);
			cmd.Parameters.AddWithValue("@LastName", beData.LastName);
			cmd.Parameters.AddWithValue("@NameNP", beData.NameNP);
			cmd.Parameters.AddWithValue("@Gender", beData.Gender);
			cmd.Parameters.AddWithValue("@Ethinicity", beData.Ethinicity);
			cmd.Parameters.AddWithValue("@BloodGroup", beData.BloodGroup);
			cmd.Parameters.AddWithValue("@Religion", beData.Religion);
			cmd.Parameters.AddWithValue("@DateOfBirthAD", beData.DateOfBirthAD);
			cmd.Parameters.AddWithValue("@MaritalStatus", beData.MaritalStatus);
			cmd.Parameters.AddWithValue("@Nationality", beData.Nationality);
			cmd.Parameters.AddWithValue("@CitizenshipNo", beData.CitizenshipNo);
			cmd.Parameters.AddWithValue("@PanId", beData.PanId);
			cmd.Parameters.AddWithValue("@EmailId", beData.EmailId);
			cmd.Parameters.AddWithValue("@Contact", beData.Contact);
			cmd.Parameters.AddWithValue("@FatherName", beData.FatherName);
			cmd.Parameters.AddWithValue("@FatherNameNP", beData.FatherNameNP);
			cmd.Parameters.AddWithValue("@MotherName", beData.MotherName);
			cmd.Parameters.AddWithValue("@MotherNameNP", beData.MotherNameNP);
			cmd.Parameters.AddWithValue("@GrandFather", beData.GrandFather);
			cmd.Parameters.AddWithValue("@GrandFatherNP", beData.GrandFatherNP);
			cmd.Parameters.AddWithValue("@Photo", beData.Photo);
			cmd.Parameters.AddWithValue("@Address", beData.Address);
			cmd.Parameters.AddWithValue("@AddressNP", beData.AddressNP);
			cmd.Parameters.AddWithValue("@Zone", beData.Zone);
			cmd.Parameters.AddWithValue("@District", beData.District);
			cmd.Parameters.AddWithValue("@Country", beData.Country);
			cmd.Parameters.AddWithValue("@TmpAddress", beData.TmpAddress);
			cmd.Parameters.AddWithValue("@TmpAddressNP", beData.TmpAddressNP);
			cmd.Parameters.AddWithValue("@TmpZone", beData.TmpZone);
			cmd.Parameters.AddWithValue("@TmpDistrict", beData.TmpDistrict);
			cmd.Parameters.AddWithValue("@TmpCountry", beData.TmpCountry);
			cmd.Parameters.AddWithValue("@Designation", beData.Designation);
			cmd.Parameters.AddWithValue("@JoinDate", beData.JoinDate);
			cmd.Parameters.AddWithValue("@DepartmentId", beData.DepartmentId);
			cmd.Parameters.AddWithValue("@PreeOfficeName", beData.PreeOfficeName);
			cmd.Parameters.AddWithValue("@PreeOfficePost", beData.PreeOfficePost);
			cmd.Parameters.AddWithValue("@PreeOfficeContact", beData.PreeOfficeContact);
			cmd.Parameters.AddWithValue("@PreeOfficeAddress", beData.PreeOfficeAddress);
			cmd.Parameters.AddWithValue("@PreeOfficeRemarks", beData.PreeOfficeRemarks);
			cmd.Parameters.AddWithValue("@Grade", beData.Grade);
			cmd.Parameters.AddWithValue("@EnrollNumber", beData.EnrollNumber);
			cmd.Parameters.AddWithValue("@MachineNumber", beData.MachineNumber);
			cmd.Parameters.AddWithValue("@DOBNY", beData.DOBNY);
			cmd.Parameters.AddWithValue("@DOBNM", beData.DOBNM);
			cmd.Parameters.AddWithValue("@DOBND", beData.DOBND);
			cmd.Parameters.AddWithValue("@ProvinceState", beData.ProvinceState);
			cmd.Parameters.AddWithValue("@TmpProvinceState", beData.TmpProvinceState);
			cmd.Parameters.AddWithValue("@PhotoPath", beData.PhotoPath);
			cmd.Parameters.AddWithValue("@IsSameAsCurrentAddress", beData.IsSameAsCurrentAddress);

			cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
			cmd.Parameters.AddWithValue("@EntityId", beData.EntityId);
			cmd.Parameters.AddWithValue("@DoctorId", beData.DoctorId);

			if (isModify)
			{
				cmd.CommandText = "usp_UpdateDoctor";
			}
			else
			{
				cmd.Parameters[55].Direction = System.Data.ParameterDirection.Output;
				cmd.CommandText = "usp_AddDoctor";
			}
			cmd.Parameters.Add("@ResponseMSG", System.Data.SqlDbType.NVarChar, 254);
			cmd.Parameters.Add("@IsSuccess", System.Data.SqlDbType.Bit);
			cmd.Parameters.Add("@ErrorNumber", System.Data.SqlDbType.Int);
			cmd.Parameters[56].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[57].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters[58].Direction = System.Data.ParameterDirection.Output;
			cmd.Parameters.AddWithValue("@DoctorSignature", beData.DoctorSignature);
			cmd.Parameters.AddWithValue("@NMCNo", beData.NMCNo);
			cmd.Parameters.AddWithValue("@NNCNo", beData.NNCNo);
			cmd.Parameters.AddWithValue("@NHPNo", beData.NHPNo);
			cmd.Parameters.AddWithValue("@IsIncentiveApplicable", beData.IsIncentiveApplicable);
			cmd.Parameters.AddWithValue("@IsAppointmentApplicable", beData.IsAppointmentApplicable);
			cmd.Parameters.AddWithValue("@IsActive", beData.IsActive);
			try
			{
				cmd.ExecuteNonQuery();
				if (!(cmd.Parameters[55].Value is DBNull))
					resVal.RId = Convert.ToInt32(cmd.Parameters[55].Value);

				if (!(cmd.Parameters[56].Value is DBNull))
					resVal.ResponseMSG = Convert.ToString(cmd.Parameters[56].Value);

				if (!(cmd.Parameters[57].Value is DBNull))
					resVal.IsSuccess = Convert.ToBoolean(cmd.Parameters[57].Value);

				if (!(cmd.Parameters[58].Value is DBNull))
					resVal.ErrorNumber = Convert.ToInt32(cmd.Parameters[58].Value);

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

		public ResponeValues DeleteById(int UserId, int EntityId, int DoctorId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.AddWithValue("@DoctorId", DoctorId);
			cmd.CommandText = "usp_DelDoctorById";
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
		public BE.Hospital.DoctorCollections getAllDoctor(int UserId, int EntityId)
		{
			BE.Hospital.DoctorCollections dataColl = new BE.Hospital.DoctorCollections();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetAllDoctor";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				while (reader.Read())
				{
					BE.Hospital.Doctor beData = new BE.Hospital.Doctor();
					if (!(reader[0] is DBNull)) beData.DoctorId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.DoctorCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.FullName = reader.GetString(3);
					if (!(reader[4] is DBNull)) beData.NameNP = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.Gender = reader.GetInt32(5);
					if (!(reader[6] is DBNull)) beData.Ethinicity = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.BloodGroup = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Religion = reader.GetString(8);
					if (!(reader[9] is DBNull)) beData.DateOfBirthAD = Convert.ToDateTime(reader[9]);
					if (!(reader[10] is DBNull)) beData.DOB_BS = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.MaritalStatus = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.Nationality = reader.GetString(12);
					if (!(reader[13] is DBNull)) beData.CitizenshipNo = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.PanId = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.EmailId = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.Contact = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.Department = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.GenderName = reader.GetString(18);
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
		public BE.Hospital.Doctor getDoctorById(int UserId, int EntityId, int DoctorId)
		{
			BE.Hospital.Doctor beData = new BE.Hospital.Doctor();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@DoctorId", DoctorId);
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.CommandText = "usp_GetDoctorById";
			try
			{
				System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
				if (reader.Read())
				{
					beData = new BE.Hospital.Doctor();
					if (!(reader[0] is DBNull)) beData.DoctorId = reader.GetInt32(0);
					if (!(reader[1] is DBNull)) beData.AutoNumber = reader.GetInt32(1);
					if (!(reader[2] is DBNull)) beData.DoctorCode = reader.GetString(2);
					if (!(reader[3] is DBNull)) beData.EntryDate = Convert.ToDateTime(reader[3]);
					if (!(reader[4] is DBNull)) beData.FirstName = reader.GetString(4);
					if (!(reader[5] is DBNull)) beData.MiddleName = reader.GetString(5);
					if (!(reader[6] is DBNull)) beData.LastName = reader.GetString(6);
					if (!(reader[7] is DBNull)) beData.NameNP = reader.GetString(7);
					if (!(reader[8] is DBNull)) beData.Gender = reader.GetInt32(8);
					if (!(reader[9] is DBNull)) beData.Ethinicity = reader.GetString(9);
					if (!(reader[10] is DBNull)) beData.BloodGroup = reader.GetString(10);
					if (!(reader[11] is DBNull)) beData.Religion = reader.GetString(11);
					if (!(reader[12] is DBNull)) beData.DateOfBirthAD = Convert.ToDateTime(reader[12]);
					if (!(reader[13] is DBNull)) beData.MaritalStatus = reader.GetString(13);
					if (!(reader[14] is DBNull)) beData.Nationality = reader.GetString(14);
					if (!(reader[15] is DBNull)) beData.CitizenshipNo = reader.GetString(15);
					if (!(reader[16] is DBNull)) beData.PanId = reader.GetString(16);
					if (!(reader[17] is DBNull)) beData.EmailId = reader.GetString(17);
					if (!(reader[18] is DBNull)) beData.Contact = reader.GetString(18);
					if (!(reader[19] is DBNull)) beData.FatherName = reader.GetString(19);
					if (!(reader[20] is DBNull)) beData.FatherNameNP = reader.GetString(20);
					if (!(reader[21] is DBNull)) beData.MotherName = reader.GetString(21);
					if (!(reader[22] is DBNull)) beData.MotherNameNP = reader.GetString(22);
					if (!(reader[23] is DBNull)) beData.GrandFather = reader.GetString(23);
					if (!(reader[24] is DBNull)) beData.GrandFatherNP = reader.GetString(24);
					if (!(reader[25] is DBNull)) beData.PhotoB = (byte[])reader[25];
					if (!(reader[26] is DBNull)) beData.Address = reader.GetString(26);
					if (!(reader[27] is DBNull)) beData.AddressNP = reader.GetString(27);
					if (!(reader[28] is DBNull)) beData.Zone = reader.GetString(28);
					if (!(reader[29] is DBNull)) beData.District = reader.GetString(29);
					if (!(reader[30] is DBNull)) beData.Country = reader.GetString(30);
					if (!(reader[31] is DBNull)) beData.TmpAddress = reader.GetString(31);
					if (!(reader[32] is DBNull)) beData.TmpAddressNP = reader.GetString(32);
					if (!(reader[33] is DBNull)) beData.TmpZone = reader.GetString(33);
					if (!(reader[34] is DBNull)) beData.TmpDistrict = reader.GetString(34);
					if (!(reader[35] is DBNull)) beData.TmpCountry = reader.GetString(35);
					if (!(reader[36] is DBNull)) beData.Designation = reader.GetString(36);
					if (!(reader[37] is DBNull)) beData.JoinDate = Convert.ToDateTime(reader[37]);
					if (!(reader[38] is DBNull)) beData.DepartmentId = reader.GetInt32(38);
					if (!(reader[39] is DBNull)) beData.PreeOfficeName = reader.GetString(39);
					if (!(reader[40] is DBNull)) beData.PreeOfficePost = reader.GetString(40);
					if (!(reader[41] is DBNull)) beData.PreeOfficeContact = reader.GetString(41);
					if (!(reader[42] is DBNull)) beData.PreeOfficeAddress = reader.GetString(42);
					if (!(reader[43] is DBNull)) beData.PreeOfficeRemarks = reader.GetString(43);
					if (!(reader[44] is DBNull)) beData.Grade = reader.GetString(44);
					if (!(reader[45] is DBNull)) beData.EnrollNumber = reader.GetString(45);
					if (!(reader[46] is DBNull)) beData.MachineNumber = reader.GetInt32(46);
					if (!(reader[47] is DBNull)) beData.DOBNY = reader.GetInt32(47);
					if (!(reader[48] is DBNull)) beData.DOBNM = reader.GetInt32(48);
					if (!(reader[49] is DBNull)) beData.DOBND = reader.GetInt32(49);
					if (!(reader[50] is DBNull)) beData.ProvinceState = reader.GetString(50);
					if (!(reader[51] is DBNull)) beData.TmpProvinceState = reader.GetString(51);
					if (!(reader[52] is DBNull)) beData.PhotoPath = reader.GetString(52);
					if (!(reader[53] is DBNull)) beData.IsSameAsCurrentAddress = Convert.ToBoolean(reader[53]);
					if (!(reader[54] is DBNull)) beData.DoctorSignature = reader.GetString(54);
					if (!(reader[55] is DBNull)) beData.NMCNo = reader.GetString(55);
					if (!(reader[56] is DBNull)) beData.NNCNo = reader.GetString(56);
					if (!(reader[57] is DBNull)) beData.NHPNo = reader.GetString(57);
					if (!(reader[58] is DBNull)) beData.IsIncentiveApplicable = Convert.ToBoolean(reader[58]);
					if (!(reader[59] is DBNull)) beData.IsAppointmentApplicable = Convert.ToBoolean(reader[59]);
					if (!(reader[60] is DBNull)) beData.IsActive = Convert.ToBoolean(reader[60]);
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

		public ResponeValues AutoNumberForDoctor(int UserId, int EntityId)
		{
			ResponeValues resVal = new ResponeValues();
			dal.OpenConnection();
			System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
			cmd.CommandType = System.Data.CommandType.StoredProcedure;
			cmd.Parameters.AddWithValue("@UserId", UserId);
			cmd.Parameters.AddWithValue("@EntityId", EntityId);
			cmd.Parameters.Add("@AutoNumber", System.Data.SqlDbType.Int);
			cmd.CommandText = "usp_AutoNumberForDoctor";
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

