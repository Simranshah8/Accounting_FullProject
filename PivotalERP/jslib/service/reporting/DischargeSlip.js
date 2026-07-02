app.controller('DischargeSlipController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'DischargeSlip ';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		$scope.perPageColl = GlobalServices.getPerPageList();
		

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
		
		$scope.newDet.InvestigationDetailsColl.push({});
		$scope.newDet.MedicationDetailsColl.push({});
		$scope.GetDischargeSlipPrint();
		$scope.getCompanyDetail();
		$scope.GetAllDischargeSlip();
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
		$scope.newDet.InvestigationDetailsColl.push({});
		$scope.newDet.MedicationDetailsColl.push({});

		
	}


	$scope.AddInvestigation = function (ind) {
		if ($scope.newDet.InvestigationDetailsColl) {
			if ($scope.newDet.InvestigationDetailsColl.length > ind + 1) {
				$scope.newDet.InvestigationDetailsColl.splice(ind + 1, 0, {
					Remarks: ''
				})
			} else {
				$scope.newDet.InvestigationDetailsColl.push({
					Remarks: ''
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
					Remarks: ''
				})
			} else {
				$scope.newDet.MedicationDetailsColl.push({
					Remarks: ''
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
		$scope.newDet.AgeSex = $scope.newDetPatient.AgeSex;
		$scope.newDet.Department = $scope.newDetPatient.Department;
		$scope.newDet.Address = $scope.newDetPatient.Address;
		$scope.newDet.Ward = $scope.newDetPatient.Ward;
		$scope.newDet.BedNo = $scope.newDetPatient.BedNo;
		$scope.newDet.GuardianName = $scope.newDetPatient.GuardianName;
		$scope.newDet.Relation = $scope.newDetPatient.Relation;
		$scope.newDet.PhoneNo = $scope.newDetPatient.PhoneNo;
		$scope.newDet.DateAdmission = $scope.newDetPatient.DateAdmission;
		$http({
			method: 'POST',
			url: base_url + "Services/Creation/SaveUpdateDischargeSlip",
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
				$scope.GetAutoDischargeNo();
				$scope.ClearFields();
				//$scope.GetAllDischargeSlip();
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
			url: base_url + "Services/Creation/GetAllDischargeSlip",
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

	$scope.GetDischargeSlipById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
	
		$http({
			method: 'POST',
			url: base_url + "Services/Creation/getDischargeSlipById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				if ($scope.newDet.DichargeSlipDate)
					$scope.newDet.DichargeSlipDateTMP = new Date($scope.newDet.DichargeSlipDate);
				if ($scope.newDet.NextFollowupDate)
					$scope.newDet.NextFollowupDate_TMP = new Date($scope.newDet.NextFollowupDate);

				if ($scope.newDet.NextFollowupTime)
					$scope.newDet.NextFollowupTime_TMP = new Date($scope.newDet.NextFollowupTime);
				else
					$scope.newDet.NextFollowupTime_TMP = null;

				$('#SearchModal').modal('hide');
				$scope.GetPatientDetailById();
				$scope.newDet.Mode = 'Modify';
			
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
					url: base_url + "Services/Creation/DeleteById",
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


	$scope.GetPatientDetailById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			PatientId: 1
		};
		$http({
			method: 'POST',
			url: base_url + "Services/Creation/getPatientDetailById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				if ($scope.newDet.DichargeSlipDate)
					$scope.newDet.DichargeSlipDateTMP = new Date($scope.newDet.DichargeSlipDate);
				if ($scope.newDet.NextFollowupDate)
					$scope.newDet.NextFollowupDate_TMP = new Date($scope.newDet.NextFollowupDate);

				if ($scope.newDet.NextFollowupTime)
					$scope.newDet.NextFollowupTime_TMP = new Date($scope.newDet.NextFollowupTime);
				else
					$scope.newDet.NextFollowupTime_TMP = null;

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
			url: base_url + "Services/Creation/getDischargeSlipPrint",
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
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.CompanyDetail = [];
		$http({
			method: 'get',
			url: base_url + "Payroll/Master/GetCompanyDetail",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyDetail = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
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
			url: base_url + "Services/Creation/GetAutoDischargeNo",
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



	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
	$scope.Print = function () {
		$('#admitcard').printThis();
	}
});