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
    
    public partial class UserRate
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public int rate { get; set; }
        public int rated_by { get; set; }
    
        public virtual User User { get; set; }
        public virtual User User1 { get; set; }
    }
}
