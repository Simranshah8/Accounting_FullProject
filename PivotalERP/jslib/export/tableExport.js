/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function ($) {
	$.fn.extend({
		tableExport: function (options) {
			var defaults = {
				separator: ',',
				ignoreColumn: [],
				tableName: 'yourTableName',
				type: 'csv',
				pdfFontSize: 14,
				pdfLeftMargin: 20,
				//escape:'true',
				escape: 'false',
				htmlContent: 'false',
				consoleLog: 'false',
				companyName: 'Dynamic Technosoft Pvt. Ltd.',
				companyAddress: '',
				reportName: '',
				sheetName:'',
			};

			var options = $.extend(defaults, options);
			var el = this;

			if (defaults.type == 'csv' || defaults.type == 'txt') {

				// Header
				var tdData = "";
				$(el).find('thead').find('tr').each(function () {
					tdData += "\n";
					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1 && $(this).is(':hidden')==false) {
								tdData += '"' + parseString($(this)) + '"' + defaults.separator;
							}
						}

					});
					tdData = $.trim(tdData);
					tdData = $.trim(tdData).substring(0, tdData.length - 1);
				});

				// Row vs Column
				$(el).find('tbody').find('tr').each(function () {
					tdData += "\n";
					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1 && $(this).is(':hidden')==false) {
								tdData += '"' + parseString($(this)) + '"' + defaults.separator;
							}
						}
					});
					//tdData = $.trim(tdData);
					tdData = $.trim(tdData).substring(0, tdData.length - 1);
				});

				//output
				if (defaults.consoleLog == 'true') {
					console.log(tdData);
				}
				//var base64data = "base64," + $.base64.encode(tdData);
				var base64data = "base64," + btoa(unescape(encodeURIComponent(tdData)));

				//'data:application/vnd.ms-excel;base64,',
				//window.open('data:application/' + defaults.type + ';'+ base64data);
				var link = document.createElement("a");
				link.href = 'data:application/' + defaults.type + ';' + base64data;
				link.download =options.reportName ? options.reportName+".csv" :  "data.csv";
				link.click();

			}
			else if (defaults.type == 'csvcopy') {

				// Header
				var tdData = "";
				$(el).find('thead').find('tr').each(function () {
					tdData += "\n";
					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1 && $(this).is(':hidden') == false) {
								tdData += '"' + parseString($(this)) + '"' + defaults.separator;
							}
						}

					});
					tdData = $.trim(tdData);
					tdData = $.trim(tdData).substring(0, tdData.length - 1);
				});

				// Row vs Column
				$(el).find('tbody').find('tr').each(function () {
					tdData += "\n";
					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1 && $(this).is(':hidden') == false) {
								tdData += '"' + parseString($(this)) + '"' + defaults.separator;
							}
						}
					});
					//tdData = $.trim(tdData);
					tdData = $.trim(tdData).substring(0, tdData.length - 1);
				});

				//output
				if (defaults.consoleLog == 'true') {
					console.log(tdData);
				}
				return tdData;

			}

			else if (defaults.type == 'sql') {

				// Header
				var tdData = "INSERT INTO `" + defaults.tableName + "` (";
				$(el).find('thead').find('tr').each(function () {

					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								tdData += '`' + parseString($(this)) + '`,';
							}
						}

					});
					tdData = $.trim(tdData);
					tdData = $.trim(tdData).substring(0, tdData.length - 1);
				});
				tdData += ") VALUES ";
				// Row vs Column
				$(el).find('tbody').find('tr').each(function () {
					tdData += "(";
					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								tdData += '"' + parseString($(this)) + '",';
							}
						}
					});

					tdData = $.trim(tdData).substring(0, tdData.length - 1);
					tdData += "),";
				});
				tdData = $.trim(tdData).substring(0, tdData.length - 1);
				tdData += ";";

				//output
				//console.log(tdData);

				if (defaults.consoleLog == 'true') {
					console.log(tdData);
				}

				//var base64data = "base64," + $.base64.encode(tdData);
				var base64data = "base64," + btoa(unescape(encodeURIComponent(tdData)));
				window.open('data:application/sql;filename=exportData;' + base64data);


			} else if (defaults.type == 'json') {

				var jsonHeaderArray = [];
				$(el).find('thead').find('tr').each(function () {
					var tdData = "";
					var jsonArrayTd = [];

					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								jsonArrayTd.push(parseString($(this)));
							}
						}
					});
					jsonHeaderArray.push(jsonArrayTd);

				});

				var jsonArray = [];
				$(el).find('tbody').find('tr').each(function () {
					var tdData = "";
					var jsonArrayTd = [];

					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								jsonArrayTd.push(parseString($(this)));
							}
						}
					});
					jsonArray.push(jsonArrayTd);

				});

				var jsonExportArray = [];
				jsonExportArray.push({ header: jsonHeaderArray, data: jsonArray });

				//Return as JSON
				//console.log(JSON.stringify(jsonExportArray));

				//Return as Array
				//console.log(jsonExportArray);
				if (defaults.consoleLog == 'true') {
					console.log(JSON.stringify(jsonExportArray));
				}
				var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
				window.open('data:application/json;filename=exportData;' + base64data);
			} else if (defaults.type == 'xml') {

				var xml = '<?xml version="1.0" encoding="utf-8"?>';
				xml += '<tabledata><fields>';

				// Header
				$(el).find('thead').find('tr').each(function () {
					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								xml += "<field>" + parseString($(this)) + "</field>";
							}
						}
					});
				});
				xml += '</fields><data>';

				// Row Vs Column
				var rowCount = 1;
				$(el).find('tbody').find('tr').each(function () {
					xml += '<row id="' + rowCount + '">';
					var colCount = 0;
					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								xml += "<column-" + colCount + ">" + parseString($(this)) + "</column-" + colCount + ">";
							}
						}
						colCount++;
					});
					rowCount++;
					xml += '</row>';
				});
				xml += '</data></tabledata>'

				if (defaults.consoleLog == 'true') {
					console.log(xml);
				}

				var base64data = "base64," + $.base64.encode(xml);
				window.open('data:application/xml;filename=exportData;' + base64data);

			} else if (defaults.type == 'excel' || defaults.type == 'doc' || defaults.type == 'powerpoint') {
				//console.log($(this).html());
				var excel = "";

				var totalColumnCount = 0;
				var tblHeader = "";
				// Header
				$(el).find('thead').find('tr').each(function () {
					tblHeader += "<tr>";
					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1 && data.hidden!=true) {
								tblHeader += "<td style='vertical-align: middle;background-color: #f5f5f9b5;'><h5>" + parseString($(this)) + "</h5></td>";
								totalColumnCount++;
							}
						}
					});
					tblHeader += '</tr>';

				});

				var pageHeader = "<table> <thead>";
				pageHeader = pageHeader + "<tr><th style='text-align: center;'  colspan='" + totalColumnCount + "'>" + "<h3 style='margin: 15px;'>" + defaults.companyName + "</h3>" + "</th></tr>";
				pageHeader = pageHeader + "<tr><th align='center' colspan='" + totalColumnCount + "'>" + defaults.companyAddress + "</th></tr>";
				pageHeader = pageHeader + "<tr><th align='center' colspan='" + totalColumnCount + "'>" + defaults.reportName + "</th></tr>";
				pageHeader = pageHeader + " </thead> </table>";

				excel += pageHeader;
				excel += "<br><table>"
				excel += tblHeader;

				// Row Vs Column
				var rowCount = 1;
				$(el).find('tbody').find('tr').each(function () {
					excel += "<tr>";
					var colCount = 0;
					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none' && data.hidden != true)
						{
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								let input = data.querySelector("input");
								let select = data.querySelector("select");
								let select2 = data.querySelector("select2");
								if (input) {
									excel += "<td>" + input.value + "</td>";
								}
								else if (select2) {
									excel += "<td>" + select2.value + "</td>";
								}
								else if (select) {

									if (select.selectedIndex >= 0) {
										excel += "<td>" + select.options[select.selectedIndex].text + "</td>";
									}
									else
										excel += "<td></td>";
								}
								else {
									excel += "<td>" + parseString($(this)) + "</td>";
								}

								colCount++;
							}
						}						
					});
					rowCount++;
					excel += '</tr>';
				});
				excel += '</table>'

				if (defaults.consoleLog == 'true') {
					console.log(excel);
				}

				var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" + defaults.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
				excelFile += "<head>";
				excelFile += "<!--[if gte mso 9]>";
				excelFile += "<xml>";
				excelFile += "<x:ExcelWorkbook>";
				excelFile += "<x:ExcelWorksheets>";
				excelFile += "<x:ExcelWorksheet>";
				excelFile += "<x:Name>";
				//excelFile += "{worksheet}";
				excelFile += options.sheetName ? options.sheetName : options.reportName;
				excelFile += "</x:Name>";
				excelFile += "<x:WorksheetOptions>";
				excelFile += "<x:DisplayGridlines/>";
				excelFile += "</x:WorksheetOptions>";
				excelFile += "</x:ExcelWorksheet>";
				excelFile += "</x:ExcelWorksheets>";
				excelFile += "</x:ExcelWorkbook>";
				excelFile += "</xml>";
				excelFile += "<![endif]-->";

				excelFile += "<style type='text/css'> " +
					"table {  " +
					"border-collapse: collapse;  " +
					"}  " +
					" table thead th,  " +
					" .table.table-head-fixed thead tr th { " +
					" background-color: #f5f5f9b5!important;  " +
					"   border: 1px solid rgb(222, 226, 230);  " +
					" }  " +
					" h3 { " +
					"  font-size: 30px;  " +
					" }  " +
					"h4 { " +
					"font-size: 24px;  " +
					" }  " +
					"</style> ";

				excelFile += "</head>";
				excelFile += "<body>";
				excelFile += excel;
				excelFile += "</body>";
				excelFile += "</html>";

				//var base64data = "base64," + $.base64.encode(excelFile);
				var base64data = "base64," + btoa(unescape(encodeURIComponent(excelFile)));
				var fname = defaults.reportName + ".xlsx; ";
				//window.open('data:application/vnd.ms-' + defaults.type + ';charset=utf-8;filename=' + fname + base64data);
				//window.open('data:application/vnd.ms-' + defaults.type + ';filename=exportData.doc;' + base64data);

				var link = document.createElement("a");
				link.href = 'data:application/vnd.ms-' + defaults.type + ';' + base64data;
				link.download = options.reportName ? options.reportName + ".xls" : "data.xls";
				link.click();

			}

			else if (defaults.type == 'excelcopy')
			{
				//console.log($(this).html());
				var excel = "";

				var totalColumnCount = 0;
				var tblHeader = "";
				// Header
				$(el).find('thead').find('tr').each(function () {
					tblHeader += "<tr>";
					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1 && data.hidden != true) {
								tblHeader += "<td style='vertical-align: middle;background-color: #f5f5f9b5;'><h5>" + parseString($(this)) + "</h5></td>";
								totalColumnCount++;
							}
						}
					});
					tblHeader += '</tr>';

				});

				var pageHeader = "<table> <thead>";
				pageHeader = pageHeader + "<tr><th style='text-align: center;'  colspan='" + totalColumnCount + "'>" + "<h3 style='margin: 15px;'>" + defaults.companyName + "</h3>" + "</th></tr>";
				pageHeader = pageHeader + "<tr><th align='center' colspan='" + totalColumnCount + "'>" + defaults.companyAddress + "</th></tr>";
				pageHeader = pageHeader + "<tr><th align='center' colspan='" + totalColumnCount + "'>" + defaults.reportName + "</th></tr>";
				pageHeader = pageHeader + " </thead> </table>";

				excel += pageHeader;
				excel += "<br><table>"
				excel += tblHeader;

				// Row Vs Column
				var rowCount = 1;
				$(el).find('tbody').find('tr').each(function () {
					excel += "<tr>";
					var colCount = 0;
					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none' && data.hidden != true)
						{
							if (defaults.ignoreColumn.indexOf(index) == -1)
							{
								let input = data.querySelector("input");
								let select = data.querySelector("select");
								let select2 = data.querySelector("select2");
								if (input) {
									excel += "<td>" + input.value + "</td>";
								}
								else if (select2) {
									excel += "<td>" + select2.value + "</td>";
								}
								else if (select) {

									if (select.selectedIndex >= 0) {
										excel += "<td>" + select.options[select.selectedIndex].text + "</td>";
                                    }										
									else
										excel += "<td></td>";
								}
								else {
									excel += "<td>" + parseString($(this)) + "</td>";
                                }
									
								colCount++;
							}
						}
					});
					rowCount++;
					excel += '</tr>';
				});
				excel += '</table>'

				if (defaults.consoleLog == 'true') {
					console.log(excel);
				}

				var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" + defaults.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
				excelFile += "<head>";
				excelFile += "<!--[if gte mso 9]>";
				excelFile += "<xml>";
				excelFile += "<x:ExcelWorkbook>";
				excelFile += "<x:ExcelWorksheets>";
				excelFile += "<x:ExcelWorksheet>";
				excelFile += "<x:Name>";
				//excelFile += "{worksheet}";
				excelFile += options.sheetName ? options.sheetName : options.reportName;
				excelFile += "</x:Name>";
				excelFile += "<x:WorksheetOptions>";
				excelFile += "<x:DisplayGridlines/>";
				excelFile += "</x:WorksheetOptions>";
				excelFile += "</x:ExcelWorksheet>";
				excelFile += "</x:ExcelWorksheets>";
				excelFile += "</x:ExcelWorkbook>";
				excelFile += "</xml>";
				excelFile += "<![endif]-->";

				excelFile += "<style type='text/css'> " +
					"table {  " +
					"border-collapse: collapse;  " +
					"}  " +
					" table thead th,  " +
					" .table.table-head-fixed thead tr th { " +
					" background-color: #f5f5f9b5!important;  " +
					"   border: 1px solid rgb(222, 226, 230);  " +
					" }  " +
					" h3 { " +
					"  font-size: 30px;  " +
					" }  " +
					"h4 { " +
					"font-size: 24px;  " +
					" }  " +
					"</style> ";

				excelFile += "</head>";
				excelFile += "<body>";
				excelFile += excel;
				excelFile += "</body>";
				excelFile += "</html>";

				return excelFile;
				 
			}

			else if (defaults.type == 'png') {
				html2canvas($(el), {
					onrendered: function (canvas) {
						var img = canvas.toDataURL("image/png");
						window.open(img);


					}
				});
			} else if (defaults.type == 'pdf') {

				var doc = new jsPDF('p', 'pt', 'a4', true);
				doc.setFontSize(defaults.pdfFontSize);

				// Header
				var startColPosition = defaults.pdfLeftMargin;
				$(el).find('thead').find('tr').each(function () {
					$(this).filter(':visible').find('th').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								var colPosition = startColPosition + (index * 50);
								doc.text(colPosition, 20, parseString($(this)));
							}
						}
					});
				});


				// Row Vs Column
				var startRowPosition = 20; var page = 1; var rowPosition = 0;
				$(el).find('tbody').find('tr').each(function (index, data) {
					rowCalc = index + 1;

					if (rowCalc % 26 == 0) {
						doc.addPage();
						page++;
						startRowPosition = startRowPosition + 10;
					}
					rowPosition = (startRowPosition + (rowCalc * 10)) - ((page - 1) * 280);

					$(this).filter(':visible').find('td').each(function (index, data) {
						if ($(this).css('display') != 'none') {
							if (defaults.ignoreColumn.indexOf(index) == -1) {
								var colPosition = startColPosition + (index * 50);
								doc.text(colPosition, rowPosition, parseString($(this)));
							}
						}

					});

				});

				// Output as Data URI
				doc.output('datauri');

			}


			function parseString(data) {

				if (defaults.htmlContent == 'true') {
					content_data = data.html().trim();
				} else {
					content_data = data.text().trim();
				}

				if (defaults.escape == 'true') {
					content_data = escape(content_data);
				}



				return content_data;
			}

		}
	});
})(jQuery);

