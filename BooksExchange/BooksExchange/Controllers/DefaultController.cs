using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using BooksExchange.Models;
using System.Data.Entity;
using System.Net;

namespace BooksExchange.Controllers
{
    public class DefaultController : Controller
    {
        public async Task<string> UploadImage(HttpPostedFileBase img)
        {
            try
            {

                if (img != null && img.ContentLength > 0)
                {
                    string ext = Path.GetExtension(img.FileName);
                    var path = Path.Combine(Server.MapPath("~/images/" + img.FileName));
                    img.SaveAs(path);
                    return "/images/" + img.FileName;
                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Register(string name, string email, string mobile, string password, string repassword, HttpPostedFileBase image = null)
        {
            try
            {
                if (image == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "image is required!" });
                string[] Data = { name, email, mobile, password, repassword };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required!" });
                if(password != repassword)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "password doesn't match!" });
                if (await Helpers.EmailExist(email.Trim()))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "email already exist!" });
                if (await Helpers.MobileExist(mobile.Trim()))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "mobile already exist!" });
                string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                int type = 0;
                if(ip == null)
                {
                    ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                    type = 1;
                }
                if (await InsertData.NewUser(name, email, mobile, password, await Helpers.GetLocation(ip, type), await UploadImage(image)))
                    return Json(new { code = HttpStatusCode.OK });
                return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> Login(string email, string password)
        {
            try
            {
                string[] Data = { email, password };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required!" });
                object Info = await FetchData.CheckLogin(email, password);
                if (Info == null)
                    return Json(new { code = HttpStatusCode.Forbidden });
                else
                    return Json(new { code = HttpStatusCode.OK, Data = Info });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> SetPreferences(string token, int[] id)
        {
            try
            {
                if (id.Count() <= 0)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "please select at least one genera!" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await InsertData.UserPreferences(token, id))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> UserInfoById(int? id, bool profile = false)
        {
            try
            {
                if (id == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" }, JsonRequestBehavior.AllowGet);
                string token = await Helpers.GetUserTokenByID(id.Value);
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "user not found" }, JsonRequestBehavior.AllowGet);
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.UserInfoById(id.Value, profile)}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> SendCode(string email)
        {
            if (string.IsNullOrEmpty(email.Trim()))
                return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required!" }, JsonRequestBehavior.AllowGet);
            return Json(new { code = HttpStatusCode.OK, message = await InsertData.CreateVerifyCode(email) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> CheckCode(string email, string code, string password, string repassword)
        {
            string[] Data = { email, code, password, repassword };
            if (Helpers.NullOrEmpty(Data))
                return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" });
            if(password != repassword)
                return Json(new { code = HttpStatusCode.BadRequest, error = "password doesn't match" });
            if (await Helpers.CheckVerifyCode(email, code, password))
                return Json(new { code = HttpStatusCode.OK }, JsonRequestBehavior.AllowGet);

            return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again" });
        }
    }
}