using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using BooksExchange.Models;
using System.Net;
using Newtonsoft.Json.Linq;

namespace BooksExchange.Controllers
{
    public class DefaultController : Controller
    {
        // uploading image for a user.
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
        public async Task<ActionResult> Register(int? id, int city, string name, string email, string mobile, int[] books, string password = "", string repassword = "", HttpPostedFileBase image = null)
        {
            try
            {
                string img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAVFBMVEWZmZn///+WlpaampqTk5P39/efn5/19fX8/PygoKD5+fmjo6POzs6wsLDBwcHp6ena2tq6urqqqqrR0dHs7Ozi4uLGxsbPz8+0tLTj4+Pc3Ny9vb0PK3Y6AAAHRklEQVR4nO2dDXuiMAzHaVooUEAp4jn9/t/zEsDNbb4C9mVPfnd4U3EPf5MmbWl6ScIwDMMwDMMwDMMwDMMwDMMwDMMwDMMwDMNEh8QDEEUP0/M/BSqTtt1XXddV+9ZKpcD3Ja2GJHlZc9TiEn1sMhL5F0wJSjY7cY1dI/+CJZXZXpU3sjXK9wUuRJn+jj6ij1uj6lBDfkcfvdfFK1HV6QMDjqR1pBrV/il9xD5KiepRC7ykj1Hi9Qxxi11siRGkfqzqG1rGlRrhVYFoRd/X/BJq87JAITYRtUV1rxtzm200EtVplkAhTrFINDMFCmEgipA6qxGOxNEUYa6PEqcYUgY81xm9ThqBwhd6o9eIoIcK9wZLj8lV6LEGmkUChWhC91P1Wof7N7vQ3dQuFCiE9S3hPsO0xTICn9RQr48pfqLDVpjdnXd6hlxkvkXcA9rFJhSiDTmawvJmiA0xYIVyQaf7i03ASV+uEGgo1ISrcGmXbSQP2EsxlK5ByMF0/uj+EuNbxh1YISsMX+HfjzTJKtnCt4h7qCWzUGfSkAcXK/XafMu4A8y7YfGdbch9msXzUETYc1FrpIuQkwWFmsVj/KADzSoNMfC7iFAvVlgH3QxxDLw0I6Yhj38JqBYqrMI2IRpRLlQoAzchuumyWLMN3UmRbEm+yIMeV0yoJS2xCjtVTMxYD3VGhx5mBuSCnFjHsdpk/i22wG+sXQC7GbegcrGLII6ekeUMC5YyEh8lwMywoYkizJyB1+/n26gEksTyhbaYizI2gZgzilfSoi4iaoNnAD6eFthDbBYceXqJWwSL2W6gzDPzp5tI1s1eR7WPWqNuVdzVlqCaexp1o5S01kTUm/kNqLq/njfyvlYAxoLKbMyOShqT9vjTknrbjhWktbK1kYXvi3wGmdyeYwF0xnrf9ZvNbrPpu/3hs9Q5M0Yqk8SR8OX9rEal6qhL0cPXiZmRmcHHKBRCUTzVmiZTj6VcUKOBbfAzbAMSslfihQQzTjtZa8n64WtEJ8ymnRPGZ3B++fP98Ykc/Jk0ZbTBgkS/nd7/dm5wkqXJMlIIsqA2VWRZMTwzWUGmAvxn+DOcDKYYTsZHg/kCOzUwvZ2Rxqwo6IegJEqJPkoXDYVK6KKVlKrAiyTXTTIyCCQYYhKFdlOAeUKSS+PH8OSsAKCxBajpdBzs4/tBCUSjkK6C2qKka4RCWkUXj4qkwuu1tj01TVVVezqatrVoWkoZ6KH4CfyYpL/0aTBQmOFL863qAjIgeeLwA/mokgUKRJsVtumOG52neS5yXYoSD5HnJfZyUo2ZsanJniAl2jHLhgOdFA0a2IBxFIaG+1KIkuvqqEmKTss8TVOUVOKRCpSZos601CQ1131Vk53pW5oUJsWYHwMSiZ6FvpVMRsDUXu97NFuudZnSQ64/FaJafIIKS7Qn/VTSF9BXllrhYEf6XVM89q3rAjlGBzQCet2hQx0lXnqelihH6/Rsw0EdGo9u95Pq4eURobuDUvQFUZAiTw1K35QtMF5mtiM/HC4avXAUiDYsyX5apKOsYT51UI9NE78JOrCt6n9WqvF3UVoJrB8wZHTVTqN6MmFJOkpsaRRczkc6vPR50qCUXDaf3v9o1dAzoEATkhEHFNwd7T6LbiDEeRvK16c11u0R6SnEeQ1VL63Lu2QX3IYukBxX1EccQ2qFMlHtGktnv5O3KphICnBcXLJ2RaHYhpLxwawRQa+hw5jbUIc36SMOAQQctcai2ds03iUu3GDgMb7v2tDyoPWDzBc5LSLyGVHfbkHCpxXVGmW/j2m9SVxhQfBz+Jryh+yVxQjzyUXpqSWuUiDzHH7KaDDKuLAgkXtZlQnr1Bo+i4cyk8XbtLyG+01dVqlwegX31VCu2uAZ13WXixZzz8NxsJGuTYhGdJoU1T/nAoX459CIcpX9L14kd7nR2ZtHvbdwOBp2nAvPuMuJM5Y4r4OzMcbC4q35OCovlYmaU2uwBqUrN7XOBhXfyUXtRuAK++rNxVHZkKdISjiKputs0TIPJwWYq+yrNxcn+/F5bIaOGqLDCajfOJmS8tHr/sTJbnVuZ6B+4mBGCg6e8j2Ruwg14OJmzG3271fords94mDPBfV8zd07cBBMPfbZCAf9NvA1dBpxMYDyKlCI968i8tnvJt7f9/ab8F2k/L+v0Nc825n3/8cCrlYn3OLtm505W3/BCt+q0OcA0cGWfH8/H87+T9XW4eCg4EtZf33vPnMxiyETdfAzGXWsna1tB5VVjg1Z9g24LTNBke32XSvYf5BvqtqxPELS/gFgm+3unQNG/dGdzLcdChwzbJMAmT1V241eU2m567t9a6VPcd8YN4SQpm6bqjt+bHa6fLVbkJd6t+m33f50sEUy7CwRYE3+pHTc+ULKzFhbH9q2aZo9Ul1CLzTNqW0PtTUmk3L6IKiwamOvc1lnDg9IfugJzmgMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzDMBf8B1W5aouBvtcYAAAAASUVORK5CYII=";
                if (image != null)
                {
                    img = "http://localhost:1338/" + await UploadImage(image);
                }
                string[] Data = { name, email, mobile };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required!" });
                if (password != repassword && id == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "password doesn't match!" });
                if (await Helpers.EmailExist(email.Trim()) && id == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "email already exist!" });
                if (await Helpers.MobileExist(mobile.Trim()) && id == null)
                    return Json(new { code = HttpStatusCode.BadRequest, error = "mobile already exist!" });
                if (id == null)
                    if (await InsertData.NewUser(name, email, mobile, password, city, img, books))
                    {
                        return Json(new { code = HttpStatusCode.OK });
                    }
                    else if (id != null)
                    {
                        string token = await Helpers.GetUserTokenByID(id.Value);
                        if (await UpdateData.UpdateUser(token, name, email, mobile, password, img))
                            return Json(new { code = HttpStatusCode.OK });
                        else
                        {
                            return Json(new { code = HttpStatusCode.BadRequest, error = "use with the email exist please try another email!" });
                        }
                    }
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
                    return Json(new { code = HttpStatusCode.BadRequest, error = "something went wrong" });
                object Info = await FetchData.CheckLogin(email, password);
                if (Info == null)
                    return Json(new { code = HttpStatusCode.Forbidden });
                else
                {

                    return Json(new { code = HttpStatusCode.OK, Data = Info });
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> UserInfoById(int? id, bool profile = false, string token = "")
        {
            try
            {
                if (id == null)
                {
                    id = await Helpers.GetUserIDByToken(token);
                    if (id.Value == 0)
                        return Json(new { code = HttpStatusCode.BadRequest, error = "all fields are required" }, JsonRequestBehavior.AllowGet);
                }
                string token_ = await Helpers.GetUserTokenByID(id.Value);
                if (!await Helpers.UserExist(token_))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "user not found" }, JsonRequestBehavior.AllowGet);
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.UserInfoById(id.Value, profile) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> Categories()
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetCategories() }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpGet]
        public async Task<ActionResult> Cities()
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetCities() }, JsonRequestBehavior.AllowGet);
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
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.TopBooks() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
        [HttpPost]
        public async Task<ActionResult> AddMessage(string token, string description = "")
        {
            try
            {
                string img = string.Empty;
                //if (image == null)
                //    return Json(new { code = HttpStatusCode.BadRequest, error = "image is required!" });
                string[] Data = { description };
                if (Helpers.NullOrEmpty(Data))
                    return Json(new { code = HttpStatusCode.BadRequest, error = "description is required!" });
                if (!await Helpers.UserExist(token))
                    return Json(new { code = HttpStatusCode.Forbidden });
                if (await InsertData.NewMessage(description, await Helpers.GetUserIDByToken(token)))
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
        [HttpGet]
        public async Task<ActionResult> getMessages()
        {
            try
            {
                return Json(new { code = HttpStatusCode.OK, Data = await FetchData.GetMessages() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
    }