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
    public class ChatController : Controller
    {
        [HttpGet]
        public async Task<ActionResult> Index(string token)
        {
            try
            {
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden }, JsonRequestBehavior.AllowGet);
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetChats(token) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> ChatMessages(string token, int id)
        {
            try
            {
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden }, JsonRequestBehavior.AllowGet);
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetChatMessages(token, id) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> StartChat(string token, int id)
        {
            try
            {
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                return Json(new { code = HttpStatusCode.OK, Data = await InsertData.NewChat(token, id) });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> SendMessage(string token, int? id, string message, int? userID)
        {
            try
            {
                string[] Data = { token, message };
                if (Helpers.NullOrEmpty(Data) && id != null && userID != null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await InsertData.NewMessage(token, id.Value, message, userID.Value))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError });
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}