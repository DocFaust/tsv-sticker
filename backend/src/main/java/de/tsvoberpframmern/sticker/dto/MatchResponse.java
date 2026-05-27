package de.tsvoberpframmern.sticker.dto;

import java.util.List;

public record MatchResponse(
    Long partnerId,
    String partnerNickname,
    String partnerEmail,
    List<Integer> iCanGive,      // Nummern die ich doppelt habe und der Partner braucht
    List<Integer> iNeedFrom,     // Nummern die ich brauche und der Partner doppelt hat
    MatchQuality quality
) {
    public enum MatchQuality {
        MUTUAL,      // beide profitieren
        ONE_SIDED    // nur eine Seite profitiert
    }
}
