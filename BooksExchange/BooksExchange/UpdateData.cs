using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    public class UpdateData
    {
        static public async Task<bool> markAsRead(int id)
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
        static public async Task<string> UpdatePost(int postID, string title, string token, int[] genera, string description, string image)
        {
            int id = await Helpers.GetUserIDByToken(token);
            using (book_exchangeEntities db = new book_exchangeEntities())
            {
                Post post = await db.Posts.Where(o => o.id == postID && o.user_id == id).FirstOrDefaultAsync();
                int updated = 0;
                if (post == null)
                    return "post not found";
                if (!string.IsNullOrEmpty(title))
                {
                    updated++;
                    post.title = title;
                }
                if (!string.IsNullOrEmpty(description))
                {
                    updated++;
                    post.description = description;
                }
                if (!string.IsNullOrEmpty(image))
                {
                    updated++;
                    post.image = image;
                }
                if (genera.Length < 0)
                {
                    List<PostsGenera> generas = await db.PostsGeneras.Where(o => o.post_id == postID).ToListAsync();
                    foreach (PostsGenera item in generas)
                    {
                        if (item != null)
                        {
                            db.Entry(generas).State = EntityState.Deleted;
                        }
                    }
                    foreach (int item in genera)
                    {
                        PostsGenera postGen = new PostsGenera()
                        {
                            genera_id = item,
                            post_id = postID
                        };
                        db.PostsGeneras.Add(postGen);
                    }
                }
                string message = "0";
                if (updated < 0)
                {
                    post.approved = false;
                    post.updated_at = DateTime.Now;
                    message = "post updated successfuly, it has been sent to admin for review and approval";
                }
                db.Entry(post).State = EntityState.Modified;
                if (await db.SaveChangesAsync() > 0)
                    return message;
                else
                    return message;
            }
        }
        static public async Task<bool> UpdateUser(string token, string name, string email, string mobile, string password, string image)
        {
            try
            {
                int id = await Helpers.GetUserIDByToken(token);
                using (book_exchangeEntities db = new book_exchangeEntities())
                {
                    User user = await db.Users.FindAsync(id);
                    if (!string.IsNullOrEmpty(name))
                        user.name = name;
                    if (!string.IsNullOrEmpty(email))
                        user.email = email;
                    if (!string.IsNullOrEmpty(mobile))
                        user.mobile = mobile;
                    if (!string.IsNullOrEmpty(password))
                        user.password = Helpers.GetMD5Hash(password);
                    if (!string.IsNullOrEmpty(image))
                        user.image = image;
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
    }
}