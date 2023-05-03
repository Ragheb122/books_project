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
    }
}