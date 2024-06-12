package com.example.bookshop.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Tokens, String> {
    @Query(value = """
            select t from Tokens t inner join User u\s
            on t.user.id = u.id\s
            where u.id = :id and (t.expired = false or t.revoked = false)\s
            """)
    List<Tokens> findAllValidTokenByUser(Long id);

    Optional<Tokens> findByToken(String token);
}
