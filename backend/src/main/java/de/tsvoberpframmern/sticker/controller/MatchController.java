package de.tsvoberpframmern.sticker.controller;

import de.tsvoberpframmern.sticker.dto.MatchResponse;
import de.tsvoberpframmern.sticker.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MatchResponse>> findMatches(@PathVariable Long userId) {
        return ResponseEntity.ok(matchService.findMatches(userId));
    }
}
