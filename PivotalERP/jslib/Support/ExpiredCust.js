app.controller('expiredController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Ticket';
	
	$scope.LoadData = function () {

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {

                $scope.comDet = res.data.Data;

                $http({
                    method: 'GET',
                    url: base_url + "Support/Creation/GetDBCode",
                    dataType: "json"
                }).then(function (res1) {
                    if (res1.data.Data) {
                        $scope.comDet.CustomerCode = res1.data.Data;
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

     

		$scope.Splash = {};
		$http({
			method: 'GET',
			url: base_url + "Support/Creation/GetSplash",
			dataType: "json"
		}).then(function (res) {
			if (res.data.Data && res.data.Data.PendingDay<=0) {
				$scope.Splash = res.data.Data;
				$http({
					method: 'GET',
					url: base_url + "Support/Creation/GenFonepayQR",
					dataType: "json"
				}).then(function (res1) {
					if (res1.data.IsSuccess) {
						var qrDet = res1.data.Data;
						if (qrDet.QRImage) {
							$scope.connectFonepay(qrDet);
							$scope.Splash.QRImage = qrDet.QRImage;
						}
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

    var fonepayWS = null;
    $scope.connectFonepay = function (reqData) {
        // create a new websocket and connect     

        var websocket = new WebSocketEx(reqData.thirdpartyQrWebSocketUrl, '', function () {
            //messageBoard.append('* Connection open<br/>');
            fonepayWS = websocket;
            // ws.binaryType = "arraybuffer";
            // ws.send('{ "MSG":"Test Server" }');
        }, function (evt) {
            //messageBoard.append('* Connection closed<br/>');
            console.log('Unable To Connect With Print Server. Connection closed.');
            //alert('Unable To Connect With Print Server. Connection closed.');
        }, function (evt) {
            // On MSG Received
            console.log(evt);

            if (evt.data) {
                var res1 = JSON.parse(evt.data);
                if (res1.transactionStatus && res1.transactionStatus.length > 0) {
                    var res2 = JSON.parse(res1.transactionStatus);
                    if (res2.paymentSuccess && res2.paymentSuccess == true) {

                        if (res2.productNumber == reqData.requestId) {

                            $scope.loadingstatus = "running";
                            showPleaseWait();

                            var resData = {
                                Amount: res2.amount,
                                Response: evt.data,
                                TransactionNo: res2.traceId,
                                DeviceId: res2.productNumber
                            };

                            $http({
                                method: 'POST',
                                url: base_url + "Support/Creation/SaveReceipt",
                                dataType: "json",
                                data: JSON.stringify(resData)
                            }).then(function (resRec) {
                                $scope.loadingstatus = "stop";
                                hidePleaseWait();

                                if (resRec.data.Data && resRec.data.Data.IsSuccess == true) {
                                    document.location.href = base_url + "Home/LogOff";
                                }
                                
                            }, function (reason1) {

                                $scope.loadingstatus = "stop";
                                hidePleaseWait();
                                Swal.fire('Failed' + reason1);
                            });

                        }

                    }
                }

            }

        }, function (evt) {
            //On Error
            console.log(evt);

        });
    }
});