//"use strict";

//agGrid.initialiseAgGridWithAngular1(angular);

app.controller('commonDashboardController', function ($scope, $http, companyDet) {
    LoadData();

    var brandChart = null;

    $scope.OutStandings = {};
    $scope.income = 0;
    $scope.expenses = 0;
    $scope.liability = 0;
    $scope.assets = 0;
    $scope.loansAndLiability = {};
    $scope.loansAndAdvance = {};
    $scope.capitalDet = {};
    $scope.fixedAssetsDet = {};
    $scope.purchaseAmt = 0;
    $scope.salesAmt = 0;
    $scope.topCustomers = [];
    $scope.topSuppliers = [];
    $scope.topReceivables = [];
    $scope.topPayables = [];
    $scope.fastMoveingItems = [];
    $scope.slowMoveingItems = [];
    $scope.nonMoveingItems = [];

    $scope.ProductBrandColl = [];
    $scope.ProductTypeColl = [];

    var BSMonth_ENColl = ["Baishakh", "Jestha", "Asar", "Shrawan", "Bhadau", "Aswin", "Kartik", "Mansir", "Poush", "Magh", "Falgun", "Chaitra"]
    function LoadData() {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        // Load All Product Brand List
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Common/GetCommonDashboard",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                var data = res.data.Data;
                MonthlyIncomeExpenses(data.IncomeExpensesColl);
                MonthlyCashAndBank(data.CashMonthlyColl, data.BankMonthlyColl);
                CashFlow(data.CashFlowMontthlyColl);
                $scope.OutStandings = data.OutStandings;
                OutStanding(data.OutStandings);

                $scope.income = data.Income;
                $scope.expenses = data.Expenses;
                $scope.liability = data.Liability;
                $scope.assets = data.Assets;
                IncomeExpensesOnly();

                $scope.loansAndLiability = data.LoanAndLiability;
                $scope.loansAndAdvance = data.LoanAndAdvance;

                $scope.capitalDet = data.Capital;
                $scope.fixedAssetsDet = data.FixedAssets;

                $scope.purchaseAmt = mx(data.PurchaseMonthlyColl).sum(p1 => p1.Amount);
                $scope.salesAmt = mx(data.SalesMonthlyColl).sum(p1 => p1.Amount);
                MonthlyPurchaseAndSales(data.SalesMonthlyColl, data.PurchaseMonthlyColl);

                $scope.topCustomers = data.TopSalesPartyColl;
                TopCustomers(data.TopSalesPartyColl);

                $scope.topSuppliers = data.TopPurchasePartyColl;
                TopSuppliers(data.TopPurchasePartyColl);

                $scope.topReceivables = data.TopReceivablePartyColl;
                TopReceivable(data.TopReceivablePartyColl);

                $scope.topPayables = data.TopPayablePartyColl;
                TopPayable(data.TopPayablePartyColl);

                $scope.fastMoveingItems = data.TopSalesProductColl;
                FastMoveingItems(data.TopSalesProductColl);

                $scope.nonMoveingItems = data.NonMovingItemsColl;
                NonMoveingItems(data.NonMovingItemsColl);
            } else
                alert(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
        }, function (reason) {
            $scope.loadingstatus = 'stop';
            alert('Failed' + reason);
        });
    }

    function MonthlyIncomeExpenses(dataCOll) {

        var incomeData = [];
        var expensesData = [];
        var inExData = [];
        var monthList = [];
        angular.forEach(dataCOll, function (beData) {
            incomeData.push(beData.Income.toFixed(2).parseDBL());
            expensesData.push(beData.Expenses.toFixed(2).parseDBL());
            inExData.push(beData.NetBalance.toFixed(2).parseDBL());
            monthList.push(bsMonths[beData.MonthId - 1]);
            //monthList.push(BSMonth_ENColl[beData.MonthId - 1]);
            beData.MonthName = bsMonths[beData.MonthId - 1];
        });

        var options = {
            series: [
                {
                    //name: 'Income',
                    name: 'Sales Revenue',
                    type: 'column',
                    data: incomeData
                }, {
                    name: 'Expenses',
                    type: 'column',
                    data: expensesData
                },

                {
                    //name: 'Profit',
                    name: 'Expenses Vs Sales Revenue',
                    type: 'line',
                    data: inExData
                },

            ],
            chart: {
                height: 450,
                type: 'line',
                stacked: false,
                animations: {
                    enabled: true
                },
                zoom: {
                    enabled: false,
                }

            },
            grid: {
                padding: {
                    left: 0,
                    right: 0
                }
            },

            stroke: {
                //width: [0, 4]
                width: [1, 1, 4]

            },
            title: {
                text: ''
            },
            dataLabels: {
                enabled: false,
                // enabledOnSeries: [1]
            },
            //labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
            xaxis: {
                //type: 'datetime'
                categories: monthList,

            },
            yaxis: [{
                title: {
                    text: 'Income',
                },

            }, {
                opposite: true,
                title: {
                    text: 'Expenses'
                }
            }]
        };

        var chart = new ApexCharts(document.querySelector("#Mixchart"), options);
        chart.render();


    }

    //function MonthlyIncomeExpenses(dataCOll) {

    //    var incomeData = [];
    //    var expensesData = [];
    //    var inExData = [];
    //    var monthList = [];
    //    angular.forEach(dataCOll, function (beData) {
    //        incomeData.push(beData.Income.toFixed(2).parseDBL());
    //        expensesData.push(beData.Expenses.toFixed(2).parseDBL());
    //        inExData.push(beData.NetBalance.toFixed(2).parseDBL());
    //        monthList.push(bsMonths[beData.MonthId - 1]);
    //        beData.MonthName = bsMonths[beData.MonthId - 1];
    //    });
    //    var options = {
    //        stacked: true,
    //        series: [
    //    {
    //            name: 'Income',
    //            type: 'column',
    //            data: incomeData
    //        }, {
    //            name: 'Expenses',
    //            type: 'column',
    //            data: expensesData
    //            },

    //            {
    //            name: 'Profit',
    //            type: 'line',
    //            data: inExData
    //            }
    //        ],
    //        chart: {
    //            height: 450,
    //            type: 'line',
    //            stacked: false,
    //            animations: {
    //                enabled: true
    //            },
    //            zoom: {
    //                enabled: false,
    //            }
    //        },
    //        grid: {
    //            padding: {
    //                left: 0,
    //                right: 0
    //            }
    //        },
    //        dataLabels: {
    //            enabled: false
    //        },
    //        stroke: {
    //            width: [1, 1, 4]
    //        },
    //        title: {
    //            text: '',
    //            align: 'left',
    //            offsetX: 110
    //        },
    //        xaxis: {
    //            categories: monthList,
    //        },
    //        yaxis: [
    //            {
    //            axisTicks: {
    //                show: true,
    //            },
    //            axisBorder: {
    //                show: true,
    //                color: '#008FFB'
    //            },
    //            labels: {
    //                style: {
    //                    colors: '#008FFB',
    //                }
    //            },
    //            title: {
    //                text: "Income",
    //                style: {
    //                    color: '#008FFB',
    //                }
    //            },
    //            tooltip: {
    //                enabled: true
    //            }
    //        },
    //            {
    //            seriesName: 'Income',
    //            opposite: true,
    //            axisTicks: {
    //                show: true,
    //            },
    //            axisBorder: {
    //                show: true,
    //                color: '#00E396'
    //            },
    //            labels: {
    //                style: {
    //                    colors: '#00E396',
    //                }
    //            },
    //            title: {
    //                text: "Expenses",
    //                style: {
    //                    color: '#00E396',
    //                }
    //            },
    //            },

    //            {
    //            seriesName: 'Profit',
    //            opposite: true,
    //            axisTicks: {
    //                show: true,
    //            },
    //            axisBorder: {
    //                show: true,
    //                color: '#FEB019'
    //            },
    //            labels: {
    //                style: {
    //                    colors: '#FEB019',
    //                },
    //            },
    //            title: {
    //                text: "Profit",
    //                style: {
    //                    color: '#FEB019',
    //                }
    //            }
    //        },],
    //        tooltip: {
    //            fixed: {
    //                enabled: true,
    //                position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
    //                offsetY: 30,
    //                offsetX: 60
    //            },
    //        },
    //        legend: {
    //            horizontalAlign: 'center',
    //            offsetX: 40
    //        }
    //    };

    //    var chart = new ApexCharts(document.querySelector("#Mixchart"), options);
    //    chart.render();
    //}

    function MonthlyCashAndBank(cashColl, bankColl) {

        var cashData = [];
        var bankData = [];
        var monthList = [];
        var partyName = [];
        angular.forEach(cashColl, function (beData) {
            monthList.push(bsMonths[beData.MonthId - 1]);
            cashData.push(beData.Amount.toFixed(3));
        });
        angular.forEach(bankColl, function (beData) {
            bankData.push(beData.Amount.toFixed(3));
        });
        var options = {
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    customIcons: [{
                        title: 'tooltip of the icon',
                        //class: 'custom-icon',
                        click: function (chart, options, e) {
                            alert("clicked custom-icon")
                        }
                    }]
                }
            },
            series: [{
                name: 'Cash',
                type: 'column',
                data: cashData
            }, {
                name: 'Bank',
                type: 'column',
                data: bankData
            }],
            chart: {
                height: 450,
                type: 'line',
                stacked: false,
            },
            stroke: {
                width: [0, 0, 0, 4],
                curve: 'smooth'
            },

            colors: ['#5e9ad3', '#ec7c34', '#a5a5a5', '#fcba3b'],
            title: {
                text: 'Monthly Cash And Bank Analysis',
                align: 'left',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },

            fill: {
                opacity: [1, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: monthList,
            markers: {
                size: 0
            },
            xaxis: {
                type: 'category'
            },
            yaxis: {
                title: {
                    text: '',
                },
                axisBorder: {
                    show: false,
                    color: '#008FFB'
                },
                min: 0
            },

            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(3);
                        }
                        return y;

                    }
                }
            }
        };

        var chart = new ApexCharts(document.querySelector("#CashBankchart"), options);
        chart.render();
    }

    function CashFlow(dataCOll) {

        var drData = [];
        var crData = [];
        var monthList = [];

        angular.forEach(dataCOll, function (beData) {
            monthList.push(bsMonths[beData.MonthId - 1]);
            drData.push(beData.DrAmount.toFixed(3));
            crData.push(beData.CrAmount.toFixed(3));
        });

        var options = {
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    customIcons: [{
                        title: 'tooltip of the icon',
                        //class: 'custom-icon',
                        click: function (chart, options, e) {
                            alert("clicked custom-icon")
                        }
                    }]
                }
            },
            series: [{
                name: 'Debit',
                type: 'column',
                data: drData
            }, {
                name: 'Credit',
                type: 'column',
                data: crData
            }],
            chart: {
                height: 450,
                type: 'line',
                stacked: false,
            },
            stroke: {
                width: [0, 0, 0, 4],
                curve: 'smooth'
            },

            colors: ['#5e9ad3', '#ec7c34', '#a5a5a5', '#fcba3b'],
            title: {
                text: 'Monthly Cash Flow',
                align: 'left',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },

            fill: {
                opacity: [1, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: monthList,
            markers: {
                size: 0
            },
            xaxis: {
                type: 'category'
            },
            yaxis: {
                title: {
                    text: '',
                },
                axisBorder: {
                    show: false,
                    color: '#008FFB'
                },
                min: 0
            },

            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(3);
                        }
                        return y;

                    }
                }
            }
        };

        var chart = new ApexCharts(document.querySelector("#CashFlowchart"), options);
        chart.render();
    }

    function OutStanding(beData) {
        var dataColl = [];
        dataColl.push(Math.abs(beData.Payables).toFixed(3));
        dataColl.push(Math.abs(beData.Receivables).toFixed(3));
        var ctx = document.getElementById("outstandingPieChart");
        var outstandingPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Payables', 'Receivables'],
                datasets: [{
                    label: '# Outstandings',
                    data: dataColl,
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                }]
            },
            options: {
                // cutoutPercentage: 40,
                responsive: true,
                legend: {
                    display: false
                },
                maintainAspectRatio: false

            }
        });
    }

    function IncomeExpensesOnly() {

        var dataColl = [];
        dataColl.push(Math.abs($scope.income).toFixed(3));
        dataColl.push(Math.abs($scope.expenses).toFixed(3));

        var ctx = document.getElementById("profitNlossChart");
        var profitNlossChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    label: '# of Tomatoes',
                    data: dataColl,
                    backgroundColor: [
                        '#4c7cf3',
                        '#31cd72',
                    ],
                    borderColor: [
                        'rgba(255,255,255,1)',
                        'rgba(255,255,255,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                cutoutPercentage: 60,
                responsive: true,
                legend: {
                    display: false
                },
                maintainAspectRatio: false

            }
        });
    }

    function MonthlyPurchaseAndSales(salesCOll, purchaseDataColl) {

        var salesSeries = [];
        var purchaseSeries = [];
        var monthList = [];

        angular.forEach(salesCOll, function (beData) {
            salesSeries.push(Math.abs(beData.Amount).toFixed(3));
            monthList.push(bsMonths[beData.MonthId - 1]);
        });
        angular.forEach(purchaseDataColl, function (beData) {
            purchaseSeries.push(Math.abs(beData.Amount.toFixed(3)));
        });
        //for (var i = 0; i < 12; i++) {
        //    salesSeries.push(Math.abs(salesCOll[i].Amount).toFixed(3));
        //    purchaseSeries.push(Math.abs(purchaseDataColl[i].Amount.toFixed(3)));
        //    monthList.push(bsMonths[i]);         
        //}
        var options = {
            chart: {
                type: "area",
                height: 300,
                foreColor: "#999",
                stacked: true,
                dropShadow: {
                    enabled: true,
                    enabledSeries: [0],
                    top: -2,
                    left: 2,
                    blur: 5,
                    opacity: 0.06
                }
            },
            colors: ['#00E396', '#0090FF'],
            stroke: {
                curve: "smooth",
                width: 3
            },
            dataLabels: {
                enabled: false
            },
            series: [{
                name: 'Purchase',
                data: purchaseSeries
            }, {
                name: 'Sales',
                data: salesSeries
            }],
            markers: {
                size: 0,
                strokeColor: "#fff",
                strokeWidth: 3,
                strokeOpacity: 1,
                fillOpacity: 1,
                hover: {
                    size: 6
                }
            },
            xaxis: {
                categories: monthList,
                // type: "datetime",
                //axisBorder: {
                //    show: false
                //},
                //axisTicks: {
                //    show: false
                //}
            },
            yaxis: {
                labels: {
                    offsetX: -10,
                    offsetY: -5
                },
                tooltip: {
                    enabled: true
                }
            },
            grid: {
                borderColor: '#f1f2f3',
                padding: {
                    left: 0,
                    right: 5
                }
            },

            legend: {
                position: 'top',
                horizontalAlign: 'left'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            }
        };

        var chart = new ApexCharts(document.querySelector("#purchaseSalesChart"), options);

        chart.render();



        //var options = {
        //    chart: {
        //        type: "area",
        //        height: 300,
        //        foreColor: "#999",
        //        stacked: true,
        //        dropShadow: {
        //            enabled: true,
        //            enabledSeries: [0],
        //            top: -2,
        //            left: 2,
        //            blur: 5,
        //            opacity: 0.06
        //        }
        //    },
        //    colors: ['#00E396', '#0090FF'],
        //    stroke: {
        //        curve: "smooth",
        //        width: 3
        //    },
        //    dataLabels: {
        //        enabled: false
        //    },
        //    series: [{
        //        name: 'Purchase',
        //        data: purchaseSeries
        //    }, {
        //        name: 'Sales',
        //            data: salesSeries
        //    }],
        //    markers: {
        //        size: 0,
        //        strokeColor: "#fff",
        //        strokeWidth: 3,
        //        strokeOpacity: 1,
        //        fillOpacity: 1,
        //        hover: {
        //            size: 6
        //        }
        //    },
        //    xaxis: {
        //        type: "datetime",
        //        axisBorder: {
        //            show: false
        //        },
        //        axisTicks: {
        //            show: false
        //        }
        //    },
        //    yaxis: {
        //        labels: {
        //            offsetX: -10,
        //            offsetY: -5
        //        },
        //        tooltip: {
        //            enabled: true
        //        }
        //    },
        //    grid: {
        //        borderColor: '#f1f2f3',
        //        padding: {
        //            left: 0,
        //            right: 5
        //        }
        //    },
        //    tooltip: {
        //        x: {
        //           // format: "dd MMM yyyy"
        //        },
        //    },
        //    legend: {
        //        position: 'top',
        //        horizontalAlign: 'left'
        //    },
        //    fill: {
        //        type: "gradient",
        //        gradient: {
        //            shadeIntensity: 1,
        //            opacityFrom: 0.7,
        //            opacityTo: 0.9,
        //            stops: [0, 90, 100]
        //        }
        //    }
        //};

        //var chart = new ApexCharts(document.querySelector("#purchaseSalesChart"), options);

        //chart.render();
    }

    function TopCustomers(dataColl) {
        var data = [];
        var series = [];
        angular.forEach(dataColl, function (beData) {
            data.push(beData.Value.toFixed(3));
            series.push(beData.Name);
        });
        var options = {
            series: [{
                name: 'Sales Amt.',
                data: data
            }],
            chart: {
                height: 160,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            colors: ['#66DA26'],
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                },
                //  type: 'datetime',
                categories: series
            },
            yaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                x: {
                    // format: 'dd/MM/yy HH:mm'
                },
            },
        };

        var chart = new ApexCharts(document.querySelector("#topCustomers"), options);
        chart.render();
    }

    function TopSuppliers(dataColl) {

        var data = [];
        var series = [];
        angular.forEach(dataColl, function (beData) {
            data.push(beData.Value.toFixed(3));
            series.push(beData.Name);
        });

        var options = {
            series: [{
                name: 'Purchase Amt.',
                data: data
            }],
            chart: {
                height: 160,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            colors: ['#f7b924'],
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                },
                //type: 'datetime',
                categories: series
            },
            yaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                x: {
                    // format: 'dd/MM/yy HH:mm'
                },
            },
        };

        var chart = new ApexCharts(document.querySelector("#topSuppliers"), options);
        chart.render();
    }

    function TopReceivable(dataColl) {
        var data = [];
        var series = [];
        angular.forEach(dataColl, function (beData) {
            data.push(beData.Value.toFixed(3));
            series.push(beData.Name);
        });

        var options = {
            series: [{
                name: 'Closing Balance',
                data: data
            }],
            chart: {
                height: 160,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            colors: ['#1f5d9e'],
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                },
                // type: 'datetime',
                categories: series
            },
            yaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                x: {
                    // format: 'dd/MM/yy HH:mm'
                },
            },
        };

        var chart = new ApexCharts(document.querySelector("#topReceivable"), options);
        chart.render();
    }
    function TopPayable(dataColl) {
        var data = [];
        var series = [];
        angular.forEach(dataColl, function (beData) {
            data.push(beData.Value.toFixed(3));
            series.push(beData.Name);
        });

        var options = {
            series: [{
                name: 'Closing Amt.',
                data: data
            }],
            chart: {
                height: 160,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            colors: ['#1f5d9e'],
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                },
                // type: 'datetime',
                categories: series
            },
            yaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                x: {
                    // format: 'dd/MM/yy HH:mm'
                },
            },
        };

        var chart = new ApexCharts(document.querySelector("#topPayables"), options);
        chart.render();
    }

    function FastMoveingItems(dataColl) {
        var data = [];
        var series = [];
        angular.forEach(dataColl, function (beData) {
            data.push(beData.Value.toFixed(3));
            series.push(beData.Name);
        });

        var options = {
            series: [{
                name: 'Sales Amt.',
                data: data
            }],
            chart: {
                height: 160,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            colors: ['#1f5d9e'],
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                },
                // type: 'datetime',
                categories: series
            },
            yaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                x: {
                    // format: 'dd/MM/yy HH:mm'
                },
            },
        };

        var chart = new ApexCharts(document.querySelector("#fastMovingItems"), options);
        chart.render();
    }

    function NonMoveingItems(dataColl) {
        var data = [];
        var series = [];
        angular.forEach(dataColl, function (beData) {
            data.push(beData.LastSalesDays);
            series.push(beData.Name);
        });

        var options = {
            series: [{
                name: 'Days',
                data: data
            }],
            chart: {
                height: 160,
                type: 'area',
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0
                }
            },
            colors: ['#1f5d9e'],
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                }
            },
            xaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                },
                // type: 'datetime',
                categories: series
            },
            yaxis: {
                floating: true,
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    show: false
                }
            },
            tooltip: {
                x: {
                    // format: 'dd/MM/yy HH:mm'
                },
            },
        };

        nonMovingItemChart = new ApexCharts(document.querySelector("#nonMovingItems"), options);
        nonMovingItemChart.render();
    }

    var nonMovingItemChart = null;
    $scope.GetTopNonMovingItems = function (ProductBrandId) {

        if (ProductBrandId == null)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "DashBoard/Common/GetTopNonMovingItems?ProductBrandId=" + ProductBrandId,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            if (res.data.IsSuccess && res.data.Data) {
                var dataColl = res.data.Data;
                $scope.nonMoveingItems = dataColl;


                var data = [];
                var series = [];
                angular.forEach(dataColl, function (beData) {
                    data.push(beData.LastSalesDays);
                    series.push(beData.Name);
                });

                var options = {
                    series: [{
                        name: 'Days',
                        data: data
                    }],
                    chart: {
                        height: 160,
                        type: 'area',
                        toolbar: {
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: false,
                        padding: {
                            left: 0,
                            right: 0
                        }
                    },
                    colors: ['#1f5d9e'],
                    stroke: {
                        curve: 'smooth'
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
                            stops: [0, 90, 100]
                        }
                    },
                    xaxis: {
                        floating: true,
                        axisTicks: {
                            show: false
                        },
                        axisBorder: {
                            show: false
                        },
                        labels: {
                            show: false
                        },
                        // type: 'datetime',
                        categories: series
                    },
                    yaxis: {
                        floating: true,
                        axisTicks: {
                            show: false
                        },
                        axisBorder: {
                            show: false
                        },
                        labels: {
                            show: false
                        }
                    },
                    tooltip: {
                        x: {
                            // format: 'dd/MM/yy HH:mm'
                        },
                    },
                };

                if (nonMovingItemChart) {
                    nonMovingItemChart.updateOptions(options);

                } else {
                    nonMovingItemChart = new ApexCharts(document.querySelector("#nonMovingItems"), options);
                    nonMovingItemChart.render();
                }

            } else
                alert(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
        }, function (reason) {
            alert('Failed' + reason);
        });



    }
});

app.controller('salesAnalysisDetDashboardController28', function ($scope, $http, $filter, companyDet) {
    LoadData();


    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];

    function LoadData() {


        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 70, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 210, pinned: 'left' },
            { headerName: "Group", field: "ProductGroup", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Brand", field: "ProductBrand", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "Closing Stock", field: "ClosingQty", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "LastSalesBeforeDays", field: "LastSalesDays", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'center' } }
        ];

        $scope.gridOptions = {
            //angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                // set every column width
                width: 100,

            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        GetData();
    }

    function GetData() {

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Common/GetNonMovingItems?DateFrom=" + DateFrom + "&DateTo=" + DateTo + "&ProductBrandId=" + ProductBrandId + "&ProductTypeId=" + ProductTypeId,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                $scope.gridOptions.api.setRowData($scope.DataColl);


            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });



    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
});