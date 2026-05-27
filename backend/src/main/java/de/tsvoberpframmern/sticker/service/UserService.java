package de.tsvoberpframmern.sticker.service;

import de.tsvoberpframmern.sticker.dto.LoginRequest;
import de.tsvoberpframmern.sticker.dto.RegisterRequest;
import de.tsvoberpframmern.sticker.dto.StickerListRequest;
import de.tsvoberpframmern.sticker.dto.UserResponse;
import de.tsvoberpframmern.sticker.model.StickerEntry;
import de.tsvoberpframmern.sticker.model.StickerEntry.StickerType;
import de.tsvoberpframmern.sticker.model.User;
import de.tsvoberpframmern.sticker.repository.StickerEntryRepository;
import de.tsvoberpframmern.sticker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final StickerEntryRepository stickerEntryRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, StickerEntryRepository stickerEntryRepository) {
        this.userRepository = userRepository;
        this.stickerEntryRepository = stickerEntryRepository;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByNickname(request.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname bereits vergeben.");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail bereits registriert.");
        }
        String hash = passwordEncoder.encode(request.password());
        User user = userRepository.save(new User(request.nickname(), request.email(), hash));
        return UserResponse.from(user);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByNickname(request.nickname())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nickname oder Passwort falsch."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nickname oder Passwort falsch.");
        }

        return UserResponse.from(userRepository.findByIdWithEntries(user.getId()).orElse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        User user = userRepository.findByIdWithEntries(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Benutzer nicht gefunden."));
        return UserResponse.from(user);
    }

    public UserResponse updateStickers(Long userId, StickerListRequest request) {
        User user = userRepository.findByIdWithEntries(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Benutzer nicht gefunden."));

        stickerEntryRepository.deleteByUserIdAndType(userId, StickerType.DOUBLE);
        stickerEntryRepository.deleteByUserIdAndType(userId, StickerType.NEEDED);

        if (request.doubles() != null) {
            request.doubles().stream().distinct().forEach(num ->
                stickerEntryRepository.save(new StickerEntry(user, num, StickerType.DOUBLE)));
        }
        if (request.needed() != null) {
            request.needed().stream().distinct().forEach(num ->
                stickerEntryRepository.save(new StickerEntry(user, num, StickerType.NEEDED)));
        }

        return UserResponse.from(userRepository.findByIdWithEntries(userId).orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(u -> userRepository.findByIdWithEntries(u.getId()).orElse(u))
            .map(UserResponse::from)
            .toList();
    }
}
