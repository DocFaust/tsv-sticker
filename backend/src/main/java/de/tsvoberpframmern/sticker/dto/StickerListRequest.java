package de.tsvoberpframmern.sticker.dto;

import java.util.List;

public record StickerListRequest(
    List<Integer> doubles,
    List<Integer> needed
) {}
