
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------


namespace BooksExchange.Models
{

using System;
    using System.Collections.Generic;
    
public partial class recommendtion
{

    public int id { get; set; }

    public string title { get; set; }

    public string description { get; set; }

    public string url { get; set; }

    public string image { get; set; }

    public int user_id { get; set; }

    public Nullable<bool> is_found { get; set; }

    public int relevantPost { get; set; }

    public virtual User User { get; set; }

}

}
