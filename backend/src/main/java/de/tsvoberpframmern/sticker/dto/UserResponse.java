package de.tsvoberpframmern.sticker.dto;

import de.tsvoberpframmern.sticker.model.User;
import java.util.List;

public record UserResponse(
    Long id,
    String nickname,
    String email,
    List<Integer> doubles,
    List<Integer> needed
) {
    public static UserResponse from(User user) {
        List<Integer> doubles = user.getStickerEntries().stream()
            .filter(e -> e.getType() == de.tsvoberpframmern.sticker.model.StickerEntry.StickerType.DOUBLE)
            .map(e -> e.getStickerNumber())
            .sorted()
            .toList();
        List<Integer> needed = user.getStickerEntries().stream()
            .filter(e -> e.getType() == de.tsvoberpframmern.sticker.model.StickerEntry.StickerType.NEEDED)
            .map(e -> e.getStickerNumber())
            .sorted()
            .toList();
        return new UserResponse(user.getId(), user.getNickname(), user.getEmail(), doubles, needed);
    }
}
