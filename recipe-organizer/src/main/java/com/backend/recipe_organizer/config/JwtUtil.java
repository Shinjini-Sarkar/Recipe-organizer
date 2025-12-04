// package com.backend.recipe_organizer.config;
// import io.jsonwebtoken.security.Keys;
// import java.security.Key;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import java.util.Date;

// import org.springframework.stereotype.Component;
// @Component
// public class JwtUtil {
//     private final Key key=Keys.secretKeyFor(SignatureAlgorithm.HS256);

//     public String generateToken(String email)
//     {
//         return Jwts.builder()
//         .setSubject(email)
//         .setIssuedAt(new Date())
//         .setExpiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
//         .signWith(key)
//         .compact();
//     }

//     public String extractEmail(String token)
//     {
//         return Jwts.parserBuilder()
//                 .setSigningKey(key)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject();
//     }

//     public boolean isValid(String token)
//     {
//         try{
//             extractEmail(token);
//             return true;
//         }
//         catch(Exception e)
//         {
//             return false;
//         }
//     }
// }

package com.backend.recipe_organizer.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000)) // 1 day
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isValid(String token) {
        try {
            extractEmail(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
