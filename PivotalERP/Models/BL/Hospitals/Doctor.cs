using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace Dynamic.BL.Hospital
{

	public class Doctor
	{

		DA.Hospital.DoctorDB db = null;

		int _UserId = 0;

		public Doctor(int UserId, string hostName, string dbName)
		{
			this._UserId = UserId;
			db = new DA.Hospital.DoctorDB(hostName, dbName);
		}
		public ResponeValues SaveFormData(BE.Hospital.Doctor beData)
		{
			bool isModify = beData.DoctorId > 0;
			ResponeValues isValid = IsValidData(ref beData, isModify);
			if (isValid.IsSuccess)
				return db.SaveUpdate(beData, isModify);
			else
				return isValid;
		}
		public BE.Hospital.DoctorCollections GetAllDoctor(int EntityId)
		{
			return db.getAllDoctor(_UserId, EntityId);
		}
		public BE.Hospital.Doctor GetDoctorById(int EntityId, int DoctorId)
		{
			return db.getDoctorById(_UserId, EntityId, DoctorId);
		}
		public ResponeValues DeleteById(int EntityId, int DoctorId)
		{
			return db.DeleteById(_UserId, EntityId, DoctorId);
		}
		public ResponeValues AutoNumberForDoctor(int EntityId)
		{
			return db.AutoNumberForDoctor(_UserId, EntityId);
		}


		public ResponeValues IsValidData(ref BE.Hospital.Doctor beData, bool IsModify)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				if (beData == null)
				{
					resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
				}
				else if (IsModify && beData.DoctorId == 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
				}
				else if (!IsModify && beData.DoctorId != 0)
				{
					resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
				}
				else if (beData.CUserId == 0)
				{
					resVal.ResponseMSG = "Invalid User for CRUD";
				}
                else if (beData.AutoNumber == 0 || beData.AutoNumber.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select AutoNumber ";
                }
                else if (beData.EntryDate.Year < 1901)
				{
					resVal.ResponseMSG = "Please ! Enter  EntryDate ";
				}
				else if (string.IsNullOrEmpty(beData.FirstName))
				{
					resVal.ResponseMSG = "Please ! Enter FirstName ";
				}
				else if (string.IsNullOrEmpty(beData.LastName))
				{
					resVal.ResponseMSG = "Please ! Enter LastName ";
				}
				else if (beData.Gender == 0 || beData.Gender.HasValue == false)
				{
					resVal.ResponseMSG = "Please ! Select Gender ";
				}
                else if (beData.DepartmentId == 0 || beData.DepartmentId.HasValue == false)
                {
                    resVal.ResponseMSG = "Please ! Select Department ";
                }
                else if ((beData.DOBNY == 0 || beData.DOBNY.HasValue == false) && (beData.DOBNM == 0 || beData.DOBNM.HasValue == false) && (beData.DOBND == 0 || beData.DOBND.HasValue == false))
                {
                    resVal.ResponseMSG = "Please ! Enter Date Of Birth";
                }
                else
				{
					resVal.IsSuccess = true;
					resVal.ResponseMSG = "Valid";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return resVal;
		}
	
	}

}

