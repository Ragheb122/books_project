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
    
    public partial class GiftRequest
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public System.DateTime created_at { get; set; }
        public System.DateTime updated_at { get; set; }
        public bool sent { get; set; }
        public int requested { get; set; }
    
        public virtual User User { get; set; }
    }
}