package de.tsvoberpframmern.sticker.service;

import de.tsvoberpframmern.sticker.dto.MatchResponse;
import de.tsvoberpframmern.sticker.dto.MatchResponse.MatchQuality;
import de.tsvoberpframmern.sticker.model.StickerEntry.StickerType;
import de.tsvoberpframmern.sticker.model.User;
import de.tsvoberpframmern.sticker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MatchService {

    private final UserRepository userRepository;

    public MatchService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<MatchResponse> findMatches(Long userId) {
        User me = userRepository.findByIdWithEntries(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Benutzer nicht gefunden."));

        Set<Integer> myDoubles = extractNumbers(me, StickerType.DOUBLE);
        Set<Integer> myNeeded  = extractNumbers(me, StickerType.NEEDED);

        List<User> others = userRepository.findAllWithEntriesExcept(userId);

        List<MatchResponse> matches = new ArrayList<>();

        for (User other : others) {
            Set<Integer> theirDoubles = extractNumbers(other, StickerType.DOUBLE);
            Set<Integer> theirNeeded  = extractNumbers(other, StickerType.NEEDED);

            // Was ich dem anderen geben kann (meine Doppelten, die er braucht)
            List<Integer> iCanGive = intersection(myDoubles, theirNeeded);
            // Was ich von ihm bekomme (seine Doppelten, die ich brauche)
            List<Integer> iNeedFrom = intersection(theirDoubles, myNeeded);

            if (iCanGive.isEmpty() && iNeedFrom.isEmpty()) continue;

            MatchQuality quality = (!iCanGive.isEmpty() && !iNeedFrom.isEmpty())
                ? MatchQuality.MUTUAL
                : MatchQuality.ONE_SIDED;

            matches.add(new MatchResponse(
                other.getId(),
                other.getNickname(),
                other.getEmail(),
                iCanGive,
                iNeedFrom,
                quality
            ));
        }

        // Gegenseitige Matches zuerst, dann nach Anzahl der Tauschsticker sortieren
        matches.sort(Comparator
            .comparing((MatchResponse m) -> m.quality() == MatchQuality.MUTUAL ? 0 : 1)
            .thenComparing(m -> -(m.iCanGive().size() + m.iNeedFrom().size()))
        );

        return matches;
    }

    private Set<Integer> extractNumbers(User user, StickerType type) {
        return user.getStickerEntries().stream()
            .filter(e -> e.getType() == type)
            .map(e -> e.getStickerNumber())
            .collect(Collectors.toSet());
    }

    private List<Integer> intersection(Set<Integer> a, Set<Integer> b) {
        return a.stream().filter(b::contains).sorted().toList();
    }
}
