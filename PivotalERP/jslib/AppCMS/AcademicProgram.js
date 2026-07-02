app.controller('AcademicProgramController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Academic Programs';

	OnClickDefault();

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();

		$scope.currentPages = {
			AcademicProgram: 1

		};

		$scope.searchData = {
			AcademicProgram: ''

		};

		$scope.perPage = {
			AcademicProgram: GlobalServices.getPerPageRow()

		};

		$scope.newAcademicProgram = {
			AcademicProgramId: null,
			Title: '',
			OrderNo: 0,
			Description: '',
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};


		$scope.GetAllAcademicProgramList();

	}

	function OnClickDefault() {


		document.getElementById('notice-form').style.display = "none";


		document.getElementById('open-form-btn').onclick = function () {
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";
			$scope.ClearAcademicProgram();
		}
		document.getElementById('back-to-list').onclick = function () {
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
			$scope.ClearAcademicProgram();
		}

	}

	$scope.ClearAcademicProgram = function () {
		$timeout(function () {
			$scope.newAcademicProgram = {
				AcademicProgramId: null,
				Title: '',
				OrderNo: 0,
				Description: '',
				Content: '',
				Photo: null,
				PhotoPath: null,
				Mode: 'Save'
			};
		});

		
	}

	$scope.ClearAcademicProgramPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAcademicProgram.PhotoData = null;
				$scope.newAcademicProgram.Photo_TMP = [];
			});

		});

		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');

	};


	//************************* Services And Facilities *********************************

	$scope.IsValidAcademicProgram = function () {
		if ($scope.newAcademicProgram.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}


		return true;
	}

	$scope.SaveUpdateAcademicProgram = function () {
		if ($scope.IsValidAcademicProgram() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAcademicProgram.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAcademicProgram();
					}
				});
			} else
				$scope.CallSaveUpdateAcademicProgram();

		}
	};

	$scope.CallSaveUpdateAcademicProgram = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var photo = $scope.newAcademicProgram.Photo_TMP;
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveAcademicProgram",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
			
				if (data.stPhoto && data.stPhoto.length > 0)
					formData.append("photo", data.stPhoto[0]);



				return formData;
			},
			data: { jsonData: $scope.newAcademicProgram, stPhoto: photo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearAcademicProgram();
				$scope.GetAllAcademicProgramList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


		
	}

	$scope.GetAllAcademicProgramList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AcademicProgramList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllAcademicProgramList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AcademicProgramList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetAcademicProgramById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			AcademicProgramId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAcademicProgramById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAcademicProgram = res.data.Data;
				$scope.newAcademicProgram.Mode = 'Modify';

				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelAcademicProgramById = function (refData) {

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
					AcademicProgramId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelAcademicProgram",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAcademicProgramList();
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