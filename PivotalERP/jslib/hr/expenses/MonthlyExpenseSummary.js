app.controller('MonthlyExpensesSummaryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Monthly Expenses Summary';

	$scope.LoadData = function () {
		$('.select2').select2();

        $scope.CompanyDetail = [];
        $http({
            method: 'get',
            url: base_url + "HR/Master/GetCompanyDetail",
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
        $scope.newFilter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            EmployeeId: null
		};

        $scope.AgentColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetPeriodName();
	}

    $scope.GetPeriodName = function () {
        if (!$scope.newFilter.DateFromDet || !$scope.newFilter.DateToDet)
            return;

        var monthNames = [
            "Baishakh", "Jestha", "Aashadha", "Shrawan", "Bhadra", "Ashwin",
            "Kartik", "Mangsir", "Paush", "Magh", "Falgun", "Chaitra"
        ];

        var fromMonthNum = parseInt($scope.newFilter.DateFromDet.NM);
        var toMonthNum = parseInt($scope.newFilter.DateToDet.NM);
        var fromMonth = monthNames[fromMonthNum - 1];
        var toMonth = monthNames[toMonthNum - 1];

        var fromYear = $scope.newFilter.DateFromDet.NY;
        var toYear = $scope.newFilter.DateToDet.NY;

        // Build readable PeriodName
        if (fromYear === toYear) {
            if (fromMonth === toMonth)
                $scope.PeriodName = fromMonth + "-" + fromYear;
            else
                $scope.PeriodName = fromMonth + "-" + toMonth + " " + fromYear;
        } else {
            $scope.PeriodName = fromMonth + "-" + fromYear + " to " + toMonth + "-" + toYear;
        }
    };

    $scope.GetMonthlyExpenseSummary = function () {
        
        $scope.loadingstatus = "running";
        showPleaseWait();
        if (!$scope.newFilter.UserId) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            return;
        }
        var dateFrom = null;
        var dateTo = null;
        if ($scope.newFilter.DateFromDet && $scope.newFilter.DateFromDet.dateAD)
            dateFrom = $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.newFilter.DateToDet && $scope.newFilter.DateToDet.dateAD)
            dateTo = $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd');

        var para = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            EmployeeId: $scope.newFilter.UserId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Expenses/GetMonthlyExpenseSummary",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.printReport = function () {
        var printBtn = document.querySelector('.btn.btn-secondary.btn-light.btn-sm.ml-2');
        if (printBtn) printBtn.style.visibility = 'hidden';

        var tableWrapper = document.querySelector('.table-scroll-x-y');
        if (tableWrapper) tableWrapper.classList.remove('table-scroll-x-y');

        window.print();

        // Restore
        if (tableWrapper) tableWrapper.classList.add('table-scroll-x-y');
        if (printBtn) printBtn.style.visibility = 'visible';
    };

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        var file = item.ExpAttachment | item.ReciptImage;

        if (file && file.length > 0) {
            $scope.viewImg.ContentPath = file;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = file;
            $('#PersonalImg').modal('show');
        } else if (file && file.length > 0) {
            $scope.viewImg.ContentPath = file;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };


});