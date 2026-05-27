package de.tsvoberpframmern.sticker.repository;

import de.tsvoberpframmern.sticker.model.StickerEntry;
import de.tsvoberpframmern.sticker.model.StickerEntry.StickerType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StickerEntryRepository extends JpaRepository<StickerEntry, Long> {
    List<StickerEntry> findByUserIdAndType(Long userId, StickerType type);
    void deleteByUserIdAndType(Long userId, StickerType type);
}
