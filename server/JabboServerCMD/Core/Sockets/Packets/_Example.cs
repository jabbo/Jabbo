/*
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

namespace JabboServerCMD
{
    [JsonObject(MemberSerialization.OptOut)]
    public class Person
    {
            Person p = new Person();

            p.Name = "Apple";
            p.Expiry = new DateTime(2008, 12, 28);
            p.Price = 3.99M;
            p.Sizes = new string[] { "Small", "Medium", "Large" };

            string output = JsonConvert.SerializeObject(p);
            Person deserializedProduct = (Person)JsonConvert.DeserializeObject(output, typeof(Person));
    }
}
*/
