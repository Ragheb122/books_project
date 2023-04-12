using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    public class InsertData
    {
        static public async Task<bool> NewUser(string name, string email, string mobile, string password, int city, string img)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User use = new User()
                    {
                        name = name,
                        email = email,
                        mobile = mobile,
                        password = Helpers.GetMD5Hash(password),
                        token = await Helpers.GetRandomString(),
                        city = city,
                        created_at = DateTime.Now,
                        image = img
                    };
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<bool> NewPost(string title, string description, int id, string img)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Post post = new Post()
                    {
                        title = title,
                        description = description,
                        user_id = id,
                        image = img,
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now
                    };
                    db.Posts.Add(post);
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        static public async Task<bool> MakeRedeemRequest(string token, int amount)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    GiftRequest request = new GiftRequest()
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        user_id = await Helpers.GetUserIDByToken(token),
                        requested = amount
                    };
                    db.GiftRequests.Add(request);
                    if (await db.SaveChangesAsync() > 0)
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}