app.controller('DischargeSlipController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'DischargeSlip ';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.UDFFeildsColl2 = [];
		$scope.UDFFeildsColl3 = [];
		$scope.UDFFeildsColl = [];
		var para11 = {
			EntityId: EntityId
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/getUDFByEntitId",
			dataType: "json",
			data: JSON.stringify(para11)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UDFFeildsColl = res.data.Data;
				

				angular.forEach($scope.UDFFeildsColl, function (uff) {

					if (uff.ColWidth == 0) {

						if(uff.FieldAfter==2 || uff.FieldAfter==3)
							uff.ColWidth = 100;
						else
							uff.ColWidth = 3;
                    }

					if (uff.ColWidth<10 && (uff.FieldAfter == 2 || uff.FieldAfter == 3))
						uff.ColWidth = 100;

					if (uff.FieldAfter == 2)
						$scope.UDFFeildsColl2.push(uff);
					else if (uff.FieldAfter == 3)
						$scope.UDFFeildsColl3.push(uff);

					if (uff.DataType == 9) {
						if (uff.DefaultValue == "true")
							uff.Value = true;
						else
							uff.Value = false;
					}

				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.currentPages = {
			DischargeSlip: 1,
		};

		$scope.searchData = {
			DischargeSlip: '',
		};

		$scope.perPage = {
			DischargeSlip: GlobalServices.getPerPageRow(),
		};
		$scope.newDetPatient = {
			TranId: null,
			PatientId: null,
			PatientName: '',
			AgeSex: '',
			Department: '',
			Address: '',
			Ward: '',
			BedNo: null,
			GuardianName: '',
			Relation: '',
			PhoneNo: '',
			DateAdmission: null
        }
		
		$scope.newDet = {
			TranId: null,
			DischargeSlipNo: 0,
			PatientName: '',
			AgeSex: '',
			Department: '',
			Address: '',
			Ward: '',
			BedNo: null,
			GuardianName: '',
			Relation: '',
			PhoneNo: '',
			DateAdmission: null,
			PatientId: '',
			DichargeSlipDateTMP: new Date(),
			FinalDiagnosis: '',
			DischargeStatus: '',
			History: '',
			ExaminationAdmission: '',
			CourseInHospital: '',
			ConditionTimeDischarge: '',
			NextFollowupDate_TMP: '',
			NextFollowupTime: '',
			Advice: '',
			Recommendation: '',
			Medications: '',
			PreparedBy: '',
			CheckedBy: '',
			ApprovedBy: '',
			InvestigationDetailsColl: [],
			MedicationDetailsColl: [],
			Mode: 'Save'
		};
		
		$scope.newDet.InvestigationDetailsColl.push({
			UDFFeildsColl: $scope.UDFFeildsColl2
		});
		$scope.newDet.MedicationDetailsColl.push({
			UDFFeildsColl: $scope.UDFFeildsColl3
		});
		$scope.GetDischargeSlipPrint();
		$scope.getCompanyDetail();
		//$scope.GetAllDischargeSlip();
		$scope.GetAutoDischargeNo();
	}

	
	$scope.ClearFields = function () {
		$scope.newDet = {
			TranId: null,
			PatientId: '',
			DichargeSlipDateTMP: new Date(),
			FinalDiagnosis: '',
			DischargeStatus: '',
			History: '',
			ExaminationAdmission: '',
			CourseInHospital: '',
			ConditionTimeDischarge: '',
			NextFollowupDate_TMP: '',
			NextFollowupTime: '',
			Advice: '',
			Recommendation: '',
			Medications: '',
			PreparedBy: '',
			CheckedBy: '',
			ApprovedBy: '',
			InvestigationDetailsColl: [],
			MedicationDetailsColl: [],
			Mode: 'Save'
		};
		$scope.newDetPatient = {
			TranId: null,
			PatientId: null,
			PatientName: '',
			AgeSex: '',
			Department: '',
			Address: '',
			Ward: '',
			BedNo: null,
			GuardianName: '',
			Relation: '',
			PhoneNo: '',
			DateAdmission: null
		};
		$scope.newDet.InvestigationDetailsColl.push({
			UDFFeildsColl: $scope.UDFFeildsColl2
		});
		$scope.newDet.MedicationDetailsColl.push({
			UDFFeildsColl: $scope.UDFFeildsColl3
		});

		$scope.GetAutoDischargeNo();
	}


	$scope.AddInvestigation = function (ind) {
	 
		if ($scope.newDet.InvestigationDetailsColl) {
			if ($scope.newDet.InvestigationDetailsColl.length > ind + 1) {
				$scope.newDet.InvestigationDetailsColl.splice(ind + 1, 0, {
					Remarks: '',
					UDFFeildsColl: $scope.UDFFeildsColl2
				})
			} else {
				$scope.newDet.InvestigationDetailsColl.push({
					Remarks: '',
					UDFFeildsColl: $scope.UDFFeildsColl2
				})
			}
		}
	};

	$scope.delInvestigation = function (ind) {
		if ($scope.newDet.InvestigationDetailsColl) {
			if ($scope.newDet.InvestigationDetailsColl.length > 1) {
				$scope.newDet.InvestigationDetailsColl.splice(ind, 1);
			}
		}
	};


	$scope.AddMedication = function (ind) {
		if ($scope.newDet.MedicationDetailsColl) {
			if ($scope.newDet.MedicationDetailsColl.length > ind + 1) {
				$scope.newDet.MedicationDetailsColl.splice(ind + 1, 0, {
					Remarks: '',
					UDFFeildsColl: $scope.UDFFeildsColl3
				})
			} else {
				$scope.newDet.MedicationDetailsColl.push({
					Remarks: '',
					UDFFeildsColl: $scope.UDFFeildsColl3
				})
			}
		}
	};

	$scope.delMedication = function (ind) {
		if ($scope.newDet.MedicationDetailsColl) {
			if ($scope.newDet.MedicationDetailsColl.length > 1) {
				$scope.newDet.MedicationDetailsColl.splice(ind, 1);
			}
		}
	};


	//************************* DischargeSlip *********************************
	$scope.IsValidDischargeSlip = function () {
		//if ($scope.newDet.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter Name');
		//	return false;
		//}
		return true;
	}

	$scope.SaveUpdateDischargeSlip = function () {
		if ($scope.IsValidDischargeSlip() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDet.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateDischargeSlip();
					}
				});
			} else
				$scope.CallSaveUpdateDischargeSlip();
		}
	};
	
	$scope.CallSaveUpdateDischargeSlip = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newDet.DichargeSlipDateDet) {
			$scope.newDet.DichargeSlipDate = $filter('date')(new Date($scope.newDet.DichargeSlipDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newDet.DichargeSlipDate = null;

		if ($scope.newDet.NextFollowupDateDet) {
			$scope.newDet.NextFollowupDate = $filter('date')(new Date($scope.newDet.NextFollowupDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newDet.NextFollowupDate = null;

		//for time
		if ($scope.newDet.NextFollowupTime_TMP)
			$scope.newDet.NextFollowupTime = $scope.newDet.NextFollowupTime_TMP.toLocaleString();
		else
			$scope.newDet.NextFollowupTime = null;


		$scope.newDet.PatientName = $scope.newDetPatient.PatientName;
		$scope.newDet.AgeSex = $scope.newDetPatient.Age;
		$scope.newDet.Department = $scope.newDetPatient.Department;
		$scope.newDet.Address = $scope.newDetPatient.Address;
		$scope.newDet.Ward = $scope.newDetPatient.Ward;
		$scope.newDet.BedNo = $scope.newDetPatient.BedNo;
		$scope.newDet.GuardianName = $scope.newDetPatient.GuardianName;
		$scope.newDet.Relation = $scope.newDetPatient.Relation;
		$scope.newDet.PhoneNo = $scope.newDetPatient.MobileNo;
		$scope.newDet.DateAdmission = $scope.newDetPatient.InDate;
		$scope.newDet.InPatientId = $scope.newDetPatient.InPatientTranId;
		$scope.newDet.PatientId = $scope.newDetPatient.PatientId;


		var voucherUDFFields = [];
		var voucherKeyVal = {};
		$scope.newDet.UserDefineFieldsColl = [];
		angular.forEach($scope.UDFFeildsColl, function (udf) {
			if (udf.FieldAfter != 2 && udf.FieldAfter != 3)
			{
				if (udf.NameId && udf.NameId.length > 0) {
					var uVal = {
						UDFId: udf.Id,
						Value: udf.UDFValue,
						AlterNetValue: '',
					};
					if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
							AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
						};
						uVal.AlterNetValue = ud.AlValue;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
					} else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValue,
							AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
						};
						uVal.AlterNetValue = ud.AlValue;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
					}
					else {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValue
						};
						uVal.AlterNetValue = ud.Value;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValue;
					}					 
				}
            }			 
		});
		if (voucherUDFFields.length > 0) {
			$scope.newDet.Attributes = JSON.stringify(voucherUDFFields);
			$scope.newDet.UDFKeyVal = JSON.stringify(voucherKeyVal);
		} else {
			$scope.newDet.Attributes = "";
			$scope.newDet.UDFKeyVal = "";
		}

		$scope.newDet.InvestigationDetailsColl.forEach(function (inv) {
			voucherUDFFields = [];
			voucherKeyVal = {};

			angular.forEach(inv.UDFFeildsColl, function (udf) {
				if (udf.NameId && udf.NameId.length > 0) {
					var uVal = {
						UDFId: udf.Id,
						Value: udf.UDFValue,
						AlterNetValue: '',
					};
					if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
							AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
						};
						uVal.AlterNetValue = ud.AlValue;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
					} else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValue,
							AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
						};
						uVal.AlterNetValue = ud.AlValue;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
					}
					else {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValue
						};
						uVal.AlterNetValue = ud.Value;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValue;
					}
				}
			});
			 
			if (voucherUDFFields.length > 0) {
				inv.Attributes = JSON.stringify(voucherUDFFields);
				inv.UDFKeyVal = JSON.stringify(voucherKeyVal);
			} else {
				$scope.newDet.Attributes = "";
				$scope.newDet.UDFKeyVal = "";
			}
		});

		$scope.newDet.MedicationDetailsColl.forEach(function (inv) {
			voucherUDFFields = [];
			voucherKeyVal = {};

			angular.forEach(inv.UDFFeildsColl, function (udf) {
				if (udf.NameId && udf.NameId.length > 0) {
					var uVal = {
						UDFId: udf.Id,
						Value: udf.UDFValue,
						AlterNetValue: '',
					};
					if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
							AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
						};
						uVal.AlterNetValue = ud.AlValue;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
					} else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValue,
							AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
						};
						uVal.AlterNetValue = ud.AlValue;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
					}
					else {
						var ud = {
							SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
							Name: udf.Name,
							Value: udf.UDFValue
						};
						uVal.AlterNetValue = ud.Value;
						voucherUDFFields.push(ud);
						voucherKeyVal[udf.NameId] = udf.UDFValue;
					}
				}
			});

			if (voucherUDFFields.length > 0) {
				inv.Attributes = JSON.stringify(voucherUDFFields);
				inv.UDFKeyVal = JSON.stringify(voucherKeyVal);
			} else {
				$scope.newDet.Attributes = "";
				$scope.newDet.UDFKeyVal = "";
			}
		});

		$http({
			method: 'POST',
			url: base_url + "Hospital/Transaction/SaveUpdateDischargeSlip",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.lastTranId = res.data.Data.RId;
				$scope.PrintRdl();
				$scope.ClearFields();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllDischargeSlip = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DischargeSlipList = [];
		$http({
			method: 'GET',
			url: base_url + "Hospital/Transaction/GetAllDischargeSlip",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DischargeSlipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.ShowSearch = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DischargeSlipList = [];
		$http({
			method: 'GET',
			url: base_url + "Hospital/Transaction/GetAllDischargeSlip",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DischargeSlipList = res.data.Data;
				$('#SearchModal').modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetDischargeSlipById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
	
		$http({
			method: 'POST',
			url: base_url + "Hospital/Transaction/getDischargeSlipById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data; 

				$scope.newDetPatient.PatientName = $scope.newDet.PatientName;
				$scope.newDetPatient.Age = $scope.newDet.AgeSex;
				$scope.newDetPatient.Department=$scope.newDet.Department ;
				$scope.newDetPatient.Address=$scope.newDet.Address ;
				$scope.newDetPatient.Ward=$scope.newDet.Ward ;
				$scope.newDetPatient.BedNo=$scope.newDet.BedNo ;
				$scope.newDetPatient.GuardianName=$scope.newDet.GuardianName ;
				$scope.newDetPatient.Relation=$scope.newDet.Relation ;
				$scope.newDetPatient.MobileNo=$scope.newDet.PhoneNo ;
				$scope.newDetPatient.InDate=$scope.newDet.DateAdmission ;
				$scope.newDetPatient.InPatientTranId=$scope.newDet.InPatientId ;
				$scope.newDetPatient.PatientId=$scope.newDet.PatientId ;

				$('#SearchModal').modal('hide');
				//$scope.GetPatientDetailById();
				$scope.newDet.Mode = 'Modify';

				if ($scope.newDet.DichargeSlipDate)
					$scope.newDet.DichargeSlipDateTMP = new Date($scope.newDet.DichargeSlipDate);
				if ($scope.newDet.NextFollowupDate)
					$scope.newDet.NextFollowupDate_TMP = new Date($scope.newDet.NextFollowupDate);

				if ($scope.newDet.NextFollowupTime)
					$scope.newDet.NextFollowupTime_TMP = new Date($scope.newDet.NextFollowupTime);
				else
					$scope.newDet.NextFollowupTime_TMP = null;
			
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelDischargeSlipById = function (refData) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.PatientName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					TranId: refData.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "Hospital/Transaction/DeleteById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllDischargeSlip();
					}
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};


	$scope.GetPatientDetailById = function () {

		if ($scope.newDet.TranId > 0)
			return;

		$scope.loadingstatus = "running";
		showPleaseWait();
		
		$http({
			method: 'GET',
			url: base_url + "Hospital/Transaction/GetPatientDetails?patientId=" + $scope.newDet.PatientNo + '&voucherId=14',
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
		  
				$scope.newDetPatient = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.GetDischargeSlipPrint = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: 1
		};
		$http({
			method: 'POST',
			url: base_url + "Hospital/Transaction/getDischargeSlipPrint",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDetDischargePrint = res.data.Data;


			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.getCompanyDetail = function () {		  
		$scope.comDet = {};
		GlobalServices.getCompanyDet().then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.comDet = res.data.Data;
				$scope.CompanyDetail = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	 
	$scope.GetAutoDischargeNo = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Hospital/Transaction/GetAutoDischargeNo",
			dataType: "json"

		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var vDet = res.data.Data;
				$scope.newDet.DischargeSlipNo = vDet.RId;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}
	$scope.PrintVoucher = function (tranId) {
		$scope.lastTranId = tranId;
		$scope.PrintRdl();
	}
	$scope.PrintRdl = function () {
		if ($scope.lastTranId > 0) {
			var TranId = $scope.lastTranId;


			$http({
				method: 'GET',
				url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=true",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					var templatesColl = res.data.Data;
					if (templatesColl && templatesColl.length > 0) {
						var templatesName = [];
						var sno = 1;
						angular.forEach(templatesColl, function (tc) {
							templatesName.push(sno + '-' + tc.ReportName);
							sno++;
						});

						var printDone = false;

						var rptTranId = 0;
						if (templatesColl.length == 1)
							rptTranId = templatesColl[0].RptTranId;
						else {
							Swal.fire({
								title: 'Report Templates For Print',
								input: 'select',
								inputOptions: templatesName,
								inputPlaceholder: 'Select a template',
								showCancelButton: true,
								inputValidator: (value) => {
									return new Promise((resolve) => {
										if (value >= 0) {
											resolve()
											rptTranId = templatesColl[value].RptTranId;

											printDone = true;
											if (rptTranId > 0) {

												document.body.style.cursor = 'wait';
												document.getElementById("frmRpt").src = '';
												document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0";
												document.body.style.cursor = 'default';
												$('#FrmPrintReport').modal('show');


											}
										} else {
											resolve('You need to select:)')
										}
									})
								}
							})
						}

						if (rptTranId > 0) {

							document.body.style.cursor = 'wait';
							document.getElementById("frmRpt").src = '';
							document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0";
							document.body.style.cursor = 'default';
							$('#FrmPrintReport').modal('show');

						}

					} else
						Swal.fire('No Templates found for print');
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});



		}
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
	$scope.Print = function () {
		$('#admitcard').printThis();
	}
});