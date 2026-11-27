# Campus Club Finder — Walkthrough

Screenshot placeholders below must be replaced with actual browser screenshots before submission. Save them in `docs/screenshots/`.

| Step | Action and expected result | Screenshot to capture |
|---|---|---|
| 1 | Open `/` in a fresh browser session. Welcome hero and Explore Clubs CTA appear. | home.png |
| 2 | Click Explore Clubs. Five cards appear in grid view, sorted A–Z. | clubs-grid.png |
| 3 | Select Name Z-A. Cards appear in reverse alphabetical order. | clubs-desc.png |
| 4 | Click List View. Cards stack vertically. | clubs-list.png |
| 5 | Click View Details. Club image, full description, two events and Join Club button appear. | club-detail.png |
| 6 | Click Join Club. Confirmation replaces the button. | joined.png |
| 7 | Refresh. Confirmation remains because membership is stored in localStorage. | persistence.png |
| 8 | Click About. Purpose and tech stack appear. | about.png |
| 9 | Open `/invalid-page`. Friendly 404 and Back to Home appear. | not-found.png |
| 10 | Use browser responsive mode to test mobile and tablet layouts. | mobile.png, tablet.png |

## Implementation
The data file exports five club objects. The Clubs page uses useState for sorting and view selection, passes the club and view as props to ClubCard, and sorts a copy of the array. React Router selects pages and resolves the clubId parameter. ClubDetail stores joined club IDs in localStorage under `campus-joined-clubs` and initializes state from that value. Tailwind utility classes provide responsive layouts.

## Screenshots

### home
![home](docs/screenshots/home.png)

### clubs-grid
![clubs-grid](docs/screenshots/clubs-grid.png)

### clubs-desc
![clubs-desc](docs/screenshots/clubs-desc.png)

### clubs-list
![clubs-list](docs/screenshots/clubs-list.png)

### club-detail
![club-detail](docs/screenshots/club-detail.png)

### joined
![joined](docs/screenshots/joined.png)

### persistence
![persistence](docs/screenshots/persistence.png)

### about
![about](docs/screenshots/about.png)

### not-found
![not-found](docs/screenshots/not-found.png)

### mobile
![mobile](docs/screenshots/mobile.png)

### tablet
![tablet](docs/screenshots/tablet.png)
