
using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using api.TokenHandler;
using api.Models.Requests;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using Microsoft.Data.SqlClient;

namespace api.Controllers
{
   [ApiController]
   [Route("api/[controller]")]
   public class DocumentController : ControllerBase
   {
      private readonly ILogger<DocumentController> _logger;
      private readonly ApplicationDbContext _context;
      private readonly IConfiguration _configuration;

      public DocumentController(ILogger<DocumentController> logger, ApplicationDbContext context,IConfiguration configuration)
      {
         _logger = logger;
         _context = context;
         _configuration = configuration;
      }

      [HttpGet("protect")]
      public IActionResult Protect()
      {
         // Authorize yok çünkü JWT olmadığı senaryolardada kullandım.
         // token yoksa 401 dönder
         // token varsa rolünü dönder ve buna göre yönlendirme yap
         var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
         if(token == "undefined") return Unauthorized();
         var handler = new JwtSecurityTokenHandler();
         var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
         var roleClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value; // role değerini al
         return Ok(roleClaim);
      }


      [HttpPost("login")]
      public async Task<ActionResult<Users>> Login([FromBody] LoginRequests loginRequest)
      {
         if(loginRequest.userName == "admin"){ // client tarafından gelen istek, kullanıcı öner değilde admin ile giriş ise =>
            try{
               var adminUser = await _context.Users.FirstOrDefaultAsync(user => user.UserName == "admin"); // "admin" veritabanında var mı?
               if(adminUser == null) return NotFound(); // eğer admin yoksa, 404
               // adminUser'in veritabanındaki hashlenmiş şifresi ile client tarafından gelen şifreyi karşılaştır.
               var isPasswordCorret = BCrypt.Net.BCrypt.Verify(loginRequest.password, adminUser.HashedPassword);
               if(!isPasswordCorret) return NotFound(); // yanlış ise 404

               // Tutuyor. JWT oluştur.Admin rolü ver.
               Token token = TokenHandler.TokenHandler.CreateToken(_configuration, "admin");
               var cookieOptions = new CookieOptions{
                  Expires = token.ExpirationDate,
                  HttpOnly = false, // React tarafında jwtyi alabilmek için false
                  Secure = false,
                  IsEssential = true,
                  SameSite = SameSiteMode.Lax
               };
               // Response.Cookies.Append("jwt",token.AccessToken.ToString(),cookieOptions);
               HttpContext.Response.Cookies.Append("Token",token.AccessToken,cookieOptions);
               return Ok("admin");
            }
            catch (Exception ex){
               Console.WriteLine(ex.Message);
               throw;
            }
         }else{ // client tarafından gelen istek, admin değil.
            // JWT'ye member ver, login yap.
            if(loginRequest.userName != "exampleuser" || loginRequest.password != "123") return BadRequest();

            Token token = TokenHandler.TokenHandler.CreateToken(_configuration, "member");
            var cookieOptions = new CookieOptions
            {
               Expires = token.ExpirationDate,
               HttpOnly = false,
               Secure = false,
               IsEssential = true,
               SameSite = SameSiteMode.Lax
            };
            // Response.Cookies.Append("jwt",token.AccessToken.ToString(),cookieOptions);
            HttpContext.Response.Cookies.Append("Token", token.AccessToken, cookieOptions);
            return Ok("member");
         }
      }


      [HttpPost("getdocuments")]
      [Authorize]
      public async Task<IActionResult> GetDocuments([FromBody] DocumentListRequest documentListRequest)
      {
         // Listeleme için kullanıcıdan alınan başlangıç ve bitiş tarihleri
         var startYear = documentListRequest.startYear;
         var endYear = documentListRequest.endYear;
         try{
            List<Document> documents = new List<Document>();
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using(SqlConnection connection = new SqlConnection(connectionString)){
               connection.Open();
               string sql = @"SELECT *
                              FROM Documents
                              WHERE YEAR(DocumentCreatedDate) BETWEEN @startYear AND @endYear";

               using(SqlCommand command = new SqlCommand(sql,connection)){
                  command.Parameters.AddWithValue("@startYear",startYear);
                  command.Parameters.AddWithValue("@endYear",endYear);
                  SqlDataReader reader = command.ExecuteReader();
                  while(reader.Read()){
                     Document document = new Document
                     {
                        Id = reader.GetInt32(0),
                        DocumentDescription = reader.GetString(1),
                        DocumentCreatedDate = reader.GetDateTime(2)
                     };
                     documents.Add(document);
                  }
                  reader.Close();
               }
            }
            return Ok(documents);

         }catch(Exception ex){
            return StatusCode(500);
         }
      }

      [HttpPost("insertdocument")]
      [Authorize]
      public async Task<IActionResult> AddNewDocument([FromBody] DocumentAddRequest documentAddRequest)
      {
         try{
            // memberin /admin yoluna girememesi ve döküman ekleyememesi için önce JWTyi parse edip, rolüne göre yönlendirme yapılması
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            var roleClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value; // role değerini al
            if(roleClaim == "member") return Unauthorized(); // role member ise 401 gönder

            // role admin ve döküman ekleyecek.
            var newDocument = new Document { DocumentDescription = documentAddRequest.documentDescription, DocumentCreatedDate = DateTime.UtcNow };
            _context.Documents.Add(newDocument);
            _context.SaveChanges();
            return Ok("doküman ekleme başarılı");
         }catch(Exception ex){
            return StatusCode(500);
         }
      }
   }
}

// var newDocument = new Document { DocumentDescription = "Document description 1", DocumentCreatedDate = DateTime.UtcNow };
// _context.Documents.Add(newDocument);
// _context.SaveChanges();

