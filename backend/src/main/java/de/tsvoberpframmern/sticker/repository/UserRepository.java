package de.tsvoberpframmern.sticker.repository;

import de.tsvoberpframmern.sticker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNickname(String nickname);
    Optional<User> findByEmail(String email);
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.stickerEntries WHERE u.id = :id")
    Optional<User> findByIdWithEntries(Long id);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.stickerEntries WHERE u.id <> :excludeId")
    List<User> findAllWithEntriesExcept(Long excludeId);
}
