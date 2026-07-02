
app.controller('SecurityConsoleController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Entity';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowEntity: '',
			SecurityConsole: '',
		};

		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			SecurityConsole: 1
		}; 
		$scope.perPage = {
			SecurityConsole: 40,
		};

		$scope.newAllowEntity = {
			AllowEntityId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			Full: false,
			View: false,
			Add: false,
			Modify: false,
			Delete: false,
			Print: false,
			Export: false,
			UnPost:false,
		};

		$scope.AllowEntityList = [];
		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UserGroupList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserGroupList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserGroupList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//$scope.GetAllAllowEntityList();

	}

	$scope.ClearAllowEntity = function () {
		$scope.newAllowEntity = {
			AllowEntityId: null,

		};
	}


	//************************* AllowEntity *********************************

	$scope.CheckAllFull = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Full = $scope.newAllowEntity.Full;
		});
	}
	$scope.CheckAllView = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.View = $scope.newAllowEntity.View;
		});
	}
	$scope.CheckAllAdd = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Add = $scope.newAllowEntity.Add;
		});
	}
	$scope.CheckAllModify = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Modify = $scope.newAllowEntity.Modify;
		});
	}
	$scope.CheckAllDelete = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Delete = $scope.newAllowEntity.Delete;
		});
	}
	$scope.CheckAllPrint = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Print = $scope.newAllowEntity.Print;
		});
	}
	$scope.CheckAllExport = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Export = $scope.newAllowEntity.Export;
		});
	}
	$scope.CheckAllPost = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Post = $scope.newAllowEntity.Post;
		});
	}
	$scope.CheckAllUnPost = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.UnPost = $scope.newAllowEntity.UnPost;
		});
	}
	$scope.CheckAllCancel = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Cancel = $scope.newAllowEntity.Cancel;
		});
	}

	$scope.CheckAllModifyAfterPost = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.ModifyAfterPost = $scope.newAllowEntity.ModifyAfterPost;
		});
	}
	$scope.CheckAllCancelAfterPost = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.CancelAfterPost = $scope.newAllowEntity.CancelAfterPost;
		});
	}
	$scope.CheckAllVerification = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Verification = $scope.newAllowEntity.Verification;
		});
	}
	$scope.IsValidAllowEntity = function () {

		if (!$scope.AllowEntityList || $scope.AllowEntityList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}

	$scope.GetAllowEntityList = function (forType) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.AllowEntityList = [];

		var para = {
			forUserId: null,
			forGroupId: null
		};

		if (forType == 1)
			para.forUserId = $scope.newAllowEntity.UserId;
		else
			para.forGroupId = $scope.newAllowEntity.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetSecurityConsole",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data)
			{
				$scope.AllowEntityList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
 
	$scope.SaveUpdateAllowEntity = function ()
	{
		if ($scope.AllowEntityList && $scope.AllowEntityList.length > 0)
		{
			$scope.loadingstatus = "running";
			showPleaseWait();

			var forId = 0;
			var forType = $scope.newAllowEntity.UserWise;

			if (forType == 1)
				forId = $scope.newAllowEntity.UserId;
			else
				forId = $scope.newAllowEntity.GroupId;


			$http({
				method: 'POST',
				url: base_url + "Setup/Security/SaveSecurityConsole",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					formData.append("forId", data.id);
					formData.append("forType", data.forT);
					formData.append("jsonData", angular.toJson(data.jsonData));

					return formData;
				},
				data: { jsonData: $scope.AllowEntityList, id: forId, forT: $scope.newAllowEntity.UserWise }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				Swal.fire(res.data.ResponseMSG);

				if (res.data.IsSuccess == true) {
					$scope.newAllowEntity.Full = false;
					$scope.newAllowEntity.Add = false;
					$scope.newAllowEntity.Modify = false;
					$scope.newAllowEntity.Delete = false;
					$scope.newAllowEntity.Cancel = false;
					$scope.newAllowEntity.CancelAfterPost = false;
					$scope.newAllowEntity.ModifyAfterPost = false;
					$scope.newAllowEntity.Verification = false;
					$scope.newAllowEntity.Export = false;
					$scope.newAllowEntity.UnPost = false;
                }

			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});
        }
		 
	}

});


app.controller('entityButtoneDisEnbController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Entity Wise Disabled Enabled Button';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowEntity: '',

		};

		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AllowEntity: 1
		};
		$scope.perPage = {
			AllowEntity: 40,
		};
		$scope.newAllowEntity = {
			AllowEntityId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			Full: false,
			View: false,
			Add: false,
			Modify: false,
			Delete: false,
			Print: false,
			Export: false
		};

		$scope.GetAllowEntityList();

	}

	$scope.ClearAllowEntity = function () {
		$scope.newAllowEntity = {
			AllowEntityId: null,

		};
	}


	//************************* AllowEntity *********************************

	 
	$scope.CheckAllAdd = function () {
		var tmpData = $filter('filter')($scope.EntityColl, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Accept = $scope.newAllowEntity.Accept;
		});
	}
	$scope.CheckAllModify = function () {
		var tmpData = $filter('filter')($scope.EntityColl, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Modify = $scope.newAllowEntity.Modify;
		});
	}
	$scope.CheckAllDelete = function () {
		var tmpData = $filter('filter')($scope.EntityColl, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Delete = $scope.newAllowEntity.Delete;
		});
	}
	$scope.CheckAllPrint = function () {
		var tmpData = $filter('filter')($scope.EntityColl, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.IRD = $scope.newAllowEntity.IRD;
		});
	}
	$scope.CheckAllExport = function () {
		var tmpData = $filter('filter')($scope.EntityColl, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Hidden = $scope.newAllowEntity.Hidden;
		});
	} 
	$scope.IsValidAllowEntity = function () {

		if (!$scope.EntityColl || $scope.EntityColl.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}

	$scope.GetAllowEntityList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EntityColl = [];

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetEntityEnableDisableButton",
			dataType: "json",
			//data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data)
			{
				var allowList = mx(res.data.Data.dataColl);
				$scope.EntityColl = res.data.Data.EntityColl;

				angular.forEach($scope.EntityColl, function (ent) {
					ent.EntityId = ent.id;
					var fe = allowList.firstOrDefault(p1 => p1.EntityId == ent.EntityId);
					if (fe) {
						ent.Accept = fe.Accept;
						ent.Delete = fe.Delete;
						ent.Modify = fe.Modify;
						ent.IRD = fe.IRD;
						ent.Hidden = fe.Hidden;
					} else {
						ent.Accept = false;
						ent.Delete = false;
						ent.Modify = false;
						ent.IRD = false;
						ent.Hidden = false;
                    }
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.SaveUpdateEntityBtnDisabled = function () {
		if ($scope.EntityColl && $scope.EntityColl.length > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			 

			$http({
				method: 'POST',
				url: base_url + "Setup/Security/SaveEntityEnableDisableButton",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
				 
					formData.append("jsonData", angular.toJson(data.jsonData));
					formData.append("otp", $scope.searchData.OTP);

					return formData;
				},
				data: { jsonData: $scope.EntityColl  }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				Swal.fire(res.data.ResponseMSG);

				if (res.data.IsSuccess == true) {
					$scope.newAllowEntity.Full = false;
					$scope.newAllowEntity.Add = false;
					$scope.newAllowEntity.Modify = false;
					$scope.newAllowEntity.Delete = false;
					$scope.newAllowEntity.Cancel = false;
					$scope.newAllowEntity.CancelAfterPost = false;
					$scope.newAllowEntity.ModifyAfterPost = false;
					$scope.newAllowEntity.Verification = false;
					$scope.newAllowEntity.Export = false;
				}

			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});
		}

	}

	$scope.GenerateOTP = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmailId: $scope.searchData.EmailId			
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GenerateOTP_EDE",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}
});