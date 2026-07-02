

app.controller('ChangePasswordController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Change Password';
	//OnClickDefault();
	$scope.LoadData = function () {
		
		$scope.confirmMSG = GlobalServices.getConfirmMSG();		

		$scope.newChangePassword = {			
			CurrentPassword: '',
			NewPassword: '',
			ConfirmPassword:'',
			Mode: 'Update'
		};
	
	};


	$scope.ClearChangePassword = function () {
		$scope.newChangePassword = {			
			CurrentPassword: '',
			NewPassword: '',
			ConfirmPassword: '',
			Mode: 'Update'
		};
	};




	$scope.IsValidChangePassword = function () {
		if ($scope.newChangePassword.CurrentPassword.isEmpty()) {
			Swal.fire('Please ! Enter Current Password');
			return false;
		}

		if ($scope.newChangePassword.NewPassword.isEmpty()) {
			Swal.fire('Please ! Enter New Password');
			return false;
		}
		if ($scope.newChangePassword.ConfirmPassword.isEmpty()) {
			Swal.fire('Please !  Confirm Password');
			return false;
		}

		if ($scope.newChangePassword.NewPassword != $scope.newChangePassword.ConfirmPassword) {
			Swal.fire('New Password and Confirm Password Does Not Match');
			return false;
        }

		return true;
	};
	

	$scope.SaveUpdateChangePassword = function () {
		if ($scope.IsValidChangePassword() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newChangePassword.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateChangePassword();
					}
				});
			} else
				$scope.CallSaveUpdateChangePassword();

		}
	};

	$scope.CallSaveUpdateChangePassword = function () {
		
		Swal.fire({
			title: 'Do you want to update password?',
			showCancelButton: true,
			confirmButtonText: 'Update',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					oldPwd: $scope.newChangePassword.CurrentPassword,
					newPwd: $scope.newChangePassword.NewPassword,
					rd: rdVal
				};
				$http({
					method: 'POST',
					url: base_url + "Setup/Security/UpdatePwd",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);

					if (res.data.IsSuccess == true) {
						if (rdVal && rdVal == 1) {
							document.location.href = base_url + "Home/LogOff";
						}
                    }
					

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

});