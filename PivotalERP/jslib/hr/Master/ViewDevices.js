app.controller('VDeviceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Add Device';

	LoadData();

	function LoadData() {

		$scope.DevicePort = 7795;
		$scope.UseSSL = false;

		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.DeviceCompanyColl = [{ id: 1, text: 'Real Time' }, { id: 2, text: 'Degicom' }];

		$scope.currentPages = {
			Device: 1,
		};

		$scope.searchData = {
			Device: '',
			CardNo: ''
		};

		$scope.perPage = {
			//Device: GlobalServices.getPerPageRow(),
			Device: 100,
		};

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.newDevice = {
			DeviceId: null,
			Name: '',
			SerialNo: '',
			Location: '',
			DeviceCompanyId: null,
			IpAddress: '',
			BranchId: null,
			DepartmentId: null,
			Mode: 'Save'
		};

		$scope.newDelete = {};

		//$scope.GetAllDeviceList();
	}


	$scope.ClearDevice = function () {

		$timeout(function () {
			$scope.newDevice = {
				DeviceId: null,
				Name: '',
				SerialNo: '',
				Location: '',
				DeviceCompanyId: null,
				IpAddress: '',
				BranchId: null,
				DepartmentId: null,
				Mode: 'Save'
			};

		});

	}


	OnClickDefault();

	function OnClickDefault() {
		document.getElementById('eyetab').style.display = "none";

		document.getElementById('backbtn').onclick = function () {
			document.getElementById('eyetab').style.display = "none";
			document.getElementById('tableone').style.display = "block";
		}
	}

	$scope.toggleAllDevices = function (isChecked) {
		$scope.DeviceList.forEach(device => device.IsSelected = isChecked);
	};

	$scope.showSelectDeviceMessage = function () {
		// Check if at least one device is selected
		const isAnyDeviceSelected = $scope.DeviceList.some(device => device.IsSelected);

		if (isAnyDeviceSelected) {
			$('#UploadCard').modal('show');
		} else {
			Swal.fire('To proceed, please select the devices first, then upload the card numbers.');
		}
	};

	$scope.showDeleteDeviceMessage = function () {
		// Check if at least one device is selected
		const isAnyDeviceSelected = $scope.DeviceList.some(device => device.IsSelected);

		if (isAnyDeviceSelected) {
			$('#DeleteCard').modal('show');
		} else {
			Swal.fire('To proceed, please select the devices first, then upload the card numbers.');
		}
	};

	$scope.IsValidDevice = function () {
		if ($scope.newDevice.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateDevice = function () {
		if ($scope.IsValidDevice() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDevice.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateUnitOfWork();
					}
				});
			} else
				$scope.CallSaveUpdateUnitOfWork();
		}
	};

	$scope.CallSaveUpdateUnitOfWork = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveDevices",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDevice }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearDevice();
				$scope.GetAllDeviceList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllDeviceList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DeviceList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllDevices",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DeviceList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetDeviceById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DeviceId: refData.DeviceId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/getDevicesById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDevice = res.data.Data;
				$scope.newDevice.Mode = 'Modify';
				$('#custom-tabs-four-profile-tab').tab('show');


			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.GetDeviceEnrollmentById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DeviceId: refData.DeviceId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/getDevicesById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				$scope.newDevice.Mode = 'Modify';
				document.getElementById('eyetab').style.display = "block";
				document.getElementById('tableone').style.display = "none";


			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.DelDeviceById = function (refData) {
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
					DeviceId: refData.DeviceId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Master/DeleteDevices",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllDeviceList();
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



	var ws;

	$scope.connectSocketServer = function () {
		// create a new websocket and connect     

		var url = 'WS';
		if ($scope.UseSSL && $scope.UseSSL == true)
			url = 'WSS';

		var websocket = new WebSocketEx(url + '://202.51.3.113:' + $scope.DevicePort, '', function () {
			//var websocket = new WebSocketEx(url + '://172.16.7.2:' + $scope.DevicePort, '', function () {
			//messageBoard.append('* Connection open<br/>');
			ws = websocket;
			// ws.send('{ "MSG":"Test Server" }');
		}, function (evt) {
			//messageBoard.append('* Connection closed<br/>');
			Swal.fire('Unable To Connect With Server. Connection closed.');
		}, function (evt) {
			// On MSG Received
			$scope.$apply(
				function () {
					$scope.loadingstatus = 'stop';
				});

			var res = JSON.parse(evt.data);

			$scope.$apply(
				function () {
					if (res.Status && res.SerialNo) {
						angular.forEach($scope.DeviceList, function (machine) {

							if (machine.MachineSerialNo == res.SerialNo) {
								machine.Status = res.Status;
							}
						});

					} else
						alert(res.ResponseMSG);

				});



		}, function (evt) {
			//On Error

			$scope.$apply(
				function () {
					$scope.loadingstatus = 'stop';
				});
			var res = JSON.parse(evt.data);


			if (res.Status && res.SerialNo) {
				angular.forEach($scope.DeviceList, function (machine) {

					if (machine.MachineSerialNo == res.SerialNo) {
						machine.Status = res.Status;
					}
				});

			} else
				alert(res.ResponseMSG);

		});
	}

	$scope.checkDeviceStatus = function () {

		$scope.loadingstatus = 'running';

		if (!ws || ws == undefined)
			$scope.connectSocketServer();

		angular.forEach($scope.DeviceList, function (machine) {
			machine.Status = "";
		});

		$timeout(function () {

			if (ws && ws != undefined) {
				angular.forEach($scope.DeviceList, function (machine) {

					var beData = {
						cmd: "getdevstatus",
						serialNo: machine.MachineSerialNo,
						reg: true,
						//deviceCompany: 
						deviceCompany: machine.DeviceCompanyId
					};
					ws.send(JSON.stringify(beData));

				});
			}

		});


	};

	$scope.doDeviceAction = function (machine, actName) {

		if (machine.Status == "Connected") {

		} else {
			Swal.fire("Device not connected");
			return;
		}

		if (!ws)
			return;

		Swal.fire({
			title: 'Are you sure to perform selected action ' + actName,
			showCancelButton: true,
			confirmButtonText: 'Do It',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {

				var companyId = machine.DeviceCompanyId;
				//companyId = 1;

				if (actName == 'restart') {

					$scope.loadingstatus = 'running';

					var beData = {
						cmd: "reboot",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));


				}
				else if (actName == "cleanuser") {
					var beData = {
						cmd: "cleanuser",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));
				}
				else if (actName == "getalllog") {
					var beData = {
						cmd: "getalllog",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));
				}
				else if (actName == "getnewlog") {
					var beData = {
						cmd: "getnewlog",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));
				}
				else if (actName == "cleanlog") {
					var beData = {
						cmd: "cleanlog",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));
				}
				else if (actName == "cleanadmin") {
					var beData = {
						cmd: "cleanadmin",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));
				}
				else if (actName == "opendoor") {
					var beData = {
						cmd: "opendoor",
						serialNo: machine.MachineSerialNo,
						reg: true,
						deviceCompany: companyId
					};
					ws.send(JSON.stringify(beData));
				}
				else {

				}
			}
		});


	};

	$scope.UploadCardno = function () {

		if (!ws) {
			Swal.fire('Device Not Connected');
			return;
		}



		var cardNos = $scope.newUpload.CardNo;
		if (cardNos && cardNos.length > 0) {

			var cardNoColl = [];
			var qry = mx(cardNos);
			if (qry.contains('-')) {

				var strColl = cardNos.split('-');
				var startNo = parseInt(strColl[0]);
				var endNo = parseInt(strColl[1]);

				for (var i = startNo; i <= endNo; i++) {
					cardNoColl.push(i);
				}

			}
			else if (qry.contains(',')) {
				cardNos.split(',').forEach(function (cd) {
					cardNoColl.push(cd);
				});
			}
			else {
				cardNoColl.push(cardNos);
			}


			$scope.DeviceList.forEach(function (dv) {
				var companyId = dv.DeviceCompanyId;
				if (dv.IsSelected == true) {

					if (dv.Status == "Connected") {

						var beData = {
							cmd: "setcard",
							serialNo: dv.MachineSerialNo,
							reg: true,
							deviceCompany: companyId,
							cardno: cardNoColl.toString(),
						};
						ws.send(JSON.stringify(beData));

					}

				}
			});
			$('#UploadCard').modal('hide');

		}
	}

	$scope.DeleteCardno = function () {

		if (!ws) {
			Swal.fire('Device Not Connected');
			return;
		}



		var cardNos = $scope.newDelete.CardNo;
		if (cardNos && cardNos.length > 0) {

			var cardNoColl = [];
			var qry = mx(cardNos);
			if (qry.contains('-')) {

				var strColl = cardNos.split('-');
				var startNo = parseInt(strColl[0]);
				var endNo = parseInt(strColl[1]);

				for (var i = startNo; i <= endNo; i++) {
					cardNoColl.push(i);
				}

			}
			else if (qry.contains(',')) {
				cardNos.split(',').forEach(function (cd) {
					cardNoColl.push(cd);
				});
			}
			else {
				cardNoColl.push(cardNos);
			}


			$scope.DeviceList.forEach(function (dv) {
				var companyId = dv.DeviceCompanyId;
				if (dv.IsSelected == true) {

					if (dv.Status == "Connected") {

						var beData = {
							cmd: "deletecard",
							serialNo: dv.MachineSerialNo,
							reg: true,
							deviceCompany: companyId,
							empidcoll: cardNoColl.toString(),
						};
						ws.send(JSON.stringify(beData));

					}

				}
			});
			$('#DeleteCard').modal('hide');

		}
	}

});