using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Dynamic.BusinessEntity.Inventory;

namespace PivotalERP.Areas.Inventory.Controllers
{
    public class CreationController : PivotalERP.Controllers.BaseController
    {
        // private readonly ProductTypeCollections dataColl;

        // GET: Inventory/Creation
        #region "Product"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.Product)]
        public ActionResult Product()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.Product)]
        public JsonNetResult SaveProduct()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Product>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.Name == null)
                        resVal = new Dynamic.BusinessLogic.Inventory.Product(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.Product(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Godown"

        [HttpGet]
        public JsonNetResult GetProductCostingMethod()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Inventory.CostingMethods)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        public ActionResult Godown()
        {
            return View();
        }

        public ActionResult Quotes()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveGodown()
        {
            {
                ResponeValues resVal = new ResponeValues();
                try
                {
                    var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Godown>(Request["jsonData"]);
                    if (beData != null)
                    {


                        if (beData.GodownId > 0)
                            resVal = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).ModifyFormData(beData);
                        else
                            resVal = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).SaveFormData(beData);
                    }
                    else
                    {
                        resVal.ResponseMSG = "Blank Data Can't be Accept";
                    }

                }
                catch (Exception ee)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = ee.Message;
                }

                return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductShape)]
        public JsonNetResult DeleteGodown(int GodownId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (GodownId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Godown name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).DeleteById(GodownId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.Godown)]
        public JsonNetResult getGodownById(int GodownId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).getGodownById(User.UserId, GodownId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllGodown()
        {
            Dynamic.BusinessEntity.Inventory.GodownCollections dataColl = new Dynamic.BusinessEntity.Inventory.GodownCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.Godown(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion
        [HttpGet]
        public JsonNetResult GetUserWiseGodown()
        {
            Dynamic.BusinessEntity.Inventory.GodownCollections dataColl = new Dynamic.BusinessEntity.Inventory.GodownCollections();
            try
            {
                dataColl = new Dynamic.DataAccess.Inventory.GodownDB(User.HostName, User.DBName).getUserWiseGodown(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllRack()
        {
            var dataColl = new Dynamic.DataAccess.Inventory.RackDB(User.HostName, User.DBName).getAllRack(User.UserId);

            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #region "Product Type"

        public ActionResult ProductType()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveProductType()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductType>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.Name == null)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductType(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductType(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductCompany)]
        public JsonNetResult getProductTypeById(int ProductTypeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductType(User.HostName, User.DBName).getProductTypeById(User.UserId, ProductTypeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllProductType()
        {
            Dynamic.BusinessEntity.Inventory.ProductTypeCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductTypeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductType(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "Product Division"

        public ActionResult ProductDivision()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveProductDivision()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductDivision>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.Name == null)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductDivision(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductDivision(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllProductDivision()
        {
            Dynamic.BusinessEntity.Inventory.ProductDivisionCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductDivisionCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductDivision(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductCompany)]
        public JsonNetResult getProductDivisionById(int ProductDivisionId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductDivision(User.HostName, User.DBName).getProductDivisionById(User.UserId, ProductDivisionId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Product Brand"
        public ActionResult ProductBrand()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveProductBrand()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductBrand>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.Name == null)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductBrand(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductBrand(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductCompany)]
        public JsonNetResult getProductBrandById(int ProductBrandId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductBrand(User.HostName, User.DBName).getProductBrandById(User.UserId, ProductBrandId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllProductBrand()
        {
            Dynamic.BusinessEntity.Inventory.ProductBrandCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductBrandCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductBrand(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "Product Scheme"

        public ActionResult ProductScheme()
        {
            return View();
        }
        [HttpPost]
        public JsonNetResult SaveProductScheme()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductScheme>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.Name == null)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductScheme(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductScheme(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "ProductShape"

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductShape)]
        public ActionResult ProductShape()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductShape)]

        public JsonNetResult SaveProductShape()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductShape>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.ProductShapeId > 0)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductShape(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductShape(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductShape)]
        public JsonNetResult getProductShapeById(int ProductShapeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductShape(User.HostName, User.DBName).getProductShapeById(User.UserId, ProductShapeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductShape)]
        public JsonNetResult DeleteProductShape(int ProductShapeId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProductShapeId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Product Shape name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.ProductShape(User.HostName, User.DBName).DeleteById(ProductShapeId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetProductShape()
        {
            Dynamic.BusinessEntity.Inventory.ProductShapeCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductShapeCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductShape(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "ProductColor"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductColor)]
        public ActionResult ProductColor()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductColor)]
        public JsonNetResult SaveProductColor()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductColor>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.ProductColorId > 0)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductColor(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductColor(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductColor)]
        public JsonNetResult getProductColorById(int ProductColorId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductColor(User.HostName, User.DBName).getProductColorById(User.UserId, ProductColorId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductColor)]
        public JsonNetResult DeleteProductColor(int ProductColorId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProductColorId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Product Color name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.ProductColor(User.HostName, User.DBName).DeleteById(ProductColorId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductColor()
        {
            Dynamic.BusinessEntity.Inventory.ProductColorCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductColorCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductColor(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        #endregion

        #region "ProductFlavour"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductFlavour)]
        public ActionResult ProductFlavour()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductFlavour)]
        public JsonNetResult SaveProductFlavour()
        {


            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductFlavour>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.ProductFlavourId > 0)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductFlavour(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductFlavour(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductFlavour)]
        public JsonNetResult getProductFlavourById(int ProductFlavourId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductFlavour(User.HostName, User.DBName).getProductFlavourById(User.UserId, ProductFlavourId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductFlavour)]
        public JsonNetResult DeleteProductFlavour(int ProductFlavourId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProductFlavourId < 0)
                {
                    resVal.ResponseMSG = "can't delete default ProductFlavour name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.ProductFlavour(User.HostName, User.DBName).DeleteById(ProductFlavourId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductFlavour()
        {
            Dynamic.BusinessEntity.Inventory.ProductFlavourCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductFlavourCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductFlavour(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        #endregion

        #region "ProductGroup"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductGroup)]
        public ActionResult ProductGroup()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductGroup)]
        public JsonNetResult SaveProductGroup()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductGroup>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.ProductGroupId > 0)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductGroup()
        {
            Dynamic.BusinessEntity.Inventory.ProductGroupCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductGroupCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllProductGroup()
        {
            Dynamic.BusinessEntity.Inventory.ProductGroupCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductGroupCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };

        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductGroup)]
        public JsonNetResult getProductGroupById(int ProductGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).getProductGroupById(User.UserId, ProductGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductGroup)]
        public JsonNetResult DeleteProductGroup(int ProductGroupId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProductGroupId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.ProductGroup(User.HostName, User.DBName).DeleteById(ProductGroupId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        #endregion

        #region "Product Categories"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductCategories)]
        public ActionResult ProductCategories()
        {
            return View();
        }

        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductCategories)]
        [HttpPost]
        public JsonNetResult SaveProductCategory()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductCategories>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.Name == null)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductCategories(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductCategories(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductCategories()
        {
            Dynamic.BusinessEntity.Inventory.ProductCategoriesCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductCategoriesCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductCategories(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductCategories)]
        public JsonNetResult getProductCategoriesById(int ProductCategoriesId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductCategories(User.HostName, User.DBName).getProductCategoriesById(User.UserId, ProductCategoriesId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductCategories)]
        public JsonNetResult deleteProductCategories(int ProductCategoriesId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProductCategoriesId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.ProductCategories(User.HostName, User.DBName).DeleteById(ProductCategoriesId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region "Unit"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductUnit)]
        public ActionResult Unit()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductUnit)]
        public JsonNetResult SaveUnit()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Unit>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.UnitId > 0)
                        resVal = new Dynamic.BusinessLogic.Inventory.Unit(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.Unit(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetProductMarketValuation()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Inventory.MarketValuationMethods)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllUnit()
        {
            Dynamic.BusinessEntity.Inventory.UnitCollections dataColl = new Dynamic.BusinessEntity.Inventory.UnitCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.Unit(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductUnit)]
        public JsonNetResult getUnitById(int UnitId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.Unit(User.HostName, User.DBName).getUnitById(User.UserId, UnitId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.DebtorRoute)]
        public JsonNetResult deleteUnit(int UnitId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (UnitId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.Unit(User.HostName, User.DBName).DeleteById(UnitId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion

        #region"ProductCompany"
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.View, (int)FormsEntity.ProductCompany)]
        public ActionResult ProductCompany()
        {
            return View();
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Save, (int)FormsEntity.ProductCompany)]
        public JsonNetResult SaveProductCompany()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductCompany>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;

                    if (beData.ProductCompanyId > 0)
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductCompany(User.HostName, User.DBName).ModifyFormData(beData);
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.ProductCompany(User.HostName, User.DBName).SaveFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAllProductCompany()
        {
            Dynamic.BusinessEntity.Inventory.ProductCompanyCollections dataColl = new Dynamic.BusinessEntity.Inventory.ProductCompanyCollections();
            try
            {
                dataColl = new Dynamic.BusinessLogic.Inventory.ProductCompany(User.HostName, User.DBName).getAllAsList(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Modify, (int)FormsEntity.ProductCompany)]
        public JsonNetResult getProductCompanyById(int ProductCompanyId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal = new Dynamic.BusinessLogic.Inventory.ProductCompany(User.HostName, User.DBName).getProductCompanyById(User.UserId, ProductCompanyId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpPost]
        [PermissionsAttribute(Dynamic.BusinessEntity.Global.Actions.Delete, (int)FormsEntity.ProductCompany)]
        public JsonNetResult deleteProductCompany(int ProductCompanyId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (ProductCompanyId < 0)
                {
                    resVal.ResponseMSG = "can't delete default Debtor Creditor name";
                    resVal.IsSuccess = false;
                }
                else
                    resVal = new Dynamic.BusinessLogic.Inventory.ProductCompany(User.HostName, User.DBName).DeleteById(ProductCompanyId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        #endregion
        public ActionResult PartywiseproductRate()
        {
            return View();
        }

        public ActionResult PurchaseRateTypes()
        {
            return View();
        }
        public ActionResult SalesRateTypes()
        {
            return View();
        }
        public ActionResult BranchwiseProductRate()
        {
            return View();
        }
        public ActionResult ProductDefaultValues()
        {
            return View();
        }
        public ActionResult ProductAdditionalRateFormula()
        {
            return View();

        }
        public ActionResult FixedProductRateList()
        {
            return View();
        }
        public ActionResult ProductSchema()
        {
            return View();
        }
        public ActionResult ProductBundle()
        {
            return View();
        }
        public ActionResult SalesPrice()
        {
            return View();
        }
        public ActionResult AgentNumbering()
        {
            return View();
        }

        [HttpPost]
        public JsonNetResult SaveAgentNumbering()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<PivotalERP.BE.AgentNumberingCollections>(Request["jsonData"]);
                if (beData != null)
                {
                    resVal = new PivotalERP.BL.AgentNumbering(User.UserId, User.HostName, User.DBName).SaveUpdate(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        //Rikesh Code
        #region "DeliveryThrough"
        //[HttpPost]
        ////[PermissionsAttribute(Actions.Save, (int)ENTITIES.ClassSetup, false)]
        //public JsonNetResult SaveDeliveryThrough()
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.DeliveryThrough>(Request["jsonData"]);
        //        if (beData != null)
        //        {
        //            beData.CUserId = User.UserId;
        //            if (!beData.DeliveryThroughId.HasValue)
        //                beData.DeliveryThroughId = 0;

        //            resVal = new DeliveryThrough(User.UserId, User.HostName, User.DBName).SaveFormData(beData);

        //        }
        //        else
        //        {
        //            resVal.ResponseMSG = "Blank Data Can't be Accept";
        //        }
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        //[HttpGet]
        //public JsonNetResult GetAllDeliveryThrough()
        //{
        //    Dynamic.BusinessEntity.Inventory.DeliveryThroughCollections dataColl = new Dynamic.BusinessEntity.Inventory.DeliveryThroughCollections();
        //    try
        //    {
        //        dataColl = new DeliveryThrough(User.UserId, User.HostName, User.DBName).GetAllDeliveryThrough(0);
        //        return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //    }
        //    catch (Exception ee)
        //    {
        //        dataColl.IsSuccess = false;
        //        dataColl.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}
        //[HttpPost]
        //public JsonNetResult GetDeliveryThroughById(int DeliveryThroughId)
        //{
        //    Dynamic.BusinessEntity.Inventory.DeliveryThrough resVal = new Dynamic.BusinessEntity.Inventory.DeliveryThrough();
        //    try
        //    {
        //        resVal = new DeliveryThrough(User.UserId, User.HostName, User.DBName).GetDeliveryThroughById(0, DeliveryThroughId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        //[HttpPost]
        ////[PermissionsAttribute(Actions.Delete, (int)ENTITIES.ClassSetup, false)]
        //public JsonNetResult DelDeliveryThrough(int DeliveryThroughId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        resVal = new DeliveryThrough(User.UserId, User.HostName, User.DBName).DeleteById(0, DeliveryThroughId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        #endregion
        //Rikesh

        public ActionResult GatePass()
		{
            return View();
		}

        [HttpPost]
		public JsonNetResult SaveGatePass()
		{
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.GatePass>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.CUserId = User.UserId;
                    if (beData.TranId != null)
					{
                        resVal = new Dynamic.BusinessLogic.Inventory.Transaction.GatePass(User.HostName, User.DBName).SaveFormData(beData);
                    }
                    else
                        resVal = new Dynamic.BusinessLogic.Inventory.Transaction.GatePass(User.HostName, User.DBName).ModifyFormData(beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        public ActionResult BOM()
        {
            return View();
        }
        public ActionResult FixedUnit()
        {
            return View();
        }


        [HttpPost]
        public JsonNetResult SaveFixedUnit()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.Transaction.FixedUnit>(Request["jsonData"]);
                if (beData != null)
                {                  
                    resVal = new Dynamic.BL.Inventory.Transaction.FixedUnit(User.UserId,User.HostName, User.DBName).SaveFormData(beData);

                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
       
        public JsonNetResult GetAllFixedUnit()
        {
            var dataColl = new Dynamic.BL.Inventory.Transaction.FixedUnit(User.UserId, User.HostName, User.DBName).GetFixedUnit();

            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "" };
        }

        #region "ProductInOutType"

        public ActionResult ProductInOutType()
        {
            return View();
        }

        //[HttpPost]
        //public JsonNetResult SaveUpdateProductInOutType()
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        var beData = DeserializeObject<Dynamic.BusinessEntity.Inventory.ProductInOutType>(Request["jsonData"]);
        //        Console.WriteLine();
        //        if (beData != null)
        //        {
        //            beData.CUserId = User.UserId;
        //            beData.BDId = User.BranchId;

        //            resVal = new ProductInOutType(User.UserId, User.HostName, User.DBName).SaveUpdateProductInOutType(beData);

        //        }
        //        else
        //        {
        //            resVal.ResponseMSG = "Blank Data Can't be Accept";
        //        }
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}
        //[HttpPost]
        //public JsonNetResult GetAllProductInOutType()
        //{
        //    var dataColl = new Dynamic.BusinessLogic.Inventory.ProductInOutType(User.UserId, User.HostName, User.DBName).GetAllProductInOutType(0);
        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        //[HttpPost]
        //public JsonNetResult GetProductInOutTypeById(int TranId)
        //{
        //    var dataColl = new Dynamic.BusinessLogic.Inventory.ProductInOutType(User.UserId, User.HostName, User.DBName).GetProductInOutTypeById(0, TranId);
        //    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.IsSuccess ? 1 : 0, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        //}

        //[HttpPost]
        //public JsonNetResult DeleteProductInOutType(int TranId)
        //{
        //    ResponeValues resVal = new ResponeValues();
        //    try
        //    {
        //        resVal = new BL.ProductInOutType(User.UserId, User.HostName, User.DBName).DeleteProductInOutType(0, TranId);
        //    }
        //    catch (Exception ee)
        //    {
        //        resVal.IsSuccess = false;
        //        resVal.ResponseMSG = ee.Message;
        //    }
        //    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        //}

        #endregion

    }
}