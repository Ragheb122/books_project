using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Net;
using BooksExchange.Models;

namespace BooksExchange.Controllers
{
    public class PostsController : Controller
    {
        // upload book's image.
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
        public async Task<ActionResult> RecommendedBooks(string token)
        {
            try
            {
                    return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetRecommendedData(await Helpers.GetUserIDByToken(token)) }, JsonRequestBehavior.AllowGet);
                   // return Json(new { code = HttpStatusCode.OK, Data = await Helpers.recommentionSysAsync(token) },JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        // returns most popular books
        public async Task<ActionResult> MostPopular()
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = Helpers.finaldata }, JsonRequestBehavior.AllowGet);
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
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (!await Helpers.PostOwner(token, id.Value))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await UpdateData.Traded(id.Value))
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
                //if (image == null)
                //    return Json(new { code = HttpStatusCode.BadRequest, error = "image is required!" });
                string[] Data = { title, description };
                if (Helpers.NullOrEmpty(Data) || genera == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required!" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await InsertData.NewPost(title, description, await Helpers.GetUserIDByToken(token), await UploadImage(image), genera))
                {
                    _ = Task.Run(async () =>
                    {
                        int a = await Helpers.recommentionSysAsync(token);
                        // Perform any necessary background operations here
                    });
                    return Json(new { code = HttpStatusCode.OK });
                }
                else
                    return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });

            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> PostById(int id)
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetPostByID(id) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> getComments(int id)
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetCommentsByPostID(id) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> AddComment(string token, int postID, string description = "")
        {
            try
            {
                string img = string.Empty;
                //if (image == null)
                //    return Json(new { code = HttpStatusCode.BadRequest, error = "image is required!" });
                string[] Data = {description };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "description is required!" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await InsertData.NewComment(description, postID, await Helpers.GetUserIDByToken(token)))
                {
                    return Json(new { code = HttpStatusCode.OK });
                }
                else
                    return Json(new { code = HttpStatusCode.InternalServerError, error = "something went wrong please try again!" });

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}