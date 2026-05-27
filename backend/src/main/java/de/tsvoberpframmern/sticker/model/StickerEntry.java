package de.tsvoberpframmern.sticker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sticker_entries",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "sticker_number", "type"}))
public class StickerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "sticker_number", nullable = false)
    private Integer stickerNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StickerType type;

    public enum StickerType {
        DOUBLE,  // doppelt vorhanden → zum Tauschen
        NEEDED   // wird noch gesucht
    }

    public StickerEntry() {}

    public StickerEntry(User user, Integer stickerNumber, StickerType type) {
        this.user = user;
        this.stickerNumber = stickerNumber;
        this.type = type;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getStickerNumber() { return stickerNumber; }
    public void setStickerNumber(Integer stickerNumber) { this.stickerNumber = stickerNumber; }
    public StickerType getType() { return type; }
    public void setType(StickerType type) { this.type = type; }
}
