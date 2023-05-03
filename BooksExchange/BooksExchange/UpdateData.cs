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
    }
}