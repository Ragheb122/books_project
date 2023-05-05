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
    public class PostsController : Controller
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

        [HttpGet]
        public async Task<ActionResult> index()
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetPosts() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> Books()
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetStaticsPosts() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> BooksRef(string token)
        {
            try
            {
                int? id = await Helpers.GetUserIDByToken(token);
                if (id != null && id.Value != 0)
                {
                    return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetPostsByRef(id.Value) }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { code = HttpStatusCode.Forbidden }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> RemovePost(string token, int? id)
        {
            try
            {
                string[] Data = { token, id.ToString() };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if(!await Helpers.PostOwner(token, id.Value))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if(await DeleteData.removePost(id.Value))
                    return Json(new { code = HttpStatusCode.OK });
                else
                    return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });

            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> MarkAsTraded(string token, int? id)
        {
            try
            {
                string[] Data = { token, id.ToString() };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (!await Helpers.PostOwner(token, id.Value))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await UpdateData.markAsRead(id.Value))
                    return Json(new { code = HttpStatusCode.OK });
                else
                    return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> AddPost(string title, string token, int[] genera, string description = "", HttpPostedFileBase image = null)
        {
            try
            {
                string img = string.Empty;
                if (image == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "image is required!" });
                string[] Data = { title, token };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required!" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await InsertData.NewPost(title, description, await Helpers.GetUserIDByToken(token), await UploadImage(image), genera))
                    return Json(new { code = HttpStatusCode.OK });
                else
                    return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });

            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> EditPost(int id, string title, string token, int[] genera, string description, HttpPostedFileBase image = null)
        {
            if (!await Helpers.UserExist(token))
                return Json(new { code = HttpStatusCode.Forbidden });

            string img = string.Empty;
            if(image != null)
            {
                img = await UploadImage(image);
            }
            return Json(new { code = HttpStatusCode.OK, message = await UpdateData.UpdatePost(id, title, token, genera, description, img) });
        }
    }
}