using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


namespace api.TokenHandler
{
   public class TokenHandler
   {
      public static Token CreateToken(IConfiguration configuration, string role)
      {
         Token token = new();
         SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Token:SecurityKey"]));
         
         SigningCredentials credentials = new SigningCredentials(securityKey,
         SecurityAlgorithms.HmacSha256);

         token.ExpirationDate = DateTime.Now.AddMinutes(Convert.ToInt16(configuration["Token:Expiration"]));

         JwtSecurityToken jwtSecurityToken = new(
            issuer: configuration["Token:Issuer"],
            audience: configuration["Token:Audience"],
            expires: token.ExpirationDate,
            notBefore: DateTime.Now,
            signingCredentials: credentials,
            claims: new[] {
               new Claim(ClaimTypes.Role, role)
            }
         );
         JwtSecurityTokenHandler tokenHandler = new ();
         token.AccessToken = tokenHandler.WriteToken(jwtSecurityToken);
         return token;
      }
   }
}