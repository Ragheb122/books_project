using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using BooksExchange.Models;
using System.Text;
using System.Data.Entity;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using Newtonsoft.Json.Linq;

namespace BooksExchange
{
    public class Helpers
    {
        static public async Task<string> GetRandomString(int length = 64)
        {
            string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            string s = "";
            using (RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider())
            {
                while (s.Length != length)
                {
                    byte[] oneByte = new byte[1];
                    provider.GetBytes(oneByte);
                    char character = (char)oneByte[0];
                    if (valid.Contains(character))
                    {
                        s += character;
                    }
                }
            }
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User UserToken = await db.Users.FirstOrDefaultAsync(o => o.token == s);
                if (UserToken != null)
                    return await GetRandomString(64);
                else
                    return s;
            }
        }
        public static string GetMD5Hash(string value)
        {
            try
            {
                MD5 md5Hasher = MD5.Create();
                byte[] data = md5Hasher.ComputeHash(Encoding.Default.GetBytes(value));
                StringBuilder sBuilder = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString());
                }
                return sBuilder.ToString();
            }
            catch (Exception)
            {
                throw;
            }
        }
        static public bool NullOrEmpty(string[] Data)
        {
            try
            {
                //loop through the given array to see if it has value or not
                foreach (var item in Data)
                {
                    if (string.IsNullOrEmpty(item) || string.IsNullOrWhiteSpace(item))
                    {
                        //if it doesn't have a value
                        return true;
                    }
                }
                //if they has a value
                return false;
            }
            catch (Exception)
            {

                return true;
            }
        }
        static public async Task<bool> EmailExist(string email)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User use = await db.Users.FirstOrDefaultAsync(o => o.email == email);
                    if (use == null)
                        return false;
                    else return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<bool> MobileExist(string mobile)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User use = await db.Users.FirstOrDefaultAsync(o => o.mobile == mobile);
                    if (use == null)
                        return false;
                    else return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<string> GetUserTokenByID(int id)
        {
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                User u = await db.Users.FindAsync(id);
                if (u == null)
                    return "0";
                else
                    return u.token;
            }
        }
        static public async Task<int> GetUserIDByToken(string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User u = await db.Users.FirstOrDefaultAsync(o => o.token == token);
                    if (u == null)
                        return 0;
                    else
                        return u.id;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<int> GetLocation(string ip, int type)
        {
            try
            {
                if (type == 1)
                {
                    string url = "http://ipinfo.io/" + ip + "?access_key=fa61d231a30252";
                    var request = System.Net.WebRequest.Create(url);
                    using (WebResponse webresponse = request.GetResponse())
                    {
                        using (Stream stream = webresponse.GetResponseStream())
                        {
                            using (StreamReader reader = new StreamReader(stream))
                            {
                                string jsonResponse = reader.ReadToEnd();
                                var ipInfo = JObject.Parse(jsonResponse);
                                //return Json(new { code = HttpStatusCode.OK, city = (string)ipInfo["city"] });
                                return await CheckCity((string)ipInfo["city"]);
                            }
                        }
                    }
                }
                else
                {
                    string url = "http://ipinfo.io/" + ip + "?access_key=fa61d231a30252";
                    var request = System.Net.WebRequest.Create(url);
                    using (WebResponse webresponse = request.GetResponse())
                    {
                        using (Stream stream = webresponse.GetResponseStream())
                        {
                            using (StreamReader reader = new StreamReader(stream))
                            {
                                string jsonResponse = reader.ReadToEnd();
                                var ipInfo = JObject.Parse(jsonResponse);
                                //return Json(new { code = HttpStatusCode.OK, city = (string)ipInfo["city"] });
                                return await CheckCity((string)ipInfo["city"]);
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<int> CheckCity(string name)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    City city = await db.Cities.FirstOrDefaultAsync(o => o.name == name);
                    if (city != null)
                        return city.id;
                    else
                    {
                        City newCity = new City()
                        {
                            name = name,
                            created_at = DateTime.Now
                        };
                        db.Cities.Add(newCity);
                        if (await db.SaveChangesAsync() > 0)
                            return newCity.id;
                    }
                    return 0;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        static public async Task<bool> UserExist(string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User user = await db.Users.FirstOrDefaultAsync(o => o.token == token);
                    if (user != null)
                        return true;
                    else return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<bool> PostOwner(string token, int postID)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    int? id = await GetUserIDByToken(token);
                    if (id.Value != 0)
                    {
                        Post post = await db.Posts.FirstOrDefaultAsync(o => o.id == postID && o.user_id == id);
                        if (post != null)
                            return true;
                        else return false;
                    }
                    else
                        return false;

                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        static public async Task<bool> haveEnoghBooksToRedeem(string token, int requested)
        {
            try
            {
                int? id = await GetUserIDByToken(token);
                if (id.Value != 0)
                {
                    using (book_exchangeEntities db = new book_exchangeEntities())
                    {
                        int count = await db.Posts.Where(o => o.user_id == id.Value && o.traded == true && o.redeemed == false).CountAsync();
                        if (count >= requested)
                            return true;
                        else
                            return false;
                    }
                }
                else
                    return false;

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}