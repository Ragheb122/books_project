using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    public class UpdateData
    {
        // mark a book as traded.
        static public async Task<bool> Traded(int id)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    Post post = await db.Posts.FindAsync(id);
                    if (post == null)
                        return false;
                    else
                    {
                        post.traded = true;
                        post.updated_at = DateTime.Now;
                        db.Entry(post).State = EntityState.Modified;
                        if (await db.SaveChangesAsync() > 0)
                            return true;
                        else
                            return false;
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        // update user's data.
        static public async Task<bool> UpdateUser(string token, string name, string email, string mobile, string password, string image)
        {
            try
            {
                int id = await Helpers.GetUserIDByToken(token);
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User user = await db.Users.FindAsync(id);
                    User check = await db.Users.Where(o => o.email == email && o.id != id).FirstOrDefaultAsync();
                    if (check != null)
                        return false;
                    if (!string.IsNullOrEmpty(name))
                        user.name = name;
                    if (!string.IsNullOrEmpty(email))
                        user.email = email;
                    if (!string.IsNullOrEmpty(mobile))
                        user.mobile = mobile;
                    if (!string.IsNullOrEmpty(password) && password != "")
                        user.password = Helpers.GetMD5Hash(password);
                    if (!string.IsNullOrEmpty(image))
                        user.image = "http://localhost:1338/" + image;
                    db.Entry(user).State = EntityState.Modified;
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
        // update 10 posts's status as redeemed
        static public async Task<bool> RedeemRequest(string ids, string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    string[] Arr = ids.Split(',');
                    foreach (var item in Arr)
                    {
                        if (item != null)
                        {
                            int? id = int.Parse(item);
                            if (id != null)
                            {
                                GiftRequest gift = await db.GiftRequests.FindAsync(id.Value);
                                if (gift == null)
                                    return false;
                                List<Post> posts = await db.Posts.Where(o => o.user_id == gift.user_id && o.traded == true && o.approved == true).Take(10).ToListAsync();
                                foreach (Post items in posts)
                                {
                                    if (items != null)
                                    {
                                        items.redeemed = true;
                                        db.Entry(items).State = EntityState.Modified;
                                    }
                                }
                                gift.sent = true;
                                gift.updated_at = DateTime.Now;
                                db.Entry(gift).State = EntityState.Modified;
                            }
                        }
                    }
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
        static public async Task<bool> UpdatePostStatus(string ids, int status, string token)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    string[] Arr = ids.Split(',');
                    foreach (var item in Arr)
                    {
                        if (item != null)
                        {
                            int? id = int.Parse(item);
                            if (item != null)
                            {
                                Post post = await db.Posts.FindAsync(id.Value);
                                if (post == null)
                                    return false;
                                if (status == 0)
                                {
                                    post.approved = true;
                                    db.Entry(post).State = EntityState.Modified;
                                }
                                else if (status == 1)
                                {
                                    if (await DeleteData.removePost(ids, token = "ads"))
                                        return true;
                                    else
                                        return false;
                                }
                            }
                        }
                    }

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
        // update a user to admin.
        static public async Task<bool> MakeAdmin(string ids, int id_)
        {
            try
            {
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    string[] Arr = ids.Split(',');
                    foreach (var arr in Arr)
                    {
                        if (arr != null)
                        {
                            int? id = int.Parse(arr);
                            if (id != null)
                            {
                                User user = await db.Users.FindAsync(id.Value);
                                if (user != null)
                                {
                                    if (user.id != id_)
                                    {
                                        if (user.admin == false)
                                            user.admin = true;
                                        else
                                            user.admin = false;
                                        db.Entry(user).State = EntityState.Modified;
                                    }
                                }
                            }
                        }
                    }
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