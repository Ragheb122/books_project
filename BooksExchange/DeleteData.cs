using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity;
using BooksExchange.Models;

namespace BooksExchange
{
    // for admin's panel
    public class DeleteData
    {
        static public async Task<bool> removePost(string ids, string token)
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
                                Post post = await db.Posts.FindAsync(id);
                                if (post != null)
                                {
                                    if (!await Helpers.PostOwner(token, id.Value) && token != "ads")
                                        return false;
                                    List<favBook> fav_books = await db.favBooks.Where(o => o.book_id == id).ToListAsync();
                                    foreach (favBook item in fav_books)
                                    {
                                        if (item != null)
                                        {
                                            db.Entry(item).State = EntityState.Deleted;
                                        }
                                    }
                                    List<PostsGenera> gen = await db.PostsGeneras.Where(o => o.post_id == id).ToListAsync();
                                    foreach (PostsGenera item in gen)
                                    {
                                        if (item != null)
                                        {
                                            db.Entry(item).State = EntityState.Deleted;
                                        }
                                    }
                                    List<comment> comms = await db.comments.Where(o => o.post_id == id).ToListAsync();
                                    foreach (comment item in comms)
                                    {
                                        if (item != null)
                                        {
                                            db.Entry(item).State = EntityState.Deleted;
                                        }
                                    }
                                    db.Entry(post).State = EntityState.Deleted;
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

        static public async Task<bool> RemoveCategory(string ids)
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
                                Genera gen = await db.Generas.FindAsync(id);
                                if(gen != null)
                                    gen.deleted = true;
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