using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Net;

namespace BooksExchange.Controllers
{
    public class AdminController : Controller
    {
        [HttpGet]
        // get all users to show in admin's panel.
       public async Task<ActionResult> Users(string token)
        {
            string[] Data = { token };
            if (Helpers.NullOrEmpty(Data))
                return Json(new { code = HttpStatusCode.BadRequest }, JsonRequestBehavior.AllowGet);
            if(!await Helpers.IsAdmin(token))
                return Json(new { code = HttpStatusCode.Forbidden }, JsonRequestBehavior.AllowGet);

            return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetUsers(token) }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        // get all requests to redeem gift card in admin's panel.
        public async Task<ActionResult> RedeemRequests(string token)
        {
            string[] Data = { token };
            if (Helpers.NullOrEmpty(Data))
                return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" }, JsonRequestBehavior.AllowGet);
            if (!await Helpers.IsAdmin(token))
                return Json(new { code = HttpStatusCode.Forbidden }, JsonRequestBehavior.AllowGet);

            return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetRedeemRequests() }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        // accept a redeem request from admin's panel.
        public async Task<ActionResult> AcceptReedemRequest(string token, string id)
        {
            try
            {
                string[] Data = { token, id };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                if (!await Helpers.IsAdmin(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await UpdateData.RedeemRequest(id, token))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        // update post status
        [HttpPost]
        public async Task<ActionResult> PostStatus(string token, string id, int status = 0)
        {
            try
            {
                if(status < 0 || status > 1)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "entry aren't valid" });
                string[] Data = { token, id };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                if (!await Helpers.IsAdmin(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await UpdateData.UpdatePostStatus(id, status, token = "ads"))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        // delete a user in admin's panel.
        public async Task<ActionResult> DeleteUser(string token, string id)
        {
            try
            {
                string[] Data = { token, id };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                if (!await Helpers.IsAdmin(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await DeleteData.RemoveUser(id))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        // add or delete category from the admin's panel.
        public async Task<ActionResult> Category(string token, string name, string id, int update = 0)
        {
            try
            {
                string[] Data = { token, name, id };
                if (Helpers.NullOrEmpty(Data) && update < 2)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                if (!await Helpers.IsAdmin(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if(update == 0)
                {
                    if (await InsertData.NewCategory(name))
                        return Json(new { code = HttpStatusCode.OK });
                    else
                        return Json(new { code = HttpStatusCode.InternalServerError, error = "there's a category with the same name!" });
                }
                else if(update == 2)
                {
                    if(await DeleteData.RemoveCategory(id))
                        return Json(new { code = HttpStatusCode.OK });
                    else
                        return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again!" });
                }
                else
                    return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        // get not approved posts in admin's panel.
        public async Task<ActionResult> Posts(string token)
        {
            try
            {
                string[] Data = { token };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" }, JsonRequestBehavior.AllowGet);
                if (!await Helpers.IsAdmin(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetAllPosts() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        // check login and return logged in user's data.
        public async Task<ActionResult> Login(string email, string password)
        {
            try
            {
                string[] Data = { email, password };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                object Info = await FetchData.CheckLogin(email, password);
                if (Info == null || !await Helpers.IsAdmin(await Helpers.GetTokenIDByEmail(email)))
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
        // update user to admin.
        public async Task<ActionResult> MakeUserAdmin(string token, string id)
        {
            try
            {
                string[] Data = { token, id };
                if (Helpers.NullOrEmpty(Data) || id == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                if (!await Helpers.IsAdmin(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await UpdateData.MakeAdmin(id, await Helpers.GetUserIDByToken(token)))
                    return Json(new { code = HttpStatusCode.OK });

                return Json(new { code = HttpStatusCode.InternalServerError, error = "please try again!" });
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}