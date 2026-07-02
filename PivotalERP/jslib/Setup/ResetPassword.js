app.controller('ResetPasswordController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Reset Password';
	//OnClickDefault();
	$scope.LoadData = function () {

		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.newResetPassword = {
			ResetPasswordId: null,
			UserId: null,
			NewPassword: '',
			ConfirmPassword: '',
			Mode: 'Save'
		};

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

		//$scope.GetAllResetPasswordList();

	};


	$scope.ClearResetPassword = function () {
		$scope.newResetPassword = {
			ResetPasswordId: null,
			UserId: null,
			NewPassword: '',
			ConfirmPassword: '',
			Mode: 'Save'
		};
	};




	$scope.IsValidResetPassword = function () {		
		if ($scope.newResetPassword.NewPassword.isEmpty()) {
			Swal.fire('Please ! Enter New Password');
			return false;
		}
		if ($scope.newResetPassword.ConfirmPassword.isEmpty()) {
			Swal.fire('Please !  Confirm Password');
			return false;
		}

		if ($scope.newResetPassword.NewPassword!=$scope.newResetPassword.ConfirmPassword) {
			Swal.fire('New Password and Confirm Password Does Not Match');
			return false;
		}

		return true;
	};


	$scope.SaveUpdateResetPassword = function () {
		if ($scope.IsValidResetPassword() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newResetPassword.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateResetPassword();
					}
				});
			} else
				$scope.CallSaveUpdateResetPassword();

		}
	};

	$scope.CallSaveUpdateResetPassword = function () {
		
		Swal.fire({
			title: 'Do you want to update password of selected User?',
			showCancelButton: true,
			confirmButtonText: 'Update',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					uId: $scope.newResetPassword.UserId,
					newPwd: $scope.newResetPassword.NewPassword
				};
				$http({
					method: 'POST',
					url: base_url + "Setup/Security/UpdateUserPwd",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);

					if(res.data.IsSuccess==true)
						$scope.ClearResetPassword();

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

});