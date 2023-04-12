using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    public class DeleteData
    {
        static public async Task<bool> removePost(int id)
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
                        db.Entry(post).State = EntityState.Deleted;
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