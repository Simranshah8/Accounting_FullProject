app.controller('ExecutiveMemberController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Executive Member';

	OnClickDefault();

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		
		$scope.currentPages = {
			ExecutiveMember: 1

		};

		$scope.searchData = {
			ExecutiveMember: ''

		};

		$scope.perPage = {
			ExecutiveMember: GlobalServices.getPerPageRow()

		};

		$scope.newExecutiveMember = {
			ExecutiveMemberId: null,
			FullName: '',
			Designation: '',
			Contact: '',
			Email: '',
			Message:'',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};


		$scope.GetAllExecutiveMemberList();

	}

	function OnClickDefault() {


		document.getElementById('notice-form').style.display = "none";


		document.getElementById('open-form-btn').onclick = function () {
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";
			$scope.ClearExecutiveMember();
		}
		document.getElementById('back-to-list').onclick = function () {
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
			$scope.ClearExecutiveMember();
		}

	}

	$scope.ClearExecutiveMember = function () {
		$scope.newExecutiveMember = {
			ExecutiveMemberId: null,
			FullName: '',
			Designation: '',
			Contact: '',
			Email: '',
			Message: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
	}

	$scope.ClearExecutiveMemberPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newExecutiveMember.PhotoData = null;
				$scope.newExecutiveMember.Photo_TMP = [];
			});

		});

		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');

	};


	//************************* Executive Member *********************************

	$scope.IsValidExecutiveMember = function () {
		if ($scope.newExecutiveMember.FullName.isEmpty()) {
			Swal.fire('Please ! Enter FullName');
			return false;
		}


		return true;
	}

	$scope.SaveUpdateExecutiveMember = function () {
		if ($scope.IsValidExecutiveMember() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newExecutiveMember.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateExecutiveMember();
					}
				});
			} else
				$scope.CallSaveUpdateExecutiveMember();

		}
	};

	$scope.CallSaveUpdateExecutiveMember = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var photo = $scope.newExecutiveMember.Photo_TMP;
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveExecutiveMember",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.stPhoto && data.stPhoto.length > 0)
					formData.append("photo", data.stPhoto[0]);



				return formData;
			},
			data: { jsonData: $scope.newExecutiveMember, stPhoto: photo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearExecutiveMember();
				$scope.GetAllExecutiveMemberList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	
	}

	$scope.GetAllExecutiveMemberList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ExecutiveMemberList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllExecutiveMemberList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ExecutiveMemberList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetExecutiveMemberById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			ExecutiveMemberId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetExecutiveMemberById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newExecutiveMember = res.data.Data;
				$scope.newExecutiveMember.Mode = 'Modify';

				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelExecutiveMemberById = function (refData) {

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
					ExecutiveMemberId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelExecutiveMember",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllExecutiveMemberList();
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