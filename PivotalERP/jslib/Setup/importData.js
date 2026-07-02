
app.controller('importDataController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Branch';

	$scope.LoadData = function () {
		$('.select2').select2();

		$scope.EntityColl = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetImportEntityList",
			dataType: "json"
		}).then(function (res) {		
			var eColl = res.data.Data;
			angular.forEach(eColl, function (e) {
				if (e.text.toString().includes('UPDATE_')) {
					e.IsUpdate = true;
				} else
					e.IsUpdate = false;

				$scope.EntityColl.push(e);
			});

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UpdateByColumns = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetUpdateByColumn",
			dataType: "json"
		}).then(function (res) {
			$scope.UpdateByColumns = res.data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ImportData = {
			EntityId: 0,
			Files_TMP:null
		};	

		$scope.SelectedPropertiesColl = [];
		$scope.SelectedPropertiesColl.push({
			PropertyName: '',
			Include: true
		});
	}
	$scope.addrow = function (ind) {

		if (ind + 1 == $scope.SelectedPropertiesColl.length) {
			$scope.SelectedPropertiesColl.push({
				PropertyName: '',
				Include: true
			});
		}

	};
	$scope.delete = function (val) {

		if ($scope.SelectedPropertiesColl.length > 1)
			$scope.SelectedPropertiesColl.splice(val, 1);
	};
	$scope.UploadToSrv = function () {

		if ($scope.ImportData.Files_TMP && $scope.ImportData.Files_TMP.length > 0) {

			$scope.SelectedFile = null;
			$scope.FilePath = null;
			$scope.SheetColl = [];
			$scope.SelectedSheet = null;
			$scope.PropertiesColl = [];
			$scope.ColumnColl = [];
			$scope.loadingstatus = "running";
			showPleaseWait();

			$http({
				method: 'POST',
				url: base_url + "Setup/Security/SaveImportDataExcelFile",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					//formData.append("jsonData", angular.toJson(data.jsonData));

					formData.append("file0", data.files);

					return formData;
				},
				data: { files: $scope.ImportData.Files_TMP[0] }
			}).then(function (res) {

				hidePleaseWait();
				$scope.loadingstatus = "stop";
				var data = res.data;
				if (data.IsSuccess) {

					$scope.FilePath = data.FilePath;
					$scope.SheetColl = data.SheetColl;

					if($scope.ImportData.SelectedEntity.IsUpdate==true)
						$('#UpdateNewExcel').modal('show');
					else
						$('#AddNewExcel').modal('show');

				} else {
					Swal.fire(data.ResponseMSG);
				}

			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});

			
        }
		
	};

	$scope.LoadProperties = function () {

		$scope.loadingstatus = "running";

		$scope.PropertiesColl = [];
		$scope.ColumnColl = [];

		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			path: $scope.FilePath,
			table: $scope.SelectedSheet,
			EntityId: $scope.ImportData.SelectedEntity.id
		};
		$http.get(base_url + "Setup/Security/LoadAllColumnsFromSheet?path=" + para.path + "&table=" + para.table + "&EntityId=" + para.EntityId).then(
			function (res)
			{
				hidePleaseWait();
				$scope.loadingstatus = "stop";

				if (res.data.IsSuccess) {
					var colQry = mx(res.data.ColumnColl);
					angular.forEach(res.data.PropertiesColl, function (pr) {

						if (pr != "ResponseMSG" && pr != "IsSuccess" && pr != "CUserId") {

							var findCol = colQry.firstOrDefault(p1 => p1.Name == pr);
							var properDet =
							{
								PropertyName: pr,
								Name: '',
								DefaultValue: '',
								Id: (findCol ? findCol.Id : -1)
							};

							$scope.PropertiesColl.push(properDet);
						}
					})

					$scope.ColumnColl = res.data.ColumnColl;

				} else {
					alert(res.data.ResponseMSG);
				}

				$scope.loadingstatus = 'stop';
			}
			, function (reason) {
				$scope.loadingstatus = 'stop';
				alert('Failed: ' + reason);
			}
		);

	};

	$scope.ImportDataExcel = function () {

		if (!$scope.FilePath || !$scope.SelectedSheet || !$scope.ImportData.SelectedEntity)
			return;

		if (!$scope.PropertiesColl || $scope.PropertiesColl.length == 0)
			return;

		var para = {
			path: $scope.FilePath,
			table: $scope.SelectedSheet,
			EntityId: $scope.ImportData.SelectedEntity.id
		};

		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: "post",
			url: base_url + "Setup/Security/FinalImportData?path=" + para.path + "&table=" + para.table + "&EntityId=" + para.EntityId + "&UpdateBy=''",
			data: JSON.stringify($scope.PropertiesColl),
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			alert(res.data.ResponseMSG);

			if (res.data.IsSuccess) {
				$scope.ClearFields();
				$('#AddNewExcel').modal('hide');
			}

		}, function (errormessage) {
			$scope.loadingstatus = 'stop';
			alert('Unable to Store data. pls try again.' + errormessage.responseText);
		});
	};

	$scope.UpdateDataExcel = function () {

		if (!$scope.FilePath || !$scope.SelectedSheet || !$scope.ImportData.SelectedEntity || !$scope.ImportData.UpdateBy)
			return;

		if (!$scope.PropertiesColl || $scope.PropertiesColl.length == 0)
			return;

		if (!$scope.SelectedPropertiesColl || $scope.SelectedPropertiesColl.length == 0)
			return;

		var para = {
			path: $scope.FilePath,
			table: $scope.SelectedSheet,
			EntityId: $scope.ImportData.SelectedEntity.id,
			UpdateBy: $scope.ImportData.UpdateBy
		};

		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: "post",
			url: base_url + "Setup/Security/FinalImportData?path=" + para.path + "&table=" + para.table + "&EntityId=" + para.EntityId+"&UpdateBy="+para.UpdateBy,
			data: JSON.stringify($scope.SelectedPropertiesColl),
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			alert(res.data.ResponseMSG);

			if (res.data.IsSuccess) {
				$scope.ClearFields();
				$('#AddNewExcel').modal('hide');
			}

		}, function (errormessage) {
			$scope.loadingstatus = 'stop';
			alert('Unable to Store data. pls try again.' + errormessage.responseText);
		});
	};

	$scope.ClearFields = function () {
		$scope.loadingstatus = "running";

		$('#documents').val('');

		$scope.ImportData = {
			EntityId: 0,
			Files_TMP: null
		};
		
		$scope.SelectedFile = null;
		$scope.FilePath = null;
		$scope.SheetColl = [];
		$scope.SelectedSheet = null;
		$scope.SelectedEntityId = null;

		$scope.PropertiesColl = [];
		$scope.ColumnColl = [];
		$scope.loadingstatus = "stop";
	}


	//************************* AllowBranch *********************************

	$scope.IsValidAllowBranch = function () {
		if ($scope.newAllowBranch.UserId.isEmpty()) {
			Swal.fire('Please ! Select User');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateAllowBranch = function () {
		if ($scope.IsValidAllowBranch() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowBranch.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowBranch();
					}
				});
			} else
				$scope.CallSaveUpdateAllowBranch();

		}
	};

	$scope.CallSaveUpdateAllowBranch = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Setup/Setup/SaveAllowBranch",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newAllowBranch }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearAllowBranch();
				$scope.GetAllAllowBranchList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});



	}

	$scope.GetAllAllowBranchList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AllowBranchList = [];

		$http({
			method: 'POST',
			url: base_url + "Setup/Setup/GetAllAllowBranchList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowBranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetAllowBranchById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			AllowBranchId: refData.AllowBranchId
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Setup/GetAllowBranchById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAllowBranch = res.data.Data;
				$scope.newAllowBranch.Mode = 'Modify';

				document.getElementById('author-section').style.display = "none";
				document.getElementById('author-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelAllowBranchById = function (refData) {

		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					AllowBranchId: refData.AllowBranchId
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/Setup/DelAllowBranch",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAllowBranchList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});

app.controller('GlobalActionController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Global Action';

	$scope.LoadData = function () {
		$('.select2').select2();

		$scope.BranchColl = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllBranchListForEntry",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.CostClassColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetCostClassForEntry",
			dataType: "json"
		}).then(function (res1) {
			if (res1.data.IsSuccess && res1.data.Data) {
				$scope.CostClassColl = res1.data.Data;
				 
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.VoucherTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetVoucherTypes",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VoucherTypeList = res.data.Data;
			}
			else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ActionTypeColl = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetGlobalActionType",
			dataType: "json",			
		}).then(function (res) {			
			if (res.data.IsSuccess) {
				$scope.ActionTypeColl = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.beData = {
			ActionType: 0,
			EmailId: '',
			OTP: '',
			BranchId: null,
			CostClassId:null
		};
	}
	 

	$scope.PerformAction = function () {

		Swal.fire({
			title: 'Do you want to perform the selected action ? after execute action will not revert.',
			showCancelButton: true,
			confirmButtonText: 'Yes',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				 
				$scope.loadingstatus = "running";
				showPleaseWait();
				$http({
					method: 'POST',
					url: base_url + "Setup/Security/SaveGlobalAction",
					dataType: "json",
					data: JSON.stringify($scope.beData)
				}).then(function (res) {
					$scope.loadingstatus = "stop";
					hidePleaseWait();
					Swal.fire(res.data.ResponseMSG);
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
				 
			}
		});	
	};

	$scope.GenerateOTP = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmailId: $scope.beData.EmailId,
			ActionType: $scope.beData.ActionType
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GenerateOTP_GA",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
    }


});