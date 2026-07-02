using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PivotalERP.SSF.BE;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.SSF.BL
{
    public class Request
    {
        private readonly SSFAPI ssfApi;
        private static readonly HttpClient httpClient = new HttpClient();
        int _UserId = 0;

        public Request(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            ssfApi = new SSFAPI(hostName, dbName);
        }
        public async Task<BookingCollections> GetOnlyBookingDataAsync()
        {
            var bookingCollections = new BookingCollections();

            try
            {
                var url = ssfApi.ImisApiBaseUrl;
                var remoteUser = ssfApi.ImisRemoteUser;
                var basicAuth = ssfApi.ImisAuthBasic;
                var chfid = ssfApi.ImisCHFID;

                var payload = new
                {
                    resourceType = "ExtraJson",
                    payload = new
                    {
                        cmd_action = "action.bookingHistory",
                        chfid = chfid
                    }
                };
                var jsonPayload = JsonConvert.SerializeObject(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                // Set headers
                httpClient.DefaultRequestHeaders.Clear();
                httpClient.DefaultRequestHeaders.Add("remote-user", remoteUser);
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuth);

                // Send request
                HttpResponseMessage response = await httpClient.PostAsync(url, content);
                string responseJson = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    bookingCollections.success = 0;
                    bookingCollections.msg = $"API call failed: {(int)response.StatusCode} - {response.ReasonPhrase}";
                    return bookingCollections;
                }

                // Parse the JSON response and map it to BookingCollections
                var jsonObject = JObject.Parse(responseJson);
                var dataArray = jsonObject["response"]?["data"];

                if (dataArray != null)
                {
                    var bookingList = dataArray.ToObject<List<BookingHistory>>();
                    bookingCollections.ResVals.data = bookingList;
                    bookingCollections.success = 1;
                    bookingCollections.msg = "Success";
                }
                else
                {
                    bookingCollections.success = 0;
                    bookingCollections.msg = "No booking data found.";
                }
            }
            catch (JsonException jex)
            {
                bookingCollections.success = 0;
                bookingCollections.msg = jex.Message;
            }
            catch (HttpRequestException httpEx)
            {
                bookingCollections.success = 0;
                bookingCollections.msg = httpEx.Message;
            }
            catch (TaskCanceledException timeoutEx)
            {
                bookingCollections.success = 0;
                bookingCollections.msg = timeoutEx.Message;
            }
            catch (Exception ex)
            {
                bookingCollections.success = 0;
                bookingCollections.msg = ex.Message;
            }

            return bookingCollections;
        }





    }
}
