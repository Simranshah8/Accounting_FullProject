using Dynamic.DataAccess.Global;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace PivotalERP.SSF.BL
{
    public class SSFAPI
    {
        DataAccessLayer1 dal = null;
        private readonly string hostName;
        private readonly string dbName;

        public string HostName => hostName;
        public string DbName => dbName;


        private static readonly HttpClient httpClient = new HttpClient();
        private readonly KeyValueConfigurationCollection settings;
        private readonly string imisApiBaseUrl = "imisApiBaseUrl";
        private readonly string imisRemoteUser = "imisRemoteUser";
        private readonly string imisAuthBasic = "imisAuthBasic";
        private readonly string imisCHFID = "imisCHFID";
        public SSFAPI(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
            this.hostName = hostName;
            this.dbName = dbName;

            var map = new ExeConfigurationFileMap
            {
                ExeConfigFilename = AppDomain.CurrentDomain.BaseDirectory + "/Web.config"
            };
            var configFile = ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
            settings = configFile.AppSettings.Settings;

        }
        public string ImisApiBaseUrl => settings[imisApiBaseUrl]?.Value ?? "";
        public string ImisRemoteUser => settings[imisRemoteUser]?.Value ?? "";
        public string ImisAuthBasic => settings[imisAuthBasic]?.Value ?? "";
        public string ImisCHFID => settings[imisCHFID]?.Value ?? "";

      


    }
}