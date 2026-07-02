using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Areas.EmployeePerformance.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
	{
        // GET: EmployeePerformance/Creation
        public ActionResult GoalTargetType()
        {
            return View();
        }

		#region "GoalTargetType"
		[HttpPost]
		/*[PermissionsAttribute(Actions.Save, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult SaveGoalTargetType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.GoalTargetType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.GoalTargetTypeId.HasValue)
						beData.GoalTargetTypeId = 0;

					resVal = new Dynamic.BL.GoalTargetType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

				}
				else
				{
					resVal.ResponseMSG = "Blank Data Can't be Accept";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllGoalTargetType()
		{
			var dataColl = new Dynamic.BL.GoalTargetType(User.UserId, User.HostName, User.DBName).GetAllGoalTargetType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		
		public JsonNetResult GetGoalTargetTypeById(int GoalTargetTypeId)
		{
			var dataColl = new Dynamic.BL.GoalTargetType(User.UserId, User.HostName, User.DBName).GetGoalTargetTypeById(0, GoalTargetTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		/*[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult DelGoalTargetType(int GoalTargetTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.GoalTargetType(User.UserId, User.HostName, User.DBName).DeleteById(0, GoalTargetTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		//GoalPeriod Start
		public ActionResult GoalPeriod()
        {
            return View();
        }

		#region "GoalPeriod"
		[HttpPost]
		/*[PermissionsAttribute(Actions.Save, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult SaveGoalPeriod()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.GoalPeriod>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.GoalPeriodId.HasValue)
						beData.GoalPeriodId = 0;

					resVal = new Dynamic.BL.GoalPeriod(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

				}
				else
				{
					resVal.ResponseMSG = "Blank Data Can't be Accept";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllGoalPeriod()
		{
			var dataColl = new Dynamic.BL.GoalPeriod(User.UserId, User.HostName, User.DBName).GetAllGoalPeriod(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		
		public JsonNetResult GetGoalPeriodById(int GoalPeriodId)
		{
			var dataColl = new Dynamic.BL.GoalPeriod(User.UserId, User.HostName, User.DBName).GetGoalPeriodById(0, GoalPeriodId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		/*[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult DelGoalPeriod(int GoalPeriodId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.GoalPeriod(User.UserId, User.HostName, User.DBName).DeleteById(0, GoalPeriodId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		//GoalPeriod End

		//GoalType Start
		public ActionResult GoalType()
		{
			return View();
		}

		#region "GoalType"
		[HttpPost]
		public JsonNetResult SaveGoalType()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.GoalType>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.GoalTypeId.HasValue)
						beData.GoalTypeId = 0;

					resVal = new Dynamic.BL.GoalType(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

				}
				else
				{
					resVal.ResponseMSG = "Blank Data Can't be Accept";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllGoalType()
		{
			var dataColl = new Dynamic.BL.GoalType(User.UserId, User.HostName, User.DBName).GetAllGoalType(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult GetGoalTypeById(int GoalTypeId)
		{
			var dataColl = new Dynamic.BL.GoalType(User.UserId, User.HostName, User.DBName).GetGoalTypeById(0, GoalTypeId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]

		public JsonNetResult DelGoalType(int GoalTypeId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.GoalType(User.UserId, User.HostName, User.DBName).DeleteById(0, GoalTypeId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		#endregion

		//GoalType End

		//ObjectiveQuestion Start
		public ActionResult ObjectiveQuestion()
		{
			return View();
		}

		#region "ObjectiveQuestion"
		[HttpPost]
	/*	[PermissionsAttribute(Actions.Save, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult SaveObjectiveQuestion()
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				var beData = DeserializeObject<Dynamic.BE.ObjectiveQuestion>(Request["jsonData"]);
				if (beData != null)
				{
					beData.CUserId = User.UserId;
					if (!beData.ObjectiveQuestionId.HasValue)
						beData.ObjectiveQuestionId = 0;

					resVal = new Dynamic.BL.ObjectiveQuestion(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

				}
				else
				{
					resVal.ResponseMSG = "Blank Data Can't be Accept";
				}
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
		[HttpPost]
		public JsonNetResult GetAllObjectiveQuestion()
		{
			var dataColl = new Dynamic.BL.ObjectiveQuestion(User.UserId, User.HostName, User.DBName).GetAllObjectiveQuestion(0);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
	
		public JsonNetResult GetObjectiveQuestionById(int ObjectiveQuestionId)
		{
			var dataColl = new Dynamic.BL.ObjectiveQuestion(User.UserId, User.HostName, User.DBName).GetObjectiveQuestionById(0, ObjectiveQuestionId);
			return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
		}
		[HttpPost]
		/*[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]*/
		public JsonNetResult DelObjectiveQuestion(int ObjectiveQuestionId)
		{
			ResponeValues resVal = new ResponeValues();
			try
			{
				resVal = new Dynamic.BL.ObjectiveQuestion(User.UserId, User.HostName, User.DBName).DeleteById(0, ObjectiveQuestionId);
			}
			catch (Exception ee)
			{
				resVal.IsSuccess = false;
				resVal.ResponseMSG = ee.Message;
			}
			return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
		}
        #endregion


        //ObjectiveQuestion End

        #region "GoalSetup"
        public ActionResult GoalSetup()
		{
			return View();
		}

        [HttpPost]
        /*[PermissionsAttribute(Actions.Save, (int)ENTITIES.ClassSetup, false)]*/
        public JsonNetResult SaveGoalSetup()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.GoalSetup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.GoalSetupId.HasValue)
                        beData.GoalSetupId = 0;

                    resVal = new Dynamic.BL.GoalSetup(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAllGoalSetup()
        {
            var dataColl = new Dynamic.BL.GoalSetup(User.UserId, User.HostName, User.DBName).GetAllGoalSetup(0);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetGoalSetupById(int GoalSetupId)
        {
            var dataColl = new Dynamic.BL.GoalSetup(User.UserId, User.HostName, User.DBName).GetGoalSetupById(0, GoalSetupId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        /*[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]*/
        public JsonNetResult DelGoalSetup(int GoalSetupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.GoalSetup(User.UserId, User.HostName, User.DBName).DeleteById(0, GoalSetupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
		#endregion

		//GoalSetup End

		#region GoalReleased
		public ActionResult GoalReleased()
		{
			return View();
		}

        [HttpPost]
        public JsonNetResult GetEmployeeGoalRelease(int CostClassId, int GoalSetupId, int ForId)
        {
            var dataColl = new Dynamic.BL.GoalReleased(User.UserId, User.HostName, User.DBName).GetEmployeeGoalRelease(CostClassId, GoalSetupId,ForId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveGoalRelease()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<List<Dynamic.BE.GoalReleased>>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new Dynamic.BL.GoalReleased(User.UserId, User.HostName, User.DBName).SaveGoalRelease(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllSupervisors()
        {
            var dataColl = new Dynamic.BL.GoalReleased(User.UserId, User.HostName, User.DBName).GetAllSupervisors();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEmpGoalSetupBySupId(int SupUserId, int CostClassId, int? GoalSetupId)
        {
            Dynamic.BE.GoalReleasedCollections dataColl = new Dynamic.BE.GoalReleasedCollections();
            try
            {
                dataColl = new Dynamic.BL.GoalReleased(User.UserId, User.HostName, User.DBName).GetEmpGoalSetupBySupId(SupUserId, CostClassId, GoalSetupId);
                return new JsonNetResult() { Data = new { GoalSetupColl = dataColl.GoalSetupColl , EmployeeList = dataColl.EmployeeList }, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "Assigned Goal"
        public ActionResult AssignedGoal()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetEmployeeAssignedGoal(int CostClassId, int ForId)
        {
            var dataColl = new Dynamic.BL.AssignedGoal(User.UserId, User.HostName, User.DBName).GetEmployeeAssignedGoal(CostClassId, ForId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveAssignedGoal()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BE.AssignedGoal>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (!beData.TranId.HasValue)
                        beData.TranId = 0;

                    resVal = new Dynamic.BL.AssignedGoal(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult GetAssignedGoalById(int TranId)
        {
            var dataColl = new Dynamic.BL.AssignedGoal(User.UserId, User.HostName, User.DBName).GetAssignedGoalById(0, TranId);
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        public JsonNetResult DelAssignedGoal(int TranId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.AssignedGoal(User.UserId, User.HostName, User.DBName).DeleteById(0, TranId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SubmitAssigneGoal(int UsersId, int GoalReleasedId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BL.GoalReleased(User.UserId, User.HostName, User.DBName).SubmitAssigneGoal(UsersId, GoalReleasedId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion


        #region RatingPoint
        public ActionResult RatingPoint()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult GetAssignedGoalSubmited()
        {
            var dataColl = new Dynamic.BL.AssignedGoal(User.UserId, User.HostName, User.DBName).GetAssignedGoalSubmited();
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveRatingPoint()
        {

            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = DeserializeObject<List<Dynamic.BE.RatingPoint>>(Request["jsonData"]);
                if (dataColl != null)
                {
                    resVal = new Dynamic.BL.AssignedGoal(User.UserId, User.HostName, User.DBName).SaveRatingPoint(dataColl);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion
    }
}