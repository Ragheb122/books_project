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
    public class UserProfileController : Controller
    {
        // upload profile's image.
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
        [HttpGet]
        public async Task<ActionResult> Index(int? id, string token = "", bool vistor = false)
        {
            try
            {
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden }, JsonRequestBehavior.AllowGet);
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GivenAndTakenBooksCount(vistor, id.Value, token) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> RedeemGiftCard(string token, int? amount)
        {
            try
            {
                string[] Data = { token, amount.ToString() };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (!await Helpers.haveEnoghBooksToRedeem(token, amount.Value))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "don't have enough given books credit matching the requested amount!" });
                if (await InsertData.MakeRedeemRequest(token, amount.Value))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> EditProfile(string name, string email, string mobile, string password, string repassword, string token = "", HttpPostedFileBase image = null)
        {
            try
            {
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (password != repassword)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "passwords must match!" });
                string img = string.Empty;
                if (image != null)
                {
                    img = await UploadImage(image);
                }
                if (await UpdateData.UpdateUser(token, name, email, mobile, password, img))
                    return Json(new { code = HttpStatusCode.OK });
                return Json(new { code = HttpStatusCode.InternalServerError, error = "there's a user with the same email please try another one!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> RateUser(int? id ,string token, int rate = 0)
        {
            string[] Data = { token, id.ToString() };
            if (Helpers.NullOrEmpty(Data))
                return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" });
            if (!await Helpers.UserExist(token))
                return Json(new { code = HttpStatusCode.Forbidden });
            if(rate <= 0 || rate > 5)
                return Json(new { code = HttpStatusCode.BadRequest, error = "rate must be greater than zero and less or equal to five!" });
            if(await InsertData.NewUserRate(id.Value, rate, token))
                return Json(new { code = HttpStatusCode.OK });

            return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });
        }
    }
}